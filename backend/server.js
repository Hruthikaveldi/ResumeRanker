const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mammoth = require('mammoth');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.pdf', '.docx', '.doc'].includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/resumeranker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ── Schemas ───────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidateName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  resumeText: { type: String, required: true },
  jobDescription: { type: String, required: true },
  fileName: { type: String, default: null },
  fileType: { type: String, default: null },
  score: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  skills: { type: [String], default: [] },
  status: { type: String, enum: ['pending', 'analyzed', 'shortlisted', 'rejected'], default: 'pending' },
  rating: { type: Number, default: 0, min: 0, max: 5 }, // ← star rating
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Resume = mongoose.model('Resume', resumeSchema);

// ── Auth Middleware ───────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'resumeranker_secret_2024');
    req.userId = decoded.id;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

// ── Auth Routes ───────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'resumeranker_secret_2024', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'resumeranker_secret_2024', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

// ── Resume Analysis ───────────────────────────────────────────────────────────
function analyzeResume(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  const commonSkills = [
    'javascript','python','java','react','node','sql','mongodb','aws',
    'docker','kubernetes','git','agile','scrum','machine learning','data analysis',
    'communication','leadership','teamwork','problem solving','excel','typescript',
    'html','css','rest api','microservices','ci/cd','devops','cloud','azure'
  ];
  const jobWords = jobLower.split(/\W+/).filter(w => w.length > 3);
  const resumeWords = resumeLower.split(/\W+/).filter(w => w.length > 3);
  const matchedSkills = commonSkills.filter(s => jobLower.includes(s) && resumeLower.includes(s));
  const jobWordSet = new Set(jobWords);
  const matchCount = resumeWords.filter(w => jobWordSet.has(w)).length;
  const keywordScore = Math.min((matchCount / jobWords.length) * 100, 40);
  const skillScore = Math.min(matchedSkills.length * 8, 40);
  const lengthScore = Math.min((resumeText.length / 500) * 10, 20);
  const score = Math.max(10, Math.min(Math.round(keywordScore + skillScore + lengthScore), 98));
  let feedback = '';
  if (score >= 80) feedback = `Excellent match! Strong alignment with the role. Key strengths: ${matchedSkills.slice(0,3).join(', ') || 'relevant experience'}.`;
  else if (score >= 60) feedback = `Good match! Matched skills: ${matchedSkills.slice(0,3).join(', ') || 'some keywords'}. Add more JD keywords to improve.`;
  else if (score >= 40) feedback = `Average match. Add quantified achievements and tailor your summary to this role.`;
  else feedback = `Low match. Significant gap detected. Rewrite your resume targeting this specific role.`;
  return { score, feedback, skills: matchedSkills };
}

// ── Resume Routes ─────────────────────────────────────────────────────────────
app.post('/api/resumes', authMiddleware, upload.single('resumeFile'), async (req, res) => {
  try {
    const { candidateName, jobTitle, jobDescription } = req.body;
    let resumeText = req.body.resumeText || '';
    let fileName = null, fileType = null;
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      fileName = req.file.originalname;
      fileType = ext;
      if (ext === '.pdf') {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(req.file.buffer);
        resumeText = data.text;
      } else if (ext === '.docx' || ext === '.doc') {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        resumeText = result.value;
      }
    }
    if (!candidateName || !jobTitle || !jobDescription)
      return res.status(400).json({ error: 'Name, job title and description are required' });
    if (!resumeText?.trim())
      return res.status(400).json({ error: 'Please paste resume text or upload a file' });
    const { score, feedback, skills } = analyzeResume(resumeText, jobDescription);
    const status = score >= 70 ? 'shortlisted' : score >= 45 ? 'analyzed' : 'rejected';
    const resume = await Resume.create({
      userId: req.userId, candidateName, jobTitle,
      resumeText, jobDescription, fileName, fileType,
      score, feedback, skills, status, rating: 0
    });
    res.status(201).json(resume);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/resumes', authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/resumes/stats', authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId });
    const total = resumes.length;
    const avgScore = total ? Math.round(resumes.reduce((s, r) => s + r.score, 0) / total) : 0;
    const shortlisted = resumes.filter(r => r.status === 'shortlisted').length;
    const rejected = resumes.filter(r => r.status === 'rejected').length;
    res.json({ total, avgScore, shortlisted, rejected });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PATCH: Star Rating ────────────────────────────────────────────────────────
app.patch('/api/resumes/:id/rating', authMiddleware, async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 0 || rating > 5) return res.status(400).json({ error: 'Rating must be 0–5' });
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { rating },
      { new: true }
    );
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/resumes/:id', authMiddleware, async (req, res) => {
  try {
    await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
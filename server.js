const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/resumeranker')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── Schemas ──────────────────────────────────────────────────────────────────

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
  score: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  skills: { type: [String], default: [] },
  status: { type: String, enum: ['pending', 'analyzed', 'shortlisted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Resume = mongoose.model('Resume', resumeSchema);

// ── Auth Middleware ──────────────────────────────────────────────────────────

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'resumeranker_secret_2024');
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ── Auth Routes ──────────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'resumeranker_secret_2024', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'resumeranker_secret_2024', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

// ── Resume Routes ────────────────────────────────────────────────────────────

// Simple AI-style scoring logic (no external API needed)
function analyzeResume(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  // Extract keywords from job description
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'mongodb', 'aws',
    'docker', 'kubernetes', 'git', 'agile', 'scrum', 'machine learning', 'data analysis',
    'communication', 'leadership', 'teamwork', 'problem solving', 'excel', 'typescript',
    'html', 'css', 'rest api', 'microservices', 'ci/cd', 'devops', 'cloud', 'azure'
  ];

  const jobWords = jobLower.split(/\W+/).filter(w => w.length > 3);
  const resumeWords = resumeLower.split(/\W+/).filter(w => w.length > 3);

  // Find matching skills
  const matchedSkills = commonSkills.filter(skill =>
    jobLower.includes(skill) && resumeLower.includes(skill)
  );

  // Keyword overlap score
  const jobWordSet = new Set(jobWords);
  const matchCount = resumeWords.filter(w => jobWordSet.has(w)).length;
  const keywordScore = Math.min((matchCount / jobWords.length) * 100, 40);

  // Skills score
  const skillScore = Math.min(matchedSkills.length * 8, 40);

  // Length/completeness score
  const lengthScore = Math.min((resumeText.length / 500) * 10, 20);

  const total = Math.round(keywordScore + skillScore + lengthScore);
  const score = Math.max(10, Math.min(total, 98));

  let feedback = '';
  if (score >= 80) feedback = `Excellent match! Your resume aligns strongly with the job requirements. Key strengths: ${matchedSkills.slice(0, 3).join(', ') || 'relevant experience'}. The recruiter will likely be impressed.`;
  else if (score >= 60) feedback = `Good match! You meet many requirements. Consider adding more keywords from the job description. Matched skills: ${matchedSkills.slice(0, 3).join(', ') || 'some keywords'}. Strengthen your achievement statements.`;
  else if (score >= 40) feedback = `Average match. Your resume needs improvement for this role. Missing keywords from the JD. Add quantified achievements and tailor your summary to this specific role.`;
  else feedback = `Low match. Significant gap between your resume and the job requirements. Rewrite your resume to target this specific role, adding relevant skills and experiences.`;

  return { score, feedback, skills: matchedSkills };
}

app.post('/api/resumes', authMiddleware, async (req, res) => {
  try {
    const { candidateName, jobTitle, resumeText, jobDescription } = req.body;
    if (!candidateName || !jobTitle || !resumeText || !jobDescription)
      return res.status(400).json({ error: 'All fields required' });

    const { score, feedback, skills } = analyzeResume(resumeText, jobDescription);
    const status = score >= 70 ? 'shortlisted' : score >= 45 ? 'analyzed' : 'rejected';

    const resume = await Resume.create({
      userId: req.userId, candidateName, jobTitle,
      resumeText, jobDescription, score, feedback, skills, status
    });
    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/resumes', authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/resumes/stats', authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId });
    const total = resumes.length;
    const avgScore = total ? Math.round(resumes.reduce((s, r) => s + r.score, 0) / total) : 0;
    const shortlisted = resumes.filter(r => r.status === 'shortlisted').length;
    const rejected = resumes.filter(r => r.status === 'rejected').length;
    res.json({ total, avgScore, shortlisted, rejected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/resumes/:id', authMiddleware, async (req, res) => {
  try {
    await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

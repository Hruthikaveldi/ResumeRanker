import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const BEHAVIORAL_QUESTIONS = [
  "Tell me about yourself and your background.",
  "Why are you interested in this role?",
  "Describe a challenging project you worked on and how you overcame obstacles.",
  "Tell me about a time you worked in a team. What was your role?",
  "How do you handle tight deadlines and pressure?",
  "Describe a situation where you had to learn something quickly.",
  "Tell me about a time you made a mistake. How did you handle it?",
  "Where do you see yourself in 5 years?",
  "What are your greatest strengths and weaknesses?",
  "Why are you leaving your current position?",
  "Describe a time you disagreed with a teammate. How was it resolved?",
  "Tell me about a project you're most proud of.",
];

const SKILL_QUESTIONS = {
  'react': [
    "Explain the difference between state and props in React.",
    "What are React hooks? When would you use useEffect?",
    "How does the virtual DOM work in React?",
    "What is the difference between controlled and uncontrolled components?",
    "Explain React's component lifecycle.",
  ],
  'javascript': [
    "What is the difference between let, const, and var?",
    "Explain closures in JavaScript with an example.",
    "What is event bubbling and event capturing?",
    "Explain async/await and how it differs from Promises.",
    "What is the difference between == and ===?",
  ],
  'python': [
    "What is the difference between a list and a tuple in Python?",
    "Explain Python's GIL (Global Interpreter Lock).",
    "What are decorators in Python?",
    "How does memory management work in Python?",
    "Explain list comprehensions with an example.",
  ],
  'node': [
    "What is the event loop in Node.js?",
    "How does Node.js handle asynchronous operations?",
    "What is the difference between require() and import in Node.js?",
    "Explain middleware in Express.js.",
    "What are streams in Node.js and when would you use them?",
  ],
  'sql': [
    "What is the difference between INNER JOIN and LEFT JOIN?",
    "Explain database normalization and its forms.",
    "What is an index and how does it improve query performance?",
    "What is the difference between WHERE and HAVING?",
    "Explain transactions and ACID properties.",
  ],
  'mongodb': [
    "What is the difference between MongoDB and a relational database?",
    "Explain aggregation pipelines in MongoDB.",
    "What is sharding in MongoDB?",
    "How does indexing work in MongoDB?",
    "What is the difference between find() and aggregate()?",
  ],
  'machine learning': [
    "What is the difference between supervised and unsupervised learning?",
    "Explain overfitting and how to prevent it.",
    "What is cross-validation and why is it important?",
    "Explain the bias-variance tradeoff.",
    "What is the difference between classification and regression?",
  ],
  'docker': [
    "What is the difference between a Docker image and a container?",
    "Explain Docker Compose and when you'd use it.",
    "What are Docker volumes and why are they important?",
    "How does Docker networking work?",
    "What is a Dockerfile and what are its key instructions?",
  ],
  'aws': [
    "What is the difference between EC2 and Lambda?",
    "Explain S3 storage classes.",
    "What is an IAM role and how does it differ from an IAM user?",
    "What is auto-scaling and when would you use it?",
    "Explain the difference between RDS and DynamoDB.",
  ],
  'agile': [
    "What is the difference between Scrum and Kanban?",
    "Explain the role of a Scrum Master.",
    "What happens during a Sprint retrospective?",
    "How do you estimate user story points?",
    "What is the definition of done in Agile?",
  ],
};

const ROLE_QUESTIONS = {
  'software engineer': [
    "What is Big O notation? Give examples of O(n) and O(n²) algorithms.",
    "Explain the difference between a stack and a queue.",
    "What is recursion? When would you use it vs iteration?",
    "Explain the SOLID principles.",
  ],
  'data scientist': [
    "How do you handle missing data in a dataset?",
    "Explain the difference between precision and recall.",
    "What is A/B testing and when would you use it?",
    "How do you deal with imbalanced datasets?",
  ],
  'devops': [
    "What is Infrastructure as Code (IaC)?",
    "Explain the concept of blue-green deployment.",
    "How do you monitor a production system?",
    "What is a load balancer and why is it important?",
  ],
  'product manager': [
    "How do you prioritize features in a product backlog?",
    "Describe your product development process from idea to launch.",
    "How do you measure product success?",
    "How do you handle conflicting stakeholder requirements?",
  ],
};

function generateQuestions(resumeText, jobDescription) {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  const combined = resumeLower + ' ' + jobLower;

  const questions = {
    behavioral: [],
    technical: [],
    roleSpecific: [],
  };

  // Pick 4 behavioral questions
  const shuffled = [...BEHAVIORAL_QUESTIONS].sort(() => 0.5 - Math.random());
  questions.behavioral = shuffled.slice(0, 4);

  // Pick technical questions based on detected skills
  const techPool = [];
  Object.entries(SKILL_QUESTIONS).forEach(([skill, qs]) => {
    if (combined.includes(skill)) {
      const picked = qs.slice(0, 2);
      techPool.push(...picked.map(q => ({ q, skill })));
    }
  });
  questions.technical = techPool.slice(0, 6);

  // Role-specific
  Object.entries(ROLE_QUESTIONS).forEach(([role, qs]) => {
    if (combined.includes(role) || (role === 'software engineer' && (combined.includes('developer') || combined.includes('engineer')))) {
      questions.roleSpecific.push(...qs.slice(0, 2).map(q => ({ q, role })));
    }
  });

  // Fallback if nothing detected
  if (questions.technical.length === 0) {
    questions.technical = [
      { q: "Describe your technical stack and tools you're most comfortable with.", skill: 'general' },
      { q: "How do you approach debugging a complex issue?", skill: 'general' },
      { q: "How do you stay up-to-date with new technologies?", skill: 'general' },
    ];
  }

  return questions;
}

export default function MockInterview() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState(null);
  const [revealed, setRevealed] = useState({});
  const [answers, setAnswers] = useState({});

  const handleGenerate = () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    const q = generateQuestions(resumeText, jobDescription);
    setQuestions(q);
    setRevealed({});
    setAnswers({});
  };

  const toggleReveal = (key) => setRevealed(prev => ({ ...prev, [key]: !prev[key] }));

  const totalQ = questions
    ? questions.behavioral.length + questions.technical.length + questions.roleSpecific.length
    : 0;

  const QuestionCard = ({ question, index, category, skill }) => {
    const key = `${category}-${index}`;
    return (
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '18px 20px',
        transition: 'border-color 0.2s'
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: category === 'behavioral' ? 'rgba(16,185,129,0.15)' : category === 'technical' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)',
            color: category === 'behavioral' ? '#10b981' : category === 'technical' ? 'var(--primary-light)' : '#f59e0b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700
          }}>
            {index + 1}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', lineHeight: 1.6, marginBottom: 8 }}>
              {question}
            </div>
            {skill && skill !== 'general' && (
              <span className="skill-tag" style={{ fontSize: 11, marginBottom: 8, display: 'inline-block' }}>
                {skill}
              </span>
            )}
            {/* Answer box */}
            <button
              onClick={() => toggleReveal(key)}
              style={{
                background: 'none', border: '1px dashed var(--border)',
                borderRadius: 8, padding: '6px 14px', fontSize: 12,
                color: 'var(--text-muted)', cursor: 'pointer', marginTop: 8,
                fontFamily: 'var(--font-body)', transition: 'all 0.15s'
              }}
            >
              {revealed[key] ? '▲ Hide answer space' : '▼ Write your answer'}
            </button>
            {revealed[key] && (
              <textarea
                className="form-textarea"
                style={{ minHeight: 90, fontSize: 13, marginTop: 10 }}
                placeholder="Type your answer here to practice..."
                value={answers[key] || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [key]: e.target.value }))}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">🎤 Mock Interview Generator</h1>
        <p className="page-subtitle">Get personalized interview questions based on your resume and the job description.</p>

        {/* Input */}
        {!questions && (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '28px 32px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>
                <label className="form-label">📄 Your Resume</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: 260, fontSize: 13 }}
                  placeholder="Paste your full resume here..."
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">💼 Job Description</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: 260, fontSize: 13 }}
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!resumeText.trim() || !jobDescription.trim()}
              className="btn-submit"
              style={{ padding: '14px 32px', fontSize: 15 }}
            >
              🎤 Generate Interview Questions
            </button>
          </div>
        )}

        {/* Questions */}
        {questions && (
          <>
            {/* Header */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px 28px', marginBottom: 24,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
            }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  🎤 Your Interview Prep — {totalQ} Questions
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                  Click "Write your answer" under each question to practice your responses
                </div>
              </div>
              <button onClick={() => setQuestions(null)} className="btn-secondary" style={{ fontSize: 13 }}>
                ← Generate New
              </button>
            </div>

            {/* Behavioral */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Behavioral Questions</span>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>— {questions.behavioral.length} questions</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {questions.behavioral.map((q, i) => (
                  <QuestionCard key={i} question={q} index={i} category="behavioral" />
                ))}
              </div>
            </div>

            {/* Technical */}
            {questions.technical.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Technical Questions</span>
                  <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>— based on your skills</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {questions.technical.map(({ q, skill }, i) => (
                    <QuestionCard key={i} question={q} index={i} category="technical" skill={skill} />
                  ))}
                </div>
              </div>
            )}

            {/* Role-specific */}
            {questions.roleSpecific.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Role-Specific Questions</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {questions.roleSpecific.map(({ q, role }, i) => (
                    <QuestionCard key={i} question={q} index={i} category="role" skill={role} />
                  ))}
                </div>
              </div>
            )}

            <div style={{
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 'var(--radius)', padding: '16px 20px', fontSize: 13, color: 'var(--text-muted)'
            }}>
              💡 <strong style={{ color: 'var(--text)' }}>Tip:</strong> Use the STAR method for behavioral questions — <strong style={{ color: 'var(--text)' }}>S</strong>ituation, <strong style={{ color: 'var(--text)' }}>T</strong>ask, <strong style={{ color: 'var(--text)' }}>A</strong>ction, <strong style={{ color: 'var(--text)' }}>R</strong>esult.
            </div>
          </>
        )}
      </main>
    </div>
  );
}
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Analyze() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    candidateName: '', jobTitle: '', resumeText: '', jobDescription: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true); setResult(null);
    try {
      const res = await axios.post('/api/resumes', form);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const getScoreColor = (score) =>
    score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';

  const getScoreLabel = (score) =>
    score >= 70 ? 'Strong Match' : score >= 45 ? 'Average Match' : 'Weak Match';

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">📊</div>
          <span className="sidebar-logo-text">ResumeRanker</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link">
            <span className="sidebar-link-icon">🏠</span> Dashboard
          </Link>
          <span className="sidebar-link active">
            <span className="sidebar-link-icon">✨</span> Analyze Resume
          </span>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-email">{user?.email}</div>
          <button className="sidebar-logout" onClick={handleLogout}>🚪 Sign out</button>
        </div>
      </aside>

      <main className="main-content">
        <h1 className="page-title">Analyze Resume</h1>
        <p className="page-subtitle">Paste a resume and job description to get an instant match score.</p>

        {error && <div className="error-msg" style={{ marginBottom: 24 }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="analyze-grid">
            <div>
              <div className="form-card">
                <div className="form-card-title">👤 Candidate Info</div>
                <div className="form-group">
                  <label className="form-label">Candidate Name</label>
                  <input
                    className="form-input" name="candidateName"
                    placeholder="e.g. Priya Sharma"
                    value={form.candidateName} onChange={handleChange} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title Applying For</label>
                  <input
                    className="form-input" name="jobTitle"
                    placeholder="e.g. Senior React Developer"
                    value={form.jobTitle} onChange={handleChange} required
                  />
                </div>
              </div>

              <div className="form-card" style={{ marginTop: 20 }}>
                <div className="form-card-title">📄 Resume Text</div>
                <div className="form-group">
                  <label className="form-label">Paste the resume content</label>
                  <textarea
                    className="form-textarea" name="resumeText"
                    style={{ minHeight: 220 }}
                    placeholder="Paste the candidate's full resume here...&#10;&#10;Example:&#10;John Doe | john@email.com&#10;Skills: React, Node.js, MongoDB...&#10;Experience: 3 years at TechCorp..."
                    value={form.resumeText} onChange={handleChange} required
                  />
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-title">💼 Job Description</div>
              <div className="form-group">
                <label className="form-label">Paste the full job description</label>
                <textarea
                  className="form-textarea" name="jobDescription"
                  style={{ minHeight: 380 }}
                  placeholder="Paste the job description here...&#10;&#10;Example:&#10;We are looking for a Senior React Developer with:&#10;- 3+ years React experience&#10;- Knowledge of Node.js and MongoDB&#10;- Strong communication skills..."
                  value={form.jobDescription} onChange={handleChange} required
                />
              </div>
            </div>
          </div>

          <div className="submit-row">
            <Link to="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
            </button>
          </div>
        </form>

        {result && (
          <div className="result-card">
            <div className="result-header">
              <div>
                <div className="result-title">📊 Analysis Result — {result.candidateName}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
                  Role: {result.jobTitle} &nbsp;|&nbsp;
                  Status: <span className={`status-badge status-${result.status}`}>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </span>
                </div>
              </div>
              <div
                className="score-circle"
                style={{
                  borderColor: getScoreColor(result.score),
                  color: getScoreColor(result.score)
                }}
              >
                <span className="score-num">{result.score}</span>
                <span className="score-label">/ 100</span>
              </div>
            </div>

            <div className="score-bar-wrap">
              <div className="score-bar-label">
                <span>Match Score</span>
                <span style={{ color: getScoreColor(result.score), fontWeight: 600 }}>
                  {getScoreLabel(result.score)}
                </span>
              </div>
              <div className="score-bar-track">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${result.score}%`,
                    background: `linear-gradient(90deg, ${getScoreColor(result.score)}, ${getScoreColor(result.score)}aa)`
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>
                💬 Feedback
              </div>
              <div className="feedback-box">{result.feedback}</div>
            </div>

            {result.skills?.length > 0 && (
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 500 }}>
                  ✅ Matched Skills
                </div>
                <div className="skills-list">
                  {result.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
              <Link to="/dashboard" className="btn-secondary">View All Resumes →</Link>
              <button
                className="btn-submit"
                onClick={() => { setResult(null); setForm({ candidateName: '', jobTitle: '', resumeText: '', jobDescription: '' }); }}
              >
                Analyze Another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

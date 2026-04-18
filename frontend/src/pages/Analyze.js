import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Analyze() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [form, setForm] = useState({ candidateName: '', jobTitle: '', resumeText: '', jobDescription: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'text'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setError('Only PDF, DOC, or DOCX files are supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      return;
    }
    setError('');
    setUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e) => handleFile(e.target.files[0]);

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true); setResult(null);

    if (inputMode === 'file' && !uploadedFile) {
      setError('Please upload a PDF or DOCX file, or switch to text mode.');
      setLoading(false); return;
    }
    if (inputMode === 'text' && !form.resumeText.trim()) {
      setError('Please paste the resume text.');
      setLoading(false); return;
    }

    try {
      const formData = new FormData();
      formData.append('candidateName', form.candidateName);
      formData.append('jobTitle', form.jobTitle);
      formData.append('jobDescription', form.jobDescription);
      if (inputMode === 'file' && uploadedFile) {
        formData.append('resumeFile', uploadedFile);
      } else {
        formData.append('resumeText', form.resumeText);
      }

      const token = localStorage.getItem('token');
      const res = await axios.post('/api/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
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
        <p className="page-subtitle">Upload a PDF/DOCX file or paste resume text to get an instant match score.</p>

        {error && <div className="error-msg" style={{ marginBottom: 24 }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="analyze-grid">
            <div>
              {/* Candidate Info */}
              <div className="form-card">
                <div className="form-card-title">👤 Candidate Info</div>
                <div className="form-group">
                  <label className="form-label">Candidate Name</label>
                  <input className="form-input" name="candidateName" placeholder="e.g. Priya Sharma"
                    value={form.candidateName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title Applying For</label>
                  <input className="form-input" name="jobTitle" placeholder="e.g. Senior React Developer"
                    value={form.jobTitle} onChange={handleChange} required />
                </div>
              </div>

              {/* Resume Input — toggle between file and text */}
              <div className="form-card" style={{ marginTop: 20 }}>
                <div className="form-card-title" style={{ marginBottom: 14 }}>
                  📄 Resume Input
                </div>

                {/* Toggle */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                  <button type="button" onClick={() => setInputMode('file')}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                      background: inputMode === 'file' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'var(--bg3)',
                      color: inputMode === 'file' ? '#fff' : 'var(--text-muted)',
                    }}>
                    📁 Upload File
                  </button>
                  <button type="button" onClick={() => setInputMode('text')}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                      background: inputMode === 'text' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'var(--bg3)',
                      color: inputMode === 'text' ? '#fff' : 'var(--text-muted)',
                    }}>
                    ✏️ Paste Text
                  </button>
                </div>

                {/* File Upload Zone */}
                {inputMode === 'file' && (
                  <div>
                    {!uploadedFile ? (
                      <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: `2px dashed ${dragOver ? '#6366f1' : 'rgba(255,255,255,0.12)'}`,
                          borderRadius: 14, padding: '40px 20px', textAlign: 'center',
                          cursor: 'pointer', transition: 'all 0.2s',
                          background: dragOver ? 'rgba(99,102,241,0.08)' : 'var(--bg3)',
                        }}
                      >
                        <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                          Drag & drop your resume here
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                          or click to browse files
                        </div>
                        <div style={{
                          display: 'inline-block', padding: '7px 18px', borderRadius: 8,
                          background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                          fontSize: 12, border: '1px solid rgba(99,102,241,0.25)'
                        }}>
                          PDF, DOC, DOCX — max 10MB
                        </div>
                        <input
                          ref={fileInputRef} type="file"
                          accept=".pdf,.doc,.docx" onChange={handleFileInput}
                          style={{ display: 'none' }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '16px 18px', borderRadius: 12,
                        background: 'rgba(16,185,129,0.06)',
                        border: '1px solid rgba(16,185,129,0.2)',
                      }}>
                        <div style={{ fontSize: 32, flexShrink: 0 }}>
                          {uploadedFile.name.endsWith('.pdf') ? '📕' : '📘'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#34d399', marginBottom: 2,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {uploadedFile.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {(uploadedFile.size / 1024).toFixed(0)} KB — ready to analyze
                          </div>
                        </div>
                        <button type="button" onClick={removeFile}
                          style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)',
                            color: '#f87171', borderRadius: 8, padding: '5px 12px',
                            fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
                          Remove
                        </button>
                      </div>
                    )}
                    <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                      💡 The server will automatically extract all text from your file for analysis.
                    </div>
                  </div>
                )}

                {/* Paste Text Zone */}
                {inputMode === 'text' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Paste the resume content</label>
                    <textarea
                      className="form-textarea" name="resumeText"
                      style={{ minHeight: 200 }}
                      placeholder={`Paste the candidate's full resume here...\n\nExample:\nJohn Doe | john@email.com\nSkills: React, Node.js, MongoDB...\nExperience: 3 years at TechCorp...`}
                      value={form.resumeText} onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="form-card">
              <div className="form-card-title">💼 Job Description</div>
              <div className="form-group">
                <label className="form-label">Paste the full job description</label>
                <textarea
                  className="form-textarea" name="jobDescription"
                  style={{ minHeight: 380 }}
                  placeholder={`Paste the job description here...\n\nExample:\nWe are looking for a Senior React Developer with:\n- 3+ years React experience\n- Knowledge of Node.js and MongoDB\n- Strong communication skills...`}
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
                <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span>Role: {result.jobTitle}</span>
                  {result.fileName && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: 'rgba(99,102,241,0.1)', color: '#818cf8',
                      padding: '2px 10px', borderRadius: 10, fontSize: 12,
                      border: '1px solid rgba(99,102,241,0.2)' }}>
                      📎 {result.fileName}
                    </span>
                  )}
                  <span className={`status-badge status-${result.status}`}>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="score-circle"
                style={{ borderColor: getScoreColor(result.score), color: getScoreColor(result.score) }}>
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
                <div className="score-bar-fill"
                  style={{ width: `${result.score}%`,
                    background: `linear-gradient(90deg, ${getScoreColor(result.score)}, ${getScoreColor(result.score)}aa)` }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>💬 Feedback</div>
              <div className="feedback-box">{result.feedback}</div>
            </div>

            {result.skills?.length > 0 && (
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 500 }}>✅ Matched Skills</div>
                <div className="skills-list">
                  {result.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
              <Link to="/dashboard" className="btn-secondary">View All Resumes →</Link>
              <button className="btn-submit" onClick={() => {
                setResult(null);
                setForm({ candidateName: '', jobTitle: '', resumeText: '', jobDescription: '' });
                setUploadedFile(null);
              }}>
                Analyze Another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
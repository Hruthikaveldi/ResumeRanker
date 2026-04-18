import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ResumeDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        // fetch all resumes and find the one matching the id
        const res = await axios.get('/api/resumes');
        const found = res.data.find(r => r._id === id);
        if (!found) setError('Resume not found.');
        else setResume(found);
      } catch (err) {
        setError('Failed to load resume.');
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this resume?')) return;
    await axios.delete(`/api/resumes/${id}`);
    navigate('/dashboard');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const getScoreColor = (score) =>
    score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';
  const getScoreLabel = (score) =>
    score >= 70 ? 'Strong Match' : score >= 45 ? 'Average Match' : 'Weak Match';
  const getScoreClass = (score) =>
    score >= 70 ? 'score-high' : score >= 45 ? 'score-mid' : 'score-low';

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
          <Link to="/analyze" className="sidebar-link">
            <span className="sidebar-link-icon">✨</span> Analyze Resume
          </Link>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-email">{user?.email}</div>
          <button className="sidebar-logout" onClick={handleLogout}>🚪 Sign out</button>
        </div>
      </aside>

      <main className="main-content">

        {/* Back button */}
        <div style={{ marginBottom: 24 }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'var(--text-muted)', textDecoration: 'none',
              fontSize: 14, transition: 'color 0.15s'
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <p className="empty-state-text">{error}</p>
            <Link to="/dashboard" className="btn-add" style={{ display: 'inline-flex', marginTop: 16 }}>
              ← Go Back
            </Link>
          </div>
        ) : resume && (
          <>
            {/* ── Header Card ── */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '28px 32px',
              marginBottom: 20, display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 20
            }}>
              <div>
                <h1 className="page-title" style={{ marginBottom: 6 }}>
                  📋 {resume.candidateName}
                </h1>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 15 }}>
                    💼 {resume.jobTitle}
                  </span>
                  <span className={`status-badge status-${resume.status}`}>
                    {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>
                    🗓 {new Date(resume.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Score Circle */}
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                border: `4px solid ${getScoreColor(resume.score)}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 0 24px ${getScoreColor(resume.score)}33`
              }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: getScoreColor(resume.score), fontFamily: 'var(--font-display)' }}>
                  {resume.score}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/100</span>
              </div>
            </div>

            {/* ── Score Bar Card ── */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 20
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 12 }}>
                Match Score
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className={`score-badge ${getScoreClass(resume.score)}`}>
                  {resume.score >= 70 ? '🟢' : resume.score >= 45 ? '🟡' : '🔴'} {resume.score}/100
                </span>
                <span style={{ fontWeight: 600, color: getScoreColor(resume.score), fontSize: 14 }}>
                  {getScoreLabel(resume.score)}
                </span>
              </div>
              <div style={{ height: 10, borderRadius: 5, background: 'var(--bg3)' }}>
                <div style={{
                  height: '100%', borderRadius: 5,
                  width: `${resume.score}%`,
                  background: `linear-gradient(90deg, ${getScoreColor(resume.score)}, ${getScoreColor(resume.score)}99)`,
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>

            {/* ── Two column: Feedback + Skills ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

              {/* Feedback */}
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '24px 28px'
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                  💬 AI Feedback
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text)', background: 'var(--bg3)', padding: '14px 16px', borderRadius: 10 }}>
                  {resume.feedback}
                </p>
              </div>

              {/* Matched Skills */}
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '24px 28px'
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                  ✅ Matched Skills
                </div>
                {resume.skills?.length > 0 ? (
                  <div className="skills-list">
                    {resume.skills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No matched skills found.
                  </p>
                )}
              </div>
            </div>

            {/* ── Job Description ── */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 20
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                💼 Job Description
              </div>
              <pre style={{
                fontSize: 13, lineHeight: 1.8, color: 'var(--text-muted)',
                whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)',
                background: 'var(--bg3)', padding: '14px 16px', borderRadius: 10,
                maxHeight: 200, overflowY: 'auto'
              }}>
                {resume.jobDescription}
              </pre>
            </div>

            {/* ── Resume Text ── */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 28
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                📄 Resume Content
              </div>
              <pre style={{
                fontSize: 13, lineHeight: 1.8, color: 'var(--text-muted)',
                whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)',
                background: 'var(--bg3)', padding: '14px 16px', borderRadius: 10,
                maxHeight: 300, overflowY: 'auto'
              }}>
                {resume.resumeText}
              </pre>
            </div>

            {/* ── Action Buttons ── */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Link to="/dashboard" className="btn-secondary">← Back to History</Link>
              <Link to="/analyze" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                + Analyze Another
              </Link>
              <button
                onClick={handleDelete}
                style={{
                  padding: '12px 24px', borderRadius: 'var(--radius)',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'var(--font-body)'
                }}
              >
                🗑 Delete Resume
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
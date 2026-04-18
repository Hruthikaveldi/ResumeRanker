import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ── Improvement tips based on score & missing skills ──────────────────────────
function getTips(resume) {
  const tips = [];
  const resumeLower = resume.resumeText.toLowerCase();
  const jobLower = resume.jobDescription.toLowerCase();

  if (resume.score < 40) {
    tips.push('🔴 Your resume has a low match. Rewrite your summary section to directly target this job role.');
    tips.push('📝 Mirror the exact keywords from the job description throughout your resume.');
  } else if (resume.score < 70) {
    tips.push('🟡 You\'re close! Add more specific keywords from the job description to boost your score.');
    tips.push('📊 Quantify your achievements — e.g. "Increased performance by 40%" instead of vague statements.');
  } else {
    tips.push('🟢 Great match! Make sure your resume is clean, well-formatted, and error-free.');
    tips.push('✨ Tailor your cover letter to highlight your top matched skills for a stronger application.');
  }

  if (!resumeLower.includes('project')) tips.push('🛠 Add a Projects section showcasing relevant work you\'ve done.');
  if (!resumeLower.includes('certif')) tips.push('🎓 Add certifications relevant to this role to stand out.');
  if (!resumeLower.includes('achiev') && !resumeLower.includes('award')) tips.push('🏆 Include achievements or awards to show impact, not just responsibilities.');
  if (resume.resumeText.length < 800) tips.push('📄 Your resume seems short. Add more detail about your experience and responsibilities.');
  if (!resumeLower.includes('team') && jobLower.includes('team')) tips.push('🤝 The job requires teamwork skills — add examples of team collaboration to your resume.');
  if (!resumeLower.includes('lead') && jobLower.includes('lead')) tips.push('👑 The role mentions leadership — highlight any leadership experience you have.');
  if (resume.skills.length < 3) tips.push('💡 Add a dedicated Skills section listing your technical and soft skills clearly.');

  return tips.slice(0, 5); // max 5 tips
}

export default function ResumeDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingMsg, setRatingMsg] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get('/api/resumes');
        const found = res.data.find(r => r._id === id);
        if (!found) setError('Resume not found.');
        else { setResume(found); setRating(found.rating || 0); }
      } catch (err) {
        setError('Failed to load resume.');
      } finally { setLoading(false); }
    };
    fetchResume();
  }, [id]);

  const handleRating = async (star) => {
    setRatingLoading(true);
    try {
      const res = await axios.patch(`/api/resumes/${id}/rating`, { rating: star });
      setRating(res.data.rating);
      setResume(prev => ({ ...prev, rating: res.data.rating }));
      setRatingMsg('Rating saved!');
      setTimeout(() => setRatingMsg(''), 2000);
    } catch { setRatingMsg('Failed to save rating.'); }
    finally { setRatingLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this resume?')) return;
    await axios.delete(`/api/resumes/${id}`);
    navigate('/dashboard');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const getScoreColor = (s) => s >= 70 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444';
  const getScoreLabel = (s) => s >= 70 ? 'Strong Match' : s >= 45 ? 'Average Match' : 'Weak Match';
  const getScoreClass = (s) => s >= 70 ? 'score-high' : s >= 45 ? 'score-mid' : 'score-low';

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
          <Link to="/compare" className="sidebar-link">
            <span className="sidebar-link-icon">⚖️</span> Compare
          </Link>
          <Link to="/templates" className="sidebar-link">
            <span className="sidebar-link-icon">📄</span> Templates
          </Link>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-email">{user?.email}</div>
          <button className="sidebar-logout" onClick={handleLogout}>🚪 Sign out</button>
        </div>
      </aside>

      <main className="main-content">
        <div style={{ marginBottom: 24 }}>
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>
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
          </div>
        ) : resume && (
          <>
            {/* ── Header ── */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '28px 32px',
              marginBottom: 20, display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20
            }}>
              <div>
                <h1 className="page-title" style={{ marginBottom: 8 }}>📋 {resume.candidateName}</h1>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 15 }}>💼 {resume.jobTitle}</span>
                  <span className={`status-badge status-${resume.status}`}>
                    {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>
                    🗓 {new Date(resume.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* ── Star Rating ── */}
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Candidate Rating:</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={ratingLoading}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 26, padding: '0 2px',
                          color: star <= (hoverRating || rating) ? '#f59e0b' : 'var(--text-dim)',
                          transition: 'color 0.15s, transform 0.1s',
                          transform: star <= (hoverRating || rating) ? 'scale(1.15)' : 'scale(1)'
                        }}
                      >★</button>
                    ))}
                  </div>
                  {ratingMsg && (
                    <span style={{ fontSize: 12, color: '#10b981' }}>{ratingMsg}</span>
                  )}
                  {rating > 0 && !ratingMsg && (
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{rating}/5</span>
                  )}
                </div>
              </div>

              {/* Score Circle */}
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                border: `4px solid ${getScoreColor(resume.score)}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: `0 0 24px ${getScoreColor(resume.score)}33`
              }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: getScoreColor(resume.score), fontFamily: 'var(--font-display)' }}>
                  {resume.score}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/100</span>
              </div>
            </div>

            {/* ── Score Bar ── */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 20
            }}>
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
                  height: '100%', borderRadius: 5, width: `${resume.score}%`,
                  background: `linear-gradient(90deg, ${getScoreColor(resume.score)}, ${getScoreColor(resume.score)}99)`,
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>

            {/* ── Feedback + Skills row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
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
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic' }}>No matched skills found.</p>
                )}
              </div>
            </div>

            {/* ── Improvement Tips ── */}
            <div style={{
              background: 'var(--card)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 20
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                💡 Improvement Tips
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {getTips(resume).map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    background: 'var(--bg3)', borderRadius: 10, padding: '12px 16px'
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-light)', minWidth: 22, marginTop: 1 }}>
                      {i + 1}.
                    </span>
                    <span style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text)' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Job Description + Resume Text ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '24px 28px'
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                  💼 Job Description
                </div>
                <pre style={{
                  fontSize: 13, lineHeight: 1.8, color: 'var(--text-muted)',
                  whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)',
                  background: 'var(--bg3)', padding: '14px 16px', borderRadius: 10,
                  maxHeight: 220, overflowY: 'auto'
                }}>{resume.jobDescription}</pre>
              </div>

              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '24px 28px'
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                  📄 Resume Content
                </div>
                <pre style={{
                  fontSize: 13, lineHeight: 1.8, color: 'var(--text-muted)',
                  whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)',
                  background: 'var(--bg3)', padding: '14px 16px', borderRadius: 10,
                  maxHeight: 220, overflowY: 'auto'
                }}>{resume.resumeText}</pre>
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn-secondary">← Back to History</Link>
              <Link to="/compare" className="btn-secondary" style={{ textDecoration: 'none' }}>⚖️ Compare Resumes</Link>
              <Link to="/analyze" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                + Analyze Another
              </Link>
              <button onClick={handleDelete} style={{
                padding: '12px 24px', borderRadius: 'var(--radius)',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-body)'
              }}>🗑 Delete</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
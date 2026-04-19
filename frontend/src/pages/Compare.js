import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function Compare() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [leftId, setLeftId] = useState('');
  const [rightId, setRightId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/resumes')
      .then(res => setResumes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const left  = resumes.find(r => r._id === leftId);
  const right = resumes.find(r => r._id === rightId);

  const getScoreColor = (s) => s >= 70 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444';
  const getScoreClass = (s) => s >= 70 ? 'score-high' : s >= 45 ? 'score-mid' : 'score-low';
  const getScoreLabel = (s) => s >= 70 ? 'Strong Match' : s >= 45 ? 'Average Match' : 'Weak Match';

  const selectStyle = {
    width: '100%', padding: '11px 16px', borderRadius: 'var(--radius)',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: 14, outline: 'none',
    cursor: 'pointer', fontFamily: 'var(--font-body)'
  };

  // Which resume wins on a given metric
  const winner = (lVal, rVal) => {
    if (!left || !right) return null;
    if (lVal > rVal) return 'left';
    if (rVal > lVal) return 'right';
    return 'tie';
  };

  const ResumeCard = ({ resume, side }) => {
    if (!resume) return (
      <div style={{
        background: 'var(--card)', border: '2px dashed var(--border)',
        borderRadius: 'var(--radius-lg)', padding: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 400, color: 'var(--text-dim)', fontSize: 14, textAlign: 'center'
      }}>
        Select a resume to compare
      </div>
    );

    const scoreColor = getScoreColor(resume.score);
    const scoreWin = winner(
      side === 'left' ? resume.score : (right?.score ?? 0),
      side === 'left' ? (right?.score ?? 0) : resume.score
    );
    const isWinner = scoreWin === side;

    return (
      <div style={{
        background: 'var(--card)',
        border: `2px solid ${isWinner ? scoreColor : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)', padding: 24, position: 'relative',
        boxShadow: isWinner ? `0 0 20px ${scoreColor}22` : 'none'
      }}>
        {isWinner && left && right && (
          <div style={{
            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
            background: scoreColor, color: '#fff', fontSize: 12, fontWeight: 700,
            padding: '3px 14px', borderRadius: 20
          }}>🏆 WINNER</div>
        )}

        {/* Name & Job */}
        <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{resume.candidateName}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>💼 {resume.jobTitle}</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
            🗓 {new Date(resume.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            border: `4px solid ${scoreColor}`,
            display: 'inline-flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 20px ${scoreColor}33`
          }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: scoreColor, fontFamily: 'var(--font-display)' }}>
              {resume.score}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: scoreColor, fontWeight: 600 }}>
            {getScoreLabel(resume.score)}
          </div>
        </div>

        {/* Score bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ height: 8, borderRadius: 4, background: 'var(--bg3)' }}>
            <div style={{
              height: '100%', borderRadius: 4, width: `${resume.score}%`,
              background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}99)`,
              transition: 'width 1s ease'
            }} />
          </div>
        </div>

        {/* Status + Rating */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <span className={`status-badge status-${resume.status}`}>
            {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
          </span>
          {resume.rating > 0 && (
            <span style={{ fontSize: 13, color: '#f59e0b' }}>
              {'★'.repeat(resume.rating)}{'☆'.repeat(5 - resume.rating)} {resume.rating}/5
            </span>
          )}
        </div>

        {/* Matched Skills */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            ✅ Matched Skills ({resume.skills.length})
          </div>
          {resume.skills.length > 0 ? (
            <div className="skills-list">
              {resume.skills.map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text-dim)', fontStyle: 'italic' }}>No matched skills</span>
          )}
        </div>

        {/* Feedback */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            💬 Feedback
          </div>
          <p style={{
            fontSize: 13, lineHeight: 1.7, color: 'var(--text-muted)',
            background: 'var(--bg3)', padding: '12px 14px', borderRadius: 8
          }}>{resume.feedback}</p>
        </div>

        {/* View detail link */}
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Link to={`/resume/${resume._id}`} style={{
            fontSize: 13, color: 'var(--primary-light)', textDecoration: 'none'
          }}>View Full Details →</Link>
        </div>
      </div>
    );
  };

  return (
    <div className="dash-layout">
      <Sidebar />

      <main className="main-content">
        <h1 className="page-title">⚖️ Compare Resumes</h1>
        <p className="page-subtitle">Select two resumes to compare them side by side.</p>

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : resumes.length < 2 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">You need at least 2 analyzed resumes to compare.</p>
            <Link to="/analyze" className="btn-add" style={{ display: 'inline-flex', marginTop: 16 }}>
              + Analyze a Resume
            </Link>
          </div>
        ) : (
          <>
            {/* ── Selectors ── */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16,
              alignItems: 'center', marginBottom: 28,
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '20px 24px'
            }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Resume A
                </div>
                <select value={leftId} onChange={e => setLeftId(e.target.value)} style={selectStyle}>
                  <option value="">Select a resume...</option>
                  {resumes.filter(r => r._id !== rightId).map(r => (
                    <option key={r._id} value={r._id}>
                      {r.candidateName} — {r.jobTitle} ({r.score}/100)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--bg3)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: 'var(--text-muted)', flexShrink: 0
              }}>VS</div>

              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Resume B
                </div>
                <select value={rightId} onChange={e => setRightId(e.target.value)} style={selectStyle}>
                  <option value="">Select a resume...</option>
                  {resumes.filter(r => r._id !== leftId).map(r => (
                    <option key={r._id} value={r._id}>
                      {r.candidateName} — {r.jobTitle} ({r.score}/100)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Quick Stats Row (only when both selected) ── */}
            {left && right && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24
              }}>
                {[
                  { label: 'Score', lVal: left.score, rVal: right.score, format: v => `${v}/100` },
                  { label: 'Matched Skills', lVal: left.skills.length, rVal: right.skills.length, format: v => v },
                  { label: 'Rating', lVal: left.rating, rVal: right.rating, format: v => v > 0 ? `${v}/5 ⭐` : 'Not rated' },
                ].map(({ label, lVal, rVal, format }) => {
                  const w = winner(lVal, rVal);
                  return (
                    <div key={label} style={{
                      background: 'var(--card)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)', padding: '16px 20px'
                    }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                        {label}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)',
                          color: w === 'left' ? getScoreColor(lVal) : 'var(--text)'
                        }}>
                          {w === 'left' && '🏆 '}{format(lVal)}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>vs</span>
                        <span style={{
                          fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)',
                          color: w === 'right' ? getScoreColor(rVal) : 'var(--text)'
                        }}>
                          {format(rVal)}{w === 'right' && ' 🏆'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Side by Side Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <ResumeCard resume={left} side="left" />
              <ResumeCard resume={right} side="right" />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
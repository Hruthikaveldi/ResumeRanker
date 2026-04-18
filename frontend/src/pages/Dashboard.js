import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState({ total: 0, avgScore: 0, shortlisted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // ← track which row is open

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [resumesRes, statsRes] = await Promise.all([
        axios.get('/api/resumes'),
        axios.get('/api/resumes/stats')
      ]);
      setResumes(resumesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    await axios.delete(`/api/resumes/${id}`);
    if (expandedId === id) setExpandedId(null); // close if open
    fetchData();
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id); // toggle
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const getScoreClass = (score) =>
    score >= 70 ? 'score-high' : score >= 45 ? 'score-mid' : 'score-low';

  const getScoreEmoji = (score) =>
    score >= 70 ? '🟢' : score >= 45 ? '🟡' : '🔴';

  const getScoreColor = (score) =>
    score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="dash-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">📊</div>
          <span className="sidebar-logo-text">ResumeRanker</span>
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-link active">
            <span className="sidebar-link-icon">🏠</span> Dashboard
          </span>
          <Link to="/analyze" className="sidebar-link">
            <span className="sidebar-link-icon">✨</span> Analyze Resume
          </Link>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-email">{user?.email}</div>
          <button className="sidebar-logout" onClick={handleLogout}>
            🚪 Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name?.split(' ')[0]}! Here's your hiring overview.</p>

        {/* ── Stats ── */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-label">Total Resumes</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-desc">All time analyzed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-label">Avg. Score</div>
            <div className="stat-value" style={{ color: getScoreColor(stats.avgScore) }}>
              {stats.avgScore}
            </div>
            <div className="stat-desc">Match accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-label">Shortlisted</div>
            <div className="stat-value" style={{ color: '#10b981' }}>{stats.shortlisted}</div>
            <div className="stat-desc">Ready for interview</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-label">Rejected</div>
            <div className="stat-value" style={{ color: '#ef4444' }}>{stats.rejected}</div>
            <div className="stat-desc">Did not match</div>
          </div>
        </div>

        {/* ── Section Header ── */}
        <div className="section-header">
          <h2 className="section-title">Recent Resumes</h2>
          <Link to="/analyze" className="btn-add">
            <span>+</span> Analyze New Resume
          </Link>
        </div>

        {/* ── Table ── */}
        <div className="resume-table">
          {loading ? (
            <div className="empty-state">
              <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
          ) : resumes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p className="empty-state-text">No resumes analyzed yet. Start by adding your first one!</p>
              <br />
              <Link to="/analyze" className="btn-add" style={{ display: 'inline-flex' }}>
                + Analyze Your First Resume
              </Link>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job Title</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map(r => (
                  <React.Fragment key={r._id}>

                    {/* ── Normal Row ── */}
                    <tr style={{ borderBottom: expandedId === r._id ? 'none' : undefined }}>
                      <td style={{ fontWeight: 500 }}>{r.candidateName}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{r.jobTitle}</td>
                      <td>
                        <span className={`score-badge ${getScoreClass(r.score)}`}>
                          {getScoreEmoji(r.score)} {r.score}/100
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${r.status}`}>
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ display: 'flex', gap: 8 }}>
                        {/* View / Hide button */}
                        <button
                          onClick={() => toggleExpand(r._id)}
                          style={{
                            padding: '4px 12px',
                            fontSize: 12,
                            borderRadius: 6,
                            border: '1px solid var(--border)',
                            background: expandedId === r._id ? 'var(--accent)' : 'transparent',
                            color: expandedId === r._id ? '#fff' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                          }}
                        >
                          {expandedId === r._id ? '▲ Hide' : '▼ View'}
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(r._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>

                    {/* ── Expanded Detail Row ── */}
                    {expandedId === r._id && (
                      <tr>
                        <td colSpan={6} style={{ padding: 0, background: 'var(--bg-card)' }}>
                          <div style={{
                            padding: '20px 24px',
                            borderTop: '2px solid var(--accent)',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16
                          }}>

                            {/* Header row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                                  📋 {r.candidateName}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                                  {r.jobTitle} &nbsp;·&nbsp; {new Date(r.createdAt).toLocaleString()}
                                </div>
                              </div>
                              {/* Big score circle */}
                              <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                border: `3px solid ${getScoreColor(r.score)}`,
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center'
                              }}>
                                <span style={{ fontSize: 18, fontWeight: 700, color: getScoreColor(r.score) }}>
                                  {r.score}
                                </span>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/100</span>
                              </div>
                            </div>

                            {/* Score bar */}
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                                <span style={{ color: 'var(--text-muted)' }}>Match Score</span>
                                <span style={{ color: getScoreColor(r.score), fontWeight: 600 }}>
                                  {r.score >= 70 ? 'Strong Match' : r.score >= 45 ? 'Average Match' : 'Weak Match'}
                                </span>
                              </div>
                              <div style={{ height: 8, borderRadius: 4, background: 'var(--border)' }}>
                                <div style={{
                                  height: '100%', borderRadius: 4,
                                  width: `${r.score}%`,
                                  background: `linear-gradient(90deg, ${getScoreColor(r.score)}, ${getScoreColor(r.score)}aa)`,
                                  transition: 'width 0.6s ease'
                                }} />
                              </div>
                            </div>

                            {/* Feedback */}
                            <div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>
                                💬 Feedback
                              </div>
                              <div style={{
                                background: 'var(--bg)',
                                border: '1px solid var(--border)',
                                borderRadius: 8,
                                padding: '10px 14px',
                                fontSize: 13,
                                color: 'var(--text)',
                                lineHeight: 1.6
                              }}>
                                {r.feedback}
                              </div>
                            </div>

                            {/* Matched Skills */}
                            {r.skills?.length > 0 && (
                              <div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
                                  ✅ Matched Skills
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                  {r.skills.map(skill => (
                                    <span key={skill} className="skill-tag">{skill}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* No skills fallback */}
                            {(!r.skills || r.skills.length === 0) && (
                              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                No matched skills found for this entry.
                              </div>
                            )}

                          </div>
                        </td>
                      </tr>
                    )}

                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
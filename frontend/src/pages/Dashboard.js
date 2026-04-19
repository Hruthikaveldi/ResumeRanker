import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState({ total: 0, avgScore: 0, shortlisted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

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
    fetchData();
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const getScoreClass = (score) =>
    score >= 70 ? 'score-high' : score >= 45 ? 'score-mid' : 'score-low';
  const getScoreEmoji = (score) =>
    score >= 70 ? '🟢' : score >= 45 ? '🟡' : '🔴';

  // ── Search + Filter + Sort ──
  const filtered = resumes
    .filter(r => {
      const matchSearch =
        r.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        r.jobTitle.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'score_desc') return b.score - a.score;
      if (sortBy === 'score_asc')  return a.score - b.score;
      if (sortBy === 'date_asc')   return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="dash-layout">
      <Sidebar />

      <main className="main-content">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name?.split(' ')[0]}! Here's your hiring overview.</p>

        {/* Stats */}
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
            <div className="stat-value" style={{ color: stats.avgScore >= 70 ? '#10b981' : stats.avgScore >= 45 ? '#f59e0b' : '#ef4444' }}>
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

        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Resume History</h2>
          <Link to="/analyze" className="btn-add"><span>+</span> Analyze New Resume</Link>
        </div>

        {/* Search + Filter + Sort */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap',
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '14px 16px', alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="🔍  Search by name or job title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 8,
              background: 'var(--bg2)', border: '1px solid var(--border)',
              color: 'var(--text)', fontSize: 14, outline: 'none',
              fontFamily: 'var(--font-body)'
            }}
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: '9px 14px', borderRadius: 8, background: 'var(--bg2)',
              border: '1px solid var(--border)', color: 'var(--text)',
              fontSize: 14, outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)'
            }}>
            <option value="all">All Status</option>
            <option value="shortlisted">✅ Shortlisted</option>
            <option value="analyzed">🔵 Analyzed</option>
            <option value="rejected">❌ Rejected</option>
            <option value="pending">⏳ Pending</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '9px 14px', borderRadius: 8, background: 'var(--bg2)',
              border: '1px solid var(--border)', color: 'var(--text)',
              fontSize: 14, outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)'
            }}>
            <option value="date_desc">📅 Newest First</option>
            <option value="date_asc">📅 Oldest First</option>
            <option value="score_desc">⬆️ Highest Score</option>
            <option value="score_asc">⬇️ Lowest Score</option>
          </select>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="resume-table">
          {loading ? (
            <div className="empty-state"><div className="spinner" style={{ margin: '0 auto' }}></div></div>
          ) : resumes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p className="empty-state-text">No resumes analyzed yet.</p>
              <br />
              <Link to="/analyze" className="btn-add" style={{ display: 'inline-flex' }}>
                + Analyze Your First Resume
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p className="empty-state-text">No results match your search or filter.</p>
              <button onClick={() => { setSearch(''); setFilterStatus('all'); }} style={{
                marginTop: 16, padding: '8px 20px', borderRadius: 8,
                background: 'var(--primary)', color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: 14
              }}>Clear Filters</button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job Title</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r._id}>
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
                    <td style={{ color: '#f59e0b', fontSize: 14 }}>
                      {r.rating > 0
                        ? '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)
                        : <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>—</span>
                      }
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => navigate(`/resume/${r._id}`)} style={{
                        padding: '5px 14px', fontSize: 12, borderRadius: 8,
                        border: '1px solid rgba(99,102,241,0.4)',
                        background: 'rgba(99,102,241,0.1)',
                        color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 500
                      }}>👁 View</button>
                      <button className="btn-delete" onClick={() => handleDelete(r._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
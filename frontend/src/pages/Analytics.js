import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Sidebar from '../components/Sidebar';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get('/api/resumes/stats'), axios.get('/api/resumes')])
      .then(([s, r]) => { setStats(s.data); setResumes(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ textAlign: 'center', paddingTop: 80 }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </main>
    </div>
  );

  // Pie data
  const pieData = [
    { name: 'Shortlisted', value: stats?.shortlisted || 0,  color: '#10b981' },
    { name: 'Analyzed',    value: (stats?.total || 0) - (stats?.shortlisted || 0) - (stats?.rejected || 0), color: '#6366f1' },
    { name: 'Rejected',    value: stats?.rejected || 0,     color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Score distribution buckets
  const buckets = { '0–30': 0, '31–50': 0, '51–70': 0, '71–85': 0, '86–100': 0 };
  resumes.forEach(r => {
    if (r.score <= 30)       buckets['0–30']++;
    else if (r.score <= 50)  buckets['31–50']++;
    else if (r.score <= 70)  buckets['51–70']++;
    else if (r.score <= 85)  buckets['71–85']++;
    else                     buckets['86–100']++;
  });
  const distData = Object.entries(buckets).map(([range, count]) => ({ range, count }));

  const cardStyle = {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '24px 28px'
  };
  const titleStyle = {
    fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20
  };

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">📊 Analytics</h1>
        <p className="page-subtitle">Visual breakdown of your resume analysis history.</p>

        {stats?.total === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">No data yet. Analyze some resumes first!</p>
          </div>
        ) : (
          <>
            {/* ── Quick Stats ── */}
            <div className="stats-grid" style={{ marginBottom: 28 }}>
              {[
                { icon: '📄', label: 'Total Analyzed', value: stats.total, color: 'var(--primary-light)' },
                { icon: '🎯', label: 'Avg Score',       value: stats.avgScore, color: stats.avgScore >= 70 ? '#10b981' : stats.avgScore >= 45 ? '#f59e0b' : '#ef4444' },
                { icon: '✅', label: 'Shortlisted',     value: stats.shortlisted, color: '#10b981' },
                { icon: '❌', label: 'Rejected',        value: stats.rejected,    color: '#ef4444' },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="stat-card">
                  <div className="stat-icon">{icon}</div>
                  <div className="stat-label">{label}</div>
                  <div className="stat-value" style={{ color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* ── Row 1: Score over time + Pie ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 20 }}>

              {/* Score over time */}
              <div style={cardStyle}>
                <div style={titleStyle}>📈 Avg Score Over Time</div>
                {stats.scoreOverTime?.length > 1 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={stats.scoreOverTime}>
                      <XAxis dataKey="month" tick={{ fill: 'var(--text-dim)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
                        labelStyle={{ color: 'var(--text)' }}
                      />
                      <Line type="monotone" dataKey="avgScore" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} name="Avg Score" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: 14 }}>
                    Analyze resumes across multiple months to see trends
                  </div>
                )}
              </div>

              {/* Pie: Pass/Fail */}
              <div style={cardStyle}>
                <div style={titleStyle}>🥧 Result Breakdown</div>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
                      />
                      <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: 14 }}>
                    No data
                  </div>
                )}
              </div>
            </div>

            {/* ── Row 2: Top Skills + Score Distribution ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Top Skills */}
              <div style={cardStyle}>
                <div style={titleStyle}>🔑 Top Matched Skills</div>
                {stats.topSkills?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={stats.topSkills} layout="vertical">
                      <XAxis type="number" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="skill" width={100} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
                      />
                      <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} name="Appearances" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: 14 }}>
                    No skill data yet
                  </div>
                )}
              </div>

              {/* Score Distribution */}
              <div style={cardStyle}>
                <div style={titleStyle}>📊 Score Distribution</div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={distData}>
                    <XAxis dataKey="range" tick={{ fill: 'var(--text-dim)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Resumes">
                      {distData.map((entry, i) => (
                        <Cell key={i} fill={
                          entry.range === '0–30' ? '#ef4444' :
                          entry.range === '31–50' ? '#f59e0b' :
                          entry.range === '51–70' ? '#6366f1' :
                          '#10b981'
                        } />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function getTips(resume) {
  const tips = [];
  const resumeLower = resume.resumeText.toLowerCase();
  const jobLower = resume.jobDescription.toLowerCase();
  if (resume.score < 40) {
    tips.push('🔴 Very low match. Rewrite your summary to directly target this job role.');
    tips.push('📝 Mirror exact keywords from the job description throughout your resume.');
  } else if (resume.score < 70) {
    tips.push('🟡 Close! Add more specific keywords from the JD to boost your score.');
    tips.push('📊 Quantify achievements — e.g. "Increased performance by 40%" instead of vague statements.');
  } else {
    tips.push('🟢 Great match! Make sure your resume is clean, well-formatted, and error-free.');
    tips.push('✨ Tailor your cover letter to highlight your top matched skills.');
  }
  if (!resumeLower.includes('project'))  tips.push('🛠 Add a Projects section showcasing relevant work.');
  if (!resumeLower.includes('certif'))   tips.push('🎓 Add certifications relevant to this role to stand out.');
  if (!resumeLower.includes('achiev') && !resumeLower.includes('award')) tips.push('🏆 Include achievements or awards to show impact.');
  if (resume.resumeText.length < 800)    tips.push('📄 Your resume seems short — add more detail about your experience.');
  if (!resumeLower.includes('team') && jobLower.includes('team')) tips.push('🤝 The role requires teamwork — add examples of collaboration.');
  if (!resumeLower.includes('lead') && jobLower.includes('lead')) tips.push('👑 The role mentions leadership — highlight relevant experience.');
  if (resume.skills.length < 3)          tips.push('💡 Add a dedicated Skills section listing technical and soft skills.');
  return tips.slice(0, 5);
}

export default function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Rating
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingMsg, setRatingMsg] = useState('');

  // Tags & Notes
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState('');
  const [notesMsg, setNotesMsg] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);

  useEffect(() => {
    axios.get('/api/resumes')
      .then(res => {
        const found = res.data.find(r => r._id === id);
        if (!found) { setError('Resume not found.'); return; }
        setResume(found);
        setRating(found.rating || 0);
        setTags(found.tags || []);
        setNotes(found.notes || '');
      })
      .catch(() => setError('Failed to load resume.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRating = async (star) => {
    try {
      const res = await axios.patch(`/api/resumes/${id}/rating`, { rating: star });
      setRating(res.data.rating);
      setRatingMsg('Saved!');
      setTimeout(() => setRatingMsg(''), 2000);
    } catch { setRatingMsg('Failed'); }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      setTagInput('');
      saveNotes(newTags, notes);
    }
  };

  const handleRemoveTag = (tag) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    saveNotes(newTags, notes);
  };

  const saveNotes = async (t = tags, n = notes) => {
    setNotesSaving(true);
    try {
      await axios.patch(`/api/resumes/${id}/notes`, { tags: t, notes: n });
      setNotesMsg('Saved!');
      setTimeout(() => setNotesMsg(''), 2000);
    } catch { setNotesMsg('Failed to save'); }
    finally { setNotesSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this resume?')) return;
    await axios.delete(`/api/resumes/${id}`);
    navigate('/dashboard');
  };

  const getScoreColor = (s) => s >= 70 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444';
  const getScoreLabel = (s) => s >= 70 ? 'Strong Match' : s >= 45 ? 'Average Match' : 'Weak Match';
  const getScoreClass = (s) => s >= 70 ? 'score-high' : s >= 45 ? 'score-mid' : 'score-low';

  const cardStyle = {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 20
  };
  const sectionTitle = {
    fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14
  };

  return (
    <div className="dash-layout">
      <Sidebar />
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
            <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <h1 className="page-title" style={{ marginBottom: 8 }}>📋 {resume.candidateName}</h1>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 15 }}>💼 {resume.jobTitle}</span>
                  <span className={`status-badge status-${resume.status}`}>
                    {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>
                    🗓 {new Date(resume.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Star Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Rating:</span>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, padding: '0 2px',
                        color: star <= (hoverRating || rating) ? '#f59e0b' : 'var(--text-dim)',
                        transition: 'color 0.15s, transform 0.1s',
                        transform: star <= (hoverRating || rating) ? 'scale(1.2)' : 'scale(1)'
                      }}
                    >★</button>
                  ))}
                  {ratingMsg && <span style={{ fontSize: 12, color: '#10b981' }}>{ratingMsg}</span>}
                </div>
              </div>

              {/* Score Circle */}
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                border: `4px solid ${getScoreColor(resume.score)}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: `0 0 24px ${getScoreColor(resume.score)}33`
              }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: getScoreColor(resume.score), fontFamily: 'var(--font-display)' }}>
                  {resume.score}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/100</span>
              </div>
            </div>

            {/* ── Score Bar ── */}
            <div style={cardStyle}>
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

            {/* ── Tags & Notes ── */}
            <div style={cardStyle}>
              <div style={sectionTitle}>🏷️ Tags & Notes</div>

              {/* Tags */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {tags.map(tag => (
                    <span key={tag} className="tag-badge">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 14, lineHeight: 1, padding: 0 }}>
                        ×
                      </button>
                    </span>
                  ))}
                  {tags.length === 0 && <span style={{ fontSize: 13, color: 'var(--text-dim)', fontStyle: 'italic' }}>No tags yet</span>}
                </div>
                <form onSubmit={handleAddTag} style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    placeholder="Add tag (e.g. shortlist, followup, senior)..."
                    style={{
                      flex: 1, padding: '8px 14px', borderRadius: 8,
                      background: 'var(--bg2)', border: '1px solid var(--border)',
                      color: 'var(--text)', fontSize: 13, outline: 'none',
                      fontFamily: 'var(--font-body)'
                    }}
                  />
                  <button type="submit" className="btn-submit" style={{ padding: '8px 16px', fontSize: 13 }}>
                    + Add
                  </button>
                </form>
              </div>

              {/* Notes */}
              <div>
                <label style={{ ...sectionTitle, display: 'block', marginBottom: 8 }}>📝 Private Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add private notes about this candidate..."
                  className="form-textarea"
                  style={{ minHeight: 100, fontSize: 13 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  {notesMsg && <span style={{ fontSize: 12, color: '#10b981' }}>{notesMsg}</span>}
                  <button onClick={() => saveNotes()} disabled={notesSaving}
                    className="btn-submit" style={{ padding: '8px 18px', fontSize: 13 }}>
                    {notesSaving ? 'Saving...' : '💾 Save Notes'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Feedback + Skills ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div style={cardStyle}>
                <div style={sectionTitle}>💬 AI Feedback</div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text)', background: 'var(--bg3)', padding: '14px 16px', borderRadius: 10 }}>
                  {resume.feedback}
                </p>
              </div>
              <div style={cardStyle}>
                <div style={sectionTitle}>✅ Matched Skills</div>
                {resume.skills?.length > 0 ? (
                  <div className="skills-list">
                    {resume.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                ) : (
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic' }}>No matched skills found.</p>
                )}
              </div>
            </div>

            {/* ── Improvement Tips ── */}
            <div style={{ ...cardStyle, border: '1px solid rgba(99,102,241,0.3)' }}>
              <div style={{ ...sectionTitle, color: 'var(--primary-light)' }}>💡 Improvement Tips</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {getTips(resume).map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    background: 'var(--bg3)', borderRadius: 10, padding: '12px 16px'
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-light)', minWidth: 22, marginTop: 1 }}>{i + 1}.</span>
                    <span style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text)' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── JD + Resume Text ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <div style={cardStyle}>
                <div style={sectionTitle}>💼 Job Description</div>
                <pre style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', background: 'var(--bg3)', padding: '14px 16px', borderRadius: 10, maxHeight: 220, overflowY: 'auto' }}>
                  {resume.jobDescription}
                </pre>
              </div>
              <div style={cardStyle}>
                <div style={sectionTitle}>📄 Resume Content</div>
                <pre style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', background: 'var(--bg3)', padding: '14px 16px', borderRadius: 10, maxHeight: 220, overflowY: 'auto' }}>
                  {resume.resumeText}
                </pre>
              </div>
            </div>

            {/* ── Actions ── */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn-secondary">← Back</Link>
              <Link to="/compare" className="btn-secondary" style={{ textDecoration: 'none' }}>⚖️ Compare</Link>
              <Link to="/analyze" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>+ Analyze Another</Link>
              <button onClick={handleDelete} style={{
                padding: '12px 24px', borderRadius: 'var(--radius)',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)'
              }}>🗑 Delete</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

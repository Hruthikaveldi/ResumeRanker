import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const ATS_CHECKS = [
  {
    id: 'length',
    label: 'Resume Length',
    check: (text) => {
      const words = text.trim().split(/\s+/).length;
      if (words >= 400 && words <= 800) return { pass: true, msg: `${words} words — ideal length (400–800 words)` };
      if (words < 400) return { pass: false, msg: `${words} words — too short, ATS may deprioritize. Aim for 400+ words.` };
      return { pass: false, msg: `${words} words — too long, ATS may truncate. Keep under 800 words.` };
    }
  },
  {
    id: 'contact',
    label: 'Contact Information',
    check: (text) => {
      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
      const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(text);
      if (hasEmail && hasPhone) return { pass: true, msg: 'Email and phone detected ✓' };
      if (hasEmail) return { pass: false, msg: 'Email found but no phone number detected' };
      return { pass: false, msg: 'No email or phone detected — ATS requires contact info' };
    }
  },
  {
    id: 'sections',
    label: 'Standard Section Headers',
    check: (text) => {
      const lower = text.toLowerCase();
      const sections = ['experience', 'education', 'skills'];
      const found = sections.filter(s => lower.includes(s));
      if (found.length === 3) return { pass: true, msg: 'Experience, Education, Skills sections found ✓' };
      const missing = sections.filter(s => !lower.includes(s));
      return { pass: false, msg: `Missing standard sections: ${missing.join(', ')}` };
    }
  },
  {
    id: 'dates',
    label: 'Date Formatting',
    check: (text) => {
      const datePattern = /\b(20\d{2}|19\d{2})\b/g;
      const dates = text.match(datePattern);
      if (dates && dates.length >= 2) return { pass: true, msg: `${dates.length} year dates found — ATS can parse them ✓` };
      return { pass: false, msg: 'No clear dates detected — add employment dates (e.g. 2021 – 2023)' };
    }
  },
  {
    id: 'bullets',
    label: 'Bullet Points / Action Verbs',
    check: (text) => {
      const actionVerbs = ['developed','built','created','managed','led','designed','implemented','improved','increased','reduced','launched','delivered','collaborated','maintained','automated','optimized','analyzed','coordinated','established','generated'];
      const lower = text.toLowerCase();
      const found = actionVerbs.filter(v => lower.includes(v));
      if (found.length >= 5) return { pass: true, msg: `${found.length} action verbs detected (${found.slice(0,3).join(', ')}...) ✓` };
      if (found.length >= 2) return { pass: false, msg: `Only ${found.length} action verbs found. Add more: developed, built, managed, led...` };
      return { pass: false, msg: 'No action verbs detected. Start bullet points with verbs like: Built, Led, Developed, Managed.' };
    }
  },
  {
    id: 'keywords',
    label: 'Keyword Density',
    check: (text, jobDesc) => {
      if (!jobDesc || !jobDesc.trim()) return { pass: true, msg: 'Paste a job description above to check keyword match', skipped: true };
      const jobWords = jobDesc.toLowerCase().split(/\W+/).filter(w => w.length > 4);
      const resumeLower = text.toLowerCase();
      const matched = [...new Set(jobWords)].filter(w => resumeLower.includes(w));
      const pct = Math.round((matched.length / [...new Set(jobWords)].length) * 100);
      if (pct >= 50) return { pass: true, msg: `${pct}% keyword match with job description ✓` };
      if (pct >= 30) return { pass: false, msg: `${pct}% keyword match — add more JD keywords to pass ATS filters` };
      return { pass: false, msg: `${pct}% keyword match — very low. Mirror the job description language closely.` };
    }
  },
  {
    id: 'quantified',
    label: 'Quantified Achievements',
    check: (text) => {
      const numbers = text.match(/\d+(%|x|\+|k|m|\s*(million|thousand|percent|users|customers|projects|team|people))/gi);
      if (numbers && numbers.length >= 3) return { pass: true, msg: `${numbers.length} quantified results found ✓` };
      if (numbers && numbers.length > 0) return { pass: false, msg: `Only ${numbers.length} quantified result found. Add metrics: "Improved performance by 40%"` };
      return { pass: false, msg: 'No quantified achievements detected. Add numbers: percentages, team sizes, revenue impact.' };
    }
  },
  {
    id: 'specialchars',
    label: 'No ATS-Breaking Characters',
    check: (text) => {
      const problematic = /[^\x00-\x7F]|[★☆●•◆▸▶→]/g;
      const found = text.match(problematic);
      if (!found || found.length === 0) return { pass: true, msg: 'No special characters that break ATS parsing ✓' };
      return { pass: false, msg: `${found.length} special characters found (${[...new Set(found)].slice(0,5).join(' ')}). Use plain text bullets instead.` };
    }
  },
  {
    id: 'summary',
    label: 'Professional Summary',
    check: (text) => {
      const lower = text.toLowerCase();
      const hasSummary = lower.includes('summary') || lower.includes('objective') || lower.includes('profile') || lower.includes('about');
      if (hasSummary) return { pass: true, msg: 'Professional summary section detected ✓' };
      return { pass: false, msg: 'No summary/objective section found. Add one — ATS ranks resumes with summaries higher.' };
    }
  },
  {
    id: 'linkedin',
    label: 'LinkedIn / Portfolio',
    check: (text) => {
      const hasLinkedIn = /linkedin\.com/i.test(text);
      const hasPortfolio = /github\.com|portfolio|behance|dribbble/i.test(text);
      if (hasLinkedIn && hasPortfolio) return { pass: true, msg: 'LinkedIn and portfolio links detected ✓' };
      if (hasLinkedIn) return { pass: true, msg: 'LinkedIn detected ✓ (consider adding GitHub/portfolio too)' };
      return { pass: false, msg: 'No LinkedIn or portfolio link found. Add your LinkedIn URL to improve ATS profile.' };
    }
  },
];

export default function ATSChecker() {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [results, setResults] = useState(null);
  const [atsScore, setAtsScore] = useState(0);

  const handleCheck = () => {
    if (!resumeText.trim()) return;
    const checked = ATS_CHECKS.map(c => ({
      ...c,
      result: c.check(resumeText, jobDesc)
    }));
    const passing = checked.filter(c => c.result.pass && !c.result.skipped).length;
    const total = checked.filter(c => !c.result.skipped).length;
    setResults(checked);
    setAtsScore(Math.round((passing / total) * 100));
  };

  const getScoreColor = (s) => s >= 80 ? '#10b981' : s >= 55 ? '#f59e0b' : '#ef4444';
  const getScoreLabel = (s) => s >= 80 ? 'ATS Ready 🟢' : s >= 55 ? 'Needs Work 🟡' : 'High Risk 🔴';

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">🌍 ATS Checker</h1>
        <p className="page-subtitle">Check if your resume will pass Applicant Tracking System filters before applying.</p>

        {/* Input */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 24
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label className="form-label">📄 Your Resume *</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: 240, fontSize: 13 }}
                placeholder="Paste your full resume text here..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">💼 Job Description (optional — for keyword check)</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: 240, fontSize: 13 }}
                placeholder="Paste the job description for a keyword density check..."
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleCheck}
            disabled={!resumeText.trim()}
            className="btn-submit"
            style={{ padding: '13px 32px', fontSize: 15 }}
          >
            🌍 Run ATS Check
          </button>
        </div>

        {/* Results */}
        {results && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.2fr', gap: 24 }}>

            {/* Score Card */}
            <div style={{
              background: 'var(--card)', border: `2px solid ${getScoreColor(atsScore)}`,
              borderRadius: 'var(--radius-lg)', padding: '28px 24px',
              textAlign: 'center', alignSelf: 'start',
              boxShadow: `0 0 24px ${getScoreColor(atsScore)}22`
            }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ATS Score
              </div>
              <div style={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto 16px',
                border: `6px solid ${getScoreColor(atsScore)}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 30px ${getScoreColor(atsScore)}33`
              }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: getScoreColor(atsScore), fontFamily: 'var(--font-display)' }}>
                  {atsScore}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: getScoreColor(atsScore) }}>
                {getScoreLabel(atsScore)}
              </div>

              {/* Progress bar */}
              <div style={{ height: 8, borderRadius: 4, background: 'var(--bg3)', marginTop: 20 }}>
                <div style={{
                  height: '100%', borderRadius: 4, width: `${atsScore}%`,
                  background: `linear-gradient(90deg, ${getScoreColor(atsScore)}, ${getScoreColor(atsScore)}99)`,
                  transition: 'width 1s ease'
                }} />
              </div>

              {/* Pass/Fail counts */}
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 20 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>
                    {results.filter(r => r.result.pass).length}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Passed</div>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#ef4444' }}>
                    {results.filter(r => !r.result.pass && !r.result.skipped).length}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Failed</div>
                </div>
              </div>

              <div style={{ marginTop: 20, fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                {atsScore >= 80
                  ? '✅ Your resume is likely to pass most ATS filters!'
                  : atsScore >= 55
                  ? '⚠️ Fix the failed checks to improve your ATS score.'
                  : '🔴 Your resume may be filtered out before a human sees it.'}
              </div>
            </div>

            {/* Detailed Checks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.map(check => (
                <div key={check.id} style={{
                  background: 'var(--card)', border: `1px solid ${check.result.pass ? 'rgba(16,185,129,0.2)' : check.result.skipped ? 'var(--border)' : 'rgba(239,68,68,0.2)'}`,
                  borderRadius: 'var(--radius)', padding: '16px 20px',
                  display: 'flex', alignItems: 'flex-start', gap: 14
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>
                    {check.result.skipped ? '⏭️' : check.result.pass ? '✅' : '❌'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                      {check.label}
                    </div>
                    <div style={{ fontSize: 13, color: check.result.pass ? '#10b981' : check.result.skipped ? 'var(--text-dim)' : '#f87171', lineHeight: 1.5 }}>
                      {check.result.msg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
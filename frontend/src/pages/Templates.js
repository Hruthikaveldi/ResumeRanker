import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TEMPLATES = [
  {
    category: 'Software Development',
    icon: '💻',
    roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer'],
    sections: ['Professional Summary', 'Technical Skills', 'Work Experience', 'Projects', 'Education', 'Certifications'],
    tips: [
      'List programming languages and frameworks first in your Skills section',
      'Include GitHub links to your best projects',
      'Mention specific technologies used in each job (e.g. React, Node.js, PostgreSQL)',
      'Add metrics — "Reduced load time by 40%" beats "improved performance"',
      'List open source contributions if any',
    ],
    keywords: ['JavaScript', 'Python', 'React', 'Node.js', 'REST API', 'Git', 'Agile', 'CI/CD', 'Docker', 'MongoDB', 'SQL', 'TypeScript'],
    template: `[Your Name]
[Email] | [Phone] | [LinkedIn] | [GitHub]

PROFESSIONAL SUMMARY
Results-driven [Role] with [X] years of experience building scalable web applications. 
Proficient in [Tech Stack]. Passionate about clean code and agile development.

TECHNICAL SKILLS
Languages:   JavaScript, Python, TypeScript
Frontend:    React.js, HTML5, CSS3, Redux
Backend:     Node.js, Express.js, REST APIs
Databases:   MongoDB, PostgreSQL, MySQL
Tools:       Git, Docker, CI/CD, AWS

WORK EXPERIENCE
[Company Name] — [Role]                                [Date - Date]
• Built [feature] using [tech] resulting in [metric]
• Reduced [issue] by [X]% through [approach]
• Collaborated with [team] to deliver [outcome]

PROJECTS
[Project Name] | [Tech Stack] | [GitHub Link]
• Brief description of what it does and your role
• Key features or achievements

EDUCATION
B.Tech in Computer Science — [University], [Year]

CERTIFICATIONS
• [Relevant Certification] — [Year]`
  },
  {
    category: 'Data Science & AI',
    icon: '🤖',
    roles: ['Data Scientist', 'ML Engineer', 'Data Analyst', 'AI Researcher'],
    sections: ['Summary', 'Skills', 'Experience', 'Projects & Research', 'Education', 'Publications'],
    tips: [
      'Highlight specific ML models you\'ve worked with (e.g. BERT, XGBoost, LSTM)',
      'Include Kaggle rankings or competition results if applicable',
      'Quantify model improvements — accuracy, F1 score, precision/recall',
      'Mention datasets and data sizes you\'ve worked with',
      'Add links to notebooks, research papers, or Kaggle profiles',
    ],
    keywords: ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'SQL', 'Data Analysis', 'Statistics', 'NLP', 'Deep Learning', 'Pandas', 'Scikit-learn', 'Tableau'],
    template: `[Your Name]
[Email] | [Phone] | [LinkedIn] | [Kaggle/GitHub]

PROFESSIONAL SUMMARY
Data Scientist with [X] years of experience in [ML/NLP/CV]. 
Skilled in building predictive models and extracting insights from large datasets.

TECHNICAL SKILLS
Languages:      Python, R, SQL
ML Frameworks:  TensorFlow, PyTorch, Scikit-learn
Data Tools:     Pandas, NumPy, Matplotlib, Seaborn
Platforms:      AWS SageMaker, Google Colab, Jupyter
Other:          Statistics, A/B Testing, Data Visualization

WORK EXPERIENCE
[Company] — [Role]                                     [Date - Date]
• Developed [model type] achieving [X]% accuracy on [task]
• Processed and analyzed [X GB/million rows] of data using [tools]
• Deployed model to production reducing [metric] by [X]%

PROJECTS & RESEARCH
[Project Name] | [Tools Used]
• Problem: [what you solved]
• Approach: [ML technique used]
• Result: [accuracy, improvement, business impact]

EDUCATION
M.Tech / B.Tech in [CS / Statistics / AI] — [University], [Year]`
  },
  {
    category: 'Product & Management',
    icon: '📊',
    roles: ['Product Manager', 'Project Manager', 'Business Analyst', 'Scrum Master'],
    sections: ['Summary', 'Core Competencies', 'Experience', 'Key Achievements', 'Education', 'Certifications'],
    tips: [
      'Use numbers — revenue impact, user growth, cost savings',
      'Show cross-functional leadership — teams you\'ve aligned',
      'Mention product lifecycle stages you\'ve owned',
      'Include agile/scrum certifications (PMP, CSPO, PSM)',
      'Highlight customer discovery and data-driven decisions',
    ],
    keywords: ['Agile', 'Scrum', 'Product Roadmap', 'Stakeholder Management', 'KPIs', 'OKRs', 'User Stories', 'Sprint Planning', 'JIRA', 'Leadership', 'Data-driven', 'Cross-functional'],
    template: `[Your Name]
[Email] | [Phone] | [LinkedIn]

PROFESSIONAL SUMMARY
Product Manager with [X] years driving [B2B/B2C] product strategy.
Track record of launching features that increased [metric] by [X]%.

CORE COMPETENCIES
• Product Strategy & Roadmapping       • Agile / Scrum Methodologies
• Stakeholder Communication            • Data Analysis & A/B Testing  
• User Research & Personas             • Cross-functional Team Leadership

WORK EXPERIENCE
[Company] — [Role]                                     [Date - Date]
• Led development of [feature] adopted by [X] users in [timeframe]
• Defined and tracked KPIs resulting in [X]% improvement in [metric]
• Collaborated with engineering, design, and sales to ship [product]

KEY ACHIEVEMENTS
• Launched [product/feature] generating $[X] in revenue
• Reduced [churn/time/cost] by [X]% through [strategy]
• Grew [DAU/MAU/NPS] from [X] to [Y] in [timeframe]

EDUCATION
MBA / B.Tech — [University], [Year]

CERTIFICATIONS
• PMP / CSPO / PSM — [Year]`
  },
  {
    category: 'Design & UX',
    icon: '🎨',
    roles: ['UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Visual Designer'],
    sections: ['Summary', 'Skills & Tools', 'Experience', 'Portfolio Projects', 'Education'],
    tips: [
      'Always include a portfolio link — it\'s your most important asset',
      'Describe your design process: research → wireframe → prototype → test',
      'Show measurable UX impact — conversion rates, task completion, NPS',
      'Mention accessibility and inclusive design experience',
      'List specific tools: Figma, Adobe XD, Sketch, Protopie',
    ],
    keywords: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'User Testing', 'Design Systems', 'Accessibility', 'HTML/CSS', 'Interaction Design', 'Typography'],
    template: `[Your Name]
[Email] | [Portfolio URL] | [LinkedIn]

PROFESSIONAL SUMMARY
UI/UX Designer with [X] years crafting user-centered digital experiences.
Skilled in the full design process from research to high-fidelity prototypes.

SKILLS & TOOLS
Design:     Figma, Adobe XD, Sketch, Illustrator, Photoshop
Research:   User Interviews, Usability Testing, A/B Testing, Heatmaps
Other:      Design Systems, Accessibility (WCAG), HTML/CSS basics

WORK EXPERIENCE
[Company] — [Role]                                     [Date - Date]
• Redesigned [feature] increasing conversion by [X]%
• Conducted [X] user interviews and synthesized insights for [product]
• Built component library reducing design-to-dev time by [X]%

PORTFOLIO PROJECTS
[Project Name] | [Type: App/Website/Dashboard]
• Challenge: [problem you were solving]
• Process: [research → wireframes → prototype → testing]
• Outcome: [measurable result or key learning]

EDUCATION
B.Des / B.Tech in [Design / CS] — [University], [Year]`
  },
];

export default function Templates() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  const t = TEMPLATES[selected];

  const handleCopy = () => {
    navigator.clipboard.writeText(t.template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <span className="sidebar-link active">
            <span className="sidebar-link-icon">📄</span> Templates
          </span>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-email">{user?.email}</div>
          <button className="sidebar-logout" onClick={() => { logout(); navigate('/login'); }}>🚪 Sign out</button>
        </div>
      </aside>

      <main className="main-content">
        <h1 className="page-title">📄 Resume Templates</h1>
        <p className="page-subtitle">Choose a template for your role, copy it, and tailor it to your experience.</p>

        {/* ── Category Tabs ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          {TEMPLATES.map((t, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                padding: '10px 20px', borderRadius: 'var(--radius)',
                background: selected === i ? 'var(--primary)' : 'var(--card)',
                border: selected === i ? 'none' : '1px solid var(--border)',
                color: selected === i ? '#fff' : 'var(--text-muted)',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-body)', transition: 'all 0.15s'
              }}
            >
              {t.icon} {t.category}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>

          {/* ── Left: Info Panel ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Suitable for */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px 24px'
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                {t.icon} Suitable For
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {t.roles.map(r => (
                  <span key={r} style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 12,
                    background: 'rgba(99,102,241,0.1)', color: 'var(--primary-light)',
                    border: '1px solid rgba(99,102,241,0.2)'
                  }}>{r}</span>
                ))}
              </div>
            </div>

            {/* Recommended sections */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px 24px'
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                📋 Recommended Sections
              </div>
              {t.sections.map((s, i) => (
                <div key={s} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0', borderBottom: i < t.sections.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--primary-glow)', color: 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, flexShrink: 0
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 14, color: 'var(--text)' }}>{s}</span>
                </div>
              ))}
            </div>

            {/* Keywords to include */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '22px 24px'
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                🔑 Keywords to Include
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {t.keywords.map(k => (
                  <span key={k} className="skill-tag">{k}</span>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div style={{
              background: 'var(--card)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 'var(--radius-lg)', padding: '22px 24px'
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                💡 Pro Tips
              </div>
              {t.tips.map((tip, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start'
                }}>
                  <span style={{ color: 'var(--primary-light)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Template Preview ── */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px', background: 'var(--bg3)',
              borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                📄 {t.category} Template
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 13,
                    background: copied ? '#10b981' : 'var(--primary)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontWeight: 500,
                    transition: 'background 0.2s'
                  }}
                >
                  {copied ? '✅ Copied!' : '📋 Copy Template'}
                </button>
                <Link
                  to="/analyze"
                  style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 13,
                    background: 'var(--bg2)', color: 'var(--primary-light)',
                    border: '1px solid rgba(99,102,241,0.3)', textDecoration: 'none',
                    fontWeight: 500, display: 'inline-flex', alignItems: 'center'
                  }}
                >
                  ✨ Analyze Mine
                </Link>
              </div>
            </div>

            {/* Template text */}
            <pre style={{
              flex: 1, margin: 0, padding: '20px 24px',
              fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.8,
              color: 'var(--text-muted)', whiteSpace: 'pre-wrap',
              overflowY: 'auto', maxHeight: 680, background: 'var(--bg2)'
            }}>
              {t.template}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
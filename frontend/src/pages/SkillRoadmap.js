import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const ROADMAPS = {
  'Frontend Developer': {
    icon: '🖥️',
    levels: [
      {
        level: 'Foundation', color: '#10b981',
        skills: [
          { name: 'HTML5', resources: [{ label: 'MDN HTML Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' }, { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' }] },
          { name: 'CSS3', resources: [{ label: 'CSS Tricks', url: 'https://css-tricks.com/guides/' }, { label: 'freeCodeCamp CSS', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' }] },
          { name: 'JavaScript (ES6+)', resources: [{ label: 'javascript.info', url: 'https://javascript.info' }, { label: 'freeCodeCamp JS', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' }] },
        ]
      },
      {
        level: 'Core', color: '#6366f1',
        skills: [
          { name: 'React.js', resources: [{ label: 'React Docs', url: 'https://react.dev/learn' }, { label: 'Scrimba React', url: 'https://scrimba.com/learn/learnreact' }] },
          { name: 'Git & GitHub', resources: [{ label: 'Git Guide', url: 'https://rogerdudler.github.io/git-guide/' }, { label: 'GitHub Skills', url: 'https://skills.github.com' }] },
          { name: 'Responsive Design', resources: [{ label: 'web.dev', url: 'https://web.dev/responsive-web-design-basics/' }] },
        ]
      },
      {
        level: 'Advanced', color: '#f59e0b',
        skills: [
          { name: 'TypeScript', resources: [{ label: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs/' }, { label: 'Total TypeScript', url: 'https://www.totaltypescript.com' }] },
          { name: 'State Management (Redux)', resources: [{ label: 'Redux Docs', url: 'https://redux.js.org/tutorials/essentials/part-1-overview-concepts' }] },
          { name: 'Testing (Jest/Cypress)', resources: [{ label: 'Jest Docs', url: 'https://jestjs.io/docs/getting-started' }] },
          { name: 'Performance Optimization', resources: [{ label: 'web.dev Performance', url: 'https://web.dev/performance/' }] },
        ]
      },
    ]
  },
  'Backend Developer': {
    icon: '⚙️',
    levels: [
      {
        level: 'Foundation', color: '#10b981',
        skills: [
          { name: 'Python or Node.js', resources: [{ label: 'Python.org Tutorials', url: 'https://docs.python.org/3/tutorial/' }, { label: 'Node.js Docs', url: 'https://nodejs.org/en/docs/guides/' }] },
          { name: 'SQL Basics', resources: [{ label: 'SQLZoo', url: 'https://sqlzoo.net' }, { label: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/' }] },
          { name: 'REST APIs', resources: [{ label: 'RESTful API Design', url: 'https://restfulapi.net' }] },
        ]
      },
      {
        level: 'Core', color: '#6366f1',
        skills: [
          { name: 'Express.js / Django / Spring', resources: [{ label: 'Express Docs', url: 'https://expressjs.com/en/guide/routing.html' }, { label: 'Django Tutorial', url: 'https://docs.djangoproject.com/en/4.2/intro/tutorial01/' }] },
          { name: 'MongoDB / PostgreSQL', resources: [{ label: 'MongoDB University', url: 'https://university.mongodb.com' }, { label: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com' }] },
          { name: 'Authentication (JWT)', resources: [{ label: 'JWT.io', url: 'https://jwt.io/introduction' }] },
        ]
      },
      {
        level: 'Advanced', color: '#f59e0b',
        skills: [
          { name: 'Docker', resources: [{ label: 'Docker Get Started', url: 'https://docs.docker.com/get-started/' }, { label: 'Play with Docker', url: 'https://labs.play-with-docker.com' }] },
          { name: 'Microservices', resources: [{ label: 'Microservices.io', url: 'https://microservices.io' }] },
          { name: 'CI/CD', resources: [{ label: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions' }] },
        ]
      },
    ]
  },
  'Data Scientist': {
    icon: '🤖',
    levels: [
      {
        level: 'Foundation', color: '#10b981',
        skills: [
          { name: 'Python', resources: [{ label: 'Python for Everybody (Coursera)', url: 'https://www.coursera.org/specializations/python' }, { label: 'Kaggle Python', url: 'https://www.kaggle.com/learn/python' }] },
          { name: 'Statistics & Math', resources: [{ label: 'Khan Academy Stats', url: 'https://www.khanacademy.org/math/statistics-probability' }] },
          { name: 'Pandas & NumPy', resources: [{ label: 'Kaggle Pandas', url: 'https://www.kaggle.com/learn/pandas' }] },
        ]
      },
      {
        level: 'Core', color: '#6366f1',
        skills: [
          { name: 'Machine Learning (Scikit-learn)', resources: [{ label: 'Scikit-learn Docs', url: 'https://scikit-learn.org/stable/tutorial/' }, { label: 'Kaggle Intro to ML', url: 'https://www.kaggle.com/learn/intro-to-machine-learning' }] },
          { name: 'Data Visualization', resources: [{ label: 'Kaggle Data Viz', url: 'https://www.kaggle.com/learn/data-visualization' }] },
          { name: 'SQL', resources: [{ label: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/' }] },
        ]
      },
      {
        level: 'Advanced', color: '#f59e0b',
        skills: [
          { name: 'Deep Learning (TensorFlow/PyTorch)', resources: [{ label: 'fast.ai', url: 'https://www.fast.ai' }, { label: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning' }] },
          { name: 'NLP', resources: [{ label: 'Hugging Face Course', url: 'https://huggingface.co/learn/nlp-course/chapter1/1' }] },
          { name: 'MLOps', resources: [{ label: 'MLOps Zoomcamp', url: 'https://github.com/DataTalksClub/mlops-zoomcamp' }] },
        ]
      },
    ]
  },
  'DevOps Engineer': {
    icon: '🚀',
    levels: [
      {
        level: 'Foundation', color: '#10b981',
        skills: [
          { name: 'Linux & Bash', resources: [{ label: 'Linux Journey', url: 'https://linuxjourney.com' }, { label: 'OverTheWire Bandit', url: 'https://overthewire.org/wargames/bandit/' }] },
          { name: 'Git', resources: [{ label: 'Git Docs', url: 'https://git-scm.com/doc' }] },
          { name: 'Networking Basics', resources: [{ label: 'Cisco Networking Basics', url: 'https://www.netacad.com/courses/networking/networking-basics' }] },
        ]
      },
      {
        level: 'Core', color: '#6366f1',
        skills: [
          { name: 'Docker', resources: [{ label: 'Docker Docs', url: 'https://docs.docker.com/get-started/' }] },
          { name: 'Kubernetes', resources: [{ label: 'Kubernetes Docs', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/' }, { label: 'Play with K8s', url: 'https://labs.play-with-k8s.com' }] },
          { name: 'CI/CD (GitHub Actions)', resources: [{ label: 'GitHub Actions', url: 'https://docs.github.com/en/actions' }] },
        ]
      },
      {
        level: 'Advanced', color: '#f59e0b',
        skills: [
          { name: 'AWS / Azure / GCP', resources: [{ label: 'AWS Free Tier', url: 'https://aws.amazon.com/free/' }, { label: 'Google Cloud Skills', url: 'https://cloud.google.com/training' }] },
          { name: 'Terraform (IaC)', resources: [{ label: 'Terraform Tutorials', url: 'https://developer.hashicorp.com/terraform/tutorials' }] },
          { name: 'Monitoring (Prometheus/Grafana)', resources: [{ label: 'Prometheus Docs', url: 'https://prometheus.io/docs/introduction/overview/' }] },
        ]
      },
    ]
  },
  'UI/UX Designer': {
    icon: '🎨',
    levels: [
      {
        level: 'Foundation', color: '#10b981',
        skills: [
          { name: 'Design Principles', resources: [{ label: 'Google UX Design Certificate', url: 'https://grow.google/certificates/ux-design/' }] },
          { name: 'Figma Basics', resources: [{ label: 'Figma Learn', url: 'https://www.figma.com/resources/learn-design/' }] },
          { name: 'Typography & Color Theory', resources: [{ label: 'Canva Design School', url: 'https://www.canva.com/learn/design/' }] },
        ]
      },
      {
        level: 'Core', color: '#6366f1',
        skills: [
          { name: 'Wireframing & Prototyping', resources: [{ label: 'Figma Prototyping', url: 'https://help.figma.com/hc/en-us/sections/360006537574-Prototyping' }] },
          { name: 'User Research', resources: [{ label: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/' }] },
          { name: 'Accessibility (WCAG)', resources: [{ label: 'WebAIM', url: 'https://webaim.org/intro/' }] },
        ]
      },
      {
        level: 'Advanced', color: '#f59e0b',
        skills: [
          { name: 'Design Systems', resources: [{ label: 'Design Systems Handbook', url: 'https://www.designbetter.co/design-systems-handbook' }] },
          { name: 'Usability Testing', resources: [{ label: 'UsabilityHub', url: 'https://usabilityhub.com/guides/usability-testing' }] },
          { name: 'HTML/CSS Basics', resources: [{ label: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' }] },
        ]
      },
    ]
  },
  'Full Stack Developer': {
    icon: '🔧',
    levels: [
      {
        level: 'Foundation', color: '#10b981',
        skills: [
          { name: 'HTML, CSS, JavaScript', resources: [{ label: 'The Odin Project', url: 'https://www.theodinproject.com' }] },
          { name: 'Git & GitHub', resources: [{ label: 'GitHub Skills', url: 'https://skills.github.com' }] },
          { name: 'SQL Basics', resources: [{ label: 'SQLZoo', url: 'https://sqlzoo.net' }] },
        ]
      },
      {
        level: 'Core', color: '#6366f1',
        skills: [
          { name: 'React.js (Frontend)', resources: [{ label: 'React Docs', url: 'https://react.dev/learn' }] },
          { name: 'Node.js + Express (Backend)', resources: [{ label: 'Express Docs', url: 'https://expressjs.com' }] },
          { name: 'MongoDB / PostgreSQL', resources: [{ label: 'MongoDB University', url: 'https://university.mongodb.com' }] },
          { name: 'REST APIs', resources: [{ label: 'RESTful API Design', url: 'https://restfulapi.net' }] },
        ]
      },
      {
        level: 'Advanced', color: '#f59e0b',
        skills: [
          { name: 'TypeScript', resources: [{ label: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs/' }] },
          { name: 'Docker & Deployment', resources: [{ label: 'Docker Docs', url: 'https://docs.docker.com/get-started/' }] },
          { name: 'Authentication & Security', resources: [{ label: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' }] },
        ]
      },
    ]
  },
};

export default function SkillRoadmap() {
  const [selectedRole, setSelectedRole] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [roadmap, setRoadmap] = useState(null);

  const handleGenerate = () => {
    if (!selectedRole) return;
    const rm = ROADMAPS[selectedRole];
    if (!rm) return;

    const lower = resumeText.toLowerCase();
    // Mark which skills user already has
    const enriched = {
      ...rm,
      levels: rm.levels.map(level => ({
        ...level,
        skills: level.skills.map(skill => ({
          ...skill,
          have: resumeText.trim() ? lower.includes(skill.name.toLowerCase().split(' ')[0]) || lower.includes(skill.name.toLowerCase().split('(')[0].trim().toLowerCase()) : false
        }))
      }))
    };
    setRoadmap(enriched);
  };

  const totalSkills = roadmap ? roadmap.levels.reduce((a, l) => a + l.skills.length, 0) : 0;
  const haveSkills  = roadmap ? roadmap.levels.reduce((a, l) => a + l.skills.filter(s => s.have).length, 0) : 0;
  const gapCount    = totalSkills - haveSkills;

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">🧩 Skill Gap Roadmap</h1>
        <p className="page-subtitle">Choose your target role, paste your resume, and see exactly what skills you need to learn.</p>

        {/* Controls */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 28
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label className="form-label">🎯 Target Job Role</label>
              <select
                value={selectedRole}
                onChange={e => { setSelectedRole(e.target.value); setRoadmap(null); }}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 'var(--radius)',
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: 14, outline: 'none',
                  cursor: 'pointer', fontFamily: 'var(--font-body)'
                }}
              >
                <option value="">Select a role...</option>
                {Object.keys(ROADMAPS).map(r => (
                  <option key={r} value={r}>{ROADMAPS[r].icon} {r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">📄 Paste Resume (optional — to detect existing skills)</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: 80, fontSize: 13 }}
                placeholder="Paste your resume to see which skills you already have..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!selectedRole}
            className="btn-submit"
            style={{ padding: '12px 28px' }}
          >
            🗺️ Generate Roadmap
          </button>
        </div>

        {/* Roadmap */}
        {roadmap && (
          <>
            {/* Summary bar */}
            {resumeText.trim() && (
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 24,
                display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skills You Have</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-display)' }}>{haveSkills}/{totalSkills}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skill Gaps</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-display)' }}>{gapCount}</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Readiness</div>
                  <div style={{ height: 10, borderRadius: 5, background: 'var(--bg3)' }}>
                    <div style={{
                      height: '100%', borderRadius: 5,
                      width: `${totalSkills > 0 ? Math.round((haveSkills/totalSkills)*100) : 0}%`,
                      background: 'linear-gradient(90deg, #10b981, #6366f1)',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {totalSkills > 0 ? Math.round((haveSkills/totalSkills)*100) : 0}% ready for {selectedRole}
                  </div>
                </div>
              </div>
            )}

            {/* Levels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {roadmap.levels.map((level, li) => (
                <div key={level.level}>
                  {/* Level header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: level.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                      {li + 1}
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{level.level}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>

                  {/* Skills grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                    {level.skills.map(skill => (
                      <div key={skill.name} style={{
                        background: 'var(--card)',
                        border: `1px solid ${skill.have ? '#10b98133' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)', padding: '16px 18px',
                        opacity: skill.have ? 0.75 : 1
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontWeight: 600, fontSize: 14, color: skill.have ? '#10b981' : 'var(--text)' }}>
                            {skill.have ? '✅' : '📚'} {skill.name}
                          </span>
                          {skill.have && (
                            <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.12)', color: '#10b981', padding: '2px 8px', borderRadius: 10 }}>
                              You have this!
                            </span>
                          )}
                        </div>
                        {!skill.have && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free Resources:</div>
                            {skill.resources.map(r => (
                              <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 6,
                                  fontSize: 13, color: 'var(--primary-light)', textDecoration: 'none',
                                  padding: '5px 10px', borderRadius: 6,
                                  background: 'rgba(99,102,241,0.07)',
                                  transition: 'background 0.15s'
                                }}
                              >
                                🔗 {r.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
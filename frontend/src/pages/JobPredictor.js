import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const JOB_ROLES = [
  {
    title: 'Frontend Developer',
    icon: '🖥️',
    keywords: ['react','javascript','html','css','typescript','vue','angular','redux','webpack','ui','ux','responsive','sass','tailwind','figma','dom'],
    desc: 'Builds user interfaces and web experiences'
  },
  {
    title: 'Backend Developer',
    icon: '⚙️',
    keywords: ['node','express','python','java','django','flask','api','rest','graphql','sql','database','server','microservices','spring','php','ruby'],
    desc: 'Builds server-side logic and APIs'
  },
  {
    title: 'Full Stack Developer',
    icon: '🔧',
    keywords: ['react','node','javascript','mongodb','sql','api','html','css','express','fullstack','mern','mean','next','nuxt'],
    desc: 'Works across both frontend and backend'
  },
  {
    title: 'Data Scientist',
    icon: '🤖',
    keywords: ['python','machine learning','tensorflow','pytorch','pandas','numpy','sklearn','statistics','data analysis','jupyter','keras','nlp','deep learning','model','prediction'],
    desc: 'Builds ML models and extracts insights from data'
  },
  {
    title: 'Data Analyst',
    icon: '📊',
    keywords: ['sql','excel','tableau','power bi','data analysis','statistics','python','r','visualization','dashboard','reporting','analytics','bi','pivot'],
    desc: 'Analyzes data to drive business decisions'
  },
  {
    title: 'DevOps Engineer',
    icon: '🚀',
    keywords: ['docker','kubernetes','aws','azure','gcp','ci/cd','jenkins','terraform','ansible','linux','bash','git','pipeline','cloud','deployment','monitoring'],
    desc: 'Manages infrastructure and deployment pipelines'
  },
  {
    title: 'Cloud Engineer',
    icon: '☁️',
    keywords: ['aws','azure','gcp','cloud','terraform','serverless','lambda','s3','ec2','iam','networking','vpc','cloudformation','devops','infrastructure'],
    desc: 'Designs and manages cloud infrastructure'
  },
  {
    title: 'Product Manager',
    icon: '📋',
    keywords: ['product','roadmap','stakeholder','agile','scrum','kpi','okr','user story','backlog','sprint','jira','strategy','launch','metrics','customer'],
    desc: 'Leads product strategy and execution'
  },
  {
    title: 'UI/UX Designer',
    icon: '🎨',
    keywords: ['figma','sketch','adobe','xd','wireframe','prototype','user research','usability','design system','ui','ux','typography','interaction','accessibility','heuristic'],
    desc: 'Designs user interfaces and experiences'
  },
  {
    title: 'Machine Learning Engineer',
    icon: '🧠',
    keywords: ['machine learning','deep learning','tensorflow','pytorch','model','training','inference','mlops','feature engineering','neural','transformer','bert','gpt','pipeline','deployment'],
    desc: 'Builds and deploys machine learning systems'
  },
  {
    title: 'Cybersecurity Analyst',
    icon: '🔒',
    keywords: ['security','penetration','vulnerability','firewall','siem','soc','threat','malware','encryption','network','compliance','iso','nist','incident','forensics'],
    desc: 'Protects systems from cyber threats'
  },
  {
    title: 'Mobile Developer',
    icon: '📱',
    keywords: ['android','ios','flutter','react native','swift','kotlin','java','mobile','app','xcode','playstore','appstore','dart','objective-c'],
    desc: 'Builds mobile applications'
  },
  {
    title: 'Business Analyst',
    icon: '💼',
    keywords: ['requirements','stakeholder','process','uml','bpmn','analysis','sql','excel','reporting','documentation','agile','workflow','business','gap analysis','use case'],
    desc: 'Bridges business needs and technical solutions'
  },
  {
    title: 'QA Engineer',
    icon: '🧪',
    keywords: ['testing','automation','selenium','cypress','jest','manual testing','test case','bug','regression','performance','api testing','postman','quality','load testing','jira'],
    desc: 'Ensures software quality through testing'
  },
  {
    title: 'Blockchain Developer',
    icon: '⛓️',
    keywords: ['blockchain','solidity','ethereum','smart contract','web3','defi','nft','truffle','hardhat','cryptocurrency','consensus','polygon','rust','substrate'],
    desc: 'Builds decentralized blockchain applications'
  },
  {
    title: 'Database Administrator',
    icon: '🗄️',
    keywords: ['sql','mysql','postgresql','oracle','mongodb','redis','database','backup','replication','performance tuning','indexing','query','stored procedure','nosql','dba'],
    desc: 'Manages and optimizes databases'
  },
];

function predictRoles(resumeText) {
  const lower = resumeText.toLowerCase();
  const words = lower.split(/\W+/);

  return JOB_ROLES.map(role => {
    let matched = 0;
    const matchedKeywords = [];
    role.keywords.forEach(kw => {
      if (lower.includes(kw)) {
        matched++;
        matchedKeywords.push(kw);
      }
    });
    const score = Math.round((matched / role.keywords.length) * 100);
    return { ...role, score, matchedKeywords, matched };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);
}

export default function JobPredictor() {
  const [resumeText, setResumeText] = useState('');
  const [results, setResults] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  const handlePredict = () => {
    if (!resumeText.trim()) return;
    const predictions = predictRoles(resumeText);
    setResults(predictions);
    setAnalyzed(true);
  };

  const getColor = (score) =>
    score >= 60 ? '#10b981' : score >= 35 ? '#6366f1' : score >= 15 ? '#f59e0b' : '#ef4444';

  const getMedal = (i) => ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i];

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">🎯 Job Role Predictor</h1>
        <p className="page-subtitle">Paste your resume and discover your top 5 best-fit job roles based on your skills.</p>

        <div style={{ display: 'grid', gridTemplateColumns: analyzed ? '1fr 1.2fr' : '1fr', gap: 24 }}>

          {/* Input */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              📄 Paste Your Resume
            </div>
            <textarea
              className="form-textarea"
              style={{ minHeight: 320, fontSize: 13 }}
              placeholder="Paste your full resume text here...&#10;&#10;Include your skills, experience, education, and projects for the most accurate prediction."
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-dim)' }}>
              {resumeText.length} characters · {resumeText.trim().split(/\s+/).filter(Boolean).length} words
            </div>
            <button
              onClick={handlePredict}
              disabled={!resumeText.trim()}
              className="btn-submit"
              style={{ width: '100%', marginTop: 16, padding: 14, fontSize: 15 }}
            >
              🎯 Predict My Best Roles
            </button>
          </div>

          {/* Results */}
          {analyzed && results && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                🏆 Your Top 5 Best-Fit Roles
              </div>

              {results.map((role, i) => {
                const color = getColor(role.score);
                return (
                  <div key={role.title} style={{
                    background: 'var(--card)', border: `1px solid ${i === 0 ? color : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                    boxShadow: i === 0 ? `0 0 20px ${color}22` : 'none',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    {i === 0 && (
                      <div style={{
                        position: 'absolute', top: 0, right: 0,
                        background: color, color: '#fff', fontSize: 11, fontWeight: 700,
                        padding: '4px 14px', borderBottomLeftRadius: 10
                      }}>BEST MATCH</div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>{getMedal(i)}</span>
                          <span>{role.icon}</span>
                          <span>{role.title}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{role.desc}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>
                          {role.score}%
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>match</div>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div style={{ height: 6, borderRadius: 3, background: 'var(--bg3)', marginBottom: 12 }}>
                      <div style={{ height: '100%', borderRadius: 3, width: `${role.score}%`, background: color, transition: 'width 1s ease' }} />
                    </div>

                    {/* Matched keywords */}
                    {role.matchedKeywords.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {role.matchedKeywords.slice(0, 6).map(kw => (
                          <span key={kw} style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 11,
                            background: `${color}18`, color, border: `1px solid ${color}33`
                          }}>{kw}</span>
                        ))}
                        {role.matchedKeywords.length > 6 && (
                          <span style={{ fontSize: 11, color: 'var(--text-dim)', padding: '3px 8px' }}>
                            +{role.matchedKeywords.length - 6} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <div style={{
                background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 'var(--radius)', padding: '14px 18px', fontSize: 13, color: 'var(--text-muted)'
              }}>
                💡 <strong style={{ color: 'var(--text)' }}>Tip:</strong> Use the Skill Gap Roadmap to see exactly what skills you need to boost your match score for your target role.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
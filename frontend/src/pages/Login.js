import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">
            <div className="auth-logo-icon">📊</div>
            <span className="auth-logo-text">ResumeRanker</span>
          </div>
          <h1 className="auth-headline">Rank Smarter.<br />Hire Better.</h1>
          <p className="auth-subtext">
            AI-powered resume analysis that scores candidates instantly —
            so you spend time on people, not paperwork.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-icon">⚡</span>
              <div>
                <strong>Instant scoring</strong>
                Upload a resume, get a match score in seconds
              </div>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">🎯</span>
              <div>
                <strong>Keyword analysis</strong>
                Matches skills from your job description automatically
              </div>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">📈</span>
              <div>
                <strong>Track everything</strong>
                Dashboard with full candidate pipeline overview
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-subtitle">Sign in to your ResumeRanker account</p>

          {error && <div className="error-msg">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="form-input"
                type="email" name="email"
                placeholder="you@company.com"
                value={form.email} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password" name="password"
                placeholder="••••••••"
                value={form.password} onChange={handleChange} required
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

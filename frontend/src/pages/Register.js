import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters'); setLoading(false); return;
    }
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
          <h1 className="auth-headline">Start ranking<br />in minutes.</h1>
          <p className="auth-subtext">
            Join hundreds of recruiters who use ResumeRanker to
            find top talent faster with data-driven insights.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-icon">🔓</span>
              <div><strong>Free to start</strong>No credit card required</div>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">🔒</span>
              <div><strong>Secure & private</strong>Your data is encrypted</div>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">🚀</span>
              <div><strong>Ready in 30 seconds</strong>Start analyzing immediately</div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-subtitle">Get started with ResumeRanker for free</p>

          {error && <div className="error-msg">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input
                className="form-input" type="text" name="name"
                placeholder="Alex Johnson" value={form.name}
                onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Work email</label>
              <input
                className="form-input" type="email" name="email"
                placeholder="you@company.com" value={form.email}
                onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input" type="password" name="password"
                placeholder="Min. 6 characters" value={form.password}
                onChange={handleChange} required
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = [
    { to: '/dashboard',  icon: '🏠', label: 'Dashboard' },
    { to: '/analyze',    icon: '✨', label: 'Analyze Resume' },
    { to: '/compare',    icon: '⚖️', label: 'Compare' },
    { to: '/analytics',  icon: '📊', label: 'Analytics' },
    { to: '/templates',  icon: '📄', label: 'Templates' },
    { to: '/profile',    icon: '👤', label: 'Profile' },
    null, // divider
    { to: '/predictor',  icon: '🎯', label: 'Job Predictor' },
    { to: '/roadmap',    icon: '🧩', label: 'Skill Roadmap' },
    { to: '/interview',  icon: '🎤', label: 'Mock Interview' },
    { to: '/ats',        icon: '🌍', label: 'ATS Checker' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📊</div>
        <span className="sidebar-logo-text">ResumeRanker</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link, i) =>
          link === null ? (
            <div key={`div-${i}`} style={{
              height: 1, background: 'var(--border)',
              margin: '8px 4px', opacity: 0.6
            }} />
          ) : (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              {link.label}
            </Link>
          )
        )}
      </nav>

      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme} style={{ margin: '16px 0 12px' }}>
        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div className="sidebar-user">
        <div className="sidebar-user-name">{user?.name}</div>
        <div className="sidebar-user-email">{user?.email}</div>
        <button className="sidebar-logout" onClick={handleLogout}>🚪 Sign out</button>
      </div>
    </aside>
  );
}
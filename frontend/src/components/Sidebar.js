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
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📊</div>
        <span className="sidebar-logo-text">ResumeRanker</span>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{icon}</span> {label}
          </Link>
        ))}
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
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  const [pass, setPass] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });
  const [passLoading, setPassLoading] = useState(false);

  const handleProfileSave = async e => {
    e.preventDefault();
    setProfileLoading(true); setProfileMsg({ text: '', type: '' });
    try {
      await axios.patch('/api/auth/profile', profile);
      setProfileMsg({ text: '✅ Profile updated successfully!', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: `⚠️ ${err.response?.data?.error || 'Update failed'}`, type: 'error' });
    } finally { setProfileLoading(false); }
  };

  const handlePasswordSave = async e => {
    e.preventDefault();
    if (pass.newPassword !== pass.confirmPassword) {
      setPassMsg({ text: '⚠️ New passwords do not match', type: 'error' }); return;
    }
    if (pass.newPassword.length < 6) {
      setPassMsg({ text: '⚠️ New password must be at least 6 characters', type: 'error' }); return;
    }
    setPassLoading(true); setPassMsg({ text: '', type: '' });
    try {
      await axios.patch('/api/auth/password', {
        currentPassword: pass.currentPassword,
        newPassword: pass.newPassword
      });
      setPassMsg({ text: '✅ Password changed successfully!', type: 'success' });
      setPass({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMsg({ text: `⚠️ ${err.response?.data?.error || 'Failed to change password'}`, type: 'error' });
    } finally { setPassLoading(false); }
  };

  const cardStyle = {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginBottom: 24
  };
  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 'var(--radius)',
    background: 'var(--bg2)', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: 15, outline: 'none',
    fontFamily: 'var(--font-body)', transition: 'border-color 0.2s'
  };

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content" style={{ maxWidth: 680 }}>
        <h1 className="page-title">👤 Profile</h1>
        <p className="page-subtitle">Manage your account details and password.</p>

        {/* ── Avatar + Info ── */}
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, color: '#fff', flexShrink: 0,
            fontFamily: 'var(--font-display)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{user?.name}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{user?.email}</div>
            <div style={{ marginTop: 8 }}>
              <span className="status-badge status-analyzed">Active Account</span>
            </div>
          </div>
        </div>

        {/* ── Update Profile ── */}
        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 20 }}>
            ✏️ Update Profile
          </div>
          {profileMsg.text && (
            <div className={profileMsg.type === 'success' ? 'success-msg' : 'error-msg'} style={{ marginBottom: 16 }}>
              {profileMsg.text}
            </div>
          )}
          <form onSubmit={handleProfileSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                style={inputStyle}
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                required
                placeholder="Your full name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                style={inputStyle}
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                required
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={profileLoading}
              className="btn-submit"
              style={{ marginTop: 8 }}
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* ── Change Password ── */}
        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 20 }}>
            🔒 Change Password
          </div>
          {passMsg.text && (
            <div className={passMsg.type === 'success' ? 'success-msg' : 'error-msg'} style={{ marginBottom: 16 }}>
              {passMsg.text}
            </div>
          )}
          <form onSubmit={handlePasswordSave}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                style={inputStyle}
                type="password"
                value={pass.currentPassword}
                onChange={e => setPass({ ...pass, currentPassword: e.target.value })}
                required
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                style={inputStyle}
                type="password"
                value={pass.newPassword}
                onChange={e => setPass({ ...pass, newPassword: e.target.value })}
                required
                placeholder="Min. 6 characters"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                style={inputStyle}
                type="password"
                value={pass.confirmPassword}
                onChange={e => setPass({ ...pass, confirmPassword: e.target.value })}
                required
                placeholder="Re-enter new password"
              />
            </div>
            <button
              type="submit"
              disabled={passLoading}
              className="btn-submit"
              style={{ marginTop: 8 }}
            >
              {passLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
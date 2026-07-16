import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { addToast } = useNotification();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '', bio: '', title: '', location: '',
    website: '', github: '', linkedin: '', twitter: '', avatar: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        title: user.title || '',
        location: user.location || '',
        website: user.website || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        avatar: user.avatar || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be under 5MB', 'error');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Delete old avatar if exists
      if (form.avatar && form.avatar.includes('/uploads/')) {
        const oldFilename = form.avatar.split('/uploads/')[1];
        if (oldFilename) {
          await api.delete('/upload', { data: { filename: oldFilename } }).catch(() => {});
        }
      }

      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newForm = { ...form, avatar: res.data.url };
      setForm(newForm);

      // Save to backend
      const updateRes = await api.put('/profile', { avatar: res.data.url });
      updateUser(updateRes.data);
      addToast('Profile image updated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!form.avatar) return;

    try {
      if (form.avatar.includes('/uploads/')) {
        const filename = form.avatar.split('/uploads/')[1];
        if (filename) await api.delete('/upload', { data: { filename } }).catch(() => {});
      }
      const newForm = { ...form, avatar: '' };
      setForm(newForm);
      const updateRes = await api.put('/profile', { avatar: '' });
      updateUser(updateRes.data);
      addToast('Avatar removed', 'success');
    } catch {
      addToast('Failed to remove avatar', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      const res = await api.put('/profile', form);
      updateUser(res.data);
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword) errs.currentPassword = 'Required';
    if (!passwordForm.newPassword) errs.newPassword = 'Required';
    else if (passwordForm.newPassword.length < 6) errs.newPassword = 'Min 6 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingPassword(true);
    try {
      await api.put('/profile/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      addToast('Password changed successfully', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/profile');
      addToast('Account deleted', 'success');
      await logout();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete account', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  const tabs = [
    { id: 'general', label: 'General', icon: 'fa-solid fa-user' },
    { id: 'social', label: 'Social Links', icon: 'fa-solid fa-link' },
    { id: 'security', label: 'Security', icon: 'fa-solid fa-shield' },
    { id: 'danger', label: 'Danger Zone', icon: 'fa-solid fa-triangle-exclamation' },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Profile Settings</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Manage your personal information</p>

      {/* Avatar Section */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: form.avatar ? `url(${form.avatar}) center/cover` : 'var(--card2)',
            border: '3px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {!form.avatar && <i className="fa-solid fa-user" style={{ fontSize: 30, color: 'var(--muted)' }} />}
            {uploading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-spinner" style={{ animation: 'spin 0.8s linear infinite', color: '#fff' }} />
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Profile Photo</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
            <button className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <i className="fa-solid fa-upload" /> Upload
            </button>
            {form.avatar && (
              <button className="btn btn-danger btn-sm" onClick={handleRemoveAvatar} disabled={uploading}>
                <i className="fa-solid fa-trash" /> Remove
              </button>
            )}
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}>JPG, PNG or WebP. Max 5MB.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0, flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setErrors({}); }}
            style={{
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 450,
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'var(--transition)'
            }}
          >
            <i className={tab.icon} style={{ fontSize: 12 }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="card animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label>Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" style={errors.name ? { borderColor: 'var(--red)' } : {}} />
              {errors.name && <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, display: 'block' }}>{errors.name}</span>}
            </div>
            <div>
              <label>Professional Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter your professional title" />
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <label>Location</label>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Enter your location" />
          </div>
          <div style={{ marginTop: 18 }}>
            <label>Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell people about yourself..." rows={4} />
            <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              {form.bio.length}/500
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? <><i className="fa-solid fa-spinner" style={{ animation: 'spin 0.8s linear infinite' }} /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Social Tab */}
      {activeTab === 'social' && (
        <form onSubmit={handleSave} className="card animate-fade-in">
          {[
            { key: 'website', label: 'Website', icon: 'fa-solid fa-globe', placeholder: 'https://yoursite.com' },
            { key: 'github', label: 'GitHub', icon: 'fa-brands fa-github', placeholder: 'https://github.com/username' },
            { key: 'linkedin', label: 'LinkedIn', icon: 'fa-brands fa-linkedin', placeholder: 'https://linkedin.com/in/username' },
            { key: 'twitter', label: 'Twitter / X', icon: 'fa-brands fa-x-twitter', placeholder: 'https://x.com/username' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 18 }}>
              <label><i className={field.icon} style={{ marginRight: 6, color: 'var(--muted)' }} />{field.label}</label>
              <input value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} />
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? <><i className="fa-solid fa-spinner" style={{ animation: 'spin 0.8s linear infinite' }} /> Saving...</> : 'Save Links'}
            </button>
          </div>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordChange} className="card animate-fade-in">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Change Password</h3>
          <div style={{ marginBottom: 18 }}>
            <label>Current Password</label>
            <input type="password" value={passwordForm.currentPassword} onChange={e => { setPasswordForm({ ...passwordForm, currentPassword: e.target.value }); setErrors(p => ({ ...p, currentPassword: '' })); }} style={errors.currentPassword ? { borderColor: 'var(--red)' } : {}} />
            {errors.currentPassword && <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, display: 'block' }}>{errors.currentPassword}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label>New Password</label>
              <input type="password" value={passwordForm.newPassword} onChange={e => { setPasswordForm({ ...passwordForm, newPassword: e.target.value }); setErrors(p => ({ ...p, newPassword: '' })); }} style={errors.newPassword ? { borderColor: 'var(--red)' } : {}} />
              {errors.newPassword && <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, display: 'block' }}>{errors.newPassword}</span>}
            </div>
            <div>
              <label>Confirm New Password</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={e => { setPasswordForm({ ...passwordForm, confirmPassword: e.target.value }); setErrors(p => ({ ...p, confirmPassword: '' })); }} style={errors.confirmPassword ? { borderColor: 'var(--red)' } : {}} />
              {errors.confirmPassword && <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, display: 'block' }}>{errors.confirmPassword}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-primary" type="submit" disabled={savingPassword}>
              {savingPassword ? <><i className="fa-solid fa-spinner" style={{ animation: 'spin 0.8s linear infinite' }} /> Updating...</> : 'Update Password'}
            </button>
          </div>
        </form>
      )}

      {/* Danger Zone */}
      {activeTab === 'danger' && (
        <div className="card animate-fade-in" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--red)', marginBottom: 8 }}>Danger Zone</h3>
          <p style={{ fontSize: 14, color: 'var(--fg2)', lineHeight: 1.6, marginBottom: 18 }}>
            Once you delete your account, there is no going back. All your projects, skills, and profile data will be permanently removed.
          </p>
          <button className="btn btn-danger" onClick={() => setShowDeleteDialog(true)}>
            <i className="fa-solid fa-trash" /> Delete My Account
          </button>
        </div>
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Account Permanently"
        message="This action cannot be undone. All your data will be lost forever."
        confirmText="Yes, delete my account"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteDialog(false)}
        danger
      />

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
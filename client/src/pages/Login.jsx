import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import BackgroundAnimation from '../components/BackgroundAnimation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#f1f5f9', position: 'relative' }}>
      <BackgroundAnimation />
      <div className="card animate-fade-in" style={{ maxWidth: 420, width: '100%', position: 'relative', zIndex: 1, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 18, boxShadow: '0 4px 16px rgba(217, 119, 6, 0.3)'
          }}>
            <i className="fa-solid fa-briefcase" style={{ fontSize: 24, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>Sign in to manage your portfolio</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }} placeholder="you@example.com" style={errors.email ? { borderColor: 'var(--red)' } : {}} />
            {errors.email && <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, display: 'block' }}>{errors.email}</span>}
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }} placeholder="Enter your password" style={errors.password ? { borderColor: 'var(--red)' } : {}} />
            {errors.password && <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, display: 'block' }}>{errors.password}</span>}
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <><i className="fa-solid fa-spinner" style={{ animation: 'spin 0.8s linear infinite' }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13.5, color: '#94a3b8' }}>
          Don't have an account? <Link to="/register" style={{ color: '#d97706', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
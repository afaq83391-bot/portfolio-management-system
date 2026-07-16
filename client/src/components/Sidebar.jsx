import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: 'fa-solid fa-th-large', label: 'Dashboard' },
  { to: '/profile', icon: 'fa-solid fa-user-circle', label: 'Profile' },
  { to: '/projects', icon: 'fa-solid fa-layer-group', label: 'Projects' },
  { to: '/skills', icon: 'fa-solid fa-shapes', label: 'Skills' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRight: '1.5px solid #e2e8f0' }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1.5px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #d97706, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(217,119,6,0.3)' }}>
            <i className="fa-solid fa-briefcase" style={{ color: '#fff', fontSize: 15 }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>Portfolio</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Management System</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.2px', padding: '4px 14px 10px' }}>Navigation</div>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onClose} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
            fontSize: 14, fontWeight: isActive ? 600 : 450, color: isActive ? '#d97706' : '#475569',
            background: isActive ? 'rgba(217,119,6,0.08)' : 'transparent', marginBottom: 2, transition: 'all 0.15s ease'
          })}>
            <i className={item.icon} style={{ width: 20, textAlign: 'center', fontSize: 15 }} />
            {item.label}
          </NavLink>
        ))}

        <div style={{ height: 1, background: '#f1f5f9', margin: '12px 14px' }} />

        <NavLink to="/preview" onClick={onClose} style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
          fontSize: 14, fontWeight: isActive ? 600 : 450, color: isActive ? '#d97706' : '#475569',
          background: isActive ? 'rgba(217,119,6,0.08)' : 'transparent', marginBottom: 2, transition: 'all 0.15s ease'
        })}>
          <i className="fa-solid fa-eye" style={{ width: 20, textAlign: 'center', fontSize: 15 }} />
          Live Preview
          <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'rgba(217,119,6,0.1)', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live</span>
        </NavLink>
      </nav>

      <div style={{ padding: 16, borderTop: '1.5px solid #e2e8f0', background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '10px 12px', background: '#fff', borderRadius: 10, border: '1.5px solid #e2e8f0' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: user?.avatar ? `url(${user.avatar}) center/cover` : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', border: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {!user?.avatar && <i className="fa-solid fa-user" style={{ fontSize: 13, color: '#94a3b8' }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          </div>
        </div>
        <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 12 }} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside style={{ width: 270, minWidth: 270, display: 'block' }}>{sidebarContent}</aside>
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 8000, animation: 'fadeIn 0.15s ease' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
          <aside style={{ position: 'relative', width: 290, height: '100%', boxShadow: '8px 0 32px rgba(0,0,0,0.12)', animation: 'slideInRight 0.2s ease' }}>{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}
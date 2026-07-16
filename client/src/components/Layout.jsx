import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BackgroundAnimation from './BackgroundAnimation';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <BackgroundAnimation />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <header style={{
          display: 'none', alignItems: 'center',
          padding: '12px 16px', borderBottom: '1.5px solid #e2e8f0',
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)'
        }}>
          <button className="btn btn-ghost" onClick={() => setMobileOpen(true)} style={{ marginRight: 8 }}>
            <i className="fa-solid fa-bars" />
          </button>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#d97706' }}>Portfolio</span>
        </header>
        <main style={{ flex: 1, overflow: 'auto', padding: 28 }}>
          <div className="animate-fade-in"><Outlet /></div>
        </main>
      </div>
      <style>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
          header { display: flex !important; }
          main { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}
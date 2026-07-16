import { useState } from 'react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Delete', danger = true }) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(241, 245, 249, 0.7)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9000, animation: 'fadeIn 0.15s ease'
    }} onClick={onCancel}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 400, width: '90%',
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 14,
          padding: 28,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          animation: 'fadeIn 0.2s ease'
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: danger ? '#fff5f5' : '#f8fafc',
          border: danger ? '1.5px solid #fecaca' : '1.5px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18
        }}>
          <i className={`fa-solid ${danger ? 'fa-triangle-exclamation' : 'fa-circle-info'}`} style={{ fontSize: 20, color: danger ? '#dc2626' : '#64748b' }} />
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>{title}</h3>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 24, fontFamily: 'Inter, sans-serif' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '9px 20px', fontSize: 13, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              background: '#ffffff', color: '#475569',
              border: '1.5px solid #e2e8f0', borderRadius: 8,
              cursor: 'pointer', transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            Cancel
          </button>
          <button
            className={danger ? 'btn btn-danger' : 'btn btn-primary'}
            onClick={handleConfirm}
            disabled={loading}
            style={{
              padding: '9px 20px', fontSize: 13, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              background: danger ? '#dc2626' : '#d97706',
              color: '#ffffff', border: 'none', borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease', opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {loading
              ? <><i className="fa-solid fa-spinner" style={{ animation: 'spin 0.8s linear infinite' }} /> Processing...</>
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

let toastId = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);

    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  return (
    <NotificationContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 380
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              padding: '12px 18px',
              borderRadius: 8,
              fontSize: 13.5,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animation: toast.exiting ? 'toastOut 0.3s ease forwards' : 'toastIn 0.3s ease forwards',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              background: toast.type === 'success' ? 'var(--green)' :
                         toast.type === 'error' ? 'var(--red)' :
                         toast.type === 'warning' ? 'var(--orange)' : 'var(--blue)',
              color: toast.type === 'warning' ? '#000' : '#fff'
            }}
          >
            <i className={`fa-solid ${
              toast.type === 'success' ? 'fa-check-circle' :
              toast.type === 'error' ? 'fa-exclamation-circle' :
              toast.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-info-circle'
            }`} />
            {toast.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
}
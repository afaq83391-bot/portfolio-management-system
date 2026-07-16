export default function LoadingSpinner({ size = 40, text = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: '60px 20px'
    }}>
      <div style={{
        width: size,
        height: size,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      {text && <span style={{ color: 'var(--muted)', fontSize: 14 }}>{text}</span>}
    </div>
  );
}
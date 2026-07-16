export default function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      animation: 'fadeIn 0.4s ease'
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'var(--accent-dim)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
      }}>
        <i className={icon || 'fa-solid fa-inbox'} style={{
          fontSize: 28,
          color: 'var(--accent)',
          opacity: 0.7
        }} />
      </div>
      <h3 style={{
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 8,
        color: 'var(--fg)'
      }}>{title}</h3>
      {description && (
        <p style={{
          fontSize: 14,
          color: 'var(--muted)',
          maxWidth: 360,
          lineHeight: 1.6,
          marginBottom: 20
        }}>{description}</p>
      )}
      {action && action}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

const techColors = {
  react: '#61dafb', reactjs: '#61dafb', nextjs: '#ffffff', next: '#ffffff',
  node: '#339933', nodejs: '#339933', express: '#ffffff', expressjs: '#ffffff',
  mongodb: '#47a248', mongo: '#47a248', mongoose: '#880000',
  javascript: '#f7df1e', js: '#f7df1e', typescript: '#3178c6', ts: '#3178c6',
  python: '#3776ab', py: '#3776ab', django: '#092e20', flask: '#ffffff',
  html: '#e34f26', css: '#1572b6', sass: '#cc6699', scss: '#cc6699',
  tailwind: '#06b6d4', tailwindcss: '#06b6d4', bootstrap: '#7952b3',
  vue: '#4fc08d', vuejs: '#4fc08d', angular: '#dd0031',
  firebase: '#ffca28', aws: '#ff9900', docker: '#2496ed',
  git: '#f05032', github: '#ffffff', graphql: '#e10098',
  redux: '#764abc', socket: '#010101', socketio: '#010101',
  postgresql: '#4169e1', postgres: '#4169e1', mysql: '#4479a1',
  redis: '#dc382d', cpp: '#00599c', 'c++': '#00599c',
  java: '#ed8b00', rust: '#ce422b', go: '#00add8', golang: '#00add8',
  php: '#777bb4', laravel: '#ff2d20', ruby: '#cc342d', rails: '#cc342d',
  swift: '#fa7343', kotlin: '#7f52ff', flutter: '#02569b',
  figma: '#f24e1e'
};

function getTechColor(tech) {
  const t = tech.toLowerCase().replace(/[^a-z+#]/g, '').replace(/\+/g, 'p');
  if (techColors[t]) return techColors[t];
  if (techColors[tech.toLowerCase()]) return techColors[tech.toLowerCase()];
  // Generate consistent color from string
  let hash = 0;
  for (let i = 0; i < tech.length; i++) hash = tech.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ['#6366f1','#8b5cf6','#a855f7','#d946ef','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6'];
  return colors[Math.abs(hash) % colors.length];
}

function isLightColor(hex) {
  if (!hex || hex === '#ffffff' || hex === '#fff') return true;
  const c = hex.replace('#', '');
  if (c.length !== 6) return false;
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export default function Projects() {
  const { addToast } = useNotification();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchProjects(); }, [filter]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      const res = await api.get('/projects', { params });
      setProjects(res.data.projects);
    } catch { addToast('Failed to load projects', 'error'); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.images?.length) {
        for (const img of deleteTarget.images) {
          if (img.includes('/uploads/')) {
            const filename = img.split('/uploads/')[1];
            if (filename) await api.delete('/upload', { data: { filename } }).catch(() => {});
          }
        }
      }
      await api.delete(`/projects/${deleteTarget._id}`);
      setProjects(prev => prev.filter(p => p._id !== deleteTarget._id));
      addToast('Project deleted successfully', 'success');
    } catch { addToast('Failed to delete project', 'error'); } finally { setDeleting(false); setDeleteTarget(null); }
  };

  const statusConfig = {
    'completed': { label: 'Completed', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', dot: '#059669', icon: 'fa-solid fa-circle-check' },
    'in-progress': { label: 'In Progress', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', dot: '#2563eb', icon: 'fa-solid fa-arrows-rotate' },
    'planned': { label: 'Planned', bg: '#fffbeb', color: '#d97706', border: '#fde68a', dot: '#d97706', icon: 'fa-solid fa-clock' },
  };

  if (loading) return <LoadingSpinner text="Loading projects..." />;

  const filterBtnStyle = (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 16px', fontSize: 12.5, fontWeight: active ? 600 : 500,
    fontFamily: 'Inter, sans-serif',
    background: active ? '#d97706' : '#ffffff',
    color: active ? '#ffffff' : '#475569',
    border: active ? '1.5px solid #d97706' : '1.5px solid #e2e8f0',
    borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s ease',
    boxShadow: active ? '0 1px 3px rgba(217,119,6,0.2)' : 'none'
  });

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 3 }}>Projects</h1>
          <p style={{ color: '#94a3b8', fontSize: 13.5 }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
            {filter !== 'all' && <span style={{ color: '#d97706', fontWeight: 500 }}> · {statusConfig[filter]?.label || filter}</span>}
          </p>
        </div>
        <Link to="/projects/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '9px 20px', fontSize: 13, fontWeight: 500,
          background: '#d97706', color: '#fff', border: 'none',
          borderRadius: 8, cursor: 'pointer', textDecoration: 'none',
          boxShadow: '0 1px 3px rgba(217,119,6,0.25)',
          fontFamily: 'Inter, sans-serif'
        }}>
          <i className="fa-solid fa-plus" style={{ fontSize: 11 }} /> New Project
        </Link>
      </div>

      {/* Filters & View Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Projects', count: null },
            { key: 'completed', label: 'Completed', count: null },
            { key: 'in-progress', label: 'In Progress', count: null },
            { key: 'planned', label: 'Planned', count: null },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={filterBtnStyle(filter === f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        {projects.length > 0 && (
          <div style={{ display: 'flex', gap: 2, background: '#f1f5f9', borderRadius: 8, padding: 3 }}>
            <button onClick={() => setView('grid')} style={{
              padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: view === 'grid' ? '#ffffff' : 'transparent',
              boxShadow: view === 'grid' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}>
              <i className="fa-solid fa-grid-2" style={{ fontSize: 13, color: view === 'grid' ? '#0f172a' : '#94a3b8' }} />
            </button>
            <button onClick={() => setView('list')} style={{
              padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: view === 'list' ? '#ffffff' : 'transparent',
              boxShadow: view === 'list' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}>
              <i className="fa-solid fa-list" style={{ fontSize: 13, color: view === 'list' ? '#0f172a' : '#94a3b8' }} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <EmptyState
          icon="fa-solid fa-folder-open"
          title="No projects yet"
          description={filter === 'all' ? 'Start building your portfolio by adding your first project.' : `No ${statusConfig[filter]?.label?.toLowerCase() || ''} projects found.`}
          action={filter === 'all' && (
            <Link to="/projects/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 22px', fontSize: 13, fontWeight: 500,
              background: '#d97706', color: '#fff', border: 'none',
              borderRadius: 8, cursor: 'pointer', textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(217,119,6,0.25)',
              fontFamily: 'Inter, sans-serif'
            }}>
              <i className="fa-solid fa-plus" style={{ fontSize: 11 }} /> Create Your First Project
            </Link>
          )}
        />
      ) : view === 'grid' ? (
        /* Grid View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {projects.map((project, i) => {
            const st = statusConfig[project.status] || statusConfig['planned'];
            return (
              <div key={project._id} className="animate-fade-in" style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                animationDelay: `${i * 0.04}s`
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: project.images?.[0] ? 180 : 0, background: project.images?.[0] ? `url(${project.images[0]}) center/cover` : 'none', overflow: 'hidden' }}>
                  {project.images?.[0] && (
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)' }} />
                  )}
                  {/* Top badges */}
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', borderRadius: 20, fontSize: 10.5, fontWeight: 600,
                      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                      color: st.color, border: `1px solid ${st.border}`,
                      textTransform: 'uppercase', letterSpacing: '0.3px',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      <i className={st.icon} style={{ fontSize: 9 }} />
                      {st.label}
                    </span>
                    {project.featured && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', borderRadius: 20, fontSize: 10.5, fontWeight: 600,
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                        color: '#ea580c', border: '1px solid #fed7aa',
                        textTransform: 'uppercase', letterSpacing: '0.3px',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        <i className="fa-solid fa-star" style={{ fontSize: 9 }} /> Featured
                      </span>
                    )}
                  </div>
                  {/* Image count */}
                  {project.images?.length > 1 && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '4px 8px', borderRadius: 6, fontSize: 10.5, fontWeight: 600,
                      background: 'rgba(0,0,0,0.55)', color: '#fff',
                      backdropFilter: 'blur(4px)', fontFamily: 'Inter, sans-serif'
                    }}>
                      <i className="fa-solid fa-images" style={{ fontSize: 9 }} /> {project.images.length}
                    </div>
                  )}
                </div>

                {/* No image placeholder */}
                {!project.images?.[0] && (
                  <div style={{ height: 8, background: `linear-gradient(90deg, ${st.color}40, ${st.color}20)`, borderBottom: '1px solid #f1f5f9' }} />
                )}

                {/* Content */}
                <div style={{ padding: '18px 20px 16px' }}>
                  {/* Title row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', lineHeight: 1.3, flex: 1 }}>
                      {project.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: 13, color: '#64748b', lineHeight: 1.55, marginBottom: 16,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {project.shortDesc || project.description}
                  </p>

                  {/* Tech Stack */}
                  {project.technologies?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                        Tech Stack
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {project.technologies.map((tech, idx) => {
                          const tc = getTechColor(tech);
                          const light = isLightColor(tc);
                          return (
                            <span key={idx} style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '4px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 500,
                              background: light ? `${tc}18` : `${tc}15`,
                              color: light ? '#334155' : tc,
                              border: `1px solid ${tc}25`,
                              fontFamily: 'Inter, sans-serif',
                              transition: 'all 0.15s ease',
                              cursor: 'default'
                            }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = `${tc}50`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = `${tc}25`; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                              <div style={{
                                width: 14, height: 14, borderRadius: 3,
                                background: tc,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                border: light ? '1px solid #e2e8f0' : 'none'
                              }}>
                                {light && <span style={{ fontSize: 7, fontWeight: 800, color: '#334155', lineHeight: 1 }}>{tech.charAt(0).toUpperCase()}</span>}
                              </div>
                              {tech}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {(project.githubUrl || project.liveUrl) && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '5px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 500,
                          background: '#f8fafc', color: '#334155',
                          border: '1px solid #e2e8f0', textDecoration: 'none',
                          fontFamily: 'Inter, sans-serif', transition: 'all 0.15s ease'
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        >
                          <i className="fa-brands fa-github" style={{ fontSize: 13 }} /> GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '5px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 500,
                          background: '#f8fafc', color: '#334155',
                          border: '1px solid #e2e8f0', textDecoration: 'none',
                          fontFamily: 'Inter, sans-serif', transition: 'all 0.15s ease'
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 11 }} /> Live Demo
                        </a>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: 14, borderTop: '1px solid #f1f5f9'
                  }}>
                    <span style={{ fontSize: 11.5, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/projects/${project._id}/edit`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                        background: '#f8fafc', color: '#475569',
                        border: '1px solid #e2e8f0', textDecoration: 'none',
                        fontFamily: 'Inter, sans-serif', transition: 'all 0.15s ease'
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#d97706'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#d97706'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      >
                        <i className="fa-solid fa-pen" style={{ fontSize: 10 }} /> Edit
                      </Link>
                      <button onClick={() => setDeleteTarget(project)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                        background: '#fff5f5', color: '#dc2626',
                        border: '1px solid #fecaca', cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif', transition: 'all 0.15s ease'
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#dc2626'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fecaca'; }}
                      >
                        <i className="fa-solid fa-trash" style={{ fontSize: 10 }} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div style={{
          background: '#ffffff', border: '1.5px solid #e2e8f0',
          borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                {['Project', 'Status', 'Tech Stack', 'Links', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '11px 16px',
                    fontSize: 10.5, fontWeight: 600, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.6px',
                    fontFamily: 'Inter, sans-serif'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => {
                const st = statusConfig[project.status] || statusConfig['planned'];
                return (
                  <tr key={project._id} style={{
                    borderBottom: i < projects.length - 1 ? '1px solid #f1f5f9' : 'none',
                    transition: 'background 0.12s ease'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
                          background: project.images?.[0] ? `url(${project.images[0]}) center/cover` : '#f1f5f9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid #e2e8f0'
                        }}>
                          {!project.images?.[0] && <i className="fa-solid fa-folder" style={{ fontSize: 14, color: '#cbd5e1' }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 500, color: '#0f172a', marginBottom: 2 }}>{project.title}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {project.shortDesc || project.description?.slice(0, 60)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                        textTransform: 'capitalize', fontFamily: 'Inter, sans-serif',
                        whiteSpace: 'nowrap'
                      }}>
                        <i className={st.icon} style={{ fontSize: 9 }} /> {st.label}
                      </span>
                      {project.featured && (
                        <span style={{
                          display: 'inline-flex', marginLeft: 4,
                          padding: '3px 7px', borderRadius: 20, fontSize: 9, fontWeight: 600,
                          background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          <i className="fa-solid fa-star" style={{ fontSize: 7 }} />
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 260 }}>
                        {project.technologies?.slice(0, 4).map((tech, idx) => {
                          const tc = getTechColor(tech);
                          const light = isLightColor(tc);
                          return (
                            <span key={idx} style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 500,
                              background: light ? `${tc}15` : `${tc}12`,
                              color: light ? '#334155' : tc,
                              border: `1px solid ${tc}20`,
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              <div style={{
                                width: 12, height: 12, borderRadius: 2.5,
                                background: tc,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: light ? '1px solid #e2e8f0' : 'none'
                              }}>
                                {light && <span style={{ fontSize: 6, fontWeight: 800, color: '#334155', lineHeight: 1 }}>{tech.charAt(0).toUpperCase()}</span>}
                              </div>
                              {tech}
                            </span>
                          );
                        })}
                        {(project.technologies?.length || 0) > 4 && (
                          <span style={{ padding: '2px 6px', fontSize: 10.5, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>+{project.technologies.length - 4}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ width: 28, height: 28, borderRadius: 6, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.12s ease' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                            <i className="fa-brands fa-github" style={{ fontSize: 12, color: '#475569' }} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ width: 28, height: 28, borderRadius: 6, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.12s ease' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                            <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 10, color: '#475569' }} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
                        {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Link to={`/projects/${project._id}/edit`} style={{ width: 28, height: 28, borderRadius: 6, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.12s ease' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#d97706'; e.currentTarget.style.borderColor = '#d97706'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        >
                          <i className="fa-solid fa-pen" style={{ fontSize: 10, color: '#475569' }} />
                        </Link>
                        <button onClick={() => setDeleteTarget(project)} style={{ width: 28, height: 28, borderRadius: 6, background: '#fff5f5', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.12s ease' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.borderColor = '#dc2626'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.borderColor = '#fecaca'; }}
                        >
                          <i className="fa-solid fa-trash" style={{ fontSize: 10, color: '#dc2626' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone and all associated images will be permanently removed.`}
        confirmText="Delete Project"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(auto-fill, minmax(340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
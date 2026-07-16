import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

/* ── Animated SVG Icons ── */
const IconTotalProjects = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="4" y="14" width="16" height="14" rx="2.5" fill="#92400e" opacity="0.2">
      <animate attributeName="opacity" values="0.2;0.35;0.2" dur="3s" repeatCount="indefinite" />
    </rect>
    <rect x="12" y="8" width="16" height="14" rx="2.5" fill="#d97706" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.6;0.4" dur="3s" repeatCount="indefinite" begin="0.3s" />
    </rect>
    <rect x="20" y="2" width="16" height="14" rx="2.5" fill="#d97706">
      <animateTransform attributeName="transform" type="translate" values="0,0;-1,-1;0,0" dur="4s" repeatCount="indefinite" />
    </rect>
    <rect x="23" y="5" width="10" height="2" rx="1" fill="#fffbeb" opacity="0.8" />
    <rect x="23" y="9" width="7" height="2" rx="1" fill="#fffbeb" opacity="0.5" />
  </svg>
);

const IconCompleted = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="16" fill="#059669" opacity="0.12">
      <animate attributeName="r" values="16;17;16" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="20" cy="20" r="13" fill="#059669" opacity="0.2">
      <animate attributeName="r" values="13;14;13" dur="2.5s" repeatCount="indefinite" begin="0.2s" />
    </circle>
    <circle cx="20" cy="20" r="10" fill="#059669" />
    <path d="M14 20L18 24L26 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="20" strokeDashoffset="20">
      <animate attributeName="stroke-dashoffset" values="20;0;0;20" keyTimes="0;0.3;0.7;1" dur="2.5s" repeatCount="indefinite" />
    </path>
  </svg>
);

const IconInProgress = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="16" fill="#2563eb" opacity="0.1">
      <animate attributeName="opacity" values="0.1;0.18;0.1" dur="3s" repeatCount="indefinite" />
    </circle>
    <path d="M20 6A14 14 0 0 1 34 20" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="22" strokeDashoffset="22">
      <animate attributeName="stroke-dashoffset" values="22;0" dur="1s" fill="freeze" />
      <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="3s" repeatCount="indefinite" />
    </path>
    <path d="M20 34A14 14 0 0 1 6 20" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.3" strokeDasharray="22" strokeDashoffset="0">
      <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="3s" repeatCount="indefinite" />
    </path>
    <circle cx="20" cy="20" r="4" fill="#2563eb">
      <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="3s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const IconFeatured = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M20 4L24.5 14.5L36 16L28 23.5L29.5 35L20 30L10.5 35L12 23.5L4 16L15.5 14.5L20 4Z" fill="#ea580c" opacity="0.15">
      <animate attributeName="opacity" values="0.15;0.25;0.15" dur="2s" repeatCount="indefinite" />
    </path>
    <path d="M20 7L23.5 15L32 16.2L26 22L27.2 30.5L20 26.5L12.8 30.5L14 22L8 16.2L16.5 15L20 7Z" fill="#ea580c" opacity="0.35">
      <animate attributeName="opacity" values="0.35;0.5;0.35" dur="2s" repeatCount="indefinite" begin="0.2s" />
    </path>
    <path d="M20 10L22.5 15.5L28.5 16.3L24 20.5L25 26.5L20 23.5L15 26.5L16 20.5L11.5 16.3L17.5 15.5L20 10Z" fill="#ea580c">
      <animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="2.5s" repeatCount="indefinite" additive="sum" />
      <animateTransform attributeName="transform" type="rotate" values="0 20 19;5 20 19;0 20 19;-5 20 19;0 20 19" dur="4s" repeatCount="indefinite" additive="sum" />
    </path>
  </svg>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, projectsRes, skillsRes] = await Promise.all([
        api.get('/projects/stats'),
        api.get('/projects?limit=5&sort=-createdAt'),
        api.get('/skills')
      ]);
      setStats(statsRes.data);
      setRecentProjects(projectsRes.data.projects);
      setSkills(skillsRes.data);
    } catch {
      setStats({ total: 0, completed: 0, inProgress: 0, planned: 0, featured: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const s = stats || { total: 0, completed: 0, inProgress: 0, planned: 0, featured: 0 };
  const hasProjects = s.total > 0;
  const hasSkills = skills.length > 0;

  const statusBadge = (st) => ({
    completed: { bg: '#ecfdf5', color: '#059669', dot: '#059669' },
    'in-progress': { bg: '#eff6ff', color: '#2563eb', dot: '#2563eb' },
    planned: { bg: '#fffbeb', color: '#d97706', dot: '#d97706' }
  }[st] || { bg: '#f8fafc', color: '#94a3b8', dot: '#94a3b8' });

  const categoryMap = {};
  skills.forEach(sk => {
    if (!categoryMap[sk.category]) categoryMap[sk.category] = { count: 0, total: 0 };
    categoryMap[sk.category].count++;
    categoryMap[sk.category].total += sk.proficiency;
  });
  const categories = Object.entries(categoryMap).map(([name, d], i) => ({
    name, count: d.count, avg: Math.round(d.total / d.count),
    color: ['#d97706','#059669','#2563eb','#7c3aed','#0891b2','#db2777','#ea580c'][i % 7]
  }));

  const card = {
    background: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 14,
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  };

  const donutR = 52;
  const donutCirc = 2 * Math.PI * donutR;
  let donutOff = 0;
  const statusTotal = (s.completed + s.inProgress + s.planned) || 1;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 3, fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1 style={{ fontSize: 21, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 2 }}>Here's what's happening with your portfolio.</p>
        </div>
        <Link to="/projects/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '9px 18px', fontSize: 13, fontWeight: 500,
          background: '#d97706', color: '#fff', border: 'none',
          borderRadius: 8, cursor: 'pointer', textDecoration: 'none',
          boxShadow: '0 1px 3px rgba(217,119,6,0.25)'
        }}>
          <i className="fa-solid fa-plus" style={{ fontSize: 11 }} /> New Project
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          {
            label: 'Total Projects', value: s.total, Icon: IconTotalProjects,
            bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '#fbbf24',
            valueColor: '#92400e',
            labelColor: '#b45309'
          },
          {
            label: 'Completed', value: s.completed, Icon: IconCompleted,
            bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            border: '#34d399',
            valueColor: '#064e3b',
            labelColor: '#047857'
          },
          {
            label: 'In Progress', value: s.inProgress, Icon: IconInProgress,
            bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '#60a5fa',
            valueColor: '#1e3a5f',
            labelColor: '#1d4ed8'
          },
          {
            label: 'Featured', value: s.featured, Icon: IconFeatured,
            bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
            border: '#fb923c',
            valueColor: '#7c2d12',
            labelColor: '#c2410c'
          },
        ].map((item, i) => (
          <div key={i} style={{
            ...card,
            background: item.bg,
            borderColor: item.border,
            borderWidth: '1.5px',
            borderStyle: 'solid',
            padding: '20px 22px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'default'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)'; }}
          >
            {/* Decorative circle */}
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,255,255,0.5)'
            }} />
            <div style={{
              position: 'absolute', bottom: -30, right: 20,
              width: 60, height: 60, borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, position: 'relative', zIndex: 1 }}>
              <item.Icon />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: item.valueColor, lineHeight: 1, marginBottom: 4, position: 'relative', zIndex: 1, letterSpacing: '-0.5px' }}>
              {item.value}
            </div>
            <div style={{ fontSize: 13, color: item.labelColor, fontWeight: 500, position: 'relative', zIndex: 1 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr', gap: 14, marginBottom: 20 }}>

        {/* Donut */}
        <div style={{ ...card, padding: 22 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 18 }}>Project Status</h3>
          {hasProjects ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18, position: 'relative' }}>
                <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={70} cy={70} r={donutR} fill="none" stroke="#f1f5f9" strokeWidth="14" />
                  {[
                    { label: 'Completed', value: s.completed, color: '#059669' },
                    { label: 'In Progress', value: s.inProgress, color: '#2563eb' },
                    { label: 'Planned', value: s.planned, color: '#d97706' },
                  ].map(d => {
                    const pct = d.value / statusTotal;
                    const dash = pct * donutCirc;
                    const el = <circle key={d.label} cx={70} cy={70} r={donutR} fill="none" stroke={d.color} strokeWidth="14" strokeDasharray={`${dash} ${donutCirc - dash}`} strokeDashoffset={-donutOff} strokeLinecap="round" />;
                    donutOff += dash;
                    return el;
                  })}
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{s.total}</div>
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.5px', marginTop: 2 }}>TOTAL</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Completed', value: s.completed, color: '#059669' },
                  { label: 'In Progress', value: s.inProgress, color: '#2563eb' },
                  { label: 'Planned', value: s.planned, color: '#d97706' },
                ].map(d => (
                  <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                      <span style={{ fontSize: 12.5, color: '#475569' }}>{d.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 190, gap: 10 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f8fafc', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-chart-pie" style={{ fontSize: 20, color: '#cbd5e1' }} />
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5 }}>No projects yet.<br/>Create one to see stats.</p>
            </div>
          )}
        </div>

        {/* Skills */}
        <div style={{ ...card, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Skills Overview</h3>
            <Link to="/skills" style={{ fontSize: 11, color: '#d97706', fontWeight: 500, textDecoration: 'none' }}>Manage →</Link>
          </div>
          {hasSkills ? (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100, marginBottom: 10 }}>
                {categories.map(cat => (
                  <div key={cat.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>{cat.count}</span>
                    <div style={{
                      width: '100%', borderRadius: 5,
                      height: `${Math.max((cat.count / Math.max(...categories.map(c=>c.count),1)) * 70, 4)}px`,
                      background: `linear-gradient(180deg, ${cat.color}, ${cat.color}aa)`,
                      transition: 'height 0.4s ease'
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {categories.map(cat => (
                  <div key={cat.name+'l'} style={{ flex: 1, textAlign: 'center' }}>
                    <span style={{ fontSize: 9.5, color: '#94a3b8', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat.name.length > 7 ? cat.name.slice(0,6)+'.' : cat.name}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {categories.slice(0,4).map(cat => (
                  <div key={cat.name+'d'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: cat.color }} />
                      <span style={{ fontSize: 12, color: '#475569' }}>{cat.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 48, height: 4, borderRadius: 2, background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${cat.avg}%`, background: cat.color, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', minWidth: 26, textAlign: 'right' }}>{cat.avg}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220, gap: 10 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f8fafc', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-shapes" style={{ fontSize: 20, color: '#cbd5e1' }} />
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5 }}>No skills added yet.</p>
              <Link to="/skills/new" style={{ fontSize: 12, color: '#d97706', fontWeight: 500, textDecoration: 'none' }}>+ Add your first skill</Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={{ ...card, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Recent Activity</h3>
            <Link to="/projects" style={{ fontSize: 11, color: '#d97706', fontWeight: 500, textDecoration: 'none' }}>View All →</Link>
          </div>
          {recentProjects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recentProjects.slice(0, 5).map(p => {
                const b = statusBadge(p.status);
                return (
                  <Link key={p._id} to={`/projects/${p._id}/edit`} style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: '9px 8px', borderRadius: 8, textDecoration: 'none',
                    transition: 'background 0.12s ease'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
                      background: p.images?.[0] ? `url(${p.images[0]}) center/cover` : '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid #e2e8f0'
                    }}>
                      {!p.images?.[0] && <i className="fa-solid fa-folder" style={{ fontSize: 12, color: '#cbd5e1' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                      <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 1 }}>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </div>
                    </div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                      background: b.bg, color: b.color, textTransform: 'capitalize',
                      whiteSpace: 'nowrap', flexShrink: 0
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: b.dot }} />
                      {p.status}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220, gap: 10 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f8fafc', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: 20, color: '#cbd5e1' }} />
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5 }}>No activity yet.</p>
              <Link to="/projects/new" style={{ fontSize: 12, color: '#d97706', fontWeight: 500, textDecoration: 'none' }}>+ Create your first project</Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ ...card, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>All Projects</h3>
            <Link to="/projects" style={{ fontSize: 11, color: '#d97706', fontWeight: 500, textDecoration: 'none' }}>View All →</Link>
          </div>
          {recentProjects.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #f1f5f9' }}>
                  {['Project', 'Status', 'Tech Stack'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '7px 8px', fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p, i) => {
                  const b = statusBadge(p.status);
                  return (
                    <tr key={p._id} style={{ borderBottom: i < recentProjects.length-1 ? '1px solid #f8fafc' : 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafbfc'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td style={{ padding: '9px 8px' }}><div style={{ fontSize: 12.5, fontWeight: 500, color: '#0f172a' }}>{p.title}</div></td>
                      <td style={{ padding: '9px 8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: b.bg, color: b.color, textTransform: 'capitalize' }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: b.dot }} />{p.status}
                        </span>
                      </td>
                      <td style={{ padding: '9px 8px' }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {p.technologies?.slice(0, 2).map((t, idx) => (
                            <span key={idx} style={{ padding: '1px 7px', fontSize: 10.5, fontWeight: 500, background: '#f1f5f9', borderRadius: 4, color: '#64748b' }}>{t}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <i className="fa-solid fa-table" style={{ fontSize: 28, color: '#e2e8f0', marginBottom: 10 }} />
              <p style={{ fontSize: 12.5, color: '#94a3b8' }}>No projects to display</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...card, padding: 22 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 14 }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { to: '/projects/new', icon: 'fa-solid fa-plus', label: 'New Project', color: '#d97706', bg: '#fffbeb', bd: '#fef3c7' },
                { to: '/skills/new', icon: 'fa-solid fa-plus', label: 'New Skill', color: '#059669', bg: '#ecfdf5', bd: '#d1fae5' },
                { to: '/profile', icon: 'fa-solid fa-pen-to-square', label: 'Edit Profile', color: '#2563eb', bg: '#eff6ff', bd: '#dbeafe' },
                { to: '/projects', icon: 'fa-solid fa-list', label: 'All Projects', color: '#7c3aed', bg: '#f5f3ff', bd: '#ede9fe' },
              ].map(action => (
                <Link key={action.to} to={action.to} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 10px', borderRadius: 10, textDecoration: 'none',
                  background: action.bg, border: `1.5px solid ${action.bd}`,
                  transition: 'all 0.15s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: action.color + '15',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <i className={action.icon} style={{ fontSize: 13, color: action.color }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#334155' }}>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ ...card, padding: 22, flex: 1 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 14 }}>Top Skills</h3>
            {hasSkills ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {skills.slice(0, 5).map(skill => (
                  <div key={skill._id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: '#0f172a' }}>{skill.name}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: skill.color || '#d97706' }}>{skill.proficiency}%</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3, width: `${skill.proficiency}%`, background: skill.color || '#d97706', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100, gap: 8 }}>
                <i className="fa-solid fa-code" style={{ fontSize: 24, color: '#e2e8f0' }} />
                <p style={{ fontSize: 12, color: '#94a3b8' }}>No skills added</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="grid-template-columns: 260px"] { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 260px"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"]:last-of-type { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
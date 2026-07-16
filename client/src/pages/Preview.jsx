import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Preview() {
  const { user } = useAuth();
  const printRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [profileRes, projectsRes, skillsRes] = await Promise.all([
        api.get('/profile'),
        api.get('/projects?limit=50'),
        api.get('/skills')
      ]);
      setProfile(profileRes.data);
      setProjects(projectsRes.data.projects || []);
      setSkills(skillsRes.data || []);
    } catch {
      setProfile(user);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const content = printRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>${profile?.name || 'Portfolio'} — Resume</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; padding: 40px 50px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        img { max-width: 100%; }
        .no-print { display: none; }
        @media print { body { padding: 20px 30px; } }
      </style></head><body>
      ${content.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  if (loading) return <LoadingSpinner text="Building preview..." />;

  const p = profile || user || {};
  const grouped = {};
  skills.forEach(s => { if (!grouped[s.category]) grouped[s.category] = []; grouped[s.category].push(s); });
  const categories = Object.entries(grouped);

  const statusLabel = { completed: 'Completed', 'in-progress': 'In Progress', planned: 'Planned' };
  const socials = [
    { key: 'github', icon: 'fa-brands fa-github', label: 'GitHub' },
    { key: 'linkedin', icon: 'fa-brands fa-linkedin', label: 'LinkedIn' },
    { key: 'twitter', icon: 'fa-brands fa-x-twitter', label: 'X / Twitter' },
    { key: 'website', icon: 'fa-solid fa-globe', label: 'Website' },
  ].filter(s => p[s.key]);

  const S = {
    section: { marginBottom: 36, pageBreakInside: 'avoid' },
    title: { fontSize: 14, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Inter, sans-serif' },
    text: { fontSize: 14, color: '#475569', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' },
    label: { fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div className="no-print" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', background: '#ffffff', borderBottom: '1.5px solid #e2e8f0',
        marginBottom: 0, flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(217,119,6,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-eye" style={{ fontSize: 14, color: '#d97706' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>Live Portfolio Preview</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>This is how your portfolio looks to visitors</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handlePrint} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '8px 18px', fontSize: 13, fontWeight: 500,
            background: '#0f172a', color: '#fff', border: 'none',
            borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
          }}>
            <i className="fa-solid fa-print" style={{ fontSize: 12 }} /> Print / PDF
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div style={{ flex: 1, overflow: 'auto', background: '#f1f5f9', padding: 32 }}>
        <div ref={printRef} style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* ── HERO ── */}
          <div style={{
            background: '#ffffff', borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: 24
          }}>
            {/* Header bar */}
            <div style={{ height: 8, background: 'linear-gradient(90deg, #d97706, #f59e0b, #d97706)' }} />
            <div style={{ padding: '36px 40px 32px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>
              {/* Avatar */}
              <div style={{
                width: 110, height: 110, borderRadius: 16, flexShrink: 0,
                background: p.avatar ? `url(${p.avatar}) center/cover` : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                border: '3px solid #f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                {!p.avatar && <i className="fa-solid fa-user" style={{ fontSize: 36, color: '#94a3b8' }} />}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' }}>
                  {p.name || 'Your Name'}
                </h1>
                {p.title && (
                  <div style={{ fontSize: 17, color: '#d97706', fontWeight: 600, marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
                    {p.title}
                  </div>
                )}
                {p.bio && (
                  <p style={{ ...S.text, fontSize: 14.5, color: '#475569', maxWidth: 520, lineHeight: 1.65 }}>
                    {p.bio}
                  </p>
                )}
                {/* Meta row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 18, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                  {p.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
                      <i className="fa-solid fa-location-dot" style={{ color: '#d97706', fontSize: 12 }} /> {p.location}
                    </div>
                  )}
                  {p.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
                      <i className="fa-solid fa-envelope" style={{ color: '#d97706', fontSize: 12 }} /> {p.email}
                    </div>
                  )}
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#64748b', fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}>
                      <i className="fa-solid fa-globe" style={{ color: '#d97706', fontSize: 12 }} /> Website
                    </a>
                  )}
                </div>
                {/* Social */}
                {socials.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    {socials.map(s => (
                      <a key={s.key} href={s.key === 'website' ? p[s.key] : `https://${s.key}.com/${p[s.key]?.split('/').pop()}`} target="_blank" rel="noopener noreferrer" title={s.label} style={{
                        width: 34, height: 34, borderRadius: 8,
                        background: '#f8fafc', border: '1px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        textDecoration: 'none', transition: 'all 0.15s ease'
                      }}>
                        <i className={s.icon} style={{ fontSize: 15, color: '#475569' }} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SKILLS ── */}
          {categories.length > 0 && (
            <div style={{ ...S.section, background: '#ffffff', borderRadius: 16, padding: '28px 36px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h2 style={S.title}><i className="fa-solid fa-shapes" style={{ fontSize: 13 }} /> Skills & Expertise</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                {categories.map(([cat, catSkills]) => (
                  <div key={cat}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 14, fontFamily: 'Inter, sans-serif' }}>{cat}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {catSkills.sort((a, b) => b.proficiency - a.proficiency).map(skill => (
                        <div key={skill._id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: '#334155', fontFamily: 'Inter, sans-serif' }}>{skill.name}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: skill.color || '#d97706', fontFamily: 'Inter, sans-serif' }}>{skill.proficiency}%</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 3, width: `${skill.proficiency}%`, background: `linear-gradient(90deg, ${skill.color || '#d97706'}, ${skill.color || '#f59e0b'})`, transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {projects.length > 0 && (
            <div style={{ ...S.section, background: '#ffffff', borderRadius: 16, padding: '28px 36px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h2 style={S.title}><i className="fa-solid fa-layer-group" style={{ fontSize: 13 }} /> Projects</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
                {projects.map(project => (
                  <div key={project._id} style={{
                    borderRadius: 12, overflow: 'hidden',
                    border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s ease'
                  }}>
                    {project.images?.[0] ? (
                      <div style={{ height: 140, background: `url(${project.images[0]}) center/cover`, position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.35) 100%)' }} />
                        <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', gap: 6 }}>
                          <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: 'rgba(255,255,255,0.9)', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.3px', fontFamily: 'Inter, sans-serif' }}>
                            {statusLabel[project.status] || project.status}
                          </span>
                          {project.featured && (
                            <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 9.5, fontWeight: 600, background: 'rgba(217,119,6,0.9)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.3px', fontFamily: 'Inter, sans-serif' }}>
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ height: 8, background: 'linear-gradient(90deg, #fbbf24, #d97706)' }} />
                    )}
                    <div style={{ padding: '14px 16px' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>{project.title}</h3>
                      <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.55, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
                        {project.shortDesc || project.description}
                      </p>
                      {project.technologies?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                          {project.technologies.map((tech, i) => (
                            <span key={i} style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', fontFamily: 'Inter, sans-serif' }}>{tech}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 500, background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>
                            <i className="fa-brands fa-github" style={{ fontSize: 12 }} /> Code
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 500, background: '#d97706', color: '#fff', border: 'none', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>
                            <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 10 }} /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {categories.length === 0 && projects.length === 0 && (
            <div style={{ background: '#ffffff', borderRadius: 16, padding: '60px 40px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f8fafc', border: '1.5px solid #e2e8f0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <i className="fa-solid fa-file-lines" style={{ fontSize: 26, color: '#cbd5e1' }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>Your portfolio is empty</h3>
              <p style={{ fontSize: 14, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>Add projects and skills to see your live preview here.</p>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
            <p style={{ fontSize: 11, color: '#cbd5e1', fontFamily: 'Inter, sans-serif' }}>
              Built with Portfolio Management System · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
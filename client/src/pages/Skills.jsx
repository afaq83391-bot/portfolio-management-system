import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Skills() {
  const { addToast } = useNotification();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [skillsRes, catsRes] = await Promise.all([
        api.get('/skills', activeCategory !== 'all' ? { params: { category: activeCategory } } : {}),
        api.get('/skills/categories')
      ]);
      setSkills(skillsRes.data);
      setCategories(catsRes.data);
    } catch {
      addToast('Failed to load skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/skills/${deleteTarget._id}`);
      setSkills(prev => prev.filter(s => s._id !== deleteTarget._id));
      addToast('Skill deleted', 'success');
    } catch {
      addToast('Failed to delete skill', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading skills..." />;

  // Group by category
  const grouped = {};
  skills.forEach(s => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Skills</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{skills.length} skill{skills.length !== 1 ? 's' : ''} across {Object.keys(grouped).length} categor{Object.keys(grouped).length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <Link to="/skills/new" className="btn btn-primary">
          <i className="fa-solid fa-plus" /> New Skill
        </Link>
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {skills.length === 0 ? (
        <EmptyState
          icon="fa-solid fa-code"
          title="No skills added"
          description={activeCategory === 'all' ? 'Add your technical skills to showcase your expertise.' : `No skills in "${activeCategory}" category.`}
          action={activeCategory === 'all' && (
            <Link to="/skills/new" className="btn btn-primary">
              <i className="fa-solid fa-plus" /> Add Skill
            </Link>
          )}
        />
      ) : (
        Object.entries(grouped).map(([category, categorySkills]) => (
          <div key={category} style={{ marginBottom: 32 }} className="animate-fade-in">
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fa-solid fa-tag" style={{ fontSize: 12 }} />
              {category}
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>({categorySkills.length})</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {categorySkills.map(skill => (
                <div key={skill._id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {skill.icon && <span style={{ fontSize: 20 }}>{skill.icon}</span>}
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{skill.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Link to={`/skills/${skill._id}/edit`} className="btn btn-ghost btn-sm">
                        <i className="fa-solid fa-pen" style={{ fontSize: 11 }} />
                      </Link>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => setDeleteTarget(skill)}>
                        <i className="fa-solid fa-trash" style={{ fontSize: 11 }} />
                      </button>
                    </div>
                  </div>

                  {/* Proficiency Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>Proficiency</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: skill.color || 'var(--accent)' }}>{skill.proficiency}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'var(--bg2)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        width: `${skill.proficiency}%`,
                        background: skill.color || 'var(--accent)',
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Skill"
        message={`Remove "${deleteTarget?.name}" from your skills?`}
        confirmText="Delete Skill"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
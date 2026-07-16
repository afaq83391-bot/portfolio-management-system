import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const imageInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', description: '', shortDesc: '',
    technologies: [], githubUrl: '', liveUrl: '',
    status: 'completed', featured: false,
    startDate: '', endDate: '', images: []
  });
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      const p = res.data;
      setForm({
        title: p.title || '',
        description: p.description || '',
        shortDesc: p.shortDesc || '',
        technologies: p.technologies || [],
        githubUrl: p.githubUrl || '',
        liveUrl: p.liveUrl || '',
        status: p.status || 'completed',
        featured: p.featured || false,
        startDate: p.startDate ? p.startDate.split('T')[0] : '',
        endDate: p.endDate ? p.endDate.split('T')[0] : '',
        images: p.images || []
      });
    } catch {
      addToast('Project not found', 'error');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !form.technologies.includes(tech)) {
      setForm({ ...form, technologies: [...form.technologies, tech] });
      setTechInput('');
    }
  };

  const removeTech = (tech) => {
    setForm({ ...form, technologies: form.technologies.filter(t => t !== tech) });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    const validFiles = Array.from(files).filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      addToast('Some files were skipped (max 5MB each)', 'warning');
    }
    if (!validFiles.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      validFiles.forEach(f => formData.append('images', f));

      const res = await api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newImages = res.data.map(img => img.url);
      setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      addToast(`${newImages.length} image(s) uploaded`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = async (imgUrl) => {
    try {
      if (imgUrl.includes('/uploads/')) {
        const filename = imgUrl.split('/uploads/')[1];
        if (filename) await api.delete('/upload', { data: { filename } }).catch(() => {});
      }
      setForm(prev => ({ ...prev, images: prev.images.filter(i => i !== imgUrl) }));
      addToast('Image removed', 'success');
    } catch {
      addToast('Failed to remove image', 'error');
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.shortDesc) delete payload.shortDesc;
      if (!payload.githubUrl) delete payload.githubUrl;
      if (!payload.liveUrl) delete payload.liveUrl;
      if (!payload.startDate) delete payload.startDate;
      if (!payload.endDate) delete payload.endDate;

      if (isEdit) {
        const res = await api.put(`/projects/${id}`, payload);
        addToast('Project updated', 'success');
      } else {
        const res = await api.post('/projects', payload);
        addToast('Project created', 'success');
        navigate(`/projects/${res.data._id}/edit`);
        return;
      }
      navigate('/projects');
    } catch (err) {
      addToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading project..." />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
        {isEdit ? 'Edit Project' : 'New Project'}
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>
        {isEdit ? 'Update your project details' : 'Add a new project to your portfolio'}
      </p>

      <form onSubmit={handleSubmit} className="card">
        {/* Title */}
        <div style={{ marginBottom: 18 }}>
          <label>Project Title *</label>
          <input value={form.title} onChange={e => { setForm({ ...form, title: e.target.value }); setErrors(p => ({ ...p, title: '' })); }} placeholder="My Awesome Project" style={errors.title ? { borderColor: 'var(--red)' } : {}} />
          {errors.title && <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, display: 'block' }}>{errors.title}</span>}
        </div>

        {/* Short Description */}
        <div style={{ marginBottom: 18 }}>
          <label>Short Description</label>
          <input value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} placeholder="Brief one-liner for the project card" maxLength={200} />
          <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{form.shortDesc.length}/200</div>
        </div>

        {/* Full Description */}
        <div style={{ marginBottom: 18 }}>
          <label>Full Description *</label>
          <textarea value={form.description} onChange={e => { setForm({ ...form, description: e.target.value }); setErrors(p => ({ ...p, description: '' })); }} placeholder="Describe the project in detail..." rows={5} style={errors.description ? { borderColor: 'var(--red)' } : {}} />
          {errors.description && <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 4, display: 'block' }}>{errors.description}</span>}
        </div>

        {/* Technologies */}
        <div style={{ marginBottom: 18 }}>
          <label>Technologies / Tech Stack</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              placeholder="Type a technology and press Add"
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-secondary" onClick={addTech}>Add</button>
          </div>
          {form.technologies.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {form.technologies.map(tech => (
                <span key={tech} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', fontSize: 12, fontWeight: 500,
                  background: 'var(--accent-dim)', color: 'var(--accent)',
                  borderRadius: 4, border: '1px solid rgba(245,158,11,0.2)'
                }}>
                  {tech}
                  <button type="button" onClick={() => removeTech(tech)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}>&times;</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* URLs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <div>
            <label><i className="fa-brands fa-github" style={{ marginRight: 6, color: 'var(--muted)' }} />GitHub URL</label>
            <input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." />
          </div>
          <div>
            <label><i className="fa-solid fa-external-link-alt" style={{ marginRight: 6, color: 'var(--muted)' }} />Live URL</label>
            <input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." />
          </div>
        </div>

        {/* Status, Featured, Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 18 }}>
          <div>
            <label>Status</label>
            <div style={{ position: 'relative' }}>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
              <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'var(--muted)', pointerEvents: 'none' }} />
            </div>
          </div>
          <div>
            <label>Start Date</label>
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label>End Date</label>
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          </div>
        </div>

        {/* Featured toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, cursor: 'pointer' }}>
          <div
            onClick={() => setForm({ ...form, featured: !form.featured })}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: form.featured ? 'var(--accent)' : 'var(--border)',
              position: 'relative', transition: 'var(--transition)', cursor: 'pointer'
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: '#fff', position: 'absolute',
              top: 3, left: form.featured ? 23 : 3,
              transition: 'var(--transition)'
            }} />
          </div>
          <span style={{ fontSize: 14, color: 'var(--fg2)' }}>Mark as featured project</span>
        </label>

        {/* Image Upload */}
        <div style={{ marginBottom: 24 }}>
          <label>Project Images</label>
          <input type="file" ref={imageInputRef} accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => imageInputRef.current?.click()} disabled={uploading} style={{ marginBottom: 12 }}>
            {uploading ? <><i className="fa-solid fa-spinner" style={{ animation: 'spin 0.8s linear infinite' }} /> Uploading...</> : <><i className="fa-solid fa-upload" /> Upload Images (max 5)</>}
          </button>

          {form.images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '16/10', background: 'var(--bg2)' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'rgba(239,68,68,0.9)', border: 'none',
                      color: '#fff', cursor: 'pointer', fontSize: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <i className="fa-solid fa-times" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/projects')}>Cancel</button>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? <><i className="fa-solid fa-spinner" style={{ animation: 'spin 0.8s linear infinite' }} /> Saving...</> : isEdit ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr 1fr"],
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
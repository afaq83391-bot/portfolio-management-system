import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#d97706', '#059669', '#2563eb', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#ea580c', '#65a30d', '#4f46e5'];

export default function SkillForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useNotification();

  const [form, setForm] = useState({ name: '', category: '', proficiency: 50, color: '#d97706', order: 0 });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) fetchSkill();
  }, [id]);

  const fetchSkill = async () => {
    try {
      const res = await api.get(`/skills/${id}`);
      setForm(res.data);
    } catch {
      addToast('Skill not found', 'error');
      navigate('/skills');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Skill name is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (form.proficiency < 1 || form.proficiency > 100) errs.proficiency = 'Must be between 1 and 100';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/skills/${id}`, form);
        addToast('Skill updated', 'success');
      } else {
        await api.post('/skills', form);
        addToast('Skill created', 'success');
      }
      navigate('/skills');
    } catch (err) {
      addToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading skill..." />;

  const inputStyle = (hasError) => ({
    fontSize: 14,
    color: '#0f172a',
    background: '#f8fafc',
    border: hasError ? '1.5px solid #dc2626' : '1.5px solid #e2e8f0',
    borderRadius: 8,
    padding: '11px 14px',
    outline: 'none',
    width: '100%',
    transition: 'all 0.15s ease',
    fontFamily: 'Inter, sans-serif'
  });

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
    marginBottom: 6,
    fontFamily: 'Inter, sans-serif'
  };

  const errorStyle = {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 5,
    display: 'block',
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>
          {isEdit ? 'Edit Skill' : 'New Skill'}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
          {isEdit ? 'Update the details of this skill' : 'Add a new skill to showcase your expertise'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: 12,
        padding: 28,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)'
      }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>Skill Name <span style={{ color: '#dc2626' }}>*</span></label>
            <input
              style={inputStyle(errors.name)}
              value={form.name}
              onChange={e => { setForm({ ...form, name: e.target.value }); setErrors(p => ({ ...p, name: '' })); }}
              placeholder="e.g. React, Python"
              onFocus={e => { e.target.style.borderColor = '#d97706'; e.target.style.boxShadow = '0 0 0 3px rgba(217,119,6,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = errors.name ? '#dc2626' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.name && <span style={errorStyle}>{errors.name}</span>}
          </div>
          <div>
            <label style={labelStyle}>Category <span style={{ color: '#dc2626' }}>*</span></label>
            <input
              style={inputStyle(errors.category)}
              value={form.category}
              onChange={e => { setForm({ ...form, category: e.target.value }); setErrors(p => ({ ...p, category: '' })); }}
              placeholder="e.g. Frontend, Backend"
              onFocus={e => { e.target.style.borderColor = '#d97706'; e.target.style.boxShadow = '0 0 0 3px rgba(217,119,6,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = errors.category ? '#dc2626' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.category && <span style={errorStyle}>{errors.category}</span>}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Proficiency Level</label>
            <span style={{
             fontSize: 14, fontWeight: 700, color: form.color,
             fontFamily: 'Inter, sans-serif'
             }}>{form.proficiency}%</span>
          </div>

          <div style={{ position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}>
            <div style={{
              position: 'absolute',
              left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
              height: 8, borderRadius: 4, background: '#f1f5f9',
              pointerEvents: 'none'
            }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: `${form.proficiency}%`,
                background: `linear-gradient(90deg, ${form.color}bb, ${form.color})`,
                transition: 'width 0.15s ease'
              }} />
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={form.proficiency}
              onChange={e => setForm({ ...form, proficiency: parseInt(e.target.value) })}
              style={{
                position: 'relative',
                width: '100%',
                height: 32,
                margin: 0,
                padding: 0,
                appearance: 'none',
                WebkitAppearance: 'none',
                background: 'transparent',
                cursor: 'pointer',
                zIndex: 2
              }}
            />
          </div>
          {errors.proficiency && <span style={errorStyle}>{errors.proficiency}</span>}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Color</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, color: c })}
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: c,
                  border: form.color === c ? '2.5px solid #0f172a' : '2.5px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: form.color === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}40` : 'none',
                  transform: form.color === c ? 'scale(1.1)' : 'scale(1)'
                }}
              />
            ))}
            <div style={{ width: 1, height: 28, background: '#e2e8f0', margin: '0 4px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="color"
                value={form.color}
                onChange={e => setForm({ ...form, color: e.target.value })}
                style={{
                  width: 34, height: 34, padding: 2,
                  border: '2px solid #e2e8f0', borderRadius: 8,
                  cursor: 'pointer', background: '#f8fafc'
                }}
              />
              <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>Custom</span>
            </div>
          </div>
        </div>

        <div style={{
          marginBottom: 28,
          padding: '14px 16px',
          background: '#f8fafc',
          borderRadius: 8,
          border: '1px solid #e2e8f0'
        }}>
          <label style={{ ...labelStyle, marginBottom: 8 }}>Display Order</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="number"
              min="0"
              value={form.order}
              onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              style={{ ...inputStyle(false), maxWidth: 100, marginBottom: 0 }}
            />
            <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
              Lower numbers appear first in the list
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 10, justifyContent: 'flex-end',
          paddingTop: 20, borderTop: '1px solid #f1f5f9'
        }}>
          <button
            type="button"
            onClick={() => navigate('/skills')}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '10px 24px', fontSize: 14, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              background: '#ffffff', color: '#475569',
              border: '1.5px solid #e2e8f0', borderRadius: 8,
              cursor: 'pointer', transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#ffffff'; }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 28px', fontSize: 14, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              background: '#d97706', color: '#ffffff',
              border: 'none', borderRadius: 8,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 3px rgba(217,119,6,0.2)',
              opacity: saving ? 0.6 : 1
            }}
            onMouseEnter={e => { if (!saving) { e.target.style.background = '#b45309'; e.target.style.boxShadow = '0 4px 12px rgba(217,119,6,0.25)'; } }}
            onMouseLeave={e => { e.target.style.background = '#d97706'; e.target.style.boxShadow = '0 1px 3px rgba(217,119,6,0.2)'; }}
          >
            {saving
              ? <><i className="fa-solid fa-spinner" style={{ animation: 'spin 0.8s linear infinite' }} /> Saving...</>
              : isEdit ? 'Update Skill' : 'Create Skill'}
          </button>
        </div>
      </form>
    </div>
  );
}
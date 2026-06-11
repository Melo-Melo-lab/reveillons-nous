import { useState } from 'react';

const EMPTY = { id:'', titre:'', description:'', date:'', heure:'', lieu:'', lien:'', categories:[] };

const INPUT_STYLE = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1.5px solid #e5e7eb',
  background: '#fff',
  color: '#191a23',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
};

const LABEL_STYLE = {
  fontWeight: 600,
  fontSize: '0.82rem',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

export default function EventForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.titre.trim() || !form.date) return;
    const id = form.id || `evt-${Date.now()}`;
    onSave({ ...form, id });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <Row label="Titre *">
        <input style={INPUT_STYLE} value={form.titre} onChange={e => set('titre', e.target.value)} required />
      </Row>
      <Row label="Date *">
        <input style={INPUT_STYLE} type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
      </Row>
      <Row label="Heure">
        <input style={INPUT_STYLE} type="time" value={form.heure} onChange={e => set('heure', e.target.value)} />
      </Row>
      <Row label="Lieu">
        <input style={INPUT_STYLE} value={form.lieu} onChange={e => set('lieu', e.target.value)} placeholder="Ville, adresse…" />
      </Row>
      <Row label="Lien externe">
        <input style={INPUT_STYLE} type="url" value={form.lien} onChange={e => set('lien', e.target.value)} placeholder="https://…" />
      </Row>
      <Row label="Catégories (séparées par virgule)">
        <input
          style={INPUT_STYLE}
          value={Array.isArray(form.categories) ? form.categories.join(', ') : (form.categories || '')}
          onChange={e => set('categories', e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
          placeholder="Conférence, Mobilisation…"
        />
      </Row>
      <Row label="Description">
        <textarea style={{ ...INPUT_STYLE, height:90, resize:'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
      </Row>
      <div style={{ display:'flex', gap:10, marginTop:4 }}>
        <button type="submit" style={{ padding:'10px 22px', background:'#191a23', color:'#fff', border:'none', borderRadius:8, fontFamily:'inherit', fontSize:'0.9rem', fontWeight:700, cursor:'pointer' }}>
          Enregistrer
        </button>
        {onCancel && (
          <button type="button" style={{ padding:'10px 22px', background:'#fff', color:'#6b7280', border:'1.5px solid #e5e7eb', borderRadius:8, fontFamily:'inherit', fontSize:'0.9rem', cursor:'pointer' }} onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  );
}

import { useState } from 'react';

const EMPTY = { id:'', titre:'', description:'', date:'', heure:'', lieu:'', lien:'', categories:[] };

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
    <form onSubmit={handleSubmit} style={s.form}>
      <Row label="Titre *">
        <input style={s.input} value={form.titre} onChange={e => set('titre', e.target.value)} required />
      </Row>
      <Row label="Date *">
        <input style={s.input} type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
      </Row>
      <Row label="Heure">
        <input style={s.input} type="time" value={form.heure} onChange={e => set('heure', e.target.value)} />
      </Row>
      <Row label="Lieu">
        <input style={s.input} value={form.lieu} onChange={e => set('lieu', e.target.value)} placeholder="Ville, adresse…" />
      </Row>
      <Row label="Lien externe">
        <input style={s.input} type="url" value={form.lien} onChange={e => set('lien', e.target.value)} placeholder="https://…" />
      </Row>
      <Row label="Catégories (séparées par virgule)">
        <input
          style={s.input}
          value={Array.isArray(form.categories) ? form.categories.join(', ') : (form.categories || '')}
          onChange={e => set('categories', e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
          placeholder="Conférence, Mobilisation…"
        />
      </Row>
      <Row label="Description">
        <textarea style={{ ...s.input, height:90, resize:'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
      </Row>
      <div style={s.actions}>
        <button type="submit" style={s.btnPrimary}>Enregistrer</button>
        {onCancel && <button type="button" style={s.btnSecondary} onClick={onCancel}>Annuler</button>}
      </div>
    </form>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontWeight:600, fontSize:'0.85rem', color:'#374151' }}>{label}</label>
      {children}
    </div>
  );
}

const s = {
  form:        { display:'flex', flexDirection:'column', gap:16 },
  input:       { padding:'9px 12px', borderRadius:7, border:'1.5px solid #e5e7eb', fontSize:'0.9rem', fontFamily:'inherit', width:'100%', boxSizing:'border-box', outline:'none' },
  actions:     { display:'flex', gap:10, marginTop:4 },
  btnPrimary:  { padding:'10px 22px', background:'#191a23', color:'#fff', border:'none', borderRadius:8, fontFamily:'inherit', fontSize:'0.9rem', cursor:'pointer' },
  btnSecondary:{ padding:'10px 22px', background:'#fff', color:'#374151', border:'1.5px solid #e5e7eb', borderRadius:8, fontFamily:'inherit', fontSize:'0.9rem', cursor:'pointer' },
};

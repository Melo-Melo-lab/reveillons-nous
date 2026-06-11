import SaveStatus from '../components/SaveStatus';

export default function Petition({ content, onChange, saveStatus }) {
  const p = content?.petition || {};

  function set(key, val) {
    onChange('petition', { ...p, [key]: val });
  }

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Pétition</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={s.section}>
        <Field label="Titre de la section"  value={p.labelSection} onChange={v => set('labelSection', v)} />
        <Textarea label="Description"       value={p.description}  onChange={v => set('description', v)} />
        <Field label="Objectif de signatures" value={p.objectif} onChange={v => set('objectif', parseInt(v) || 0)} type="number" />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Bouton CTA</h2>
        <Field label="Texte du bouton"      value={p.ctaLabel}             onChange={v => set('ctaLabel', v)} />
        <Field label="URL de la pétition"   value={p.urlPetitionExterne}   onChange={v => set('urlPetitionExterne', v)} type="url" />
      </div>

      <div style={s.note}>
        <strong>Note :</strong> le compteur de signatures est mis à jour automatiquement par scraping du site CESE — aucune action requise.
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input style={s.input} type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <textarea style={{ ...s.input, height:90, resize:'vertical' }} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

const s = {
  header:  { display:'flex', alignItems:'center', marginBottom:28 },
  title:   { fontSize:'1.5rem', fontWeight:700, margin:0 },
  section: { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'22px 24px', marginBottom:20, display:'flex', flexDirection:'column', gap:16 },
  h2:      { fontSize:'1rem', fontWeight:700, color:'#374151', margin:'0 0 4px' },
  field:   { display:'flex', flexDirection:'column', gap:6 },
  label:   { fontWeight:600, fontSize:'0.85rem', color:'#374151' },
  input:   { padding:'9px 12px', borderRadius:7, border:'1.5px solid #e5e7eb', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' },
  note:    { background:'#fffbeb', border:'1.5px solid #fde68a', borderRadius:8, padding:'14px 18px', fontSize:'0.87rem', color:'#92400e' },
};

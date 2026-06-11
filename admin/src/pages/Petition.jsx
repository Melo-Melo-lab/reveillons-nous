import SaveStatus from '../components/SaveStatus';

const INPUT = { padding:'10px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', background:'#fff', color:'#191a23', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' };
const LABEL = { fontWeight:600, fontSize:'0.82rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' };
const SECTION = { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'22px 24px', marginBottom:16, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' };
const H2 = { fontSize:'0.95rem', fontWeight:700, color:'#191a23', margin:'0 0 4px' };

export default function Petition({ content, onChange, saveStatus }) {
  const p = content?.petition || {};

  function set(key, val) {
    onChange('petition', { ...p, [key]: val });
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'#191a23', margin:0 }}>Pétition</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={SECTION}>
        <Field label="Titre de la section"    value={p.labelSection} onChange={v => set('labelSection', v)} />
        <Textarea label="Description"         value={p.description}  onChange={v => set('description', v)} />
        <Field label="Objectif de signatures" value={p.objectif}     onChange={v => set('objectif', parseInt(v) || 0)} type="number" />
      </div>

      <div style={SECTION}>
        <h2 style={H2}>Bouton CTA</h2>
        <Field label="Texte du bouton"    value={p.ctaLabel}           onChange={v => set('ctaLabel', v)} />
        <Field label="URL de la pétition" value={p.urlPetitionExterne} onChange={v => set('urlPetitionExterne', v)} type="url" />
      </div>

      <div style={{ background:'#fffbeb', border:'1.5px solid #fde68a', borderRadius:10, padding:'14px 18px', fontSize:'0.87rem', color:'#92400e' }}>
        <strong>Note :</strong> le compteur de signatures est mis à jour automatiquement par scraping du site CESE — aucune action requise.
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={LABEL}>{label}</label>
      <input style={INPUT} type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={LABEL}>{label}</label>
      <textarea style={{ ...INPUT, height:90, resize:'vertical' }} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

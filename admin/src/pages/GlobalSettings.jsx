import SaveStatus from '../components/SaveStatus';
import ImageUploader from '../components/ImageUploader';

const INPUT = { padding:'10px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', background:'#fff', color:'#191a23', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' };
const LABEL = { fontWeight:600, fontSize:'0.82rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' };
const SECTION = { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'22px 24px', marginBottom:16, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' };
const H2 = { fontSize:'0.95rem', fontWeight:700, color:'#191a23', margin:'0 0 4px' };

export default function GlobalSettings({ content, onChange, saveStatus }) {
  const g = content?.global || {};

  function set(key, val) {
    onChange('global', { ...g, [key]: val });
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'#191a23', margin:0 }}>Paramètres globaux</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={SECTION}>
        <h2 style={H2}>Logo</h2>
        <ImageUploader label="Logo principal" value={g.logoUrl} onChange={v => set('logoUrl', v)} />
        <Field label="Texte alternatif du logo" value={g.logoAlt} onChange={v => set('logoAlt', v)} />
      </div>

      <div style={SECTION}>
        <h2 style={H2}>Favicon</h2>
        <ImageUploader label="Favicon (PNG/ICO recommandé)" value={g.favicon} onChange={v => set('favicon', v)} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={LABEL}>{label}</label>
      <input style={INPUT} type={type} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

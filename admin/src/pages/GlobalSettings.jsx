import SaveStatus from '../components/SaveStatus';
import ImageUploader from '../components/ImageUploader';

export default function GlobalSettings({ content, onChange, saveStatus }) {
  const g = content?.global || {};

  function set(key, val) {
    onChange('global', { ...g, [key]: val });
  }

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Paramètres globaux</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Logo</h2>
        <ImageUploader
          label="Logo principal"
          value={g.logoUrl}
          onChange={v => set('logoUrl', v)}
        />
        <Field label="Texte alternatif du logo" value={g.logoAlt} onChange={v => set('logoAlt', v)} />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Identité</h2>
        <Field label="Nom de l'association" value={g.nomAsso}  onChange={v => set('nomAsso', v)} />
        <Field label="Tagline / Slogan"     value={g.tagline}  onChange={v => set('tagline', v)} />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Couleurs</h2>
        <ColorField label="Couleur primaire"    value={g.couleurPrimaire}    onChange={v => set('couleurPrimaire', v)} />
        <ColorField label="Couleur secondaire"  value={g.couleurSecondaire}  onChange={v => set('couleurSecondaire', v)} />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Favicon</h2>
        <ImageUploader
          label="Favicon (PNG/ICO recommandé)"
          value={g.favicon}
          onChange={v => set('favicon', v)}
        />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input style={s.input} type={type} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div style={s.colorRow}>
        <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} style={s.colorPicker} />
        <input style={{ ...s.input, flex:1 }} value={value || ''} onChange={e => onChange(e.target.value)} placeholder="#rrggbb" />
      </div>
    </div>
  );
}

const s = {
  header:      { display:'flex', alignItems:'center', marginBottom:28 },
  title:       { fontSize:'1.5rem', fontWeight:700, margin:0 },
  section:     { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'22px 24px', marginBottom:20, display:'flex', flexDirection:'column', gap:16 },
  h2:          { fontSize:'1rem', fontWeight:700, color:'#374151', margin:'0 0 4px' },
  field:       { display:'flex', flexDirection:'column', gap:6 },
  label:       { fontWeight:600, fontSize:'0.85rem', color:'#374151' },
  input:       { padding:'9px 12px', borderRadius:7, border:'1.5px solid #e5e7eb', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' },
  colorRow:    { display:'flex', gap:10, alignItems:'center' },
  colorPicker: { width:40, height:36, border:'none', padding:0, cursor:'pointer', borderRadius:6 },
};

import SaveStatus from '../components/SaveStatus';

export default function Contact({ content, onChange, saveStatus }) {
  const c = content?.contact || {};

  function set(key, val) {
    onChange('contact', { ...c, [key]: val });
  }

  function setSocial(key, val) {
    onChange('contact', { ...c, reseauxSociaux: { ...c.reseauxSociaux, [key]: val } });
  }

  function toggleForm(val) {
    onChange('contact', { ...c, formulaire: { ...c.formulaire, actif: val } });
  }

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Contact</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={s.section}>
        <Field label="Titre de la section"  value={c.titre}       onChange={v => set('titre', v)} />
        <Field label="Description"          value={c.description} onChange={v => set('description', v)} />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Coordonnées</h2>
        <Field label="Adresse e-mail"  value={c.email}     onChange={v => set('email', v)} type="email" />
        <Field label="Adresse postale" value={c.adresse}   onChange={v => set('adresse', v)} />
        <Field label="Téléphone"       value={c.telephone} onChange={v => set('telephone', v)} />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Réseaux sociaux</h2>
        <Field label="Facebook"  value={c.reseauxSociaux?.facebook}  onChange={v => setSocial('facebook', v)} type="url" />
        <Field label="Instagram" value={c.reseauxSociaux?.instagram} onChange={v => setSocial('instagram', v)} type="url" />
        <Field label="YouTube"   value={c.reseauxSociaux?.youtube}   onChange={v => setSocial('youtube', v)} type="url" />
        <Field label="Discord"   value={c.reseauxSociaux?.discord}   onChange={v => setSocial('discord', v)} type="url" />
        <Field label="Twitter/X" value={c.reseauxSociaux?.twitter}   onChange={v => setSocial('twitter', v)} type="url" />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Formulaire de contact</h2>
        <label style={s.toggle}>
          <input
            type="checkbox"
            checked={c.formulaire?.actif !== false}
            onChange={e => toggleForm(e.target.checked)}
          />
          <span style={{ marginLeft:8 }}>Formulaire actif</span>
        </label>
        {c.formulaire?.sujets && (
          <div>
            <label style={s.label}>Sujets disponibles (un par ligne)</label>
            <textarea
              style={{ ...s.input, height:100, resize:'vertical', fontFamily:'monospace', fontSize:'0.85rem' }}
              value={(c.formulaire.sujets || []).join('\n')}
              onChange={e => onChange('contact', {
                ...c,
                formulaire: { ...c.formulaire, sujets: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontWeight:600, fontSize:'0.85rem', color:'#374151' }}>{label}</label>
      <input style={s.input} type={type} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

const s = {
  header:  { display:'flex', alignItems:'center', marginBottom:28 },
  title:   { fontSize:'1.5rem', fontWeight:700, margin:0 },
  section: { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'22px 24px', marginBottom:20, display:'flex', flexDirection:'column', gap:16 },
  h2:      { fontSize:'1rem', fontWeight:700, color:'#374151', margin:'0 0 4px' },
  label:   { fontWeight:600, fontSize:'0.85rem', color:'#374151' },
  input:   { padding:'9px 12px', borderRadius:7, border:'1.5px solid #e5e7eb', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' },
  toggle:  { display:'flex', alignItems:'center', cursor:'pointer', fontSize:'0.9rem', fontWeight:600, color:'#374151' },
};

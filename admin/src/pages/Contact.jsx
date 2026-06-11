import SaveStatus from '../components/SaveStatus';

const INPUT = { padding:'10px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', background:'#fff', color:'#191a23', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' };
const LABEL = { fontWeight:600, fontSize:'0.82rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' };
const SECTION = { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'22px 24px', marginBottom:16, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' };
const H2 = { fontSize:'0.95rem', fontWeight:700, color:'#191a23', margin:'0 0 4px' };

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
      <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'#191a23', margin:0 }}>Contact</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={SECTION}>
        <Field label="Titre de la section" value={c.titre}       onChange={v => set('titre', v)} />
        <Field label="Description"         value={c.description} onChange={v => set('description', v)} />
      </div>

      <div style={SECTION}>
        <h2 style={H2}>Coordonnées</h2>
        <Field label="Adresse e-mail"  value={c.email}     onChange={v => set('email', v)} type="email" />
        <Field label="Adresse postale" value={c.adresse}   onChange={v => set('adresse', v)} />
        <Field label="Téléphone"       value={c.telephone} onChange={v => set('telephone', v)} />
      </div>

      <div style={SECTION}>
        <h2 style={H2}>Réseaux sociaux</h2>
        <Field label="Facebook"  value={c.reseauxSociaux?.facebook}  onChange={v => setSocial('facebook', v)} type="url" />
        <Field label="Instagram" value={c.reseauxSociaux?.instagram} onChange={v => setSocial('instagram', v)} type="url" />
        <Field label="YouTube"   value={c.reseauxSociaux?.youtube}   onChange={v => setSocial('youtube', v)} type="url" />
        <Field label="Discord"   value={c.reseauxSociaux?.discord}   onChange={v => setSocial('discord', v)} type="url" />
        <Field label="Twitter/X" value={c.reseauxSociaux?.twitter}   onChange={v => setSocial('twitter', v)} type="url" />
      </div>

      <div style={SECTION}>
        <h2 style={H2}>Formulaire de contact</h2>
        <label style={{ display:'flex', alignItems:'center', cursor:'pointer', fontSize:'0.9rem', fontWeight:600, color:'#374151', gap:10 }}>
          <input
            type="checkbox"
            checked={c.formulaire?.actif !== false}
            onChange={e => toggleForm(e.target.checked)}
            style={{ accentColor:'#191a23', width:16, height:16 }}
          />
          Formulaire actif
        </label>
        {c.formulaire?.sujets && (
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <label style={LABEL}>Sujets disponibles (un par ligne)</label>
            <textarea
              style={{ ...INPUT, height:100, resize:'vertical', fontFamily:'monospace', fontSize:'0.85rem' }}
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
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={LABEL}>{label}</label>
      <input style={INPUT} type={type} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

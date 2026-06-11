import SaveStatus from '../components/SaveStatus';

const INPUT = { padding:'10px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', background:'#fff', color:'#191a23', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' };
const LABEL = { fontWeight:600, fontSize:'0.82rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' };
const SECTION = { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'22px 24px', marginBottom:16, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' };
const H2 = { fontSize:'0.95rem', fontWeight:700, color:'#191a23', margin:'0 0 4px' };

export default function FooterPage({ content, onChange, saveStatus }) {
  const f = content?.footer || {};

  function set(key, val) {
    onChange('footer', { ...f, [key]: val });
  }

  function setNewsletterField(key, val) {
    onChange('footer', { ...f, newsletter: { ...f.newsletter, [key]: val } });
  }

  function setLink(idx, key, val) {
    const liens = [...(f.liens || [])];
    liens[idx] = { ...liens[idx], [key]: val };
    set('liens', liens);
  }

  function addLink() {
    set('liens', [...(f.liens || []), { label: '', href: '' }]);
  }

  function deleteLink(idx) {
    set('liens', (f.liens || []).filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'#191a23', margin:0 }}>Footer</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={SECTION}>
        <Field label="Texte copyright"          value={f.copyright}    onChange={v => set('copyright', v)} />
        <Field label="Email de contact affiché" value={f.emailContact} onChange={v => set('emailContact', v)} type="email" />
      </div>

      <div style={SECTION}>
        <h2 style={H2}>Newsletter</h2>
        <Field label="Placeholder champ e-mail"  value={f.newsletter?.placeholder} onChange={v => setNewsletterField('placeholder', v)} />
        <Field label="Texte du bouton newsletter" value={f.newsletter?.ctaLabel}   onChange={v => setNewsletterField('ctaLabel', v)} />
      </div>

      <div style={SECTION}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={H2}>Liens de navigation</h2>
          <button
            style={{ padding:'7px 14px', background:'#191a23', color:'#fff', border:'none', borderRadius:8, fontSize:'0.85rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}
            onClick={addLink}
          >
            + Ajouter
          </button>
        </div>
        {(f.liens || []).map((lien, idx) => (
          <div key={idx} style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input
              style={{ ...INPUT, flex:1 }}
              value={lien.label || ''}
              onChange={e => setLink(idx, 'label', e.target.value)}
              placeholder="Texte"
            />
            <input
              style={{ ...INPUT, flex:2 }}
              value={lien.href || ''}
              onChange={e => setLink(idx, 'href', e.target.value)}
              placeholder="Lien (ex: #contact)"
            />
            <button
              style={{ padding:'7px 10px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:7, fontSize:'0.82rem', cursor:'pointer' }}
              onClick={() => deleteLink(idx)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div style={SECTION}>
        <Field label="Texte mentions légales / politique de confidentialité" value={f.mentionsLegales} onChange={v => set('mentionsLegales', v)} />
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

import SaveStatus from '../components/SaveStatus';

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
      <div style={s.header}>
        <h1 style={s.title}>Footer</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={s.section}>
        <Field label="Texte copyright" value={f.copyright}      onChange={v => set('copyright', v)} />
        <Field label="Email de contact affiché" value={f.emailContact} onChange={v => set('emailContact', v)} type="email" />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Newsletter</h2>
        <Field label="Placeholder champ e-mail"   value={f.newsletter?.placeholder} onChange={v => setNewsletterField('placeholder', v)} />
        <Field label="Texte du bouton newsletter"  value={f.newsletter?.ctaLabel}   onChange={v => setNewsletterField('ctaLabel', v)} />
      </div>

      <div style={s.section}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={s.h2}>Liens de navigation</h2>
          <button style={s.btnAdd} onClick={addLink}>+ Ajouter</button>
        </div>
        {(f.liens || []).map((lien, idx) => (
          <div key={idx} style={s.linkRow}>
            <input
              style={{ ...s.input, flex:1 }}
              value={lien.label || ''}
              onChange={e => setLink(idx, 'label', e.target.value)}
              placeholder="Texte"
            />
            <input
              style={{ ...s.input, flex:2 }}
              value={lien.href || ''}
              onChange={e => setLink(idx, 'href', e.target.value)}
              placeholder="Lien (ex: #contact)"
            />
            <button style={s.btnDelete} onClick={() => deleteLink(idx)}>✕</button>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <Field label="Texte mentions légales / politique de confidentialité" value={f.mentionsLegales} onChange={v => set('mentionsLegales', v)} />
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
  input:   { padding:'9px 12px', borderRadius:7, border:'1.5px solid #e5e7eb', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' },
  linkRow: { display:'flex', gap:8, alignItems:'center' },
  btnAdd:  { padding:'7px 14px', background:'#191a23', color:'#fff', border:'none', borderRadius:7, fontSize:'0.85rem', cursor:'pointer' },
  btnDelete:{ padding:'7px 10px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:6, fontSize:'0.82rem', cursor:'pointer' },
};

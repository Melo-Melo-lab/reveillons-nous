import SaveStatus from '../components/SaveStatus';

const INPUT = { padding:'10px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', background:'#fff', color:'#191a23', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' };
const LABEL = { fontWeight:600, fontSize:'0.82rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' };
const SECTION = { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'22px 24px', marginBottom:16, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' };
const H2 = { fontSize:'0.95rem', fontWeight:700, color:'#191a23', margin:'0 0 4px' };

export default function Hero({ content, onChange, saveStatus }) {
  const hero = content?.hero || {};

  function set(key, val) {
    onChange('hero', { ...hero, [key]: val });
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'#191a23', margin:0 }}>Page d&apos;accueil — Hero</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={SECTION}>
        <Field label="Titre principal" value={hero.titre} onChange={v => set('titre', v)} />
        <Textarea label="Texte de description" value={hero.texte} onChange={v => set('texte', v)} />
      </div>

      <div style={SECTION}>
        <h2 style={H2}>Vidéo hero</h2>
        <Field label="URL ou chemin de la vidéo (ex : /img/video-3.mp4)" value={hero.videoUrl} onChange={v => set('videoUrl', v)} />
      </div>

      <div style={SECTION}>
        <h2 style={H2}>Bouton CTA</h2>
        <Field label="Texte du bouton" value={hero.ctaLabel} onChange={v => set('ctaLabel', v)} />
        <Field label="Lien du bouton"  value={hero.ctaHref}  onChange={v => set('ctaHref', v)} type="url" />
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

function Textarea({ label, value, onChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={LABEL}>{label}</label>
      <textarea style={{ ...INPUT, height:110, resize:'vertical' }} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

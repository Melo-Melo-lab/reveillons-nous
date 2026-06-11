import SaveStatus from '../components/SaveStatus';
import ImageUploader from '../components/ImageUploader';

export default function Hero({ content, onChange, saveStatus }) {
  const hero = content?.hero || {};

  function set(key, val) {
    onChange('hero', { ...hero, [key]: val });
  }

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>Page d&apos;accueil — Hero</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={s.section}>
        <Field label="Titre principal" value={hero.titre} onChange={v => set('titre', v)} />
        <Textarea label="Texte de description" value={hero.texte} onChange={v => set('texte', v)} />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Vidéo hero</h2>
        <Field label="URL ou chemin de la vidéo (ex : /img/video-3.mp4)" value={hero.videoUrl} onChange={v => set('videoUrl', v)} />
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>Bouton CTA</h2>
        <Field label="Texte du bouton"  value={hero.ctaLabel} onChange={v => set('ctaLabel', v)} />
        <Field label="Lien du bouton"   value={hero.ctaHref}  onChange={v => set('ctaHref', v)} type="url" />
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

function Textarea({ label, value, onChange }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <textarea style={{ ...s.input, height:110, resize:'vertical' }} value={value || ''} onChange={e => onChange(e.target.value)} />
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
};

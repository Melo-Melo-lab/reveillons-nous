import { useState } from 'react';
import SaveStatus from '../components/SaveStatus';
import ImageUploader from '../components/ImageUploader';

const INPUT = { padding:'10px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', background:'#fff', color:'#191a23', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' };
const LABEL = { fontWeight:600, fontSize:'0.82rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' };
const SECTION = { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'22px 24px', marginBottom:16, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' };
const H2 = { fontSize:'0.95rem', fontWeight:700, color:'#191a23', margin:'0 0 4px' };

export default function Partenaires({ content, onChange, saveStatus }) {
  const partenaires = content?.partenaires || {};
  const logos = partenaires.logos || [];

  const [newUrl, setNewUrl]           = useState('');
  const [newAlt, setNewAlt]           = useState('');
  const [uploaderKey, setUploaderKey] = useState(0);

  function setLogos(newLogos) {
    onChange('partenaires', { ...partenaires, logos: newLogos });
  }

  function addLogo() {
    if (!newUrl.trim()) return;
    setLogos([...logos, { url: newUrl.trim(), alt: newAlt.trim() }]);
    setNewUrl('');
    setNewAlt('');
    setUploaderKey(k => k + 1);
  }

  function removeLogo(i) {
    setLogos(logos.filter((_, idx) => idx !== i));
  }

  function updateAlt(i, alt) {
    const updated = [...logos];
    updated[i] = { ...updated[i], alt };
    setLogos(updated);
  }

  function updateUrl(i, url) {
    const updated = [...logos];
    updated[i] = { ...updated[i], url };
    setLogos(updated);
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'#191a23', margin:0 }}>Logos partenaires</h1>
        <SaveStatus status={saveStatus} />
      </div>

      {/* Logos existants */}
      {logos.map((logo, i) => (
        <div key={i} style={SECTION}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h2 style={H2}>Logo {i + 1}</h2>
            <button
              onClick={() => removeLogo(i)}
              style={{ background:'#fee2e2', border:'none', color:'#dc2626', borderRadius:8, padding:'7px 14px', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:'0.82rem' }}
            >
              Supprimer
            </button>
          </div>
          <ImageUploader
            label="Logo partenaire"
            value={logo.url}
            onChange={url => updateUrl(i, url)}
          />
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <label style={LABEL}>Texte alternatif</label>
            <input
              style={INPUT}
              type="text"
              value={logo.alt || ''}
              onChange={e => updateAlt(i, e.target.value)}
              placeholder="Nom du partenaire (ex: AFCIA)"
            />
          </div>
        </div>
      ))}

      {/* Ajouter un logo */}
      <div style={SECTION}>
        <h2 style={H2}>Ajouter un logo</h2>
        <ImageUploader
          key={uploaderKey}
          label="Logo (glisser ou cliquer)"
          value={newUrl}
          onChange={setNewUrl}
        />
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          <label style={LABEL}>Texte alternatif</label>
          <input
            style={INPUT}
            type="text"
            value={newAlt}
            onChange={e => setNewAlt(e.target.value)}
            placeholder="Nom du partenaire (ex: La Ruche)"
          />
        </div>
        <button
          onClick={addLogo}
          disabled={!newUrl.trim()}
          style={{
            alignSelf: 'flex-start',
            padding: '11px 24px',
            background: newUrl.trim() ? '#191a23' : '#e5e7eb',
            color: newUrl.trim() ? '#fff' : '#9ca3af',
            border: 'none', borderRadius: 8,
            fontSize: '0.9rem', fontFamily:'inherit', fontWeight:600,
            cursor: newUrl.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          + Ajouter ce logo
        </button>
      </div>
    </div>
  );
}

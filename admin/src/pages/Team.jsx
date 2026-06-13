import { useState } from 'react';
import SaveStatus from '../components/SaveStatus';
import ImageUploader from '../components/ImageUploader';

const INPUT = { padding:'10px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', background:'#fff', color:'#191a23', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' };
const LABEL = { fontWeight:600, fontSize:'0.82rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' };
const SECTION = { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'22px 24px', marginBottom:16, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' };

function uid() { return 'm' + Date.now(); }
const EMPTY = { nom:'', role:'', description:'', photo:'', linkedin:'' };

export default function Team({ content, onChange, saveStatus }) {
  const team    = content?.team || {};
  const membres = team.membres || [];

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [confirm, setConfirm]   = useState(null);

  function setTeam(patch) {
    onChange('team', { ...team, ...patch });
  }

  function setMembres(list) {
    setTeam({ membres: list });
  }

  function handleSave(membre) {
    if (editing !== null) {
      setMembres(membres.map((m, i) => i === editing ? membre : m));
      setEditing(null);
    } else {
      setMembres([...membres, { id: uid(), ...membre }]);
      setShowForm(false);
    }
  }

  function handleDelete(idx) {
    setMembres(membres.filter((_, i) => i !== idx));
    setConfirm(null);
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'#191a23', margin:0 }}>Team</h1>
        <SaveStatus status={saveStatus} />
      </div>

      {/* Titre et description */}
      <div style={SECTION}>
        <Field label="Titre de la section" value={team.label}       onChange={v => setTeam({ label: v })} />
        <Field label="Description"         value={team.description} onChange={v => setTeam({ description: v })} />
      </div>

      {/* Liste des membres */}
      <div style={SECTION}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontSize:'0.95rem', fontWeight:700, color:'#191a23', margin:0 }}>
            Membres ({membres.length})
          </h2>
          <button
            style={{ padding:'8px 16px', background:'#191a23', color:'#fff', border:'none', borderRadius:8, fontSize:'0.88rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}
            onClick={() => { setShowForm(true); setEditing(null); }}
          >
            + Ajouter
          </button>
        </div>

        {showForm && editing === null && (
          <div style={{ background:'#f9fafb', borderRadius:10, padding:18, border:'1.5px dashed #d1d5db' }}>
            <MemberForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {membres.length === 0 && !showForm && (
          <p style={{ color:'#9ca3af', fontSize:'0.88rem', textAlign:'center', padding:'20px 0' }}>
            Aucun membre. Cliquez sur « + Ajouter » pour commencer.
          </p>
        )}

        {membres.map((m, idx) => (
          <div key={m.id || idx}>
            {editing === idx ? (
              <div style={{ background:'#f9fafb', borderRadius:10, padding:18, border:'1.5px dashed #d1d5db', marginBottom:8 }}>
                <MemberForm initial={m} onSave={handleSave} onCancel={() => setEditing(null)} />
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', border:'1.5px solid #e5e7eb', borderRadius:10, marginBottom:8, background:'#fff' }}>
                {m.photo && (
                  <img src={m.photo} alt={m.nom} style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                )}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:'0.9rem', color:'#191a23', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {m.nom || '(Sans nom)'}
                  </div>
                  <div style={{ fontSize:'0.8rem', color:'#9ca3af', marginTop:2 }}>
                    {m.role}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button
                    style={{ padding:'6px 12px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:6, fontSize:'0.82rem', cursor:'pointer', fontFamily:'inherit' }}
                    onClick={() => setEditing(idx)}
                  >
                    Modifier
                  </button>
                  <button
                    style={{ padding:'6px 10px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:6, fontSize:'0.82rem', cursor:'pointer' }}
                    onClick={() => setConfirm(idx)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modale confirmation suppression */}
      {confirm !== null && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:14, padding:'28px 32px', minWidth:300, boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}>
            <p style={{ margin:'0 0 20px', color:'#191a23', fontWeight:600 }}>Supprimer ce membre ?</p>
            <div style={{ display:'flex', gap:10 }}>
              <button
                style={{ padding:'10px 20px', background:'#dc2626', color:'#fff', border:'none', borderRadius:8, fontSize:'0.9rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}
                onClick={() => handleDelete(confirm)}
              >
                Supprimer
              </button>
              <button
                style={{ padding:'10px 20px', background:'#fff', color:'#6b7280', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:'0.9rem', cursor:'pointer', fontFamily:'inherit' }}
                onClick={() => setConfirm(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MemberForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <ImageUploader label="Photo de profil" value={form.photo} onChange={v => set('photo', v)} />
      <Field label="Nom *" value={form.nom} onChange={v => set('nom', v)} />
      <Field label="Rôle" value={form.role} onChange={v => set('role', v)} />
      <Textarea label="Description" value={form.description} onChange={v => set('description', v)} />
      <Field label="URL LinkedIn" value={form.linkedin} onChange={v => set('linkedin', v)} type="url" placeholder="https://linkedin.com/in/..." />
      <div style={{ display:'flex', gap:10, marginTop:4 }}>
        <button
          onClick={() => onSave(form)}
          disabled={!form.nom.trim()}
          style={{ padding:'10px 20px', background: form.nom.trim() ? '#191a23' : '#e5e7eb', color: form.nom.trim() ? '#fff' : '#9ca3af', border:'none', borderRadius:8, fontSize:'0.9rem', fontFamily:'inherit', fontWeight:600, cursor: form.nom.trim() ? 'pointer' : 'not-allowed' }}
        >
          {initial ? 'Enregistrer' : '+ Ajouter'}
        </button>
        <button
          onClick={onCancel}
          style={{ padding:'10px 20px', background:'#fff', color:'#6b7280', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:'0.9rem', cursor:'pointer', fontFamily:'inherit' }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={LABEL}>{label}</label>
      <input style={INPUT} type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} />
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

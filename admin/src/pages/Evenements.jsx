import { useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SaveStatus from '../components/SaveStatus';
import EventForm from '../components/EventForm';

const INPUT = { padding:'10px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', background:'#fff', color:'#191a23', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' };
const LABEL = { fontWeight:600, fontSize:'0.82rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' };
const SECTION = { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'22px 24px', marginBottom:16, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' };

export default function Evenements({ content, onChange, saveStatus }) {
  const ev    = content?.evenements || {};
  const liste = ev.liste || [];

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [confirm, setConfirm]   = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function updateListe(newListe) {
    onChange('evenements', { ...ev, liste: newListe });
  }

  function handleSave(event) {
    if (editing !== null) {
      updateListe(liste.map((e, i) => i === editing ? event : e));
      setEditing(null);
    } else {
      updateListe([...liste, event]);
      setShowForm(false);
    }
  }

  function handleDelete(idx) {
    updateListe(liste.filter((_, i) => i !== idx));
    setConfirm(null);
  }

  function handleDragEnd(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = liste.findIndex(ev => ev.id === active.id);
    const to   = liste.findIndex(ev => ev.id === over.id);
    updateListe(arrayMove(liste, from, to));
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'#191a23', margin:0 }}>Événements</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={SECTION}>
        <Field label="Titre de la section" value={ev.titre}       onChange={v => onChange('evenements', { ...ev, titre: v })} />
        <Field label="Description"         value={ev.description} onChange={v => onChange('evenements', { ...ev, description: v })} />
      </div>

      <div style={SECTION}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontSize:'0.95rem', fontWeight:700, color:'#191a23', margin:0 }}>
            Liste des événements ({liste.length})
          </h2>
          <button
            style={{ padding:'8px 16px', background:'#191a23', color:'#fff', border:'none', borderRadius:8, fontSize:'0.88rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}
            onClick={() => { setShowForm(true); setEditing(null); }}
          >
            + Ajouter
          </button>
        </div>

        {(showForm && editing === null) && (
          <div style={{ background:'#f9fafb', borderRadius:10, padding:18, border:'1.5px dashed #d1d5db', marginBottom:4 }}>
            <EventForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {liste.length === 0 && !showForm && (
          <p style={{ color:'#9ca3af', fontSize:'0.88rem', textAlign:'center', padding:'20px 0' }}>
            Aucun événement. Cliquez sur « + Ajouter » pour commencer.
          </p>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={liste.map(e => e.id)} strategy={verticalListSortingStrategy}>
            {liste.map((event, idx) => (
              <div key={event.id}>
                {editing === idx ? (
                  <div style={{ background:'#f9fafb', borderRadius:10, padding:18, border:'1.5px dashed #d1d5db', marginBottom:8 }}>
                    <EventForm initial={event} onSave={handleSave} onCancel={() => setEditing(null)} />
                  </div>
                ) : (
                  <SortableItem event={event} onEdit={() => setEditing(idx)} onDelete={() => setConfirm(idx)} />
                )}
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {confirm !== null && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:14, padding:'28px 32px', minWidth:300, boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}>
            <p style={{ margin:'0 0 20px', color:'#191a23', fontWeight:600 }}>Supprimer cet événement ?</p>
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

function SortableItem({ event, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: event.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={{
      display:'flex', alignItems:'center', gap:12,
      padding:'12px 14px',
      border:'1.5px solid #e5e7eb',
      borderRadius:10, marginBottom:8,
      background:'#fff',
      ...style,
    }}>
      <span style={{ cursor:'grab', color:'#d1d5db', fontSize:'1.1rem', lineHeight:1 }} {...attributes} {...listeners}>⠿</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:600, fontSize:'0.9rem', color:'#191a23', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {event.titre}
        </div>
        <div style={{ fontSize:'0.8rem', color:'#9ca3af', marginTop:2 }}>
          {event.date && new Date(event.date).toLocaleDateString('fr-FR')}
          {event.heure && ` — ${event.heure}`}
          {event.lieu && ` · ${event.lieu}`}
          {event.categories?.length > 0 && ` · ${event.categories.join(', ')}`}
        </div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button
          style={{ padding:'6px 12px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:6, fontSize:'0.82rem', cursor:'pointer', fontFamily:'inherit' }}
          onClick={onEdit}
        >
          Modifier
        </button>
        <button
          style={{ padding:'6px 10px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:6, fontSize:'0.82rem', cursor:'pointer' }}
          onClick={onDelete}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={LABEL}>{label}</label>
      <input style={INPUT} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

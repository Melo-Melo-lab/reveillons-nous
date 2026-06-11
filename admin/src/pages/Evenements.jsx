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

export default function Evenements({ content, onChange, saveStatus }) {
  const ev     = content?.evenements || {};
  const liste  = ev.liste || [];

  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [confirm, setConfirm]     = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function updateListe(newListe) {
    onChange('evenements', { ...ev, liste: newListe });
  }

  function handleSave(event) {
    if (editing !== null) {
      const updated = liste.map((e, i) => i === editing ? event : e);
      updateListe(updated);
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
      <div style={s.header}>
        <h1 style={s.title}>Événements</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={s.section}>
        <Field label="Titre de la section"  value={ev.titre}       onChange={v => onChange('evenements', { ...ev, titre: v })} />
        <Field label="Description"          value={ev.description} onChange={v => onChange('evenements', { ...ev, description: v })} />
      </div>

      <div style={s.section}>
        <div style={s.listHeader}>
          <h2 style={s.h2}>Liste des événements ({liste.length})</h2>
          <button style={s.btnAdd} onClick={() => { setShowForm(true); setEditing(null); }}>+ Ajouter</button>
        </div>

        {(showForm && editing === null) && (
          <div style={s.formWrap}>
            <EventForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {liste.length === 0 && !showForm && (
          <p style={s.empty}>Aucun événement. Cliquez sur « + Ajouter » pour commencer.</p>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={liste.map(e => e.id)} strategy={verticalListSortingStrategy}>
            {liste.map((event, idx) => (
              <div key={event.id}>
                {editing === idx ? (
                  <div style={s.formWrap}>
                    <EventForm
                      initial={event}
                      onSave={handleSave}
                      onCancel={() => setEditing(null)}
                    />
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
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <p style={{ margin:'0 0 16px' }}>Supprimer cet événement ?</p>
            <div style={{ display:'flex', gap:10 }}>
              <button style={s.btnDanger}    onClick={() => handleDelete(confirm)}>Supprimer</button>
              <button style={s.btnSecondary} onClick={() => setConfirm(null)}>Annuler</button>
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
    <div ref={setNodeRef} style={{ ...s.item, ...style }}>
      <span style={s.handle} {...attributes} {...listeners}>⠿</span>
      <div style={s.itemBody}>
        <div style={s.itemTitle}>{event.titre}</div>
        <div style={s.itemMeta}>
          {event.date && new Date(event.date).toLocaleDateString('fr-FR')}
          {event.heure && ` — ${event.heure}`}
          {event.lieu && ` · ${event.lieu}`}
        </div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button style={s.btnEdit} onClick={onEdit}>Modifier</button>
        <button style={s.btnDelete} onClick={onDelete}>✕</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontWeight:600, fontSize:'0.85rem', color:'#374151' }}>{label}</label>
      <input style={s.input} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

const s = {
  header:      { display:'flex', alignItems:'center', marginBottom:28 },
  title:       { fontSize:'1.5rem', fontWeight:700, margin:0 },
  section:     { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'22px 24px', marginBottom:20, display:'flex', flexDirection:'column', gap:16 },
  listHeader:  { display:'flex', alignItems:'center', justifyContent:'space-between' },
  h2:          { fontSize:'1rem', fontWeight:700, color:'#374151', margin:0 },
  btnAdd:      { padding:'8px 16px', background:'#191a23', color:'#fff', border:'none', borderRadius:7, fontSize:'0.88rem', cursor:'pointer' },
  formWrap:    { background:'#f9fafb', borderRadius:8, padding:'18px', border:'1.5px dashed #d1d5db', marginBottom:12 },
  empty:       { color:'#9ca3af', fontSize:'0.88rem', textAlign:'center', padding:'20px 0' },
  item:        { display:'flex', alignItems:'center', gap:12, padding:'12px 14px', border:'1.5px solid #e5e7eb', borderRadius:8, marginBottom:8, background:'#fff' },
  handle:      { cursor:'grab', color:'#9ca3af', fontSize:'1.1rem', lineHeight:1 },
  itemBody:    { flex:1, minWidth:0 },
  itemTitle:   { fontWeight:600, fontSize:'0.9rem', color:'#111827', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  itemMeta:    { fontSize:'0.8rem', color:'#6b7280', marginTop:2 },
  input:       { padding:'9px 12px', borderRadius:7, border:'1.5px solid #e5e7eb', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' },
  btnEdit:     { padding:'6px 12px', background:'#f3f4f6', border:'none', borderRadius:6, fontSize:'0.82rem', cursor:'pointer' },
  btnDelete:   { padding:'6px 10px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:6, fontSize:'0.82rem', cursor:'pointer' },
  btnDanger:   { padding:'9px 18px', background:'#dc2626', color:'#fff', border:'none', borderRadius:7, fontSize:'0.88rem', cursor:'pointer' },
  btnSecondary:{ padding:'9px 18px', background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:7, fontSize:'0.88rem', cursor:'pointer' },
  modalOverlay:{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  modal:       { background:'#fff', borderRadius:12, padding:'28px 32px', minWidth:300 },
};

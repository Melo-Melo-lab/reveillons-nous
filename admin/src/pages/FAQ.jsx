import { useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SaveStatus from '../components/SaveStatus';

export default function FAQ({ content, onChange, saveStatus }) {
  const faq   = content?.faq || {};
  const items = faq.items || [];

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [expanded, setExpanded] = useState(null);

  function updateItems(newItems) {
    onChange('faq', { ...faq, items: newItems });
  }

  function setItemField(idx, key, val) {
    updateItems(items.map((it, i) => i === idx ? { ...it, [key]: val } : it));
  }

  function handleDragEnd(e) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = items.findIndex(it => it.id === active.id);
    const to   = items.findIndex(it => it.id === over.id);
    const reordered = arrayMove(items, from, to).map((it, i) => ({
      ...it,
      numero: String(i + 1).padStart(2, '0'),
    }));
    updateItems(reordered);
  }

  function addItem() {
    const id = `faq-${Date.now()}`;
    const numero = String(items.length + 1).padStart(2, '0');
    updateItems([...items, { id, numero, question: '', reponse: '' }]);
    setExpanded(items.length);
  }

  function deleteItem(idx) {
    const updated = items
      .filter((_, i) => i !== idx)
      .map((it, i) => ({ ...it, numero: String(i + 1).padStart(2, '0') }));
    updateItems(updated);
    setExpanded(null);
  }

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.title}>FAQ</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={s.section}>
        <Field label="Titre de la section"  value={faq.titre}       onChange={v => onChange('faq', { ...faq, titre: v })} />
        <Field label="Description"          value={faq.description} onChange={v => onChange('faq', { ...faq, description: v })} />
      </div>

      <div style={s.section}>
        <div style={s.listHeader}>
          <h2 style={s.h2}>Questions ({items.length})</h2>
          <button style={s.btnAdd} onClick={addItem}>+ Ajouter</button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(it => it.id)} strategy={verticalListSortingStrategy}>
            {items.map((item, idx) => (
              <SortableItem
                key={item.id}
                item={item}
                isOpen={expanded === idx}
                onToggle={() => setExpanded(expanded === idx ? null : idx)}
                onChange={(key, val) => setItemField(idx, key, val)}
                onDelete={() => deleteItem(idx)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function SortableItem({ item, isOpen, onToggle, onChange, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={{ ...s.item, ...style }}>
      <div style={s.itemHeader}>
        <span style={s.handle} {...attributes} {...listeners}>⠿</span>
        <span style={s.itemNum}>{item.numero}</span>
        <button style={s.itemToggle} onClick={onToggle}>
          {item.question || '(Sans titre)'}
          <span style={{ marginLeft:'auto', opacity:.5 }}>{isOpen ? '▲' : '▼'}</span>
        </button>
        <button style={s.btnDelete} onClick={onDelete}>✕</button>
      </div>
      {isOpen && (
        <div style={s.itemBody}>
          <Field label="Question"          value={item.question} onChange={v => onChange('question', v)} />
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={s.label}>Réponse (HTML autorisé)</label>
            <textarea
              style={{ ...s.input, height:120, resize:'vertical', fontFamily:'monospace', fontSize:'0.85rem' }}
              value={item.reponse || ''}
              onChange={e => onChange('reponse', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={s.label}>{label}</label>
      <input style={s.input} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

const s = {
  header:     { display:'flex', alignItems:'center', marginBottom:28 },
  title:      { fontSize:'1.5rem', fontWeight:700, margin:0 },
  section:    { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'22px 24px', marginBottom:20, display:'flex', flexDirection:'column', gap:16 },
  listHeader: { display:'flex', alignItems:'center', justifyContent:'space-between' },
  h2:         { fontSize:'1rem', fontWeight:700, color:'#374151', margin:0 },
  btnAdd:     { padding:'8px 16px', background:'#191a23', color:'#fff', border:'none', borderRadius:7, fontSize:'0.88rem', cursor:'pointer' },
  item:       { border:'1.5px solid #e5e7eb', borderRadius:8, marginBottom:8, overflow:'hidden' },
  itemHeader: { display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#f9fafb' },
  handle:     { cursor:'grab', color:'#9ca3af', fontSize:'1.1rem' },
  itemNum:    { fontSize:'0.8rem', fontWeight:700, color:'#9ca3af', minWidth:22 },
  itemToggle: { flex:1, display:'flex', alignItems:'center', gap:8, background:'none', border:'none', textAlign:'left', cursor:'pointer', fontFamily:'inherit', fontSize:'0.88rem', fontWeight:600, color:'#374151' },
  itemBody:   { padding:'16px 14px', display:'flex', flexDirection:'column', gap:14, borderTop:'1px solid #e5e7eb' },
  btnDelete:  { padding:'4px 8px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:5, fontSize:'0.8rem', cursor:'pointer' },
  label:      { fontWeight:600, fontSize:'0.85rem', color:'#374151' },
  input:      { padding:'9px 12px', borderRadius:7, border:'1.5px solid #e5e7eb', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' },
};

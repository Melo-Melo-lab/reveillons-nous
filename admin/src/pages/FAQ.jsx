import { useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SaveStatus from '../components/SaveStatus';

function htmlToPlain(html = '') {
  return html
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function plainToHtml(text = '') {
  const paragraphs = text.split(/\n{2,}/);
  if (paragraphs.length > 1) {
    return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');
  }
  return text.replace(/\n/g, '<br/>');
}

const INPUT = { padding:'10px 14px', borderRadius:8, border:'1.5px solid #e5e7eb', background:'#fff', color:'#191a23', fontSize:'0.9rem', fontFamily:'inherit', outline:'none' };
const LABEL = { fontWeight:600, fontSize:'0.82rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' };
const SECTION = { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:12, padding:'22px 24px', marginBottom:16, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' };

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
      <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'#191a23', margin:0 }}>FAQ</h1>
        <SaveStatus status={saveStatus} />
      </div>

      <div style={SECTION}>
        <Field label="Titre de la section" value={faq.titre}       onChange={v => onChange('faq', { ...faq, titre: v })} />
        <Field label="Description"         value={faq.description} onChange={v => onChange('faq', { ...faq, description: v })} />
      </div>

      <div style={SECTION}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontSize:'0.95rem', fontWeight:700, color:'#191a23', margin:0 }}>Questions ({items.length})</h2>
          <button
            style={{ padding:'8px 16px', background:'#191a23', color:'#fff', border:'none', borderRadius:8, fontSize:'0.88rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}
            onClick={addItem}
          >
            + Ajouter
          </button>
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
    <div ref={setNodeRef} style={{ border:'1.5px solid #e5e7eb', borderRadius:10, marginBottom:8, overflow:'hidden', ...style }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#f9fafb' }}>
        <span style={{ cursor:'grab', color:'#d1d5db', fontSize:'1.1rem' }} {...attributes} {...listeners}>⠿</span>
        <span style={{ fontSize:'0.78rem', fontWeight:700, color:'#d1d5db', minWidth:22 }}>{item.numero}</span>
        <button
          style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:'none', border:'none', textAlign:'left', cursor:'pointer', fontFamily:'inherit', fontSize:'0.88rem', fontWeight:600, color:'#374151', padding:0 }}
          onClick={onToggle}
        >
          {item.question || '(Sans titre)'}
          <span style={{ marginLeft:'auto', opacity:.4, fontSize:'0.75rem' }}>{isOpen ? '▲' : '▼'}</span>
        </button>
        <button
          style={{ padding:'4px 8px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:5, fontSize:'0.8rem', cursor:'pointer' }}
          onClick={onDelete}
        >
          ✕
        </button>
      </div>
      {isOpen && (
        <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:14, borderTop:'1px solid #e5e7eb', background:'#fff' }}>
          <Field label="Question" value={item.question} onChange={v => onChange('question', v)} />
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <label style={LABEL}>Réponse</label>
            <textarea
              style={{ ...INPUT, height:120, resize:'vertical' }}
              value={htmlToPlain(item.reponse)}
              onChange={e => onChange('reponse', plainToHtml(e.target.value))}
            />
          </div>
        </div>
      )}
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

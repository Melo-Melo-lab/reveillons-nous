import { useRef, useState } from 'react';
import { useUpload } from '../hooks/useUpload';

export default function ImageUploader({ value, onChange, label = 'Image' }) {
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState('');
  const inputRef = useRef();
  const { uploading, progress, uploadFile } = useUpload();

  async function handleFile(file) {
    setError('');
    try {
      const { url } = await uploadFile(file, 'image');
      onChange(url);
    } catch (e) {
      setError(e.message);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div style={s.wrap}>
      <label style={s.label}>{label}</label>
      {value && (
        <div style={s.preview}>
          <img src={value} alt="" style={s.img} />
        </div>
      )}
      <div
        style={{ ...s.dropzone, ...(dragging ? s.dropzoneActive : {}) }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {uploading
          ? <span>{progress}%</span>
          : <span>Glisser une image ou <u>cliquer</u></span>
        }
      </div>
      {error && <p style={s.error}>{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
      />
      <div style={s.urlRow}>
        <input
          type="url"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="ou coller une URL"
          style={s.urlInput}
        />
      </div>
    </div>
  );
}

const s = {
  wrap:          { display:'flex', flexDirection:'column', gap:8 },
  label:         { fontWeight:600, fontSize:'0.88rem', color:'#374151' },
  preview:       { borderRadius:8, overflow:'hidden', maxWidth:240, border:'1px solid #e5e7eb' },
  img:           { width:'100%', display:'block', maxHeight:160, objectFit:'cover' },
  dropzone:      { border:'2px dashed #d1d5db', borderRadius:8, padding:'20px 16px', textAlign:'center', cursor:'pointer', color:'#6b7280', fontSize:'0.88rem', transition:'border-color .2s' },
  dropzoneActive:{ borderColor:'#191a23' },
  error:         { color:'#dc2626', fontSize:'0.8rem', margin:0 },
  urlRow:        { display:'flex', gap:8 },
  urlInput:      { flex:1, padding:'8px 12px', borderRadius:6, border:'1px solid #d1d5db', fontSize:'0.88rem' },
};

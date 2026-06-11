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
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      <label style={{ fontWeight:600, fontSize:'0.82rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' }}>{label}</label>
      {value && (
        <div style={{ borderRadius:8, overflow:'hidden', maxWidth:240, border:'1.5px solid #e5e7eb' }}>
          <img src={value} alt="" style={{ width:'100%', display:'block', maxHeight:160, objectFit:'cover' }} />
        </div>
      )}
      <div
        style={{
          border: `2px dashed ${dragging ? '#191a23' : '#d1d5db'}`,
          borderRadius: 8,
          padding: '20px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          color: '#9ca3af',
          fontSize: '0.88rem',
          transition: 'border-color .2s, background .2s',
          background: dragging ? '#f3f4f6' : '#fafafa',
        }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {uploading
          ? <span style={{ color:'#191a23', fontWeight:600 }}>{progress}%</span>
          : <span>Glisser une image ou <u>cliquer</u></span>
        }
      </div>
      {error && <p style={{ color:'#dc2626', fontSize:'0.8rem', margin:0 }}>{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
      />
      <input
        type="url"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="ou coller une URL"
        style={{
          padding: '9px 12px',
          borderRadius: 7,
          border: '1.5px solid #e5e7eb',
          background: '#fff',
          color: '#191a23',
          fontSize: '0.88rem',
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
    </div>
  );
}

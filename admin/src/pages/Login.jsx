import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../hooks/useAdminContent';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(password);
      navigate('/tableau-de-bord', { replace: true });
    } catch (err) {
      setError(err.message || 'Mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <form style={s.box} onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe"
          style={s.input}
          autoFocus
        />
        {error && <p style={s.error}>{error}</p>}
        <button type="submit" disabled={loading} style={s.btn}>
          {loading ? '…' : 'Connexion'}
        </button>
      </form>
    </div>
  );
}

const s = {
  page:  { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#f9fafb' },
  box:   { background:'#fff', borderRadius:14, padding:'40px 48px', boxShadow:'0 4px 24px rgba(0,0,0,.08)', display:'flex', flexDirection:'column', gap:16, minWidth:300 },
  input: { padding:'13px 16px', borderRadius:8, border:'1.5px solid #e5e7eb', fontSize:'1rem', fontFamily:'inherit', outline:'none' },
  error: { color:'#dc2626', fontSize:'0.85rem', margin:0 },
  btn:   { padding:'13px', background:'#191a23', color:'#fff', border:'none', borderRadius:8, fontSize:'1rem', fontFamily:'inherit', cursor:'pointer' },
};

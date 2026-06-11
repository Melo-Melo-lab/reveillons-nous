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
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#f8f9fc',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:32, width:'100%', maxWidth:380, padding:'0 20px' }}>
        <img src="/img/logo-reveillons-nous.png" height={40} alt="Réveillons-nous" />

        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            background: '#fff',
            border: '1.5px solid #e5e7eb',
            borderRadius: 16,
            padding: '32px 28px',
            display: 'flex', flexDirection: 'column', gap: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <h1 style={{ fontSize:'1.3rem', fontWeight:700, color:'#191a23', margin:0, textAlign:'center' }}>
            Administration
          </h1>

          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:'0.82rem', fontWeight:600, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.04em' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                padding: '13px 16px',
                borderRadius: 10,
                border: '1.5px solid #e5e7eb',
                background: '#f9fafb',
                color: '#191a23',
                fontSize: '1rem',
                fontFamily: 'inherit',
                outline: 'none',
              }}
              autoFocus
            />
          </div>

          {error && (
            <p style={{ color:'#dc2626', fontSize:'0.85rem', margin:0, textAlign:'center' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              background: loading ? '#374151' : '#191a23',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: '1rem',
              fontFamily: 'inherit',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background .2s',
            }}
          >
            {loading ? '…' : 'Connexion'}
          </button>
        </form>
      </div>
    </div>
  );
}

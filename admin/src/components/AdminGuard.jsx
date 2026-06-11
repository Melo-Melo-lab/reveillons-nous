import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../hooks/useAdminContent';

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState('checking'); // checking | ok | denied

  useEffect(() => {
    verifyToken().then(valid => setStatus(valid ? 'ok' : 'denied'));
  }, []);

  if (status === 'checking') {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'sans-serif', color:'#898989' }}>
        Chargement…
      </div>
    );
  }
  if (status === 'denied') return <Navigate to="/login" replace />;
  return children;
}

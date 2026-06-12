import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminGuard from './components/AdminGuard';
import Sidebar    from './components/Sidebar';
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import GlobalSettings from './pages/GlobalSettings';
import Hero       from './pages/Hero';
import Petition   from './pages/Petition';
import Evenements from './pages/Evenements';
import FAQ        from './pages/FAQ';
import Contact    from './pages/Contact';
import FooterPage from './pages/Footer';
import Partenaires from './pages/Partenaires';
import { useAdminContent } from './hooks/useAdminContent';

function AdminLayout() {
  const { content, loading, saveStatus, updateSection } = useAdminContent();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#9ca3af', fontFamily:"'Space Grotesk', sans-serif", background:'#f8f9fc', fontSize:'1rem' }}>
        Chargement…
      </div>
    );
  }

  const pageProps = { content, onChange: updateSection, saveStatus };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Space Grotesk', sans-serif", background:'#f8f9fc', color:'#191a23' }}>

      {/* Header fixe — mobile uniquement */}
      {isMobile && (
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 56,
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', zIndex: 200,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              width: 40, height: 40,
              background: '#f3f4f6',
              border: 'none', borderRadius: 8,
              color: '#191a23',
              fontSize: '1.2rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>
          <img src="/img/logo-reveillons-nous.png" height={28} alt="Réveillons-nous" style={{ display:'block' }} />
          <div style={{ width: 40 }} />
        </header>
      )}

      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main style={{
        flex: 1,
        padding: isMobile ? '76px 16px 40px' : '40px 48px',
        overflowY: 'auto',
        minWidth: 0,
        maxWidth: isMobile ? '100%' : 860,
      }}>
        <Routes>
          <Route path="tableau-de-bord" element={<Dashboard {...pageProps} />} />
          <Route path="parametres"      element={<GlobalSettings {...pageProps} />} />
          <Route path="hero"            element={<Hero {...pageProps} />} />
          <Route path="petition"        element={<Petition {...pageProps} />} />
          <Route path="evenements"      element={<Evenements {...pageProps} />} />
          <Route path="faq"             element={<FAQ {...pageProps} />} />
          <Route path="contact"         element={<Contact {...pageProps} />} />
          <Route path="footer"          element={<FooterPage {...pageProps} />} />
          <Route path="partenaires"     element={<Partenaires {...pageProps} />} />
          <Route path="*"               element={<Navigate to="tableau-de-bord" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

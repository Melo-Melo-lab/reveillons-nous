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
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#6b7280', fontFamily:'sans-serif' }}>
        Chargement…
      </div>
    );
  }

  const pageProps = { content, onChange: updateSection, saveStatus };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'system-ui, -apple-system, sans-serif', background:'#f9fafb', color:'#111827' }}>
      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
      />
      <main style={{
        flex: 1,
        padding: isMobile ? '60px 16px 24px' : '36px 40px',
        overflowY: 'auto',
        maxWidth: isMobile ? '100%' : 900,
        minWidth: 0,
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

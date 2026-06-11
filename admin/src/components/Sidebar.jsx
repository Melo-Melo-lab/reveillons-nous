import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../hooks/useAdminContent';

const NAV = [
  { to: '/tableau-de-bord', label: 'Tableau de bord' },
  { to: '/parametres',      label: 'Paramètres globaux' },
  { to: '/hero',            label: "Page d'accueil" },
  { to: '/petition',        label: 'Pétition' },
  { to: '/evenements',      label: 'Événements' },
  { to: '/faq',             label: 'FAQ' },
  { to: '/contact',         label: 'Contact' },
  { to: '/footer',          label: 'Footer' },
];

const linkStyle = (isActive, side = 'left') => ({
  display: 'block',
  padding: '11px 20px',
  color: isActive ? '#b9ff66' : 'rgba(255,255,255,0.55)',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: isActive ? 600 : 400,
  background: isActive ? 'rgba(185,255,102,0.07)' : 'transparent',
  [side === 'left' ? 'borderLeft' : 'borderRight']: isActive ? '3px solid #b9ff66' : '3px solid transparent',
  transition: 'background .15s, color .15s',
});

export default function Sidebar({ isMobile, isOpen, onClose }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              zIndex: 299,
            }}
          />
        )}

        {/* Drawer depuis la DROITE */}
        <aside style={{
          position: 'fixed', top: 0, right: 0,
          width: 280, height: '100vh',
          background: '#191a23',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column',
          zIndex: 300,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s ease',
          boxShadow: isOpen ? '-4px 0 32px rgba(0,0,0,0.5)' : 'none',
          overflowY: 'auto',
        }}>
          {/* Header drawer : logo + bouton ✕ */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            minHeight: 56, flexShrink: 0,
          }}>
            <img src="/img/logo-reveillons-nous.png" height={26} alt="Réveillons-nous" />
            <button
              onClick={onClose}
              style={{
                width: 36, height: 36,
                background: 'rgba(255,255,255,0.06)',
                border: 'none', borderRadius: 8,
                color: '#fff', fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Fermer le menu"
            >
              ✕
            </button>
          </div>

          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px 0' }}>
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => linkStyle(isActive, 'right')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0,
          }}>
            <a
              href="/"
              target="_blank"
              rel="noopener"
              onClick={onClose}
              style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', textDecoration: 'none' }}
            >
              Voir le site →
            </a>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.55)',
                borderRadius: 8, padding: '9px 14px',
                fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              Déconnexion
            </button>
          </div>
        </aside>
      </>
    );
  }

  // Desktop — sidebar gauche
  return (
    <aside style={{
      width: 240, height: '100vh',
      background: '#13141c',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky', top: 0,
      overflowY: 'auto',
    }}>
      <div style={{
        padding: '28px 20px 22px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'center',
      }}>
        <img src="/img/logo-reveillons-nous.png" height={32} alt="Réveillons-nous" style={{ display: 'block' }} />
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 0' }}>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => linkStyle(isActive, 'left')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{
        padding: '18px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <a
          href="/"
          target="_blank"
          rel="noopener"
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', textDecoration: 'none' }}
        >
          Voir le site →
        </a>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.45)',
            borderRadius: 8, padding: '8px 14px',
            fontSize: '0.82rem', cursor: 'pointer',
            fontFamily: 'inherit', textAlign: 'left',
          }}
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

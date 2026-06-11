import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../hooks/useAdminContent';

const NAV = [
  { to: '/tableau-de-bord', label: 'Tableau de bord' },
  { to: '/parametres',      label: 'Paramètres globaux' },
  { to: '/hero',            label: 'Page d\'accueil' },
  { to: '/petition',        label: 'Pétition' },
  { to: '/evenements',      label: 'Événements' },
  { to: '/faq',             label: 'FAQ' },
  { to: '/contact',         label: 'Contact' },
  { to: '/footer',          label: 'Footer' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <span style={styles.brandText}>Admin</span>
      </div>
      <nav style={styles.nav}>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.linkActive : {}),
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={styles.footer}>
        <a
          href="/"
          target="_blank"
          rel="noopener"
          style={styles.viewSite}
        >
          Voir le site →
        </a>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    minHeight: '100vh',
    background: '#191a23',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  brand: {
    padding: '28px 24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  brandText: {
    color: '#b9ff66',
    fontWeight: 700,
    fontSize: '1.1rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0',
  },
  link: {
    display: 'block',
    padding: '10px 24px',
    color: '#a0a3b1',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'background .15s, color .15s',
    borderLeft: '3px solid transparent',
  },
  linkActive: {
    color: '#b9ff66',
    background: 'rgba(185,255,102,0.07)',
    borderLeftColor: '#b9ff66',
  },
  footer: {
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  viewSite: {
    color: '#a0a3b1',
    fontSize: '0.8rem',
    textDecoration: 'none',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#a0a3b1',
    borderRadius: 6,
    padding: '8px 14px',
    fontSize: '0.82rem',
    cursor: 'pointer',
    textAlign: 'left',
  },
};

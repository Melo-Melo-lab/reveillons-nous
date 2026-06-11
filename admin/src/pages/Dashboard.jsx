import { Link } from 'react-router-dom';

const SECTIONS = [
  { to: '/parametres', label: 'Paramètres globaux', desc: 'Logo, nom, couleurs' },
  { to: '/hero',       label: "Page d'accueil",     desc: 'Titre, texte, vidéo, CTA' },
  { to: '/petition',   label: 'Pétition',           desc: 'Titre, description, CTA' },
  { to: '/evenements', label: 'Événements',         desc: 'Gérer le calendrier' },
  { to: '/faq',        label: 'FAQ',                desc: '7 questions / réponses' },
  { to: '/contact',    label: 'Contact',            desc: 'Email, réseaux sociaux' },
  { to: '/footer',     label: 'Footer',             desc: 'Liens, copyright' },
];

export default function Dashboard({ content }) {
  const nextEvent = content?.evenements?.liste
    ?.filter(ev => new Date(ev.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <div>
      <h1 style={{ fontSize:'1.6rem', fontWeight:700, color:'#191a23', marginBottom:28 }}>Tableau de bord</h1>

      {nextEvent && (
        <div style={{
          background: '#fff',
          border: '1.5px solid #e5e7eb',
          borderLeft: '4px solid #191a23',
          borderRadius: 12, padding:'18px 22px', marginBottom:28, maxWidth:480,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize:'0.75rem', color:'#9ca3af', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 }}>
            Prochain événement
          </div>
          <div style={{ fontSize:'1.05rem', fontWeight:700, color:'#191a23', marginBottom:4 }}>
            {nextEvent.titre}
          </div>
          <div style={{ fontSize:'0.85rem', color:'#6b7280' }}>
            {new Date(nextEvent.date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
            {nextEvent.heure && ` — ${nextEvent.heure}`}
            {nextEvent.lieu && ` · ${nextEvent.lieu}`}
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:14 }}>
        {SECTIONS.map(sec => (
          <Link key={sec.to} to={sec.to} style={{
            background: '#fff',
            border: '1.5px solid #e5e7eb',
            borderRadius: 12, padding:'18px 20px',
            textDecoration: 'none', cursor:'pointer',
            transition: 'border-color .2s, box-shadow .2s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontWeight:700, color:'#191a23', marginBottom:5, fontSize:'0.95rem' }}>{sec.label}</div>
            <div style={{ fontSize:'0.82rem', color:'#9ca3af' }}>{sec.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

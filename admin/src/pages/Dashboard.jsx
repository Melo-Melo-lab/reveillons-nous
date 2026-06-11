import { Link } from 'react-router-dom';

const SECTIONS = [
  { to: '/parametres', label: 'Paramètres globaux', desc: 'Logo, nom, couleurs' },
  { to: '/hero',       label: 'Page d\'accueil',    desc: 'Titre, texte, vidéo, CTA' },
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
      <h1 style={s.title}>Tableau de bord</h1>

      {nextEvent && (
        <div style={s.card}>
          <div style={s.cardLabel}>Prochain événement</div>
          <div style={s.cardValue}>{nextEvent.titre}</div>
          <div style={s.cardMeta}>
            {new Date(nextEvent.date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
            {nextEvent.heure && ` — ${nextEvent.heure}`}
            {nextEvent.lieu && ` · ${nextEvent.lieu}`}
          </div>
        </div>
      )}

      <div style={s.grid}>
        {SECTIONS.map(sec => (
          <Link key={sec.to} to={sec.to} style={s.tile}>
            <div style={s.tileLabel}>{sec.label}</div>
            <div style={s.tileDesc}>{sec.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const s = {
  title:      { fontSize:'1.5rem', fontWeight:700, marginBottom:28 },
  card:       { background:'#f9fafb', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'18px 22px', marginBottom:28, maxWidth:480 },
  cardLabel:  { fontSize:'0.78rem', color:'#6b7280', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4 },
  cardValue:  { fontSize:'1.1rem', fontWeight:700, color:'#111827', marginBottom:4 },
  cardMeta:   { fontSize:'0.85rem', color:'#6b7280' },
  grid:       { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(210px,1fr))', gap:16 },
  tile:       { background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'18px 20px', textDecoration:'none', transition:'border-color .2s', cursor:'pointer' },
  tileLabel:  { fontWeight:700, color:'#111827', marginBottom:4, fontSize:'0.95rem' },
  tileDesc:   { fontSize:'0.83rem', color:'#6b7280' },
};

export default function SaveStatus({ status }) {
  if (status === 'idle') return null;
  const map = {
    saving: { text: 'Sauvegarde…',       color: '#9ca3af' },
    saved:  { text: 'Sauvegardé ✓',      color: '#16a34a' },
    error:  { text: 'Erreur de sauvegarde', color: '#dc2626' },
  };
  const { text, color } = map[status] || {};
  return (
    <span style={{ fontSize: '0.82rem', color, fontWeight: 500, marginLeft: 12 }}>
      {text}
    </span>
  );
}

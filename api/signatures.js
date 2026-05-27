module.exports = async function handler(req, res) {
  try {
    const response = await fetch('https://petitions.lecese.fr/initiatives/i-821', {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; reveillons-nous-bot/1.0)',
      },
    });

    if (!response.ok) throw new Error('HTTP ' + response.status);

    const html = await response.text();

    // Le compteur est dans : class="progress__bar__number">357
    const match = html.match(/progress__bar__number">\s*([0-9\s]+)</);
    if (!match) throw new Error('Compteur introuvable dans la page');

    const count = parseInt(match[1].replace(/\s/g, ''), 10);
    if (isNaN(count)) throw new Error('Valeur non numérique');

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.json({ count });
  } catch (err) {
    console.error('signatures API error:', err.message);
    res.status(500).json({ count: null });
  }
};

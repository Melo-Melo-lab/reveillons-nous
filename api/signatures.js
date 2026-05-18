module.exports = async function handler(req, res) {
  try {
    const response = await fetch(
      'https://petitions.lecese.fr/initiatives/i-821.json'
    );
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    const count =
      data.supports_count ??
      data.online_votes_count ??
      data.votes_count ??
      null;
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.json({ count });
  } catch {
    res.status(500).json({ count: null });
  }
};

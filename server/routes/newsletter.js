const express = require('express');
const router  = express.Router();

// POST /api/newsletter
router.post('/', async (req, res) => {
  const { email } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Adresse e-mail invalide.' });
  }

  const apiKey  = process.env.BREVO_API_KEY;
  const listId  = parseInt(process.env.BREVO_LIST_ID || '3', 10);

  if (!apiKey) {
    return res.status(500).json({ error: 'Service newsletter non configuré.' });
  }

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept':       'application/json',
        'content-type': 'application/json',
        'api-key':      apiKey,
      },
      body: JSON.stringify({ email: email.trim(), listIds: [listId], updateEnabled: true }),
    });

    if (brevoRes.ok || brevoRes.status === 204) {
      return res.json({ success: true });
    }

    const data = await brevoRes.json().catch(() => ({}));
    if (brevoRes.status === 400 && data.code === 'duplicate_parameter') {
      return res.json({ success: true, duplicate: true });
    }
    throw new Error(data.message || `Brevo ${brevoRes.status}`);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

module.exports = router;

const express = require('express');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ valid: false });
  try {
    jwt.verify(header.slice(7), process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

// GET /api/auth/gate — vérifie le token de l'URL /gate?k=TOKEN
router.get('/gate', (req, res) => {
  const { k } = req.query;
  if (k && k === process.env.GATE_TOKEN) {
    res.json({ authorized: true });
  } else {
    res.json({ authorized: false });
  }
});

module.exports = router;

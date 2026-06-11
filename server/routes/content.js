const express    = require('express');
const fs         = require('fs');
const path       = require('path');
const requireAuth = require('../middleware/auth');
const router     = express.Router();

const DATA_FILE = path.join(__dirname, '..', 'data', 'siteContent.json');

function read() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function write(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/content — public
router.get('/', (_req, res) => {
  try {
    res.json(read());
  } catch {
    res.status(500).json({ error: 'Erreur lecture contenu' });
  }
});

// PUT /api/content — met à jour tout le contenu (protégé)
router.put('/', requireAuth, (req, res) => {
  try {
    const current = read();
    const updated = { ...current, ...req.body };
    write(updated);
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Erreur sauvegarde contenu' });
  }
});

// PUT /api/content/:section — met à jour une section (protégé)
router.put('/:section', requireAuth, (req, res) => {
  try {
    const { section } = req.params;
    const current = read();
    if (!(section in current)) {
      return res.status(404).json({ error: `Section "${section}" introuvable` });
    }
    current[section] = { ...current[section], ...req.body };
    write(current);
    res.json(current[section]);
  } catch {
    res.status(500).json({ error: 'Erreur sauvegarde section' });
  }
});

module.exports = router;

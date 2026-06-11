const express     = require('express');
const fs          = require('fs');
const path        = require('path');
const requireAuth = require('../middleware/auth');
const { uploadImage, uploadVideo } = require('../middleware/upload');
const router      = express.Router();

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// POST /api/upload/image
router.post('/image', requireAuth, (req, res) => {
  uploadImage.single('file')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });
    res.json({ url: `/uploads/images/${req.file.filename}` });
  });
});

// POST /api/upload/video
router.post('/video', requireAuth, (req, res) => {
  uploadVideo.single('file')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });
    res.json({ url: `/uploads/videos/${req.file.filename}` });
  });
});

// DELETE /api/upload/:type/:filename
router.delete('/:type/:filename', requireAuth, (req, res) => {
  const { type, filename } = req.params;
  if (!['images','videos'].includes(type)) {
    return res.status(400).json({ error: 'Type invalide' });
  }
  // Sécurité : interdire les traversées de répertoire
  const safeName = path.basename(filename);
  const filePath = path.join(UPLOADS_DIR, type, safeName);
  if (!filePath.startsWith(UPLOADS_DIR)) {
    return res.status(400).json({ error: 'Chemin invalide' });
  }
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Fichier introuvable' });
    }
  } catch {
    res.status(500).json({ error: 'Erreur suppression fichier' });
  }
});

module.exports = router;

try { require('dotenv').config(); } catch {} // local uniquement, Railway injecte les vars directement
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

// Créer les dossiers uploads au démarrage s'ils n'existent pas
['uploads/images', 'uploads/videos'].forEach(dir => {
  const full = path.join(__dirname, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const app = express();

// ── CORS ──────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// ── FICHIERS STATIQUES : uploads ──────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── FICHIERS STATIQUES : admin build ─────────
const adminDist = path.join(__dirname, 'admin-dist');
app.use('/admin', express.static(adminDist));
app.get('/admin', (_req, res) => res.sendFile(path.join(adminDist, 'index.html')));
app.get('/admin/*', (_req, res) => res.sendFile(path.join(adminDist, 'index.html')));

// ── PAGE /gate — accès admin caché via URL ────
app.get('/gate', (_req, res) => {
  // Sert la page principale ; le JS côté client gère la logique
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── ROUTES API ────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/upload',  require('./routes/upload'));

// ── SITE PRINCIPAL ────────────────────────────
app.use(express.static(path.join(__dirname, '..')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── DÉMARRAGE ─────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

try { require('dotenv').config(); } catch {} // local uniquement, Railway injecte les vars directement
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

// ── DONNÉES PERSISTANTES ──────────────────────
// DATA_DIR peut pointer vers un volume Railway persistant.
// Sans volume, on reste sur server/data/ (remis à zéro à chaque déploiement).
const DATA_DIR  = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'siteContent.json');
const SEED_FILE = path.join(__dirname, 'data', 'siteContent.json');

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE) && fs.existsSync(SEED_FILE)) {
  fs.copyFileSync(SEED_FILE, DATA_FILE);
  console.log('siteContent.json initialisé depuis le seed');
}
// Rendre le chemin accessible aux routes sans module séparé
process.env.DATA_FILE = DATA_FILE;

// ── DOSSIERS UPLOADS ──────────────────────────
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
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── ROUTES API ────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/upload',  require('./routes/upload'));

// ── PAGES STATIQUES DU SITE ──────────────────
const ROOT = path.join(__dirname, '..');
app.use(express.static(ROOT));
app.get('/evenements',         (_req, res) => res.sendFile(path.join(ROOT, 'evenements.html')));
app.get('/evenements-details', (_req, res) => res.sendFile(path.join(ROOT, 'evenements-details.html')));
app.get('*', (_req, res) => res.sendFile(path.join(ROOT, 'index.html')));

// ── DÉMARRAGE ─────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Données : ${DATA_FILE}`);
});

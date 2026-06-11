# Réveillons-nous — Site + Admin CMS

Site de l'association Collectif Réveillons-nous avec son interface d'administration.

## Architecture

```
reveillons-nous/
├── index.html          Site public (HTML/CSS/Vanilla JS)
├── assets/main.js      JavaScript du site public
├── assets/styles.css   Styles du site public
├── img/                Médias du site (logos, vidéos)
├── api/                Fonctions serverless (signatures CESE)
├── server/             Backend Node.js + Express (API + admin)
└── admin/              Interface admin React + Vite
```

---

## Prérequis

- Node.js 18+
- npm 9+

---

## Installation locale

### 1. Backend (server/)

```bash
cd server
npm install
cp .env.example .env
# Éditez .env avec vos valeurs (voir section Configuration)
npm run dev
# Le serveur démarre sur http://localhost:3001
```

### 2. Admin (admin/)

```bash
cd admin
npm install
npm run dev
# L'admin démarre sur http://localhost:5173/admin/
```

### 3. Site public

Ouvrir `index.html` directement dans le navigateur, ou utiliser :
```bash
npx live-server --port=3000 --open=index.html
```

---

## Configuration (.env)

Créez `server/.env` à partir de `server/.env.example` :

```env
PORT=3001
JWT_SECRET=une_chaine_aleatoire_min_32_caracteres
ADMIN_PASSWORD=votre_mot_de_passe_admin
GATE_TOKEN=votre_token_secret_pour_url_gate
FRONTEND_URL=http://localhost:3000
MAX_IMAGE_SIZE_MB=10
MAX_VIDEO_SIZE_MB=500
```

**Générer des valeurs sécurisées :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Build de l'admin (avant déploiement)

```bash
cd admin
npm run build
# Génère admin/dist/ — copié automatiquement par le serveur Express
```

---

## Déploiement Railway (backend)

1. Créer un compte sur [railway.app](https://railway.app)
2. Nouveau projet → "Deploy from GitHub repo"
3. Sélectionner ce repository
4. Dans les paramètres du service :
   - **Root directory** : `server`
   - **Start command** : `node index.js`
5. Dans "Variables", ajouter :
   ```
   PORT=3001
   JWT_SECRET=<valeur_securisee>
   ADMIN_PASSWORD=<votre_mot_de_passe>
   GATE_TOKEN=<votre_token>
   FRONTEND_URL=https://www.reveillons-nous.org
   ```
6. Récupérer l'URL générée (ex: `https://xxx.railway.app`)

> **Important** : L'admin React doit être buildé (`npm run build` dans `admin/`) et le dossier `admin/dist/` doit être présent dans le dépôt Git (ou buildé en CI) pour que le serveur puisse le servir.

---

## Déploiement Vercel (site public)

1. Aller sur [vercel.com](https://vercel.com)
2. Importer ce repository
3. **Framework preset** : Other (pas de framework)
4. **Output directory** : `.` (racine)
5. Dans `vercel.json`, remplacer `VOTRE-APP.railway.app` par l'URL Railway réelle
6. Variable d'environnement optionnelle : `VITE_API_URL=https://xxx.railway.app`

---

## Accès à l'interface admin

L'accès admin est intentionnellement invisible pour les visiteurs. Trois méthodes :

### Méthode 1 — Clics rapides (mobile-friendly)
Cliquer **5 fois rapidement** (en moins de 2 secondes) sur le texte de copyright dans le footer (ex: "© 2026 Réveillons-nous…").

### Méthode 2 — Code Konami (desktop)
Taper la séquence sur le clavier :
```
↑ ↑ ↓ ↓ ← → ← → A
```

### Méthode 3 — URL secrète
Accéder à l'URL :
```
https://www.reveillons-nous.org/gate?k=VOTRE_GATE_TOKEN
```
Remplacer `VOTRE_GATE_TOKEN` par la valeur de `GATE_TOKEN` dans le `.env`.

---

## Changer le mot de passe admin

Modifier la variable `ADMIN_PASSWORD` dans :
- `server/.env` (local)
- Les variables d'environnement Railway (production)

Puis redémarrer le serveur.

---

## Structure de l'admin

Une fois connecté, l'admin propose :

| Page | Contenu éditable |
|------|-----------------|
| Tableau de bord | Vue d'ensemble, prochain événement |
| Paramètres globaux | Logo, nom, tagline, couleurs |
| Page d'accueil | Titre hero, texte, vidéo, CTA |
| Pétition | Titre section, description, CTA, URL |
| Événements | Calendrier complet (ajout/édition/suppression) |
| FAQ | 7 questions/réponses éditables et réorganisables |
| Contact | Email, adresse, réseaux sociaux, formulaire |
| Footer | Copyright, liens, newsletter |

Toutes les modifications sont **sauvegardées automatiquement** 1 seconde après la dernière frappe et **répercutées immédiatement** sur le site public.

---

## Données

Toutes les données du site sont stockées dans `server/data/siteContent.json`. Ce fichier est lu et écrit par l'API. Faites-en des sauvegardes régulières (ou commitez-le dans Git).

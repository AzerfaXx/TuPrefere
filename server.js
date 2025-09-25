// server.js - VERSION CORRIGÉE ET AMÉLIORÉE

const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cors = require('cors'); // <-- On importe CORS

const app = express();

// --- CONFIGURATION DU MIDDLEWARE (PLACÉ AU DÉBUT) ---

// 1. On active CORS pour toutes les routes. C'est la solution au "Failed to fetch".
app.use(cors());

// 2. On active le parsing JSON pour les corps de requêtes (ex: pour /vote et /add)
app.use(express.json());

// 3. On indique à Express de servir les fichiers statiques (CSS, JS, images)
// C'est ce qui permet à ton index.html de charger style.css, script.js, etc.
app.use(express.static(path.join(__dirname)));


// --- VARIABLES ET FONCTIONS UTILITAIRES ---
const DATA_FILE = path.join(__dirname, 'votes-data.json');
const GOOGLE_RECAPTCHA_SECRET = '6LdMUdUrAAAAAOy3kuWyrCPPEe8z0qzqN0ejVZbA';

function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    const txt = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(txt || '{}');
  } catch (e) {
    console.error('Erreur loadData', e);
    return {};
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Erreur saveData', e);
  }
}


// --- ROUTES DE L'API ---

// POST /vote { id, choice } -> increments counter
app.post('/vote', (req, res) => {
  const { id, choice } = req.body;
  if (!id || !choice) return res.status(400).json({ error: 'missing id or choice' });
  const data = loadData();
  if (!data[id]) data[id] = { a: 0, b: 0 };
  if (choice === 'a') data[id].a = (data[id].a || 0) + 1;
  else if (choice === 'b') data[id].b = (data[id].b || 0) + 1;
  else return res.status(400).json({ error: 'choice must be "a" or "b"' });
  saveData(data);
  res.json({ ok: true, totals: data[id] });
});

// POST /add -> body: { a, b, category, author, g-recaptcha-response }
app.post('/add', async (req, res) => {
  const dilemma = req.body;
  const recaptchaToken = dilemma['g-recaptcha-response'];
  if (!recaptchaToken) {
    return res.status(400).json({ error: 'reCAPTCHA token manquant' });
  }

  try {
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${GOOGLE_RECAPTCHA_SECRET}&response=${recaptchaToken}`;
    const { data } = await axios.post(verificationUrl);
    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return res.status(401).json({ error: 'Échec de la vérification reCAPTCHA' });
    }
  } catch (error) {
    console.error('Erreur serveur reCAPTCHA:', error.message);
    return res.status(500).json({ error: 'Erreur lors de la vérification reCAPTCHA' });
  }

  const { a, b, category, author } = dilemma;
  if (!a || !b || !category) {
    return res.status(400).json({ error: 'Champs a, b ou catégorie manquants' });
  }

  const newDilemma = {
    id: `c_${Date.now()}`,
    a: a.trim(),
    b: b.trim(),
    category: category,
    author: author ? author.trim() : null
  };

  const cDilemmaFile = path.join(__dirname, 'community-dilemmas.json');
  let cDilemmas = [];
  if (fs.existsSync(cDilemmaFile)) {
    try {
      cDilemmas = JSON.parse(fs.readFileSync(cDilemmaFile, 'utf8'));
    } catch (e) {
      console.error('Erreur de parsing de community-dilemmas.json', e);
    }
  }

  cDilemmas.push(newDilemma);
  fs.writeFileSync(cDilemmaFile, JSON.stringify(cDilemmas, null, 2));

  res.json({ ok: true, message: 'Dilemme ajouté à la liste de la communauté !' });
});

// GET /stats?id=dilemma_01
app.get('/stats', (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'missing id' });
  const data = loadData();
  res.json(data[id] || { a: 0, b: 0 });
});

// GET /community-dilemmas -> renvoie les dilemmes validés
app.get('/community-dilemmas', (req, res) => {
  const cDilemmaFile = path.join(__dirname, 'community-dilemmas.json');
  if (fs.existsSync(cDilemmaFile)) {
    res.sendFile(cDilemmaFile);
  } else {
    res.json([]);
  }
});


// --- ROUTE FINALE POUR SERVIR L'APPLICATION FRONT-END ---
// Cette route doit être LA DERNIÈRE. Elle attrape toutes les autres requêtes GET
// qui ne sont pas des fichiers (comme /style.css) ou des routes API (comme /vote)
// et renvoie ton application. C'est la solution au "Cannot GET /".
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// --- DÉMARRAGE DU SERVEUR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
  console.log('Data file:', DATA_FILE);
});

// Tes autres routes /report et /submit peuvent rester ici si tu les utilises toujours.
// POST /report  -> body: { id, dilemma, at }
app.post('/report', (req, res) => {
  const report = req.body;
  const rptFile = path.join(__dirname, 'reports.json');
  let reports = [];
  if (fs.existsSync(rptFile)) reports = JSON.parse(fs.readFileSync(rptFile,'utf8')||'[]');
  reports.push(report);
  fs.writeFileSync(rptFile, JSON.stringify(reports, null, 2));
  res.json({ ok:true });
});

// POST /submit  -> body: new dilemma (for moderation)
app.post('/submit', (req, res) => {
  const sub = req.body;
  const subFile = path.join(__dirname, 'submissions.json');
  let subs = [];
  if (fs.existsSync(subFile)) subs = JSON.parse(fs.readFileSync(subFile,'utf8')||'[]');
  subs.push(sub);
  fs.writeFileSync(subFile, JSON.stringify(subs, null, 2));
  res.json({ ok:true });
});
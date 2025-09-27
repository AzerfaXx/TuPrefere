// server.js - VERSION FINALE AVEC INITIALISATION AUTOMATIQUE DE LA DB

const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// --- CONFIGURATION DU MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// --- CONNEXION À LA BASE DE DONNÉES ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// --- NOUVELLE FONCTION : INITIALISATION DE LA BASE DE DONNÉES ---
// Cette fonction s'exécute au démarrage pour créer les tables si elles n'existent pas.
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Création de la table 'dilemmas'
    await client.query(`
      CREATE TABLE IF NOT EXISTS dilemmas (
        id SERIAL PRIMARY KEY,
        dilemma_id VARCHAR(255) UNIQUE NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        author VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "dilemmas" vérifiée ou créée avec succès.');

    // Création de la table 'votes'
    await client.query(`
      CREATE TABLE IF NOT EXISTS votes (
        dilemma_id VARCHAR(255) PRIMARY KEY,
        votes_a INT DEFAULT 0 NOT NULL,
        votes_b INT DEFAULT 0 NOT NULL
      )
    `);
    console.log('Table "votes" vérifiée ou créée avec succès.');

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    client.release(); // Libère le client pour qu'il retourne au pool de connexions
  }
}

// --- ROUTES DE L'API (INCHANGÉES) ---

// GET /community-dilemmas -> renvoie les dilemmes depuis la DB
app.get('/community-dilemmas', async (req, res) => {
  try {
    const query = 'SELECT dilemma_id AS id, option_a AS a, option_b AS b, category, author FROM dilemmas ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des dilemmes communautaires:', error);
    res.status(500).json([]);
  }
});

// POST /add -> ajoute un nouveau dilemme dans la DB
app.post('/add', async (req, res) => {
  const { a, b, category, author } = req.body;
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

  try {
    const insertQuery = `
      INSERT INTO dilemmas(dilemma_id, option_a, option_b, category, author) 
      VALUES($1, $2, $3, $4, $5)
    `;
    const values = [newDilemma.id, newDilemma.a, newDilemma.b, newDilemma.category, newDilemma.author];
    await pool.query(insertQuery, values);
    res.json({ ok: true, message: 'Dilemme ajouté à la liste de la communauté !' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du dilemme:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'ajout du dilemme' });
  }
});

// GET /stats -> récupère les stats de vote depuis la DB
app.get('/stats', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'missing id' });
  
  try {
    const { rows } = await pool.query('SELECT votes_a, votes_b FROM votes WHERE dilemma_id = $1', [id]);
    if (rows.length > 0) {
      res.json({ a: rows[0].votes_a, b: rows[0].votes_b });
    } else {
      res.json({ a: 0, b: 0 });
    }
  } catch (error) {
    console.error(`Erreur stats pour l'id ${id}:`, error);
    res.status(500).json({ a: 0, b: 0 });
  }
});

// POST /vote -> met à jour les votes dans la DB
app.post('/vote', async (req, res) => {
  const { id, choice } = req.body;
  if (!id || (choice !== 'a' && choice !== 'b')) {
    return res.status(400).json({ error: 'ID ou choix invalide' });
  }

  const columnToIncrement = choice === 'a' ? 'votes_a' : 'votes_b';

  const query = `
    INSERT INTO votes (dilemma_id, ${columnToIncrement})
    VALUES ($1, 1)
    ON CONFLICT (dilemma_id)
    DO UPDATE SET ${columnToIncrement} = votes.${columnToIncrement} + 1
    RETURNING votes_a, votes_b;
  `;

  try {
    const { rows } = await pool.query(query, [id]);
    const totals = { a: rows[0].votes_a, b: rows[0].votes_b };
    res.json({ ok: true, totals: totals });
  } catch (error) {
    console.error(`Erreur vote pour l'id ${id}:`, error);
    res.status(500).json({ error: 'Erreur lors du vote' });
  }
});

// --- ROUTE FINALE POUR SERVIR L'APPLICATION FRONT-END ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- DÉMARRAGE DU SERVEUR ---
const PORT = process.env.PORT || 3000;

// On utilise .then() pour s'assurer que la DB est prête AVANT de démarrer le serveur
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log('Server running on port', PORT);
    console.log('Successfully connected to PostgreSQL database.');
  });
});
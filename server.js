// server.js
// Minimal Express server to collect votes and serve stats
// Usage:
// 1) npm init -y
// 2) npm i express
// 3) node server.js
//
// It stores votes in votes-data.json in the same folder.

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const DATA_FILE = path.join(__dirname, 'votes-data.json');

app.use(express.json());

// VERY IMPORTANT: in prod, replace '*' with your site domain for security
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // restrict in prod!
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

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

// GET /stats?id=dilemma_01
app.get('/stats', (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'missing id' });
  const data = loadData();
  res.json(data[id] || { a: 0, b: 0 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
  console.log('Data file:', DATA_FILE);
});

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

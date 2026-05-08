const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Projects Table
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    progress INTEGER DEFAULT 0
  )`);

  // Tasks Table
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY(project_id) REFERENCES projects(id)
  )`);

  // Activities Table
  db.run(`CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_name TEXT,
    action TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed if empty
  db.get("SELECT count(*) as count FROM projects", (err, row) => {
    if (row && row.count === 0) {
      db.run("INSERT INTO projects (name, description, progress) VALUES (?, ?, ?)", ["Agent Center UI", "Modernizing the cowork dashboard", 90]);
      db.run("INSERT INTO activities (agent_name, action) VALUES (?, ?)", ["System", "All systems operational. SQLite connected."]);
    }
  });
});

// API Endpoints
app.get('/api/projects', (req, res) => {
  db.all("SELECT * FROM projects ORDER BY id DESC", [], (err, rows) => res.json(rows));
});

app.post('/api/projects', (req, res) => {
  const { name, description } = req.body;
  db.run("INSERT INTO projects (name, description) VALUES (?, ?)", [name, description], function() {
    db.run("INSERT INTO activities (agent_name, action) VALUES (?, ?)", ["User", `Initialized workspace: ${name}`]);
    res.json({ id: this.lastID, name, description });
  });
});

app.get('/api/tasks/:projectId', (req, res) => {
  db.all("SELECT * FROM tasks WHERE project_id = ?", [req.params.projectId], (err, rows) => res.json(rows));
});

app.post('/api/tasks', (req, res) => {
  const { project_id, title } = req.body;
  db.run("INSERT INTO tasks (project_id, title) VALUES (?, ?)", [project_id, title], function() {
    db.run("INSERT INTO activities (agent_name, action) VALUES (?, ?)", ["Gemini", `Added task to Project ${project_id}: ${title}`]);
    res.json({ id: this.lastID, project_id, title });
  });
});

app.get('/api/activities', (req, res) => {
  db.all("SELECT * FROM activities ORDER BY id DESC LIMIT 20", [], (err, rows) => res.json(rows));
});

app.listen(port, () => console.log(`API running on port ${port}`));

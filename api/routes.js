const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const [projects] = await db.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single project by ID
router.get('/projects/:id', async (req, res) => {
  try {
    const [project] = await db.query("SELECT * FROM projects WHERE id = ?", [req.params.id]);
    if (project.length > 0) res.json(project[0]);
    else res.status(404).json({ error: "Project not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new project
router.post('/projects', async (req, res) => {
  try {
    const { title, description, image, techStack, githubUrl, demoUrl } = req.body;
    const techStackString = JSON.stringify(techStack || []);
    
    const result = await db.query(
      "INSERT INTO projects (title, description, image, tech_stack, github_url, demo_url) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, image, techStackString, githubUrl, demoUrl]
    );
    
    res.status(201).json({ id: result[0].insertId, title, description, image, techStack, githubUrl, demoUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a project
router.delete('/projects/:id', async (req, res) => {
  try {
    const result = await db.query("DELETE FROM projects WHERE id = ?", [req.params.id]);
    if (result[0].affectedRows > 0) res.json({ message: "Project deleted successfully" });
    else res.status(404).json({ error: "Project not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

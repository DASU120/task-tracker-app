// backend/src/routes/tasks.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /tasks
router.post('/', (req, res) => {
  const { title, description, priority, due_date, status = 'Open' } = req.body;

if (!title || !priority || !due_date) {
  return res.status(400).json({ error: 'Title, priority, and due_date are required.' });
}

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  try {
    const info = stmt.run(title, description || '', priority, due_date, status);
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /tasks
router.get('/', (req, res) => {
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (req.query.status) {
    query += ' AND status = ?';
    params.push(req.query.status);
  }

  if (req.query.priority) {
    query += ' AND priority = ?';
    params.push(req.query.priority);
  }

  if (req.query.sort === 'due_date') {
    query += ' ORDER BY due_date ASC';
  }

  try {
    const tasks = db.prepare(query).all(...params);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /tasks/:id
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status, priority } = req.body;

  if (!status && !priority) {
    return res.status(400).json({ error: 'At least one of status or priority must be provided.' });
  }

  let query = 'UPDATE tasks SET ';
  const fields = [];
  const values = [];

  if (status) {
    fields.push('status = ?');
    values.push(status);
  }
  if (priority) {
    fields.push('priority = ?');
    values.push(priority);
  }

  query += fields.join(', ') + ' WHERE id = ?';
  values.push(id);

  try {
    const stmt = db.prepare(query);
    const info = stmt.run(...values);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
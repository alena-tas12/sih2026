const express = require('express');
const router = express.Router();
const { getDb } = require('../data/db');

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const rows = await db.all('SELECT * FROM locations ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error fetching locations' });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { id, name, type, region } = req.body;
    await db.run(
      'INSERT INTO locations (id, name, type, region) VALUES (?, ?, ?, ?)',
      [id, name, type, region]
    );
    // Log the action
    await db.run(
      'INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)',
      ['CREATE_LOCATION', 'API_USER', id, `Created location ${name}`]
    );
    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Error creating location' });
  }
});

module.exports = router;

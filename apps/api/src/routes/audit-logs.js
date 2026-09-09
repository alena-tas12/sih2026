const express = require('express');
const router = express.Router();
const { getDb } = require('../data/db');

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const rows = await db.all('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error fetching audit logs' });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { action, actor, targetId, details } = req.body;
    await db.run(
      'INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)',
      [action, actor, targetId, details]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error logging action' });
  }
});

module.exports = router;

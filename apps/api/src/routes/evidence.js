const express = require('express');
const router = express.Router();
const { getDb } = require('../data/db');

router.get('/:inspectionId', async (req, res) => {
  try {
    const db = getDb();
    const rows = await db.all('SELECT * FROM evidence WHERE inspectionId = ? ORDER BY uploadedAt DESC', [req.params.inspectionId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error fetching evidence' });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { id, inspectionId, type, url } = req.body;
    await db.run(
      'INSERT INTO evidence (id, inspectionId, type, url) VALUES (?, ?, ?, ?)',
      [id, inspectionId, type, url]
    );
    // Log the action
    await db.run(
      'INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)',
      ['UPLOAD_EVIDENCE', 'API_USER', inspectionId, `Uploaded ${type} evidence`]
    );
    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Error uploading evidence' });
  }
});

module.exports = router;

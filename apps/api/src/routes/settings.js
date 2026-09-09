const express = require('express');
const { getDb } = require('../data/db');
const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const rows = await db.all('SELECT key, value FROM settings');
        const settings = rows.reduce((acc, row) => {
            acc[row.key] = row.value === 'true' ? true : (row.value === 'false' ? false : Number(row.value));
            return acc;
        }, {});
        res.json(settings);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update settings
router.post('/', async (req, res) => {
    try {
        const db = getDb();
        const settings = req.body;
        for (const [key, value] of Object.entries(settings)) {
            await db.run(`
                INSERT INTO settings (key, value) VALUES (?, ?)
                ON CONFLICT(key) DO UPDATE SET value=excluded.value
            `, [key, String(value)]);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;

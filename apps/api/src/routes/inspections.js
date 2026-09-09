const express = require('express');
const { getDb } = require('../data/db');
const router = express.Router();

// Create new inspection
router.post('/', async (req, res) => {
    try {
        const db = getDb();
        const { gtin, location, extractedMrp, extractedQty, status } = req.body;
        const id = 'CASE-' + Math.floor(Math.random() * 100000);
        
        await db.run(`
            INSERT INTO inspections (id, gtin, location, extractedMrp, extractedQty, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [id, gtin, location, extractedMrp, extractedQty, status]);

        res.json({ success: true, id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update inspection (Decision / Review)
router.patch('/:id/review', async (req, res) => {
    try {
        const db = getDb();
        const { status, reviewDecision, reviewerNotes } = req.body;
        
        await db.run(`
            UPDATE inspections 
            SET status = ?, reviewDecision = ?, reviewerNotes = ?
            WHERE id = ?
        `, [status, reviewDecision, reviewerNotes, req.params.id]);

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;

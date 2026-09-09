const express = require('express');
const { getDb } = require('../data/db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = getDb();
        
        const productsTracked = (await db.get('SELECT COUNT(*) as c FROM products')).c;
        const totalMatches = (await db.get("SELECT COUNT(*) as c FROM inspections WHERE status = 'COMPLIANT'")).c;
        const totalDifferences = (await db.get("SELECT COUNT(*) as c FROM inspections WHERE status = 'NON_COMPLIANT'")).c;
        const pendingVerifications = (await db.get("SELECT COUNT(*) as c FROM inspections WHERE status = 'REVIEW_REQUIRED'")).c;
        const totalInspections = (await db.get('SELECT COUNT(*) as c FROM inspections')).c;

        const matchPercentage = totalInspections === 0 ? 100 : Math.round((totalMatches / totalInspections) * 1000) / 10;

        const activeAlerts = await db.all(`
            SELECT i.id, p.name as product, p.gtin, i.location, 'MRP' as conflictingField, i.createdAt
            FROM inspections i
            JOIN products p ON i.gtin = p.gtin
            WHERE i.status = 'NON_COMPLIANT' OR i.status = 'REVIEW_REQUIRED'
            ORDER BY i.createdAt DESC
            LIMIT 5
        `);

        const recentActivity = await db.all(`
            SELECT i.id, i.status, i.location, p.gtin, i.createdAt
            FROM inspections i
            JOIN products p ON i.gtin = p.gtin
            ORDER BY i.createdAt DESC
            LIMIT 5
        `);

        res.json({
            productsTracked,
            matchPercentage,
            totalDifferences,
            pendingVerifications,
            activeAlerts,
            recentActivity
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;

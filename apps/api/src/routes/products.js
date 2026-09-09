const express = require('express');
const { getDb } = require('../data/db');
const router = express.Router();

// Get product master by GTIN
router.get('/:gtin', async (req, res) => {
    try {
        const db = getDb();
        const product = await db.get('SELECT * FROM products WHERE gtin = ?', req.params.gtin);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Create or update product
router.post('/', async (req, res) => {
    try {
        const db = getDb();
        const { gtin, name, brand, vendor, mrp, netQuantity, manufacturerAddress } = req.body;
        
        await db.run(`
            INSERT INTO products (gtin, name, brand, vendor, mrp, netQuantity, manufacturerAddress)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(gtin) DO UPDATE SET
            name=excluded.name, brand=excluded.brand, vendor=excluded.vendor, 
            mrp=excluded.mrp, netQuantity=excluded.netQuantity, manufacturerAddress=excluded.manufacturerAddress
        `, [gtin, name, brand, vendor, mrp, netQuantity, manufacturerAddress]);

        res.json({ success: true, gtin });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get cross-location inspection history for a GTIN
router.get('/:gtin/inspections', async (req, res) => {
    try {
        const db = getDb();
        const history = await db.all('SELECT * FROM inspections WHERE gtin = ? ORDER BY createdAt DESC', req.params.gtin);
        res.json(history);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;

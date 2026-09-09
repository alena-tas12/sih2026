const express = require('express');
const { products, inspections } = require('../data/seed');

const router = express.Router();

// Get product master by GTIN
router.get('/:gtin', (req, res) => {
    // 5-minute public cache for master records
    res.set('Cache-Control', 'public, max-age=300');
    
    const product = products.find(p => p.gtin === req.params.gtin);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Get cross-location inspection history for a GTIN
router.get('/:gtin/inspections', (req, res) => {
    // 30-second stale-while-revalidate for fast timeline loading
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    
    const history = inspections.filter(i => i.gtin === req.params.gtin);
    res.json(history);
});

module.exports = router;

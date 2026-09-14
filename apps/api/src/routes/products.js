import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC').all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

// REAL EXTERNAL DISCOVERY via Open Food Facts
async function discoverExternalProduct(gtin) {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${gtin}.json`, {
      headers: {
        'User-Agent': 'GenesisCompliance - Android - Version 1.0 - www.github.com/alena-tas12/sih2026'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        return {
          name: p.product_name || p.product_name_en || 'Unknown Product',
          brand: p.brands || 'Unknown Brand',
          vendor: p.creator || 'OpenFoodFacts Contributor',
          standard_mrp: 0.00, // External databases usually don't have local MRP
          net_quantity: p.quantity || 'Unknown',
          image_url: p.image_url || p.image_front_url || null,
          image_source: 'Open Food Facts',
          image_source_url: `https://world.openfoodfacts.org/product/${gtin}`,
          image_license: 'Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0)',
          source: 'OPEN_FOOD_FACTS'
        };
      }
    }
  } catch (error) {
    console.error('OpenFoodFacts fetch failed', error);
  }
  return null;
}

router.get('/:gtin', async (c) => {
  try {
    const gtin = c.req.param('gtin')
    
    // 1. Search Genesis Product Master
    const localProduct = await c.env.DB.prepare(`
      SELECT p.*, g.source, g.verified FROM products p 
      JOIN gtin_registry g ON p.id = g.product_id 
      WHERE g.gtin = ?
    `).bind(gtin).first()
    
    if (localProduct) {
      return c.json(localProduct)
    }

    // 2. Search legitimate free/open external product databases
    const externalProduct = await discoverExternalProduct(gtin);
    
    if (externalProduct) {
      const newProductId = `PROD-EXT-${Date.now()}`
      
      // Insert into our Product Catalogue as a Candidate (NOT Verified)
      await c.env.DB.prepare(`
        INSERT INTO products (
          id, name, brand, vendor, standard_mrp, net_quantity, 
          image_url, image_source, image_source_url, image_license
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newProductId, externalProduct.name, externalProduct.brand, externalProduct.vendor, 
        externalProduct.standard_mrp, externalProduct.net_quantity, 
        externalProduct.image_url, externalProduct.image_source, externalProduct.image_source_url, externalProduct.image_license
      ).run();
      
      // Register GTIN with provenance source, explicit verified = 0
      await c.env.DB.prepare(
        'INSERT INTO gtin_registry (gtin, product_id, source, verified) VALUES (?, ?, ?, 0)'
      ).bind(gtin, newProductId, externalProduct.source).run();
      
      // Log audit event
      await c.env.DB.prepare(
        'INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)'
      ).bind('EXTERNAL_DISCOVERY', 'PRODUCT', newProductId, `Discovered via ${externalProduct.source}`).run();

      const savedProduct = await c.env.DB.prepare(`
        SELECT p.*, g.source, g.verified FROM products p 
        JOIN gtin_registry g ON p.id = g.product_id 
        WHERE g.gtin = ?
      `).bind(gtin).first()
      
      return c.json(savedProduct)
    }
    
    // 3. Unknown barcode completely
    return c.json({ error: 'Product not found in any local or external registry' }, 404)
    
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Database error' }, 500)
  }
})

router.put('/:gtin', async (c) => {
  try {
    const gtin = c.req.param('gtin')
    const body = await c.req.json()
    const { name, mrp, netQuantity } = body

    const existing = await c.env.DB.prepare('SELECT * FROM gtin_registry WHERE gtin = ?').bind(gtin).first()
    
    if (!existing) {
      const newProductId = `PROD-${Date.now()}`
      await c.env.DB.prepare('INSERT INTO products (id, name, standard_mrp, net_quantity) VALUES (?, ?, ?, ?)').bind(newProductId, name, mrp || 0, netQuantity || 'Unknown').run()
      await c.env.DB.prepare('INSERT INTO gtin_registry (gtin, product_id, source, verified) VALUES (?, ?, ?, ?)').bind(gtin, newProductId, 'USER_SUBMITTED', 0).run()
      
      await c.env.DB.prepare(
        'INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)'
      ).bind('CREATE_PRODUCT', 'PRODUCT', newProductId, `Created user-submitted product from unknown GTIN scan`).run()
    } else {
      await c.env.DB.prepare('UPDATE products SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(name, existing.product_id).run()
    }

    return c.json({ success: true })
  } catch (err) {
    return c.json({ error: 'Database error updating product' }, 500)
  }
})

router.get('/:gtin/inspections', async (c) => {
  try {
    const gtin = c.req.param('gtin')
    const { results } = await c.env.DB.prepare('SELECT * FROM inspections WHERE gtin = ? ORDER BY created_at DESC LIMIT 10').bind(gtin).all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

// INVENTORY ROUTE
router.get('/:gtin/inventory', async (c) => {
  try {
    const gtin = c.req.param('gtin')
    
    const product = await c.env.DB.prepare('SELECT product_id FROM gtin_registry WHERE gtin = ?').bind(gtin).first()
    if (!product) return c.json([])
      
    const { results } = await c.env.DB.prepare(`
      SELECT i.*, l.name as location_name, l.region 
      FROM inventory i
      JOIN locations l ON i.location_id = l.id
      WHERE i.product_id = ?
    `).bind(product.product_id).all()
    
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

export default router

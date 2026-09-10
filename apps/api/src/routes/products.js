import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM products ORDER BY createdAt DESC').all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

router.get('/:gtin', async (c) => {
  try {
    const gtin = c.req.param('gtin')
    const product = await c.env.DB.prepare('SELECT * FROM products WHERE gtin = ?').bind(gtin).first()
    
    if (product) {
      return c.json(product)
    } else {
      return c.json({ error: 'Product not found' }, 404)
    }
  } catch (err) {
    return c.json({ error: 'Database error' }, 500)
  }
})

router.put('/:gtin', async (c) => {
  try {
    const gtin = c.req.param('gtin')
    const body = await c.req.json()
    const { name } = body

    await c.env.DB.prepare('UPDATE products SET name = ? WHERE gtin = ?').bind(name, gtin).run()

    await c.env.DB.prepare(
      'INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)'
    ).bind('PRODUCT_UPDATED', 'API_USER', gtin, `Updated product name to ${name}`).run()

    return c.json({ success: true })
  } catch (err) {
    return c.json({ error: 'Database error updating product' }, 500)
  }
})

router.get('/:gtin/inspections', async (c) => {
  try {
    const gtin = c.req.param('gtin')
    const { results } = await c.env.DB.prepare('SELECT * FROM inspections WHERE gtin = ? ORDER BY createdAt DESC LIMIT 10').bind(gtin).all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

export default router

import { Hono } from 'hono'
const router = new Hono()

router.get('/:gtin', async (c) => {
  try {
    const { gtin } = c.req.param()
    const product = await c.env.DB.prepare('SELECT * FROM products WHERE gtin = ?').bind(gtin).first()
    
    if (product) {
      return c.json(product)
    } else {
      return c.json({ error: 'Product not found' }, 404)
    }
  } catch (err) {
    return c.json({ error: 'Database error fetching product' }, 500)
  }
})

router.get('/:gtin/inspections', async (c) => {
  try {
    const { gtin } = c.req.param()
    const { results } = await c.env.DB.prepare('SELECT * FROM inspections WHERE gtin = ? ORDER BY createdAt DESC LIMIT 5').bind(gtin).all()
    return c.json(results)
  } catch (err) {
    return c.json({ error: 'Database error fetching inspections' }, 500)
  }
})

export default router

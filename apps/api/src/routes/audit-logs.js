import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    // audit_events table uses 'timestamp' column (not 'created_at')
    const { results } = await c.env.DB.prepare('SELECT * FROM audit_events ORDER BY timestamp DESC LIMIT 100').all()
    return c.json(results || [])
  } catch (err) {
    console.error('audit-logs GET error:', err)
    return c.json([])
  }
})

router.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { action, entity_type, entity_id, details } = body

    await c.env.DB.prepare(
      'INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)'
    ).bind(action, entity_type || 'SYSTEM', entity_id || 'N/A', details).run()

    return c.json({ success: true }, 201)
  } catch (err) {
    return c.json({ error: 'Error logging action' }, 500)
  }
})

export default router

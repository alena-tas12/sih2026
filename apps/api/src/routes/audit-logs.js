import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100').all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

router.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { action, actor, targetId, details } = body

    await c.env.DB.prepare(
      'INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)'
    ).bind(action, actor, targetId, details).run()

    return c.json({ success: true }, 201)
  } catch (err) {
    return c.json({ error: 'Error logging action' }, 500)
  }
})

export default router

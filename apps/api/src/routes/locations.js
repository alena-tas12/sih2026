import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM locations ORDER BY createdAt DESC').all()
    return c.json(results)
  } catch (err) {
    return c.json({ error: 'Database error fetching locations' }, 500)
  }
})

router.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { id, name, type, region } = body

    await c.env.DB.prepare(
      'INSERT INTO locations (id, name, type, region) VALUES (?, ?, ?, ?)'
    ).bind(id, name, type, region).run()

    await c.env.DB.prepare(
      'INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)'
    ).bind('CREATE_LOCATION', 'API_USER', id, `Created location ${name}`).run()

    return c.json({ success: true, id }, 201)
  } catch (err) {
    return c.json({ error: 'Error creating location' }, 500)
  }
})

export default router

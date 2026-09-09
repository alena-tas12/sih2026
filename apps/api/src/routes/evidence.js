import { Hono } from 'hono'
const router = new Hono()

router.get('/:inspectionId', async (c) => {
  try {
    const { inspectionId } = c.req.param()
    const { results } = await c.env.DB.prepare('SELECT * FROM evidence WHERE inspectionId = ? ORDER BY uploadedAt DESC').bind(inspectionId).all()
    return c.json(results)
  } catch (err) {
    return c.json({ error: 'Database error fetching evidence' }, 500)
  }
})

router.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { id, inspectionId, type, url } = body

    await c.env.DB.prepare(
      'INSERT INTO evidence (id, inspectionId, type, url) VALUES (?, ?, ?, ?)'
    ).bind(id, inspectionId, type, url).run()

    await c.env.DB.prepare(
      'INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)'
    ).bind('UPLOAD_EVIDENCE', 'API_USER', inspectionId, `Uploaded ${type} evidence`).run()

    return c.json({ success: true, id }, 201)
  } catch (err) {
    return c.json({ error: 'Error uploading evidence' }, 500)
  }
})

export default router

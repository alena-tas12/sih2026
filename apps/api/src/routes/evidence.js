import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM evidence ORDER BY uploadedAt DESC LIMIT 50').all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

router.get('/:inspectionId', async (c) => {
  try {
    const inspectionId = c.req.param('inspectionId')
    const { results } = await c.env.DB.prepare('SELECT * FROM evidence WHERE inspectionId = ? ORDER BY uploadedAt DESC').bind(inspectionId).all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

router.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { id, inspectionId, type, url } = body

    await c.env.DB.prepare(
      'INSERT INTO evidence (id, inspectionId, type, url) VALUES (?, ?, ?, ?)'
    ).bind(id || `EV-${Date.now()}`, inspectionId, type, url).run()

    await c.env.DB.prepare(
      'INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)'
    ).bind('UPLOAD_EVIDENCE', 'API_USER', inspectionId, `Uploaded ${type} evidence`).run()

    return c.json({ success: true, id }, 201)
  } catch (err) {
    return c.json({ error: 'Error uploading evidence' }, 500)
  }
})

// New upload route: accepts JSON { inspectionId, type, filename, base64 }
router.post('/upload', async (c) => {
  try {
    const contentType = c.req.headers.get('content-type') || ''
    let inspectionId = null
    let type = 'CAMERA'
    let filename = `evidence-${Date.now()}.jpg`
    let url = null

    if (contentType.includes('application/json')) {
      const body = await c.req.json()
      inspectionId = body.inspectionId || null
      type = body.type || type
      filename = body.filename || filename
      const base64 = body.base64 || body.data || null
      if (!base64) return c.json({ error: 'No image data provided' }, 400)
      // store as data URL in DB (fallback if no R2 binding configured)
      // normalize: if base64 already starts with data:, use as-is
      if (base64.startsWith('data:')) {
        url = base64
      } else {
        // assume JPEG if no mime provided
        url = `data:image/jpeg;base64,${base64}`
      }
    } else {
      // For multipart/form-data, prefer JSON route; return error
      return c.json({ error: 'Unsupported content type, please POST JSON with base64 image' }, 415)
    }

    const id = `EV-${Date.now()}`

    await c.env.DB.prepare(
      'INSERT INTO evidence (id, inspectionId, type, url) VALUES (?, ?, ?, ?)'
    ).bind(id, inspectionId, type, url).run()

    await c.env.DB.prepare(
      'INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)'
    ).bind('UPLOAD_EVIDENCE', 'API_USER', inspectionId, `Uploaded ${type} evidence`).run()

    return c.json({ success: true, id, url }, 201)
  } catch (err) {
    console.error('upload error', err)
    return c.json({ error: 'Error uploading evidence' }, 500)
  }
})

export default router

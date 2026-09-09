import { Hono } from 'hono'
const router = new Hono()

router.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { id, gtin, location, extractedMrp, extractedQty, extractedMfgDate, extractedExpDate, status, reviewDecision, reviewerNotes } = body

    await c.env.DB.prepare(`
      INSERT INTO inspections (id, gtin, location, extractedMrp, extractedQty, extractedMfgDate, extractedExpDate, status, reviewDecision, reviewerNotes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, gtin, location, extractedMrp || null, extractedQty || null, extractedMfgDate || null, extractedExpDate || null, status, reviewDecision || null, reviewerNotes || null
    ).run()

    await c.env.DB.prepare(
      "INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)"
    ).bind('INSPECTION_RECORDED', 'API_USER', id, `Recorded inspection for ${gtin}`).run()

    return c.json({ success: true, id }, 201)
  } catch (err) {
    return c.json({ error: 'Database error saving inspection' }, 500)
  }
})

export default router

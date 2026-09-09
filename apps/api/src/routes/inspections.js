import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT i.*, p.name as productName, p.vendor as orgName
      FROM inspections i
      LEFT JOIN products p ON i.gtin = p.gtin
      ORDER BY i.date DESC
    `).all()
    return c.json(results)
  } catch (err) {
    return c.json({ error: 'Database error fetching cases' }, 500)
  }
})

router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const caseData = await c.env.DB.prepare(`
      SELECT i.*, p.name as productName, p.vendor as orgName
      FROM inspections i
      LEFT JOIN products p ON i.gtin = p.gtin
      WHERE i.id = ?
    `).bind(id).first()
    
    if (!caseData) return c.json({ error: 'Not found' }, 404)
    return c.json(caseData)
  } catch (err) {
    return c.json({ error: 'Database error' }, 500)
  }
})

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

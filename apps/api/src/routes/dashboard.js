import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const trackedRes = await c.env.DB.prepare('SELECT COUNT(*) as count FROM products').first()
    const matchRes = await c.env.DB.prepare('SELECT COUNT(*) as count FROM inspections WHERE status = "COMPLIANT"').first()
    const diffRes = await c.env.DB.prepare('SELECT COUNT(*) as count FROM inspections WHERE status = "NON_COMPLIANT"').first()
    const pendingRes = await c.env.DB.prepare('SELECT COUNT(*) as count FROM inspections WHERE status = "REVIEW_REQUIRED"').first()
    
    const { results: alerts } = await c.env.DB.prepare(`
      SELECT i.*, p.name as productName 
      FROM inspections i
      JOIN products p ON i.gtin = p.gtin
      WHERE i.status IN ('NON_COMPLIANT', 'REVIEW_REQUIRED')
      ORDER BY i.createdAt DESC LIMIT 5
    `).all()
    
    const { results: recentLogs } = await c.env.DB.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 5').all()

    return c.json({
      metrics: {
        productsTracked: trackedRes.count,
        crossLocationMatches: matchRes.count,
        declarationDifferences: diffRes.count,
        pendingVerification: pendingRes.count
      },
      crossLocationAlerts: alerts,
      recentActivity: recentLogs
    })
  } catch (err) {
    return c.json({ error: 'Database error fetching dashboard data' }, 500)
  }
})

export default router

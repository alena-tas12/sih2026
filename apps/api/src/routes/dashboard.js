import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const trackedRes = await c.env.DB.prepare('SELECT COUNT(*) as count FROM products').first()
    const matchRes = await c.env.DB.prepare('SELECT COUNT(*) as count FROM inspections WHERE status = "COMPLIANT"').first()
    const diffRes = await c.env.DB.prepare('SELECT COUNT(*) as count FROM inspections WHERE status = "NON_COMPLIANT"').first()
    const pendingRes = await c.env.DB.prepare('SELECT COUNT(*) as count FROM inspections WHERE status = "REVIEW_REQUIRED"').first()
    
    let alerts = []
    try {
      const alertsRes = await c.env.DB.prepare(`
        SELECT i.*, p.name as productName 
        FROM inspections i
        LEFT JOIN gtin_registry g ON i.gtin = g.gtin
        LEFT JOIN products p ON g.product_id = p.id
        WHERE i.status IN ('NON_COMPLIANT', 'REVIEW_REQUIRED')
        ORDER BY i.created_at DESC LIMIT 5
      `).all()
      alerts = alertsRes.results || []
    } catch (e) { /* ignore */ }
    
    let recentLogs = []
    try {
      const logsRes = await c.env.DB.prepare('SELECT * FROM audit_events ORDER BY timestamp DESC LIMIT 5').all()
      recentLogs = logsRes.results || []
    } catch (e) { /* ignore */ }

    return c.json({
      metrics: {
        productsTracked: trackedRes?.count || 0,
        crossLocationMatches: matchRes?.count || 0,
        declarationDifferences: diffRes?.count || 0,
        pendingVerification: pendingRes?.count || 0
      },
      crossLocationAlerts: alerts,
      recentActivity: recentLogs
    })
  } catch (err) {
    return c.json({
      metrics: {
        productsTracked: 0,
        crossLocationMatches: 0,
        declarationDifferences: 0,
        pendingVerification: 0
      },
      crossLocationAlerts: [],
      recentActivity: []
    })
  }
})

export default router

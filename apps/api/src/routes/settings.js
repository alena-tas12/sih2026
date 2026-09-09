import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM settings').all()
    const settings = {}
    results.forEach(row => {
      let val = row.value
      if (val === 'true') val = true
      if (val === 'false') val = false
      if (!isNaN(val) && val !== '') val = Number(val)
      settings[row.key] = val
    })
    return c.json(settings)
  } catch (err) {
    return c.json({ error: 'Failed to fetch settings' }, 500)
  }
})

router.post('/', async (c) => {
  try {
    const updates = await c.req.json()
    for (const [key, val] of Object.entries(updates)) {
      await c.env.DB.prepare(`
        INSERT INTO settings (key, value) VALUES (?, ?) 
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).bind(key, String(val)).run()
    }
    
    await c.env.DB.prepare(
      "INSERT INTO audit_logs (action, actor, targetId, details) VALUES (?, ?, ?, ?)"
    ).bind('UPDATE_SETTINGS', 'API_USER', 'SYSTEM', `Updated settings`).run()

    return c.json({ success: true })
  } catch (err) {
    return c.json({ error: 'Failed to update settings' }, 500)
  }
})

export default router

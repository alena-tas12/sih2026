import { Hono } from 'hono'
const router = new Hono()

router.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT r.id, r.rule_section as ref, r.field_target as field, r.logical_constraint as logic, reg.act_name, reg.url, 'Active' as status
      FROM rules r
      JOIN regulations reg ON r.regulation_id = reg.id
    `).all()
    return c.json(results || [])
  } catch (err) {
    return c.json([])
  }
})

export default router

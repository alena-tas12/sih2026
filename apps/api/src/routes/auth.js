import { Hono } from 'hono'
import { sign } from 'hono/jwt'

const router = new Hono()

router.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password } = body

    if (email === 'admin@genesis.com' && password === 'genesis2026') {
      
      const payload = {
        sub: 'usr_123',
        email: email,
        role: 'admin',
        org_id: 'ORG-MAIN',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // 30 days for demo persistence
      }
      
      // Use standard JWT signing with a secret from env, or fallback for demo
      const secret = c.env.JWT_SECRET || 'genesis-super-secret-key-2026'
      const token = await sign(payload, secret)
      
      await c.env.DB.prepare(
        'INSERT INTO audit_events (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)'
      ).bind('USER_LOGIN', 'USER', email, `Successful login`).run()

      return c.json({ 
        success: true, 
        token,
        user: { email, role: 'admin', name: 'System Administrator', org_id: 'ORG-MAIN' }
      })
    } else {
      return c.json({ error: 'Invalid email or password' }, 401)
    }
  } catch (err) {
    return c.json({ error: 'Login failed' }, 500)
  }
})

export default router

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import productRoutes from './routes/products.js'
import inspectionRoutes from './routes/inspections.js'
import settingsRoutes from './routes/settings.js'
import dashboardRoutes from './routes/dashboard.js'
import locationRoutes from './routes/locations.js'
import evidenceRoutes from './routes/evidence.js'
import auditLogRoutes from './routes/audit-logs.js'
import authRoutes from './routes/auth.js'
import regulationsRoutes from './routes/regulations.js'

const app = new Hono()

// Global error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  // If it's a JWT auth error, return 401 not 500
  if (err && String(err).includes('authorization')) {
    return c.json({ error: 'Unauthorized. Please log in.' }, 401)
  }
  return c.json({ error: 'Something went wrong', detail: String(err) }, 500)
})

app.use('*', cors({
  origin: (origin) => {
    return origin || 'http://localhost:5173'
  },
  credentials: true
}))

const JWT_SECRET = 'genesis-super-secret-key-2026'
const jwtMiddleware = jwt({ secret: JWT_SECRET, alg: 'HS256' })

// Protect inspection write endpoints (POST/PUT/DELETE require token, GET is public)
app.use('/api/inspections', async (c, next) => {
  if (c.req.method !== 'GET') return jwtMiddleware(c, next)
  return next()
})
app.use('/api/inspections/:id', async (c, next) => {
  if (c.req.method !== 'GET') return jwtMiddleware(c, next)
  return next()
})
app.use('/api/inspections/:id/*', jwtMiddleware)
app.use('/api/evidence/upload', jwtMiddleware)
app.use('/api/audit-logs', jwtMiddleware)
app.use('/api/audit-logs/*', jwtMiddleware)
// Product PUT is protected, GET is public
app.use('/api/products/:gtin', async (c, next) => {
  if (c.req.method !== 'GET') return jwtMiddleware(c, next)
  return next()
})

app.get('/health', (c) => c.json({ status: 'ok', version: '1.0.0' }))

app.route('/api/products', productRoutes)
app.route('/api/inspections', inspectionRoutes)
app.route('/api/settings', settingsRoutes)
app.route('/api/dashboard', dashboardRoutes)
app.route('/api/locations', locationRoutes)
app.route('/api/evidence', evidenceRoutes)
app.route('/api/audit-logs', auditLogRoutes)
app.route('/api/auth', authRoutes)
app.route('/api/regulations', regulationsRoutes)

// SPA Fallback: Any other route should return index.html for React Router
app.get('*', async (c) => {
  return c.env.ASSETS.fetch(new Request(new URL('/', c.req.url)))
})

export default app

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import productRoutes from './routes/products.js'
import inspectionRoutes from './routes/inspections.js'
import settingsRoutes from './routes/settings.js'
import dashboardRoutes from './routes/dashboard.js'
import locationRoutes from './routes/locations.js'
import evidenceRoutes from './routes/evidence.js'
import auditLogRoutes from './routes/audit-logs.js'

const app = new Hono()

app.use('*', cors({
  origin: (origin) => {
    // In production, restrict this. For now, allow local Vite proxy or any.
    return origin || 'http://localhost:5173'
  },
  credentials: true
}))

app.get('/health', (c) => c.json({ status: 'ok', version: '1.0.0' }))

app.route('/api/products', productRoutes)
app.route('/api/inspections', inspectionRoutes)
app.route('/api/settings', settingsRoutes)
app.route('/api/dashboard', dashboardRoutes)
app.route('/api/locations', locationRoutes)
app.route('/api/evidence', evidenceRoutes)
app.route('/api/audit-logs', auditLogRoutes)

// SPA Fallback: Any other route should return index.html for React Router
app.get('*', async (c) => {
  return c.env.ASSETS.fetch(new Request(new URL('/', c.req.url)))
})

export default app

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./src/data/db');
const productRoutes = require('./src/routes/products');
const inspectionRoutes = require('./src/routes/inspections');
const settingsRoutes = require('./src/routes/settings');
const dashboardRoutes = require('./src/routes/dashboard');
const locationRoutes = require('./src/routes/locations');
const evidenceRoutes = require('./src/routes/evidence');
const auditLogRoutes = require('./src/routes/audit-logs');

const app = express();

app.use(express.json());
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// API routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0' });
});

app.use('/api/products', productRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// Serve the built React frontend (production only)
const distPath = path.join(__dirname, 'public');
app.use(express.static(distPath));

// SPA fallback: any non-API route serves index.html
app.get('{*path}', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
    }
});

// App Engine provides PORT via environment variable
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    initDb().then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server listening on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Failed to initialize database', err);
    });
}

module.exports = app;

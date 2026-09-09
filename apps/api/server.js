const express = require('express');
const cors = require('cors');
const { initDb } = require('./src/data/db');
const productRoutes = require('./src/routes/products');
const inspectionRoutes = require('./src/routes/inspections');
const settingsRoutes = require('./src/routes/settings');
const dashboardRoutes = require('./src/routes/dashboard');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0' });
});

app.use('/api/products', productRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    initDb().then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Failed to initialize database', err);
    });
}

module.exports = app;

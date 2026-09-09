const express = require('express');
const cors = require('cors');
const caseRoutes = require('./src/routes/cases');
const productRoutes = require('./src/routes/products');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0' });
});

app.use('/api/cases', caseRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

module.exports = app;

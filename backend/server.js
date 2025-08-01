const express = require('express');
const cors = require('cors');

const app  = express();
const PORT = 3000;
const authRoutes = require('./routes/auth');

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/api', (req, res) => {
    res.json({
        message: 'ABC Seguros API',
        version: '1.0.0',
        endpoints: [
            '/api/clients',
            '/api/plans',
            '/api/policies',
            '/api/payments',
            '/api/quotations',
            '/api/companies',
            '/api/users'
        ]
    });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/plan-base',    require('./routes/plan_base'));
app.use('/api/plan-options', require('./routes/plan_options'));
app.use('/api/clients',      require('./routes/clients'));
app.use('/api/policies',     require('./routes/policies'));
app.use('/api/payments',     require('./routes/payments'));
app.use('/api/quotations',   require('./routes/quotations'));
app.use('/api/companies',    require('./routes/companies'));
app.use('/api/users',        require('./routes/users'));

app.listen(PORT, () => console.log(`🚀 API lista en http://localhost:${PORT}/api`));

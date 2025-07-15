const router = require('express').Router();
const db     = require('../db');

router.get('/plans', (_, res) => {
    db.query(
        'SELECT id, code, name, company_id, base_premium FROM plans ORDER BY company_id',
        (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows)
    );
});

module.exports = router;

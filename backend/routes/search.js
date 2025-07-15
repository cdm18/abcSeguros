// routes/search.js
const router = require('express').Router();
const db     = require('../db');

router.get('/search', (req,res)=>{
    const term = `%${req.query.term || ''}%`;

    const sqlClients = `SELECT id, CONCAT(first_name,' ',last_name) AS label,
                             'client' AS type
                        FROM clients
                       WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?
                       LIMIT 5;`;

    const sqlPolicies = `SELECT id, policy_number AS label,
                              'policy' AS type
                         FROM policies
                        WHERE policy_number LIKE ?
                        LIMIT 5;`;

    db.query(sqlClients + sqlPolicies,
        [term,term,term, term],
        (err, [clients, policies]) =>
            err ? res.status(500).json({error:err.message})
                : res.json([...clients, ...policies])
    );
});

module.exports = router;

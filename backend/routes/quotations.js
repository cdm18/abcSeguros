const router = require('express').Router();
const db     = require('../db');

/* Crear cotización */
router.post('/quotations', (req, res) => {
    const { client_id, plan_id, extra_coverages = [] } = req.body;

    db.query('SELECT base_premium FROM plans WHERE id=?', [plan_id], (e, planRows) => {
        if (e || !planRows.length) return res.status(400).json({ error: 'Plan inválido' });

        let premium = Number(planRows[0].base_premium);
        extra_coverages.forEach(c => (premium += Number(c.amount)));

        const sql = `
      INSERT INTO quotations (client_id,plan_id,quoted_by,quote_amount,status)
      VALUES (?,?,?,?, 'NEW')
    `;
        db.query(sql, [client_id, plan_id, req.user?.id || 1, premium], (err, r) =>
            err ? res.status(500).json({ error: err.message })
                : res.json({ id: r.insertId, premium })
        );
    });
});

/* Listar cotizaciones */
router.get('/quotations', (req, res) => {
    const { clientId } = req.query;
    const where = clientId ? 'WHERE q.client_id=?' : '';
    const sql = `
        SELECT q.id, q.quote_amount, q.status, q.created_at,
               CONCAT(c.first_name,' ',c.last_name) client,
               p.name plan
        FROM quotations q
                 JOIN clients c ON c.id = q.client_id
                 JOIN plans   p ON p.id = q.plan_id
            ${where}
        ORDER BY q.created_at DESC
    `;
    db.query(sql, clientId ? [clientId] : [], (err, rows) =>
        err ? res.status(500).json({ error: err.message }) : res.json(rows)
    );
});

/* Aceptar cotización (crea póliza) */
router.post('/quotations/:id/accept', (req, res) => {
    const id = req.params.id;

    // -- lógica simplificada inline (sin proc):
    db.query('SELECT * FROM quotations WHERE id=?', [id], (e, qRows) => {
        if (e || !qRows.length) return res.status(404).json({ error: 'Cotización no existe' });
        const q = qRows[0];

        // 1) actualizar cotización
        db.query('UPDATE quotations SET status="ACCEPTED" WHERE id=?', [id]);

        // 2) crear póliza básica de 1 año
        const sql = `
      INSERT INTO policies
        (client_id, plan_id, policy_number, start_date, end_date, total_premium, status, created_from_q)
      VALUES (?,?,?,?, DATE_ADD(CURDATE(), INTERVAL 1 YEAR), ?, 'ACTIVE', ?)
    `;
        const polNum = `POL-${String(id).padStart(6,'0')}`;
        db.query(
            sql,
            [q.client_id, q.plan_id, polNum, new Date(), q.quote_amount, id],
            err =>
                err ? res.status(500).json({ error: err.message })
                    : res.json({ message: 'Póliza creada', policy_number: polNum })
        );
    });
});

module.exports = router;

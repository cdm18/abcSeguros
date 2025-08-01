const db = require('../db');

/* -------- helpers -------- */
const asJson = (res, err, rows, notFound = 'Not found') => {
    if (err) return res.status(500).json(err);
    if (!rows?.length) return res.status(404).json({message: notFound});
    res.json(rows);
};

/* -------- CRUD -------- */
exports.getAll = (req, res) => {
    db.query('SELECT * FROM quotations', (e, r) => asJson(res, e, r));
};

exports.getById = (req, res) => {
    db.query(
        'SELECT * FROM quotations WHERE id = ?',
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            if (!rows.length) return res.status(404).json({message: 'Quotation not found'});

            /* devolvemos la PRIMERA fila — no el array */
            res.json(rows[0]);
        }
    );
};

exports.create = async (req, res) => {
    let {client_id, plan_id, plan_option_id, quoted_by, quote_amount} = req.body;

    try {
        /* si plan_id llega null: lo sacamos de plan_option_id */
        if (!plan_id && plan_option_id) {
            const [rows] = await db.promise().query(
                'SELECT base_plan_id FROM plan_options WHERE id = ?',
                [plan_option_id]
            );
            plan_id = rows.length ? rows[0].base_plan_id : null;
        }
        if (!plan_id) {
            return res.status(400).json({error: 'plan_id no puede ser NULL'});
        }

        const [r] = await db.promise().query(
            `INSERT INTO quotations
                 (client_id, plan_id, plan_option_id, quoted_by, quote_amount)
             VALUES (?, ?, ?, ?, ?)`,
            [client_id, plan_id, plan_option_id, quoted_by, quote_amount]
        );
        res.status(201).json({id: r.insertId});

    } catch (err) {
        console.error('Error creando cotización:', err);
        res.status(500).json({error: 'Error al crear cotización'});
    }
};

exports.update = (req, res) => {
    db.query('UPDATE quotations SET ? WHERE id = ?',
        [req.body, req.params.id],
        (e, r) => e
            ? res.status(500).json(e)
            : r.affectedRows
                ? res.json({message: 'Quotation updated'})
                : res.status(404).json({message: 'Quotation not found'})
    );
};

exports.remove = (req, res) => {
    db.query('DELETE FROM quotations WHERE id = ?', [req.params.id],
        (e, r) => e
            ? res.status(500).json(e)
            : r.affectedRows
                ? res.status(204).end()
                : res.status(404).json({message: 'Quotation not found'})
    );
};

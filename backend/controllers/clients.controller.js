const db = require('../db');

// GET /api/clients
exports.getAll = (req, res) => {
    db.query('SELECT * FROM clients', (err, rows) =>
        err ? res.status(500).json(err) : res.json(rows)
    );
};

// GET /api/clients/:id
exports.getById = (req, res) => {
    db.query('SELECT * FROM clients WHERE id = ?', [req.params.id], (err, rows) =>
        err ? res.status(500).json(err)
            : rows.length ? res.json(rows[0]) : res.status(404).json({ msg: 'Not found' })
    );
};

// POST /api/clients
exports.create = (req, res) => {
    const data = { ...req.body };

    // si birth_date es '' o undefined → null
    if (!data.birth_date) data.birth_date = null;

    db.query('INSERT INTO clients SET ?', data, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId });
    });
};

// PUT /api/clients/:id
exports.update = (req, res) => {
    db.query('UPDATE clients SET ? WHERE id = ?', [req.body, req.params.id], (err) =>
        err ? res.status(500).json(err) : res.json({ id: +req.params.id, ...req.body })
    );
};

// DELETE /api/clients/:id
exports.remove = (req, res) => {
    db.query('DELETE FROM clients WHERE id = ?', [req.params.id], (err) =>
        err ? res.status(500).json(err) : res.status(204).end()
    );
};

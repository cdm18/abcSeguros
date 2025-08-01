// controllers/policies.controller.js
const db = require('../db');

exports.getAll = (req, res) => {
    db.query('SELECT * FROM policies', (err, rows) =>
        err ? res.status(500).json(err) : res.json(rows)
    );
};

exports.getById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM policies WHERE id = ?', [id], (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        res.json(rows[0]);
    });
};

exports.create = (req, res) => {
    const policyData = req.body;
    db.query('INSERT INTO policies SET ?', policyData, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(201).json({
            message: 'Policy created successfully',
            id: result.insertId
        });
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const policyData = req.body;
    db.query('UPDATE policies SET ? WHERE id = ?', [policyData, id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        res.json({ message: 'Policy updated successfully' });
    });
};

exports.remove = (req, res) => {
    const { id } = req.params;

    // Eliminar pagos relacionados antes de eliminar la póliza
    db.query('DELETE FROM payments WHERE policy_id = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al eliminar pagos relacionados',
                error: err
            });
        }

        db.query('DELETE FROM policies WHERE id = ?', [id], (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error al eliminar póliza',
                    error: err
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Póliza no encontrada' });
            }
            res.json({ message: 'Póliza eliminada correctamente' });
        });
    });
};

exports.getMetadata = (req, res) => {
    const { id } = req.params;
    db.query('SELECT meta_key, meta_value FROM policy_metadata WHERE policy_id = ?', [id], (err, rows) => {
        if (err) return res.status(500).json(err);
        const metadata = {};
        rows.forEach(row => metadata[row.meta_key] = row.meta_value);
        res.json(metadata);
    });
};

exports.updateMetadata = (req, res) => {
    const { id } = req.params;
    const metadata = req.body; // Esperamos un objeto: { origen: "Ecuador", destino: "España" }

    // Eliminar los metadatos existentes
    db.query('DELETE FROM policy_metadata WHERE policy_id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);

        const entries = Object.entries(metadata);
        if (entries.length === 0) return res.json({ message: 'Metadata cleared' });

        const values = entries.map(([key, value]) => [id, key, value]);
        db.query('INSERT INTO policy_metadata (policy_id, meta_key, meta_value) VALUES ?', [values], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Metadata updated' });
        });
    });
};



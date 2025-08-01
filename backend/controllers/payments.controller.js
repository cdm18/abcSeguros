// controllers/payments.controller.js
const db = require('../db');

exports.getAll = (req, res) => {
    db.query('SELECT * FROM payments', (err, rows) =>
        err ? res.status(500).json(err) : res.json(rows)
    );
};

exports.getById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM payments WHERE id = ?', [id], (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(rows[0]);
    });
};

exports.create = (req, res) => {
    const paymentData = req.body;
    db.query('INSERT INTO payments SET ?', paymentData, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(201).json({
            message: 'Payment created successfully',
            id: result.insertId
        });
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const paymentData = req.body;
    db.query('UPDATE payments SET ? WHERE id = ?', [paymentData, id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json({ message: 'Payment updated successfully' });
    });
};

exports.remove = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM payments WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json({ message: 'Payment deleted successfully' });
    });
};
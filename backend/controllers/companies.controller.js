// controllers/companies.controller.js
const db = require('../db');

exports.getAll = (req, res) => {
    db.query('SELECT * FROM companies', (err, rows) =>
        err ? res.status(500).json(err) : res.json(rows)
    );
};

exports.getById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM companies WHERE id = ?', [id], (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(rows[0]);
    });
};

exports.create = (req, res) => {
    const companyData = req.body;
    db.query('INSERT INTO companies SET ?', companyData, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(201).json({
            message: 'Company created successfully',
            id: result.insertId
        });
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const companyData = req.body;
    db.query('UPDATE companies SET ? WHERE id = ?', [companyData, id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ message: 'Company updated successfully' });
    });
};

exports.remove = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM companies WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ message: 'Company deleted successfully' });
    });
};
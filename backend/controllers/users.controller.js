// controllers/users.controller.js
const db = require('../db');

exports.getAll = (req, res) => {
    // No devolver passwords en la consulta
    'SELECT id, username, full_name, avatar_url, phone, email, role, created_at \
   FROM users', (err, rows) => err ? res.status(500).json(err) : res.json(rows);
};

exports.getById = (req, res) => {
    const {id} = req.params;
    // No devolver password en la consulta
    db.query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (rows.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(rows[0]);
    });
};

exports.create = (req, res) => {
    const userData = req.body;
    // Aquí deberías hashear la password antes de guardar
    // const bcrypt = require('bcrypt');
    // userData.password = bcrypt.hashSync(userData.password, 10);

    db.query('INSERT INTO users SET ?', userData, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(201).json({
            message: 'User created successfully', id: result.insertId
        });
    });
};

exports.update = (req, res) => {
    const {id} = req.params;
    const userData = req.body;

    // Si se está actualizando la password, hashearla
    // if (userData.password) {
    //     const bcrypt = require('bcrypt');
    //     userData.password = bcrypt.hashSync(userData.password, 10);
    // }

    db.query('UPDATE users SET ? WHERE id = ?', [userData, id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json({message: 'User updated successfully'});
    });
};

exports.remove = (req, res) => {
    const {id} = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json({message: 'User deleted successfully'});
    });
};
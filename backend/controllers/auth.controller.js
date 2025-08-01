// controllers/auth.controller.js
const db = require('../db');

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
        if (err)      return res.status(500).json(err);
        if (!rows[0]) return res.status(401).json({ message: 'Credenciales inválidas' });

        const user = rows[0];

        // Si la clave está hasheada, descomenta:
        // if (!bcrypt.compareSync(password, user.password))
        //   return res.status(401).json({ message: 'Credenciales inválidas' });

        if (password !== user.password)       // ←-- sólo mientras no uses hash
            return res.status(401).json({ message: 'Credenciales inválidas' });

        // nunca devuelvas la contraseña
        const { password: _pw, ...safeUser } = user;
        return res.json(safeUser);            // ← incluye full_name, phone, avatar_url
    });
};

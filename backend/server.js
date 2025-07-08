const express = require('express');
const mysql   = require('mysql2');
const cors    = require('cors');

const app  = express();
app.use(express.json());
app.use(cors());             // permite peticiones desde localhost:4200

const db = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',        // ← tu usuario
    password: 'piloto12',        // ← tu contraseña
    database: 'abcSeguros'  // ← tu base
});


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, rows) => {
            if (err)   return res.status(500).json({ error: err.message });
            if (!rows.length) return res.status(401).json({ message: 'Credenciales incorrectas' });
            res.json({ message: 'Login OK', user: rows[0] });
        }
    );
});

app.listen(3000, () => console.log('Backend en http://localhost:3000'));

app.get('/api/dashboard/summary', (req, res) => {
    const sql = `
    SELECT
      (SELECT COUNT(*) FROM clients)            AS totalClients,
      (SELECT COUNT(*) FROM policies)           AS totalPolicies,
      (SELECT COUNT(*) FROM payments WHERE status='ON_TIME')    AS onTimePayments,
      (SELECT COUNT(*) FROM payments WHERE status='PENDING')    AS pendingPayments
  `;
    db.query(sql, (err, rows) =>
        err ? res.status(500).json({error:err.message}) : res.json(rows[0])
    );
});

// server.js  – reemplaza el endpoint antiguo
app.get('/api/dashboard/clients', (req, res) => {
    const sql = `
    SELECT  c.id,
            CONCAT(c.first_name,' ',c.last_name)       AS name,
            c.email,
            pl.name                                    AS plan,
            pol.total_premium                          AS total,
            pol.status
    FROM clients c
    LEFT JOIN policies pol ON pol.client_id = c.id AND pol.status='ACTIVE'
    LEFT JOIN plans    pl  ON pl.id = pol.plan_id
    ORDER BY c.id DESC
    LIMIT 10;
  `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

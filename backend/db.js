const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'piloto12',
    database: 'abcSeguros',
    connectionLimit: 10
});

db.getConnection((err, conn) => {
    if (err) throw err;
    console.log('✅ Conexión MySQL establecida');
    conn.release();
});

module.exports = db;

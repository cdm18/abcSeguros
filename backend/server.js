const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Crear la conexión con la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'piloto12', // Reemplaza con tu contraseña de MySQL
    database: 'abcSeguros'  // Reemplaza con el nombre de tu base de datos
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión a la base de datos MySQL establecida');
});

// Configurar una ruta para probar la conexión
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'piloto12',
    database: 'abcSeguros'
});

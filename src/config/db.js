const mysql = require('mysql2/promise');

module.exports = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD, // Não coloque valor padrão para senha!
  database: process.env.DB_NAME || 'empresa',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
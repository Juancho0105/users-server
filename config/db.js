const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Creamos el Pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Máximo 10 conexiones simultáneas
    queueLimit: 0
});

// IMPORTANTE: Exportamos la versión "promise" del pool.
// Esto nos permite usar 'await pool.query()' en lugar de callbacks antiguos.
// Se sentirá igual que usar Entity Framework con async/await.
module.exports = pool.promise();
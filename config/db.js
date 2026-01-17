const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Para local normalmente NO hace falta SSL.
  // Para algunos proveedores externos sí. Lo dejamos configurable:
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

module.exports = pool;

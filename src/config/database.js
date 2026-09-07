const { Pool } = require('pg');

// DATABASE_URL permite usar la conexión administrada por Railway; las demás
// variables mantienen compatible la ejecución local con PostgreSQL.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionString: process.env.DATABASE_URL || undefined,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

module.exports = pool;

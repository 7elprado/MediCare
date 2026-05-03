const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'medicare_user',
  host: process.env.DB_HOST || 'postgres',
  database: process.env.DB_NAME || 'medicare_db',
  password: process.env.DB_PASSWORD || 'medicare_password',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

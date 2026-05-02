const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'medicare_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'medicare_db',
  password: process.env.DB_PASSWORD || 'medicare_password',
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => {
    console.log('Executando query:', text);
    return pool.query(text, params);
  },
  pool: pool
};

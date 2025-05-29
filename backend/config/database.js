const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool using the same configuration as in app.js
const appPool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butlerdb',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

// Test the connection
appPool.connect()
  .then(() => console.log('Database pool connected successfully'))
  .catch(err => console.error('Database pool connection error:', err));

module.exports = { appPool }; 
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: process.env.PG_DATABASE || 'butler',
      password: process.env.PG_PASSWORD || 'dembele',
      port: process.env.PG_PORT || 5432,
    });

module.exports = pool;


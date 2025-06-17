const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butler',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Read and execute the migration file
    const migrationPath = path.join(__dirname, '../migrations/001_add_concierge_booking_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await client.query(migrationSQL);
    
    await client.query('COMMIT');
    console.log('Migration completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

runMigration(); 
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butlerdb',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function updateEnum() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Drop existing enum type
    await client.query('DROP TYPE IF EXISTS booking_status CASCADE');
    
    // Create new enum type with correct values
    await client.query(`
      CREATE TYPE booking_status AS ENUM (
        'pending',
        'accepted',
        'rejected',
        'cancelled',
        'completed'
      )
    `);

    // Update existing values
    await client.query(`
      UPDATE bookings 
      SET status = 'accepted' 
      WHERE status = 'confirmed'
    `);

    await client.query('COMMIT');
    console.log('✅ Successfully updated booking status enum type');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error);
  } finally {
    client.release();
    pool.end();
  }
}

updateEnum(); 
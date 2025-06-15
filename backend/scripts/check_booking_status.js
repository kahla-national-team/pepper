const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butlerdb',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function checkBookingStatus() {
  const client = await pool.connect();
  try {
    // Check column type
    const columnInfo = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'bookings' AND column_name = 'status';
    `);
    console.log('Column info:', columnInfo.rows[0]);

    // Check enum values
    const enumValues = await client.query(`
      SELECT t.typname, e.enumlabel
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname = 'booking_status'
      ORDER BY e.enumsortorder;
    `);
    console.log('Enum values:', enumValues.rows);

    // Check current values
    const currentValues = await client.query(`
      SELECT DISTINCT status FROM bookings;
    `);
    console.log('Current values:', currentValues.rows);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    pool.end();
  }
}

checkBookingStatus(); 
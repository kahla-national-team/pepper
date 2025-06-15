const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butlerdb',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function updateBookingStatusEnum() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // First, update any existing 'confirmed' statuses to 'accepted'
    await client.query(`
      UPDATE bookings 
      SET status = 'accepted' 
      WHERE status = 'confirmed'
    `);

    // Drop the existing enum type
    await client.query(`
      DROP TYPE IF EXISTS booking_status_enum CASCADE
    `);

    // Create the new enum type with 'accepted' instead of 'confirmed'
    await client.query(`
      CREATE TYPE booking_status_enum AS ENUM (
        'pending',
        'accepted',
        'rejected',
        'cancelled',
        'completed'
      )
    `);

    // Update the existing status column to use the new enum type
    await client.query(`
      ALTER TABLE bookings 
      ALTER COLUMN status TYPE booking_status_enum 
      USING status::booking_status_enum;
    `);

    await client.query('COMMIT');
    console.log('Successfully updated booking_status enum type');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating booking_status enum:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the migration
updateBookingStatusEnum()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 
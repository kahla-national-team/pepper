const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pepper',
  password: 'postgres',
  port: 5432,
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
      DROP TYPE IF EXISTS booking_status CASCADE
    `);

    // Create the new enum type with 'accepted' instead of 'confirmed'
    await client.query(`
      CREATE TYPE booking_status AS ENUM (
        'pending',
        'accepted',
        'rejected',
        'cancelled',
        'completed'
      )
    `);

    // Add the column back with the new enum type
    await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN status booking_status NOT NULL DEFAULT 'pending'
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
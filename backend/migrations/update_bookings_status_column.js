const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'butlerdb',
  password: 'dembele',
  port: 5432,
});

async function updateBookingsStatusColumn() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // First, ensure the enum type exists
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE booking_status_enum AS ENUM (
          'pending',
          'confirmed',
          'cancelled',
          'completed'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Update the status column to use the enum type
    await client.query(`
      ALTER TABLE bookings 
      ALTER COLUMN status TYPE booking_status_enum 
      USING status::booking_status_enum;
    `);

    await client.query('COMMIT');
    console.log('Successfully updated bookings status column');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating bookings status column:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = updateBookingsStatusColumn;

// Run the migration
updateBookingsStatusColumn()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 
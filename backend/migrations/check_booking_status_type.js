const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'butlerdb',
  password: 'dembele',
  port: 5432,
});

async function checkAndFixBookingStatusType() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if the type exists
    const typeCheck = await client.query(`
      SELECT t.typname, e.enumlabel
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname = 'booking_status'
      ORDER BY e.enumsortorder;
    `);

    console.log('Current booking_status values:', typeCheck.rows);

    // Drop the existing type if it exists
    await client.query(`
      DROP TYPE IF EXISTS booking_status CASCADE;
    `);

    // Create the type with correct values
    await client.query(`
      CREATE TYPE booking_status AS ENUM (
        'pending',
        'confirmed',
        'cancelled',
        'completed'
      );
    `);

    // Add the column back if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'bookings' 
          AND column_name = 'status'
        ) THEN
          ALTER TABLE bookings 
          ADD COLUMN status booking_status NOT NULL DEFAULT 'pending';
        END IF;
      END $$;
    `);

    // Update any existing rows to use valid status values
    await client.query(`
      UPDATE bookings 
      SET status = 'pending' 
      WHERE status NOT IN ('pending', 'confirmed', 'cancelled', 'completed');
    `);

    await client.query('COMMIT');
    console.log('Successfully updated booking_status type');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating booking_status type:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the check and fix
checkAndFixBookingStatusType()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 
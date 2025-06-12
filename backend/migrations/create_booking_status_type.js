const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'butlerdb',
  password: 'dembele',
  port: 5432,
});

async function createBookingStatusType() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Drop and recreate the type
    await client.query(`DROP TYPE IF EXISTS booking_status_enum CASCADE;`);
    await client.query(`
      CREATE TYPE booking_status_enum AS ENUM (
        'pending',
        'confirmed',
        'cancelled',
        'completed'
      );
    `);
    await client.query('COMMIT');
    console.log('Successfully created booking_status_enum type');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating booking_status_enum type:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = createBookingStatusType;

// Run the migration
createBookingStatusType()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 
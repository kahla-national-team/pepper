const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butlerdb',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function checkTables() {
  try {
    console.log('Checking what tables exist in the database...');
    
    // Get all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('Available tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Check if bookings table exists and has data
    if (tablesResult.rows.some(row => row.table_name === 'bookings')) {
      const bookingsResult = await pool.query(
        'SELECT id, user_id, rental_id, start_date, status FROM bookings ORDER BY id LIMIT 10'
      );
      
      console.log('\nBookings table data:');
      console.log('Total count:', bookingsResult.rows.length);
      if (bookingsResult.rows.length > 0) {
        console.log('Available IDs:', bookingsResult.rows.map(r => r.id).join(', '));
      }
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await pool.end();
  }
}

checkTables(); 
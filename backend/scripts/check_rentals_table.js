const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butler',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function checkRentalsTable() {
  const client = await pool.connect();
  try {
    console.log('🔍 Checking rentals table structure...\n');

    // Get table structure
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'rentals' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Rentals table structure:');
    structure.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Check if latitude and longitude columns exist
    const hasLatitude = structure.rows.some(col => col.column_name === 'latitude');
    const hasLongitude = structure.rows.some(col => col.column_name === 'longitude');
    
    console.log(`\nlatitude column exists: ${hasLatitude ? '✅ YES' : '❌ NO'}`);
    console.log(`longitude column exists: ${hasLongitude ? '✅ YES' : '❌ NO'}`);

    // Check sample data
    const sampleData = await client.query('SELECT id, title, latitude, longitude FROM rentals LIMIT 3');
    console.log('\n📋 Sample rentals with coordinates:');
    sampleData.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ID: ${row.id}, Title: ${row.title}, Lat: ${row.latitude}, Lng: ${row.longitude}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkRentalsTable(); 
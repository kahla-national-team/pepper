const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butler',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function checkRentals() {
  const client = await pool.connect();
  try {
    console.log('🔍 Checking rentals in database...\n');

    // Check total count
    const countResult = await client.query('SELECT COUNT(*) as count FROM rentals WHERE is_active = true');
    console.log(`📊 Total active rentals: ${countResult.rows[0].count}`);

    // Check rentals with coordinates
    const withCoordsResult = await client.query('SELECT COUNT(*) as count FROM rentals WHERE is_active = true AND latitude IS NOT NULL AND longitude IS NOT NULL');
    console.log(`📍 Rentals with coordinates: ${withCoordsResult.rows[0].count}`);

    // Get sample rentals
    const sampleResult = await client.query(`
      SELECT id, title, latitude, longitude, is_active, is_available 
      FROM rentals 
      WHERE is_active = true 
      LIMIT 5
    `);
    
    console.log('\n📋 Sample rentals:');
    sampleResult.rows.forEach((rental, i) => {
      console.log(`  ${i + 1}. ID: ${rental.id}, Title: ${rental.title}`);
      console.log(`     Active: ${rental.is_active}, Available: ${rental.is_available}`);
      console.log(`     Coordinates: Lat: ${rental.latitude}, Lng: ${rental.longitude}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkRentals(); 
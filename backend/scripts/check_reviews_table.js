const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butler',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function checkReviewsTable() {
  try {
    console.log('Checking reviews table structure...');
    
    // Check table structure
    const structureResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'reviews'
      ORDER BY ordinal_position
    `);
    
    console.log('Reviews table structure:');
    structureResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check if table has any data
    const dataResult = await pool.query('SELECT COUNT(*) as count FROM reviews');
    console.log(`\nReviews table has ${dataResult.rows[0].count} records`);
    
    // Check for any constraints
    const constraintsResult = await pool.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'reviews'
    `);
    
    console.log('\nTable constraints:');
    constraintsResult.rows.forEach(row => {
      console.log(`  ${row.constraint_name}: ${row.constraint_type}`);
    });
    
  } catch (error) {
    console.error('Error checking reviews table:', error);
  } finally {
    await pool.end();
  }
}

checkReviewsTable(); 
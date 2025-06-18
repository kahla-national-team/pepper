const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butlerdb',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function fixReviewsTable() {
  try {
    console.log('Fixing reviews table structure...');
    
    // Drop the existing reviews table if it exists
    await pool.query('DROP TABLE IF EXISTS reviews CASCADE');
    console.log('Dropped existing reviews table');
    
    // Create the reviews table with proper structure
    await pool.query(`
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rental_id INTEGER REFERENCES rentals(id) ON DELETE SET NULL,
        service_id INTEGER REFERENCES concierge_services(id) ON DELETE SET NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT check_review_target CHECK (
          (rental_id IS NOT NULL AND service_id IS NULL) OR 
          (rental_id IS NULL AND service_id IS NOT NULL)
        )
      )
    `);
    
    console.log('Created new reviews table with proper structure');
    
    // Verify the table structure
    const structureResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'reviews'
      ORDER BY ordinal_position
    `);
    
    console.log('\nNew reviews table structure:');
    structureResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    console.log('\nReviews table fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing reviews table:', error);
  } finally {
    await pool.end();
  }
}

fixReviewsTable(); 
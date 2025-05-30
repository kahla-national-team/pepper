const { Pool } = require('pg');
const config = require('../../config/config');

async function addImageColumn() {
  const pool = new Pool(config.pgConfig);

  try {
    // Add image column if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'rentals' 
          AND column_name = 'image'
        ) THEN
          ALTER TABLE rentals 
          ADD COLUMN image TEXT;
        END IF;
      END $$;
    `);
    console.log('Added image column to rentals table');
  } catch (error) {
    console.error('Error adding image column:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
addImageColumn(); 
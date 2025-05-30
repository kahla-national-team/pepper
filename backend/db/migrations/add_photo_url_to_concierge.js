const { Pool } = require('pg');
const config = require('../../config/config');

async function addPhotoUrlColumn() {
  const pool = new Pool(config.pgConfig);

  try {
    // Add photo_url column if it doesn't exist
    await pool.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'concierge_services' 
          AND column_name = 'photo_url'
        ) THEN
          ALTER TABLE concierge_services 
          ADD COLUMN photo_url TEXT;
        END IF;
      END $$;
    `);
    console.log('Added photo_url column to concierge_services table');
  } catch (error) {
    console.error('Error adding photo_url column:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
addPhotoUrlColumn(); 
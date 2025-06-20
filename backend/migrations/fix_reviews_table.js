const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butlerdb',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function fixReviewsTable() {
  const client = await pool.connect();
  try {
    console.log('🔧 Fixing reviews table...');

    // Check if reviews table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'reviews'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('Creating reviews table...');
      await client.query(`
        CREATE TABLE reviews (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          rental_id INTEGER REFERENCES rentals(id) ON DELETE SET NULL,
          service_id INTEGER REFERENCES concierge_services(id) ON DELETE SET NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          reviewer_name VARCHAR(255),
          reviewer_email VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT check_review_target CHECK (
            (rental_id IS NOT NULL AND service_id IS NULL) OR 
            (rental_id IS NULL AND service_id IS NOT NULL)
          )
        );
      `);
      console.log('✅ Reviews table created successfully');
    } else {
      console.log('✅ Reviews table already exists');
    }

    // Add missing columns if they don't exist
    const columns = [
      { name: 'reviewer_name', type: 'VARCHAR(255)' },
      { name: 'reviewer_email', type: 'VARCHAR(255)' },
      { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' }
    ];

    for (const column of columns) {
      const columnExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'reviews' 
          AND column_name = $1
        );
      `, [column.name]);

      if (!columnExists.rows[0].exists) {
        console.log(`Adding column: ${column.name}`);
        await client.query(`ALTER TABLE reviews ADD COLUMN ${column.name} ${column.type}`);
        console.log(`✅ Added column: ${column.name}`);
      } else {
        console.log(`✅ Column ${column.name} already exists`);
      }
    }

    // Add constraints if they don't exist
    console.log('Checking constraints...');
    
    // Check rating constraint
    const ratingConstraintExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.check_constraints 
        WHERE constraint_name LIKE '%rating%'
      );
    `);

    if (!ratingConstraintExists.rows[0].exists) {
      console.log('Adding rating constraint...');
      await client.query(`
        ALTER TABLE reviews 
        ADD CONSTRAINT reviews_rating_check 
        CHECK (rating >= 1 AND rating <= 5)
      `);
      console.log('✅ Rating constraint added');
    } else {
      console.log('✅ Rating constraint already exists');
    }

    // Check review target constraint
    const targetConstraintExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.check_constraints 
        WHERE constraint_name LIKE '%review_target%'
      );
    `);

    if (!targetConstraintExists.rows[0].exists) {
      console.log('Adding review target constraint...');
      await client.query(`
        ALTER TABLE reviews 
        ADD CONSTRAINT check_review_target 
        CHECK (
          (rental_id IS NOT NULL AND service_id IS NULL) OR 
          (rental_id IS NULL AND service_id IS NOT NULL)
        )
      `);
      console.log('✅ Review target constraint added');
    } else {
      console.log('✅ Review target constraint already exists');
    }

    // Add indexes for better performance
    console.log('Adding indexes...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_reviews_rental_id ON reviews(rental_id)',
      'CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON reviews(service_id)',
      'CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)'
    ];

    for (const indexQuery of indexes) {
      await client.query(indexQuery);
    }
    console.log('✅ Indexes added successfully');

    // Create trigger for updated_at
    console.log('Setting up updated_at trigger...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
      CREATE TRIGGER update_reviews_updated_at
        BEFORE UPDATE ON reviews
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Updated_at trigger created');

    console.log('🎉 Reviews table fix completed successfully!');

  } catch (error) {
    console.error('❌ Error fixing reviews table:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
fixReviewsTable().catch(console.error); 
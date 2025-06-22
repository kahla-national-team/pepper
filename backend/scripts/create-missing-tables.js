const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butler',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function createMissingTables() {
  const client = await pool.connect();
  try {
    console.log('🔧 Creating missing tables...');

    // Create users table if it doesn't exist
    console.log('1. Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table ready');

    // Create rentals table if it doesn't exist
    console.log('2. Creating rentals table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS rentals (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id INTEGER REFERENCES users(id),
        price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Rentals table ready');

    // Create concierge_services table if it doesn't exist
    console.log('3. Creating concierge_services table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS concierge_services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id INTEGER REFERENCES users(id),
        price DECIMAL(10,2),
        photo_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Concierge services table ready');

    // Create reviews table if it doesn't exist
    console.log('4. Creating reviews table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
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
    console.log('✅ Reviews table ready');

    // Create notifications table if it doesn't exist
    console.log('5. Creating notifications table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Notifications table ready');

    // Add some sample data for testing
    console.log('6. Adding sample data...');
    
    // Add a sample user
    const userResult = await client.query(`
      INSERT INTO users (full_name, email, password) 
      VALUES ('Test User', 'test@example.com', 'password123')
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `);
    
    // Add a sample rental
    const rentalResult = await client.query(`
      INSERT INTO rentals (title, description, owner_id, price) 
      VALUES ('Test Rental', 'A beautiful test rental', 1, 100.00)
      ON CONFLICT DO NOTHING
      RETURNING id;
    `);
    
    // Add a sample service
    const serviceResult = await client.query(`
      INSERT INTO concierge_services (name, description, owner_id, price) 
      VALUES ('Test Service', 'A test concierge service', 1, 50.00)
      ON CONFLICT DO NOTHING
      RETURNING id;
    `);

    console.log('✅ Sample data added');

    // Check current state
    console.log('\n📊 Current database state:');
    const tables = ['users', 'rentals', 'concierge_services', 'reviews', 'notifications'];
    
    for (const table of tables) {
      const count = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${count.rows[0].count} records`);
    }

    console.log('\n🎉 All tables created successfully!');
    console.log('You can now test review submission.');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createMissingTables().catch(console.error); 
const { Pool } = require('pg');
const config = require('./config/config');
const User = require('./models/User');

async function initializeDatabase() {
  // Create a pool for the default postgres database
  const pool = new Pool({
    ...config.pgConfig,
    database: 'postgres' // Connect to default database first
  });

  try {
    // Create the database if it doesn't exist
    await pool.query(`CREATE DATABASE ${config.pgConfig.database}`);
    console.log(`Database ${config.pgConfig.database} created successfully`);
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`Database ${config.pgConfig.database} already exists`);
    } else {
      console.error('Error creating database:', error);
      process.exit(1);
    }
  } finally {
    await pool.end();
  }

  // Create a new pool for our application database
  const appPool = new Pool(config.pgConfig);
  const userModel = new User(appPool);

  try {
    // Create users table
    await userModel.createTable();
    console.log('Users table created successfully');

    // Create concierge services table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS concierge_services (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        duration_minutes INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Concierge services table created successfully');

    // Create rentals table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS rentals (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        owner_id INTEGER REFERENCES users(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Rentals table created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  } finally {
    await appPool.end();
  }
}

initializeDatabase(); 
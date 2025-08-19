const { Pool } = require('pg');

async function resetDatabase() {
  // Create a pool for the default postgres database
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'dembele',
    port: 5432
  });

  try {
    // Force disconnect all users from the database
    await pool.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'butler' AND pid <> pg_backend_pid();
    `);
    console.log('Terminated existing connections to butler database');

    // Drop the database if it exists
    await pool.query('DROP DATABASE IF EXISTS butler');
    console.log('Database dropped successfully');

    // Create the database
    await pool.query('CREATE DATABASE butler');
    console.log('Database created successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase(); 
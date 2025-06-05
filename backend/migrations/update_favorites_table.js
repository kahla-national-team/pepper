const { appPool } = require('../config/database');

async function migrate() {
  try {
    // Drop the existing favorites table
    await appPool.query('DROP TABLE IF EXISTS favorites CASCADE;');

    // Create the new favorites table
    await appPool.query(`
      CREATE TABLE favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        item_id INTEGER NOT NULL,
        item_type VARCHAR(10) CHECK (item_type IN ('stay', 'service')) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (user_id, item_id, item_type)
      );
    `);

    console.log('Successfully updated favorites table schema');
    process.exit(0);
  } catch (error) {
    console.error('Error updating favorites table:', error);
    process.exit(1);
  }
}

migrate(); 
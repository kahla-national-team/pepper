const { appPool } = require('../config/database');

async function migrate() {
  try {
    // Create user_follows table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS user_follows (
        id SERIAL PRIMARY KEY,
        follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (follower_id, following_id)
      );
    `);

    // Add follower and following count columns to users table if they don't exist
    await appPool.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND column_name = 'followers_count'
        ) THEN
          ALTER TABLE users 
          ADD COLUMN followers_count INTEGER DEFAULT 0;
        END IF;

        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND column_name = 'following_count'
        ) THEN
          ALTER TABLE users 
          ADD COLUMN following_count INTEGER DEFAULT 0;
        END IF;
      END $$;
    `);

    console.log('Successfully created user_follows table and added count columns');
    process.exit(0);
  } catch (error) {
    console.error('Error creating user_follows table:', error);
    process.exit(1);
  }
}

migrate(); 
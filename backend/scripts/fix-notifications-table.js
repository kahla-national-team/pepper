const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butlerdb',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function fixNotificationsTable() {
  const client = await pool.connect();
  try {
    console.log('🔧 Fixing notifications table...');

    // Check if notifications table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'notifications'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('Creating notifications table...');
      await client.query(`
        CREATE TABLE notifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Notifications table created successfully');
    } else {
      console.log('✅ Notifications table already exists');
    }

    // Check if user_id column exists
    const columnExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'user_id'
      );
    `);

    if (!columnExists.rows[0].exists) {
      console.log('Adding user_id column...');
      await client.query(`ALTER TABLE notifications ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`);
      console.log('✅ user_id column added successfully');
    } else {
      console.log('✅ user_id column already exists');
    }

    // Check table structure
    console.log('\n📊 Current notifications table structure:');
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'notifications' 
      ORDER BY ordinal_position
    `);
    
    structure.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    console.log('\n🎉 Notifications table fix completed successfully!');

  } catch (error) {
    console.error('❌ Error fixing notifications table:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixNotificationsTable().catch(console.error); 
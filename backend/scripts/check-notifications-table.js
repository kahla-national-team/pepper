const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butler',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function checkNotificationsTable() {
  const client = await pool.connect();
  try {
    console.log('🔍 Checking notifications table structure...\n');

    // Check if notifications table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'notifications'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('❌ Notifications table does not exist!');
      return;
    }

    console.log('✅ Notifications table exists');

    // Get table structure
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'notifications' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 Current table structure:');
    structure.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Check if user_id column exists
    const userIdExists = structure.rows.some(col => col.column_name === 'user_id');
    console.log(`\nuser_id column exists: ${userIdExists ? '✅ YES' : '❌ NO'}`);

    if (!userIdExists) {
      console.log('\n🔧 Adding user_id column...');
      await client.query(`
        ALTER TABLE notifications 
        ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      `);
      console.log('✅ user_id column added successfully');
    }

    // Check current data
    const count = await client.query('SELECT COUNT(*) as count FROM notifications');
    console.log(`\n📊 Current notifications count: ${count.rows[0].count}`);

    if (count.rows[0].count > 0) {
      const sample = await client.query('SELECT * FROM notifications LIMIT 3');
      console.log('\n📋 Sample notifications:');
      sample.rows.forEach((row, i) => {
        console.log(`  ${i + 1}. ID: ${row.id}, Message: ${row.message}, User ID: ${row.user_id || 'NULL'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkNotificationsTable(); 
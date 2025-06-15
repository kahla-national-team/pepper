const { sequelize } = require('../config/database');
const path = require('path');
const fs = require('fs');

async function runMigration() {
  try {
    // Get the migration file
    const migrationFile = path.join(__dirname, '../migrations/20240320000000_update_notifications_table.js');
    
    if (!fs.existsSync(migrationFile)) {
      console.error('Migration file not found:', migrationFile);
      process.exit(1);
    }

    // Import the migration
    const migration = require(migrationFile);

    console.log('Starting migration...');
    
    // Run the migration
    await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 
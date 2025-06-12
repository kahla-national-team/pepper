const { appPool } = require('../config/database');

async function addTotalAmountToBookings() {
  try {
    // Check if the column already exists
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' AND column_name = 'total_amount';
    `;
    
    const checkResult = await appPool.query(checkQuery);
    
    if (checkResult.rows.length === 0) {
      // Add the total_amount column
      const alterQuery = `
        ALTER TABLE bookings 
        ADD COLUMN total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;
      `;
      
      await appPool.query(alterQuery);
      console.log('total_amount column added to bookings table successfully');
    } else {
      console.log('total_amount column already exists in bookings table');
    }
  } catch (error) {
    console.error('Error adding total_amount column to bookings table:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addTotalAmountToBookings()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addTotalAmountToBookings; 
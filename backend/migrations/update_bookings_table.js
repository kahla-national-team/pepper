const { appPool } = require('../config/database');

async function updateBookingsTable() {
  try {
    console.log('Checking and updating bookings table...');
    
    // List of columns that should exist in the bookings table
    const requiredColumns = [
      { name: 'total_amount', type: 'DECIMAL(10,2) NOT NULL DEFAULT 0.00' },
      { name: 'payment_intent_id', type: 'VARCHAR(255)' },
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
    ];
    
    for (const column of requiredColumns) {
      // Check if the column exists
      const checkQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = $1;
      `;
      
      const checkResult = await appPool.query(checkQuery, [column.name]);
      
      if (checkResult.rows.length === 0) {
        // Add the missing column
        const alterQuery = `
          ALTER TABLE bookings 
          ADD COLUMN ${column.name} ${column.type};
        `;
        
        await appPool.query(alterQuery);
        console.log(`Column ${column.name} added to bookings table successfully`);
      } else {
        console.log(`Column ${column.name} already exists in bookings table`);
      }
    }
    
    // Check if payment_id column exists and add it if needed (without foreign key constraint for now)
    const checkPaymentIdQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' AND column_name = 'payment_id';
    `;
    
    const paymentIdResult = await appPool.query(checkPaymentIdQuery);
    
    if (paymentIdResult.rows.length === 0) {
      // Add payment_id column without foreign key constraint to avoid issues
      const addPaymentIdQuery = `
        ALTER TABLE bookings 
        ADD COLUMN payment_id INTEGER;
      `;
      
      await appPool.query(addPaymentIdQuery);
      console.log('Column payment_id added to bookings table successfully');
    } else {
      console.log('Column payment_id already exists in bookings table');
    }
    
    // Create booking_services table if it doesn't exist
    const createBookingServicesQuery = `
      CREATE TABLE IF NOT EXISTS booking_services (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES concierge_services(id) ON DELETE CASCADE,
        service_name VARCHAR(255) NOT NULL,
        service_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await appPool.query(createBookingServicesQuery);
    console.log('booking_services table created/verified successfully');
    
    console.log('All database updates completed successfully!');
  } catch (error) {
    console.error('Error updating bookings table:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  updateBookingsTable()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = updateBookingsTable; 
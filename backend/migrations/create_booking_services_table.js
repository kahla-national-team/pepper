const { appPool } = require('../config/database');

async function createBookingServicesTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS booking_services (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES concierge_services(id) ON DELETE CASCADE,
        service_name VARCHAR(255) NOT NULL,
        service_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await appPool.query(query);
    console.log('booking_services table created successfully');
  } catch (error) {
    console.error('Error creating booking_services table:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  createBookingServicesTable()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = createBookingServicesTable; 
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butler',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

async function checkServiceRequests() {
  try {
    console.log('Checking service_requests table...');
    
    // Check service requests
    const serviceRequestsResult = await pool.query(
      'SELECT id, user_id, service_id, requested_date, status FROM service_requests ORDER BY id'
    );
    
    console.log('Service Requests:');
    console.log('Total count:', serviceRequestsResult.rows.length);
    if (serviceRequestsResult.rows.length > 0) {
      console.log('Available IDs:', serviceRequestsResult.rows.map(r => r.id).join(', '));
      console.log('Sample records:');
      serviceRequestsResult.rows.forEach(row => {
        console.log(`  ID: ${row.id}, User: ${row.user_id}, Service: ${row.service_id}, Date: ${row.requested_date}, Status: ${row.status}`);
      });
    } else {
      console.log('No service requests found');
    }
    
    // Check bookings
    const bookingsResult = await pool.query(
      'SELECT id, user_id, rental_id, start_date, status FROM bookings ORDER BY id'
    );
    
    console.log('\nBookings:');
    console.log('Total count:', bookingsResult.rows.length);
    if (bookingsResult.rows.length > 0) {
      console.log('Available IDs:', bookingsResult.rows.map(r => r.id).join(', '));
      console.log('Sample records:');
      bookingsResult.rows.forEach(row => {
        console.log(`  ID: ${row.id}, User: ${row.user_id}, Rental: ${row.rental_id}, Start: ${row.start_date}, Status: ${row.status}`);
      });
    } else {
      console.log('No bookings found');
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await pool.end();
  }
}

checkServiceRequests(); 
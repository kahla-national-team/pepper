const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butlerdb',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

const sampleRentals = [
  {
    owner_id: 1,
    title: 'Cozy Apartment in Oran',
    description: 'Beautiful 2-bedroom apartment with sea view in the heart of Oran',
    address: '123 Rue de la Mer, Oran',
    city: 'Oran',
    price: 150,
    max_guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    rating: 4.5,
    reviews: 25,
    image: '/apartment1.jpg',
    latitude: 35.6971,
    longitude: -0.6337,
    amenities: JSON.stringify(['wifi', 'kitchen', 'ac', 'tv']),
    room_type: 'apartment',
    available_dates: JSON.stringify(['2024-01-01', '2024-12-31']),
    renting_term: 'short',
    is_active: true,
    is_available: true
  },
  {
    owner_id: 1,
    title: 'Luxury Villa in Algiers',
    description: 'Stunning 3-bedroom villa with private pool and garden',
    address: '456 Avenue des Palmiers, Algiers',
    city: 'Algiers',
    price: 300,
    max_guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    rating: 4.8,
    reviews: 42,
    image: '/villa1.jpg',
    latitude: 36.7538,
    longitude: 3.0588,
    amenities: JSON.stringify(['wifi', 'kitchen', 'pool', 'parking', 'ac']),
    room_type: 'villa',
    available_dates: JSON.stringify(['2024-01-01', '2024-12-31']),
    renting_term: 'long',
    is_active: true,
    is_available: true
  },
  {
    owner_id: 2,
    title: 'Modern Studio in Constantine',
    description: 'Contemporary studio apartment perfect for solo travelers',
    address: '789 Boulevard Central, Constantine',
    city: 'Constantine',
    price: 80,
    max_guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    rating: 4.2,
    reviews: 18,
    image: '/studio1.jpg',
    latitude: 36.3650,
    longitude: 6.6147,
    amenities: JSON.stringify(['wifi', 'kitchen', 'heating']),
    room_type: 'studio',
    available_dates: JSON.stringify(['2024-01-01', '2024-12-31']),
    renting_term: 'short',
    is_active: true,
    is_available: true
  }
];

async function seedData() {
  try {
    console.log('Starting to seed rental data...');
    
    // First, let's check if the rentals table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'rentals'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating rentals table...');
      await pool.query(`
        CREATE TABLE rentals (
          id SERIAL PRIMARY KEY,
          owner_id INTEGER NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          address VARCHAR(255),
          city VARCHAR(100),
          price DECIMAL(10,2) NOT NULL,
          max_guests INTEGER DEFAULT 1,
          bedrooms INTEGER DEFAULT 1,
          beds INTEGER DEFAULT 1,
          bathrooms INTEGER DEFAULT 1,
          rating DECIMAL(3,2) DEFAULT 0,
          reviews INTEGER DEFAULT 0,
          image VARCHAR(255),
          latitude DECIMAL(10,8),
          longitude DECIMAL(11,8),
          amenities JSONB,
          room_type VARCHAR(50),
          available_dates JSONB,
          renting_term VARCHAR(20),
          is_active BOOLEAN DEFAULT true,
          is_available BOOLEAN DEFAULT true,
          is_favorite BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }
    
    // Check if we already have data
    const existingData = await pool.query('SELECT COUNT(*) FROM rentals');
    if (parseInt(existingData.rows[0].count) > 0) {
      console.log('Rental data already exists, skipping seed...');
      return;
    }
    
    // Insert sample data
    for (const rental of sampleRentals) {
      const cols = Object.keys(rental);
      const vals = cols.map((_, i) => `$${i + 1}`);
      const values = Object.values(rental);
      
      const query = `
        INSERT INTO rentals (${cols.join(',')})
        VALUES (${vals.join(',')})
        RETURNING id
      `;
      
      const result = await pool.query(query, values);
      console.log(`Inserted rental: ${rental.title} (ID: ${result.rows[0].id})`);
    }
    
    console.log('Rental data seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

// Run the seed function
seedData(); 
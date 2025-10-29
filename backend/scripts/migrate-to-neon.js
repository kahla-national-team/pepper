require('dotenv').config();
const { Pool } = require('pg');

// Local database connection (no SSL for local)
const localPool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butler',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
  ssl: false
});

// Neon database connection
const neonPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateDatabase() {
  console.log('Starting database migration from local to Neon...');
  
  try {
    // Test connections
    await localPool.query('SELECT 1');
    console.log('✓ Local database connected');
    
    await neonPool.query('SELECT 1');
    console.log('✓ Neon database connected');
    
    // Get all tables from local database
    const tablesResult = await localPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`Found ${tables.length} tables: ${tables.join(', ')}`);
    
    // Create tables in Neon (using existing init-db.js logic)
    console.log('Creating tables in Neon...');
    await createTablesInNeon();
    
    // Copy data for each table
    for (const tableName of tables) {
      await copyTableData(tableName);
    }
    
    console.log('✓ Database migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await localPool.end();
    await neonPool.end();
  }
}

async function createTablesInNeon() {
  // Create custom types first
  await neonPool.query(`
    DO $$ BEGIN
      CREATE TYPE renting_term_type AS ENUM ('night_term', 'short_term', 'long_term');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE facture_type AS ENUM ('booking', 'service', 'other');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE facture_status AS ENUM ('draft', 'issued', 'paid', 'cancelled');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled', 'completed');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Create users table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      profile_image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create concierge_services table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS concierge_services (
      id serial NOT NULL,
      owner_id integer references users(id),
      name character varying(100) NOT NULL,
      category character varying(50) NOT NULL,
      description text,
      price numeric(10, 2) NOT NULL,
      duration_minutes integer,
      photo_url text,
      is_active boolean DEFAULT true,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now(),
      CONSTRAINT concierge_services_pkey PRIMARY KEY (id)
    );
  `);

  // Create rentals table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS rentals (
      id serial NOT NULL,
      owner_id integer references users(id),
      title character varying(150) NOT NULL,
      description text,
      address text NOT NULL,
      city character varying(100),
      price numeric(10, 2) NOT NULL,
      max_guests integer DEFAULT 1,
      bedrooms integer,
      beds integer,
      bathrooms integer,
      rating numeric(2, 1),
      reviews integer,
      image text,
      latitude numeric(9, 6),
      longitude numeric(9, 6),
      amenities text[],
      room_type character varying(50),
      available_dates jsonb,
      is_available boolean DEFAULT true,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now(),
      renting_term renting_term_type DEFAULT 'night_term'::renting_term_type,
      is_favorite boolean DEFAULT false,
      is_active boolean DEFAULT true,
      CONSTRAINT rentals_pkey PRIMARY KEY (id)
    );
  `);

  // Create bookings table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id serial PRIMARY KEY,
      user_id integer REFERENCES users(id),
      rental_id integer REFERENCES rentals(id) ON DELETE CASCADE,
      start_date date NOT NULL,
      end_date date NOT NULL,
      guests integer,
      total_amount numeric(10, 2) NOT NULL,
      status varchar(20) DEFAULT 'pending',
      payment_status varchar(20) DEFAULT 'pending',
      payment_intent_id varchar(255),
      payment_id integer,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );
  `);

  // Create booking_services table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS booking_services (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
      service_id INTEGER REFERENCES concierge_services(id) ON DELETE CASCADE,
      service_name VARCHAR(255) NOT NULL,
      service_price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create payments table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id serial PRIMARY KEY,
      booking_id integer,
      service_request_id integer,
      amount numeric(10, 2) NOT NULL,
      payment_method varchar(50),
      payment_status varchar(20) DEFAULT 'pending',
      transaction_id varchar(100),
      payment_intent_id varchar(255),
      paid_at timestamp with time zone,
      created_at timestamp with time zone DEFAULT now()
    );
  `);

  // Create service_requests table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS service_requests (
      id serial PRIMARY KEY,
      user_id integer REFERENCES users(id),
      service_id integer REFERENCES concierge_services(id) ON DELETE CASCADE,
      requested_date date NOT NULL,
      requested_time time,
      notes text,
      status varchar(20) DEFAULT 'pending',
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );
  `);

  // Create reviews table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rental_id INTEGER REFERENCES rentals(id) ON DELETE SET NULL,
      service_id INTEGER REFERENCES concierge_services(id) ON DELETE SET NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      reviewer_name varchar(255),
      reviewer_email varchar(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT check_review_target CHECK (
        (rental_id IS NOT NULL AND service_id IS NULL) OR 
        (rental_id IS NULL AND service_id IS NOT NULL)
      )
    );
  `);

  // Create factures table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS factures (
      id serial PRIMARY KEY,
      user_id integer REFERENCES users(id),
      booking_id integer REFERENCES bookings(id) ON DELETE SET NULL,
      service_request_id integer REFERENCES service_requests(id) ON DELETE SET NULL,
      payment_id integer REFERENCES payments(id) ON DELETE SET NULL,
      facture_number varchar(100) NOT NULL,
      total_amount numeric(10, 2) NOT NULL,
      tax_amount numeric(10, 2) DEFAULT 0,
      items_json jsonb,
      type facture_type NOT NULL,
      status facture_status DEFAULT 'draft',
      auto_generated boolean DEFAULT false,
      issued_date timestamp with time zone,
      due_date timestamp with time zone,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );
  `);

  // Create favorites table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      item_id INTEGER NOT NULL,
      item_type VARCHAR(10) CHECK (item_type IN ('stay', 'service')) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE (user_id, item_id, item_type)
    );
  `);

  // Create notifications table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      type VARCHAR(50) DEFAULT 'general',
      property_name VARCHAR(255),
      link VARCHAR(255),
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create messages table
  await neonPool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✓ All tables created in Neon');
}

async function copyTableData(tableName) {
  try {
    console.log(`Copying data for table: ${tableName}`);
    
    // Get all data from local table
    const localData = await localPool.query(`SELECT * FROM ${tableName}`);
    
    if (localData.rows.length === 0) {
      console.log(`  No data to copy for ${tableName}`);
      return;
    }
    
    // Get column names
    const columns = Object.keys(localData.rows[0]);
    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    
    // Clear existing data in Neon (optional - remove if you want to keep existing data)
    await neonPool.query(`DELETE FROM ${tableName}`);
    
    // Reset sequences for tables with SERIAL primary keys
    if (['users', 'rentals', 'bookings', 'booking_services', 'payments', 'service_requests', 'reviews', 'factures', 'favorites', 'notifications', 'messages'].includes(tableName)) {
      await neonPool.query(`SELECT setval('${tableName}_id_seq', 1, false)`);
    }
    
    // Insert data row by row
    for (const row of localData.rows) {
      const values = columns.map(col => row[col]);
      const query = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
      await neonPool.query(query, values);
    }
    
    console.log(`  ✓ Copied ${localData.rows.length} rows to ${tableName}`);
    
  } catch (error) {
    console.error(`  ✗ Error copying ${tableName}:`, error.message);
  }
}

// Run migration
migrateDatabase();

const { Pool } = require('pg');
const config = require('./config/config');
const User = require('./models/User');

async function initializeDatabase() {
  // Create a pool for the default postgres database
  const pool = new Pool({
    ...config.pgConfig,
    database: 'postgres' // Connect to default database first
  });

  try {
    // Create the database if it doesn't exist
    await pool.query(`CREATE DATABASE ${config.pgConfig.database}`);
    console.log(`Database ${config.pgConfig.database} created successfully`);
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`Database ${config.pgConfig.database} already exists`);
    } else {
      console.error('Error creating database:', error);
      process.exit(1);
    }
  } finally {
    await pool.end();
  }

  // Create a new pool for our application database
  const appPool = new Pool(config.pgConfig);
  const userModel = new User(appPool);

  try {
    // Create enum types first
    await appPool.query(`
      DO $$ BEGIN
        CREATE TYPE renting_term_type AS ENUM ('night_term', 'short_term', 'long_term');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
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
    `);

    // Create users table
    await userModel.createTable();
    console.log('Users table created successfully');

    // Create concierge services table
    await appPool.query(`
     CREATE TABLE IF NOT EXISTS concierge_services (
    id serial NOT NULL,
    owner_id integer references users(id),
    name character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    description text,
    price numeric(10, 2) NOT NULL,
    duration_minutes integer,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT concierge_services_pkey PRIMARY KEY (id)
);

    `);
    console.log('Concierge services table created successfully');

    // Create rentals table
    await appPool.query(`
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
    await
    console.log('Rentals table created successfully');

    // Create bookings table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id serial PRIMARY KEY,
        user_id integer REFERENCES users(id),
        rental_id integer REFERENCES rentals(id) ON DELETE CASCADE,
        start_date date NOT NULL,
        end_date date NOT NULL,
        guests integer,
        status booking_status DEFAULT 'pending',
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now()
      );
    `);

    // Create service requests table
    await appPool.query(`
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

    // Create payments table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id serial PRIMARY KEY,
        service_request_id integer REFERENCES service_requests(id) ON DELETE CASCADE,
        amount numeric(10, 2) NOT NULL,
        payment_method varchar(50),
        payment_status varchar(20) DEFAULT 'pending',
        transaction_id varchar(100),
        paid_at timestamp with time zone,
        created_at timestamp with time zone DEFAULT now()
      );
    `);

    // Create factures table
    await appPool.query(`
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

    // Create reviews table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id serial PRIMARY KEY,
        user_id integer REFERENCES users(id),
        booking_id integer REFERENCES bookings(id) ON DELETE SET NULL,
        service_request_id integer REFERENCES service_requests(id) ON DELETE SET NULL,
        rating integer NOT NULL,
        comment text,
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now()
      );
    `);

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  } finally {
    await appPool.end();
  }
}

initializeDatabase(); 
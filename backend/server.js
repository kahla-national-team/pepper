const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const conciergeRoutes = require('./routes/conciergeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();

const app = express();

// PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'butler',
  password: process.env.PG_PASSWORD || 'dembele',
  port: process.env.PG_PORT || 5432,
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Make pool available in app
app.locals.pool = pool;

// Run database migrations on startup
const updateBookingsTable = require('./migrations/update_bookings_table');

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/concierge', conciergeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res, next) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    console.log(`Server running on port ${PORT}`);
    
    // Run database migrations
    console.log('Running database migrations...');
    await updateBookingsTable();
    console.log('Database migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    console.log('Server started but migrations failed. Some features may not work properly.');
  }
});







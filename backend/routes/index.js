require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const router = express.Router();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Import route modules
const conciergeRoutes = require('./conciergeRoutes');
const rentalRoutes = require('./rentalRoutes');
const userRoutes = require('./userRoutes');
const bookingRoutes = require('./bookingRoutes');
const notificationRoutes = require('./notifications');

// Root route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Pepper API',
        endpoints: {
            concierge: '/api/concierge',
            rentals: '/api/rentals',
            users: '/api/users',
            bookings: '/api/bookings',
            notifications: '/api/notifications'
        }
    });
});

// Mount routes
router.use('/concierge', conciergeRoutes);
router.use('/rentals', rentalRoutes);
router.use('/users', userRoutes);
router.use('/bookings', bookingRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;

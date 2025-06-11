const express = require('express')
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Get all bookings for current user
router.get('/', auth, bookingController.getUserBookings);

// Get booking by ID
router.get('/:id', auth, bookingController.getBookingById);

// Create a new booking
router.post('/', auth, bookingController.create);

// Cancel a booking
router.post('/:id/cancel', auth, bookingController.cancel);

// Check availability
router.get('/check-availability', auth, bookingController.checkAvailability);

// Webhook route (no auth required as it's called by Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), bookingController.handleWebhook);

module.exports = router;

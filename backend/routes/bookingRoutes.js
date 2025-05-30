const express = require('express')
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings for the current user
router.get('/my-bookings', bookingController.getUserBookings);

// Get a specific booking
router.get('/:id', bookingController.getBooking);

// Update a booking
router.put('/:id', bookingController.updateBooking);

// Delete a booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;

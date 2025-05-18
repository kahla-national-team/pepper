const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all rentals
router.get('/', rentalController.getAllRentals);

// Get rental by ID
router.get('/:id', rentalController.getRentalById);

// Create new rental
router.post('/', rentalController.createRental);

// Update rental
router.put('/:id', rentalController.updateRental);

// Delete rental
router.delete('/:id', rentalController.deleteRental);

module.exports = router;


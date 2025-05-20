const express = require('express');
const router = express.Router();
const conciergeController = require('../controllers/conciergeController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming auth middleware exists

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create a new concierge service
router.post('/', conciergeController.createConcierge);

// Get all concierge services
router.get('/', conciergeController.getAllConcierge);

// Get a single concierge service
router.get('/:id', conciergeController.getConciergeById);

// Update a concierge service
router.put('/:id', conciergeController.updateConcierge);

// Delete a concierge service
router.delete('/:id', conciergeController.deleteConcierge);

module.exports = router;
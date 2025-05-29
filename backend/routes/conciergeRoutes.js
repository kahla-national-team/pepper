const express = require('express');
const router = express.Router();
const conciergeController = require('../controllers/conciergeController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Create a new concierge service
router.post('/', conciergeController.createService);

// Get all services for the authenticated owner
router.get('/my-services', conciergeController.getOwnerServices);

// Update a service
router.put('/:id', conciergeController.updateService);

// Delete a service
router.delete('/:id', conciergeController.deleteService);

module.exports = router;
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const auth = require('../middleware/auth');

// All routes are protected and require authentication
router.use(auth);

// Create a new property
router.post('/', propertyController.createProperty);

// Get all properties for the current user
router.get('/my-properties', propertyController.getUserProperties);

// Get a specific property
router.get('/:id', propertyController.getProperty);

// Update a property
router.put('/:id', propertyController.updateProperty);

// Delete a property
router.delete('/:id', propertyController.deleteProperty);

module.exports = router; 
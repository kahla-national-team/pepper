const express = require('express');
const router = express.Router();
const conciergeController = require('../controllers/conciergeController');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// All routes require authentication
router.use(auth);

// Create a new concierge service with photo upload
router.post('/', upload.single('photo'), conciergeController.createService);

// Get all services for the authenticated owner
router.get('/my-services', conciergeController.getOwnerServices);

// Get services by user ID
router.get('/user/:userId', conciergeController.getServicesByUserId);

// Get all active concierge services
router.get('/all', conciergeController.getAllServices);

// Get service details by ID
router.get('/:id', conciergeController.getServiceById);

// Update a service with optional photo upload
router.put('/:id', upload.single('photo'), conciergeController.updateService);

// Delete a service
router.delete('/:id', conciergeController.deleteService);

module.exports = router;
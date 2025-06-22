const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const auth = require('../middleware/auth');

// All routes are protected and require authentication
router.use(auth);

// Create a new property with file upload
router.post('/', (req, res, next) => {
  const upload = req.app.locals.upload;
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ message: 'Error uploading file', error: err.message });
    }
    // Add the uploaded file URL to the request body
    if (req.file) {
      req.body.image = req.file.path;
    }
    next();
  });
}, propertyController.createProperty);

// Get all properties for the current user
router.get('/my-properties', propertyController.getUserProperties);

// Get a specific property
router.get('/:id', propertyController.getProperty);

// Update a property with file upload, validation, and robust error handling
router.put('/:id', (req, res, next) => {
  const upload = req.app.locals.upload;
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ message: 'Error uploading file', error: err.message });
    }
    if (req.file) {
      req.body.image = req.file.path;
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("Incoming PUT request to update property:", req.params.id);
    console.log("Update data:", req.body);

    // Validate required fields
    const requiredFields = ['title', 'address', 'city', 'price', 'room_type'];
    const missing = requiredFields.filter(f => !req.body[f]);
    if (missing.length) {
      return res.status(400).json({ message: 'Missing required fields: ' + missing.join(', ') });
    }

    // Use the Property model (raw SQL version)
    const Property = require('../models/Property');
    const propertyModel = new Property(req.app.locals.pool);
    const property = await propertyModel.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Update property
    const updated = await propertyModel.update(req.params.id, req.body);
    res.status(200).json({ message: 'Property updated successfully', property: updated });
  } catch (error) {
    console.error("Update error:", error);
    if (error.name === 'SequelizeValidationError' && error.errors) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error during update', error: error.message });
  }
});

// Delete a property
router.delete('/:id', propertyController.deleteProperty);

module.exports = router; 
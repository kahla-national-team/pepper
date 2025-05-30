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

// Update a property
router.put('/:id', propertyController.updateProperty);

// Delete a property
router.delete('/:id', propertyController.deleteProperty);

module.exports = router; 
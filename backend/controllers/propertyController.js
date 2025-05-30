const Property = require('../models/Property');

const propertyController = {
  // Create a new property
  createProperty: async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      // Validate required fields
      const requiredFields = ['title', 'address', 'city', 'price', 'room_type'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: 'Missing required fields',
          fields: missingFields
        });
      }

      // Prepare property data
      const propertyData = {
        ...req.body,
        owner_id: req.user.id, // Get owner_id from authenticated user
        image: req.file ? req.file.path : null // Get image URL from Cloudinary
      };

      console.log('Creating property with data:', propertyData);

      // Parse amenities if it's a string (from FormData)
      if (typeof propertyData.amenities === 'string') {
        try {
          propertyData.amenities = JSON.parse(propertyData.amenities);
        } catch (e) {
          console.error('Error parsing amenities:', e);
          propertyData.amenities = [];
        }
      }

      // Convert numeric fields
      const numericFields = ['price', 'max_guests', 'bedrooms', 'beds', 'bathrooms', 'latitude', 'longitude'];
      numericFields.forEach(field => {
        if (propertyData[field] !== undefined && propertyData[field] !== '') {
          propertyData[field] = Number(propertyData[field]);
        }
      });

      const propertyModel = new Property(req.app.locals.pool);
      const property = await propertyModel.create(propertyData);
      
      console.log('Property created successfully:', property);
      res.status(201).json({
        message: 'Property created successfully',
        property
      });
    } catch (error) {
      console.error('Error creating property:', error);
      // Log the full error stack for debugging
      console.error('Error stack:', error.stack);
      
      // Send a more detailed error response
      res.status(500).json({
        message: 'Error creating property',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Get a property by ID
  getProperty: async (req, res) => {
    try {
      const propertyModel = new Property(req.app.locals.pool);
      const property = await propertyModel.findById(req.params.id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching property',
        error: error.message
      });
    }
  },

  // Get all properties for the current user
  getUserProperties: async (req, res) => {
    try {
      const propertyModel = new Property(req.app.locals.pool);
      const properties = await propertyModel.findByOwnerId(req.user.id);
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching properties',
        error: error.message
      });
    }
  },

  // Update a property
  updateProperty: async (req, res) => {
    try {
      const propertyModel = new Property(req.app.locals.pool);
      const property = await propertyModel.update(req.params.id, req.body);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json({
        message: 'Property updated successfully',
        property
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating property',
        error: error.message
      });
    }
  },

  // Delete a property
  deleteProperty: async (req, res) => {
    try {
      const propertyModel = new Property(req.app.locals.pool);
      const property = await propertyModel.delete(req.params.id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json({
        message: 'Property deleted successfully',
        property
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting property',
        error: error.message
      });
    }
  }
};

module.exports = propertyController; 
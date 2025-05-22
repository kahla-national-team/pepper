const Property = require('../models/Property');

const propertyController = {
  // Create a new property
  createProperty: async (req, res) => {
    try {
      console.log('Creating property:', req.body);
      const propertyData = {
        ...req.body,
        owner_id: req.user.id // Get owner_id from authenticated user
      };

      const propertyModel = new Property(req.app.locals.pool);
      const property = await propertyModel.create(propertyData);
      
      console.log('Property created successfully:', property);
      res.status(201).json({
        message: 'Property created successfully',
        property
      });
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({
        message: 'Error creating property',
        error: error.message
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
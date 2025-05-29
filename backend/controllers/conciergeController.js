const { appPool } = require('../config/database');

const conciergeController = {
  // Create a new concierge service
  createService: async (req, res) => {
    const { name, category, description, price, duration_minutes } = req.body;
    const owner_id = req.user.id; // Assuming user is authenticated and req.user is set by auth middleware

    try {
      const result = await appPool.query(
        `INSERT INTO concierge_services 
        (owner_id, name, category, description, price, duration_minutes) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [owner_id, name, category, description, price, duration_minutes]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0],
        message: 'Concierge service created successfully'
      });
    } catch (error) {
      console.error('Error creating concierge service:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating concierge service',
        error: error.message
      });
    }
  },

  // Get all services for a specific owner
  getOwnerServices: async (req, res) => {
    const owner_id = req.user.id;

    try {
      const result = await appPool.query(
        'SELECT * FROM concierge_services WHERE owner_id = $1 ORDER BY created_at DESC',
        [owner_id]
      );

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching concierge services:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching concierge services',
        error: error.message
      });
    }
  },

  // Update a service
  updateService: async (req, res) => {
    const { id } = req.params;
    const { name, category, description, price, duration_minutes, is_active } = req.body;
    const owner_id = req.user.id;

    try {
      // First check if the service belongs to the owner
      const checkResult = await appPool.query(
        'SELECT * FROM concierge_services WHERE id = $1 AND owner_id = $2',
        [id, owner_id]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found or unauthorized'
        });
      }

      const result = await appPool.query(
        `UPDATE concierge_services 
        SET name = $1, category = $2, description = $3, price = $4, 
            duration_minutes = $5, is_active = $6, updated_at = NOW()
        WHERE id = $7 AND owner_id = $8
        RETURNING *`,
        [name, category, description, price, duration_minutes, is_active, id, owner_id]
      );

      res.status(200).json({
        success: true,
        data: result.rows[0],
        message: 'Service updated successfully'
      });
    } catch (error) {
      console.error('Error updating concierge service:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating concierge service',
        error: error.message
      });
    }
  },

  // Delete a service
  deleteService: async (req, res) => {
    const { id } = req.params;
    const owner_id = req.user.id;

    try {
      const result = await appPool.query(
        'DELETE FROM concierge_services WHERE id = $1 AND owner_id = $2 RETURNING *',
        [id, owner_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found or unauthorized'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting concierge service:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting concierge service',
        error: error.message
      });
    }
  }
};

module.exports = conciergeController;
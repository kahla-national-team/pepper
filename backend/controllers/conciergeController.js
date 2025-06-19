const { cloudinary } = require('../config/cloudinary');

const conciergeController = {
  // Create a new concierge service
  createService: async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { name, category, description, price, duration_minutes } = req.body;
    const owner_id = req.user.id;
    const photo_url = req.file ? req.file.path : null;

    if (!name || !category || !price) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
      const result = await req.app.locals.pool.query(
        `INSERT INTO concierge_services 
        (owner_id, name, category, description, price, duration_minutes, photo_url, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
        RETURNING *`,
        [owner_id, name, category, description, price, duration_minutes, photo_url]
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
      const result = await req.app.locals.pool.query(
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

  // Remaining functions stay unchanged...

};

module.exports = conciergeController;

const { appPool } = require('../config/database');
const { cloudinary } = require('../config/cloudinary');

const conciergeController = {
// Create a new concierge service
  createService: async (req, res) => {
    const { name, category, description, price, duration_minutes } = req.body;
    const owner_id = req.user.id;
    const photo_url = req.file ? req.file.path : null;

    try {
      const result = await appPool.query(
        `INSERT INTO concierge_services 
        (owner_id, name, category, description, price, duration_minutes, photo_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
        [owner_id, name, category, description, price, duration_minutes, photo_url]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0],
        message: 'Concierge service created successfully'
      });
    } catch (error) {
      // If there was an error and we uploaded a file, delete it from Cloudinary
      if (photo_url) {
        try {
          await cloudinary.uploader.destroy(photo_url.split('/').pop().split('.')[0]);
        } catch (deleteError) {
          console.error('Error deleting uploaded file:', deleteError);
        }
      }

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
    const photo_url = req.file ? req.file.path : undefined;

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

      // If there's a new photo and an old photo, delete the old one
      if (photo_url && checkResult.rows[0].photo_url) {
        try {
          const oldPhotoPublicId = checkResult.rows[0].photo_url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(oldPhotoPublicId);
        } catch (deleteError) {
          console.error('Error deleting old photo:', deleteError);
        }
      }

      const updateFields = [];
      const values = [];
      let paramCount = 1;

      // Build dynamic update query
      if (name) {
        updateFields.push(`name = $${paramCount}`);
        values.push(name);
        paramCount++;
      }
      if (category) {
        updateFields.push(`category = $${paramCount}`);
        values.push(category);
        paramCount++;
      }
      if (description) {
        updateFields.push(`description = $${paramCount}`);
        values.push(description);
        paramCount++;
      }
      if (price) {
        updateFields.push(`price = $${paramCount}`);
        values.push(price);
        paramCount++;
      }
      if (duration_minutes) {
        updateFields.push(`duration_minutes = $${paramCount}`);
        values.push(duration_minutes);
        paramCount++;
      }
      if (is_active !== undefined) {
        updateFields.push(`is_active = $${paramCount}`);
        values.push(is_active);
        paramCount++;
      }
      if (photo_url) {
        updateFields.push(`photo_url = $${paramCount}`);
        values.push(photo_url);
        paramCount++;
      }

      updateFields.push(`updated_at = NOW()`);
      values.push(id, owner_id);

      const query = `
        UPDATE concierge_services 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount} AND owner_id = $${paramCount + 1}
        RETURNING *
      `;

      const result = await appPool.query(query, values);

      res.status(200).json({
        success: true,
        data: result.rows[0],
        message: 'Service updated successfully'
      });
    } catch (error) {
      // If there was an error and we uploaded a new file, delete it
      if (photo_url) {
        try {
          await cloudinary.uploader.destroy(photo_url.split('/').pop().split('.')[0]);
        } catch (deleteError) {
          console.error('Error deleting uploaded file:', deleteError);
        }
      }

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
      // First get the service to check ownership and get photo_url
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

      // If there's a photo, delete it from Cloudinary
      if (checkResult.rows[0].photo_url) {
        try {
          const photoPublicId = checkResult.rows[0].photo_url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(photoPublicId);
        } catch (deleteError) {
          console.error('Error deleting photo from Cloudinary:', deleteError);
        }
      }

      const result = await appPool.query(
        'DELETE FROM concierge_services WHERE id = $1 AND owner_id = $2 RETURNING *',
        [id, owner_id]
      );

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
  },

  // Get services by user ID
  getServicesByUserId: async (req, res) => {
    const { userId } = req.params;

    try {
      const result = await appPool.query(
        `SELECT 
          cs.*,
          u.username as provider_name,
          COUNT(DISTINCT sr.id) as bookings
        FROM concierge_services cs
        LEFT JOIN users u ON cs.owner_id = u.id
        LEFT JOIN service_requests sr ON cs.id = sr.service_id
        WHERE cs.owner_id = $1
        GROUP BY cs.id, u.username
        ORDER BY cs.created_at DESC`,
        [userId]
      );

      res.status(200).json({
        success: true,
        data: result.rows.map(service => ({
          ...service,
          rating: 0, // Default rating since we don't have ratings yet
          bookings: parseInt(service.bookings) || 0,
          provider: {
            name: service.provider_name || 'Service Provider',
            image: '/placeholder-avatar.png' // Using a default placeholder image
          }
        }))
      });
    } catch (error) {
      console.error('Error fetching user services:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user services',
        error: error.message
      });
    }
  },
};

module.exports = conciergeController;
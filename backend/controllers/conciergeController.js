const { cloudinary } = require('../config/cloudinary');

const conciergeController = {
// Create a new concierge service
  createService: async (req, res) => {
    const { name, category, description, price, duration_minutes } = req.body;
    const owner_id = req.user.id;
    const photo_url = req.file ? req.file.path : null;

    try {
      const result = await req.app.locals.pool.query(
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

  // Update a service
  updateService: async (req, res) => {
    const { id } = req.params;
    const { name, category, description, price, duration_minutes, is_active } = req.body;
    const owner_id = req.user.id;
    const photo_url = req.file ? req.file.path : undefined;

    try {
      // First check if the service belongs to the owner
      const checkResult = await req.app.locals.pool.query(
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

      const result = await req.app.locals.pool.query(query, values);

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
      const checkResult = await req.app.locals.pool.query(
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

      const result = await req.app.locals.pool.query(
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
    console.log('Getting services for user:', userId);

    try {
      const result = await req.app.locals.pool.query(
        `SELECT 
          cs.*,
          u.username as provider_name,
          u.profile_image as provider_image,
          COUNT(DISTINCT sr.id) as bookings
        FROM concierge_services cs
        LEFT JOIN users u ON cs.owner_id = u.id
        LEFT JOIN service_requests sr ON cs.id = sr.service_id
        WHERE cs.owner_id = $1
        GROUP BY cs.id, u.username, u.profile_image
        ORDER BY cs.created_at DESC`,
        [userId]
      );

      console.log('Raw database result:', result.rows);

      const mappedData = result.rows.map(service => ({
        ...service,
        rating: 0, // Default rating since we don't have ratings yet
        bookings: parseInt(service.bookings) || 0,
        provider: {
          name: service.provider_name || 'Service Provider',
          image: service.provider_image || '/placeholder-avatar.png' // Use user's profile image or fallback
        }
      }));

      console.log('Mapped service data:', mappedData);

      res.status(200).json({
        success: true,
        data: mappedData
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

  // Get all active concierge services
  getAllServices: async (req, res) => {
    try {
      const result = await req.app.locals.pool.query(
        `SELECT 
          cs.*,
          u.username as provider_name,
          u.profile_image as provider_image,
          COUNT(DISTINCT sr.id) as bookings
        FROM concierge_services cs
        LEFT JOIN users u ON cs.owner_id = u.id
        LEFT JOIN service_requests sr ON cs.id = sr.service_id
        WHERE cs.is_active = true
        GROUP BY cs.id, u.username, u.profile_image
        ORDER BY cs.created_at DESC`
      );

      res.status(200).json({
        success: true,
        data: result.rows.map(service => ({
          id: service.id,
          type: 'concierge',
          title: service.name,
          description: service.description,
          price: `$${service.price}/hour`,
          category: service.category,
          duration: service.duration_minutes,
          image: service.photo_url || '/placeholder-service.jpg',
          provider: {
            name: service.provider_name || 'Service Provider',
            rating: 0, // Default rating since we don't have ratings yet
            reviewCount: parseInt(service.bookings) || 0,
            image: service.provider_image || '/placeholder-avatar.png' // Use user's profile image or fallback
          }
        }))
      });
    } catch (error) {
      console.error('Error fetching all concierge services:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching concierge services',
        error: error.message
      });
    }
  },

  // Get service by ID with detailed information
  getServiceById: async (req, res) => {
    const { id } = req.params;
    console.log('Getting detailed service info for ID:', id);

    try {
      const result = await req.app.locals.pool.query(
        `SELECT 
          cs.*,
          u.username as provider_name,
          u.profile_image as provider_image,
          u.email as provider_email,
          COUNT(DISTINCT sr.id) as bookings,
          json_agg(DISTINCT jsonb_build_object(
            'id', sr.id,
            'date', sr.requested_date,
            'status', sr.status
          )) FILTER (WHERE sr.id IS NOT NULL) as bookings_list
        FROM concierge_services cs
        LEFT JOIN users u ON cs.owner_id = u.id
        LEFT JOIN service_requests sr ON cs.id = sr.service_id
        WHERE cs.id = $1 AND cs.is_active = true
        GROUP BY cs.id, u.username, u.profile_image, u.email`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      const service = result.rows[0];
      
      // Process bookings to get availability
      const bookings = service.bookings_list || [];
      const bookedDates = bookings
        .filter(booking => booking.status === 'confirmed')
        .map(booking => booking.date);

      // Format the response
      const formattedService = {
        id: service.id,
        type: 'concierge',
        title: service.name,
        description: service.description,
        price: `$${service.price}/hour`,
        category: service.category,
        duration: service.duration_minutes,
        image: service.photo_url || '/placeholder-service.jpg',
        location: {
          address: service.address || 'Available in your location',
          coordinates: service.coordinates || null
        },
        availability: {
          bookedDates: bookedDates,
          maxBookingsPerDay: 3 // You can make this configurable
        },
        provider: {
          name: service.provider_name || 'Service Provider',
          rating: 0, // Default rating since we don't have ratings yet
          reviewCount: parseInt(service.bookings) || 0,
          image: service.provider_image || '/placeholder-avatar.png',
          email: service.provider_email
        },
        features: [
          'Professional service',
          'Flexible scheduling',
          'Quality guaranteed',
          service.category === 'Cleaning' ? 'Eco-friendly products' : null,
          service.category === 'Transportation' ? 'Licensed driver' : null,
          service.category === 'Security' ? 'Background checked' : null
        ].filter(Boolean), // Remove null values
        details: service.description || 'Professional service with attention to detail.',
        createdAt: service.created_at,
        updatedAt: service.updated_at
      };

      console.log('Formatted service data:', formattedService);

      res.status(200).json({
        success: true,
        data: formattedService
      });
    } catch (error) {
      console.error('Error fetching service details:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching service details',
        error: error.message
      });
    }
  },

  // Get all services for a specific user
  getUserServices: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await req.app.locals.pool.query(
        'SELECT * FROM concierge_services WHERE owner_id = $1 AND is_active = true ORDER BY created_at DESC',
        [id]
      );

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching user concierge services:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user concierge services',
        error: error.message
      });
    }
  },
};

module.exports = conciergeController;
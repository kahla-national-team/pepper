const { cloudinary } = require('../config/cloudinary');

const conciergeController = {
  // Create a new concierge service
  createService: async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { name, category, description, price, duration_minutes } = req.body;
    const owner_id = req.user.id;
    // Use Cloudinary secure_url
    const photo_url = req.file && req.file.path ? req.file.path : (req.file && req.file.secure_url ? req.file.secure_url : null);

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
        data: result.rows.map(addBaseUrlToPhotoUrl)
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

  // Get all active concierge services (public route)
  getAllServices: async (req, res) => {
    try {
      const query = `
        SELECT 
          cs.*,
          u.id as provider_id,
          u.full_name as provider_name,
          u.username as provider_username,
          u.profile_image as provider_image,
          COALESCE(rev.avg_rating, 0) as provider_rating,
          COALESCE(rev.review_count, 0) as provider_review_count
        FROM 
          concierge_services cs
        JOIN 
          users u ON cs.owner_id = u.id
        LEFT JOIN 
          (SELECT 
             service_id, 
             AVG(rating) as avg_rating, 
             COUNT(id) as review_count 
           FROM reviews 
           WHERE service_id IS NOT NULL
           GROUP BY service_id) rev ON cs.id = rev.service_id
        WHERE 
          cs.is_active = true 
        ORDER BY 
          cs.created_at DESC
      `;
      
      const result = await req.app.locals.pool.query(query);
      
      // Transform the data to include provider information
      const servicesWithProvider = result.rows.map(row => ({
        ...row,
        provider: {
          id: row.provider_id,
          name: row.provider_name,
          username: row.provider_username,
          image: row.provider_image,
          rating: parseFloat(row.provider_rating),
          reviewCount: parseInt(row.provider_review_count, 10),
        }
      }));
      
      res.status(200).json({
        success: true,
        data: servicesWithProvider.map(addBaseUrlToPhotoUrl)
      });
    } catch (error) {
      console.error('Error fetching all concierge services:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching all concierge services',
        error: error.message
      });
    }
  },

  // Get all services for a specific user
  getUserServices: async (req, res) => {
    const user_id = req.params.id;
    try {
      const result = await req.app.locals.pool.query(
        'SELECT * FROM concierge_services WHERE owner_id = $1 ORDER BY created_at DESC',
        [user_id]
      );
      res.status(200).json({
        success: true,
        data: result.rows.map(addBaseUrlToPhotoUrl)
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

  // Get service details by ID
  getServiceById: async (req, res) => {
    const service_id = req.params.id;
    try {
      const query = `
        SELECT 
          cs.id,
          cs.name,
          cs.category,
          cs.description,
          cs.price,
          cs.duration_minutes,
          p.id as provider_id,
          p.full_name as provider_name,
          p.email as provider_email,
          p.profile_image as provider_image,
          COALESCE(rev.avg_rating, 0) as provider_rating,
          COALESCE(rev.review_count, 0) as provider_review_count
        FROM 
          concierge_services cs
        JOIN 
          users p ON cs.owner_id = p.id
        LEFT JOIN 
          (SELECT 
             service_id, 
             AVG(rating) as avg_rating, 
             COUNT(id) as review_count 
           FROM reviews 
           WHERE service_id IS NOT NULL
           GROUP BY service_id) rev ON cs.id = rev.service_id
        WHERE 
          cs.id = $1;
      `;
      const result = await req.app.locals.pool.query(query, [service_id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      const service = result.rows[0];

      // We need to manually construct the photo_url for the service image
      // Assuming it's based on service id, this is a placeholder
      // You might need to adjust this logic based on how your images are stored and served
      const imageUrl = `/uploads/concierge/photo-${service.id}.jpg`; // Example

      const serviceResponse = {
        id: service.id,
        title: service.name,
        category: service.category,
        details: service.description,
        price: service.price,
        duration: service.duration_minutes,
        image: imageUrl, // Use the constructed URL
        // The following fields do not exist in the database, so they are removed.
        // features: [], 
        // availability: null,
        // location: null, 
        provider: {
          id: service.provider_id,
          name: service.provider_name,
          email: service.provider_email,
          image: service.provider_image, // This comes from the users table
          rating: parseFloat(service.provider_rating),
          reviewCount: parseInt(service.provider_review_count, 10),
        },
      };

      res.status(200).json({
        success: true,
        data: addBaseUrlToPhotoUrl(serviceResponse) 
      });
    } catch (error) {
      console.error('Error fetching concierge service by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching concierge service by ID',
        error: error.message
      });
    }
  },

  // Update a service with optional photo upload
  updateService: async (req, res) => {
    const service_id = req.params.id;
    const { name, category, description, price, duration_minutes, is_active } = req.body;
    // Use Cloudinary secure_url
    let photo_url = req.file && req.file.path ? req.file.path : (req.file && req.file.secure_url ? req.file.secure_url : undefined);
    try {
      // Build dynamic update query
      let fields = [];
      let values = [];
      let idx = 1;
      if (name) { fields.push(`name = $${idx++}`); values.push(name); }
      if (category) { fields.push(`category = $${idx++}`); values.push(category); }
      if (description) { fields.push(`description = $${idx++}`); values.push(description); }
      if (price) { fields.push(`price = $${idx++}`); values.push(price); }
      if (duration_minutes) { fields.push(`duration_minutes = $${idx++}`); values.push(duration_minutes); }
      if (typeof is_active !== 'undefined') { fields.push(`is_active = $${idx++}`); values.push(is_active); }
      if (photo_url) { fields.push(`photo_url = $${idx++}`); values.push(photo_url); }
      if (fields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields to update' });
      }
      values.push(service_id);
      const query = `UPDATE concierge_services SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
      const result = await req.app.locals.pool.query(query, values);
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
    const service_id = req.params.id;
    try {
      await req.app.locals.pool.query('DELETE FROM concierge_services WHERE id = $1', [service_id]);
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

};

// Helper to prepend base URL to photo_url if needed
function addBaseUrlToPhotoUrl(service) {
  if (service && service.photo_url && service.photo_url.startsWith('/')) {
    service.photo_url = `http://localhost:5000${service.photo_url}`;
  }
  return service;
}

module.exports = conciergeController;

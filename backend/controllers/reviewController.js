const { cloudinary } = require('../config/cloudinary');

const reviewController = {
  // Get all reviews for a specific user
  getUserReviews: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid user ID is required'
        });
      }

      const result = await req.app.locals.pool.query(
        `SELECT r.*, u.full_name as user_name, u.profile_image as user_image
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC`,
        [parseInt(userId)]
      );
      
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch user reviews',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get average rating for a user
  getUserAverageRating: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid user ID is required'
        });
      }

      const result = await req.app.locals.pool.query(
        `SELECT COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as total_reviews
         FROM reviews
         WHERE user_id = $1`,
        [parseInt(userId)]
      );
      
      res.json({ 
        success: true, 
        data: { 
          averageRating: parseFloat(result.rows[0].average_rating),
          totalReviews: parseInt(result.rows[0].total_reviews)
        } 
      });
    } catch (error) {
      console.error('Error fetching user rating:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch user rating',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get reviews for a specific rental
  getRentalReviews: async (req, res) => {
    try {
      const { rentalId } = req.params;
      
      if (!rentalId || isNaN(parseInt(rentalId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid rental ID is required'
        });
      }

      const result = await req.app.locals.pool.query(
        `SELECT r.*, u.full_name as user_name, u.profile_image as user_image
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.rental_id = $1
         ORDER BY r.created_at DESC`,
        [parseInt(rentalId)]
      );
      
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching rental reviews:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch rental reviews',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get reviews for a specific service
  getServiceReviews: async (req, res) => {
    try {
      const { serviceId } = req.params;
      
      if (!serviceId || isNaN(parseInt(serviceId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid service ID is required'
        });
      }

      const result = await req.app.locals.pool.query(
        `SELECT r.*, u.full_name as user_name, u.profile_image as user_image
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.service_id = $1
         ORDER BY r.created_at DESC`,
        [parseInt(serviceId)]
      );
      
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching service reviews:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch service reviews',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Create a new review
  createReview: async (req, res) => {
    const client = await req.app.locals.pool.connect();
    try {
      console.log('Review submission - Request body:', req.body);
      console.log('Review submission - User ID:', req.user?.id);
      
      await client.query('BEGIN');

      const { rental_id, service_id, rating, comment, reviewer_name, reviewer_email } = req.body;
      const user_id = req.user?.id;

      // Validate user authentication
      if (!user_id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Validate required fields
      if (!rating) {
        return res.status(400).json({
          success: false,
          message: 'Rating is required'
        });
      }

      // Validate that either rental_id or service_id is provided, but not both
      if (!rental_id && !service_id) {
        return res.status(400).json({
          success: false,
          message: 'Either rental_id or service_id is required'
        });
      }

      if (rental_id && service_id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot review both rental and service at the same time'
        });
      }

      // Validate rating range
      const ratingValue = parseInt(rating);
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be a number between 1 and 5'
        });
      }

      // Convert IDs to proper types
      const rentalId = rental_id ? parseInt(rental_id) : null;
      const serviceId = service_id ? parseInt(service_id) : null;

      console.log('Review submission - Validated data:', {
        user_id,
        rental_id: rentalId,
        service_id: serviceId,
        rating: ratingValue,
        comment,
        reviewer_name,
        reviewer_email
      });

      // Check if the item being reviewed exists
      if (rentalId) {
        const rentalResult = await client.query(
          `SELECT r.*, u.full_name as owner_name, u.id as owner_id
           FROM rentals r
           JOIN users u ON r.owner_id = u.id
           WHERE r.id = $1`,
          [rentalId]
        );

        if (rentalResult.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Rental not found'
          });
        }

        // Check if user has already reviewed this rental
        const existingReview = await client.query(
          'SELECT id FROM reviews WHERE user_id = $1 AND rental_id = $2',
          [user_id, rentalId]
        );

        if (existingReview.rows.length > 0) {
          return res.status(409).json({
            success: false,
            message: 'You have already reviewed this rental'
          });
        }
      } else if (serviceId) {
        const serviceResult = await client.query(
          `SELECT cs.*, u.full_name as owner_name, u.id as owner_id
           FROM concierge_services cs
           JOIN users u ON cs.owner_id = u.id
           WHERE cs.id = $1`,
          [serviceId]
        );

        if (serviceResult.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Service not found'
          });
        }

        // Check if user has already reviewed this service
        const existingReview = await client.query(
          'SELECT id FROM reviews WHERE user_id = $1 AND service_id = $2',
          [user_id, serviceId]
        );

        if (existingReview.rows.length > 0) {
          return res.status(409).json({
            success: false,
            message: 'You have already reviewed this service'
          });
        }
      }

      // Create review
      const reviewResult = await client.query(
        `INSERT INTO reviews (user_id, rental_id, service_id, rating, comment, reviewer_name, reviewer_email)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [user_id, rentalId, serviceId, ratingValue, comment, reviewer_name, reviewer_email]
      );

      const review = reviewResult.rows[0];
      console.log('Review submission - Created review:', review.id);

      // Fetch the full review with user details to return to the client
      const fullReviewResult = await client.query(
        `SELECT r.*, u.full_name as user_name, u.profile_image as user_image
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.id = $1`,
        [review.id]
      );
      const fullReview = fullReviewResult.rows[0];

      // Create notification for the owner
      try {
        let ownerId = null;
        let itemName = '';
        
        if (rentalId) {
          const rentalResult = await client.query(
            'SELECT r.title, u.id as owner_id FROM rentals r JOIN users u ON r.owner_id = u.id WHERE r.id = $1',
            [rentalId]
          );
          if (rentalResult.rows.length > 0) {
            ownerId = rentalResult.rows[0].owner_id;
            itemName = rentalResult.rows[0].title;
          }
        } else if (serviceId) {
          const serviceResult = await client.query(
            'SELECT cs.name, u.id as owner_id FROM concierge_services cs JOIN users u ON cs.owner_id = u.id WHERE cs.id = $1',
            [serviceId]
          );
          if (serviceResult.rows.length > 0) {
            ownerId = serviceResult.rows[0].owner_id;
            itemName = serviceResult.rows[0].name;
          }
        }

        if (ownerId && itemName) {
          await client.query(
            `INSERT INTO notifications (recipient_id, title, message, type, status)
             VALUES ($1, $2, $3, 'review', 'unread')`,
            [ownerId, 'New Review Received', `You have received a new ${ratingValue}-star review for ${itemName}`]
          );
          console.log('Review submission - Created notification for owner');
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the review creation if notification fails
      }

      await client.query('COMMIT');
      console.log('Review submission - Transaction committed successfully');

      res.status(201).json({
        success: true,
        data: fullReview,
        message: 'Review created successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating review - Full error:', error);
      console.error('Error creating review - Stack trace:', error.stack);
      
      const errorResponse = {
        success: false,
        message: error.message || 'Error creating review'
      };
      
      if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = error.stack;
        errorResponse.details = error;
      }
      
      res.status(500).json(errorResponse);
    } finally {
      client.release();
    }
  },

  // Update an existing review
  updateReview: async (req, res) => {
    const client = await req.app.locals.pool.connect();
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.id;

      if (!reviewId || isNaN(parseInt(reviewId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid review ID is required'
        });
      }

      // Validate rating if provided
      if (rating !== undefined) {
        const ratingValue = parseInt(rating);
        if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
          return res.status(400).json({
            success: false,
            message: 'Rating must be a number between 1 and 5'
          });
        }
      }

      await client.query('BEGIN');

      // Check if the review belongs to the user
      const checkResult = await client.query(
        'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
        [parseInt(reviewId), userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to update this review' 
        });
      }

      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;

      if (rating !== undefined) {
        updateFields.push(`rating = $${paramCount++}`);
        updateValues.push(parseInt(rating));
      }

      if (comment !== undefined) {
        updateFields.push(`comment = $${paramCount++}`);
        updateValues.push(comment);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(parseInt(reviewId), userId);

      const result = await client.query(
        `UPDATE reviews
         SET ${updateFields.join(', ')}
         WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
         RETURNING *`,
        updateValues
      );

      await client.query('COMMIT');

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating review:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update review',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      client.release();
    }
  },

  // Delete a review
  deleteReview: async (req, res) => {
    const client = await req.app.locals.pool.connect();
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;

      if (!reviewId || isNaN(parseInt(reviewId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid review ID is required'
        });
      }

      await client.query('BEGIN');

      // Check if the review belongs to the user
      const checkResult = await client.query(
        'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
        [parseInt(reviewId), userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to delete this review' 
        });
      }

      await client.query('DELETE FROM reviews WHERE id = $1', [parseInt(reviewId)]);
      
      await client.query('COMMIT');
      
      res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting review:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete review',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      client.release();
    }
  },

  // Get review statistics for a specific item
  getItemReviewStats: async (req, res) => {
    try {
      const { itemId, itemType } = req.params;
      
      if (!itemId || isNaN(parseInt(itemId))) {
        return res.status(400).json({
          success: false,
          message: 'Valid item ID is required'
        });
      }

      if (!itemType || !['rental', 'service'].includes(itemType)) {
        return res.status(400).json({
          success: false,
          message: 'Valid item type (rental or service) is required'
        });
      }
      
      let query = '';
      let params = [parseInt(itemId)];

      if (itemType === 'rental') {
        query = `
          SELECT 
            COUNT(*) as total_reviews,
            COALESCE(AVG(rating), 0) as average_rating,
            COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
            COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
            COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
            COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
            COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
          FROM reviews
          WHERE rental_id = $1
        `;
      } else if (itemType === 'service') {
        query = `
          SELECT 
            COUNT(*) as total_reviews,
            COALESCE(AVG(rating), 0) as average_rating,
            COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
            COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
            COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
            COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
            COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
          FROM reviews
          WHERE service_id = $1
        `;
      }

      const result = await req.app.locals.pool.query(query, params);
      
      const row = result.rows[0];
      
      res.json({
        success: true,
        data: {
          totalReviews: parseInt(row.total_reviews),
          averageRating: parseFloat(row.average_rating),
          ratingDistribution: {
            5: parseInt(row.five_star),
            4: parseInt(row.four_star),
            3: parseInt(row.three_star),
            2: parseInt(row.two_star),
            1: parseInt(row.one_star)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching review stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch review statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = reviewController;

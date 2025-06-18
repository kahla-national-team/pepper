const { cloudinary } = require('../config/cloudinary');

const reviewController = {
  // Get all reviews for a specific user
  getUserReviews: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await req.app.locals.pool.query(
        `SELECT r.*, u.full_name as user_name, u.profile_image as user_image
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC`,
        [userId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch user reviews' });
    }
  },

  // Get average rating for a user
  getUserAverageRating: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await req.app.locals.pool.query(
        `SELECT COALESCE(AVG(rating), 0) as average_rating
         FROM reviews
         WHERE user_id = $1`,
        [userId]
      );
      res.json({ success: true, data: { averageRating: parseFloat(result.rows[0].average_rating) } });
    } catch (error) {
      console.error('Error fetching user rating:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch user rating' });
    }
  },

  // Get reviews for a specific rental
  getRentalReviews: async (req, res) => {
    try {
      const { rentalId } = req.params;
      const result = await req.app.locals.pool.query(
        `SELECT r.*, u.full_name as user_name, u.profile_image as user_image
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.rental_id = $1
         ORDER BY r.created_at DESC`,
        [rentalId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching rental reviews:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch rental reviews' });
    }
  },

  // Get reviews for a specific service
  getServiceReviews: async (req, res) => {
    try {
      const { serviceId } = req.params;
      const result = await req.app.locals.pool.query(
        `SELECT r.*, u.full_name as user_name, u.profile_image as user_image
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.service_id = $1
         ORDER BY r.created_at DESC`,
        [serviceId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching service reviews:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch service reviews' });
    }
  },

  // Create a new review
  createReview: async (req, res) => {
    const client = await req.app.locals.pool.connect();
    try {
      // Add detailed logging for debugging
      console.log('Review submission - Request body:', req.body);
      console.log('Review submission - User ID:', req.user?.id);
      
      await client.query('BEGIN');

      const { rental_id, rating, comment } = req.body;
      const user_id = req.user?.id;

      // Validate user authentication
      if (!user_id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Validate required fields
      if (!rental_id || !rating) {
        return res.status(400).json({
          success: false,
          message: 'Rental ID and rating are required'
        });
      }

      // Validate rating range
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      // Validate data types
      if (typeof rental_id !== 'number' && isNaN(parseInt(rental_id))) {
        return res.status(400).json({
          success: false,
          message: 'Rental ID must be a valid number'
        });
      }

      if (typeof rating !== 'number' && isNaN(parseInt(rating))) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be a valid number'
        });
      }

      // Convert to proper types
      const rentalId = parseInt(rental_id);
      const ratingValue = parseInt(rating);

      console.log('Review submission - Validated data:', {
        user_id,
        rental_id: rentalId,
        rating: ratingValue,
        comment
      });

      // Get rental details
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

      const rental = rentalResult.rows[0];
      console.log('Review submission - Found rental:', rental.title);

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

      // Create review
      const reviewResult = await client.query(
        `INSERT INTO reviews (user_id, rental_id, rating, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user_id, rentalId, ratingValue, comment]
      );

      const review = reviewResult.rows[0];
      console.log('Review submission - Created review:', review.id);

      // Create a simple notification in the notifications table
      try {
        await client.query(
          `INSERT INTO notifications (user_id, message, is_read)
           VALUES ($1, $2, false)`,
          [rental.owner_id, `You have received a new ${ratingValue}-star review for ${rental.title}`]
        );
        console.log('Review submission - Created notification for owner');
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the review creation if notification fails
      }

      await client.query('COMMIT');
      console.log('Review submission - Transaction committed successfully');

      res.status(201).json({
        success: true,
        data: review,
        message: 'Review created successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating review - Full error:', error);
      console.error('Error creating review - Stack trace:', error.stack);
      
      // Return more detailed error information in development
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
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.id;

      // Check if the review belongs to the user
      const checkResult = await req.app.locals.pool.query(
        'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
        [reviewId, userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
      }

      const result = await req.app.locals.pool.query(
        `UPDATE reviews
         SET rating = $1, comment = $2, updated_at = NOW()
         WHERE id = $3 AND user_id = $4
         RETURNING *`,
        [rating, comment, reviewId, userId]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ success: false, message: 'Failed to update review' });
    }
  },

  // Delete a review
  deleteReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;

      // Check if the review belongs to the user
      const checkResult = await req.app.locals.pool.query(
        'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
        [reviewId, userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
      }

      await req.app.locals.pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
      res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ success: false, message: 'Failed to delete review' });
    }
  },

  // Get review statistics for a specific item
  getItemReviewStats: async (req, res) => {
    try {
      const { itemId, itemType } = req.params;
      
      let query = '';
      let params = [];

      if (itemType === 'rental') {
        query = `
          SELECT 
            COUNT(*) as total_reviews,
            COALESCE(AVG(rating), 0) as average_rating
          FROM reviews
          WHERE rental_id = $1
        `;
        params = [itemId];
      } else if (itemType === 'service') {
        query = `
          SELECT 
            COUNT(*) as total_reviews,
            COALESCE(AVG(rating), 0) as average_rating
          FROM reviews
          WHERE service_id = $1
        `;
        params = [itemId];
      }

      const result = await req.app.locals.pool.query(query, params);
      
      res.json({
        success: true,
        data: {
          totalReviews: parseInt(result.rows[0].total_reviews),
          averageRating: parseFloat(result.rows[0].average_rating)
        }
      });
    } catch (error) {
      console.error('Error fetching review stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch review statistics'
      });
    }
  }
};

module.exports = reviewController;

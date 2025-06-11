const { appPool: pool } = require('../config/database');

const reviewController = {
  // Get all reviews for a specific user
  getUserReviews: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await pool.query(
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
      const result = await pool.query(
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
      const result = await pool.query(
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
      const result = await pool.query(
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
    const client = await pool.connect();
    try {
      console.log('Creating review with data:', req.body);
      await client.query('BEGIN');
      const { rating, comment, item_id, item_type } = req.body;
      
      // Get user information from the authenticated request
      const userId = req.user?.id;

      // Handle both authenticated and anonymous reviews
      let rentalId = null;
      let serviceId = null;

      // Set the appropriate ID based on item type
      if (item_type === 'rental') {
        rentalId = item_id;
      } else if (item_type === 'service') {
        serviceId = item_id;
      }

      // Get user information if authenticated
      let userInfo = null;
      if (userId) {
        const userResult = await client.query(
          'SELECT full_name, email, profile_image FROM users WHERE id = $1',
          [userId]
        );
        if (userResult.rows.length > 0) {
          userInfo = userResult.rows[0];
        }
      }

      // Insert the review
      const insertQuery = `
        INSERT INTO reviews (
          user_id, 
          rental_id, 
          service_id, 
          rating, 
          comment,
          reviewer_name,
          reviewer_email
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;

      const result = await client.query(
        insertQuery,
        [
          userId,
          rentalId,
          serviceId,
          rating,
          comment,
          userInfo ? userInfo.full_name : req.body.reviewerName,
          userInfo ? userInfo.email : req.body.reviewerEmail
        ]
      );

      // Prepare the response data
      let reviewData = result.rows[0];
      if (userInfo) {
        reviewData = {
          ...reviewData,
          user_name: userInfo.full_name,
          user_image: userInfo.profile_image
        };
      }

      await client.query('COMMIT');
      console.log('Review created successfully:', reviewData);
      res.json({ success: true, data: reviewData });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating review:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to create review',
        details: error.stack
      });
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
      const checkResult = await pool.query(
        'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
        [reviewId, userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
      }

      const result = await pool.query(
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
      const checkResult = await pool.query(
        'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
        [reviewId, userId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
      }

      await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
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

      const result = await pool.query(query, params);
      
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

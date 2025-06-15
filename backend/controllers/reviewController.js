const { cloudinary } = require('../config/cloudinary');
const NotificationService = require('../services/notificationService');

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
      await client.query('BEGIN');

      const { rental_id, rating, comment } = req.body;
      const user_id = req.user.id;

      // Get rental details
      const rentalResult = await client.query(
        `SELECT r.*, u.full_name as owner_name, u.id as owner_id
         FROM rentals r
         JOIN users u ON r.owner_id = u.id
         WHERE r.id = $1`,
        [rental_id]
        );

      if (rentalResult.rows.length === 0) {
        throw new Error('Rental not found');
      }

      const rental = rentalResult.rows[0];

      // Create review
      const reviewResult = await client.query(
        `INSERT INTO reviews (user_id, rental_id, rating, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user_id, rental_id, rating, comment]
      );

      const review = reviewResult.rows[0];

      // Get user details for notification
      const userResult = await client.query(
        'SELECT full_name FROM users WHERE id = $1',
        [user_id]
      );
      const user = userResult.rows[0];

      // Create notification service instance
      const notificationService = new NotificationService(req.app.locals.pool);

      // Send notification
      await notificationService.notifyNewReview({
        ...review,
        property_name: rental.title,
        user_name: user.full_name,
        owner_id: rental.owner_id
      });

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        data: review,
        message: 'Review created successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating review:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error creating review',
        error: error.message
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

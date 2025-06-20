const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Public routes
router.get('/user/:userId', reviewController.getUserReviews);
router.get('/user/:userId/rating', reviewController.getUserAverageRating);
router.get('/rental/:rentalId', reviewController.getRentalReviews);
router.get('/service/:serviceId', reviewController.getServiceReviews);
router.get('/stats/:itemType/:itemId', reviewController.getItemReviewStats);

// Protected routes (require authentication)
router.post('/', auth, reviewController.createReview);
router.put('/:reviewId', auth, reviewController.updateReview);
router.delete('/:reviewId', auth, reviewController.deleteReview);

// Admin routes (optional - for future admin panel)
// router.get('/', auth, reviewController.getAllReviews); // Uncomment if needed

module.exports = router; 
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', auth, userController.getCurrentUser);
router.get('/profile', auth, userController.getProfile);
router.get('/fullname', auth, userController.getFullName);
router.get('/email', auth, userController.getEmailAdress);
router.post('/profile/image', auth, userController.updateProfileImage);
router.put('/profile', auth, userController.updateProfile);
router.post('/refresh-token', userController.refreshToken);

// Get user by ID
router.get('/:id', auth, userController.getUserById);

// Get follow status
router.get('/:id/follow-status', auth, userController.getFollowStatus);

// Update user profile
router.put('/me', auth, userController.updateUser);

module.exports = router; 
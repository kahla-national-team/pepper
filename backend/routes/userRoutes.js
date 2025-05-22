const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);


// Protected routes
router.get('/profile', auth, userController.getProfile);
router.get('/fullname', auth, userController.getFullName);
router.get('/email', auth, userController.getEmailAdress);

module.exports = router; 
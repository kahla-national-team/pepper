const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pepper/profile_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('profile_image');

const userController = {
  // Register a new user
  register: async (req, res) => {
    try {
      console.log('Registration request received:', req.body);
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        console.log('Missing required fields:', { username, email, password: password ? 'provided' : 'missing' });
        return res.status(400).json({ message: 'All fields are required' });
      }

      const userModel = new User(req.app.locals.pool);
      
      // Check if user already exists
      console.log('Checking for existing user with email:', email);
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        console.log('User already exists with email:', email);
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user with full_name derived from username
      const full_name = username.charAt(0).toUpperCase() + username.slice(1);
      console.log('Creating new user:', { username, email, full_name });
      const user = await userModel.create({ username, email, password, full_name });
      console.log('User created successfully:', user);

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'Error creating user', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      console.log('Login request received:', { identifier: req.body.identifier });
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        console.log('Missing credentials:', { identifier: !!identifier, password: !!password });
        return res.status(400).json({ message: 'Username/Email and password are required' });
      }

      const userModel = new User(req.app.locals.pool);
      
      // Find user by email or username
      console.log('Finding user with identifier:', identifier);
      const user = await userModel.findByEmailOrUsername(identifier);
      if (!user) {
        console.log('User not found with identifier:', identifier);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      console.log('Checking password for user:', identifier);
      const isMatch = await userModel.comparePassword(password, user.password);
      if (!isMatch) {
        console.log('Invalid password for user:', identifier);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      console.log('Login successful for user:', identifier);
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Error logging in', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const userModel = new User(req.app.locals.pool);
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return the Cloudinary URL directly
      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching profile', 
        error: error.message 
      });
    }
  },

  // Get user's full name
  getFullName: async (req, res) => {
    try {
      const userModel = new User(req.app.locals.pool);
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ full_name: user.full_name });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching full name', error: error.message });
    }
  },

  //GET USER EMAIL
  getEmailAdress: async (req, res) => {
    try {
      const userModel = new User(req.app.locals.pool);
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ email: user.email });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching email', error: error.message });
    }
  },

  // Update profile image
  updateProfileImage: async (req, res) => {
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({ 
          message: 'Error uploading file', 
          error: err.message 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          message: 'No file uploaded' 
        });
      }

      try {
        const userModel = new User(req.app.locals.pool);
        
        // Get the Cloudinary URL
        const imageUrl = req.file.path;
        
        // Update user's profile image
        const updatedUser = await userModel.updateProfileImage(req.user.id, imageUrl);
        
        res.json({
          message: 'Profile image updated successfully',
          user: {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            full_name: updatedUser.full_name,
            profile_image: updatedUser.profile_image
          }
        });
      } catch (error) {
        console.error('Error updating profile image:', error);
        res.status(500).json({ 
          message: 'Error updating profile image', 
          error: error.message 
        });
      }
    });
  },

  // Update profile information
  updateProfile: async (req, res) => {
    try {
      const { full_name } = req.body;
      const userModel = new User(req.app.locals.pool);
      
      // Update user's profile information
      const updatedUser = await userModel.updateProfile(req.user.id, { full_name });
      
      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          full_name: updatedUser.full_name,
          profile_image: updatedUser.profile_image
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ 
        message: 'Error updating profile', 
        error: error.message 
      });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const userModel = new User(req.app.locals.pool);
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching user', 
        error: error.message 
      });
    }
  },

  // Get follow status
  getFollowStatus: async (req, res) => {
    try {
      // For now, return a default response as follow functionality is not implemented
      res.json({ isFollowing: false });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching follow status', 
        error: error.message 
      });
    }
  },

  // Refresh token
  refreshToken: async (req, res) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'No token provided for refresh' });
      }

      const decoded = jwt.decode(token);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: 'Invalid token for refresh' });
      }

      const userModel = new User(req.app.locals.pool);
      const user = await userModel.findById(decoded.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found for token refresh' });
      }

      // Generate new token
      const newToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ token: newToken });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ 
        message: 'Error refreshing token', 
        error: error.message 
      });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      const userModel = new User(req.app.locals.pool);
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching current user', 
        error: error.message 
      });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const userModel = new User(req.app.locals.pool);
      const { full_name } = req.body;
      
      if (!full_name) {
        return res.status(400).json({ message: 'Full name is required' });
      }

      const updatedUser = await userModel.updateProfile(req.user.id, { full_name });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating user', 
        error: error.message 
      });
    }
  }
};

module.exports = userController; 
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

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
        { expiresIn: '24h' }
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
      console.log('Login request received:', { email: req.body.email });
      const { email, password } = req.body;

      if (!email || !password) {
        console.log('Missing credentials:', { email: !!email, password: !!password });
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const userModel = new User(req.app.locals.pool);
      
      // Find user
      console.log('Finding user with email:', email);
      const user = await userModel.findByEmail(email);
      if (!user) {
        console.log('User not found with email:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      console.log('Checking password for user:', email);
      const isMatch = await userModel.comparePassword(password, user.password);
      if (!isMatch) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      console.log('Login successful for user:', email);
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
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
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
  }
};

module.exports = userController; 
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Please authenticate',
      error: error.message 
    });
  }
}; 
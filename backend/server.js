const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/favorites', favoriteRoutes);

// 404 handler
app.use((req, res, next) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET    /api/favorites');
  console.log('- POST   /api/favorites');
  console.log('- DELETE /api/favorites/:itemType/:itemId');
  console.log('- GET    /api/favorites/check/:itemType/:itemId');
});







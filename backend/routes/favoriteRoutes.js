const express = require('express');
const router = express.Router();
const favoriteModel = require('../models/favoriteModel');
const auth = require('../middleware/auth');

// Initialize favorites table
router.use(async (req, res, next) => {
  try {
    await favoriteModel.createTable(req.app.locals.pool);
    next();
  } catch (error) {
  console.error('Error creating favorites table:', error);
    next(error);
  }
});

// Debug middleware for favorites routes
router.use((req, res, next) => {
  console.log('Favorites route:', req.method, req.url, req.body);
  next();
});

// Get all favorites for the current user
router.get('/', auth, async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    console.log('Getting favorites for user:', req.user.id);
    const favorites = await favoriteModel.getFavorites(pool, req.user.id);
    console.log('Found favorites:', favorites.length);
    res.json(favorites);
  } catch (error) {
    console.error('Error in GET /favorites:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      where: error.where,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error fetching favorites', 
      error: error.message,
      detail: error.detail || 'No additional details available',
      hint: error.hint || 'No hint available'
    });
  }
});

// Add an item to favorites
router.post('/', auth, async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const { itemId, itemType } = req.body;
    console.log('Adding favorite:', { userId: req.user.id, itemId, itemType });

    if (!itemId || !itemType) {
      return res.status(400).json({ 
        message: 'Item ID and type are required',
        received: { itemId, itemType }
      });
    }

    if (!['stay', 'service'].includes(itemType)) {
      return res.status(400).json({ 
        message: 'Invalid item type',
        received: itemType,
        allowed: ['stay', 'service']
      });
    }

    const favoriteId = await favoriteModel.addFavorite(pool, req.user.id, itemId, itemType);
    console.log('Added favorite:', favoriteId);
    res.status(201).json({ id: favoriteId, message: 'Item added to favorites' });
  } catch (error) {
    console.error('Error in POST /favorites:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Item is already in favorites' });
    } else {
      res.status(500).json({ 
        message: 'Error adding to favorites',
        error: error.message
      });
    }
  }
});

// Remove an item from favorites
router.delete('/:id', auth, async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const favoriteId = req.params.id;
    console.log('Removing favorite:', { userId: req.user.id, favoriteId });

    const removed = await favoriteModel.removeFavoriteById(pool, favoriteId, req.user.id);
    console.log('Removed favorite:', removed);
    
    if (removed) {
      res.json({ message: 'Item removed from favorites' });
    } else {
      res.status(404).json({ message: 'Favorite not found' });
    }
  } catch (error) {
    console.error('Error in DELETE /favorites/:id:', error);
    res.status(500).json({ 
      message: 'Error removing from favorites',
      error: error.message
    });
  }
});

// Check if an item is in favorites
router.get('/check/:itemType/:itemId', auth, async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const { itemId, itemType } = req.params;
    console.log('Checking favorite status:', { userId: req.user.id, itemId, itemType });

    if (!['stay', 'service'].includes(itemType)) {
      return res.status(400).json({ 
        message: 'Invalid item type',
        received: itemType,
        allowed: ['stay', 'service']
      });
    }

    const isFavorite = await favoriteModel.isFavorite(pool, req.user.id, itemId, itemType);
    console.log('Favorite status:', isFavorite);
    res.json({ isFavorite });
  } catch (error) {
    console.error('Error in GET /favorites/check/:itemType/:itemId:', error);
    res.status(500).json({ 
      message: 'Error checking favorite status',
      error: error.message
    });
  }
});

module.exports = router; 
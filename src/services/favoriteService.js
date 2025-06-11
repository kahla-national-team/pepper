import api from './api';
import { authService } from './api';

const favoriteService = {
  // Get all favorite items for the current user
  getFavorites: async () => {
    if (!authService.isAuthenticated()) {
      return [];
    }
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      console.error('Get favorites error:', error);
      if (error.code === 'ERR_NETWORK') {
        console.error('Server is not running or not accessible');
        return [];
      }
      throw error.response?.data || { message: 'An error occurred while fetching favorites' };
    }
  },

  // Add an item to favorites
  addFavorite: async (itemId, itemType) => {
    if (!authService.isAuthenticated()) {
      throw { message: 'Please sign in to add favorites' };
    }
    try {
      const response = await api.post('/favorites', { itemId, itemType });
      return response.data;
    } catch (error) {
      console.error('Add favorite error:', error);
      if (error.code === 'ERR_NETWORK') {
        throw { message: 'Server is not running or not accessible' };
      }
      throw error.response?.data || { message: 'An error occurred while adding to favorites' };
    }
  },

  // Remove an item from favorites
  removeFavorite: async (favoriteId) => {
    if (!authService.isAuthenticated()) {
      throw { message: 'Please sign in to remove favorites' };
    }
    try {
      const response = await api.delete(`/favorites/${favoriteId}`);
      return response.data;
    } catch (error) {
      console.error('Remove favorite error:', error);
      if (error.code === 'ERR_NETWORK') {
        throw { message: 'Server is not running or not accessible' };
      }
      throw error.response?.data || { message: 'An error occurred while removing from favorites' };
    }
  },

  // Check if an item is in favorites
  isFavorite: async (itemId, itemType) => {
    if (!authService.isAuthenticated()) {
      return false;
    }
    try {
      const response = await api.get(`/favorites/check/${itemType}/${itemId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.error('Check favorite error:', error);
      if (error.code === 'ERR_NETWORK') {
        console.error('Server is not running or not accessible');
        return false;
      }
      return false;
    }
  }
};

export default favoriteService; 
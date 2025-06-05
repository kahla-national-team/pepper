import api from './api';

const favoriteService = {
  // Get all favorite items for the current user
  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      console.error('Get favorites error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching favorites' };
    }
  },

  // Add an item to favorites
  addFavorite: async (itemId, itemType) => {
    try {
      const response = await api.post('/favorites', { itemId, itemType });
      return response.data;
    } catch (error) {
      console.error('Add favorite error:', error);
      throw error.response?.data || { message: 'An error occurred while adding to favorites' };
    }
  },

  // Remove an item from favorites
  removeFavorite: async (favoriteId) => {
    try {
      const response = await api.delete(`/favorites/${favoriteId}`);
      return response.data;
    } catch (error) {
      console.error('Remove favorite error:', error);
      throw error.response?.data || { message: 'An error occurred while removing from favorites' };
    }
  },

  // Check if an item is in favorites
  isFavorite: async (itemId, itemType) => {
    try {
      const response = await api.get(`/favorites/check/${itemType}/${itemId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.error('Check favorite error:', error);
      throw error.response?.data || { message: 'An error occurred while checking favorite status' };
    }
  }
};

export default favoriteService; 
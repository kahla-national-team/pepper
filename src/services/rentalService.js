import api from './api';

export const rentalService = {
  createRental: async (rentalData) => {
    try {
      const response = await api.post('/rentals', rentalData);
      return response.data;
    } catch (error) {
      console.error('Create rental error:', error);
      throw error.response?.data || { message: 'An error occurred while creating the rental' };
    }
  },

  updateRental: async (id, rentalData) => {
    try {
      const response = await api.put(`/rentals/${id}`, rentalData);
      return response.data;
    } catch (error) {
      console.error('Update rental error:', error);
      throw error.response?.data || { message: 'An error occurred while updating the rental' };
    }
  },

  deleteRental: async (id) => {
    try {
      const response = await api.delete(`/rentals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete rental error:', error);
      throw error.response?.data || { message: 'An error occurred while deleting the rental' };
    }
  },

  getRental: async (id) => {
    try {
      const response = await api.get(`/rentals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get rental error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching the rental' };
    }
  },

  getRentals: async (filters = {}) => {
    try {
      const response = await api.get('/rentals', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get rentals error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching rentals' };
    }
  },

  getRentalReviews: async (rentalId) => {
    try {
      const response = await api.get(`/rentals/${rentalId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Get rental reviews error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching rental reviews' };
    }
  }
}; 
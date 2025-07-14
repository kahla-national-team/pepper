import api from './api';
import { userService } from './userService';

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
      console.log('Sending filters to backend:', filters);
      const response = await api.get('/rentals', { params: filters });
      console.log('Backend response:', response.data);
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
  },

  getRentalsByUserId: async (userId) => {
    try {
      const response = await api.get(`/rentals/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get rentals by user error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching user rentals' };
    }
  },

  getRentalLocations: async () => {
    try {
      const response = await api.get('/rentals/locations');
      return response.data;
    } catch (error) {
      console.error('Get rental locations error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching rental locations' };
    }
  },

  // Get rental with enhanced owner information
  getRentalWithOwnerInfo: async (rentalId) => {
    try {
      const response = await api.get(`/rentals/${rentalId}`);
      const rental = response.data;
      
      // If rental has owner_id but no provider info, fetch owner details
      if (rental.owner_id && !rental.provider) {
        try {
          const ownerInfo = await userService.getOwnerInfo(rental.owner_id);
          rental.provider = {
            id: ownerInfo.id,
            name: ownerInfo.full_name,
            username: ownerInfo.username,
            image: ownerInfo.profile_image,
            rating: 5.0, // Default rating
            reviewCount: 0 // Default review count
          };
        } catch (ownerError) {
          console.error('Error fetching owner info:', ownerError);
          // Use default provider info if fetch fails
          rental.provider = {
            id: rental.owner_id,
            name: 'Property Owner',
            username: 'owner',
            image: '/placeholder-avatar.png',
            rating: 5.0,
            reviewCount: 0
          };
        }
      }
      
      return rental;
    } catch (error) {
      console.error('Error fetching rental with owner info:', error);
      throw error;
    }
  }
}; 
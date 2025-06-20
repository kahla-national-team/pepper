import api from './api';

export const userService = {
  // Get user by ID (for fetching owner information)
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error.response?.data || { message: 'An error occurred while fetching user information' };
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error.response?.data || { message: 'An error occurred while fetching user profile' };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error.response?.data || { message: 'An error occurred while fetching profile' };
    }
  },

  // Update profile image
  updateProfileImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('profile_image', imageFile);
      
      const response = await api.post('/users/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error.response?.data || { message: 'An error occurred while updating profile image' };
    }
  },

  // Update profile information
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.response?.data || { message: 'An error occurred while updating profile' };
    }
  },

  // Get owner information (alias for getUserById)
  getOwnerInfo: async (ownerId) => {
    try {
      const response = await api.get(`/users/${ownerId}`);
      return {
        id: response.data.id,
        username: response.data.username,
        full_name: response.data.full_name,
        profile_image: response.data.profile_image,
        email: response.data.email
      };
    } catch (error) {
      console.error('Error fetching owner information:', error);
      // Return default owner info if fetch fails
      return {
        id: ownerId,
        username: 'Unknown User',
        full_name: 'Unknown User',
        profile_image: '/placeholder-avatar.png',
        email: null
      };
    }
  }
}; 
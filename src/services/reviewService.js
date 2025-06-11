import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const reviewService = {
  // Get all reviews for a specific user
  getUserReviews: async (userId) => {
    try {
      const response = await axiosInstance.get(`/reviews/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },

  // Get reviews for a specific rental
  getRentalReviews: async (rentalId) => {
    try {
      const response = await axiosInstance.get(`/reviews/rental/${rentalId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rental reviews:', error);
      throw error;
    }
  },

  // Get reviews for a specific service
  getServiceReviews: async (serviceId) => {
    try {
      const response = await axiosInstance.get(`/reviews/service/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service reviews:', error);
      throw error;
    }
  },

  // Create a new review (requires authentication)
  createReview: async (reviewData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(`/reviews`, reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Update an existing review (requires authentication)
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await axiosInstance.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Delete a review (requires authentication)
  deleteReview: async (reviewId) => {
    try {
      const response = await axiosInstance.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Get average rating for a user
  getUserAverageRating: async (userId) => {
    try {
      const response = await axiosInstance.get(`/reviews/user/${userId}/rating`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user rating:', error);
      throw error;
    }
  },

  // Get review statistics for a specific item
  getItemReviewStats: async (itemId, itemType) => {
    try {
      const response = await axiosInstance.get(`/reviews/stats/${itemType}/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  }
};
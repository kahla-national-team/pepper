import api from './api';
import axios from 'axios';

export const conciergeService = {
  // Create a new concierge service
  createService: async (serviceData) => {
    try {
      const response = await api.post('/concierge', serviceData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create service error:', error);
      throw error.response?.data || { message: 'An error occurred while creating the service' };
    }
  },

  // Get all services for the authenticated user
  getMyServices: async () => {
    try {
      const response = await api.get('/concierge/my-services');
      return response.data;
    } catch (error) {
      console.error('Get my services error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching your services' };
    }
  },

  // Get services by user ID
  getServicesByUserId: async (userId) => {
    try {
      const response = await api.get(`/concierge/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user services error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching user services' };
    }
  },

  // Update a service
  updateService: async (id, serviceData) => {
    try {
      const response = await api.put(`/concierge/${id}`, serviceData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Update service error:', error);
      throw error.response?.data || { message: 'An error occurred while updating the service' };
    }
  },

  // Delete a service
  deleteService: async (id) => {
    try {
      const response = await api.delete(`/concierge/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete service error:', error);
      throw error.response?.data || { message: 'An error occurred while deleting the service' };
    }
  },

  // Get all concierge services
  getAllServices: async () => {
    try {
      // Create a new axios instance without auth interceptor for public access
      const publicApi = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
          'Accept': 'application/json'
        }
      });
      const response = await publicApi.get('/concierge/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  getServiceDetails: async (id) => {
    try {
      const response = await api.get(`/concierge/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service details:', error);
      throw error;
    }
  }
}; 
import api from './api';

export const propertyService = {
  createProperty: async (propertyData) => {
    try {
      const response = await api.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      console.error('Create property error:', error);
      throw error.response?.data || { message: 'An error occurred while creating the property' };
    }
  },

  updateProperty: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      console.error('Update property error:', error);
      throw error.response?.data || { message: 'An error occurred while updating the property' };
    }
  },

  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete property error:', error);
      throw error.response?.data || { message: 'An error occurred while deleting the property' };
    }
  },

  getProperty: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get property error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching the property' };
    }
  },

  getProperties: async (filters = {}) => {
    try {
      const response = await api.get('/properties', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get properties error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching properties' };
    }
  }
}; 
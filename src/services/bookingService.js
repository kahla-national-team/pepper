import api from './api';

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      console.log('bookingService - sending data:', bookingData);
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error response:', error.response?.data);
      
      // Return a more specific error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Failed to create booking. Please try again.');
      }
    }
  },

  // Get booking details by ID
  getBooking: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Get all bookings for the current user
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Cancel a booking
  cancelBooking: async (id) => {
    try {
      const response = await api.post(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  },

  // Check availability for a date range
  checkAvailability: async (rentalId, startDate, endDate) => {
    try {
      const response = await api.get('/bookings/check-availability', {
        params: {
          rental_id: rentalId,
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  },

  // Get bookings for properties owned by the current user
  getBookingsForOwner: async () => {
    try {
      const response = await api.get('/bookings/owner');
      return response.data;
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      throw error;
    }
  }
}; 
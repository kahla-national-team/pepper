import api from './api';
import axios from 'axios';

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

  // Create a concierge service booking
  createConciergeBooking: async (bookingData) => {
    try {
      // Get user ID from the JWT token in the Authorization header
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to request a service');
      }

      // Validate required fields
      const requiredFields = ['service_id', 'requested_date', 'requested_time', 'duration', 'total_amount'];
      const missingFields = requiredFields.filter(field => !bookingData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const serviceRequestPayload = {
        service_id: bookingData.service_id,
        requested_date: bookingData.requested_date,
        requested_time: bookingData.requested_time,
        duration: bookingData.duration,
        total_amount: bookingData.total_amount,
        notes: bookingData.notes || '',
        status: 'pending'
      };

      // Log the exact payload being sent
      console.log('Creating service request with payload:', JSON.stringify(serviceRequestPayload, null, 2));
      
      // Use the service-requests endpoint
      const response = await api.post('/service-requests', serviceRequestPayload);
      return response.data;
    } catch (error) {
      // Log the complete error object
      console.error('Full error object:', error);
      
      // Log the response data if it exists
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }

      // More detailed error logging
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        stack: error.stack,
        requestData: bookingData
      });
      
      // More specific error handling with better error messages
      if (error.response?.status === 401) {
        throw new Error('Please log in to request a service');
      } else if (error.response?.status === 500) {
        // Log the full server error
        console.error('Server error details:', error.response?.data);
        const serverError = error.response?.data?.error || error.response?.data?.message || 'Unknown server error';
        throw new Error(`Server error: ${serverError}`);
      } else if (error.response?.data?.message) {
        throw new Error(`Service request failed: ${error.response.data.message}`);
      } else if (error.message) {
        throw new Error(`Service request failed: ${error.message}`);
      } else {
        throw new Error('Failed to create service request. Please try again.');
      }
    }
  },

  // Get booking details by ID
  getBooking: async (id) => {
    try {
      if (!id) {
        throw new Error('Booking ID is required');
      }
      
      // First try to get it as a rental booking
      try {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
      } catch (bookingError) {
        // If rental booking fails with 404, try as a service request
        if (bookingError.response?.status === 404) {
    try {
            const response = await api.get(`/service-requests/${id}`);
      return response.data;
          } catch (serviceError) {
            // If both fail, throw the original booking error
            throw bookingError;
          }
        } else {
          throw bookingError;
        }
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Get all bookings for the current user
  getUserBookings: async () => {
    try {
      console.log('Fetching user bookings from /bookings/user');
      const response = await api.get('/bookings/user');
      console.log('User bookings response:', response.data);
      return response.data.data || response.data || []; // Handle different response formats
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
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      // Get the current user's ID from the token or auth service
      const userId = JSON.parse(atob(token.split('.')[1])).id; // Decode JWT token to get user ID
      
      const response = await api.get(`/bookings/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch owner bookings');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }

      if (error.response?.status === 401) {
        throw new Error('Please log in to view your bookings');
      } else if (error.response?.status === 500) {
        console.error('Server error details:', error.response?.data);
        throw new Error('Server error occurred while fetching bookings');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to fetch owner bookings. Please try again.');
      }
    }
  },

  // Get concierge service bookings for the current user
  getUserConciergeBookings: async () => {
    try {
      console.log('Fetching concierge bookings from /service-requests/user');
      const response = await api.get('/service-requests/user');
      console.log('Concierge bookings response:', response.data);
      return response.data.data || response.data || []; // Handle different response formats
    } catch (error) {
      console.error('Error fetching user concierge bookings:', error);
      throw error;
    }
  },

  // Get concierge service bookings for the service provider
  getProviderConciergeBookings: async () => {
    try {
      const response = await api.get('/bookings/concierge/provider');
      return response.data;
    } catch (error) {
      console.error('Error fetching provider concierge bookings:', error);
      throw error;
    }
  },

  // Cancel a concierge booking
  cancelConciergeBooking: async (id) => {
    try {
      const response = await api.post(`/service-requests/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling concierge booking:', error);
      throw error;
    }
  },

  // Get rental bookings for the current user (these are included in getUserBookings)
  getUserRentalBookings: async () => {
    try {
      console.log('Fetching rental bookings from /bookings/user');
      const response = await api.get('/bookings/user');
      console.log('Rental bookings response:', response.data);
      // Filter for rental bookings (those with rental_id)
      const allBookings = response.data.data || response.data || [];
      const rentalBookings = allBookings.filter(booking => booking.rental_id);
      console.log('Filtered rental bookings:', rentalBookings);
      return rentalBookings;
    } catch (error) {
      console.error('Error fetching user rental bookings:', error);
      throw error;
    }
  },

  // Cancel a rental booking
  cancelRentalBooking: async (id) => {
    try {
      const response = await api.post(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling rental booking:', error);
      throw error;
    }
  },

  // Get all user bookings (property, rental, and concierge) in one call
  getAllUserBookings: async () => {
    try {
      console.log('Fetching all user bookings...');
      
      // Fetch all types of bookings in parallel
      const [propertyBookings, conciergeData] = await Promise.all([
        bookingService.getUserBookings().catch(err => {
          console.error('Error fetching property bookings:', err);
          return [];
        }),
        bookingService.getUserConciergeBookings().catch(err => {
          console.error('Error fetching concierge bookings:', err);
          return [];
        })
      ]);
      
      // Filter property bookings into property and rental
      const propertyBookingsArray = Array.isArray(propertyBookings) ? propertyBookings : [];
      const conciergeBookingsArray = Array.isArray(conciergeData) ? conciergeData : [];
      
      const rentalBookings = propertyBookingsArray.filter(booking => booking.rental_id);
      const otherPropertyBookings = propertyBookingsArray.filter(booking => !booking.rental_id);
      
      console.log('All bookings fetched:', {
        property: otherPropertyBookings.length,
        rental: rentalBookings.length,
        concierge: conciergeBookingsArray.length
      });
      
      return {
        property: otherPropertyBookings,
        rental: rentalBookings,
        concierge: conciergeBookingsArray,
        all: [...otherPropertyBookings, ...rentalBookings, ...conciergeBookingsArray]
      };
    } catch (error) {
      console.error('Error fetching all user bookings:', error);
      throw error;
    }
  }
};

const API_URL = 'http://localhost:5000/api';

export const getOwnerBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings/owner`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    throw error;
  }
}; 
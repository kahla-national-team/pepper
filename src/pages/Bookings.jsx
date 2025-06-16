import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaCreditCard, FaEye, FaTimes } from 'react-icons/fa';
import { getUserBookings } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

const Bookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings();
        setBookings(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        // Refresh the bookings list
        const updatedBookings = await bookingService.getUserBookings();
        setBookings(updatedBookings);
      } catch (err) {
        console.error('Error canceling booking:', err);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#ff385c] transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600">Manage your reservations and view booking history</p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaCalendarAlt className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start exploring our properties!</p>
            <button
              onClick={() => navigate('/stays')}
              className="px-6 py-3 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Booking Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <img
                        src={booking.rental_image || '/placeholder-stay.jpg'}
                        alt={booking.rental_title}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/placeholder-stay.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{booking.rental_title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Check-in</p>
                              <p className="font-medium">{formatDate(booking.start_date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Check-out</p>
                              <p className="font-medium">{formatDate(booking.end_date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaUser className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Guests</p>
                              <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Selected Services */}
                        {booking.services && booking.services.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Additional Services:</p>
                            <div className="flex flex-wrap gap-2">
                              {booking.services.map((service, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                                  {service.service_name || service.service_title} (${service.service_price})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <FaCreditCard className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Total Amount</p>
                              <p className="font-semibold text-lg">${booking.total_amount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => navigate(`/booking-success/${booking.id}`)}
                        className="flex items-center px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </button>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings; 
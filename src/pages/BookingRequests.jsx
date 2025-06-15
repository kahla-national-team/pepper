import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaHome, FaCheckCircle, FaTimes, FaEye, FaBell } from 'react-icons/fa';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

const BookingRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const fetchOwnerBookings = async () => {
      try {
        setLoading(true);
        const bookingsData = await bookingService.getBookingsForOwner();
        setBookings(bookingsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching owner bookings:', err);
        setError(err.message || 'Failed to fetch booking requests');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOwnerBookings();
    }
  }, [user]);

  const handleAcceptBooking = async (bookingId) => {
    try {
      // Update booking status to accepted
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'accepted' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to accept booking');
      }

      // Refresh bookings
      const updatedBookings = await bookingService.getBookingsForOwner();
      setBookings(updatedBookings);
      
      // Show success message
      alert('Booking request accepted successfully!');
      console.log('✅ Booking updated:', data);
    } catch (err) {
      console.error('❌ Error accepting booking:', err);
      alert(err.message || 'Failed to accept booking request. Please try again.');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      // Update booking status to rejected
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to reject booking');
      }

      // Refresh bookings
      const updatedBookings = await bookingService.getBookingsForOwner();
      setBookings(updatedBookings);
      
      // Show success message
      alert('Booking request rejected successfully!');
      console.log('✅ Booking updated:', data);
    } catch (err) {
      console.error('❌ Error rejecting booking:', err);
      alert(err.message || 'Failed to reject booking request. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
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

  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const otherBookings = bookings.filter(booking => booking.status !== 'pending');
  const displayBookings = activeTab === 'pending' ? pendingBookings : otherBookings;

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
              <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
              <p className="text-gray-600">Manage booking requests for your properties</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-[#ff385c] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaBell className="inline mr-2" />
                Pending Requests ({pendingBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('other')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'other'
                    ? 'bg-[#ff385c] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaCalendarAlt className="inline mr-2" />
                Other Bookings ({otherBookings.length})
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {displayBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaBell className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab === 'pending' ? 'pending requests' : 'other bookings'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'pending' 
                ? 'You don\'t have any pending booking requests for your properties.'
                : 'You don\'t have any other bookings for your properties.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="flex items-center text-gray-600">
                            <FaUser className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Guest</p>
                              <p className="text-sm font-medium">{booking.guest_name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{booking.guest_email || ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Check-in</p>
                              <p className="text-sm font-medium">{formatDate(booking.start_date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Check-out</p>
                              <p className="text-sm font-medium">{formatDate(booking.end_date)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center text-gray-600">
                            <FaUser className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Guests</p>
                              <p className="text-sm font-medium">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaHome className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Total Amount</p>
                              <p className="text-sm font-semibold">${booking.total_amount}</p>
                            </div>
                          </div>
                        </div>

                        {/* Selected Services */}
                        {booking.services && booking.services.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Additional Services:</p>
                            <div className="flex flex-wrap gap-1">
                              {booking.services.map((service, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {service.service_name || service.service_title} (${service.service_price})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => window.open(`/booking-success/${booking.id}`, '_blank')}
                        className="flex items-center px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptBooking(booking.id)}
                            className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <FaCheckCircle className="mr-2" />
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking.id)}
                            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <FaTimes className="mr-2" />
                            Reject Request
                          </button>
                        </>
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

export default BookingRequests; 
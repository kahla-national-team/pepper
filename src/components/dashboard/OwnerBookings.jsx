import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUser, FaHome, FaCheckCircle, FaTimes, FaEye } from 'react-icons/fa';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

const OwnerBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchOwnerBookings = async () => {
      try {
        setLoading(true);
        const bookingsData = await bookingService.getBookingsForOwner();
        setBookings(bookingsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching owner bookings:', err);
        setError(err.message || 'Failed to fetch bookings');
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

      if (response.ok) {
        // Refresh bookings
        const updatedBookings = await bookingService.getBookingsForOwner();
        setBookings(updatedBookings);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to accept booking');
      }
    } catch (err) {
      console.error('Error accepting booking:', err);
      setError(err.message || 'Error accepting booking');
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

      if (response.ok) {
        // Refresh bookings
        const updatedBookings = await bookingService.getBookingsForOwner();
        setBookings(updatedBookings);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to reject booking');
      }
    } catch (err) {
      console.error('Error rejecting booking:', err);
      setError(err.message || 'Error rejecting booking');
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

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'pending' || booking.status === 'accepted'
  );

  const pastBookings = bookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled'
  );

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Property Bookings</h2>
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-[#ff385c] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-[#ff385c] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Past ({pastBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        {displayBookings.length === 0 ? (
          <div className="text-center py-8">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-gray-500">
              {activeTab === 'upcoming' 
                ? 'You don\'t have any upcoming bookings for your properties.'
                : 'You don\'t have any past bookings for your properties.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayBookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={booking.rental_image || '/placeholder-stay.jpg'}
                      alt={booking.rental_title}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-stay.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{booking.rental_title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center text-gray-600">
                          <FaUser className="text-[#ff385c] mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Guest</p>
                            <p className="text-sm font-medium">{booking.guest_name || 'Unknown'}</p>
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <FaHome className="text-[#ff385c] mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-sm font-semibold">${booking.total_amount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => window.open(`/booking-success/${booking.id}`, '_blank')}
                      className="flex items-center px-3 py-1 bg-[#ff385c] text-white rounded text-sm hover:bg-[#e31c5f] transition-colors"
                    >
                      <FaEye className="mr-1" />
                      View
                    </button>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptBooking(booking.id)}
                          className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                        >
                          <FaCheckCircle className="mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectBooking(booking.id)}
                          className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                        >
                          <FaTimes className="mr-1" />
                          Reject
                        </button>
                      </>
                    )}
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

export default OwnerBookings;
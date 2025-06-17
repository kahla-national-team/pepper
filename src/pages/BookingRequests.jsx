import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaHome, FaCheckCircle, FaTimes, FaEye, FaBell, FaConciergeBell, FaClock } from 'react-icons/fa';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

const BookingRequests = () => {
  console.log('BookingRequests component rendering');
  const navigate = useNavigate();
  const auth = useAuth();
  console.log('Auth context in BookingRequests:', auth);
  const [bookings, setBookings] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [activeType, setActiveType] = useState('all'); // 'all', 'property', 'concierge'

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // Fetch both property bookings and concierge service requests
        const [bookingsResponse, serviceRequestsResponse] = await Promise.all([
          bookingService.getBookingsForOwner(),
          bookingService.getProviderConciergeBookings()
        ]);
        
        setBookings(bookingsResponse.data || []);
        setServiceRequests(serviceRequestsResponse.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError(err.message || 'Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    if (auth) {
      fetchRequests();
    }
  }, [auth]);

  const handleAcceptRequest = async (id, type) => {
    try {
      const endpoint = type === 'concierge' 
        ? `/service-requests/${id}/status`
        : `/bookings/${id}/status`;

      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'accepted' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to accept request');
      }

      // Refresh requests
      const [bookingsResponse, serviceRequestsResponse] = await Promise.all([
        bookingService.getBookingsForOwner(),
        bookingService.getProviderConciergeBookings()
      ]);
      
      setBookings(bookingsResponse.data || []);
      setServiceRequests(serviceRequestsResponse.data || []);
      
      alert('Request accepted successfully!');
    } catch (err) {
      console.error('Error accepting request:', err);
      alert(err.message || 'Failed to accept request. Please try again.');
    }
  };

  const handleRejectRequest = async (id, type) => {
    try {
      const endpoint = type === 'concierge' 
        ? `/service-requests/${id}/status`
        : `/bookings/${id}/status`;

      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to reject request');
      }

      // Refresh requests
      const [bookingsResponse, serviceRequestsResponse] = await Promise.all([
        bookingService.getBookingsForOwner(),
        bookingService.getProviderConciergeBookings()
      ]);
      
      setBookings(bookingsResponse.data || []);
      setServiceRequests(serviceRequestsResponse.data || []);
      
      alert('Request rejected successfully!');
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert(err.message || 'Failed to reject request. Please try again.');
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

  // Filter requests based on active tab and type
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const pendingServiceRequests = serviceRequests.filter(request => request.status === 'pending');
  const acceptedBookings = bookings.filter(booking => booking.status === 'accepted');
  const acceptedServiceRequests = serviceRequests.filter(request => request.status === 'accepted');
  const otherBookings = bookings.filter(booking => !['pending', 'accepted'].includes(booking.status));
  const otherServiceRequests = serviceRequests.filter(request => !['pending', 'accepted'].includes(request.status));

  const displayRequests = activeTab === 'pending' 
    ? (activeType === 'all' 
        ? [...pendingBookings, ...pendingServiceRequests]
        : activeType === 'property' 
          ? pendingBookings 
          : pendingServiceRequests)
    : activeTab === 'accepted'
    ? (activeType === 'all'
        ? [...acceptedBookings, ...acceptedServiceRequests]
        : activeType === 'property'
          ? acceptedBookings
          : acceptedServiceRequests)
    : (activeType === 'all'
        ? [...otherBookings, ...otherServiceRequests]
        : activeType === 'property'
          ? otherBookings
          : otherServiceRequests);

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
              <p className="text-gray-600">Manage booking and service requests</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-[#ff385c] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaBell className="inline mr-2" />
                Pending Requests ({pendingBookings.length + pendingServiceRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'accepted'
                    ? 'bg-[#ff385c] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaCheckCircle className="inline mr-2" />
                Accepted Requests ({acceptedBookings.length + acceptedServiceRequests.length})
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
                Other Requests ({otherBookings.length + otherServiceRequests.length})
              </button>
            </div>

            {/* Type Filter */}
            <div className="mt-4 flex flex-wrap gap-4">
              <button
                onClick={() => setActiveType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeType === 'all'
                    ? 'bg-[#ff385c] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setActiveType('property')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeType === 'property'
                    ? 'bg-[#ff385c] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaHome className="inline mr-2" />
                Property Bookings
              </button>
              <button
                onClick={() => setActiveType('concierge')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeType === 'concierge'
                    ? 'bg-[#ff385c] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaConciergeBell className="inline mr-2" />
                Concierge Services
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {displayRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaBell className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab} requests
            </h3>
            <p className="text-gray-500">
              {activeTab === 'pending' 
                ? 'You don\'t have any pending requests.'
                : activeTab === 'accepted'
                ? 'You don\'t have any accepted requests.'
                : 'You don\'t have any other requests.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className="ml-4 text-sm text-gray-500">
                          {request.service_type === 'concierge' ? 'Concierge Service' : 'Property Booking'}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {request.service_name || request.rental_title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center text-gray-600">
                          <FaUser className="text-[#ff385c] mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Customer</p>
                            <p className="text-sm font-medium">{request.customer_name || request.guest_name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{request.customer_email || request.guest_email || ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="text-[#ff385c] mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-medium">
                              {formatDate(request.requested_date || request.start_date)}
                            </p>
                          </div>
                        </div>
                        {request.service_type === 'concierge' ? (
                          <div className="flex items-center text-gray-600">
                            <FaClock className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Time</p>
                              <p className="text-sm font-medium">{request.requested_time}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Check-out</p>
                              <p className="text-sm font-medium">{formatDate(request.end_date)}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {request.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{request.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => window.open(`/booking-success/${request.id}`, '_blank')}
                        className="flex items-center px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptRequest(request.id, request.service_type)}
                            className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <FaCheckCircle className="mr-2" />
                            Accept Request
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id, request.service_type)}
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
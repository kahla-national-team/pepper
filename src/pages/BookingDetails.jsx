import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaUser,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaStar
} from 'react-icons/fa';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBooking(id);
      setBooking(response.data || response);
      setError(null);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError(err.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancelling(true);
      await bookingService.cancelBooking(id);
      // Refresh booking details
      await fetchBookingDetails();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FaClock className="w-4 h-4" />;
      case 'accepted':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'rejected':
      case 'cancelled':
        return <FaTimesCircle className="w-4 h-4" />;
      case 'completed':
        return <FaCheckCircle className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Booking Not Found</h2>
          <p className="text-gray-600">The booking you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === booking.owner_id;
  const canCancel = booking.status === 'pending' || booking.status === 'accepted';
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-[#ff385c] mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Bookings
        </button>

        {/* Booking Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Booking #{booking.id}
              </h1>
              <p className="text-gray-600">
                {booking.property_name || 'Property Booking'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                <span className="ml-2 capitalize">{booking.status}</span>
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-5 h-5 text-[#ff385c] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">{formatDate(booking.start_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-5 h-5 text-[#ff385c] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">{formatDate(booking.end_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaUsers className="w-5 h-5 text-[#ff385c] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Guests</p>
                      <p className="font-medium">{booking.guests || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaCreditCard className="w-5 h-5 text-[#ff385c] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium text-lg text-[#ff385c]">
                        {formatCurrency(booking.total_amount)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-5 h-5 text-[#ff385c] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Booked On</p>
                      <p className="font-medium">{formatDate(booking.created_at)}</p>
                    </div>
                  </div>
                  
                  {booking.updated_at && (
                    <div className="flex items-center">
                      <FaClock className="w-5 h-5 text-[#ff385c] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium">{formatDate(booking.updated_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Property Information */}
            {booking.property_name && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Information</h2>
                
                <div className="flex items-center mb-4">
                  <FaHome className="w-5 h-5 text-[#ff385c] mr-3" />
                  <div>
                    <p className="font-medium text-lg">{booking.property_name}</p>
                    {booking.address && (
                      <p className="text-gray-600">{booking.address}</p>
                    )}
                  </div>
                </div>
                
                {booking.description && (
                  <p className="text-gray-600">{booking.description}</p>
                )}
              </motion.div>
            )}

            {/* Services (if any) */}
            {booking.services && booking.services.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Services</h2>
                
                <div className="space-y-3">
                  {booking.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <p className="font-medium text-[#ff385c]">
                        {formatCurrency(service.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isOwner ? 'Guest Information' : 'Host Information'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser className="w-5 h-5 text-[#ff385c] mr-3" />
                  <div>
                    <p className="font-medium">
                      {isOwner ? booking.renter_name : booking.owner_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isOwner ? booking.renter_email : booking.owner_email}
                    </p>
                  </div>
                </div>
                
                {booking.phone && (
                  <div className="flex items-center">
                    <FaPhone className="w-5 h-5 text-[#ff385c] mr-3" />
                    <p className="font-medium">{booking.phone}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              
              <div className="space-y-3">
                {canCancel && !isCancelled && (
                  <button
                    onClick={handleCancelBooking}
                    disabled={cancelling}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
                
                <Link
                  to="/bookings"
                  className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
                >
                  View All Bookings
                </Link>
                
                {booking.property_name && (
                  <Link
                    to={`/details/stay/${booking.rental_id}`}
                    className="block w-full px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors text-center"
                  >
                    View Property
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails; 
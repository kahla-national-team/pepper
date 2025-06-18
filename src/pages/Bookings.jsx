import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaCreditCard, FaEye, FaTimes, FaClock, FaConciergeBell, FaHome, FaDollarSign, FaExclamationTriangle, FaRedoAlt } from 'react-icons/fa';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

const Bookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [conciergeBookings, setConciergeBookings] = useState([]);
  const [rentalBookings, setRentalBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'rental', 'property', 'concierge'
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching all user bookings...');
        
        // Use the new getAllUserBookings function for better efficiency
        const allBookings = await bookingService.getAllUserBookings();
        
        console.log('All bookings fetched:', allBookings);
        
        // Set the different types of bookings
        setBookings(allBookings.property || []);
        setConciergeBookings(allBookings.concierge || []);
        setRentalBookings(allBookings.rental || []);
        
        console.log('All bookings fetched successfully');
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to fetch bookings');
        // Set empty arrays on error to prevent iteration issues
        setBookings([]);
        setConciergeBookings([]);
        setRentalBookings([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchBookings();
    }
  }, [user, refreshKey]);

  // Calculate time remaining for the next booking
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const propertyBookings = Array.isArray(bookings) ? bookings : [];
      const conciergeBookingsArray = Array.isArray(conciergeBookings) ? conciergeBookings : [];
      const rentalBookingsArray = Array.isArray(rentalBookings) ? rentalBookings : [];
      const allBookings = [...propertyBookings, ...conciergeBookingsArray, ...rentalBookingsArray];
      
      console.log('Calculating time remaining for bookings:', allBookings.length);
      
      const upcomingBookings = allBookings
        .filter(booking => {
          const bookingDate = new Date(booking.start_date || booking.requested_date);
          return bookingDate > now && ['accepted', 'confirmed', 'pending'].includes(booking.status);
        })
        .sort((a, b) => new Date(a.start_date || a.requested_date) - new Date(b.start_date || b.requested_date));

      if (upcomingBookings.length > 0) {
        const nextBooking = upcomingBookings[0];
        const bookingDate = new Date(nextBooking.start_date || nextBooking.requested_date);
        const endDate = new Date(nextBooking.end_date || nextBooking.requested_date);
        const startDiff = bookingDate - now;
        const endDiff = endDate - now;

        const startDays = Math.floor(startDiff / (1000 * 60 * 60 * 24));
        const startHours = Math.floor((startDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const startMinutes = Math.floor((startDiff % (1000 * 60 * 60)) / (1000 * 60));

        const endDays = Math.floor(endDiff / (1000 * 60 * 60 * 24));
        const endHours = Math.floor((endDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const endMinutes = Math.floor((endDiff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeRemaining({
          booking: nextBooking,
          start: {
            days: startDays,
            hours: startHours,
            minutes: startMinutes
          },
          end: {
            days: endDays,
            hours: endHours,
            minutes: endMinutes
          }
        });
      } else {
        setTimeRemaining(null);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [bookings, conciergeBookings, rentalBookings]);

  const handleCancelBooking = async (id, type) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        if (type === 'concierge') {
          await bookingService.cancelConciergeBooking(id);
          setConciergeBookings(prev => prev.filter(booking => booking.id !== id));
        } else if (type === 'rental') {
          await bookingService.cancelRentalBooking(id);
          setRentalBookings(prev => prev.filter(booking => booking.id !== id));
        } else {
          await bookingService.cancelBooking(id);
          setBookings(prev => prev.filter(booking => booking.id !== id));
        }
        
        // Refresh the data
        setRefreshKey(prev => prev + 1);
        alert('Booking cancelled successfully!');
      } catch (err) {
        console.error('Error canceling booking:', err);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const time = timeString ? ` at ${timeString}` : '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + time;
  };

  const filteredBookings = () => {
    const propertyBookings = Array.isArray(bookings) ? bookings : [];
    const conciergeBookingsArray = Array.isArray(conciergeBookings) ? conciergeBookings : [];
    const rentalBookingsArray = Array.isArray(rentalBookings) ? rentalBookings : [];
    
    let allBookings = [];
    
    switch (activeTab) {
      case 'property':
        allBookings = propertyBookings;
        break;
      case 'rental':
        allBookings = rentalBookingsArray;
        break;
      case 'concierge':
        allBookings = conciergeBookingsArray;
        break;
      default:
        // Combine all bookings and remove duplicates based on ID
        const seenIds = new Set();
        allBookings = [...propertyBookings, ...rentalBookingsArray, ...conciergeBookingsArray]
          .filter(booking => {
            if (seenIds.has(booking.id)) {
              return false;
            }
            seenIds.add(booking.id);
            return true;
          });
        break;
    }
    
    return allBookings;
  };

  const getBookingType = (booking) => {
    if (booking.service_name) return 'Concierge Service';
    if (booking.rental_id || booking.rental_title) return 'Rental Booking';
    return 'Property Booking';
  };

  const getBookingIcon = (booking) => {
    if (booking.service_name) return <FaConciergeBell className="text-[#ff385c] mr-2" />;
    if (booking.rental_id || booking.rental_title) return <FaHome className="text-[#ff385c] mr-2" />;
    return <FaMapMarkerAlt className="text-[#ff385c] mr-2" />;
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
            >
              Try Again
            </button>
          <button
            onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go Home
          </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
          >
            <FaRedoAlt className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'all'
                ? 'bg-[#ff385c] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveTab('rental')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'rental'
                ? 'bg-[#ff385c] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Rental Bookings
          </button>
          <button
            onClick={() => setActiveTab('property')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'property'
                ? 'bg-[#ff385c] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Property Bookings
          </button>
          <button
            onClick={() => setActiveTab('concierge')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'concierge'
                ? 'bg-[#ff385c] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Concierge Services
          </button>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#ff385c]">{filteredBookings().length}</div>
              <div className="text-sm text-gray-500">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredBookings().filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredBookings().filter(b => ['accepted', 'confirmed'].includes(b.status)).length}
              </div>
              <div className="text-sm text-gray-500">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredBookings().filter(b => b.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
          
          {/* Debug Information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Debug Info:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Property Bookings: {bookings.length}</div>
                <div>Rental Bookings: {rentalBookings.length}</div>
                <div>Concierge Bookings: {conciergeBookings.length}</div>
                <div>Active Tab: {activeTab}</div>
                <div>User ID: {user?.id}</div>
              </div>
            </div>
          )}
                        </div>
                        
        {/* Next Booking Countdown */}
        {timeRemaining && (
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex flex-col space-y-6">
              {/* Start Time Countdown */}
              <div className="flex items-center justify-between">
                            <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Next Booking</h2>
                  <p className="text-gray-600">
                    {timeRemaining.booking.service_name || timeRemaining.booking.rental_title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Starts: {formatDate(timeRemaining.booking.start_date || timeRemaining.booking.requested_date)}
                  </p>
                            </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#ff385c]">{timeRemaining.start.days}</div>
                    <div className="text-sm text-gray-500">Days</div>
                          </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#ff385c]">{timeRemaining.start.hours}</div>
                    <div className="text-sm text-gray-500">Hours</div>
                            </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#ff385c]">{timeRemaining.start.minutes}</div>
                    <div className="text-sm text-gray-500">Minutes</div>
                            </div>
                          </div>
                        </div>

              {/* End Time Countdown */}
              <div className="flex items-center justify-between border-t pt-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Ends</h3>
                  <p className="text-sm text-gray-500">
                    Ends: {formatDate(timeRemaining.booking.end_date || timeRemaining.booking.requested_date)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#ff385c]">{timeRemaining.end.days}</div>
                    <div className="text-sm text-gray-500">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#ff385c]">{timeRemaining.end.hours}</div>
                    <div className="text-sm text-gray-500">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#ff385c]">{timeRemaining.end.minutes}</div>
                    <div className="text-sm text-gray-500">Minutes</div>
                  </div>
                </div>
              </div>
                            </div>
                          </div>
                        )}

        {/* Bookings List */}
        <div className="grid gap-6">
          {filteredBookings().map((booking) => {
            // Create unique key by combining booking type and ID
            const bookingType = getBookingType(booking).toLowerCase().replace(' ', '-');
            const uniqueKey = `${bookingType}-${booking.id}`;
            
            return (
              <div key={uniqueKey} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                            <div>
                      <div className="flex items-center mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className="ml-4 text-sm text-gray-500">
                          {getBookingType(booking)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.service_name || booking.rental_title || booking.property_name}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                        className="p-2 text-gray-600 hover:text-gray-900"
                      >
                        <FaEye />
                      </button>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id, booking.service_type || (booking.rental_id ? 'rental' : 'property'))}
                          className="p-2 text-red-600 hover:text-red-900"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center text-gray-600">
                      <FaUser className="text-[#ff385c] mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="text-sm font-medium">{booking.customer_name || booking.guest_name || booking.renter_name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{booking.customer_email || booking.guest_email || booking.renter_email || ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="text-[#ff385c] mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-medium">
                          {formatDateTime(booking.start_date || booking.requested_date, booking.requested_time)}
                        </p>
                        {booking.end_date && (
                          <p className="text-xs text-gray-500">
                            Ends: {formatDate(booking.end_date)}
                          </p>
                        )}
                      </div>
                    </div>
                    {booking.service_type === 'concierge' ? (
                      <div className="flex items-center text-gray-600">
                        <FaClock className="text-[#ff385c] mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="text-sm font-medium">{booking.requested_time || 'N/A'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        {getBookingIcon(booking)}
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium">{booking.location || booking.city || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <FaCreditCard className="text-[#ff385c] mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-sm font-medium">${booking.total_amount || booking.price || 'N/A'}</p>
                        {booking.payment_status && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                            {booking.payment_status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
      </div>
    </div>
  );
};

export default Bookings; 
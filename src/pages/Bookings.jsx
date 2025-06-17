import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaCreditCard, FaEye, FaTimes, FaClock } from 'react-icons/fa';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

const Bookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [conciergeBookings, setConciergeBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const [propertyBookings, conciergeData] = await Promise.all([
          bookingService.getUserBookings(),
          bookingService.getUserConciergeBookings()
        ]);
        setBookings(propertyBookings.data || []);
        setConciergeBookings(conciergeData.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  // Calculate time remaining for the next booking
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const allBookings = [
        ...bookings.map(b => ({ ...b, type: 'property' })),
        ...conciergeBookings.map(b => ({ ...b, type: 'concierge' }))
      ];
      
      const upcomingBookings = allBookings
        .filter(booking => {
          const bookingDate = new Date(booking.start_date || booking.requested_date);
          return bookingDate > now && booking.status === 'accepted';
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
  }, [bookings, conciergeBookings]);

  const handleCancelBooking = async (bookingId, type) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        if (type === 'concierge') {
          await bookingService.cancelConciergeBooking(bookingId);
        } else {
          await bookingService.cancelBooking(bookingId);
        }
        // Refresh the bookings list
        const [propertyBookings, conciergeData] = await Promise.all([
          bookingService.getUserBookings(),
          bookingService.getUserConciergeBookings()
        ]);
        setBookings(propertyBookings.data || []);
        setConciergeBookings(conciergeData.data || []);
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
      case 'rejected':
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
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const allBookings = [
    ...bookings.map(b => ({ ...b, type: 'property' })),
    ...conciergeBookings.map(b => ({ ...b, type: 'concierge' }))
  ].sort((a, b) => new Date(b.start_date || b.requested_date) - new Date(a.start_date || a.requested_date));

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
              <p className="text-gray-600">View and manage your bookings</p>
            </div>
          </div>
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
        {allBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaCalendarAlt className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-500">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {allBookings.map((booking) => (
              <div
                key={`${booking.type}-${booking.id}`}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className="ml-4 text-sm text-gray-500">
                          {booking.type === 'concierge' ? 'Concierge Service' : 'Property Booking'}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {booking.service_name || booking.rental_title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center text-gray-600">
                          <FaUser className="text-[#ff385c] mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Provider</p>
                            <p className="text-sm font-medium">{booking.provider_name || booking.owner_name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{booking.provider_email || booking.owner_email || ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="text-[#ff385c] mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-medium">
                              {formatDate(booking.start_date || booking.requested_date)}
                            </p>
                          </div>
                        </div>
                        {booking.type === 'concierge' ? (
                          <div className="flex items-center text-gray-600">
                            <FaClock className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Time</p>
                              <p className="text-sm font-medium">{booking.requested_time}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="text-[#ff385c] mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Check-out</p>
                              <p className="text-sm font-medium">{formatDate(booking.end_date)}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {booking.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{booking.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => window.open(`/booking-success/${booking.id}`, '_blank')}
                        className="flex items-center px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </button>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id, booking.type)}
                          className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <FaTimes className="mr-2" />
                          Cancel Booking
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
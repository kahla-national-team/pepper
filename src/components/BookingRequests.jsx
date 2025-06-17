import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an auth context

const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get the current user

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await bookingService.getBookingsForOwner();
        setBookings(response.data || []);
      } catch (error) {
        console.error('Error fetching owner bookings:', error);
        setError(error.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchBookings();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#ff385c]/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No booking requests found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-[#ff385c] mb-6">Booking Requests</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div 
            key={booking.id} 
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{booking.service_name}</h3>
                <p className="text-gray-600">{booking.user_name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <p>Date: {new Date(booking.start_date).toLocaleDateString()}</p>
                <p>Time: {new Date(booking.start_date).toLocaleTimeString()}</p>
              </div>
              <div className="space-x-2">
                {booking.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleBookingAction(booking.id, 'confirm')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => handleBookingAction(booking.id, 'reject')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingRequests; 
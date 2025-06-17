import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaCreditCard, FaEnvelope, FaClock } from 'react-icons/fa';
import { bookingService } from '../services/bookingService';

const BookingSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!id) {
          throw new Error('Booking ID is required');
        }
        console.log('Fetching booking details for ID:', id); // Debug log
        const response = await bookingService.getBooking(id);
        console.log('Booking details response:', response); // Debug log
        
        if (response.success && response.request) {
          setBooking(response.request);
        } else {
          throw new Error('Invalid booking data received');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-lg text-red-500 mb-4">{error || 'Booking not found'}</div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-green-50 px-6 py-8 text-center">
            <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Request Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Your service request has been successfully submitted. Request ID: {booking.id}
            </p>
          </div>

          {/* Booking Details */}
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Request Details</h2>
            
            <div className="space-y-6">
              {/* Service Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="text-[#ff385c] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(booking.requested_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FaClock className="text-[#ff385c] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{booking.requested_time}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FaCreditCard className="text-[#ff385c] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium">${booking.total_amount}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FaCheckCircle className="text-[#ff385c] mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{booking.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Additional Notes</h4>
                  <p className="text-gray-700">{booking.notes}</p>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">A confirmation email has been sent to your registered email address.</p>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">You can view your service request details anytime in your account dashboard.</p>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">The service provider will contact you shortly to confirm your request.</p>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
              >
                View All Requests
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingSuccess; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { bookingService } from '../services/bookingService';

const ConciergeBookingForm = ({ service, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate time slots from 8 AM to 8 PM
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const calculateTotal = () => {
    if (!service?.price) return 0;
    const pricePerHour = parseInt(service.price.replace(/[^0-9]/g, ''));
    return pricePerHour * duration;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = {
        service_id: service.id,
        requested_date: selectedDate.toISOString().split('T')[0],
        requested_time: selectedTime,
        duration: duration,
        total_amount: calculateTotal(),
        notes: notes || ''
      };

      const response = await bookingService.createConciergeBooking(formData);
      console.log('Service request response:', response); // Debug log
      
      if (response.success && response.request) {
        onSuccess(response.request);
        navigate(`/booking-success/${response.request.id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
              placeholderText="Select a date"
            />
            <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
          >
            <option value="">Select a time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (hours)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
              <option key={hours} value={hours}>
                {hours} {hours === 1 ? 'hour' : 'hours'}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
            placeholder="Any special requirements or notes for the service provider"
          />
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {service?.price} x {duration} hours
              </span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedDate || !selectedTime}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
            loading || !selectedDate || !selectedTime
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#ff385c] hover:bg-[#e31c5f]'
          } transition-colors`}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default ConciergeBookingForm; 
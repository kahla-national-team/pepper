import React, { useState } from 'react';
import { FaCalendarAlt, FaUsers, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import bookingService from '../services/bookingService';
import ServiceSelection from './ServiceSelection';

const BookingForm = ({ item, onSuccess, onCancel }) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const getServicePrice = (service) => {
    // Extract numeric price from string like "$50/hour"
    const priceMatch = service.price.match(/\$(\d+)/);
    return priceMatch ? parseInt(priceMatch[1]) : 0;
  };

  const calculateServicesTotal = () => {
    return selectedServices.reduce((total, service) => {
      return total + getServicePrice(service);
    }, 0);
  };

  const nights = calculateNights();
  const itemPrice = parseFloat(item.price) || 0;
  const subtotal = nights * itemPrice;
  const servicesTotal = calculateServicesTotal();
  const taxRate = 0.19; // 19% tax rate
  const taxes = Math.round((subtotal + servicesTotal) * taxRate);
  const total = subtotal + servicesTotal + taxes;

  // Ensure total is never 0 or negative
  const finalTotal = Math.max(total, 0);

  // Debug price calculation
  console.log('BookingForm - Price calculation debug:', {
    item: item,
    itemPrice: itemPrice,
    originalPrice: item.price,
    nights: nights,
    subtotal: subtotal,
    selectedServices: selectedServices,
    servicesTotal: servicesTotal,
    taxRate: taxRate,
    taxes: taxes,
    total: total,
    finalTotal: finalTotal
  });

  const handleServicesChange = (services) => {
    console.log('BookingForm - Services changed:', services);
    setSelectedServices(services);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    console.log('BookingForm - Before validation:', {
      item,
      nights,
      total,
      checkIn,
      checkOut,
      guests
    });

    // Validate item data
    if (!item || !item.id || !item.price) {
      console.log('Validation failed - item data:', { item, hasId: !!item?.id, hasPrice: !!item?.price });
      setError('Invalid rental data. Please refresh the page and try again.');
      return;
    }

    // Validate price
    if (!item.price || item.price <= 0 || isNaN(parseFloat(item.price))) {
      console.log('Validation failed - price:', { 
        price: item.price, 
        parsedPrice: parseFloat(item.price),
        isNaN: isNaN(parseFloat(item.price)),
        isValid: !!(item.price && item.price > 0 && !isNaN(parseFloat(item.price))) 
      });
      setError('Invalid rental price. Please refresh the page and try again.');
      return;
    }

    // Validate calculated values
    if (nights <= 0 || finalTotal <= 0) {
      console.log('Validation failed - calculated values:', { nights, total, finalTotal, isValid: !!(nights > 0 && finalTotal > 0) });
      setError('Invalid booking dates or pricing. Please check your selection.');
      return;
    }

    // Validate date range
    if (checkIn >= checkOut) {
      console.log('Validation failed - date range:', { checkIn, checkOut });
      setError('Check-out date must be after check-in date.');
      return;
    }

    // Validate rental ID
    const rentalId = parseInt(item.id);
    if (isNaN(rentalId)) {
      console.log('Validation failed - rental ID:', { id: item.id, parsed: rentalId });
      setError('Invalid rental ID. Please refresh the page and try again.');
      return;
    }

    // Validate total amount
    const totalAmount = parseFloat(finalTotal);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      console.log('Validation failed - total amount:', { total, finalTotal, parsed: totalAmount, isValid: !!(totalAmount && totalAmount > 0) });
      setError('Invalid total amount. Please check your selection.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('BookingForm - item object:', item);
      console.log('BookingForm - calculated values:', { nights, subtotal, servicesTotal, taxRate, taxes, total, finalTotal });

      const bookingData = {
        rental_id: rentalId,
        start_date: checkIn.toISOString().split('T')[0],
        end_date: checkOut.toISOString().split('T')[0],
        total_amount: totalAmount,
        guests: parseInt(guests),
        services: selectedServices.map(service => ({
          id: service.id,
          name: service.title || service.name,
          price: getServicePrice(service)
        }))
      };

      console.log('BookingForm - sending booking data:', bookingData);

      const response = await bookingService.createBooking(bookingData);
      onSuccess(response.booking);
    } catch (err) {
      console.error('BookingForm - error:', err);
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Complete Your Booking</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Date
              </label>
              <DatePicker
                selected={checkIn}
                onChange={setCheckIn}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
                placeholderText="Select check-in date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out Date
              </label>
              <DatePicker
                selected={checkOut}
                onChange={setCheckOut}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
                placeholderText="Select check-out date"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c]"
            >
              {[...Array(item.maxGuests)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Services */}
          <ServiceSelection
            onServicesChange={handleServicesChange}
            selectedServices={selectedServices}
          />

          {/* Price Breakdown */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Price Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  ${isNaN(itemPrice) ? '0' : itemPrice} x {nights} nights
                </span>
                <span>${isNaN(subtotal) ? '0' : subtotal}</span>
              </div>
              {servicesTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Additional Services</span>
                  <span>${isNaN(servicesTotal) ? '0' : servicesTotal}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes (19%)</span>
                <span>${isNaN(taxes) ? '0' : taxes}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${isNaN(finalTotal) ? '0' : finalTotal}</span>
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
            disabled={loading || !checkIn || !checkOut}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
              loading || !checkIn || !checkOut
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#ff385c] hover:bg-[#e31c5f]'
            } transition-colors`}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 
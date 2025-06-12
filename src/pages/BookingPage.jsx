import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaCreditCard } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { bookingService } from '../services/bookingService';
import { rentalService } from '../services/rentalService';
import { conciergeService } from '../services/conciergeService';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stay, setStay] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [ownerServices, setOwnerServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const fetchStayDetailsAndServices = async () => {
      try {
        setLoading(true);
        const rentalData = await rentalService.getRental(id);
        setStay(rentalData);
        setError(null);

        if (rentalData.ownerId) {
          const servicesData = await conciergeService.getServicesByUserId(rentalData.ownerId);
          setOwnerServices(servicesData);
        }

      } catch (err) {
        setError(err.message || 'Failed to fetch stay details or services');
      } finally {
        setLoading(false);
      }
    };

    fetchStayDetailsAndServices();
  }, [id]);

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prevSelected) => {
      const serviceToAdd = ownerServices.find(s => s.id === serviceId);
      if (!serviceToAdd) return prevSelected;

      return prevSelected.some(s => s.id === serviceId)
        ? prevSelected.filter((s) => s.id !== serviceId)
        : [...prevSelected, serviceToAdd];
    });
  };

  const calculateServicesTotal = () => {
    return selectedServices.reduce((total, service) => {
      return total + (service ? service.price : 0);
    }, 0);
  };

  const nights = calculateNights();
  const subtotal = nights * (stay?.price || 0);
  const cleaningFee = 75;
  const serviceFee = Math.round(subtotal * 0.12);
  const taxes = Math.round(subtotal * 0.08);
  const servicesTotal = calculateServicesTotal();
  const total = subtotal + cleaningFee + serviceFee + taxes + servicesTotal;

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    try {
      setProcessing(true);
      const bookingData = {
        rental_id: id,
        start_date: checkIn.toISOString().split('T')[0],
        end_date: checkOut.toISOString().split('T')[0],
        total_amount: total,
        guests: guests,
        services: selectedServices,
      };

      const response = await bookingService.createBooking(bookingData);
      navigate(`/booking-success/${response.booking.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setProcessing(false);
    }
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
          <p className="text-gray-600">{error}</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-[#ff385c] mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Stay Details
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>

            {/* Stay Summary */}
            <div className="flex items-start space-x-4 mb-8">
              <img
                src={stay.image || '/placeholder-stay.jpg'}
                alt={stay.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h2 className="font-semibold text-gray-900">{stay.title}</h2>
                <p className="text-gray-600 text-sm">{stay.address}</p>
              </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {[...Array(stay.max_guests)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Services Section */}
              {ownerServices.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Add Services</h3>
                  <div className="space-y-2">
                    {ownerServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedServices.some(s => s.id === service.id)}
                            onChange={() => handleServiceToggle(service.id)}
                            className="form-checkbox h-5 w-5 text-[#ff385c] rounded"
                          />
                          <span className="ml-2 text-gray-700">{service.name} ({service.category})</span>
                        </label>
                        <span className="text-gray-900">${service.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Price Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ${stay.price} x {nights} nights
                    </span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cleaning fee</span>
                    <span>${cleaningFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span>${taxes}</span>
                  </div>
                  {servicesTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Additional Services</span>
                      <span>${servicesTotal}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={processing || !checkIn || !checkOut}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                  processing || !checkIn || !checkOut
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#ff385c] hover:bg-[#e31c5f]'
                } transition-colors`}
              >
                {processing ? 'Processing...' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 
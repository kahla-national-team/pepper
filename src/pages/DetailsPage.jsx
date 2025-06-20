"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaClock, FaMapMarkerAlt, FaEnvelope, FaCheck, FaCalendarAlt } from 'react-icons/fa';
import { conciergeService } from '../services/conciergeService';
import Review from '../components/Review';
import { useAuth } from '../contexts/AuthContext';
import BookingForm from '../components/BookingForm';
import ConciergeBookingForm from '../components/ConciergeBookingForm';

const DetailsPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (type === 'concierge') {
          const response = await conciergeService.getServiceDetails(id);
          if (response.success) {
            setItem(response.data);
          } else {
            throw new Error(response.message || 'Failed to fetch service details');
          }
        } else {
          throw new Error('Invalid service type');
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError(err.message || 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [type, id]);

  // Helper function to format availability
  const formatAvailability = (availability) => {
    if (!availability) return null;
    if (Array.isArray(availability)) {
      return availability.join(', ');
    }
    if (typeof availability === 'string') {
      return availability;
    }
    return null;
  };

  // Helper function to extract numeric price from formatted string
  const extractNumericPrice = (priceString) => {
    if (!priceString) return 0;
    // Extract numeric value from strings like "$50/hour" or "$100"
    const priceMatch = priceString.match(/\$(\d+)/);
    return priceMatch ? parseInt(priceMatch[1]) : 0;
  };

  const handleBookClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (booking) => {
    setShowBookingForm(false);
    // Show success message or redirect to booking details
    navigate(`/booking-success/${booking.id}`);
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-lg text-red-500 mb-4">{error || 'Service not found'}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#ff385c] text-white font-medium rounded-lg hover:bg-[#e31c5f] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const formattedAvailability = formatAvailability(item?.availability);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#ff385c] hover:text-[#e31c5f] mb-8 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Services
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Main Content */}
            <div className="md:flex">
              {/* Image Section */}
              <div className="md:w-1/2 relative">
                <img
                  className="w-full h-64 md:h-full object-cover"
                  src={item?.image || '/placeholder-service.jpg'}
                  alt={item?.title || 'Service'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-service.jpg';
                  }}
                />
                {item?.category && (
                                      <div className="absolute top-4 right-4 bg-[#ff385c] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {item?.category}
                    </div>
                )}
              </div>

              {/* Details Section */}
              <div className="md:w-1/2 p-6 md:p-8">
                {/* Provider Info */}
                <div className="flex items-center mb-6">
                  <Link 
                    to={`/users/${item?.provider?.id || ''}`}
                    className="flex items-center hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={item?.provider?.image || '/placeholder-avatar.png'}
                      alt={item?.provider?.name || 'Provider'}
                      className="w-12 h-12 rounded-full border-2 border-[#ff385c] mr-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-avatar.png';
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 hover:text-[#ff385c] transition-colors">
                        {item?.provider?.name || 'Unknown Provider'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{item?.provider?.rating?.toFixed(1) || 'N/A'}</span>
                        <span className="mx-1">•</span>
                        <span>{item?.provider?.reviewCount || 0} reviews</span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Title and Description */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {item?.title || 'Service Details'}
                </h1>
                <p className="text-gray-600 mb-6">
                  {item?.details || 'No description available'}
                </p>

                {/* Service Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaClock className="text-[#ff385c] mr-2" />
                    <span>{item?.duration || 'N/A'} minutes</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="text-[#ff385c] mr-2" />
                    <span>{item?.location?.address || 'Location not specified'}</span>
                  </div>
                  {formattedAvailability && (
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="text-[#ff385c] mr-2" />
                      <span>{formattedAvailability}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(item?.features || []).map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <FaCheck className="text-[#ff385c] mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and Booking */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-[#ff385c]">{item?.price || 'Price not available'}</p>
                      <p className="text-sm text-gray-500">per service</p>
                    </div>
                    <button
                      className="px-8 py-3 bg-[#ff385c] text-white font-medium rounded-lg hover:bg-[#e31c5f] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff385c]"
                      onClick={handleBookClick}
                    >
                      Book Now
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                {item?.provider?.email && (
                  <div className="mt-6 flex items-center text-gray-600 bg-gray-50 p-4 rounded-lg">
                    <FaEnvelope className="text-[#ff385c] mr-2" />
                    <span>Contact provider: {item.provider.email}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Booking Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Book Now</h2>
                  <p className="text-gray-600">${item?.price} per night</p>
                </div>
                {!showBookingForm && (
                  <button
                    onClick={handleBookClick}
                    className="px-6 py-3 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
                  >
                    Book Now
                  </button>
                )}
              </div>

              {showBookingForm && (
                type === 'concierge' ? (
                  <ConciergeBookingForm
                    service={item}
                    onSuccess={handleBookingSuccess}
                    onCancel={handleBookingCancel}
                  />
                ) : (
                  <BookingForm
                    item={{
                      id: item?.id || id,
                      type: type,
                      price: extractNumericPrice(item?.price),
                      maxGuests: item?.maxGuests || 10
                    }}
                    onSuccess={handleBookingSuccess}
                    onCancel={handleBookingCancel}
                  />
                )
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
                <p className="text-gray-600 mt-1">What our customers are saying about this service</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="font-semibold">{item?.provider?.rating?.toFixed(1) || 'N/A'}</span>
                <span className="text-gray-500 ml-1">
                  ({item?.provider?.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Reviews Section */}
            <Review 
              itemId={id} 
              itemType="service" 
              onReviewSubmit={() => {
                fetchItemDetails();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsPage;
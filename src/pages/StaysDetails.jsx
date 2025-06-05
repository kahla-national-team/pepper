import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaStar, FaBed, FaBath, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaUser } from 'react-icons/fa';
import { rentalService } from '../services/rentalService';

const StaysDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stay, setStay] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const fetchStayDetails = async () => {
      try {
        setLoading(true);
        const data = await rentalService.getRental(id);
        setStay(data);
        
        // Fetch reviews for this stay
        const reviewsData = await rentalService.getRentalReviews(id);
        setReviews(reviewsData);
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch stay details');
      } finally {
        setLoading(false);
      }
    };

    fetchStayDetails();
  }, [id]);

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

  if (!stay) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Stay Not Found</h2>
          <p className="text-gray-600">The stay you're looking for doesn't exist or has been removed.</p>
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

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${index < rating ? 'text-yellow-400' : 'text-gray-300'} w-4 h-4`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-[#ff385c] mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Stays
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Section */}
          <div className="relative h-[400px] md:h-[500px]">
            <img
              src={stay.image || '/placeholder-stay.jpg'}
              alt={stay.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-stay.jpg';
              }}
            />
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-[#ff385c]">
              {stay.category || 'Stay'}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{stay.title}</h1>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{stay.address}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="font-semibold">{stay.provider?.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-gray-500 ml-1">
                  ({stay.provider?.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaBed className="text-[#ff385c] mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-semibold">{stay.bedrooms || 0}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaBath className="text-[#ff385c] mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-semibold">{stay.bathrooms || 0}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaUsers className="text-[#ff385c] mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Max Guests</p>
                  <p className="font-semibold">{stay.max_guests || 1}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="text-[#ff385c] mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="font-semibold">{stay.availability ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this stay</h2>
              <p className="text-gray-600 leading-relaxed">{stay.description}</p>
            </div>

            {/* Features */}
            {stay.features && stay.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stay.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <FaCheck className="text-[#ff385c] mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Information */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center mb-6">
                <img
                  src={stay.provider?.image || '/placeholder-avatar.png'}
                  alt={stay.provider?.name || 'Host'}
                  className="w-16 h-16 rounded-full mr-4"
                  onError={(e) => {
                    e.target.src = '/placeholder-avatar.png';
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Hosted by {stay.provider?.name || 'Host'}
                  </h3>
                  <p className="text-gray-600">Member since {stay.provider?.joinDate || '2024'}</p>
                </div>
              </div>

              {/* Contact Host */}
              {stay.provider?.email && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Host</h4>
                  <p className="text-gray-600">{stay.provider.email}</p>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Guest Reviews</h2>
                  <p className="text-gray-600 mt-1">What our guests are saying about this stay</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                    <div className="flex items-center mr-2">
                      {renderStars(Math.round(stay.provider?.rating || 0))}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {stay.provider?.rating?.toFixed(1) || '0.0'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stay.provider?.reviewCount || 0} reviews
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // TODO: Implement review submission
                      alert('Review submission coming soon!');
                    }}
                    className="px-6 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:ring-offset-2"
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(showAllReviews ? reviews : reviews.slice(0, 4)).map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="relative">
                              <img
                                src={review.user_image}
                                alt={review.user_name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-[#ff385c]"
                                onError={(e) => {
                                  e.target.src = '/placeholder-avatar.png';
                                }}
                              />
                              <div className="absolute -bottom-1 -right-1 bg-[#ff385c] text-white text-xs px-2 py-0.5 rounded-full">
                                {review.rating}
                              </div>
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium text-gray-900">{review.user_name}</h4>
                              <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                        </div>

                        {/* Review Content */}
                        <div className="space-y-4">
                          <p className="text-gray-600 line-clamp-3">{review.comment}</p>
                          
                          {/* Review Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => {
                                  // TODO: Implement helpful vote
                                  alert('Helpful vote coming soon!');
                                }}
                                className="flex items-center text-gray-500 hover:text-[#ff385c] transition-colors"
                              >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                Helpful
                              </button>
                              <button
                                onClick={() => {
                                  // TODO: Implement reply
                                  alert('Reply functionality coming soon!');
                                }}
                                className="flex items-center text-gray-500 hover:text-[#ff385c] transition-colors"
                              >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Reply
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                // TODO: Implement report
                                alert('Report functionality coming soon!');
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                    <FaStar className="text-gray-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-6">Be the first to share your experience at this stay</p>
                  <button
                    onClick={() => {
                      // TODO: Implement review submission
                      alert('Review submission coming soon!');
                    }}
                    className="px-6 py-3 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:ring-offset-2"
                  >
                    Write the First Review
                  </button>
                </div>
              )}

              {reviews.length > 4 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="inline-flex items-center px-6 py-3 border border-[#ff385c] text-[#ff385c] rounded-lg hover:bg-[#ff385c] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:ring-offset-2"
                  >
                    {showAllReviews ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                        Show Less
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        Show All {reviews.length} Reviews
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Booking Section */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#ff385c]">{stay.price}</p>
                  <p className="text-gray-600">per night</p>
                </div>
                <button
                  onClick={() => alert('Booking functionality coming soon!')}
                  className="mt-4 md:mt-0 px-8 py-3 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:ring-offset-2"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaysDetails; 
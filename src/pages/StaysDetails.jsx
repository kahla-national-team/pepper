import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaStar, FaBed, FaBath, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaUser } from 'react-icons/fa';
import { rentalService } from '../services/rentalService';
import { reviewService } from '../services/reviewService';
import Review from '../components/Review';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';
import RentalLocationMap from '../components/RentalLocationMap';

const StaysDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stay, setStay] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { user } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0
  });

  useEffect(() => {
    const fetchStayDetails = async () => {
      try {
        setLoading(true);
        const data = await rentalService.getRental(id);
        setStay(data);
        
        // Fetch reviews for this stay
        const reviewsData = await rentalService.getRentalReviews(id);
        setReviews(reviewsData);
        
        // Fetch review statistics
        const statsResponse = await reviewService.getItemReviewStats(id, 'rental');
        if (statsResponse.success) {
          setReviewStats(statsResponse.data);
        }
        
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

  const handleBookClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (booking) => {
    setShowBookingForm(false);
    navigate(`/booking-success/${booking.id}`);
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
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
            {/* Header Section with Review Stats */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{stay.title}</h1>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{stay.address}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`${
                          index < Math.round(reviewStats.averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        } w-5 h-5`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold text-gray-900">
                    {reviewStats.averageRating.toFixed(1)}
                </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
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

            {/* Location Map */}
            {stay.location && (
              <div className="mb-8">
                <RentalLocationMap 
                  location={stay.location}
                  address={stay.address}
                  title={stay.title}
                />
              </div>
            )}

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
              <Link 
                to={`/users/${stay.provider?.id}`}
                className="flex items-center mb-6 hover:opacity-80 transition-opacity"
              >
                <img
                  src={stay.provider?.image || '/placeholder-avatar.png'}
                  alt={stay.provider?.name || 'Host'}
                  className="w-16 h-16 rounded-full mr-4"
                  onError={(e) => {
                    e.target.src = '/placeholder-avatar.png';
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-[#ff385c] transition-colors">
                    Hosted by {stay.provider?.name || 'Host'}
                  </h3>
                  <p className="text-gray-600">Member since {stay.provider?.joinDate || '2024'}</p>
                </div>
              </Link>

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
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`${
                            index < Math.round(reviewStats.averageRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          } w-5 h-5`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold text-gray-900">
                      {reviewStats.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>

              {/* Review Posting Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Share Your Experience</h3>
                    <p className="text-sm text-gray-600">Help others by writing a review</p>
                  </div>
                </div>
                <Review 
                  itemId={id} 
                  itemType="rental" 
                  currentUser={user}
                  onReviewSubmit={() => {
                    fetchStayDetails();
                  }}
                />
              </div>

              {/* Existing Reviews */}
              <div className="space-y-6">
              <Review 
                itemId={id} 
                itemType="rental" 
                currentUser={user}
                  onReviewSubmit={() => {
                    fetchStayDetails();
                  }}
                  showReviewForm={false}
              />
              </div>
            </div>

            {/* Booking Section */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#ff385c]">${stay.price}</p>
                  <p className="text-gray-600">per night</p>
                </div>
                {!showBookingForm ? (
                  <button
                    onClick={handleBookClick}
                    className="mt-4 md:mt-0 px-8 py-3 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:ring-offset-2"
                  >
                    Book Now
                  </button>
                ) : (
                  <BookingForm
                    item={{
                      id,
                      type: 'stay',
                      price: stay.price,
                      maxGuests: stay.max_guests
                    }}
                    onSuccess={handleBookingSuccess}
                    onCancel={handleBookingCancel}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaysDetails; 
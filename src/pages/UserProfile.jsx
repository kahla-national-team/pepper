"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUserPlus, FaUserMinus, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaStar, FaChevronDown, FaPhone, FaGlobe, FaInfoCircle, FaHome, FaConciergeBell, FaComments } from 'react-icons/fa';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';
import { reviewService } from '../services/reviewService';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [averageRating, setAverageRating] = useState(0);
  
  // Pagination states
  const [visibleRentals, setVisibleRentals] = useState(6);
  const [visibleServices, setVisibleServices] = useState(6);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const ITEMS_PER_PAGE = 6;

  // Refs for smooth scrolling
  const overviewRef = useRef(null);
  const rentalsRef = useRef(null);
  const servicesRef = useRef(null);
  const reviewsRef = useRef(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Create axios instance with auth header
  const axiosWithAuth = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  // Function to scroll to section
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'overview':
        scrollToSection(overviewRef);
        break;
      case 'rentals':
        scrollToSection(rentalsRef);
        break;
      case 'services':
        scrollToSection(servicesRef);
        break;
      case 'reviews':
        scrollToSection(reviewsRef);
        break;
      default:
        break;
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await reviewService.getUserReviews(id);
      if (response.success) {
        setReviews(response.data || []);
      } else {
        console.error('Error in reviews response:', response.message);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  // Fetch average rating
  const fetchAverageRating = async () => {
    try {
      const response = await reviewService.getUserAverageRating(id);
      if (response.success) {
        setAverageRating(response.data.averageRating || 0);
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
      setAverageRating(0);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Validate user ID
      if (!id || isNaN(parseInt(id))) {
        setError('Invalid user ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Fetch user details (public route)
        const userRes = await axios.get(`http://localhost:5000/api/users/${id}`);
        if (!userRes.data) {
          throw new Error('User not found');
        }
        setUser(userRes.data);
        
        // Fetch user rentals (public route)
        try {
        const rentalsRes = await axios.get(`http://localhost:5000/api/rentals/user/${id}`);
          setRentals(rentalsRes.data || []);
        } catch (rentalError) {
          console.error('Error fetching rentals:', rentalError);
          setRentals([]);
        }
        
        // Fetch user services (protected route)
        try {
          const servicesRes = await axiosWithAuth.get(`/api/concierge/user/${id}`);
          if (servicesRes.data.success) {
        setServices(servicesRes.data.data || []);
          } else {
            console.error('Error in services response:', servicesRes.data.message);
            setServices([]);
          }
        } catch (serviceError) {
          console.error('Error fetching services:', serviceError);
          if (serviceError.response?.status === 401) {
            console.log('Please log in to view services');
          }
          setServices([]);
        }

        // Fetch reviews and average rating
        await Promise.all([fetchReviews(), fetchAverageRating()]);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || 'Failed to load user profile');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  // Transform service data to match ServiceCard props
  const transformServiceData = (service) => ({
    id: service.id,
    type: 'concierge',
    title: service.name,
    description: service.description,
    price: `$${service.price}`,
    category: service.category,
    duration: service.duration_minutes,
    image: service.photo_url || '/placeholder-service.jpg',
    provider: {
      name: user?.full_name || 'Unknown Provider',
      image: user?.profile_image || '/placeholder-avatar.png',
      rating: 5.0,
      reviewCount: 0
    }
  });

  // Show more handlers
  const handleShowMoreRentals = () => {
    setVisibleRentals(prev => prev + ITEMS_PER_PAGE);
  };

  const handleShowMoreServices = () => {
    setVisibleServices(prev => prev + ITEMS_PER_PAGE);
  };

  const handleShowMoreReviews = () => {
    setVisibleReviews(prev => prev + 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-lg text-red-500 mb-4">{error || 'User not found'}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#ff385c] text-white font-medium rounded-lg hover:bg-[#e31c5f] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Info Section */}
          <div className="relative px-8 pt-8 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              <div className="mt-12 md:mt-0">
                <img
                  src={user?.profile_image || '/placeholder-avatar.png'}
                  alt={user?.full_name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-avatar.png';
                }}
              />
            </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{user?.full_name}</h1>
                <div className="text-gray-600 mt-1">@{user?.username}</div>
                {user?.created_at && (
                  <div className="flex items-center justify-center md:justify-start text-gray-600 mt-2">
                  <FaCalendarAlt className="text-[#ff385c] mr-2" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              )}
                <div className="mt-4 text-gray-600 max-w-2xl">
                  {user?.bio || "No description provided."}
                </div>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors flex items-center">
                  <FaEnvelope className="mr-2" />
                  Contact
                </button>
                <button className="px-6 py-2 border border-[#ff385c] text-[#ff385c] rounded-lg hover:bg-[#ff385c] hover:text-white transition-colors flex items-center">
                  <FaUserPlus className="mr-2" />
                  Follow
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-4 border-t border-gray-100">
            <div className="p-4 text-center border-r border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{rentals.length}</div>
              <div className="text-gray-600">Rentals</div>
            </div>
            <div className="p-4 text-center border-r border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{services.length}</div>
              <div className="text-gray-600">Services</div>
            </div>
            <div className="p-4 text-center border-r border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
              <div className="text-gray-600">Rating</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
              <div className="text-gray-600">Reviews</div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8">
            {/* Navigation Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-gray-200">
              <button 
                onClick={() => handleTabChange('overview')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'text-[#ff385c] border-b-2 border-[#ff385c]' 
                    : 'text-gray-600 hover:text-[#ff385c]'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => handleTabChange('rentals')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'rentals' 
                    ? 'text-[#ff385c] border-b-2 border-[#ff385c]' 
                    : 'text-gray-600 hover:text-[#ff385c]'
                }`}
              >
                Rentals
              </button>
              <button 
                onClick={() => handleTabChange('services')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'services' 
                    ? 'text-[#ff385c] border-b-2 border-[#ff385c]' 
                    : 'text-gray-600 hover:text-[#ff385c]'
                }`}
              >
                Services
              </button>
              <button 
                onClick={() => handleTabChange('reviews')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'reviews' 
                    ? 'text-[#ff385c] border-b-2 border-[#ff385c]' 
                    : 'text-gray-600 hover:text-[#ff385c]'
                }`}
              >
                Reviews
              </button>
            </div>

            {/* Overview Section */}
            <div ref={overviewRef} className="mb-12">
              <div className="flex items-center mb-6">
                <FaInfoCircle className="text-[#ff385c] mr-2" />
                <h2 className="text-2xl font-semibold text-gray-900">About</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600">{user?.bio || "No description provided."}</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="text-[#ff385c] mr-2" />
                    <span>{user?.phone || "No phone number provided"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaGlobe className="text-[#ff385c] mr-2" />
                    <span>{user?.website || "No website provided"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rentals Section */}
            <div ref={rentalsRef} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaHome className="text-[#ff385c] mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900">Rental Listings</h2>
                </div>
                <span className="text-gray-500">{rentals.length} listings</span>
              </div>
              {rentals.length === 0 ? (
                <div className="text-gray-500 bg-gray-50 p-8 rounded-lg text-center">
                  No rentals found.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rentals.slice(0, visibleRentals).map(rental => (
                      <motion.div
                        key={rental.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative h-48">
                          <img
                            src={rental.image || '/placeholder-rental.jpg'}
                            alt={rental.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-[#ff385c] text-white px-3 py-1 rounded-full text-sm">
                            {rental.type}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{rental.title}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FaMapMarkerAlt className="text-[#ff385c] mr-2" />
                            <span>{rental.city}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#ff385c] font-bold text-lg">${rental.price}</span>
                            <span className="text-gray-500 text-sm">per night</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {rentals.length > visibleRentals && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleShowMoreRentals}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#ff385c] hover:bg-[#e31c5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff385c] transition-colors"
                      >
                        Show More Rentals
                        <FaChevronDown className="ml-2" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Services Section */}
            <div ref={servicesRef} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaConciergeBell className="text-[#ff385c] mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900">Concierge Services</h2>
                </div>
                <span className="text-gray-500">{services.length} services</span>
              </div>
              {services.length === 0 ? (
                <div className="text-gray-500 bg-gray-50 p-8 rounded-lg text-center">
                  No services found.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.slice(0, visibleServices).map(service => (
                      <ServiceCard
                        key={service.id}
                        service={transformServiceData(service)}
                        isHomePage={false}
                      />
                    ))}
                  </div>
                  {services.length > visibleServices && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleShowMoreServices}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#ff385c] hover:bg-[#e31c5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff385c] transition-colors"
                      >
                        Show More Services
                        <FaChevronDown className="ml-2" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Reviews Section */}
            <div ref={reviewsRef}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaComments className="text-[#ff385c] mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900">Ratings & Reviews</h2>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-gray-900 font-semibold">{averageRating.toFixed(1)}</span>
                </div>
              </div>
              {reviews.length === 0 ? (
                <div className="text-gray-500 bg-gray-50 p-8 rounded-lg text-center">
                  No reviews yet. Be the first to review this user!
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {reviews.slice(0, visibleReviews).map(review => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <img
                              src={review.reviewer_image || '/placeholder-avatar.png'}
                              alt={review.reviewer_name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{review.reviewer_name}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="font-semibold">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  {reviews.length > visibleReviews && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleShowMoreReviews}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#ff385c] hover:bg-[#e31c5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff385c] transition-colors"
                      >
                        Show More Reviews
                        <FaChevronDown className="ml-2" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 
import React, { useState, useEffect } from 'react';
import { FaStar, FaUser, FaPen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';

const Review = ({ itemId, itemType, onReviewSubmit, showReviewForm = true }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    reviewerName: '',
    reviewerEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [itemId, itemType]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let response;
      if (itemType === 'rental') {
        response = await reviewService.getRentalReviews(itemId);
      } else if (itemType === 'service') {
        response = await reviewService.getServiceReviews(itemId);
      }
      
      if (response.success) {
        setReviews(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (user) {
      // Authenticated user review
      const reviewData = {
        rating: Number(newReview.rating),
        comment: newReview.comment,
        ...(itemType === 'rental' ? { rental_id: Number(itemId) } : {})
      };

      try {
        setSubmitting(true);
        const response = await reviewService.createReview(reviewData);
        if (response.success) {
          setReviews(prevReviews => [response.data, ...prevReviews]);
          setIsReviewFormVisible(false);
          setNewReview({
            rating: 5,
            comment: '',
            reviewerName: '',
            reviewerEmail: ''
          });
          if (onReviewSubmit) {
            onReviewSubmit();
          }
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        if (error.response?.status === 401) {
          alert('Please log in to submit a review');
        } else {
          alert('Failed to submit review. Please try again.');
        }
      } finally {
        setSubmitting(false);
      }
    } else {
      // Redirect to login if not authenticated
      alert('Please log in to submit a review');
      // You can add navigation to login page here if needed
    }
  };

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer' : ''} w-5 h-5`}
        onClick={() => {
          if (interactive) {
            setNewReview(prev => ({ ...prev, rating: index + 1 }));
          }
        }}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Form */}
      {showReviewForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
              <p className="text-sm text-gray-500 mt-1">Share your experience with others</p>
            </div>
            {user && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-full h-full p-2 text-gray-400" />
                  )}
                </div>
                <span className="font-medium text-gray-700">{user.full_name}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <div className="flex items-center space-x-1">
                {renderStars(newReview.rating, true)}
                <span className="ml-2 text-sm text-gray-500">{newReview.rating} out of 5</span>
              </div>
            </div>

            {!user && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={newReview.reviewerName}
                    onChange={(e) => setNewReview(prev => ({ ...prev, reviewerName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Email *</label>
                  <input
                    type="email"
                    value={newReview.reviewerEmail}
                    onChange={(e) => setNewReview(prev => ({ ...prev, reviewerEmail: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                rows="4"
                placeholder="Share your experience..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsReviewFormVisible(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <FaPen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No reviews yet</h3>
            <p className="mt-2 text-sm text-gray-500">Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    {review.user_image ? (
                      <img
                        src={review.user_image}
                        alt={review.user_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-full h-full p-3 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{review.user_name || review.reviewerName}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-medium text-gray-900">{review.rating}</span>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-gray-600">
                {review.comment}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Review; 
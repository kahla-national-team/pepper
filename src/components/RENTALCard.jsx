"use client"
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaBed, FaBath, FaUsers, FaHeart, FaRegHeart } from 'react-icons/fa';
import favoriteService from '../services/favoriteService';

const StaysCard = ({ service, isSelected, onClick, onUnlike, isFavorite: initialIsFavorite = true, isHomePage = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isHomePage ? false : initialIsFavorite);
  const navigate = useNavigate();

  // Default values for service
  const {
    id,
    title = 'Stay Title',
    description = 'Stay description',
    price = '$0/night',
    provider = { 
      name: 'Host', 
      rating: 5, 
      reviewCount: 0,
      image: '/placeholder-avatar.png'
    },
    image = '/placeholder-stay.jpg',
    bedrooms = 0,
    bathrooms = 0,
    max_guests = 1
  } = service;

  // Add useEffect to check favorite status when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (id && !isHomePage) {
        try {
          const status = await favoriteService.isFavorite(id, 'stay');
          setIsFavorite(status);
        } catch (error) {
          console.error('Error checking favorite status:', error);
          // Don't change the favorite status if there's an error
          // This prevents the UI from flickering when the server is down
        }
      }
    };
    checkFavoriteStatus();
  }, [id, isHomePage]);

  const handleClick = (e) => {
    // Prevent navigation when clicking the favorite button
    if (e.target.closest('.favorite-button')) {
      return;
    }
    
    if (onClick) {
      onClick();
    }
    if (id) {
      navigate(`/details/stay/${id}`);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!id || isFavoriteLoading) return;

    try {
      setIsFavoriteLoading(true);
      if (isHomePage) {
        if (isFavorite) {
          await favoriteService.removeFavorite(id);
          setIsFavorite(false);
        } else {
          try {
            await favoriteService.addFavorite(id, 'stay');
            setIsFavorite(true);
          } catch (error) {
            if (error.message === 'Please sign in to add favorites') {
              // Redirect to login page
              navigate('/login');
              return;
            } else if (error.message === 'Server is not running or not accessible') {
              alert('Unable to add to favorites. Please try again later.');
              return;
            }
            throw error;
          }
        }
      } else if (onUnlike) {
        await onUnlike(id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Unable to update favorite status. Please try again later.');
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full ${
        isSelected ? 'ring-2 ring-[#ff385c]' : ''
      }`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={handleClick}
    >
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff385c]"></div>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}
        <button
          className="favorite-button absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
          onClick={handleFavoriteClick}
          disabled={isFavoriteLoading}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavoriteLoading ? (
            <div className="w-5 h-5 animate-spin rounded-full border-b-2 border-[#ff385c]"></div>
          ) : isFavorite ? (
            <FaHeart className="w-5 h-5 text-[#ff385c]" />
          ) : (
            <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-[#ff385c] transition-colors" />
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="text-[#ff385c] font-semibold">{price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        {/* Property Details */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FaBed className="mr-1" />
            <span>{bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <FaBath className="mr-1" />
            <span>{bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <FaUsers className="mr-1" />
            <span>{max_guests} guests</span>
          </div>
        </div>
        
        <div className="flex items-center pt-2 border-t border-gray-100">
          <img
            src={provider.image}
            alt={provider.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">{provider.name}</p>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-sm text-gray-600">
                {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

StaysCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
    provider: PropTypes.shape({
      name: PropTypes.string,
      rating: PropTypes.number,
      reviewCount: PropTypes.number,
      image: PropTypes.string
    }),
    image: PropTypes.string,
    address: PropTypes.string,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    max_guests: PropTypes.number
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onUnlike: PropTypes.func,
  isFavorite: PropTypes.bool,
  isHomePage: PropTypes.bool
};

export default StaysCard; 
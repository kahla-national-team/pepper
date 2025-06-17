"use client";
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';
import favoriteService from '../services/favoriteService';

const ServiceCard = ({ service, isSelected, onClick, onUnlike, isFavorite: initialIsFavorite = false, isHomePage = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isHomePage ? false : initialIsFavorite);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const navigate = useNavigate();

  // Default values for service
  const {
    id,
    type,
    title,
    description,
    price,
    category,
    duration,
    image = '/placeholder-service.jpg',
    provider
  } = service;

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (id && !isHomePage) {
        try {
          const status = await favoriteService.isFavorite(id, 'service');
          setIsFavorite(status);
        } catch (error) {
          console.error('Error checking favorite status:', error);
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
      navigate(`/details/concierge/${id}`);
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
            await favoriteService.addFavorite(id, 'service');
            setIsFavorite(true);
          } catch (error) {
            if (error.message === 'Please sign in to add favorites') {
              // Redirect to login page
              navigate('/login');
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
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full ${
        isSelected ? 'ring-2 ring-blue-500' : ''
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}
        {category && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
            {category}
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
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#ff385c] font-bold">{price}</span>
          {duration && (
            <div className="flex items-center text-gray-500 text-sm">
              <FaClock className="mr-1" />
              <span>{duration} min</span>
            </div>
          )}
        </div>

        {provider && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <img
                src={provider.image}
                alt={provider.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span className="text-sm text-gray-600">{provider.name}</span>
            </div>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-sm text-gray-600">{provider.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-400 ml-1">({provider.reviewCount})</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.string,
    category: PropTypes.string,
    duration: PropTypes.number,
    image: PropTypes.string,
    provider: PropTypes.shape({
      name: PropTypes.string,
      rating: PropTypes.number,
      reviewCount: PropTypes.number,
      image: PropTypes.string
    })
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  onUnlike: PropTypes.func,
  isHomePage: PropTypes.bool,
  isFavorite: PropTypes.bool
};

export default ServiceCard;
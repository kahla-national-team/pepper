"use client";
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ServiceCard = ({ service, isSelected, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  // Default values for service
  const {
    id,
    type,
    title = 'Service Title',
    description = 'Service description', 
    price = '$0/hour',
    provider = { 
      name: 'Provider', 
      rating: 5, 
      reviewCount: 0,
      image: '/placeholder-avatar.png'
    },
    image = '/placeholder-service.jpg'
  } = service;

  // Handle click to navigate and potentially select
  const handleClick = () => {
    // Call the original onClick prop (for selection in parent component)
    if (onClick) {
      onClick();
    }
    // Navigate to the details page
    if (id && type) {
      navigate(`/details/${type}/${id}`);
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
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="text-blue-600 font-semibold">{price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center">
          <img
            src={provider.image}
            alt={provider.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">{provider.name}</p>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">
                {provider.rating} ({provider.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
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
    address: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
};

export default ServiceCard;
"use client"
import PropTypes from 'prop-types';
import { useState } from 'react';
// The motion import is used in the component for motion.div
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; 

const Service1Card = ({ service, isSelected, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Default values for service
  const {
    title = 'Stay Title',
    description = 'Stay description',
    price = '$0/night',
    provider = { 
      name: 'Host', 
      rating: 5, 
      reviewCount: 0,
      image: '/placeholder-avatar.png'
    },
    image = '/placeholder-stay.jpg'
  } = service;

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      {/* Stay Image */}
      <div className="relative h-48 bg-gray-100">
        {isLoading ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : hasError ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">Image not available</span>
          </div>
        ) : (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        )}
      </div>

      {/* Stay Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="text-rose-500 font-semibold">{price}</span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {service.address || 'Location not specified'}
        </div>

        {/* Provider Info */}
        {provider && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center">
              <img 
                src={provider.image} 
                alt={provider.name} 
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-700">{provider.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-sm text-gray-700">
                {provider.rating} {provider.reviewCount && `(${provider.reviewCount})`}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

Service1Card.propTypes = {
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
    address: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
};

export default Service1Card;

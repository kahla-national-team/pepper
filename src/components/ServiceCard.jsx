"use client";
import PropTypes from 'prop-types';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaClock } from 'react-icons/fa';

const ServiceCard = ({ service, isSelected, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
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

  // Handle click to navigate and potentially select
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (id) {
      navigate(`/details/concierge/${id}`);
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
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
            {category}
          </div>
        )}
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
  onClick: PropTypes.func
};

export default ServiceCard;
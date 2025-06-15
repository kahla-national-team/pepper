import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const PropertyCard = ({ property }) => {
  const {
    id,
    title,
    description,
    price,
    location,
    image,
    imageData,
    status,
    type
  } = property;

  // Handle image URL
  const imageUrl = image || (imageData?.url) || '/placeholder-property.jpg';
  
  // Format price
  const formattedPrice = formatCurrency(price);

  return (
    <Link 
      to={`/properties/${id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = '/placeholder-property.jpg';
          }}
        />
        {status && (
          <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
            status === 'available' ? 'bg-green-100 text-green-800' :
            status === 'rented' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2 truncate">
          {location}
        </p>
        
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">
            {formattedPrice}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {type}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard; 
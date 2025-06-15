import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaCalendarAlt, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const AdminPropertyCard = ({ property, onDelete, onToggleStatus }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setIsDeleting(true);
      try {
        await onDelete(property.id);
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleStatus = async () => {
    setIsStatusUpdating(true);
    try {
      await onToggleStatus(property.id, !property.isActive);
    } catch (error) {
      console.error('Error updating property status:', error);
      alert('Failed to update property status. Please try again.');
    } finally {
      setIsStatusUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
      {/* Property Image */}
      <div className="relative h-48">
        <img
          src={property.image || '/placeholder-stay.jpg'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleToggleStatus}
            disabled={isStatusUpdating}
            className={`p-2 rounded-full ${
              property.isActive 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white transition-colors`}
            title={property.isActive ? 'Deactivate Property' : 'Activate Property'}
          >
            {isStatusUpdating ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : property.isActive ? (
              <FaEye className="w-5 h-5" />
            ) : (
              <FaEyeSlash className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{property.title}</h3>
          <span className="text-[#ff385c] font-semibold">${property.price}/night</span>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            property.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {property.isActive ? (
              <>
                <FaCheck className="mr-1" /> Active
              </>
            ) : (
              <>
                <FaTimes className="mr-1" /> Inactive
              </>
            )}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

        {/* Property Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium">Bedrooms</div>
            <div>{property.bedrooms}</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium">Bathrooms</div>
            <div>{property.bathrooms}</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-medium">Max Guests</div>
            <div>{property.max_guests}</div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
          <Link
            to={`/admin/properties/${property.id}/edit`}
            className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <FaEdit className="mr-1" /> Edit
          </Link>
          <Link
            to={`/admin/properties/${property.id}/availability`}
            className="inline-flex items-center px-3 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            <FaCalendarAlt className="mr-1" /> Availability
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <FaTrash className="mr-1" /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

AdminPropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    max_guests: PropTypes.number,
    isActive: PropTypes.bool
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired
};

export default AdminPropertyCard; 
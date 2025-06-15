import React, { useState } from 'react';
import { FaEdit, FaTrash, FaEllipsisV, FaStar, FaBed, FaBath, FaUsers, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OwnerRentalCard = ({ rental, onEdit, onDelete, onStatusChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit(rental);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(rental);
  };

  const handleCardClick = () => {
    navigate(`/rentals/${rental.id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    onStatusChange(rental.id, e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={rental.image}
          alt={rental.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <FaEllipsisV className="text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaEdit className="text-gray-600" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 flex items-center gap-2"
                >
                  <FaTrash className="text-red-600" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{rental.title}</h3>
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
            {rental.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{rental.location}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">{rental.bedrooms}</span>
            <span className="text-gray-400">beds</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">{rental.bathrooms}</span>
            <span className="text-gray-400">baths</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">{rental.maxGuests}</span>
            <span className="text-gray-400">guests</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">${rental.price}</span>
            <span className="text-gray-600">/night</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-gray-900">{rental.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FaCalendarAlt />
            <span>{rental.bookings} bookings</span>
          </div>
          <div className="flex items-center gap-1">
            <FaEye />
            <span>{rental.views} views</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <select
            value={rental.status}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
          >
            <option value="active">Set as Active</option>
            <option value="pending">Set as Pending</option>
            <option value="inactive">Set as Inactive</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Last updated: {new Date(rental.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default OwnerRentalCard; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaFilter, FaSort } from 'react-icons/fa';
import OwnerRentalCard from './OwnerRentalCard';

const OwnerRentalsGrid = ({ rentals, onEdit, onDelete, onStatusChange }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredRentals = rentals.filter(rental => {
    if (statusFilter === 'all') return true;
    return rental.status === statusFilter;
  });

  const sortedRentals = [...filteredRentals].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'bookings':
        return b.bookings - a.bookings;
      case 'recent':
      default:
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
        <Link
          to="/add-property"
          className="flex items-center gap-2 px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
        >
          <FaPlus />
          <span>Add New Rental</span>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FaSort className="text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
          >
            <option value="recent">Most Recent</option>
            <option value="price">Highest Price</option>
            <option value="rating">Highest Rating</option>
            <option value="bookings">Most Bookings</option>
          </select>
        </div>
      </div>

      {sortedRentals.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No rentals found</h3>
          <p className="text-gray-600 mb-4">
            {statusFilter !== 'all' 
              ? `No ${statusFilter} rentals found. Try changing the status filter.`
              : "You haven't added any rentals yet."}
          </p>
          <Link
            to="/rentals/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
          >
            <FaPlus />
            <span>Add Your First Rental</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRentals.map((rental) => (
            <OwnerRentalCard
              key={rental.id}
              rental={rental}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerRentalsGrid; 
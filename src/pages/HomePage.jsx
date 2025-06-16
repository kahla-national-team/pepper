import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rentalService } from '../services/rentalService';
import { useAuth } from '../contexts/AuthContext';
import RentalsMap from '../components/RentalsMap';

const HomePage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const { user } = useAuth();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const data = await rentalService.getAllRentals();
        setRentals(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rentals:', err);
        setError('Failed to load rentals');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Rentals</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-[#ff385c] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'map'
                ? 'bg-[#ff385c] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map(rental => (
            <Link
              key={rental.id}
              to={`/details/stay/${rental.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={rental.image || '/placeholder-stay.jpg'}
                  alt={rental.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-stay.jpg';
                  }}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {rental.title}
                </h2>
                <p className="text-gray-600 mb-2">{rental.address}</p>
                <p className="text-[#ff385c] font-semibold">
                  ${rental.price} per night
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
          <RentalsMap />
        </div>
      )}

      {user && (
        <div className="mt-8 text-center">
          <Link
            to="/rentals/new"
            className="inline-block bg-[#ff385c] text-white px-6 py-3 rounded-lg hover:bg-[#ff385c]/90 transition-colors duration-300"
          >
            List Your Property
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage; 
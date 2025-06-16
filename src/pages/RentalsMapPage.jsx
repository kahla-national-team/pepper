import React from 'react';
import RentalsMap from '../components/RentalsMap';

const RentalsMapPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Rentals on Map</h1>
      <RentalsMap />
    </div>
  );
};

export default RentalsMapPage; 
import React, { useState, useEffect } from 'react';
import OpenStreetMap from './OpenStreetMap';
import { useOpenStreetMap } from '../contexts/OpenStreetMapProvider';
import { rentalService } from '../services/rentalService';

const RentalsMap = ({ onRentalClick, className = '', height = '600px' }) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRental, setSelectedRental] = useState(null);
  const { isLoaded, loadError } = useOpenStreetMap();

  useEffect(() => {
    fetchRentals();
  }, []);

    const fetchRentals = async () => {
      try {
        setLoading(true);
      const response = await rentalService.getRentals();
      setRentals(response || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setError('Failed to load rentals');
      } finally {
        setLoading(false);
      }
    };

  const handleMarkerClick = (rental) => {
            setSelectedRental(rental);
    if (onRentalClick) {
      onRentalClick(rental);
    }
  };

  // Convert rentals to markers format
  const markers = rentals
    .filter(rental => rental.location && rental.location.lat && rental.location.lng)
    .map(rental => ({
      position: [parseFloat(rental.location.lat), parseFloat(rental.location.lng)],
      title: rental.title,
      content: `
        <div class="p-2">
          <h3 class="font-semibold text-lg">${rental.title}</h3>
          <p class="text-gray-600">${rental.description?.substring(0, 100)}...</p>
          <p class="text-green-600 font-semibold">${rental.price}</p>
        </div>
      `,
      rental: rental
    }));

  // Calculate center from rentals or use default
  const center = markers.length > 0 
    ? markers.reduce((acc, marker) => [
        acc[0] + marker.position[0], 
        acc[1] + marker.position[1]
      ], [0, 0]).map(coord => coord / markers.length)
    : [51.505, -0.09];

  if (loadError) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-red-500">Error loading map</p>
          <p className="text-sm text-gray-600">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-red-500">Error loading rentals</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <OpenStreetMap
        center={center}
        zoom={10}
        markers={markers}
        onMarkerClick={(markerData) => handleMarkerClick(markerData.rental)}
        height={height}
        width="100%"
      />
      
        {selectedRental && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">{selectedRental.title}</h3>
          <p className="text-gray-600 mt-1">{selectedRental.description}</p>
          <p className="text-green-600 font-semibold mt-2">${selectedRental.price}/night</p>
          <button
            onClick={() => onRentalClick(selectedRental)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Details
          </button>
            </div>
        )}
    </div>
  );
};

export default RentalsMap; 
"use client"
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt } from 'react-icons/fa';
import OpenStreetMap from './OpenStreetMap';
import { useOpenStreetMap } from '../contexts/OpenStreetMapProvider';
import { rentalService } from '../services/rentalService';

const RentalLocationMap = ({ rentalId, className = '', height = '400px' }) => {
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoaded, loadError } = useOpenStreetMap();

  useEffect(() => {
    if (rentalId) {
      fetchRental();
    }
  }, [rentalId]);

  const fetchRental = async () => {
    try {
      setLoading(true);
      const response = await rentalService.getRental(rentalId);
      setRental(response);
    } catch (error) {
      console.error('Error fetching rental:', error);
      setError('Failed to load rental location');
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-red-500">Error loading rental</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!rental || (!rental.latitude && !rental.location?.lat) || (!rental.longitude && !rental.location?.lng)) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-gray-600">No location data available</p>
        </div>
      </div>
    );
  }

  // Get coordinates from either direct fields or location object
  const lat = rental.latitude || rental.location?.lat;
  const lng = rental.longitude || rental.location?.lng;
  const center = [parseFloat(lat), parseFloat(lng)];
  const markers = [{
    position: center,
    title: rental.title,
    content: `
      <div class="p-2">
        <h3 class="font-semibold text-lg">${rental.title}</h3>
        <p class="text-gray-600">${rental.address || 'Location'}</p>
        <p class="text-green-600 font-semibold">$${rental.price}/night</p>
      </div>
    `
  }];

  return (
    <OpenStreetMap
      center={center}
      zoom={15}
      markers={markers}
      className={className}
      height={height}
      width="100%"
    />
  );
};

RentalLocationMap.propTypes = {
  rentalId: PropTypes.string.isRequired,
  className: PropTypes.string,
  height: PropTypes.string
};

export default RentalLocationMap; 
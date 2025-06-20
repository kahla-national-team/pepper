"use client"
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from '../contexts/GoogleMapsProvider';

const RentalLocationMap = ({ location, address, title }) => {
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const { isLoaded, loadError } = useGoogleMaps();

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  };

  // Handle both string and number coordinates
  const center = {
    lat: typeof location?.lat === 'string' ? parseFloat(location.lat) : location?.lat || 0,
    lng: typeof location?.lng === 'string' ? parseFloat(location.lng) : location?.lng || 0
  };

  const onLoad = useCallback((map) => {
    if (center.lat === 0 && center.lng === 0) {
      console.warn('Invalid coordinates provided to RentalLocationMap');
    }
  }, [center]);

  const onUnmount = useCallback(() => {
    // Cleanup if needed
  }, []);

  const renderMapContainer = () => (
    <div className="w-full h-[400px]">
      {!isLoaded ? (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff385c]"></div>
        </div>
      ) : loadError ? (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <p className="text-red-500 mb-2">Map not available</p>
            <p className="text-sm text-gray-600">Location: {address}</p>
            <p className="text-xs text-gray-500 mt-1">
              {loadError.message || 'Unable to load map'}
            </p>
          </div>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
          }}
        >
          <Marker
            position={center}
            onClick={() => setShowInfoWindow(true)}
          />
          {showInfoWindow && (
            <InfoWindow
              position={center}
              onCloseClick={() => setShowInfoWindow(false)}
            >
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-gray-600">{address}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );

  // Don't render the map if we don't have valid coordinates
  if (center.lat === 0 && center.lng === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaMapMarkerAlt className="text-[#ff385c] mr-2" />
            Location
          </h3>
          {address && (
            <p className="text-gray-600 text-sm mt-1">{address}</p>
          )}
        </div>
        <div className="p-4 text-center text-gray-500">
          Location information not available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaMapMarkerAlt className="text-[#ff385c] mr-2" />
          Location
        </h3>
        {address && (
          <p className="text-gray-600 text-sm mt-1">{address}</p>
        )}
      </div>
      {renderMapContainer()}
    </div>
  );
};

RentalLocationMap.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  address: PropTypes.string,
  title: PropTypes.string
};

export default RentalLocationMap; 
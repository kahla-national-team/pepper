"use client"
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const RentalLocationMap = ({ location, address, title }) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  // Check if location data is available
  if (!location || !location.lat || !location.lng) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <FaMapMarkerAlt className="text-gray-400 text-4xl mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Location</h3>
        <p className="text-gray-600 mb-4">{address || 'Location not available'}</p>
        <p className="text-sm text-gray-500">Location coordinates not available</p>
      </div>
    );
  }

  const mapContainerStyle = {
    width: '100%',
    height: '320px'
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  const handleMarkerClick = () => {
    setInfoWindowOpen(true);
  };

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
  };

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
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={location}
          zoom={15}
          options={mapOptions}
        >
          <Marker
            position={location}
            title={title || 'Property Location'}
            onClick={handleMarkerClick}
            animation={google.maps.Animation.DROP}
          />
          {infoWindowOpen && (
            <InfoWindow
              position={location}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-semibold text-lg mb-1">{title || 'Property Location'}</h3>
                <p className="text-gray-600 text-sm">{address || 'Location'}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

RentalLocationMap.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  address: PropTypes.string,
  title: PropTypes.string
};

export default RentalLocationMap; 
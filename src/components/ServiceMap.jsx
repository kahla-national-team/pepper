"use client"
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';


const ServiceMap = ({ services, selectedService }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB1sD5MQKu-bQhgQWmTOzwjVCvPRMdpyMI&libraries=places`;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      }
    });
  };

  const initMap = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure Google Maps JS API is loaded
      await loadGoogleMapsScript();

      // Create the map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 35.6971, lng: -0.6337 }, // Default to Oran, Algeria
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
      });

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add markers for each service
      services.forEach(service => {
        if (service.location) {
          const marker = new window.google.maps.Marker({
            position: service.location,
            map,
            title: service.title,
          });

          markersRef.current.push(marker);
        }
      });

      // Center map on selected service if any
      if (selectedService && selectedService.location) {
        map.setCenter(selectedService.location);
        map.setZoom(15);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading map:', error);
      setError('Failed to load map. Please try again later.');
      setIsLoading(false);
    }
  };

    if (mapRef.current) {
      initMap();
    }
  }, [services, selectedService]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full bg-gray-100"
      style={{ minHeight: '400px' }}
    />
  );
};

ServiceMap.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      location: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired
      }),
      address: PropTypes.string,
    })
  ).isRequired,
  selectedService: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }),
    address: PropTypes.string,
  }),
};

export default ServiceMap;
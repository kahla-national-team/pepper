import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = ({ properties = [], center, zoom = 12, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        
        if (!mapRef.current) {
          console.error('Map container not found');
          return;
        }

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: center || { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
          zoom: zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        setMap(mapInstance);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, [center, zoom]);

  useEffect(() => {
    if (!map || !properties.length) return;

    // Clear existing markers
    Object.values(markers).forEach(marker => marker.setMap(null));
    const newMarkers = {};

    properties.forEach(property => {
      if (!property.latitude || !property.longitude) {
        console.warn('Property missing coordinates:', property);
        return;
      }

      try {
        const marker = new google.maps.Marker({
          position: { lat: property.latitude, lng: property.longitude },
          map: map,
          title: property.title || 'Property',
          animation: google.maps.Animation.DROP
        });

        if (onMarkerClick) {
          marker.addListener('click', () => onMarkerClick(property));
        }

        // Use a unique identifier for the marker
        const markerId = `marker_${property.id || Math.random().toString(36).substr(2, 9)}`;
        newMarkers[markerId] = marker;
      } catch (err) {
        console.error('Error creating marker:', err);
      }
    });

    setMarkers(newMarkers);
  }, [map, properties, onMarkerClick]);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full"
      style={{ minHeight: '400px' }}
    />
  );
};

export default Map; 
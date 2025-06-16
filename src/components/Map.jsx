import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Create a single loader instance outside the component
const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places'],
  // Prevent multiple loads
  preventGoogleFontsLoading: true,
  // Add custom element definitions
  customElements: {
    'gmp-map': true,
    'gmp-advanced-marker': true,
    'gmp-place-autocomplete': true,
    'gmp-place-details': true
  }
});

const Map = ({ properties = [], center, zoom = 12, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const markersRef = useRef({});
  const googleRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Google Maps only once
        if (!googleRef.current) {
          googleRef.current = await loader.load();
        }
        
        if (!mapRef.current) {
          console.error('Map container not found');
          return;
        }

        const mapInstance = new googleRef.current.maps.Map(mapRef.current, {
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

    // Cleanup function
    return () => {
      if (map) {
        // Clear all markers
        Object.values(markersRef.current).forEach(marker => {
          if (marker && marker.setMap) {
            marker.setMap(null);
          }
        });
        markersRef.current = {};
      }
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!map || !properties.length || !googleRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    markersRef.current = {};

    properties.forEach(property => {
      if (!property.latitude || !property.longitude) {
        console.warn('Property missing coordinates:', property);
        return;
      }

      try {
        const marker = new googleRef.current.maps.Marker({
          position: { lat: property.latitude, lng: property.longitude },
          map: map,
          title: property.title || 'Property',
          animation: googleRef.current.maps.Animation.DROP
        });

        if (onMarkerClick) {
          marker.addListener('click', () => onMarkerClick(property));
        }

        // Use property ID as marker key if available, otherwise generate a unique key
        const markerKey = property.id ? `marker_${property.id}` : `marker_${Math.random().toString(36).substr(2, 9)}`;
        markersRef.current[markerKey] = marker;
      } catch (err) {
        console.error('Error creating marker:', err);
      }
    });

    // Update state with new markers
    setMarkers(markersRef.current);
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
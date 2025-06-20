import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from '../contexts/GoogleMapsProvider';

const Map = ({ properties = [], center, zoom = 12, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const markersRef = useRef({});

  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (loadError) {
      setError('Error loading maps');
      setIsLoading(false);
    }
  }, [loadError]);

  useEffect(() => {
    if (isLoaded && !map && mapRef.current) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: 0, lng: 0 },
        zoom: zoom,
      });
      setMap(newMap);
      setIsLoading(false);
    }
  }, [isLoaded, map, center, zoom]);

  useEffect(() => {
    if (map && properties.length > 0) {
      // Clear existing markers
      Object.values(markersRef.current).forEach(marker => marker.setMap(null));
      markersRef.current = {};

      // Add new markers
      properties.forEach(property => {
        if (property.latitude && property.longitude) {
          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            position: { lat: property.latitude, lng: property.longitude },
            map: map,
            title: property.title
          });

          if (onMarkerClick) {
            marker.addListener('click', () => onMarkerClick(property));
          }

          markersRef.current[property.id] = marker;
        }
      });
    }
  }, [map, properties, onMarkerClick]);

  if (!isLoaded) return <div>Loading map...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  );
};

export default Map; 
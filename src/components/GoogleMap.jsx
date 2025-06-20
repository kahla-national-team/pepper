import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Keep track of whether the script has been loaded
let isScriptLoaded = false;
let loadPromise = null;

const GoogleMap = ({ center, zoom, markers = [], onMarkerClick, className = '' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        // If script is already loading, wait for it
        if (loadPromise) {
          await loadPromise;
        }
        
        // If script is not loaded, load it
        if (!isScriptLoaded) {
          const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
            libraries: ['places']
          });

          loadPromise = loader.load();
          await loadPromise;
          isScriptLoaded = true;
          loadPromise = null;
        }

        if (!mapRef.current) return;

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: center || { lat: 0, lng: 0 },
          zoom: zoom || 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(mapInstance);
        setError(null);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please try again later.');
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (map) {
        // Clear any existing markers
        if (window.googleMapMarkers) {
          window.googleMapMarkers.forEach(marker => marker.setMap(null));
          window.googleMapMarkers = [];
        }
      }
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!map || !markers.length) return;

    // Clear existing markers
    const existingMarkers = window.googleMapMarkers || [];
    existingMarkers.forEach(marker => marker.setMap(null));
    window.googleMapMarkers = [];

    // Add new markers
    const newMarkers = markers.map(markerData => {
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position: markerData.position,
        map,
        title: markerData.title,
        content: (() => {
          if (markerData.icon) {
            const img = document.createElement('img');
            img.src = markerData.icon.url;
            img.style.width = '32px';
            img.style.height = '32px';
            return img;
          }
          return undefined;
        })()
      });

      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(markerData));
      }

      return marker;
    });

    window.googleMapMarkers = newMarkers;

    // Fit bounds if multiple markers
    if (markers.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker.position));
      map.fitBounds(bounds);
    }
  }, [map, markers, onMarkerClick]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full min-h-[300px] rounded-lg ${className}`}
    />
  );
};

export default GoogleMap; 
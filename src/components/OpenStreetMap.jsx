import React, { useEffect, useRef } from 'react';
import { useOpenStreetMap } from '../contexts/OpenStreetMapProvider';

const OpenStreetMap = ({ 
  center = [51.505, -0.09], 
  zoom = 13, 
  markers = [], 
  onMarkerClick, 
  onMapClick,
  className = '',
  height = '400px',
  width = '100%'
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const { isLoaded, loadError, createMap, addTileLayer } = useOpenStreetMap();

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const L = window.L;
    if (!L) return;

    // Create map instance
    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add click event listener to map
    if (onMapClick) {
      map.on('click', onMapClick);
    }

    mapInstanceRef.current = map;

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [isLoaded, center, zoom, onMapClick]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData, index) => {
      const { position, title, content, icon } = markerData;
      
      const markerOptions = {};
      if (icon) {
        markerOptions.icon = L.icon({
          iconUrl: icon,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
      }

      const marker = L.marker(position, markerOptions).addTo(map);

      if (title || content) {
        const popupContent = content || title;
        marker.bindPopup(popupContent);
      }

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(markerData, index));
      }

      markersRef.current.push(marker);
    });
  }, [markers, onMarkerClick]);

  if (loadError) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height, width }}>
        <div className="text-center">
          <p className="text-red-500">Error loading map</p>
          <p className="text-sm text-gray-600">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height, width }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg ${className}`} 
      style={{ height, width }}
    />
  );
};

export default OpenStreetMap; 
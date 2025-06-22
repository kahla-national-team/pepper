import React from 'react';
import OpenStreetMap from './OpenStreetMap';
import { useOpenStreetMap } from '../contexts/OpenStreetMapProvider';

const Map = ({ 
  center = [51.505, -0.09], 
  zoom = 13, 
  markers = [], 
  onMarkerClick,
  className = '',
  height = '400px',
  width = '100%'
}) => {
  const { isLoaded, loadError } = useOpenStreetMap();

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
    <OpenStreetMap
      center={center}
      zoom={zoom}
      markers={markers}
      onMarkerClick={onMarkerClick}
      className={className}
      height={height}
      width={width}
    />
  );
};

export default Map; 
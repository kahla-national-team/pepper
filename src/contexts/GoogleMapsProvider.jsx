import React, { useEffect, useState } from 'react';
import { LoadScript } from '@react-google-maps/api';

// Replace with your actual Google Maps API key
const API_KEY = 'AIzaSyB1sD5MQKu-bQhgQWmTOzwjVCvPRMdpyMI';

const libraries = ['maps', 'marker', 'places'];

// Track if script is already loaded
let isScriptLoaded = false;

export const GoogleMapsProvider = ({ children }) => {
  const [scriptLoaded, setScriptLoaded] = useState(isScriptLoaded);

  useEffect(() => {
    if (isScriptLoaded) {
      setScriptLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    console.log('Google Maps loaded successfully');
    isScriptLoaded = true;
    setScriptLoaded(true);
  };

  const handleError = (error) => {
    console.error('Error loading Google Maps:', error);
  };

  if (scriptLoaded) {
    return children;
  }

  return (
    <LoadScript
      googleMapsApiKey={API_KEY}
      libraries={libraries}
      version="weekly"
      onLoad={handleLoad}
      onError={handleError}
    >
      {children}
    </LoadScript>
  );
}; 
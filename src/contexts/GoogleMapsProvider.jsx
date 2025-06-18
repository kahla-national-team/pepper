import React, { useEffect, useState, createContext, useContext } from 'react';
import { LoadScript } from '@react-google-maps/api';

// Replace with your actual Google Maps API key
const API_KEY = 'AIzaSyB1sD5MQKu-bQhgQWmTOzwjVCvPRMdpyMI';

const libraries = ['maps', 'marker', 'places'];

// Create context for Google Maps state
const GoogleMapsContext = createContext();

// Track if script is already loaded globally
let isScriptLoaded = false;
let scriptPromise = null;

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

export const GoogleMapsProvider = ({ children }) => {
  const [scriptLoaded, setScriptLoaded] = useState(isScriptLoaded);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // Check if Google Maps script is already in the document
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      isScriptLoaded = true;
      setScriptLoaded(true);
      return;
    }

    // Check if google object is already available
    if (window.google && window.google.maps) {
      isScriptLoaded = true;
      setScriptLoaded(true);
      return;
    }
  }, []);

  const handleLoad = () => {
    console.log('Google Maps loaded successfully');
    isScriptLoaded = true;
    setScriptLoaded(true);
    setLoadError(null);
  };

  const handleError = (error) => {
    console.error('Error loading Google Maps:', error);
    setLoadError(error);
  };

  // If script is already loaded, just render children
  if (scriptLoaded) {
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: true, loadError: null }}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded: false, loadError }}>
      <LoadScript
        googleMapsApiKey={API_KEY}
        libraries={libraries}
        version="weekly"
        onLoad={handleLoad}
        onError={handleError}
        preventGoogleFontsLoading={true}
        loadingElement={<div>Loading Google Maps...</div>}
      >
        {children}
      </LoadScript>
    </GoogleMapsContext.Provider>
  );
}; 
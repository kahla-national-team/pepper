import React, { useEffect, useState, createContext, useContext } from 'react';
import { LoadScript } from '@react-google-maps/api';

// Replace with your actual Google Maps API key
const API_KEY = 'AIzaSyB1sD5MQKu-bQhgQWmTOzwjVCvPRMdpyMI';

const libraries = ['places'];

// Create context for Google Maps state
const GoogleMapsContext = createContext();

// Track if script is already loaded globally
let isScriptLoaded = false;
let loadPromise = null;

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
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      isScriptLoaded = true;
      setScriptLoaded(true);
      return;
    }

    // Check if there's already a loading promise
    if (loadPromise) {
      loadPromise.then(() => {
        setScriptLoaded(true);
      }).catch((error) => {
        setLoadError(error);
      });
      return;
    }

    // Create a new loading promise
    loadPromise = new Promise((resolve, reject) => {
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps) {
          resolve();
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
    });

    loadPromise.then(() => {
      isScriptLoaded = true;
      setScriptLoaded(true);
    }).catch((error) => {
      setLoadError(error);
    });
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
    setScriptLoaded(false);
  };

  // If script is already loaded, just render children
  if (scriptLoaded) {
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: true, loadError: null }}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  // If there's an error, show error state
  if (loadError) {
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false, loadError }}>
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load Google Maps</p>
          <p className="text-sm text-gray-600 mt-2">
            Please check your internet connection and try again.
          </p>
        </div>
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded: false, loadError: null }}>
      <LoadScript
        googleMapsApiKey={API_KEY}
        libraries={libraries}
        onLoad={handleLoad}
        onError={handleError}
      >
        {children}
      </LoadScript>
    </GoogleMapsContext.Provider>
  );
}; 
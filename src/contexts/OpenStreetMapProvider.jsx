import React, { createContext, useContext, useState, useEffect } from 'react';

const OpenStreetMapContext = createContext();

export const useOpenStreetMap = () => {
  const context = useContext(OpenStreetMapContext);
  if (!context) {
    throw new Error('useOpenStreetMap must be used within an OpenStreetMapProvider');
  }
  return context;
};

export const OpenStreetMapProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // OpenStreetMap doesn't require API keys, so we can load immediately
    const loadOpenStreetMap = async () => {
      try {
        // Import Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Import Leaflet JS
        await import('leaflet');
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading OpenStreetMap:', error);
        setLoadError(error);
      }
    };

    loadOpenStreetMap();
  }, []);

  const value = {
    isLoaded,
    loadError,
    // Helper function to create a map instance
    createMap: (element, options = {}) => {
      if (!isLoaded) return null;
      
      const L = window.L;
      if (!L) return null;

      const defaultOptions = {
        center: [51.505, -0.09],
        zoom: 13,
        ...options
      };

      return L.map(element, defaultOptions);
    },
    // Helper function to add tile layer
    addTileLayer: (map) => {
      if (!map || !window.L) return;
      
      const L = window.L;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
    }
  };

  return (
    <OpenStreetMapContext.Provider value={value}>
      {children}
    </OpenStreetMapContext.Provider>
  );
}; 
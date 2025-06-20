"use client"
import { createContext, useContext, useState } from 'react';

const MapVisibilityContext = createContext();

export function MapVisibilityProvider({ children }) {
  const [isMapVisible, setIsMapVisible] = useState(true);

  return (
    <MapVisibilityContext.Provider value={{ isMapVisible, setIsMapVisible }}>
      {children}
    </MapVisibilityContext.Provider>
  );
}

export function useMapVisibility() {
  const context = useContext(MapVisibilityContext);
  if (context === undefined) {
    throw new Error('useMapVisibility must be used within a MapVisibilityProvider');
  }
  return context;
} 
"use client"
import { createContext, useState } from 'react';

export const MapVisibilityContext = createContext();

export function MapVisibilityProvider({ children }) {
  const [isMapVisible, setIsMapVisible] = useState(false);

  return (
    <MapVisibilityContext.Provider value={{ isMapVisible, setIsMapVisible }}>
      {children}
    </MapVisibilityContext.Provider>
  );
}

/* useMapVisibility hook has been moved to a separate file: useMapVisibility.js */
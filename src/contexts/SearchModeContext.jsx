import React, { createContext, useContext, useState } from 'react';

const SearchModeContext = createContext();

export const useSearchMode = () => {
  const context = useContext(SearchModeContext);
  if (!context) {
    throw new Error('useSearchMode must be used within a SearchModeProvider');
  }
  return context;
};

export const SearchModeProvider = ({ children }) => {
  const [activeMode, setActiveMode] = useState('stays'); // 'stays' or 'services'

  const changeMode = (mode) => {
    setActiveMode(mode);
  };

  return (
    <SearchModeContext.Provider value={{ activeMode, changeMode }}>
      {children}
    </SearchModeContext.Provider>
  );
}; 
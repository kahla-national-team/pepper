"use client"
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMapVisibility } from '../context/MapVisibilityContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faX } from '@fortawesome/free-solid-svg-icons';

/**
 * Component that allows showing/hiding a Map component via a button
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - The Map component to show/hide
 * @param {string} props.className - Additional classes for the main container
 * @param {function} props.onVisibilityChange - Callback function to call when map visibility changes
 * @returns {React.ReactElement}
 */
const MapToggleWrapper = ({ children }) => {
  const { isMapVisible, setIsMapVisible } = useMapVisibility();
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const isFooterVisible = footerRect.top <= window.innerHeight;
        
        // Hide both button and map when footer is visible
        setIsButtonVisible(!isFooterVisible);
        if (isFooterVisible && isMapVisible) {
          setIsMapVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMapVisible, setIsMapVisible]);

  return (
    <>
      <button
        onClick={() => setIsMapVisible(!isMapVisible)}
        className={`fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
          isButtonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        } flex items-center justify-center w-12 h-12 p-0`}
        aria-label={isMapVisible ? 'Hide map' : 'Show map'}
      >
        {isMapVisible ? <FontAwesomeIcon icon={faX} size="lg" /> : <FontAwesomeIcon icon={faMap} size="lg" />}
      </button>

      <div
        className={`fixed top-16 right-0 w-full lg:w-1/2 h-[calc(100vh-4rem)] transition-all duration-300 transform ${
          isMapVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {children}
      </div>
    </>
  );
};

MapToggleWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onVisibilityChange: PropTypes.func
};

export default MapToggleWrapper;

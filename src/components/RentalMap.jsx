"use client"
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaBed, FaBath, FaUsers } from 'react-icons/fa';

const RentalMap = ({ rentals, selectedRental, onRentalSelect, initialCenter }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load the Google Maps JavaScript API
        const { Map } = await google.maps.importLibrary("maps");
        const { Marker } = await google.maps.importLibrary("marker");
        const { InfoWindow } = await google.maps.importLibrary("maps");

        // Create the map instance if it doesn't exist
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new Map(mapRef.current, {
            center: initialCenter || { lat: 35.6971, lng: -0.6337 }, // Default to Oran, Algeria
            zoom: 12,
            mapId: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          });
        }

        // Update map center if initialCenter changes
        if (initialCenter) {
          mapInstanceRef.current.setCenter(initialCenter);
        }

        // Clear existing markers and info windows
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        infoWindowsRef.current.forEach(window => window.close());
        infoWindowsRef.current = [];

        // Add markers for each rental
        rentals.forEach(rental => {
          if (rental.location) {
            // Create marker
            const marker = new Marker({
              position: rental.location,
              map: mapInstanceRef.current,
              title: rental.title,
              animation: google.maps.Animation.DROP,
            });

            // Create info window content
            const content = `
              <div class="p-4 max-w-xs">
                <img src="${rental.image}" alt="${rental.title}" class="w-full h-32 object-cover rounded-lg mb-2"/>
                <h3 class="font-bold text-lg mb-1">${rental.title}</h3>
                <p class="text-gray-600 text-sm mb-2">${rental.address}</p>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[#ff385c] font-bold">${rental.price}</span>
                  <div class="flex items-center text-yellow-400">
                    <span class="mr-1">★</span>
                    <span class="text-gray-600">${rental.provider.rating}</span>
                  </div>
                </div>
                <div class="flex items-center text-gray-500 text-sm">
                  <span class="mr-3"><i class="fas fa-bed mr-1"></i>${rental.bedrooms || 0} beds</span>
                  <span class="mr-3"><i class="fas fa-bath mr-1"></i>${rental.bathrooms || 0} baths</span>
                  <span><i class="fas fa-users mr-1"></i>${rental.max_guests || 1} guests</span>
                </div>
              </div>
            `;

            // Create info window
            const infoWindow = new InfoWindow({
              content,
              maxWidth: 300,
            });

            // Add click listener to marker
            marker.addListener('click', () => {
              // Close all other info windows
              infoWindowsRef.current.forEach(window => window.close());
              // Open this info window
              infoWindow.open(mapInstanceRef.current, marker);
              // Notify parent component
              if (onRentalSelect) {
                onRentalSelect(rental);
              }
            });

            markersRef.current.push(marker);
            infoWindowsRef.current.push(infoWindow);
          }
        });

        // Center map on selected rental if any
        if (selectedRental && selectedRental.location) {
          mapInstanceRef.current.setCenter(selectedRental.location);
          mapInstanceRef.current.setZoom(15);
          
          // Find and open the info window for the selected rental
          const markerIndex = rentals.findIndex(r => r.id === selectedRental.id);
          if (markerIndex !== -1 && infoWindowsRef.current[markerIndex]) {
            infoWindowsRef.current[markerIndex].open(mapInstanceRef.current, markersRef.current[markerIndex]);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading map:', error);
        setError('Failed to load map. Please try again later.');
        setIsLoading(false);
      }
    };

    if (mapRef.current) {
      initMap();
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      infoWindowsRef.current.forEach(window => window.close());
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [rentals, selectedRental, onRentalSelect, initialCenter]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full bg-gray-100"
      style={{ minHeight: '400px' }}
    />
  );
};

RentalMap.propTypes = {
  rentals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.string.isRequired,
      image: PropTypes.string,
      location: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired
      }),
      address: PropTypes.string,
      bedrooms: PropTypes.number,
      bathrooms: PropTypes.number,
      max_guests: PropTypes.number,
      provider: PropTypes.shape({
        name: PropTypes.string,
        rating: PropTypes.number,
        reviewCount: PropTypes.number,
        image: PropTypes.string
      })
    })
  ).isRequired,
  selectedRental: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }),
    address: PropTypes.string,
  }),
  onRentalSelect: PropTypes.func,
  initialCenter: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  })
};

export default RentalMap; 
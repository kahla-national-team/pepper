"use client"
import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaBed, FaBath, FaUsers } from 'react-icons/fa';

const RentalMap = ({ rentals, selectedRental, onRentalSelect, initialCenter }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const clustererRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapInstanceRef = useRef(null);

  // Debounce function to limit marker updates
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Create markers only for visible rentals
  const createMarkers = useCallback(async (map, rentals, clusterer) => {
    const { Marker } = await google.maps.importLibrary("marker");
    const { InfoWindow } = await google.maps.importLibrary("maps");

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current.forEach(window => window.close());
    infoWindowsRef.current = [];

    // Create markers in batches
    const batchSize = 50;
    for (let i = 0; i < rentals.length; i += batchSize) {
      const batch = rentals.slice(i, i + batchSize);
      await new Promise(resolve => setTimeout(resolve, 0)); // Allow UI updates

      batch.forEach(rental => {
        if (rental.location) {
          const marker = new Marker({
            position: rental.location,
            map: null, // Don't add to map directly
            title: rental.title,
            animation: google.maps.Animation.DROP,
          });

          const infoWindow = new InfoWindow({
            content: `
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
            `,
            maxWidth: 300,
          });

          marker.addListener('click', () => {
            infoWindowsRef.current.forEach(window => window.close());
            infoWindow.open(map, marker);
            if (onRentalSelect) {
              onRentalSelect(rental);
            }
          });

          markersRef.current.push(marker);
          infoWindowsRef.current.push(infoWindow);
          clusterer.addMarker(marker);
        }
      });
    }
  }, [onRentalSelect]);

  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load required libraries
        const { Map } = await google.maps.importLibrary("maps");
        const { MarkerClusterer } = await google.maps.importLibrary("markerclusterer");

        // Create map instance if it doesn't exist
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new Map(mapRef.current, {
            center: initialCenter || { lat: 35.6971, lng: -0.6337 },
            zoom: 12,
            mapId: "pepper_map",
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          });

          // Create marker clusterer
          clustererRef.current = new MarkerClusterer({
            map: mapInstanceRef.current,
            markers: [],
            renderer: {
              render: ({ count, position }) => {
                return new google.maps.Marker({
                  position,
                  label: { text: String(count), color: "white" },
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: "#ff385c",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                    scale: 20,
                  },
                });
              },
            },
          });

          // Update markers when map bounds change
          const updateVisibleMarkers = debounce(() => {
            const bounds = mapInstanceRef.current.getBounds();
            if (bounds) {
              // Remove setVisibleMarkers call since we don't need it
              // const visible = rentals.filter(rental => 
              //   rental.location && bounds.contains(rental.location)
              // );
              // setVisibleMarkers(visible);
            }
          }, 250);

          mapInstanceRef.current.addListener("idle", updateVisibleMarkers);
        }

        // Update map center if needed
        if (initialCenter) {
          mapInstanceRef.current.setCenter(initialCenter);
        }

        // Create markers
        await createMarkers(mapInstanceRef.current, rentals, clustererRef.current);

        // Center on selected rental
        if (selectedRental?.location) {
          mapInstanceRef.current.setCenter(selectedRental.location);
          mapInstanceRef.current.setZoom(15);
          
          const markerIndex = rentals.findIndex(r => r.id === selectedRental.id);
          if (markerIndex !== -1 && infoWindowsRef.current[markerIndex]) {
            infoWindowsRef.current[markerIndex].open(
              mapInstanceRef.current, 
              markersRef.current[markerIndex]
            );
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

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      infoWindowsRef.current.forEach(window => window.close());
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [rentals, selectedRental, initialCenter, createMarkers]);

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
      className="w-full h-full bg-gray-100 rounded-lg shadow-lg"
      style={{ 
        minHeight: 'calc(100vh - 4rem)',
        position: 'sticky',
        top: '4rem'
      }}
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
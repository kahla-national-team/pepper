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
              <div style="padding: 0; max-width: 220px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.15); background: #fff;">
                <img src="${rental.image}" alt="${rental.title}" style="width: 100%; height: 90px; object-fit: cover; border-top-left-radius: 10px; border-top-right-radius: 10px;"/>
                <div style="padding: 10px;">
                  <h3 style="font-size: 1rem; font-weight: bold; margin-bottom: 4px; color: #222;">${rental.title}</h3>
                  <div style="color: #ff385c; font-weight: bold; margin-bottom: 4px;">${rental.price}</div>
                  <button style="background: #ff385c; color: #fff; border: none; border-radius: 5px; padding: 6px 12px; font-size: 0.9rem; cursor: pointer; margin-top: 4px;" onclick="window.open('/details/${rental.id}', '_blank')">View Details</button>
                </div>
              </div>
            `,
            maxWidth: 240,
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
                return new google.maps.marker.AdvancedMarkerElement({
                  position,
                  content: (() => {
                    const div = document.createElement('div');
                    div.style.background = '#ff385c';
                    div.style.color = 'white';
                    div.style.borderRadius = '50%';
                    div.style.width = '40px';
                    div.style.height = '40px';
                    div.style.display = 'flex';
                    div.style.alignItems = 'center';
                    div.style.justifyContent = 'center';
                    div.style.fontWeight = 'bold';
                    div.textContent = String(count);
                    return div;
                  })(),
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
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-600 mb-4">
            This might be due to billing issues with Google Maps API or network problems.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#e31c5f] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  // Show message if no rentals with locations
  if (!rentals || rentals.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">No rentals available</p>
          <p className="text-sm text-gray-500">Try adjusting your search filters</p>
        </div>
      </div>
    );
  }

  // Check if any rentals have valid locations
  const rentalsWithLocation = rentals.filter(rental => rental.location && 
    typeof rental.location.lat === 'number' && 
    typeof rental.location.lng === 'number'
  );

  if (rentalsWithLocation.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">No rentals with location data</p>
          <p className="text-sm text-gray-500">Location information is required to display on map</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full bg-gray-100 rounded-lg shadow-lg"
      style={{ 
        minHeight: 'calc(100vh - 4rem)',
        height: 'calc(100vh - 4rem)'
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
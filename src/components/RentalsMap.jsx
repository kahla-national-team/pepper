import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { rentalService } from '../services/rentalService';
import { Link } from 'react-router-dom';

// Define required libraries
const libraries = ['marker'];

// Default center (New York City)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const RentalsMap = () => {
  const [rentals, setRentals] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapError, setMapError] = useState(null);

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '0.75rem'
  };

  // Fetch rentals data
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const data = await rentalService.getAllRentals();
        console.log('Fetched rentals:', data); // Debug log

        // Filter and validate rentals with coordinates
        const validRentals = data.filter(rental => {
          const hasValidCoords = 
            rental.latitude && 
            rental.longitude && 
            !isNaN(parseFloat(rental.latitude)) && 
            !isNaN(parseFloat(rental.longitude));
          
          if (!hasValidCoords) {
            console.warn('Invalid coordinates for rental:', rental); // Debug log
          }
          return hasValidCoords;
        });

        console.log('Valid rentals:', validRentals); // Debug log
        setRentals(validRentals);
        
        // Set map center to first valid rental or default
        if (validRentals.length > 0) {
          const firstRental = validRentals[0];
          setMapCenter({
            lat: parseFloat(firstRental.latitude),
            lng: parseFloat(firstRental.longitude)
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching rentals:', err);
        setError('Failed to load rental locations');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  // Create marker element
  const createMarkerElement = useCallback((rental) => {
    const element = document.createElement('div');
    element.className = 'custom-marker';
    element.innerHTML = `
      <div class="w-8 h-8 bg-[#ff385c] rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
        $${rental.price}
      </div>
    `;
    return element;
  }, []);

  // Initialize map and markers
  const onLoad = useCallback((map) => {
    console.log('Map loaded, rentals:', rentals); // Debug log

    if (rentals.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      const newMarkers = [];

      rentals.forEach((rental, index) => {
        try {
          const position = {
            lat: parseFloat(rental.latitude),
            lng: parseFloat(rental.longitude)
          };

          console.log(`Creating marker ${index + 1}:`, position); // Debug log

          // Create marker element
          const markerView = new window.google.maps.marker.AdvancedMarkerElement({
            map,
            position,
            title: rental.title,
            content: createMarkerElement(rental),
            gmpClickable: true
          });

          // Add click listener
          markerView.addListener('click', () => {
            console.log('Marker clicked:', rental); // Debug log
            setSelectedRental(rental);
          });

          newMarkers.push(markerView);
          bounds.extend(position);
        } catch (err) {
          console.error(`Error creating marker for rental ${index}:`, err);
        }
      });

      console.log('Setting markers:', newMarkers.length); // Debug log
      setMarkers(newMarkers);
      map.fitBounds(bounds);
    }
  }, [rentals, createMarkerElement]);

  // Handle map errors
  const onMapError = useCallback((error) => {
    console.error('Map error:', error);
    setMapError('Failed to load map. Please try again later.');
  }, []);

  // Cleanup markers
  useEffect(() => {
    return () => {
      markers.forEach(marker => {
        if (marker && marker.map) {
          marker.map = null;
        }
      });
    };
  }, [markers]);

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  if (error || mapError) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Error</h3>
          <p className="text-gray-600 mt-2">{error || mapError}</p>
        </div>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">No Rentals Found</h3>
          <p className="text-gray-600 mt-2">There are no rentals with valid locations to display on the map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={2}
        onLoad={onLoad}
        onError={onMapError}
        options={{
          mapId: 'rental_map',
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true
        }}
      >
        {selectedRental && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedRental.latitude),
              lng: parseFloat(selectedRental.longitude)
            }}
            onCloseClick={() => setSelectedRental(null)}
          >
            <div className="p-2">
              <img
                src={selectedRental.image || '/placeholder-stay.jpg'}
                alt={selectedRental.title}
                className="w-full h-32 object-cover rounded-lg mb-2"
                onError={(e) => {
                  e.target.src = '/placeholder-stay.jpg';
                }}
              />
              <h3 className="font-semibold text-gray-900">{selectedRental.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedRental.address}</p>
              <p className="text-[#ff385c] font-semibold">${selectedRental.price} per night</p>
              <Link
                to={`/details/stay/${selectedRental.id}`}
                className="mt-2 inline-block text-sm text-[#ff385c] hover:underline"
              >
                View Details
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default RentalsMap; 
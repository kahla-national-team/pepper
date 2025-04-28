import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const ServiceMap = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Service locations in Oran, Algeria
  const serviceLocations = [
    {
      id: 1,
      title: "Service Center 1",
      description: "Premium service center with full amenities",
      location: { lat: 35.6971, lng: -0.6337 }, // Oran city center
    },
    {
      id: 2,
      title: "Service Center 2",
      description: "Express service center for quick repairs",
      location: { lat: 35.7047, lng: -0.6503 }, // Bir El Djir
    },
    {
      id: 3,
      title: "Service Center 3",
      description: "Specialized service center for luxury vehicles",
      location: { lat: 35.6892, lng: -0.6418 }, // Sidi El Houari
    },
  ];

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyB1sD5MQKu-bQhgQWmTOzwjVCvPRMdpyMI', // Replace with your actual API key
  });

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = {
    lat: 35.6971,
    lng: -0.6337, // Oran city center
  };

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    serviceLocations.forEach((service) => {
      bounds.extend(service.location);
    });
    map.fitBounds(bounds);
  }, [serviceLocations]);

  const onUnmount = useCallback(function callback() {
    // Cleanup if needed
  }, []);

  return (
    <div className="relative w-full">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMapVisible(!isMapVisible)}
        className="fixed bottom-8 right-8 z-50 bg-[#000000] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
      >
        <FaMapMarkerAlt className="w-5 h-5" />
        {isMapVisible ? 'Hide Map' : 'Show Map'}
      </motion.button>

      {/* Map Container */}
      <AnimatePresence>
        {isMapVisible && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed right-0  w-1/2 h-screen bg-white shadow-2xl z-40"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full h-full relative overflow-hidden"
            >
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={13}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                >
                  {serviceLocations.map((service) => (
                    <Marker
                      key={service.id}
                      position={service.location}
                      onClick={() => setSelectedService(service)}
                      animation={window.google.maps.Animation.DROP}
                    />
                  ))}

                  {selectedService && (
                    <InfoWindow
                      position={selectedService.location}
                      onCloseClick={() => setSelectedService(null)}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2"
                      >
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {selectedService.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedService.description}
                        </p>
                      </motion.div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-gray-500">Loading map...</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceMap; 
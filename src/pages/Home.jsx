"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMap, FaTimes } from 'react-icons/fa';
import StaysCard from '../components/RENTALCard';
import ServiceCard from '../components/ServiceCard';
import RentalMap from '../components/RentalMap';
import MapToggleWrapper from '../components/MapToggleWrapper';
import { useMapVisibility } from '../context/MapVisibilityContext';
import SwipingSearchBar from '../components/SwipingSearchBar';
import { rentalService } from '../services/rentalService';
import { conciergeService } from '../services/conciergeService';
import { useSearchMode } from '../context/SearchModeContext';

// Sample data for services only
const services = [
  {
    id: 1,
    type: 'service',
    title: "Private Chef",
    description: "Professional chef service for intimate dinners or special occasions. Customized menus available.",
    price: "$150/hour",
    provider: {
      name: "Gourmet Chefs",
      rating: 4.9,
      reviewCount: 156,
      image: "/chef1.jpg",
      type: 'service_provider'
    },
    image: "/chef-service.jpg",
    address: "Available in your location"
  },
  {
    id: 2,
    type: 'service',
    title: "Housekeeping",
    description: "Professional cleaning and housekeeping services. Regular and deep cleaning available.",
    price: "$80/hour",
    provider: {
      name: "Clean & Care",
      rating: 4.8,
      reviewCount: 243,
      image: "/housekeeper1.jpg",
      type: 'service_provider'
    },
    image: "/housekeeping.jpg",
    address: "Available in your location"
  },
  {
    id: 3,
    type: 'service',
    title: "Personal Driver",
    description: "Professional chauffeur service for safe and comfortable transportation.",
    price: "$60/hour",
    provider: {
      name: "Elite Drivers",
      rating: 4.9,
      reviewCount: 189,
      image: "/driver1.jpg",
      type: 'service_provider'
    },
    image: "/driver-service.jpg",
    address: "Available in your location"
  },
  {
    id: 4,
    type: 'service',
    title: "Concierge",
    description: "Personal concierge service for all your needs. From reservations to special requests.",
    price: "$100/hour",
    provider: {
      name: "VIP Concierge",
      rating: 4.9,
      reviewCount: 167,
      image: "/concierge1.jpg",
      type: 'service_provider'
    },
    image: "/concierge-service.jpg",
    address: "Available in your location"
  }
];

const Home = () => {
  const [stays, setStays] = useState([]);
  const [conciergeServices, setConciergeServices] = useState([]);
  const [selectedStay, setSelectedStay] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [staysFilters, setStaysFilters] = useState({
    destination: '',
    dates: { checkIn: null, checkOut: null },
    guests: { adults: 1, children: 0, babies: 0 },
    amenities: [],
    rating: 0,
    favorites: false,
    priceRange: { min: 0, max: 1000 },
    duration: '',
    roomType: 'any',
    bedrooms: 0,
    beds: 0,
    bathrooms: 0
  });
  const [servicesFilters, setServicesFilters] = useState({
    service: '',
    serviceTypes: [],
    when: '',
    location: '',
    urgency: '',
    availability: '',
    budget: { min: 0, max: 10000 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesError, setServicesError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 35.6971, lng: -0.6337 }); // Default to Oran, Algeria

  const { isMapVisible, setIsMapVisible } = useMapVisibility();
  const { activeMode } = useSearchMode();

  // Fetch stays data
  useEffect(() => {
    const fetchStays = async () => {
      try {
        setIsLoading(true);
        const data = await rentalService.getRentals(staysFilters);
        
        // Filter out rentals without coordinates and convert price to string
        const validRentals = data.filter(rental => rental.location && 
          typeof rental.location.lat === 'number' && 
          typeof rental.location.lng === 'number'
        ).map(rental => ({
          ...rental,
          price: `$${rental.price}/night`
        }));
        
        setStays(validRentals);
        
        // Update map center if we have rentals with coordinates
        if (validRentals.length > 0) {
          // Calculate the average center of all rentals
          const totalLat = validRentals.reduce((sum, rental) => sum + rental.location.lat, 0);
          const totalLng = validRentals.reduce((sum, rental) => sum + rental.location.lng, 0);
          setMapCenter({
            lat: totalLat / validRentals.length,
            lng: totalLng / validRentals.length
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching stays:', err);
        setError(err.message || 'Failed to load stays. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch stays if we're in stays mode
    if (activeMode === 'stays') {
      fetchStays();
    }
  }, [staysFilters, activeMode]);

  // Fetch concierge services data
  useEffect(() => {
    const fetchConciergeServices = async () => {
      try {
        setIsServicesLoading(true);
        const response = await conciergeService.getAllServices();
        if (response.success) {
          // Convert price to string format and map name to title for ServiceCard
          const servicesWithStringPrice = response.data.map(service => ({
            ...service,
            title: service.name, // Map name to title for ServiceCard
            price: `$${service.price}/day`,
            type: service.type || 'concierge',
          }));
          setConciergeServices(servicesWithStringPrice);
        } else {
          throw new Error(response.message || 'Failed to fetch services');
        }
        setServicesError(null);
      } catch (err) {
        console.error('Error fetching concierge services:', err);
        setServicesError(err.message || 'Failed to load services. Please try again later.');
      } finally {
        setIsServicesLoading(false);
      }
    };

    // Only fetch services if we're in services mode
    if (activeMode === 'services') {
      fetchConciergeServices();
    }
  }, [activeMode]);

  const handleSearch = (value) => {
    if (activeMode === 'stays') {
      setStaysFilters(prev => ({
        ...prev,
        destination: value
      }));
    } else {
      setServicesFilters(prev => ({
        ...prev,
        service: value
      }));
    }
  };

  const handleFilterChange = (newFilters) => {
    if (activeMode === 'stays') {
      setStaysFilters(newFilters);
    } else {
      setServicesFilters(newFilters);
    }
  };

  const handleStaySelect = (stay) => {
    setSelectedStay(stay);
    if (stay.location) {
      setMapCenter(stay.location);
    }
  };

  // Component for rendering a section with cards
  const Section = ({ title, items, onItemSelect, selectedItem, ItemCard, isLoading, error }) => {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4 bg-red-50 rounded-xl">
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-medium text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${
            isMapVisible 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {items.map((item) => (
              <ItemCard 
                key={item.id}
                service={item}
                isSelected={selectedItem?.id === item.id}
                onClick={() => onItemSelect(item)}
              />
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SwipingSearchBar - positioned at top */}
      <SwipingSearchBar 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={activeMode === 'stays' ? staysFilters : servicesFilters}
      />

      {/* Map Toggle Button - Only show for stays mode */}
      {activeMode === 'stays' && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setIsMapVisible(!isMapVisible)}
            className="bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            aria-label={isMapVisible ? 'Hide map' : 'Show map'}
          >
            {isMapVisible ? (
              <FaTimes className="w-5 h-5 text-gray-600" />
            ) : (
              <FaMap className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-h-screen">
        <div className={`transition-all duration-300 ${isMapVisible ? 'lg:w-1/2 lg:pl-8' : 'w-full'}`}>
          <main className={`py-4 sm:py-8 pt-[200px] ${isMapVisible ? 'pr-4' : 'container mx-auto px-4'}`}> {/* Adjusted padding-top for navbar + search bar */}
            {/* Stays Section - Only show when in stays mode */}
            {activeMode === 'stays' && (
              <Section
                title="Available Stays"
                items={stays}
                onItemSelect={handleStaySelect}
                selectedItem={selectedStay}
                ItemCard={(props) => <StaysCard {...props} isHomePage={true} />}
                isLoading={isLoading}
                error={error}
              />
            )}

            {/* Concierge Services Section - Only show when in services mode */}
            {activeMode === 'services' && (
              <Section
                title="Available Services"
                items={conciergeServices}
                onItemSelect={setSelectedService}
                selectedItem={selectedService}
                ItemCard={(props) => <ServiceCard {...props} isHomePage={true} />}
                isLoading={isServicesLoading}
                error={servicesError}
              />
            )}
          </main>
        </div>

        {/* Map - Only show for stays when map is visible */}
        {activeMode === 'stays' && isMapVisible && (
          <div className="hidden lg:block lg:w-1/2 lg:pl-4 lg:pr-8">
            <div className="sticky top-16 h-[calc(100vh-4rem)]">
              <RentalMap 
                rentals={stays}
                selectedRental={selectedStay}
                onRentalSelect={handleStaySelect}
                initialCenter={mapCenter}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
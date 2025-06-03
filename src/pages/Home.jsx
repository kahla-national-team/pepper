"use client"

import React, { useState, useEffect } from 'react';
import StaysCard from '../components/RENTALCard';
import ServiceCard from '../components/ServiceCard';
import RentalMap from '../components/RentalMap';
import MapToggleWrapper from '../components/MapToggleWrapper';
import { useMapVisibility } from '../context/MapVisibilityContext';
import SearchBar from '../components/serviceSearchBar';
import { rentalService } from '../services/rentalService';
import { conciergeService } from '../services/conciergeService';

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
  const [filters, setFilters] = useState({
    destination: '',
    dates: { start: null, end: null },
    guests: { adults: 1, children: 0, babies: 0 },
    amenities: [],
    rating: 0,
    favorites: false,
    priceRange: { min: 0, max: 1000 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesError, setServicesError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 35.6971, lng: -0.6337 }); // Default to Oran, Algeria

  const { isMapVisible } = useMapVisibility();

  useEffect(() => {
    const fetchStays = async () => {
      try {
        setIsLoading(true);
        const data = await rentalService.getRentals(filters);
        
        // Filter out rentals without coordinates
        const validRentals = data.filter(rental => rental.location && 
          typeof rental.location.lat === 'number' && 
          typeof rental.location.lng === 'number'
        );
        
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

    fetchStays();
  }, [filters]);

  // Add new useEffect for fetching concierge services
  useEffect(() => {
    const fetchConciergeServices = async () => {
      try {
        setIsServicesLoading(true);
        const response = await conciergeService.getAllServices();
        if (response.success) {
          setConciergeServices(response.data);
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

    fetchConciergeServices();
  }, []);

  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      destination: value
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleStaySelect = (stay) => {
    setSelectedStay(stay);
    if (stay.location) {
      setMapCenter(stay.location);
    }
  };

  // Component for rendering a section with cards
  const Section = ({ title, items, onItemSelect, selectedItem, ItemCard, isLoading, error }) => (
    <section className="mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">{title}</h2>
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

  return (
    <div className="min-h-screen bg-white"> 
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SearchBar 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          filters={filters}
        />
        {/* Main content - Add padding-top to account for fixed Navbar + search bar */}
        <div className={`w-full transition-all duration-300 ${isMapVisible ? 'lg:w-1/2' : 'lg:w-full'}`}>
          <main className="container mx-auto px-4 py-4 sm:py-8 pt-[120px]">
            {/* Stays Section */}
            <Section
              title="Available Stays"
              items={stays}
              onItemSelect={handleStaySelect}
              selectedItem={selectedStay}
              ItemCard={StaysCard}
              isLoading={isLoading}
              error={error}
            />

            {/* Concierge Services Section */}
            <Section
              title="Available Services"
              items={conciergeServices}
              onItemSelect={setSelectedService}
              selectedItem={selectedService}
              ItemCard={ServiceCard}
              isLoading={isServicesLoading}
              error={servicesError}
            />
          </main>
        </div>

        {/* Map Toggle Button and Map */}
        <MapToggleWrapper>
          <RentalMap 
            rentals={stays}
            selectedRental={selectedStay}
            onRentalSelect={handleStaySelect}
            initialCenter={mapCenter}
          />
        </MapToggleWrapper>
      </div>
    </div>
  );
};

export default Home;
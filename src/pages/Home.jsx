"use client"

import React, { useState } from 'react';
// Remove ServiceSearchBar import from here
// import ServiceSearchBar from '../components/serviceSearchBar';
import StaysCard from '../components/StaysCard';
import ServiceCard from '../components/ServiceCard';
import ServiceMap from '../components/ServiceMap';
import MapToggleWrapper from '../components/MapToggleWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapVisibility } from '../context/MapVisibilityContext';

// Sample data for stays
const stays = [
  {
    id: 1,
    type: 'stay',
    title: "Luxury Beach Villa",
    description: "Stunning beachfront villa with private pool and ocean views. Perfect for a romantic getaway or family vacation.",
    price: "$450/night",
    provider: {
      name: "Beach Resorts",
      rating: 4.9,
      reviewCount: 128,
      image: "/host1.jpg",
      type: 'property_owner'
    },
    image: "/stay1.jpg",
    location: { lat: 35.6971, lng: -0.6337 },
    address: "123 Beach Road, Malibu, CA"
  },
  {
    id: 2,
    type: 'stay',
    title: "Mountain View Cabin",
    description: "Cozy cabin nestled in the mountains with breathtaking views. Ideal for nature lovers and outdoor enthusiasts.",
    price: "$250/night",
    provider: {
      name: "Mountain Retreats",
      rating: 4.8,
      reviewCount: 95,
      image: "/host2.jpg",
      type: 'property_owner'
    },
    image: "/stay2.jpg",
    location: { lat: 35.7071, lng: -0.6437 },
    address: "456 Mountain Trail, Aspen, CO"
  },
  {
    id: 3,
    type: 'stay',
    title: "City Center Apartment",
    description: "Modern apartment in the heart of downtown. Walking distance to restaurants, shops, and attractions.",
    price: "$200/night",
    provider: {
      name: "Urban Stays",
      rating: 4.7,
      reviewCount: 156,
      image: "/host3.jpg",
      type: 'property_owner'
    },
    image: "/stay3.jpg",
    location: { lat: 35.7171, lng: -0.6537 },
    address: "789 Main Street, New York, NY"
  },
  {
    id: 4,
    type: 'stay',
    title: "Lakeside Cottage",
    description: "Charming cottage on the lake with private dock. Perfect for fishing, swimming, and water activities.",
    price: "$300/night",
    provider: {
      name: "Lake Properties",
      rating: 4.9,
      reviewCount: 82,
      image: "/host4.jpg",
      type: 'property_owner'
    },
    image: "/stay4.jpg",
    location: { lat: 35.7271, lng: -0.6637 },
    address: "321 Lake Road, Lake Tahoe, CA"
  }
];

// Sample data for services
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
  const [selectedStay, setSelectedStay] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  // Remove searchFilters state as filtering will be handled by Navbar search
  // const [searchFilters, setSearchFilters] = useState({});

  const { isMapVisible } = useMapVisibility();

  // Component for rendering a section with cards
  const Section = ({ title, items, onItemSelect, selectedItem, ItemCard }) => (
    <section className="mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">{title}</h2>
      <div className={`grid gap-4 sm:gap-6 ${
        isMapVisible 
          ? 'grid-cols-1' 
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
    </section>
  );

  // Remove filtering logic from here
  const filteredStays = stays; // Use original data
  const filteredServices = services; // Use original data

  return (
    <div className="min-h-screen bg-white"> 
      <div className="flex flex-col lg:flex-row">
        {/* Main content - Add padding-top to account for fixed Navbar + search bar */}
        <div className={`w-full transition-all duration-300 ${isMapVisible ? 'lg:w-1/2' : 'lg:w-full'}`}>
          <main className="container mx-auto px-4 py-4 sm:py-8 pt-[120px]"> {/* Adjusted padding-top based on Navbar height */}

            {/* Stays Section */}
            <Section
              title="Available Stays"
              items={filteredStays}
              onItemSelect={setSelectedStay}
              selectedItem={selectedStay}
              ItemCard={StaysCard}
            />

            {/* Services Section */}
            <Section
              title="Available Services"
              items={filteredServices}
              onItemSelect={setSelectedService}
              selectedItem={selectedService}
              ItemCard={ServiceCard}
            />
          </main>
        </div>

        {/* Map Toggle Button and Map */}
        <MapToggleWrapper>
          <ServiceMap 
            services={[...stays, ...services]} // Pass all services to the map for now
            selectedService={selectedStay || selectedService} 
          />
        </MapToggleWrapper>
      </div>
    </div>
  );
};

export default Home;
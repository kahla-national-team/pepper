"use client"
import { useState } from 'react';
import StaysCard from '../components/StaysCard';
import { useMapVisibility } from '../context/MapVisibilityContext';
import ServiceMap from '../components/ServiceMap';
import MapToggleWrapper from '../components/MapToggleWrapper';
import ServiceSearchBar from '../components/serviceSearchBar';

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

const Stays = () => {
  const [selectedStay, setSelectedStay] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});

  const { isMapVisible } = useMapVisibility();

  const StaysSection = ({ items, onItemSelect, selectedItem, ItemCard }) => (
    <section className="mb-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Stays</h1>
      <div className={`grid gap-6 mb-8 ${
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
    </section>
  );

  const filteredStays = stays.filter(stay => 
    stay.title.toLowerCase().includes(searchFilters.whatService?.toLowerCase() || '') ||
    stay.address.toLowerCase().includes(searchFilters.location?.toLowerCase() || '')
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row">
        <div className={`w-full transition-all duration-300 ${isMapVisible ? 'lg:w-1/2' : 'lg:w-full'}`}>
          <main className="container mx-auto px-4 py-8">
            <div className="mb-8 sm:mb-12 in-flow">
              <ServiceSearchBar 
                onSearch={setSearchFilters}
                filters={searchFilters}
              />
            </div>

            <StaysSection
              items={filteredStays}
              onItemSelect={setSelectedStay}
              selectedItem={selectedStay}
              ItemCard={StaysCard}
            />
          </main>
        </div>

        <MapToggleWrapper>
          <ServiceMap 
            services={filteredStays}
            selectedService={selectedStay}
          />
        </MapToggleWrapper>
      </div>
    </div>
  );
};

export default Stays; 
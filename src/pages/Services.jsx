"use client"
import { useState } from 'react';
import { useMapVisibility } from '../context/MapVisibilityContext';
import ServiceCard from '../components/ServiceCard';

const services = [
  {
    id: 1,
    title: "Private Chef",
    description: "Professional chef service for intimate dinners or special occasions. Customized menus available.",
    price: "$150/hour",
    provider: {
      name: "Gourmet Chefs",
      rating: 4.9,
      reviewCount: 156,
      image: "/chef1.jpg"
    },
    image: "/chef-service.jpg",
    address: "Available in your location"
  },
  {
    id: 2,
    title: "Housekeeping",
    description: "Professional cleaning and housekeeping services. Regular and deep cleaning available.",
    price: "$80/hour",
    provider: {
      name: "Clean & Care",
      rating: 4.8,
      reviewCount: 243,
      image: "/housekeeper1.jpg"
    },
    image: "/housekeeping.jpg",
    address: "Available in your location"
  },
  {
    id: 3,
    title: "Personal Driver",
    description: "Professional chauffeur service for safe and comfortable transportation.",
    price: "$60/hour",
    provider: {
      name: "Elite Drivers",
      rating: 4.9,
      reviewCount: 189,
      image: "/driver1.jpg"
    },
    image: "/driver-service.jpg",
    address: "Available in your location"
  },
  {
    id: 4,
    title: "Concierge",
    description: "Personal concierge service for all your needs. From reservations to special requests.",
    price: "$100/hour",
    provider: {
      name: "VIP Concierge",
      rating: 4.9,
      reviewCount: 167,
      image: "/concierge1.jpg"
    },
    image: "/concierge-service.jpg",
    address: "Available in your location"
  }
];

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const { isMapVisible } = useMapVisibility();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Services</h1>
      
      <div className={`grid gap-6 ${
        isMapVisible 
          ? 'grid-cols-1 md:grid-cols-2' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      }`}>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isSelected={selectedService?.id === service.id}
            onClick={() => setSelectedService(service)}
          />
        ))}
      </div>
    </div>
  );
};

export default Services; 
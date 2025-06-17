import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import ServiceMap from '../components/ServiceMap';
import SearchBar from '../components/serviceSearchBar';
import { AnimatePresence } from 'framer-motion';

const ServicesPage = () => {
  console.log('ServicesPage rendering');
  
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    service: '',
    location: '',
    date: '',
    guests: 1,
    priceRange: { min: 0, max: 1000 }
  });
  const [selectedService, setSelectedService] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(true);

  // Fetch services based on filters
  useEffect(() => {
    const fetchServices = async () => {
      const mockServices = [
        {
          id: '1',
          type: 'stay',
          title: "Luxury Beach Villa",
          description: "Stunning beachfront villa with panoramic views.",
          price: "From $250/night",
          provider: {
            name: "Elite Stays",
            rating: 4.9,
            reviewCount: 156,
            image: "/placeholder.svg"
          },
          location: { lat: 35.6971, lng: -0.6337 },
          address: "123 Beach Road, Oran",
          availability: ["Mon", "Wed", "Fri"],
          maxGuests: 10
        },
        {
          id: '2',
          type: 'conciergerie',
          title: "Personal Assistant",
          description: "24/7 personal concierge service.",
          price: "From DZD1000/hour",
          provider: {
            name: "Elite Concierge",
            rating: 4.8,
            reviewCount: 98,
            image: "/placeholder.svg"
          },
          location: { lat: 35.7071, lng: -0.6437 },
          address: "456 City Center, Oran",
          availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          maxGuests: null
        }
      ];
      setServices(mockServices);
      if (mockServices.length > 0) {
        setSelectedService(mockServices[0]);
      }
    };

    fetchServices();
  }, [filters]);

  const handleSearch = (searchFilters) => {
    setFilters(prev => ({
      ...prev,
      ...searchFilters
    }));
  };

  const handleServiceSelect = (service) => {
    console.log('Service clicked:', service);
    const newPath = `/services/${service.id}`;
    console.log('Navigating to:', newPath);
    navigate(newPath); // Use React Router's navigate
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar 
            onSearch={handleSearch} 
            filters={filters}
          />
        </div>
      </div>

      {/* Layout principal: ServiceCards à gauche, Map à droite */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Services</h2>
          <button 
            onClick={() => setIsMapVisible(!isMapVisible)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {isMapVisible ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Service Cards */}
          <div className="w-full lg:w-2/3 space-y-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Services disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {services.map((service) => (
                  <div key={service.id} className="relative">
                    <ServiceCard 
                      service={service}
                      isSelected={selectedService?.id === service.id}
                      onClick={() => handleServiceSelect(service)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          {isMapVisible && (
            <div className="w-full lg:w-1/3">
              <ServiceMap 
                services={services} 
                selectedService={selectedService}
              />
            </div>
          )}
        </div>
      </div>
      {/* Test button for navigation */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Debug Navigation</h3>
        <button 
          onClick={() => navigate('/services/1')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Navigation to Service 1
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default ServicesPage;

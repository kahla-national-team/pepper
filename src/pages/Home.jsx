import { useState } from 'react';
import Service1 from './Service1';
import SearchBar from '../components/SearchBar';
import ServiceMap from '../components/ServiceMap';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Handle search logic here
    console.log('Searching for:', term);
  };

  const services = [
    {
      title: 'Service 1',
      description: 'Description for Service 1. This is a placeholder text that describes what this service offers.',
    },
  ];

  return (
    <div className="min-h-screen bg-white-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Service1
              key={index}
              title={service.title}
              description={service.description}
            />
          ))}
          <ServiceMap />
      </div>
        </div>
        
    </div>
  );
};

export default Home; 
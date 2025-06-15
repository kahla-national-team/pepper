import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { propertyService } from '../services/propertyService';
import AdminPropertyCard from '../components/AdminPropertyCard';
import PropertyFilters from '../components/PropertyFilters';

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    status: 'all' // 'all', 'active', 'inactive'
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await propertyService.getProperties(filters);
      setProperties(response || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      await propertyService.deleteProperty(propertyId);
      setProperties(prevProperties => prevProperties.filter(p => p.id !== propertyId));
    } catch (err) {
      console.error('Error deleting property:', err);
      throw err;
    }
  };

  const handleToggleStatus = async (propertyId, newStatus) => {
    try {
      await propertyService.updateProperty(propertyId, { isActive: newStatus });
      setProperties(prevProperties =>
        prevProperties.map(p =>
          p.id === propertyId ? { ...p, isActive: newStatus } : p
        )
      );
    } catch (err) {
      console.error('Error updating property status:', err);
      throw err;
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-xl text-gray-700">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Property Management</h1>
          <Link
            to="/admin/properties/add"
            className="inline-flex items-center px-4 py-2 bg-[#ff385c] text-white rounded-md hover:bg-[#ff385c]/90 transition-colors"
          >
            <FaPlus className="mr-2" /> Add New Property
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <PropertyFilters onFilterChange={handleFilterChange} initialFilters={filters} />
        </div>

        {properties.length === 0 ? (
          <div className="text-center text-gray-600 text-lg mt-16">
            <p>No properties found.</p>
            <p>Click "Add New Property" to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <AdminPropertyCard
                key={property.id}
                property={property}
                onDelete={handleDeleteProperty}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 
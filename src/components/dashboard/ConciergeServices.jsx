import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { conciergeService } from '../../services/conciergeService';
import { authService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import ServiceFormModal from './ServiceFormModal';

const ServiceCard = ({ service, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={service.photo_url || service.image} 
          alt={service.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1555215695-300b0ca6ba4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
          }}
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {service.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 mb-2">{service.name}</h3>
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-[#ff385c] font-bold text-lg">${service.price}</span>
          <div className="flex items-center text-yellow-400">
            <FaStar />
            <span className="ml-1 text-gray-600">{service.rating || 'New'}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 mb-6">
          <FaCalendarAlt className="mr-2" />
          <span>{service.bookings || 0} bookings</span>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => onEdit(service)}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#ff385c] text-white py-3 rounded-xl hover:bg-[#ff385c]/90 transition-all"
          >
            <FaEdit />
            <span>Edit</span>
          </button>
          <button 
            onClick={() => onDelete(service.id)}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ConciergeServices = ({ userId: propUserId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = authService;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const userId = propUserId || user?.id;
        const response = await conciergeService.getServicesByUserId(userId);
        
        if (response.success) {
          setServices(response.data);
        } else {
          setError(response.message || 'Failed to fetch services');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching services');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id || propUserId) {
      fetchServices();
    }
  }, [user?.id, propUserId]);

  const handleAddService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await conciergeService.deleteService(serviceId);
        setServices(services.filter(service => service.id !== serviceId));
      } catch (error) {
        setError(error.message || 'Failed to delete service');
      }
    }
  };

  const handleSubmitService = async (formData) => {
    try {
      if (selectedService) {
        // Update existing service
        const response = await conciergeService.updateService(selectedService.id, formData);
        setServices(services.map(service => 
          service.id === selectedService.id ? response.data : service
        ));
      } else {
        // Create new service
        const response = await conciergeService.createService(formData);
        setServices([...services, response.data]);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to save service');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#ff385c]/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#ff385c]">Concierge Services</h2>
          <p className="text-gray-500 mt-1">Manage and track your service offerings</p>
        </div>
        {onAddService && (
          <button 
            onClick={onAddService}
            className="flex items-center space-x-2 bg-[#ff385c] text-white px-6 py-3 rounded-xl hover:bg-[#ff385c]/90 transition-all transform hover:scale-[1.02]"
          >
            <FaPlus />
            <span>Add New Service</span>
          </button>
        )}
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No services found</p>
          {onAddService && (
            <button 
              onClick={onAddService}
              className="mt-4 px-6 py-3 bg-[#ff385c] text-white rounded-xl hover:bg-[#ff385c]/90"
            >
              Add Your First Service
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onEdit={onEditService}
              onDelete={onDeleteService}
            />
          ))}
        </div>
      )}

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitService}
        initialData={selectedService}
      />
    </div>
  );
};

export default ConciergeServices; 
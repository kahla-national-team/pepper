import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaConciergeBell, FaSpinner } from 'react-icons/fa';
import { conciergeService } from '../services/conciergeService';

const ServiceSelection = ({ onServicesChange, selectedServices = [], providerId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState(
    selectedServices.map(s => s.id)
  );

  useEffect(() => {
    fetchServices();
  }, [providerId]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      let response;
      if (providerId) {
        response = await conciergeService.getServicesByUserId(providerId);
      } else {
        response = await conciergeService.getAllServices();
      }
      if (response.success) {
        setServices(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (service) => {
    const isSelected = selectedServiceIds.includes(service.id);
    let newSelectedIds;
    
    if (isSelected) {
      newSelectedIds = selectedServiceIds.filter(id => id !== service.id);
    } else {
      newSelectedIds = [...selectedServiceIds, service.id];
    }
    
    setSelectedServiceIds(newSelectedIds);
    
    // Get the full service objects for the selected services
    const selectedServiceObjects = services.filter(s => newSelectedIds.includes(s.id));
    onServicesChange(selectedServiceObjects);
  };

  const getServicePrice = (service) => {
    if (!service || !service.price) return 0;
    if (typeof service.price === 'number') return service.price;
    // Extract numeric price from string like "$50/hour" or "2500.00"
    const priceMatch = service.price.match(/\d+(\.\d{1,2})?/);
    return priceMatch ? parseFloat(priceMatch[0]) : 0;
  };

  const getTotalServicesPrice = () => {
    return selectedServiceIds.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + getServicePrice(service);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FaSpinner className="animate-spin text-[#ff385c] text-xl" />
        <span className="ml-2 text-gray-600">Loading services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 text-sm">{error}</p>
        <button 
          onClick={fetchServices}
          className="mt-2 text-[#ff385c] text-sm hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          {providerId ? 'All Additional Services by this Owner' : 'Additional Services'}
        </h3>
        {selectedServiceIds.length > 0 && (
          <span className="text-sm text-gray-600">
            {selectedServiceIds.length} selected
          </span>
        )}
      </div>

      {services.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          No additional services available
        </p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {services.map((service) => {
            const isSelected = selectedServiceIds.includes(service.id);
            const price = getServicePrice(service);
            
            return (
              <div
                key={service.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-[#ff385c] bg-[#fff5f7]' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceToggle(service)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      isSelected ? 'bg-[#ff385c] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <FaConciergeBell className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {service.title}
                      </h4>
                      <p className="text-gray-600 text-xs">
                        {service.category} • {service.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      ${price.toFixed(2)}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-[#ff385c] bg-[#ff385c]' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <FaMinus className="text-white text-xs" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedServiceIds.length > 0 && (
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Services Total:</span>
            <span className="font-semibold text-gray-900">
              ${getTotalServicesPrice()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection; 
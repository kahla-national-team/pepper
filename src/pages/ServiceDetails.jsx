import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { conciergeService } from '../services/conciergeService';
import { FaStar, FaClock, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await conciergeService.getServiceDetails(id);
        if (response.success) {
          setService(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch service details');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        setError(error.message || 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-lg text-red-600 mb-4">{error || 'Service not found'}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Services
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <img
                className="h-48 w-full object-cover md:h-full"
                src={service.image}
                alt={service.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-service.jpg';
                }}
              />
            </div>
            <div className="p-8">
              <div className="flex items-center mb-4">
                <img
                  src={service.provider.image}
                  alt={service.provider.name}
                  className="w-10 h-10 rounded-full mr-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-avatar.png';
                  }}
                />
                <div>
                  <div className="text-sm text-gray-600">{service.provider.name}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{service.provider.rating.toFixed(1)}</span>
                    <span className="mx-1">•</span>
                    <span>{service.provider.reviewCount} reviews</span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                {service.title}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  <span>{service.duration} minutes</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{service.location.address}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                {service.details}
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Features</h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{service.price}</p>
                    <p className="text-sm text-gray-500">per service</p>
                  </div>
                  <button 
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      // TODO: Implement booking functionality
                      alert('Booking functionality coming soon!');
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>

              {service.provider.email && (
                <div className="mt-6 flex items-center text-gray-600">
                  <FaEnvelope className="mr-2" />
                  <span>Contact provider: {service.provider.email}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ServiceDetails;

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { user } = useAuth();

  console.log('ServiceDetails rendering with id:', id);

  useEffect(() => {
    console.log('useEffect running in ServiceDetails');
    // Simulate API call
    const fetchService = async () => {
      try {
        // In a real app, you would fetch the service details using the ID
        const mockService = {
          id: id,
          title: "Luxury Villa Cleaning",
          description: "Professional deep cleaning service for luxury villas with attention to detail.",
          price: "From $120",
          provider: {
            name: "Elite Cleaners",
            rating: 4.9,
            reviewCount: 156,
            image: "/placeholder-avatar.png"
          },
          location: { lat: 35.6971, lng: -0.6337 },
          address: "123 Beach Road, Oran",
          availability: ["Mon", "Wed", "Fri"],
          maxGuests: 10,
          images: [
            "/placeholder-service-1.jpg",
            "/placeholder-service-2.jpg",
            "/placeholder-service-3.jpg"
          ],
          details: "Our luxury villa cleaning service includes deep cleaning of all rooms, kitchen sanitation, bathroom disinfection, and window cleaning. We use eco-friendly products that are safe for your family and pets.",
          features: [
            "Deep cleaning of all surfaces",
            "Eco-friendly cleaning products",
            "Professional equipment",
            "Flexible scheduling",
            "Satisfaction guaranteed"
          ]
        };

        setService(mockService);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleBookClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (booking) => {
    setShowBookingForm(false);
    navigate(`/booking-success/${booking.id}`);
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading service details...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-lg text-gray-600 mb-4">Service not found</div>
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
                src={service.images[0]}
                alt={service.title} />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                {service.provider.name}
              </div>
              <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
                {service.title}
              </h1>
              <p className="mt-3 text-gray-600">
                {service.details}
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Features</h3>
                <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{service.price}</p>
                  <p className="text-sm text-gray-500">per service</p>
                </div>
                {!showBookingForm ? (
                  <button 
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleBookClick}
                  >
                    Book Now
                  </button>
                ) : (
                  <BookingForm
                    item={{
                      id,
                      type: 'service',
                      price: service.price
                    }}
                    onSuccess={handleBookingSuccess}
                    onCancel={handleBookingCancel}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ServiceDetails;

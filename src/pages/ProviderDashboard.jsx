import ServiceMap from '../components/ServiceMap';

const ProviderDashboard = () => {
  // Static services data
  const services = [
    {
      id: 1,
      title: "Premium Car Wash",
      description: "Complete exterior and interior cleaning with waxing",
      location: { lat: 35.6971, lng: -0.6337 },
      address: "123 Main St, Oran",
      status: "Active"
    },
    {
      id: 2,
      title: "Express Service",
      description: "Quick oil change and basic maintenance",
      location: { lat: 35.7047, lng: -0.6503 },
      address: "456 Service Rd, Bir El Djir",
      status: "Available"
    },
    {
      id: 3,
      title: "Luxury Detailing",
      description: "Premium detailing service for high-end vehicles",
      location: { lat: 35.6892, lng: -0.6418 },
      address: "789 Luxury Ave, Sidi El Houari",
      status: "Available"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceMap services={services} />
    </div>
  );
};

export default ProviderDashboard;

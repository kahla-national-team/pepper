import React, { useState, useEffect } from 'react';
import { FaUsers, FaCar, FaHome, FaMoneyBillWave, FaChartLine, FaStar, FaArrowUp, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SummaryCard from '../components/Dashboard/SummaryCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import WelcomeSection from '../components/Dashboard/WelcomeSection';
import QuickActions from '../components/Dashboard/QuickActions';
import ConciergeServices from '../components/Dashboard/ConciergeServices';
import ServiceAnnouncements from '../components/Dashboard/ServiceAnnouncements';
import ConciergeServiceForm from '../components/ConciergeServiceForm';
import { getDashboardStats } from '../services/dashboardService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    properties: { total: 0, active: 0 },
    revenue: { monthly: 0, ytd: 0 },
    occupancy: { rate: 0, newBookings: 0 },
    rating: { average: 0, newReviews: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Luxury Car Service',
      status: 'active',
      price: '$150/day',
      bookings: 12,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1555215695-300b0ca6ba4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      title: 'Private Chef Service',
      status: 'active',
      price: '$200/day',
      bookings: 8,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      title: 'Personal Shopping',
      status: 'inactive',
      price: '$100/day',
      bookings: 5,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState(null);

  const recentActivities = [
    {
      title: 'New Rental Request',
      time: '2 hours ago',
      amount: '$150',
      status: 'pending',
      icon: <FaCar className="text-white" />,
      iconBg: 'bg-[#ff385c]'
    },
    {
      title: 'Property Booking',
      time: '4 hours ago',
      amount: '$500',
      status: 'completed',
      icon: <FaHome className="text-white" />,
      iconBg: 'bg-[#ff385c]'
    },
    {
      title: 'User Registration',
      time: '5 hours ago',
      amount: '-',
      status: 'completed',
      icon: <FaUsers className="text-white" />,
      iconBg: 'bg-[#ff385c]'
    }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleAddService = async (formData) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await fetch('http://localhost:5000/api/concierge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Add the new service to the services state
        setServices(prevServices => [{
          id: data.data.id,
          title: data.data.name,
          status: 'active',
          price: `$${data.data.price}/day`,
          bookings: 0,
          rating: 0,
          image: 'https://images.unsplash.com/photo-1555215695-300b0ca6ba4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' // Default image
        }, ...prevServices]);
        
        setIsModalOpen(false);
        setFormError(null);
      } else {
        setFormError(data.message || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      setFormError('Failed to create service. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading dashboard statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <WelcomeSection />

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            icon={FaHome}
            title="Total Properties"
            value={stats.properties.total.toString()}
            subtitle={`${stats.properties.active} Active Listings`}
            trend={<FaArrowUp className="mr-1" />}
            trendValue={`${Math.round((stats.properties.active / stats.properties.total) * 100)}%`}
            iconBg="bg-[#ff385c]/100"
          />

          <SummaryCard
            icon={FaMoneyBillWave}
            title="Monthly Revenue"
            value={`$${stats.revenue.monthly.toLocaleString()}`}
            subtitle={`$${stats.revenue.ytd.toLocaleString()} YTD`}
            trend={<FaArrowUp className="mr-1" />}
            trendValue={`${Math.round((stats.revenue.monthly / stats.revenue.ytd) * 100)}%`}
            iconBg="bg-green-500"
          />

          <SummaryCard
            icon={FaChartLine}
            title="Occupancy Rate"
            value={`${stats.occupancy.rate}%`}
            subtitle={`${stats.occupancy.newBookings} New Bookings Today`}
            trend={<FaArrowUp className="mr-1" />}
            trendValue={`${Math.round((stats.occupancy.newBookings / 30) * 100)}%`}
            iconBg="bg-blue-500"
          />

          <SummaryCard
            icon={FaStar}
            title="Average Rating"
            value={stats.rating.average.toString()}
            subtitle={`${stats.rating.newReviews} New Reviews This Month`}
            trend={<FaArrowUp className="mr-1" />}
            trendValue={`${(stats.rating.average - 4.5).toFixed(1)}`}
            iconBg="bg-yellow-500"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity activities={recentActivities} />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Concierge Services Section with Add Button */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Concierge Services</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition duration-200"
            >
              <FaPlus className="text-sm" />
              Add Service
            </button>
          </div>
          <ConciergeServices services={services} />
        </div>

        {/* Service Announcements */}
        <ServiceAnnouncements />

        {/* Modal for Add Service Form */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Add New Service</h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormError(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                {formError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {formError}
                  </div>
                )}

                <ConciergeServiceForm 
                  onSubmit={handleAddService}
                  onCancel={() => {
                    setIsModalOpen(false);
                    setFormError(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

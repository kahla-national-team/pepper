import React, { useState, useEffect } from 'react';
import { FaUsers, FaCar, FaHome, FaMoneyBillWave, FaPlus, FaEdit, FaTrash, FaBell, FaChartLine, FaCalendarAlt, FaStar, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/Dashboard/SummaryCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import Navbar from '../components/Navbar';
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

  const handleCalendarClick = () => {
    navigate('/calendar');
  };

  const handleReportsClick = () => {
    navigate('/reports');
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
        {/* Welcome Section */}
        <div className="rounded-2xl p-8 mb-8 text-[#ff385c]">
          <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
          <p className="text-black/80">Manage your services and track your performance</p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            icon={FaHome}
            title="Total Properties"
            value={stats.properties.total.toString()}
            subtitle={`${stats.properties.active} Active Listings`}
            trend={<FaArrowUp className="mr-1" />}
            trendValue={`${Math.round((stats.properties.active / stats.properties.total) * 100)}%`}
            iconBg="bg-[#ff385c]/10"
          />

          <SummaryCard
            icon={FaMoneyBillWave}
            title="Monthly Revenue"
            value={`$${stats.revenue.monthly.toLocaleString()}`}
            subtitle={`$${stats.revenue.ytd.toLocaleString()} YTD`}
            trend={<FaArrowUp className="mr-1" />}
            trendValue={`${Math.round((stats.revenue.monthly / stats.revenue.ytd) * 100)}%`}
            iconBg="bg-green-50"
          />

          <SummaryCard
            icon={FaChartLine}
            title="Occupancy Rate"
            value={`${stats.occupancy.rate}%`}
            subtitle={`${stats.occupancy.newBookings} New Bookings Today`}
            trend={<FaArrowUp className="mr-1" />}
            trendValue={`${Math.round((stats.occupancy.newBookings / 30) * 100)}%`}
            iconBg="bg-blue-50"
          />

          <SummaryCard
            icon={FaStar}
            title="Average Rating"
            value={stats.rating.average.toString()}
            subtitle={`${stats.rating.newReviews} New Reviews This Month`}
            trend={<FaArrowUp className="mr-1" />}
            trendValue={`${(stats.rating.average - 4.5).toFixed(1)}`}
            iconBg="bg-yellow-50"
          />
        </div>
    
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity activities={recentActivities} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-[#ff385c]">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/add-property')}
                className="w-full bg-[#ff385c] text-white py-3 px-4 rounded-xl hover:bg-[#ff385c]/90 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <FaPlus />
                <span>Add Property</span>
              </button>
              <button className="w-full bg-[#ff385c] text-white py-3 px-4 rounded-xl hover:bg-[#ff385c]/90 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2">
                <FaCalendarAlt />
                <span>Create Rental</span>
              </button>
              <button 
                onClick={handleCalendarClick}
                className="w-full bg-[#ff385c] text-white py-3 px-4 rounded-xl hover:bg-[#ff385c]/90 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <FaCalendarAlt />
                <span>View Calendar</span>
              </button>
              <button 
                onClick={handleReportsClick}
                className="w-full bg-[#ff385c] text-white py-3 px-4 rounded-xl hover:bg-[#ff385c]/90 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
              >
                <FaChartLine />
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* Concierge Services Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#ff385c]">My Concierge Services</h2>
              <p className="text-gray-500 mt-1">Manage and track your service offerings</p>
            </div>
            <button className="flex items-center space-x-2 bg-[#ff385c] text-white px-6 py-3 rounded-xl hover:bg-[#ff385c]/90 transition-all transform hover:scale-[1.02]">
              <FaPlus />
              <span>Add New Service</span>
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{service.title}</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-[#ff385c] font-bold text-lg">{service.price}</span>
                    <div className="flex items-center text-yellow-400">
                      <FaStar />
                      <span className="ml-1 text-gray-600">{service.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 mb-6">
                    <FaCalendarAlt className="mr-2" />
                    <span>{service.bookings} bookings</span>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 bg-[#ff385c] text-white py-3 rounded-xl hover:bg-[#ff385c]/90 transition-all">
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all">
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Service Announcements */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#ff385c]">Service Announcements</h3>
                <p className="text-gray-500 mt-1">Keep your customers informed</p>
              </div>
              <button className="flex items-center space-x-2 text-[#ff385c] hover:text-[#ff385c]/80 transition-colors">
                <FaBell />
                <span>Create Announcement</span>
              </button>
            </div>
            <div className="bg-gradient-to-r from-[#fff1f2] to-white rounded-2xl p-6 border border-[#ff385c]/10">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-[#ff385c] flex items-center justify-center">
                  <FaBell className="text-white text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Special Weekend Offer</h4>
                  <p className="text-gray-600 mt-1">Get 20% off on all luxury car services this weekend!</p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <FaCalendarAlt className="mr-2" />
                    <span>Posted 2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white shadow rounded-xl p-4 text-center">
    <div className="text-xl font-bold">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

export default Dashboard;

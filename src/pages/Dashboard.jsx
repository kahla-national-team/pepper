import React, { useState, useEffect } from 'react';
import { FaUsers, FaCar, FaHome, FaMoneyBillWave, FaChartLine, FaStar, FaArrowUp, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/Dashboard/SummaryCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import WelcomeSection from '../components/Dashboard/WelcomeSection';
import QuickActions from '../components/Dashboard/QuickActions';
import DashboardConciergeServices from "../pages/DashboardConciergeServices";
import ServiceAnnouncements from '../components/Dashboard/ServiceAnnouncements';
import ConciergeServiceForm from '../components/ConciergeServiceForm';
import { getDashboardStats } from '../services/dashboardService';
import PendingApprovalsWidget from '../components/Dashboard/PendingApprovalsWidget';
import Sidebar from '../components/Dashboard/Sidebar';
import { bookingService } from '../services/bookingService';

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
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchStatsAndActivities = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setError(null);

        // Fetch pending bookings for recent activity
        const ownerBookings = await bookingService.getBookingsForOwner();
        const pendingBookings = (ownerBookings.data || ownerBookings).filter(b => b.status === 'pending');
        const activities = pendingBookings.map(b => ({
          type: 'booking',
          message: `Pending booking for ${b.user?.name || b.user || 'a user'}: ${b.service || b.property || b.title || 'Rental'} on ${b.date || b.start_date || ''}`,
          timestamp: b.date || b.start_date || '',
          status: b.status
        }));
        setRecentActivities(activities);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsAndActivities();
  }, []);

  const handleAddService = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/concierge', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header - browser will set it automatically with boundary for FormData
        },
        body: formData // formData is already a FormData object
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
          image: data.data.photo_url || 'https://images.unsplash.com/photo-1555215695-300b0ca6ba4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' // Use uploaded image or default
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

  const handleEditService = (service) => {
    // TODO: Implement edit functionality
    console.log('Edit service:', service);
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/concierge/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove the service from the state
        setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
      } else {
        console.error('Failed to delete service:', data.message);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading dashboard statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-8">
        <WelcomeSection />
        {/* Stats Cards */}
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
        {/* Widgets and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <PendingApprovalsWidget />
            <RecentActivity activities={recentActivities} />
          </div>
          <QuickActions />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

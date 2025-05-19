import React, { useState } from 'react';
import { FaHome, FaChartLine, FaCalendarAlt, FaStar, FaUsers, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaCheck, FaTimes } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'

  // Sample data - replace with actual data from your backend
  const propertyStats = {
    totalListed: 25,
    activeListings: 20,
    occupancyRate: 85,
    upcomingBookings: [
      { name: 'John Smith', checkIn: '2024-03-20', checkOut: '2024-03-25', property: 'Luxury Villa' },
      { name: 'Emma Davis', checkIn: '2024-03-22', checkOut: '2024-03-28', property: 'Beach House' }
    ],
    currentGuests: [
      { name: 'Michael Brown', checkIn: '2024-03-15', checkOut: '2024-03-21', property: 'Mountain Cabin' },
      { name: 'Sarah Wilson', checkIn: '2024-03-18', checkOut: '2024-03-24', property: 'City Apartment' }
    ]
  };

  const financialStats = {
    monthlyEarnings: 45000,
    yearlyEarnings: 320000,
    pendingPayouts: 12500,
    unpaidInvoices: 3500,
    adr: 250,
    revpar: 212.50
  };

  const bookingStats = {
    newBookings: {
      today: 3,
      week: 12,
      month: 45
    },
    cancelledBookings: 5,
    checkIns: {
      today: 2,
      week: 8
    },
    checkOuts: {
      today: 1,
      week: 7
    },
    sources: {
      direct: 45,
      app: 35,
      thirdParty: 20
    }
  };

  const reviewStats = {
    averageRating: 4.8,
    latestReviews: [
      { property: 'Luxury Villa', rating: 5, comment: 'Amazing experience!', date: '2024-03-18' },
      { property: 'Beach House', rating: 4, comment: 'Great location and service', date: '2024-03-17' }
    ],
    reviewCount: {
      month: 28,
      lifetime: 450
    }
  };

  const StatCard = ({ title, value, icon, trend, color }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 shadow-lg hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className={`flex items-center text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ff385c] via-[#ff385c]/90 to-[#ff385c]/80 bg-clip-text text-transparent">
                Property Reports
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Comprehensive overview of your property performance
              </p>
            </div>
            <div className="flex space-x-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-xl border border-gray-100/50 focus:outline-none focus:ring-2 focus:ring-[#ff385c]/50"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* Property Stats Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaHome className="text-[#ff385c] mr-3" />
              Property Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Properties Listed"
                value={propertyStats.totalListed}
                icon={<FaHome className="text-[#ff385c] text-xl" />}
                color="bg-[#ff385c]/10"
              />
              <StatCard 
                title="Active Listings"
                value={propertyStats.activeListings}
                icon={<FaCheck className="text-green-500 text-xl" />}
                color="bg-green-50"
                trend={5}
              />
              <StatCard 
                title="Occupancy Rate"
                value={`${propertyStats.occupancyRate}%`}
                icon={<FaChartLine className="text-blue-500 text-xl" />}
                color="bg-blue-50"
                trend={2}
              />
              <StatCard 
                title="Upcoming Bookings"
                value={propertyStats.upcomingBookings.length}
                icon={<FaCalendarAlt className="text-purple-500 text-xl" />}
                color="bg-purple-50"
              />
            </div>
          </section>

          {/* Financial Stats Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaMoneyBillWave className="text-[#ff385c] mr-3" />
              Financial Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Monthly Earnings"
                value={`$${financialStats.monthlyEarnings.toLocaleString()}`}
                icon={<FaMoneyBillWave className="text-green-500 text-xl" />}
                color="bg-green-50"
                trend={8}
              />
              <StatCard 
                title="Pending Payouts"
                value={`$${financialStats.pendingPayouts.toLocaleString()}`}
                icon={<FaMoneyBillWave className="text-yellow-500 text-xl" />}
                color="bg-yellow-50"
              />
              <StatCard 
                title="Average Daily Rate"
                value={`$${financialStats.adr}`}
                icon={<FaChartLine className="text-blue-500 text-xl" />}
                color="bg-blue-50"
                trend={3}
              />
              <StatCard 
                title="RevPAR"
                value={`$${financialStats.revpar}`}
                icon={<FaChartLine className="text-purple-500 text-xl" />}
                color="bg-purple-50"
                trend={4}
              />
            </div>
          </section>

          {/* Booking Stats Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaCalendarAlt className="text-[#ff385c] mr-3" />
              Booking Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="New Bookings (Today)"
                value={bookingStats.newBookings.today}
                icon={<FaCalendarAlt className="text-green-500 text-xl" />}
                color="bg-green-50"
                trend={12}
              />
              <StatCard 
                title="Cancelled Bookings"
                value={bookingStats.cancelledBookings}
                icon={<FaTimes className="text-red-500 text-xl" />}
                color="bg-red-50"
                trend={-5}
              />
              <StatCard 
                title="Check-ins Today"
                value={bookingStats.checkIns.today}
                icon={<FaUsers className="text-blue-500 text-xl" />}
                color="bg-blue-50"
              />
              <StatCard 
                title="Check-outs Today"
                value={bookingStats.checkOuts.today}
                icon={<FaUsers className="text-purple-500 text-xl" />}
                color="bg-purple-50"
              />
            </div>
          </section>

          {/* Reviews Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaStar className="text-[#ff385c] mr-3" />
              Reviews & Ratings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Rating</h3>
                <div className="flex items-center">
                  <div className="text-4xl font-bold text-[#ff385c] mr-4">
                    {reviewStats.averageRating}
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(reviewStats.averageRating) ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  Based on {reviewStats.reviewCount.lifetime} reviews
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Reviews</h3>
                <div className="space-y-4">
                  {reviewStats.latestReviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{review.property}</h4>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      <p className="text-gray-500 text-xs mt-2">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Current Guests Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaUsers className="text-[#ff385c] mr-3" />
              Current Guests
            </h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Guest Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Property</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Check-in</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Check-out</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {propertyStats.currentGuests.map((guest, index) => (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-sm text-gray-800">{guest.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{guest.property}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{guest.checkIn}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{guest.checkOut}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Reports;

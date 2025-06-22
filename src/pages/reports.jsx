import React, { useState, useEffect } from 'react';
import { FaHome, FaChartLine, FaCalendarAlt, FaStar, FaUsers, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaCheck, FaTimes } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { getReports } from '../services/reportsService';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReports(timeRange);
        setReport(data);
      } catch (err) {
        setError('Failed to fetch report');
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [timeRange]);

  // Helper to safely get a value or NaN
  const safe = (val) => (val === undefined || val === null ? 'NaN' : val);

  // Fallbacks if no data
  const propertyStats = report?.propertyStats || {};
  const financialStats = report?.financialStats || {};
  const bookingStats = report?.bookingStats || {};
  const reviewStats = report?.reviewStats || { latestReviews: [] };
  const currentGuests = report?.currentGuests || [];
  const upcomingBookings = report?.upcomingBookings || [];

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
      <p className="text-2xl font-bold text-gray-800">{safe(value)}</p>
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

          {loading ? (
            <div className="text-center py-12 text-lg text-gray-500">Loading report...</div>
          ) : error ? (
            <div className="text-center py-12 text-lg text-red-500">{error}</div>
          ) : (
            <>
              {/* Property Stats Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaHome className="text-[#ff385c] mr-3" />
                  Property Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    title="Total Properties Listed"
                    value={propertyStats.total_listed}
                    icon={<FaHome className="text-[#ff385c] text-xl" />}
                    color="bg-[#ff385c]/10"
                  />
                  <StatCard 
                    title="Active Listings"
                    value={propertyStats.active_listings}
                    icon={<FaCheck className="text-green-500 text-xl" />}
                    color="bg-green-50"
                  />
                  <StatCard 
                    title="Available Listings"
                    value={propertyStats.available_listings}
                    icon={<FaCheck className="text-blue-500 text-xl" />}
                    color="bg-blue-50"
                  />
                  <StatCard 
                    title="Average Price"
                    value={propertyStats.average_price}
                    icon={<FaMoneyBillWave className="text-purple-500 text-xl" />}
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
                    title="Total Earnings"
                    value={financialStats.total_earnings}
                    icon={<FaMoneyBillWave className="text-green-500 text-xl" />}
                    color="bg-green-50"
                  />
                  <StatCard 
                    title="Paid Earnings"
                    value={financialStats.paid_earnings}
                    icon={<FaMoneyBillWave className="text-yellow-500 text-xl" />}
                    color="bg-yellow-50"
                  />
                  <StatCard 
                    title="Pending Payouts"
                    value={financialStats.pending_payouts}
                    icon={<FaMoneyBillWave className="text-blue-500 text-xl" />}
                    color="bg-blue-50"
                  />
                  <StatCard 
                    title="Average Booking Value"
                    value={financialStats.average_booking_value}
                    icon={<FaChartLine className="text-purple-500 text-xl" />}
                    color="bg-purple-50"
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
                    value={bookingStats.new_bookings_today}
                    icon={<FaCalendarAlt className="text-green-500 text-xl" />}
                    color="bg-green-50"
                  />
                  <StatCard 
                    title="New Bookings (Week)"
                    value={bookingStats.new_bookings_week}
                    icon={<FaCalendarAlt className="text-blue-500 text-xl" />}
                    color="bg-blue-50"
                  />
                  <StatCard 
                    title="Cancelled Bookings"
                    value={bookingStats.cancelled_bookings}
                    icon={<FaTimes className="text-red-500 text-xl" />}
                    color="bg-red-50"
                  />
                  <StatCard 
                    title="Check-ins Today"
                    value={bookingStats.checkins_today}
                    icon={<FaCheck className="text-green-500 text-xl" />}
                    color="bg-green-50"
                  />
                  <StatCard 
                    title="Check-outs Today"
                    value={bookingStats.checkouts_today}
                    icon={<FaCheck className="text-blue-500 text-xl" />}
                    color="bg-blue-50"
                  />
                </div>
              </section>

              {/* Review Stats Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaStar className="text-[#ff385c] mr-3" />
                  Review Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    title="Average Rating"
                    value={reviewStats.average_rating}
                    icon={<FaStar className="text-yellow-500 text-xl" />}
                    color="bg-yellow-50"
                  />
                  <StatCard 
                    title="Total Reviews"
                    value={reviewStats.total_reviews}
                    icon={<FaUsers className="text-blue-500 text-xl" />}
                    color="bg-blue-50"
                  />
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Reviews</h3>
                  <ul className="divide-y divide-gray-200">
                    {reviewStats.latestReviews && reviewStats.latestReviews.length > 0 ? (
                      reviewStats.latestReviews.map((review, idx) => (
                        <li key={idx} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <span className="font-bold text-gray-900">{safe(review.reviewer_name) || 'Anonymous'}</span> on <span className="font-medium text-gray-700">{safe(review.property_name)}</span>
                            <span className="ml-2 text-yellow-500">{safe(review.rating)}★</span>
                          </div>
                          <div className="text-gray-600 mt-2 md:mt-0">{safe(review.comment)}</div>
                          <div className="text-gray-400 text-xs mt-1 md:mt-0">{safe(review.created_at)?.slice(0, 10)}</div>
                        </li>
                      ))
                    ) : (
                      <li className="py-4 text-gray-500">No reviews found.</li>
                    )}
                  </ul>
                </div>
              </section>

              {/* Current Guests Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaUsers className="text-[#ff385c] mr-3" />
                  Current Guests
                </h2>
                <ul className="divide-y divide-gray-200">
                  {currentGuests.length > 0 ? (
                    currentGuests.map((guest, idx) => (
                      <li key={idx} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <span className="font-bold text-gray-900">{safe(guest.guest_name) || 'Anonymous'}</span> at <span className="font-medium text-gray-700">{safe(guest.property_name)}</span>
                        </div>
                        <div className="text-gray-600 mt-2 md:mt-0">Check-in: {safe(guest.start_date)} | Check-out: {safe(guest.end_date)}</div>
                        <div className="text-gray-400 text-xs mt-1 md:mt-0">Guests: {safe(guest.guests)}</div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-gray-500">No current guests.</li>
                  )}
                </ul>
              </section>

              {/* Upcoming Bookings Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaCalendarAlt className="text-[#ff385c] mr-3" />
                  Upcoming Bookings
                </h2>
                <ul className="divide-y divide-gray-200">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking, idx) => (
                      <li key={idx} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <span className="font-bold text-gray-900">{safe(booking.guest_name) || 'Anonymous'}</span> at <span className="font-medium text-gray-700">{safe(booking.property_name)}</span>
                        </div>
                        <div className="text-gray-600 mt-2 md:mt-0">Check-in: {safe(booking.start_date)} | Check-out: {safe(booking.end_date)}</div>
                        <div className="text-gray-400 text-xs mt-1 md:mt-0">Guests: {safe(booking.guests)}</div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 text-gray-500">No upcoming bookings.</li>
                  )}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;

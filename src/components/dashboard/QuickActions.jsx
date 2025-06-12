import React from 'react';
import { FaPlus, FaCalendarAlt, FaChartLine, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleCalendarClick = () => {
    navigate('/calendar');
  };

  const handleReportsClick = () => {
    navigate('/reports');
  };

  const handleBookingRequestsClick = () => {
    navigate('/booking-requests');
  };

  return (
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
        <button 
          onClick={handleBookingRequestsClick}
          className="w-full bg-[#ff385c] text-white py-3 px-4 rounded-xl hover:bg-[#ff385c]/90 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          <FaBell />
          <span>See Booking Requests</span>
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
  );
};

export default QuickActions; 
import React from 'react';
import { FaBell, FaCalendarAlt } from 'react-icons/fa';

const ServiceAnnouncements = () => {
  return (
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
  );
};

export default ServiceAnnouncements; 
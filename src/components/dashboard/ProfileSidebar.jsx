import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaHistory, FaHeart, FaHome, FaBell } from 'react-icons/fa';

const ProfileSidebar = ({ isOpen, onClose, user }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          {/* Welcome Message */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#ff385c]">Welcome!</h2>
            <p className="text-gray-500">We're glad to see you here</p>
          </div>

          {/* User Profile Section */}
          <div className="bg-[#fff1f2] rounded-xl p-4 mb-6 border border-[#ff385c]/10">
            <div className="flex items-center space-x-4">
              {user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#ff385c] flex items-center justify-center">
                  <FaUser className="text-white text-xl" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg text-[#ff385c]">{user?.name || 'User Name'}</h3>
                <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link to="/profile" className="flex items-center space-x-3 p-3 hover:bg-[#fff1f2] rounded-lg transition-colors group">
              <FaUser className="text-[#ff385c] group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 group-hover:text-[#ff385c]">My Profile</span>
            </Link>
            <Link to="/bookings" className="flex items-center space-x-3 p-3 hover:bg-[#fff1f2] rounded-lg transition-colors group">
              <FaHistory className="text-[#ff385c] group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 group-hover:text-[#ff385c]">My Bookings and Factures</span>
            </Link>
            <Link to="/favorites" className="flex items-center space-x-3 p-3 hover:bg-[#fff1f2] rounded-lg transition-colors group">
              <FaHeart className="text-[#ff385c] group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 group-hover:text-[#ff385c]">Favorites</span>
            </Link>
            <Link to="/notifications" className="flex items-center space-x-3 p-3 hover:bg-[#fff1f2] rounded-lg transition-colors group">
              <FaBell className="text-[#ff385c] group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 group-hover:text-[#ff385c]">Notifications</span>
            </Link>
            <Link to="/settings" className="flex items-center space-x-3 p-3 hover:bg-[#fff1f2] rounded-lg transition-colors group">
              <FaCog className="text-[#ff385c] group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 group-hover:text-[#ff385c]">Settings</span>
            </Link>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="flex items-center space-x-3 p-3 hover:bg-[#fff1f2] rounded-lg w-full text-left transition-colors group"
            >
              <FaSignOutAlt className="text-[#ff385c] group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 group-hover:text-[#ff385c]">Logout</span>
            </button>
          </nav>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-[#fff1f2] rounded-xl border border-[#ff385c]/10">
            <h4 className="font-semibold text-[#ff385c] mb-2">Need Help?</h4>
            <p className="text-sm text-gray-500 mb-3">Our support team is here to help you</p>
            <Link to="/support" className="text-[#ff385c] hover:text-[#ff385c]/80 text-sm font-medium flex items-center group">
              Contact Support 
              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar; 
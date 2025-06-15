import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo-nav.svg';
import Button from './Button';
import ProfileSidebar from './Dashboard/ProfileSidebar';
import { FaUser, FaBell } from 'react-icons/fa';
import { useSearchMode } from '../context/SearchModeContext';
import { useNotifications } from '../contexts/NotificationContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { activeMode, changeMode } = useSearchMode();
  const { unreadCount } = useNotifications();

  // Check if we're on dashboard pages
  const isDashboardPage = location.pathname.includes('/dashboard') || 
                         location.pathname.includes('/add-property') ||
                         location.pathname.includes('/profile') ||
                         location.pathname.includes('/calendar') ||
                         location.pathname.includes('/reports');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Store user data including the Cloudinary profile image URL
        setUser({ 
          name: data.full_name,
          email: data.email,
          profile_image: data.profile_image // This is now a direct Cloudinary URL
        });
      } else {
        console.error('Failed to fetch user data');
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoggedIn(false);
      localStorage.removeItem('token');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsProfileOpen(false);
  };

  const handleModeChange = (mode) => {
    changeMode(mode);
    // Navigate to home page when switching modes
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="bg-white text-black p-4 shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img src={logo} alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Navigation Links with Toggle Buttons - Always visible but inactive on dashboard */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => {
                changeMode('stays');
                if (isDashboardPage) {
                  navigate('/');
                }
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 transition-all duration-200 font-medium text-sm ${
                isDashboardPage 
                  ? 'border-transparent text-gray-400 hover:text-gray-600' 
                  : activeMode === 'stays' 
                    ? 'border-[#ff385c] text-[#ff385c]' 
                    : 'border-transparent text-gray-700 hover:text-[#ff385c]'
              }`}
            >
              <span className="text-lg">🏠</span>
              <span>Stays</span>
            </button>
            <button
              onClick={() => {
                changeMode('services');
                if (isDashboardPage) {
                  navigate('/');
                }
              }}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 transition-all duration-200 font-medium text-sm ${
                isDashboardPage 
                  ? 'border-transparent text-gray-400 hover:text-gray-600' 
                  : activeMode === 'services' 
                    ? 'border-[#ff385c] text-[#ff385c]' 
                    : 'border-transparent text-gray-700 hover:text-[#ff385c]'
              }`}
            >
              <span className="text-lg">👑</span>
              <span>Services</span>
            </button>
            <Link to="/dashboard" className="text-gray-700 hover:text-[#ff385c] transition-colors">Host Service</Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/notifications" className="relative">
                  <FaBell className="text-gray-700 hover:text-[#ff385c] text-xl transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#ff385c] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#ff385c] focus:outline-none"
                >
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#ff385c] flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                  )}
                  <span className="hidden md:block">{user?.name}</span>
                </button>
              </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="text">Sign in</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
    </>
  );
};

export default Navbar;

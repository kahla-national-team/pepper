import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-nav.svg';
import Button from './Button';
import ProfileSidebar from './Dashboard/ProfileSidebar';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Fetch user data from your API
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const [nameResponse, emailResponse] = await Promise.all([
        fetch('http://localhost:5000/api/users/fullname', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('http://localhost:5000/api/users/email', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (nameResponse.ok && emailResponse.ok) {
        const nameData = await nameResponse.json();
        const emailData = await emailResponse.json();
        setUser({ 
          name: nameData.full_name,
          email: emailData.email 
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

  return (
    <>
      <nav className="bg-white text-black p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img src={logo} alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/service1" className="text-gray-700 hover:text-[#ff385c] transition-colors">Stays</Link>
            <Link to="/service2" className="text-gray-700 hover:text-[#ff385c] transition-colors">Services</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-[#ff385c] transition-colors">Host Service</Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#ff385c] flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <span className="font-medium text-gray-700">{user?.name || 'User'}</span>
              </button>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
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
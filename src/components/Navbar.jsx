"use client";
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo-nav.svg';
import Button from './Button';
import ServiceSearchBar from './serviceSearchBar';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
      setIsScrolled(false);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white text-black shadow-md">
      {/* Top section with logo and navigation */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-bold md:flex-1 md:text-center lg:flex-none lg:text-left">
            <Link to="/" className="hover:text-gray-300 inline-block">
              <img src={logo} alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:flex-1 md:justify-center lg:justify-start space-x-4">
            <Link to="/stays" className="hover:text-gray-500">Stays</Link>
            <Link to="/services" className="hover:text-gray-500">Services</Link>
          </div>

          {/* Desktop right section */}
          <div className="hidden md:flex md:flex-1 md:justify-center lg:justify-end space-x-8">
            <Link to="/dashboard-service" className="hover:text-gray-500">Host service</Link>
            <Link to="/login" className="hover:text-gray-500">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-60' : 'max-h-0'}`}>
        <div className="px-4 py-2 space-y-3 border-t border-gray-200">
          <Link to="/stays" className="block py-2 hover:text-gray-500">Stays</Link>
          <Link to="/services" className="block py-2 hover:text-gray-500">Services</Link>
          <Link to="/dashboard-service" className="block py-2 hover:text-gray-500">Host service</Link>
          <Link to="/login" className="block py-2 hover:text-gray-500">
            <Button className="w-full">Login</Button>
          </Link>
        </div>
      </div>

      {/* Search bar on Home page */}
      {isHomePage && (
        <div className={`border-t border-gray-200 transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 bg-white shadow-md' : 'relative'}`}>
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-3xl mx-auto">
              <ServiceSearchBar 
                onSearch={(filters) => console.log('Search filters:', filters)}
                filters={{}}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

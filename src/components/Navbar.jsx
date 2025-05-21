"use client";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-nav.svg";
import Button from "./Button";
import ServiceSearchBar from "./serviceSearchBar";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white text-black shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo à gauche */}
          <div className="flex items-center">
            <Link to="/" className="hover:text-gray-300 inline-block">
              <img src={logo} alt="Logo" className="h-8" />
            </Link>
          </div>

          {/* Navigation au centre pour stays & services (md+) */}
          <div className="hidden md:flex md:flex-1 md:justify-center space-x-6 lg:space-x-10">
            <Link to="/stays" className="hover:text-gray-500">
              Stays
            </Link>
            <Link to="/services" className="hover:text-gray-500">
              Services
            </Link>
          </div>

          {/* Host service + Login à droite (md+), alignés côte à côte */}
          <div className="hidden md:flex md:flex-1 md:justify-end space-x-6 lg:space-x-8">
            <Link to="/dashboard-service" className="hover:text-gray-500 flex items-center">
              Host service
            </Link>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>

          {/* Mobile right side: user icon + hamburger */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/login" aria-label="User account">
              <FontAwesomeIcon icon={faCircleUser} className="text-2xl" />
            </Link>
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="px-4 py-2 space-y-3 border-t border-gray-200">
          <Link to="/stays" className="block py-2 hover:text-gray-500">
            Stays
          </Link>
          <Link to="/services" className="block py-2 hover:text-gray-500">
            Services
          </Link>
          <Link to="/dashboard-service" className="block py-2 hover:text-gray-500">
            Host service
          </Link>
        </div>
      </div>

      {/* Search Bar fixed only on home page */}
      {isHomePage && (
        <div
          className={`border-t border-gray-200 transition-all duration-300 ${
            isScrolled
              ? "fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
              : "relative"
          }`}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-3xl mx-auto">
              <ServiceSearchBar
                onSearch={(filters) => console.log("Search filters:", filters)}
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

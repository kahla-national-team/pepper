import React from 'react';
import Logo from '../assets/Asset9.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 mt-16">
      <div className="max-w-screen-xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo and Description */}
        <div className="footer-section">
          <img src={Logo} alt="ButlerCD Logo" className="w-32 h-auto mb-6" />
          <p className="text-gray-400 mb-6">Your trusted partner in luxury concierge services. We bring exceptional service right to your doorstep.</p>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="text-white text-2xl hover:text-pink-600"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="Twitter" className="text-white text-2xl hover:text-pink-600"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram" className="text-white text-2xl hover:text-pink-600"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn" className="text-white text-2xl hover:text-pink-600"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="text-pink-600 text-lg mb-6">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/about" className="text-gray-400 hover:text-pink-600">About Us</a></li>
            <li><a href="/services" className="text-gray-400 hover:text-pink-600">Our Services</a></li>
            <li><a href="/pricing" className="text-gray-400 hover:text-pink-600">Pricing</a></li>
            <li><a href="/contact" className="text-gray-400 hover:text-pink-600">Contact</a></li>
          </ul>
        </div>

        {/* Our Services */}
        <div className="footer-section">
          <h4 className="text-pink-600 text-lg mb-6">Our Services</h4>
          <ul className="space-y-2">
            <li><a href="/services/housekeeping" className="text-gray-400 hover:text-pink-600">Housekeeping</a></li>
            <li><a href="/services/personal-chef" className="text-gray-400 hover:text-pink-600">Personal Chef</a></li>
            <li><a href="/services/transportation" className="text-gray-400 hover:text-pink-600">Transportation</a></li>
            <li><a href="/services/business" className="text-gray-400 hover:text-pink-600">Business Services</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4 className="text-pink-600 text-lg mb-6">Contact Us</h4>
          <ul className="text-gray-400 space-y-4">
            <li className="flex items-start gap-4">
              <i className="fas fa-map-marker-alt text-pink-600 mt-1"></i>
              <span>123 Luxury Lane, Suite 100<br />New York, NY 10001</span>
            </li>
            <li className="flex items-center gap-4">
              <i className="fas fa-phone text-pink-600"></i>
              <span>+213 (55) 123-4567</span>
            </li>
            <li className="flex items-center gap-4">
              <i className="fas fa-envelope text-pink-600"></i>
              <span>info@butler.com</span>
            </li>
            <li className="flex items-center gap-4">
              <i className="fas fa-clock text-pink-600"></i>
              <span>24/7 Service Available</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-8">
        <div className="max-w-screen-xl mx-auto px-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} ButlerCD. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="/privacy" className="text-gray-400 hover:text-pink-600">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:text-pink-600">Terms of Service</a>
            <a href="/cookies" className="text-gray-400 hover:text-pink-600">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

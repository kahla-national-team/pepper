"use client"

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DashboardService from './pages/DashboardService'; // Add this import
// Supprimez cette ligne
// import ServicesPage from './pages/ServicesPage';
import ServiceDetails from './pages/ServiceDetails';
import Stays from './pages/Stays';
import Services from './pages/Services';
import DetailsPage from './pages/DetailsPage';
import './App.css';
import { MapVisibilityProvider } from './context/MapVisibilityContext';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname === '/';
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <MapVisibilityProvider>
      <div className="w-full min-h-screen m-0 bg-white flex flex-col">
        {showNavbar && <Navbar />}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-service" element={<DashboardService />} />
            
            {/* Services Routes */}
            {/* Supprimez ou commentez cette ligne */}
            {/* <Route path="/services" element={<ServicesPage />} /> */}
            <Route path="/stays" element={<Stays />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/details/:type/:id" element={<DetailsPage />} />
          </Routes>
        </div>
        {!hideFooter && <Footer />}
      </div>
    </MapVisibilityProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

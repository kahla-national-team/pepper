"use client"

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DashboardService from './pages/DashboardService';
import ServiceDetails from './pages/ServiceDetails';
import Stays from './pages/Stays';
import Services from './pages/Services';
import DetailsPage from './pages/DetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Calendar from './pages/Calendar';
import Reports from './pages/reports';
import PropertyForm from './components/PropertyForm';
import Profile from './pages/Profile';
import StaysDetails from './pages/StaysDetails';
import FavoritesPage from './pages/FavoritesPage';
import UserProfile from './pages/UserProfile';
import BookingSuccess from './pages/BookingSuccess';
import BookingPage from './pages/BookingPage';
import './App.css';
import { MapVisibilityProvider } from './context/MapVisibilityContext';
import { AuthProvider } from './context/AuthContext';
import { SearchModeProvider } from './context/SearchModeContext';

const libraries = ['places', 'marker', 'maps'];

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <AuthProvider>
      <SearchModeProvider>
        <MapVisibilityProvider>
          <div className="w-full min-h-screen m-0 bg-white flex flex-col">
            {!hideNavbar && <Navbar />}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/dashboard-service" element={<DashboardService />} />
                <Route path="/stays" element={<Stays />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetails />} />
                <Route path="/details/:type/:id" element={<DetailsPage />} />
                <Route path="/details/stay/:id" element={<StaysDetails />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/add-property" element={
                  <ProtectedRoute>
                    <PropertyForm />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/users/:id" element={<UserProfile />} />
                <Route path="/booking/:id" element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } />
                <Route path="/booking-success/:id" element={
                  <ProtectedRoute>
                    <BookingSuccess />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
            {!hideFooter && <Footer />}
          </div>
        </MapVisibilityProvider>
      </SearchModeProvider>
    </AuthProvider>
  );
};

function App() {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LoadScript>
  );
}

export default App;

"use client"
import React, { useState, useEffect } from 'react';
import { useMapVisibility } from '../context/MapVisibilityContext';
import { rentalService } from '../services/rentalService';
import StaysHeader from '../components/Stays/StaysHeader';
import StaysGrid from '../components/Stays/StaysGrid';
import RentalMap from '../components/RentalMap';

const Stays = () => {
  const [stays, setStays] = useState([]);
  const [selectedStay, setSelectedStay] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isMapVisible } = useMapVisibility();

  useEffect(() => {
    const fetchStays = async () => {
      try {
        setIsLoading(true);
        const data = await rentalService.getRentals(searchFilters);
        setStays(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stays:', err);
        setError(err.message || 'Failed to load stays. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStays();
  }, [searchFilters]);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  const handleStaySelect = (stay) => {
    setSelectedStay(stay);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row">
        <div className={`w-full transition-all duration-300 ${isMapVisible ? 'lg:w-1/2' : 'lg:w-full'}`}>
          <main className="container mx-auto px-4 py-8">
            <StaysHeader 
              onSearch={handleSearch}
              filters={searchFilters}
            />

            <StaysGrid
              stays={stays}
              selectedStay={selectedStay}
              onStaySelect={handleStaySelect}
              isLoading={isLoading}
              error={error}
              isMapVisible={isMapVisible}
            />
          </main>
        </div>

        {isMapVisible && (
          <div className="w-full lg:w-1/2 h-[calc(100vh-64px)] sticky top-16">
            <RentalMap
              rentals={stays}
              selectedRental={selectedStay}
              onRentalSelect={handleStaySelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Stays; 
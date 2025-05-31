"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { useMapVisibility } from '../context/MapVisibilityContext';
import { rentalService } from '../services/rentalService';
import StaysHeader from '../components/Stays/StaysHeader';
import StaysGrid from '../components/Stays/StaysGrid';
import RentalMap from '../components/RentalMap';

const ITEMS_PER_PAGE = 12;

const Stays = () => {
  const [stays, setStays] = useState([]);
  const [selectedStay, setSelectedStay] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { isMapVisible } = useMapVisibility();

  // Memoize visible stays to prevent unnecessary re-renders
  const visibleStays = useMemo(() => {
    return stays.slice(0, page * ITEMS_PER_PAGE);
  }, [stays, page]);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        setIsLoading(true);
        const data = await rentalService.getRentals(searchFilters);
        setStays(data);
        setHasMore(data.length > ITEMS_PER_PAGE);
        setPage(1); // Reset page when filters change
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

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [hasMore, isLoading]);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  const handleStaySelect = (stay) => {
    setSelectedStay(stay);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <div className={`w-full transition-all duration-300 ${
          isMapVisible ? 'lg:w-1/2 xl:w-2/3' : 'lg:w-full'
        }`}>
          <main className="container mx-auto px-4 py-8">
            <StaysHeader 
              onSearch={handleSearch}
              filters={searchFilters}
            />

            <StaysGrid
              stays={visibleStays}
              selectedStay={selectedStay}
              onStaySelect={handleStaySelect}
              isLoading={isLoading}
              error={error}
              isMapVisible={isMapVisible}
            />

            {/* Infinite scroll trigger */}
            {hasMore && !isLoading && (
              <div 
                id="load-more-trigger" 
                className="h-10 w-full"
              />
            )}

            {/* Loading indicator */}
            {isLoading && page > 1 && (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff385c]"></div>
              </div>
            )}
          </main>
        </div>

        {isMapVisible && (
          <div className={`w-full lg:w-1/2 xl:w-1/3 h-[calc(100vh-64px)] sticky top-16 bg-white shadow-lg`}>
            <RentalMap
              rentals={stays}
              selectedRental={selectedStay}
              onRentalSelect={handleStaySelect}
              initialCenter={selectedStay?.location || { lat: 35.6971, lng: -0.6337 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Stays; 
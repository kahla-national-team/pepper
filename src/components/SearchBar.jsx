import React, { useState, useEffect, useRef } from 'react';
import SearchIcon from '../assets/groupe2.svg';
import vector3 from '../assets/Vector(3).svg';
import GuestSelector from './SearchBar/GuestSelector';
import FilterPanel from './SearchBar/FilterPanel';
import DestinationInput from './SearchBar/DestinationInput';

// Sample destinations for suggestions


// Default filters state
const defaultFilters = {
  destination: '',
  dates: {
    checkIn: '',
    checkOut: ''
  },
  guests: {
    adults: 0,
    children: 0,
    babies: 0
  },
  roomType: 'any',
  priceRange: {
    min: 0,
    max: 1000
  },
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
  amenities: [],
  rating: 0,
  favorites: false,
  duration: null
};

function SearchBar({ onSearch, onFilterChange, filters = defaultFilters }) {
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dropdownRef = useRef(null);
  const filterRef = useRef(null);
  
  const totalGuests = (filters?.guests?.adults || 0) + 
                      (filters?.guests?.children || 0) + 
                      (filters?.guests?.babies || 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGuestOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGuestChange = (newGuests) => {
    onFilterChange({
      ...filters,
      guests: newGuests
    });
  };

  const handleFilterChange = (newFilters) => {
    onFilterChange(newFilters);
  };

  const handleDestinationChange = (value) => {
    onFilterChange({
      ...filters,
      destination: value
    });
  };

  const handleDateChange = (type, value) => {
    onFilterChange({
      ...filters,
      dates: {
        ...(filters?.dates || {}),
        [type]: value
      }
    });
  };

  return (
    <div 
      className={`fixed w-full bg-white shadow-md transition-all duration-300 ${
        isMobile ? 'top-16' : 'top-0'
      } ${isScrolled ? 'shadow-lg' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {isMobile ? (
          // Mobile Layout
          <div className="py-3 space-y-3">
            {/* Destination and Search */}
            <div className="flex gap-2">
              <div className="flex-1">
                <DestinationInput
                  value={filters.destination}
                  onChange={handleDestinationChange}
                  onSearch={onSearch}
                />
              </div>
              <button 
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => onSearch(filters.destination)}
              >
                <img src={SearchIcon} alt="Search" className="w-5 h-5" />
              </button>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.dates.checkIn}
                onChange={(e) => handleDateChange('checkIn', e.target.value)}
                placeholder="Check in"
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.dates.checkOut}
                onChange={(e) => handleDateChange('checkOut', e.target.value)}
                placeholder="Check out"
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Guests and Filters */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  className="w-full p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  onClick={() => setIsGuestOpen(!isGuestOpen)}
                >
                  <span className="text-sm">{totalGuests} Guests</span>
                </button>
                {isGuestOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <GuestSelector
                      guests={filters.guests}
                      onGuestChange={handleGuestChange}
                    />
                  </div>
                )}
              </div>

              <div className="relative" ref={filterRef}>
                <button
                  className="w-full p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <img src={vector3} alt="Filter" className="w-4 h-4" />
                  <span className="text-sm">Filters</span>
                </button>
                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <FilterPanel
                      filters={filters}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Desktop Layout
          <div className="py-4 flex items-center gap-4">
            <div className="flex-1">
              <DestinationInput
                value={filters.destination}
                onChange={handleDestinationChange}
                onSearch={onSearch}
              />
            </div>

            <div className="flex gap-4 flex-1">
              <input
                type="date"
                value={filters.dates.checkIn}
                onChange={(e) => handleDateChange('checkIn', e.target.value)}
                placeholder="Check in"
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.dates.checkOut}
                onChange={(e) => handleDateChange('checkOut', e.target.value)}
                placeholder="Check out"
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                className="w-full p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setIsGuestOpen(!isGuestOpen)}
              >
                <span>{totalGuests} Guests</span>
              </button>
              {isGuestOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <GuestSelector
                    guests={filters.guests}
                    onGuestChange={handleGuestChange}
                  />
                </div>
              )}
            </div>

            <div className="relative" ref={filterRef}>
              <button
                className="w-full p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <img src={vector3} alt="Filter" className="w-4 h-4" />
                <span>Filters</span>
              </button>
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <FilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              )}
            </div>

            <button 
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => onSearch(filters.destination)}
            >
              <img src={SearchIcon} alt="Search" className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;

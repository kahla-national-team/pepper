import { useState, useEffect, useRef } from 'react';
import SearchIcon from '../assets/groupe2.svg';
import vector3 from '../assets/Vector(3).svg';
import { useSearchMode } from '../context/SearchModeContext';

// Sample destinations for stays suggestions
const popularDestinations = [
  { id: 1, name: 'Oran, Algeria', type: 'City' },
  { id: 2, name: 'Algiers, Algeria', type: 'City' },
  { id: 3, name: 'Constantine, Algeria', type: 'City' },
  { id: 4, name: 'Annaba, Algeria', type: 'City' },
  { id: 5, name: 'Bejaia, Algeria', type: 'City' },
  { id: 6, name: 'Sidi Bel Abbes, Algeria', type: 'City' },
  { id: 7, name: 'Biskra, Algeria', type: 'City' },
  { id: 8, name: 'Setif, Algeria', type: 'City' },
  { id: 9, name: 'Batna, Algeria', type: 'City' },
  { id: 10, name: 'Tlemcen, Algeria', type: 'City' }
];

// Sample service categories for concierge suggestions
const serviceCategories = [
  { id: 1, name: 'Personal Assistant', type: 'Service' },
  { id: 2, name: 'Event Planning', type: 'Service' },
  { id: 3, name: 'Travel Arrangements', type: 'Service' },
  { id: 4, name: 'Restaurant Reservations', type: 'Service' },
  { id: 5, name: 'VIP Access', type: 'Service' },
  { id: 6, name: 'Shopping Services', type: 'Service' },
  { id: 7, name: 'Transportation', type: 'Service' },
  { id: 8, name: 'Home Services', type: 'Service' },
  { id: 9, name: 'Health & Wellness', type: 'Service' },
  { id: 10, name: 'Business Services', type: 'Service' }
];

const durationOptions = [
  { id: 'night', label: 'Night', icon: '🌙' },
  { id: 'short', label: 'Short Term', icon: '📅' },
  { id: 'long', label: 'Long Term', icon: '🏠' }
];

const urgencyOptions = [
  { id: 'urgent', label: 'Urgent', icon: '⚡' },
  { id: 'standard', label: 'Standard', icon: '⏱️' },
  { id: 'flexible', label: 'Flexible', icon: '🔄' }
];

function SwipingSearchBar({ onSearch, onFilterChange, filters = {} }) {
  const { activeMode, changeMode } = useSearchMode();
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const dropdownRef = useRef(null);
  const filterRef = useRef(null);
  const destinationRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Initialize default values for filters if not provided
  const defaultStaysFilters = {
    destination: filters.destination || '',
    dates: filters.dates || { checkIn: null, checkOut: null },
    guests: filters.guests || { adults: 1, children: 0, babies: 0 },
    amenities: filters.amenities || [],
    rating: filters.rating || 0,
    favorites: filters.favorites || false,
    priceRange: filters.priceRange || { min: 0, max: 1000 },
    duration: filters.duration || '',
    roomType: filters.roomType || 'any',
    bedrooms: filters.bedrooms || 0,
    beds: filters.beds || 0,
    bathrooms: filters.bathrooms || 0
  };

  const defaultServicesFilters = {
    service: filters.service || '',
    serviceTypes: filters.serviceTypes || [],
    when: filters.when || '',
    location: filters.location || '',
    urgency: filters.urgency || '',
    availability: filters.availability || '',
    budget: filters.budget || { min: 0, max: 10000 }
  };

  const [currentFilters, setCurrentFilters] = useState(
    activeMode === 'stays' ? defaultStaysFilters : defaultServicesFilters
  );

  // Update currentFilters when activeMode changes
  useEffect(() => {
    setCurrentFilters(activeMode === 'stays' ? defaultStaysFilters : defaultServicesFilters);
  }, [activeMode, filters]);

  // Ensure currentFilters is never undefined
  useEffect(() => {
    if (!currentFilters) {
      setCurrentFilters(activeMode === 'stays' ? defaultStaysFilters : defaultServicesFilters);
    }
  }, [currentFilters, activeMode]);

  const totalGuests = currentFilters.guests ? currentFilters.guests.adults + currentFilters.guests.children + currentFilters.guests.babies : 0;

  const amenities = [
    { id: 'wifi', label: 'WiFi', icon: '📶' },
    { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { id: 'washer', label: 'Washer', icon: '🧺' },
    { id: 'dryer', label: 'Dryer', icon: '👕' },
    { id: 'ac', label: 'Air Conditioning', icon: '❄️' },
    { id: 'heating', label: 'Heating', icon: '🔥' },
    { id: 'tv', label: 'TV', icon: '📺' },
    { id: 'pool', label: 'Pool', icon: '🏊‍♂️' },
    { id: 'parking', label: 'Free Parking', icon: '🅿️' }
  ];

  const ratings = [
    { value: 5, label: '5 stars' },
    { value: 4, label: '4+ stars' },
    { value: 3, label: '3+ stars' },
    { value: 2, label: '2+ stars' },
    { value: 1, label: '1+ stars' }
  ];

  const serviceTypes = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'luxury', label: 'Luxury', icon: '✨' },
    { id: 'emergency', label: 'Emergency', icon: '🚨' }
  ];

  const availabilityOptions = [
    { value: '24/7', label: '24/7 Available' },
    { value: 'business', label: 'Business Hours' },
    { value: 'custom', label: 'Custom Hours' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setIsSmall(window.innerWidth <= 768 || scrollPosition > 50);
    };

    const handleResize = () => {
      setIsSmall(window.innerWidth <= 768);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGuestOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowSuggestions(false);
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

  // Touch handlers for swiping
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeMode === 'stays') {
      changeMode('services');
    } else if (isRightSwipe && activeMode === 'services') {
      changeMode('stays');
    }
  };

  // Stays mode handlers
  const handleGuestCount = (e, type, operation) => {
    e.stopPropagation();
    const newGuests = { ...currentFilters.guests };
    
    if (operation === 'input') {
      const value = parseInt(e.target.value) || 0;
      newGuests[type] = Math.max(0, value);
    } else {
      newGuests[type] = operation === 'add' ? newGuests[type] + 1 : Math.max(0, newGuests[type] - 1);
    }

    setCurrentFilters(prev => ({
      ...prev,
      guests: newGuests
    }));

    if (onFilterChange) {
      onFilterChange('guests', newGuests);
    }
  };

  const handleStaysFilterChange = (type, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...currentFilters,
        [type]: value
      });
    }
  };

  const handleDateChange = (type, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...currentFilters,
        dates: {
          ...currentFilters.dates,
          [type]: value
        }
      });
    }
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    
    if (onFilterChange) {
      onFilterChange({
        ...currentFilters,
        destination: value
      });
    }
    
    if (value.trim()) {
      const filteredSuggestions = popularDestinations.filter(dest =>
        dest.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
    
    if (onSearch) onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    if (onFilterChange) {
      onFilterChange({
        ...currentFilters,
        destination: suggestion.name
      });
    }
    setShowSuggestions(false);
    if (onSearch) onSearch(suggestion.name);
  };

  // Services mode handlers
  const handleServiceTypeChange = (type, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...currentFilters,
        [type]: value
      });
    }
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    
    if (onFilterChange) {
      onFilterChange({
        ...currentFilters,
        service: value
      });
    }
    
    if (value.trim()) {
      const filteredSuggestions = serviceCategories.filter(service =>
        service.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
    
    if (onSearch) onSearch(value);
  };

  const handleServiceSuggestionClick = (suggestion) => {
    if (onFilterChange) {
      onFilterChange({
        ...currentFilters,
        service: suggestion.name
      });
    }
    setShowSuggestions(false);
    if (onSearch) onSearch(suggestion.name);
  };

  const handleSearchButtonClick = () => {
    if (activeMode === 'stays') {
      if (onSearch) onSearch(currentFilters.destination);
    } else {
      if (onSearch) onSearch(currentFilters.service);
    }
  };

  const StarIcon = ({ filled }) => (
    <span className="text-yellow-400">{filled ? '★' : '☆'}</span>
  );

  const HeartIcon = ({ filled }) => (
    <span className="text-red-500">{filled ? '♥' : '♡'}</span>
  );

  // Filter handlers
  const handleFilterChange = (type, value) => {
    const newFilters = {
        ...currentFilters,
      [type]: value
    };
    setCurrentFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const toggleAmenity = (amenityId) => {
    const newAmenities = currentFilters.amenities.includes(amenityId)
      ? currentFilters.amenities.filter(id => id !== amenityId)
      : [...currentFilters.amenities, amenityId];
    
    handleFilterChange('amenities', newAmenities);
  };

  const handleRatingChange = (rating) => {
    handleFilterChange('rating', currentFilters.rating === rating ? 0 : rating);
  };

  const toggleFavorites = () => {
    handleFilterChange('favorites', !currentFilters.favorites);
  };

  const handlePriceRangeChange = (min, max) => {
    const minValue = parseInt(min) || 0;
    const maxValue = parseInt(max) || 1000;
    
    if (minValue > maxValue) {
      handleFilterChange('priceRange', {
            min: maxValue,
            max: maxValue
        });
    } else {
      handleFilterChange('priceRange', {
            min: minValue,
            max: maxValue
        });
    }
  };

  const toggleDuration = (durationId) => {
    handleFilterChange('duration', currentFilters.duration === durationId ? null : durationId);
  };

  const toggleServiceType = (serviceId) => {
    const currentServiceTypes = currentFilters.serviceTypes || [];
    const newServiceTypes = currentServiceTypes.includes(serviceId)
      ? currentServiceTypes.filter(id => id !== serviceId)
      : [...currentServiceTypes, serviceId];
    
    handleFilterChange('serviceTypes', newServiceTypes);
  };

  const handleAvailabilityChange = (availability) => {
    handleFilterChange('availability', currentFilters.availability === availability ? null : availability);
  };

  return (
    <div 
      className={`fixed top-16 left-0 right-0 z-30 bg-white border-b border-gray-100 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
      ref={searchContainerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/*Search Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        {activeMode === 'stays' ? (
          //  Stays Search Interface
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center bg-white border border-gray-300 rounded-full p-2 transition-all duration-200 hover:shadow-lg focus-within:shadow-lg focus-within:border-gray-900">
              <div className="flex-1 relative px-4" ref={destinationRef}>
                <label className="block text-xs font-semibold text-gray-900 mb-1">Where</label>
                <input 
                  type="text" 
                  placeholder="Search destinations" 
                  value={currentFilters.destination}
                  onChange={handleDestinationChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchButtonClick();
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => {
                    if (currentFilters.destination.trim()) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="w-full border-none outline-none text-sm text-gray-900 bg-transparent placeholder-gray-400"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 mt-2 max-h-48 overflow-y-auto">
                    {suggestions.map(suggestion => (
                      <div
                        key={suggestion.id}
                        className="p-3 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 text-sm">{suggestion.name}</span>
                          <span className="text-xs text-gray-500">{suggestion.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              
              <div className="flex-1 px-4">
                <label className="block text-xs font-semibold text-gray-900 mb-1">Check in</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={currentFilters.dates.checkIn || ''}
                  onChange={(e) => handleDateChange('checkIn', e.target.value)}
                  className="w-full border-none outline-none text-sm text-gray-900 bg-transparent"
                />
              </div>
              
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              
              <div className="flex-1 px-4">
                <label className="block text-xs font-semibold text-gray-900 mb-1">Check out</label>
                <input 
                  type="date" 
                  min={currentFilters.dates.checkIn || new Date().toISOString().split('T')[0]}
                  value={currentFilters.dates.checkOut || ''}
                  onChange={(e) => handleDateChange('checkOut', e.target.value)}
                  className="w-full border-none outline-none text-sm text-gray-900 bg-transparent"
                />
              </div>
              
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              
              <div className="flex-1 relative px-4" ref={dropdownRef}>
                <label className="block text-xs font-semibold text-gray-900 mb-1">Who</label>
                <input
                  type="text"
                  placeholder="Add guests"
                  readOnly
                  onClick={() => setIsGuestOpen(!isGuestOpen)}
                  value={totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : ''}
                  className="w-full border-none outline-none text-sm text-gray-900 bg-transparent cursor-pointer placeholder-gray-400"
                />
                {isGuestOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 mt-2 p-4">
                    {['adults', 'children', 'babies'].map((type) => (
                      <div className="flex items-center justify-between mb-4 last:mb-0" key={type}>
                        <div>
                          <h4 className="font-semibold text-gray-900 capitalize text-sm">{type}</h4>
                          <p className="text-xs text-gray-500">
                            {type === 'adults' ? 'Ages 13 or above' : type === 'children' ? 'Ages 2-12' : 'Under 2'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => handleGuestCount(e, type, 'subtract')}
                            className="w-8 h-8 border border-gray-300 bg-white rounded-full flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 text-lg font-medium"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={currentFilters.guests[type] || 0}
                            onChange={(e) => handleGuestCount(e, type, 'input')}
                            className="w-12 text-center border rounded"
                          />
                          <button 
                            onClick={(e) => handleGuestCount(e, type, 'add')}
                            className="w-8 h-8 border border-gray-300 bg-white rounded-full flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 text-lg font-medium"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              
              {/* Airbnb-style Filter Button - Centered within search bar */}
              <div className="px-4">
                <button 
                  className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 cursor-pointer transition-all duration-200 hover:shadow-md font-medium text-gray-700 text-sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  ref={filterRef}
                >
                  <img src={vector3} alt="Filter" className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
              
              <button 
                className="bg-[#FF385C] border-none rounded-full p-3 cursor-pointer transition-all duration-200 hover:bg-[#E31C5F] flex items-center justify-center min-w-12 h-12 ml-2"
                onClick={handleSearchButtonClick}
              >
                <img src={SearchIcon} alt="Search" className="w-5 h-5 filter brightness-0 invert" />
              </button>
            </div>
          </div>
        ) : (
          // Airbnb-style Services Search Interface
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center bg-white border border-gray-300 rounded-full p-2 transition-all duration-200 hover:shadow-lg focus-within:shadow-lg focus-within:border-gray-900">
              <div className="flex-1 relative px-4" ref={destinationRef}>
                <label className="block text-xs font-semibold text-gray-900 mb-1">Service</label>
                <input 
                  type="text" 
                  placeholder="What service do you need?" 
                  value={currentFilters.service}
                  onChange={handleServiceChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchButtonClick();
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => {
                    if (currentFilters.service.trim()) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="w-full border-none outline-none text-sm text-gray-900 bg-transparent placeholder-gray-400"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 mt-2 max-h-48 overflow-y-auto">
                    {suggestions.map(suggestion => (
                      <div
                        key={suggestion.id}
                        className="p-3 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                        onClick={() => handleServiceSuggestionClick(suggestion)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 text-sm">{suggestion.name}</span>
                          <span className="text-xs text-gray-500">{suggestion.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              
              <div className="flex-1 px-4">
                <label className="block text-xs font-semibold text-gray-900 mb-1">When</label>
                <input 
                  type="datetime-local" 
                  min={new Date().toISOString().slice(0, 16)}
                  value={currentFilters.when || ''}
                  onChange={(e) => handleServiceTypeChange('when', e.target.value)}
                  className="w-full border-none outline-none text-sm text-gray-900 bg-transparent"
                />
              </div>
              
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              
              <div className="flex-1 px-4">
                <label className="block text-xs font-semibold text-gray-900 mb-1">Location</label>
                <input 
                  type="text" 
                  placeholder="Where do you need it?" 
                  value={currentFilters.location}
                  onChange={(e) => handleServiceTypeChange('location', e.target.value)}
                  className="w-full border-none outline-none text-sm text-gray-900 bg-transparent placeholder-gray-400"
                />
              </div>
              
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              
              {/* Airbnb-style Filter Button - Centered within search bar */}
              <div className="px-4">
                <button 
                  className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 cursor-pointer transition-all duration-200 hover:shadow-md font-medium text-gray-700 text-sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  ref={filterRef}
                >
                  <img src={vector3} alt="Filter" className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
              
              <button 
                className="bg-[#FF385C] border-none rounded-full p-3 cursor-pointer transition-all duration-200 hover:bg-[#E31C5F] flex items-center justify-center min-w-12 h-12 ml-2"
                onClick={handleSearchButtonClick}
              >
                <img src={SearchIcon} alt="Search" className="w-5 h-5 filter brightness-0 invert" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Filter Dropdown */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black bg-opacity-50"
          onClick={() => setIsFilterOpen(false)}
        >
          <div 
            className="fixed top-[72px] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl p-6 max-h-[calc(100vh-72px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="max-w-4xl mx-auto">
            {activeMode === 'stays' ? (
                // Stays Filters
              <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                    <div className="flex items-center gap-4">
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          setCurrentFilters(defaultStaysFilters);
                          if (onFilterChange) onFilterChange(defaultStaysFilters);
                        }}
                      >
                        Clear all
                      </button>
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Duration of stay</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {durationOptions.map(option => (
                      <button
                        key={option.id}
                          type="button"
                        className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg text-sm transition-all duration-200 w-full font-medium ${
                          currentFilters.duration === option.id 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => toggleDuration(option.id)}
                      >
                        <span className="text-base">{option.icon}</span>
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum price</label>
                      <input
                        type="number"
                        value={currentFilters.priceRange.min}
                        onChange={(e) => handlePriceRangeChange(e.target.value, currentFilters.priceRange.max)}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum price</label>
                      <input
                        type="number"
                        value={currentFilters.priceRange.max}
                        onChange={(e) => handlePriceRangeChange(currentFilters.priceRange.min, e.target.value)}
                        placeholder="1000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating</h3>
                  <div className="space-y-2">
                    {ratings.slice(0, 3).map(rating => (
                      <button
                        key={rating.value}
                          type="button"
                        className={`flex items-center gap-3 w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 ${
                          currentFilters.rating === rating.value 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => handleRatingChange(rating.value)}
                      >
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, index) => (
                            <StarIcon key={index} filled={index < rating.value} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{rating.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {amenities.map(amenity => (
                        <button
                          key={amenity.id}
                          type="button"
                          className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg text-sm transition-all duration-200 w-full font-medium ${
                            currentFilters.amenities.includes(amenity.id)
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                          onClick={() => toggleAmenity(amenity.id)}
                        >
                          <span className="text-base">{amenity.icon}</span>
                          <span className="text-sm">{amenity.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      className={`flex items-center gap-2 w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 ${
                        currentFilters.favorites
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                      onClick={toggleFavorites}
                    >
                      <HeartIcon filled={currentFilters.favorites} />
                      <span className="text-sm font-medium">Show favorites only</span>
                    </button>
                </div>
              </div>
            ) : (
                // Services Filters
              <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                    <div className="flex items-center gap-4">
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          setCurrentFilters(defaultServicesFilters);
                          if (onFilterChange) onFilterChange(defaultServicesFilters);
                        }}
                      >
                        Clear all
                      </button>
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {serviceTypes.map(service => (
                      <button
                        key={service.id}
                          type="button"
                        className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg text-sm transition-all duration-200 w-full font-medium ${
                          (currentFilters.serviceTypes || []).includes(service.id) 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => toggleServiceType(service.id)}
                      >
                        <span className="text-base">{service.icon}</span>
                        <span className="text-sm">{service.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgency</h3>
                  <div className="space-y-2">
                    {urgencyOptions.map(option => (
                      <button
                        key={option.id}
                          type="button"
                        className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg text-sm transition-all duration-200 w-full font-medium ${
                          currentFilters.urgency === option.id 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                          onClick={() => handleFilterChange('urgency', option.id)}
                      >
                        <span className="text-base">{option.icon}</span>
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                    <div className="space-y-2">
                      {availabilityOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg text-sm transition-all duration-200 w-full font-medium ${
                            currentFilters.availability === option.value 
                              ? 'border-black bg-black text-white' 
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                          onClick={() => handleAvailabilityChange(option.value)}
                        >
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum budget</label>
                      <input
                        type="number"
                        value={(currentFilters.budget || {}).min || 0}
                          onChange={(e) => handleFilterChange('budget', { 
                          ...(currentFilters.budget || {}), 
                          min: parseInt(e.target.value) || 0 
                        })}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maximum budget</label>
                      <input
                        type="number"
                        value={(currentFilters.budget || {}).max || 10000}
                          onChange={(e) => handleFilterChange('budget', { 
                          ...(currentFilters.budget || {}), 
                          max: parseInt(e.target.value) || 10000 
                        })}
                        placeholder="10000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SwipingSearchBar; 
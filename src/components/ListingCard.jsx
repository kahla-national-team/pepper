import { useState, useEffect, useRef } from 'react';
import SearchIcon from '../assets/groupe2.svg';
import vector3 from '../assets/Vector(3).svg';
import '../styles/servicesearchbar.css';

// Sample service categories for suggestions
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

const urgencyOptions = [
  { id: 'urgent', label: 'Urgent', icon: '⚡' },
  { id: 'standard', label: 'Standard', icon: '⏱️' },
  { id: 'flexible', label: 'Flexible', icon: '🔄' }
];

function SearchBar({ onSearch, onFilterChange, filters }) {
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null);
  const filterRef = useRef(null);
  const destinationRef = useRef(null);

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

  const handleServiceTypeChange = (type, value) => {
    onFilterChange({
      ...filters,
      [type]: value
    });
  };

  const toggleServiceType = (serviceId) => {
    const newServiceTypes = filters.serviceTypes.includes(serviceId)
      ? filters.serviceTypes.filter(id => id !== serviceId)
      : [...filters.serviceTypes, serviceId];
    
    onFilterChange({
      ...filters,
      serviceTypes: newServiceTypes
    });
  };

  const handleAvailabilityChange = (availability) => {
    onFilterChange({
      ...filters,
      availability: filters.availability === availability ? null : availability
    });
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };

  const handleSearchButtonClick = () => {
    onSearch(filters.service);
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      service: value
    });
    
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
    
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    onFilterChange({
      ...filters,
      service: suggestion.name
    });
    setShowSuggestions(false);
    onSearch(suggestion.name);
  };

  return (
    <div className={`search-container ${isScrolled ? 'scrolled' : ''} ${isSmall ? 'small' : ''}`}>
      <div className="search-block">
        <div className="search-item" ref={destinationRef}>
          <label>What Service</label>
          <input 
            type="text" 
            placeholder="Search services" 
            value={filters.service}
            onChange={handleServiceChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchButtonClick();
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (filters.service.trim()) {
                setShowSuggestions(true);
              }
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="destination-suggestions">
              {suggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-content">
                    <span className="suggestion-name">{suggestion.name}</span>
                    <span className="suggestion-type">{suggestion.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="search-divider"></div>
        
        <div className="search-item">
          <label>When</label>
          <input 
            type="datetime-local" 
            min={new Date().toISOString().slice(0, 16)}
            value={filters.when || ''}
            onChange={(e) => handleServiceTypeChange('when', e.target.value)}
          />
        </div>
        <div className="search-divider"></div>
        
        <div className="search-item">
          <label>Location</label>
          <input 
            type="text" 
            placeholder="Enter location"
            value={filters.location || ''}
            onChange={(e) => handleServiceTypeChange('location', e.target.value)}
          />
        </div>
        
        <button 
          className="search-button"
          onClick={handleSearchButtonClick}
        >
          <img src={SearchIcon} alt="Search" className="search-icon" />
        </button>
      </div>
      
      <div className="filter-container" ref={filterRef}>
        <button 
          className="filter-button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <img src={vector3} alt="Filter" className="filter-icon" />
          <span>Filters</span>
        </button>
        
        {isFilterOpen && (
          <div className="filter-dropdown">
            <div className="filter-section">
              <h3>Service Type</h3>
              <div className="service-types-grid">
                {serviceTypes.map(service => (
                  <button
                    key={service.id}
                    className={`service-type-button ${filters.serviceTypes.includes(service.id) ? 'active' : ''}`}
                    onClick={() => toggleServiceType(service.id)}
                  >
                    <span className="service-icon">{service.icon}</span>
                    <span className="service-label">{service.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Urgency</h3>
              <div className="urgency-options">
                {urgencyOptions.map(option => (
                  <button
                    key={option.id}
                    className={`urgency-button ${filters.urgency === option.id ? 'active' : ''}`}
                    onClick={() => handleServiceTypeChange('urgency', option.id)}
                  >
                    <span className="urgency-icon">{option.icon}</span>
                    <span className="urgency-label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Availability</h3>
              <div className="availability-options">
                {availabilityOptions.map(option => (
                  <button
                    key={option.value}
                    className={`availability-button ${filters.availability === option.value ? 'active' : ''}`}
                    onClick={() => handleAvailabilityChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Budget Range</h3>
              <div className="price-range-slider">
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>Min</label>
                    <input
                      type="number"
                      value={filters.budget.min}
                      onChange={(e) => handleServiceTypeChange('budget', { ...filters.budget, min: parseInt(e.target.value) || 0 })}
                      min="0"
                      max={filters.budget.max}
                      placeholder="0"
                    />
                  </div>
                  <div className="price-input-group">
                    <label>Max</label>
                    <input
                      type="number"
                      value={filters.budget.max}
                      onChange={(e) => handleServiceTypeChange('budget', { ...filters.budget, max: parseInt(e.target.value) || 1000 })}
                      min={filters.budget.min}
                      max="10000"
                      placeholder="10000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
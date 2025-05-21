import { useState, useEffect, useRef } from 'react';
import SearchIcon from '../assets/groupe2.svg';
import vector3 from '../assets/Vector(3).svg';

import '../styles/searchbar.css';

// Sample destinations for suggestions
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

const durationOptions = [
  { id: 'night', label: 'Night', icon: '🌙' },
  { id: 'short', label: 'Short Term', icon: '📅' },
  { id: 'long', label: 'Long Term', icon: '🏠' }
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
  const totalGuests = filters.guests.adults + filters.guests.children + filters.guests.babies;

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

  const handleGuestCount = (e, type, operation) => {
    e.stopPropagation();
    const newGuests = { ...filters.guests };
    
    if (operation === 'input') {
      const value = parseInt(e.target.value) || 0;
      newGuests[type] = Math.max(0, value);
    } else {
      newGuests[type] = operation === 'add' ? newGuests[type] + 1 : Math.max(0, newGuests[type] - 1);
    }

    onFilterChange({
      ...filters,
      guests: newGuests
    });
  };

  const handleFilterChange = (type, value) => {
    onFilterChange({
      ...filters,
      [type]: value
    });
  };

  const toggleAmenity = (amenityId) => {
    const newAmenities = filters.amenities.includes(amenityId)
      ? filters.amenities.filter(id => id !== amenityId)
      : [...filters.amenities, amenityId];
    
    onFilterChange({
      ...filters,
      amenities: newAmenities
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating
    });
  };

  const toggleFavorites = () => {
    onFilterChange({
      ...filters,
      favorites: !filters.favorites
    });
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };

  const handleDateChange = (type, value) => {
    onFilterChange({
      ...filters,
      dates: {
        ...filters.dates,
        [type]: value
      }
    });
  };

  const handleSearchButtonClick = () => {
    onSearch(filters.destination);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      destination: value
    });
    
    // Show suggestions if there's input
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
    
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    onFilterChange({
      ...filters,
      destination: suggestion.name
    });
    setShowSuggestions(false);
    onSearch(suggestion.name);
  };

  const StarIcon = ({ filled }) => (
    <span className="star-icon">{filled ? '★' : '☆'}</span>
  );

  const HeartIcon = ({ filled }) => (
    <span className="heart-icon">{filled ? '♥' : '♡'}</span>
  );

  const handlePriceRangeChange = (min, max) => {
    // Ensure min and max are valid numbers
    const minValue = parseInt(min) || 0;
    const maxValue = parseInt(max) || 1000;
    
    // Ensure min doesn't exceed max
    if (minValue > maxValue) {
      onFilterChange({
        ...filters,
        priceRange: {
          min: maxValue,
          max: maxValue
        }
      });
    } else {
      onFilterChange({
        ...filters,
        priceRange: {
          min: minValue,
          max: maxValue
        }
      });
    }
  };

  const toggleDuration = (durationId) => {
    const newDuration = filters.duration === durationId ? null : durationId;
    onFilterChange({
      ...filters,
      duration: newDuration
    });
  };

  return (
    <div className={`search-container ${isScrolled ? 'scrolled' : ''} ${isSmall ? 'small' : ''}`}>
      <div className="search-block">
        <div className="search-item" ref={destinationRef}>
          <label>Where</label>
          <input 
            type="text" 
            placeholder="Search destinations" 
            value={filters.destination}
            onChange={handleDestinationChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchButtonClick();
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (filters.destination.trim()) {
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
          <label>Check in</label>
          <input 
            type="date" 
            min={new Date().toISOString().split('T')[0]}
            value={filters.dates.checkIn || ''}
            onChange={(e) => handleDateChange('checkIn', e.target.value)}
          />
        </div>
        <div className="search-divider"></div>
        
        <div className="search-item">
          <label>Check out</label>
          <input 
            type="date" 
            min={filters.dates.checkIn || new Date().toISOString().split('T')[0]}
            value={filters.dates.checkOut || ''}
            onChange={(e) => handleDateChange('checkOut', e.target.value)}
          />
        </div>
        <div className="search-divider"></div>
        
        <div className="search-item" ref={dropdownRef}>
          <label>Who</label>
          <input
            type="text"
            placeholder="Add guests"
            readOnly
            onClick={() => setIsGuestOpen(!isGuestOpen)}
            value={totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : ''}
          />
          {isGuestOpen && (
            <div className="guests-dropdown">
              {['adults', 'children', 'babies'].map((type) => (
                <div className="guest-type" key={type}>
                  <div>
                    <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    <p>{type === 'adults' ? '13 years and older' : type === 'children' ? '2 to 12 years' : 'Under 2 years'}</p>
                  </div>
                  <div className="guest-counter">
                    <button onClick={(e) => handleGuestCount(e, type, 'subtract')}>-</button>
                    <input
                      type="number"
                      min="0"
                      value={filters.guests[type]}
                      onChange={(e) => handleGuestCount(e, type, 'input')}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={(e) => handleGuestCount(e, type, 'add')}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              <h3>Duration</h3>
              <div className="duration-options">
                {durationOptions.map(option => (
                  <button
                    key={option.id}
                    className={`duration-button ${filters.duration === option.id ? 'active' : ''}`}
                    onClick={() => toggleDuration(option.id)}
                  >
                    <span className="duration-icon">{option.icon}</span>
                    <span className="duration-label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Room Type</h3>
              <div className="filter-options">
                {['any', 'room', 'entire home', 'bed only'].map(type => (
                  <button
                    key={type}
                    className={`filter-option ${filters.roomType === type ? 'active' : ''}`}
                    onClick={() => handleFilterChange('roomType', type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-range-slider">
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>Min</label>
                    <input
                      type="number"
                      value={filters.priceRange.min}
                      onChange={(e) => handlePriceRangeChange(e.target.value, filters.priceRange.max)}
                      min="0"
                      max={filters.priceRange.max}
                      placeholder="0"
                    />
                  </div>
                  <div className="price-input-group">
                    <label>Max</label>
                    <input
                      type="number"
                      value={filters.priceRange.max}
                      onChange={(e) => handlePriceRangeChange(filters.priceRange.min, e.target.value)}
                      min={filters.priceRange.min}
                      max="1000"
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="range-slider">
                  <div className="range-track">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.priceRange.min}
                      onChange={(e) => handlePriceRangeChange(e.target.value, filters.priceRange.max)}
                      className="range-input min"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.priceRange.max}
                      onChange={(e) => handlePriceRangeChange(filters.priceRange.min, e.target.value)}
                      className="range-input max"
                    />
                    <div 
                      className="range-progress"
                      style={{
                        left: `${(filters.priceRange.min / 1000) * 100}%`,
                        width: `${((filters.priceRange.max - filters.priceRange.min) / 1000) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h3>Rooms and Beds</h3>
              <div className="rooms-beds">
                <div className="room-type">
                  <label>Bedrooms</label>
                  <div className="counter-controls">
                    <button 
                      onClick={() => handleFilterChange('bedrooms', Math.max(0, filters.bedrooms - 1))}
                      disabled={filters.bedrooms <= 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <button 
                      onClick={() => handleFilterChange('bedrooms', filters.bedrooms + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="room-type">
                  <label>Beds</label>
                  <div className="counter-controls">
                    <button 
                      onClick={() => handleFilterChange('beds', Math.max(0, filters.beds - 1))}
                      disabled={filters.beds <= 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={filters.beds}
                      onChange={(e) => handleFilterChange('beds', Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <button 
                      onClick={() => handleFilterChange('beds', filters.beds + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="room-type">
                  <label>Bathrooms</label>
                  <div className="counter-controls">
                    <button 
                      onClick={() => handleFilterChange('bathrooms', Math.max(0, filters.bathrooms - 1))}
                      disabled={filters.bathrooms <= 0}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <button 
                      onClick={() => handleFilterChange('bathrooms', filters.bathrooms + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h3>Rating</h3>
              <div className="rating-options">
                {ratings.map(rating => (
                  <button
                    key={rating.value}
                    className={`rating-option ${filters.rating === rating.value ? 'active' : ''}`}
                    onClick={() => handleRatingChange(rating.value)}
                  >
                    <div className="stars">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon key={index} filled={index < rating.value} />
                      ))}
                    </div>
                    <span>{rating.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {amenities.map(amenity => (
                  <button
                    key={amenity.id}
                    className={`amenity-button ${filters.amenities.includes(amenity.id) ? 'active' : ''}`}
                    onClick={() => toggleAmenity(amenity.id)}
                  >
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-label">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <button 
                className={`favorites-button ${filters.favorites ? 'active' : ''}`}
                onClick={toggleFavorites}
              >
                <HeartIcon filled={filters.favorites} />
                <span>Show Favorites Only</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;

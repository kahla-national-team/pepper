import React from 'react';

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

const FilterPanel = ({ filters, onFilterChange }) => {
  const toggleAmenity = (amenityId) => {
    const currentAmenities = filters?.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    
    onFilterChange({
      ...filters,
      amenities: newAmenities
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      rating: filters?.rating === rating ? 0 : rating
    });
  };

  const handlePriceRangeChange = (min, max) => {
    const minValue = parseInt(min) || 0;
    const maxValue = parseInt(max) || 1000;
    
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

  return (
    <div className="filter-panel">
      <div className="amenities-section">
        <h3>Amenities</h3>
        <div className="amenities-grid">
          {amenities.map(amenity => (
            <button
              key={amenity.id}
              className={`amenity-button ${filters?.amenities?.includes(amenity.id) ? 'active' : ''}`}
              onClick={() => toggleAmenity(amenity.id)}
            >
              <span className="icon">{amenity.icon}</span>
              <span>{amenity.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ratings-section">
        <h3>Rating</h3>
        <div className="ratings-list">
          {ratings.map(rating => (
            <button
              key={rating.value}
              className={`rating-button ${filters?.rating === rating.value ? 'active' : ''}`}
              onClick={() => handleRatingChange(rating.value)}
            >
              {rating.label}
            </button>
          ))}
        </div>
      </div>

      <div className="price-range-section">
        <h3>Price Range</h3>
        <div className="price-inputs">
          <input
            type="number"
            value={filters?.priceRange?.min || 0}
            onChange={(e) => handlePriceRangeChange(e.target.value, filters?.priceRange?.max)}
            min="0"
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            value={filters?.priceRange?.max || 1000}
            onChange={(e) => handlePriceRangeChange(filters?.priceRange?.min, e.target.value)}
            min="0"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 
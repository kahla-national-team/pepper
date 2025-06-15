import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaFilter, FaTimes, FaSearch, FaMapMarkerAlt, FaHome, FaBed, FaBath, FaUsers } from 'react-icons/fa';
import { propertyService } from '../services/propertyService';
import debounce from 'lodash/debounce';

const PropertyFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    ...initialFilters
  });

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      onFilterChange({ ...filters, search: searchTerm });
    }, 500),
    [filters]
  );

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setIsLoading(true);
        const [types, locations, amenitiesList] = await Promise.all([
          propertyService.getPropertyTypes(),
          propertyService.getLocations(),
          propertyService.getAmenities()
        ]);
        setPropertyTypes(types);
        setLocations(locations);
        setAmenities(amenitiesList);
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setFilters(prev => ({ ...prev, search: searchTerm }));
    debouncedSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      type: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      amenities: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== undefined && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search properties by name, location, or description..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        {filters.search && (
          <button
            onClick={() => handleSearchChange({ target: { value: '' } })}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Filter Toggle Button */}
      <div ref={filterRef}>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <FaFilter />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-[#ff385c] text-white px-2 py-0.5 rounded-full text-sm">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mt-4 space-y-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
              >
                <option value="">All Types</option>
                {propertyTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Min"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5, '6+'].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, '5+'].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity) => (
                  <label
                    key={amenity.id}
                    className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="rounded text-[#ff385c] focus:ring-[#ff385c]"
                    />
                    <span className="text-sm">{amenity.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaTimes />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters; 
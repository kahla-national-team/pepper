import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormInput from './FormInput';
import Button from './Button';
import { FaHome, FaBed, FaBath, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { propertyService } from '../services/propertyService';
import axios from 'axios';

const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

const EditRentalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    price: '',
    max_guests: 1,
    bedrooms: '',
    beds: '',
    bathrooms: '',
    room_type: '',
    amenities: [],
    latitude: '',
    longitude: '',
    renting_term: 'night_term',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [initialImage, setInitialImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [mapCenter, setMapCenter] = useState({
    lat: 0,
    lng: 0
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const roomTypes = [
    'Entire place',
    'Private room',
    'Shared room',
    'Hotel room'
  ];

  const amenitiesList = [
    'WiFi',
    'Kitchen',
    'Washer',
    'Dryer',
    'Air conditioning',
    'Heating',
    'TV',
    'Pool',
    'Gym',
    'Free parking',
    'Elevator',
    'Indoor fireplace',
    'Breakfast',
    'Workspace'
  ];

  // Fetch rental data
  useEffect(() => {
    const fetchRental = async () => {
      try {
        setIsLoading(true);
        const data = await propertyService.getPropertyById(id);
        
        // Ensure all required fields are present
        const formattedData = {
          title: data.title || '',
          description: data.description || '',
          address: data.address || '',
          city: data.city || '',
          price: data.price || '',
          max_guests: data.max_guests || 1,
          bedrooms: data.bedrooms || '',
          beds: data.beds || '',
          bathrooms: data.bathrooms || '',
          room_type: data.room_type || '',
          amenities: data.amenities || [],
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          renting_term: data.renting_term || 'night_term',
          image: data.image || ''
        };

        setFormData(formattedData);
        setInitialImage(data.image);
        setImagePreview(data.image);
        
        if (data.latitude && data.longitude) {
          setMapCenter({
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude)
          });
          setSelectedLocation({
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude)
          });
        }
      } catch (error) {
        console.error('Error fetching rental:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setServerError('Failed to load rental data. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRental();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setServerError('');
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const fetchAddressFromLatLng = async (lat, lng) => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
      return '';
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  };

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    const address = await fetchAddressFromLatLng(lat, lng);
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      address: address || prev.address
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Store the file in formData
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.room_type) {
      newErrors.room_type = 'Room type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Create a copy of formData without the image if it hasn't changed
        const dataToSend = { ...formData };
        
        // Only include image if it's a new File
        if (!(formData.image instanceof File)) {
          delete dataToSend.image;
        }
        
        await propertyService.updateProperty(id, dataToSend);
        navigate('/dashboard/properties');
      } catch (error) {
        console.error('Property update error:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setServerError(error.response?.data?.message || 'An error occurred while updating the property');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  };

  const onLoad = (map) => {
    // This function is called when the map is fully loaded
  };

  const onUnmount = () => {
    // This function is called when the map is unmounted
  };

  const onMapClick = (event) => {
    // This function is called when the map is clicked
  };

  if (isLoading && !formData.title) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <FaHome className="text-[#ff385c] text-4xl mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Edit Property</h2>
          </div>

          {serverError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Property Title"
                  required
                  error={errors.title}
                />
                
                <FormInput
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  error={errors.city}
                />
              </div>

              <div className="mt-4">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Property Description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                  rows="4"
                />
              </div>
            </div>

            {/* Location */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <div className="space-y-4">
                <FormInput
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full Address"
                  required
                  error={errors.address}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    step="any"
                  />
                  
                  <FormInput
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Longitude"
                    step="any"
                  />
                </div>
              </div>
            </div>

            {/* Location Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Location
              </label>
              <div className="w-full h-[400px] rounded-lg overflow-hidden">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={mapCenter}
                  zoom={15}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  onClick={handleMapClick}
                >
                  {selectedLocation && (
                    <Marker
                      position={selectedLocation}
                      draggable={true}
                      onDragEnd={(e) => {
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();
                        setSelectedLocation({ lat, lng });
                        setFormData(prev => ({
                          ...prev,
                          latitude: lat.toString(),
                          longitude: lng.toString()
                        }));
                      }}
                    />
                  )}
                </GoogleMap>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Click on the map to select your property location
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price per night"
                  required
                  error={errors.price}
                />
                
                <FormInput
                  type="number"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleChange}
                  placeholder="Max Guests"
                  min="1"
                />
                
                <select
                  name="room_type"
                  value={formData.room_type}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent ${
                    errors.room_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormInput
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="Bedrooms"
                  min="0"
                />
                
                <FormInput
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleChange}
                  placeholder="Beds"
                  min="0"
                />
                
                <FormInput
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="Bathrooms"
                  min="0"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="rounded text-[#ff385c] focus:ring-[#ff385c]"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Property Image</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Property preview"
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(initialImage);
                        setFormData(prev => ({ ...prev, image: '' }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => navigate('/dashboard/properties')}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#ff385c] hover:bg-[#ff385c]/90"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRentalForm; 
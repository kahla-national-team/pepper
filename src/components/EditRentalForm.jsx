import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rentalService } from '../services/rentalService';
import FormInput from './FormInput';
import Button from './Button';
import OpenStreetMap from './OpenStreetMap';
import { useOpenStreetMap } from '../contexts/OpenStreetMapProvider';
import { FaHome } from 'react-icons/fa';

const amenitiesList = [
  'WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Heating',
  'Washer', 'Dryer', 'TV', 'Pool', 'Gym', 'Pet friendly', 'Balcony'
];

const EditRentalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoaded: isOpenStreetMapLoaded, loadError: openStreetMapError } = useOpenStreetMap();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    latitude: '',
    longitude: '',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    amenities: [],
    images: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fetching, setFetching] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchRental();
    }
    // eslint-disable-next-line
  }, [id]);

    const fetchRental = async () => {
      try {
      setFetching(true);
      const response = await rentalService.getRental(id);
      if (response.success) {
        const rental = response.data;
        setFormData({
          title: rental.title || '',
          description: rental.description || '',
          price: rental.price || '',
          address: rental.address || '',
          city: rental.city || '',
          state: rental.state || '',
          zipCode: rental.zipCode || '',
          country: rental.country || '',
          latitude: rental.latitude || '',
          longitude: rental.longitude || '',
          bedrooms: rental.bedrooms || '',
          bathrooms: rental.bathrooms || '',
          maxGuests: rental.maxGuests || '',
          amenities: rental.amenities || [],
          images: []
        });
        if (rental.latitude && rental.longitude) {
          setSelectedLocation({
            lat: parseFloat(rental.latitude),
            lng: parseFloat(rental.longitude)
          });
        }
        if (rental.image) {
          setPreviewUrl(rental.image);
        }
      } else {
        setServerError('Failed to load rental data');
        }
      } catch (error) {
      setServerError('Failed to load rental data');
      } finally {
      setFetching(false);
      }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setSelectedLocation({ lat, lng });
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString()
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
    if (files[0]) {
      setPreviewUrl(URL.createObjectURL(files[0]));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.bedrooms || isNaN(formData.bedrooms) || formData.bedrooms < 0) newErrors.bedrooms = 'Valid number of bedrooms is required';
    if (!formData.bathrooms || isNaN(formData.bathrooms) || formData.bathrooms < 0) newErrors.bathrooms = 'Valid number of bathrooms is required';
    if (!formData.maxGuests || isNaN(formData.maxGuests) || formData.maxGuests < 1) newErrors.maxGuests = 'Valid number of guests is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach(image => {
            formDataToSend.append('images', image);
          });
        } else if (key === 'amenities') {
          formDataToSend.append('amenities', JSON.stringify(formData.amenities));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      const response = await rentalService.updateRental(id, formDataToSend);
      if (response.success) {
        navigate('/dashboard');
      } else {
        setServerError(response.message || 'Failed to update rental');
      }
    } catch (err) {
      setServerError('Failed to update rental. Please try again.');
      } finally {
      setIsSubmitting(false);
    }
  };

  const center = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng]
    : [40.7128, -74.0060]; // Default to NYC
  const markers = selectedLocation ? [{
    position: [selectedLocation.lat, selectedLocation.lng],
    title: 'Selected Location'
  }] : [];

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rental data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <FaHome className="text-[#ff385c] text-4xl mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Edit Rental</h2>
          </div>
          {serverError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{serverError}</div>
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
                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Location</label>
              <div className="w-full h-[400px] rounded-lg overflow-hidden">
              {!isOpenStreetMapLoaded ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-[#ff385c] rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-500">Loading map...</p>
                    </div>
                  </div>
              ) : openStreetMapError ? (
                  <div className="w-full h-full bg-red-50 flex items-center justify-center">
                    <div className="text-center text-red-600">
                      <p>Error loading map. Please refresh the page.</p>
                  </div>
                </div>
              ) : (
                <OpenStreetMap
                  center={center}
                  zoom={10}
                  markers={markers}
                  onMapClick={handleMapClick}
                  height="400px"
                  width="100%"
                />
              )}
              </div>
              <div className="mt-2 text-sm text-gray-500">Click on the map to select your property location</div>
            </div>
            {/* Latitude and Longitude fields (read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c] bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#ff385c] focus:border-[#ff385c] bg-gray-50"
                />
              </div>
            </div>
            {/* Property Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="Bedrooms"
                  required
                  error={errors.bedrooms}
                />
                <FormInput
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="Bathrooms"
                  required
                  error={errors.bathrooms}
                />
                <FormInput
                  type="number"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  placeholder="Max Guests"
                  required
                  error={errors.maxGuests}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenitiesList.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                        className="form-checkbox h-4 w-4 text-[#ff385c]"
                    />
                      <span className="text-gray-700">{amenity}</span>
                  </label>
                ))}
                </div>
              </div>
            </div>
            {/* Image Upload */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Property Image</h3>
                    <input
                      type="file"
                      accept="image/*"
                multiple={false}
                      onChange={handleImageChange}
                ref={fileInputRef}
                className="mb-4"
                    />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-cover rounded-lg border" />
              )}
                </div>
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRentalForm; 
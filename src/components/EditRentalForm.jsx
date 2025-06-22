import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rentalService } from '../services/rentalService';
import FormInput from './FormInput';
import Button from './Button';
import OpenStreetMap from './OpenStreetMap';
import { useOpenStreetMap } from '../contexts/OpenStreetMapProvider';

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

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchRental();
    }
  }, [id]);

    const fetchRental = async () => {
      try {
      setFetching(true);
      const response = await rentalService.getRentalById(id);
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
        }
      } catch (error) {
        console.error('Error fetching rental:', error);
      setError('Failed to load rental data');
      } finally {
      setFetching(false);
      }
    };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
        
      // Add all form fields
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
        setError(response.message || 'Failed to update rental');
      }
    } catch (err) {
      console.error('Error updating rental:', err);
      setError('Failed to update rental. Please try again.');
      } finally {
      setLoading(false);
    }
  };

  const amenities = [
    'WiFi', 'Kitchen', 'Free parking', 'Air conditioning', 'Heating',
    'Washer', 'Dryer', 'TV', 'Pool', 'Gym', 'Pet friendly', 'Balcony'
  ];

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Rental</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                label="Property Title"
                  name="title"
                  value={formData.title}
                onChange={handleInputChange}
                  required
                />
                
                <FormInput
                label="Price per Night ($)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                  required
                />
              </div>

            <FormInput
              label="Description"
                  name="description"
                  value={formData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={4}
            />

            {/* Address Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                label="Address"
                  name="address"
                  value={formData.address}
                onChange={handleInputChange}
                  required
                  />
                  
                  <FormInput
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                  />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
              
              <FormInput
                label="ZIP Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
              />
              
              <FormInput
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                label="Bedrooms"
                name="bedrooms"
                  type="number"
                value={formData.bedrooms}
                onChange={handleInputChange}
                  required
                />
                
                <FormInput
                label="Bathrooms"
                name="bathrooms"
                  type="number"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
              />
              
              <FormInput
                label="Max Guests"
                name="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={handleInputChange}
                  required
              />
              </div>

            {/* Map Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              <p className="text-sm text-gray-600">Click on the map to set the property location</p>
              
              {!isOpenStreetMapLoaded ? (
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : openStreetMapError ? (
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-500">Error loading map</p>
                    <p className="text-sm text-gray-600">{openStreetMapError.message}</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  required
                  readOnly
                />
                
                <FormInput
                  label="Longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  required
                  readOnly
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
              <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
              {previewUrl && (
                <div className="mb-4">
                        <img
                    src={previewUrl} 
                    alt="Current rental" 
                    className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                multiple
                      accept="image/*"
                      onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => navigate('/dashboard')}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Update Rental
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRentalForm; 
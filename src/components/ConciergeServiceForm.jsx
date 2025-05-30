import React, { useState, useRef } from 'react';
import FormInput from './FormInput';
import { FaUpload, FaTimes } from 'react-icons/fa';

const ConciergeServiceForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    category: initialData.category || '',
    description: initialData.description || '',
    price: initialData.price || '',
    duration_minutes: initialData.duration_minutes || '',
  });

  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.photo_url || null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select an image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      setSelectedImage(file);
      setErrors(prev => ({ ...prev, image: '' }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Service name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (formData.duration_minutes && (isNaN(formData.duration_minutes) || formData.duration_minutes <= 0)) {
      newErrors.duration_minutes = 'Duration must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Create FormData object
        const submitData = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          submitData.append(key, formData[key]);
        });

        // Append image if selected
        if (selectedImage) {
          submitData.append('photo', selectedImage);
        }

        await onSubmit(submitData);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          category: '',
          description: '',
          price: '',
          duration_minutes: '',
        });
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const categories = [
    'Cleaning',
    'Maintenance',
    'Security',
    'Transportation',
    'Personal Care',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 sr-only">Add New Concierge Service</h2>
      
      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Service Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#ff385c] transition-colors">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="photo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#ff385c] hover:text-[#ff385c]/80 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </div>
        </div>
        {errors.image && (
          <p className="text-sm text-red-600">{errors.image}</p>
        )}
      </div>

      <FormInput
        label="Service Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter service name"
        required
        error={errors.name}
      />

      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-red-50 focus:border-transparent transition duration-200 rounded-2xl ${
            errors.category ? 'border-red-500 ring-1 ring-red-500' : 'border-black'
          }`}
          required
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter service description"
          className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-red-50 focus:border-transparent transition duration-200 rounded-2xl"
          rows="4"
        />
      </div>

      <FormInput
        label="Price ($)"
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Enter price"
        required
        error={errors.price}
      />

      <FormInput
        label="Duration (minutes)"
        type="number"
        name="duration_minutes"
        value={formData.duration_minutes}
        onChange={handleChange}
        placeholder="Enter duration in minutes"
        error={errors.duration_minutes}
      />

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-2xl hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-red-600 text-white py-3 px-6 rounded-2xl hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {initialData.id ? 'Update Service' : 'Add Service'}
        </button>
      </div>
    </form>
  );
};

export default ConciergeServiceForm; 
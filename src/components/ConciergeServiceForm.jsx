import React, { useState } from 'react';
import FormInput from './FormInput';

const ConciergeServiceForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    category: initialData.category || '',
    description: initialData.description || '',
    price: initialData.price || '',
    duration_minutes: initialData.duration_minutes || '',
  });

  const [errors, setErrors] = useState({});

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
        await onSubmit(formData);
        // Reset form after successful submission
        setFormData({
          name: '',
          category: '',
          description: '',
          price: '',
          duration_minutes: '',
        });
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
          Add Service
        </button>
      </div>
    </form>
  );
};

export default ConciergeServiceForm; 
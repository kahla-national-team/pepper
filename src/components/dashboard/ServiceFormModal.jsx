import React, { useState, useEffect } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';

const ServiceFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    duration_minutes: '',
    photo_url: '',
    is_active: true
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.photo_url);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you would typically upload the image to your server/cloud storage
      // For now, we'll just create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          photo_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {initialData ? 'Edit Service' : 'Add New Service'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Food">Food</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                  ) : (
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#ff385c] hover:text-[#ff385c]/90">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-[#ff385c] focus:ring-[#ff385c] border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Active Service
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#ff385c] text-white rounded-lg hover:bg-[#ff385c]/90 disabled:opacity-50"
              >
                {loading ? 'Saving...' : initialData ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceFormModal; 
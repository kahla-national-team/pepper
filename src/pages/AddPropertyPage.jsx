import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import { propertyService } from '../services/propertyService';

const AddPropertyPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await propertyService.createProperty(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating property:', error);
      throw error; // Let the form handle the error display
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Property</h1>
        <PropertyForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddPropertyPage; 
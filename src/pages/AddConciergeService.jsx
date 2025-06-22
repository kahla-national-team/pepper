import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConciergeServiceForm from '../components/ConciergeServiceForm';
import { conciergeService } from '../services/conciergeService';

const AddConciergeService = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await conciergeService.createService(formData);
      navigate('/dashboard/concierge-services'); // Redirect after success
    } catch (error) {
      alert(error.message || 'Failed to add concierge service.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Concierge Service</h1>
      <ConciergeServiceForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default AddConciergeService; 
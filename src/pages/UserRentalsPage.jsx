import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { propertyService } from '../services/propertyService';
import { FaEdit, FaTrash, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import RENTALCard from '../components/RENTALCard';
import OwnerRentalsGrid from '../components/OwnerRentalsGrid';

const UserRentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRentals = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const data = await propertyService.getUserProperties(user.id);
        setRentals(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching user properties:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else if (err.response?.status === 404) {
          setRentals([]);
          setError(null);
        } else {
          setError('Failed to load your rentals. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserRentals();
  }, [user, navigate]);

  const handleEdit = (rental) => {
    navigate(`/rentals/edit/${rental.id}`);
  };

  const handleDelete = async (rental) => {
    if (window.confirm('Are you sure you want to delete this rental?')) {
      try {
        await propertyService.deleteProperty(rental.id);
        setRentals(rentals.filter(r => r.id !== rental.id));
      } catch (err) {
        console.error('Error deleting rental:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          alert('Failed to delete rental. Please try again.');
        }
      }
    }
  };

  const handleStatusChange = async (rentalId, newStatus) => {
    try {
      await propertyService.updatePropertyStatus(rentalId, newStatus);
      setRentals(rentals.map(rental => 
        rental.id === rentalId ? { ...rental, status: newStatus } : rental
      ));
    } catch (err) {
      console.error('Error updating rental status:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Failed to update rental status. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Rentals</h1>
          <Link
            to="/add-property"
            className="inline-flex items-center px-4 py-2 bg-[#ff385c] text-white rounded-md hover:bg-[#ff385c]/90 transition-colors"
          >
            <FaPlus className="mr-2" /> Add New Rental
          </Link>
        </div>
        {rentals.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Rentals Found</h2>
            <p className="text-gray-600 mb-6">You haven't added any rentals yet.</p>
            <Link
              to="/add-property"
              className="inline-flex items-center px-6 py-3 bg-[#ff385c] text-white rounded-lg hover:bg-[#ff385c]/90 transition-colors"
            >
              <FaPlus className="mr-2" /> Add Your First Rental
            </Link>
          </div>
        ) : (
          <OwnerRentalsGrid
            rentals={rentals}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
};

export default UserRentalsPage;
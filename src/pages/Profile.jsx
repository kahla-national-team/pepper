"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCamera, FaSpinner, FaSave } from 'react-icons/fa';
import Button from '../components/Button';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data);
      setEditedUser(data);
      if (data.profile_image) {
        setPreviewUrl(data.profile_image);
      }
    } catch (err) {
      setError(err.message);
      if (err.message === 'Failed to fetch profile') {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload image
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('profile_image', file);

      const response = await fetch('http://localhost:5000/api/users/profile/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setUser(data.user);
      setEditedUser(data.user);
    } catch (err) {
      setUploadError(err.message);
      // Revert preview if upload fails
      if (user?.profile_image) {
        setPreviewUrl(user.profile_image);
      } else {
        setPreviewUrl(null);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: editedUser.full_name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUser(data.user);
      setEditedUser(data.user);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff385c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#ff385c] text-white rounded hover:bg-[#ff385c]/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
            {isEditing ? (
              <div className="flex space-x-2">
                <Button
                  variant="text"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser(user);
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2"
                >
                  {saving ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaSave />
                  )}
                  <span>Save Changes</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="text"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>

          {saveError && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg">
              {saveError}
            </div>
          )}

          {/* Profile Image Section */}
          <div className="mb-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#ff385c]">
                      <FaUser className="text-white text-4xl" />
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <label 
                  htmlFor="profile-image-upload" 
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {uploading ? (
                    <FaSpinner className="text-[#ff385c] animate-spin" />
                  ) : (
                    <FaCamera className="text-[#ff385c]" />
                  )}
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                </label>
              </div>

              {uploadError && (
                <p className="mt-2 text-sm text-red-500">{uploadError}</p>
              )}
              
              <p className="mt-4 text-sm text-gray-500">
                Click the camera icon to upload a profile picture
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="full_name"
                    value={editedUser.full_name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-transparent"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{user?.full_name}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{user?.username}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">
                  {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
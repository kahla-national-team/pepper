import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'dgoz9p4ld',
  uploadPreset: 'dgoz9p4ld',
  apiKey: '599637781456269'
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Cloudinary upload function with retry logic and image optimization
const uploadToCloudinary = async (file, retries = 3) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size must be less than 10MB');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
  formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
  
  // Add optimization parameters
  formData.append('transformation', 'f_auto,q_auto,w_1200,c_scale');
  formData.append('folder', 'pepper_rentals');

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log('Attempting Cloudinary upload:', {
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        fileType: file.type,
        fileSize: file.size
      });

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Requested-With': 'XMLHttpRequest'
          },
          timeout: 30000 // 30 second timeout for large files
        }
      );

      console.log('Cloudinary upload successful:', response.data);

      // Return both the secure URL and the public ID
      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        width: response.data.width,
        height: response.data.height,
        format: response.data.format
      };
    } catch (error) {
      console.error(`Cloudinary upload attempt ${attempt} failed:`, error);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      if (attempt === retries) {
        throw new Error('Failed to upload image after multiple attempts. Please try again.');
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};

// Helper function to generate signature for secure upload
const generateSignature = (formData) => {
  const params = [];
  for (const [key, value] of formData.entries()) {
    if (key !== 'file' && key !== 'api_key') {
      params.push(`${key}=${value}`);
    }
  }
  params.sort();
  const signatureString = params.join('&') + CLOUDINARY_CONFIG.apiSecret;
  return require('crypto').createHash('sha1').update(signatureString).digest('hex');
};

// Add axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        });

        const { token } = response.data;
        localStorage.setItem('token', token);

        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const propertyService = {
  // Get all properties
  getAllProperties: async () => {
    try {
      const response = await axios.get(`${API_URL}/properties`);
      return response.data;
    } catch (error) {
      console.error('Get properties error:', error);
      throw error;
    }
  },

  // Get property by ID
  getPropertyById: async (id) => {
    try {
      const headers = getAuthHeader();
      const response = await axios.get(`${API_URL}/properties/${id}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Get property error:', error);
      if (error.message === 'No authentication token found') {
        window.location.href = '/login';
      }
      throw error;
    }
  },

  // Create new property
  createProperty: async (propertyData) => {
    try {
      let dataToSend = { ...propertyData };
      
      // If there's an image file, upload it to Cloudinary first
      if (propertyData.image instanceof File) {
        try {
          const imageData = await uploadToCloudinary(propertyData.image);
          dataToSend.image = imageData.url;
          dataToSend.imageData = {
            publicId: imageData.publicId,
            width: imageData.width,
            height: imageData.height,
            format: imageData.format
          };
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error('Failed to upload property image. Please try again.');
        }
      }

      // Log the data being sent
      console.log('Creating property with data:', {
        ...dataToSend,
        image: dataToSend.image ? 'Image URL present' : 'No image'
      });

      const headers = getAuthHeader();
      const response = await axios.post(`${API_URL}/properties`, dataToSend, { headers });
      return response.data;
    } catch (error) {
      console.error('Create property error:', error);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        throw new Error(error.response.data.message || 'Failed to create property. Please check your input data.');
      }
      throw error;
    }
  },

  // Update property
  updateProperty: async (id, data) => {
    try {
      let dataToSend = { ...data };
      
      // If there's a new image file, upload it to Cloudinary
      if (data.image instanceof File) {
        try {
          const imageData = await uploadToCloudinary(data.image);
          dataToSend.image = imageData.url;
          dataToSend.imageData = {
            publicId: imageData.publicId,
            width: imageData.width,
            height: imageData.height,
            format: imageData.format
          };
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error('Failed to upload property image. Please try again.');
        }
      }

      const headers = getAuthHeader();
      const response = await axios.put(`${API_URL}/properties/${id}`, dataToSend, { headers });
      return response.data;
    } catch (error) {
      console.error('Update property error:', error);
      throw error;
    }
  },

  // Delete property
  deleteProperty: async (id) => {
    try {
      const headers = getAuthHeader();
      const response = await axios.delete(`${API_URL}/properties/${id}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Delete property error:', error);
      throw error;
    }
  },

  // Get user properties
  getUserProperties: async (userId) => {
    try {
      const headers = getAuthHeader();
      const response = await axios.get(`${API_URL}/rentals/user/${userId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Get user properties error:', error);
      throw error;
    }
  },

  // Update property status
  updatePropertyStatus: async (id, status) => {
    try {
      const headers = getAuthHeader();
      const response = await axios.patch(
        `${API_URL}/properties/${id}/status`,
        { status },
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error('Update property status error:', error);
      throw error;
    }
  },

  // New filter-related methods
  getPropertyTypes: async () => {
    try {
      const response = await axios.get(`${API_URL}/properties/types`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Get property types error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching property types' };
    }
  },

  getAmenities: async () => {
    try {
      const response = await axios.get(`${API_URL}/properties/amenities`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Get amenities error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching amenities' };
    }
  },

  getLocations: async () => {
    try {
      const response = await axios.get(`${API_URL}/properties/locations`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Get locations error:', error);
      throw error.response?.data || { message: 'An error occurred while fetching locations' };
    }
  }
}; 
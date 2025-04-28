import { useState } from 'react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Photo from '../assets/photo-sign.svg';
import logo from '../assets/logo-sign.svg';
import { Link } from 'react-router-dom';


const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically make an API call to register
      console.log('Register form submitted:', formData);
      // For now, we'll just log the data
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:block w-2/5 h-full relative">
  {/* Background image */}
  <img src={Photo} alt="Signup" className="w-full h-full object-cover" />

  {/* Overlay (noir avec opacity) */}
  <div className="absolute inset-0 bg-black bg-opacity-40"></div>

  {/* Logo positionné en haut à gauche */}
  <div className="absolute top-4 left-4 z-10">
  <Link to="/" className="hover:text-gray-300">
    <img src={logo} alt="Logo" className="w-20 md:w-28 lg:w-32" />
  </Link>
  </div>
</div>


      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              error={errors.fullName}
            />
            
            <FormInput
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              error={errors.username}
            />
            
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              error={errors.email}
            />
            
            <FormInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              error={errors.password}
            />
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
            
            <div className="text-center mt-4 text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="hover:text-red-300"> Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup; 
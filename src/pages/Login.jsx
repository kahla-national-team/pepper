import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import photo from '../assets/photo-sign.svg';
import logo from '../assets/logo-sign.svg';
import { authService } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) {
      newErrors.identifier = 'Username or Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Call your real authentication service
      const response = await authService.login(formData.identifier, formData.password);
      // Example: save token to localStorage or context
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        // Redirect to dashboard or home
        navigate('/dashboard');
      } else {
        setServerError('Login failed. Please try again.');
      }
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen bg-gray-50">
      {/* Mobile Logo Container */}
      <div className="absolute top-4 left-4 z-20 md:hidden">
        <Link to="/" className="hover:text-gray-300">
          <img src={logo} alt="Logo" className="w-20 md:w-28 lg:w-32" />
        </Link>
      </div>

      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:block w-2/5 h-full relative">
        <img src={photo} alt="Signup" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute top-4 left-4 z-10">
          <Link to="/" className="hover:text-gray-300">
            <img src={logo} alt="Logo" className="w-20 md:w-28 lg:w-32" />
          </Link>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign In</h2>
          {serverError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Username or Email"
              required
              error={errors.identifier}
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'LOGIN'}
              </Button>
            </div>
            <div className="text-center mt-4 text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="hover:text-red-300"> Sign up </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
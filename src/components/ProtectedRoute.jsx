import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    // Store the attempted URL and redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 
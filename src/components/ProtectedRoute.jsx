import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 
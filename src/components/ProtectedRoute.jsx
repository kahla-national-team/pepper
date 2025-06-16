import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  console.log('ProtectedRoute rendering');
  const auth = useAuth();
  console.log('Auth context in ProtectedRoute:', auth);

  if (!auth) {
    console.log('No auth context found');
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute; 
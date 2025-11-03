import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  console.log('ProtectedRoute - isAuthenticated:', authenticated);
  console.log('ProtectedRoute - token:', localStorage.getItem('token'));

  if (!authenticated) {
    console.log('Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

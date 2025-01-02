// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { tokens } = useAuth();
  return tokens ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
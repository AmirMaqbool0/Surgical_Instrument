import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return null; // or a spinner
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 
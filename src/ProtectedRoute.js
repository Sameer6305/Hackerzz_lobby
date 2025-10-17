import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/authUtils';

/**
 * ProtectedRoute component - Restricts access to authenticated users only
 * Redirects to sign-in page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    // Redirect to sign-in if not authenticated
    return <Navigate to="/signin" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;

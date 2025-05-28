// src/components/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/auth';

const PublicRoute = ({ children }) => {
  const [authState, setAuthState] = useState(null); // null = loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        setAuthState(authenticated);
      } catch (error) {
        console.error('Auth check failed in PublicRoute:', error);
        setAuthState(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only redirect if definitely authenticated
  if (authState === true) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PublicRoute;
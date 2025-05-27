

// components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { verifyToken, clearAuth } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = result
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await verifyToken();
        setIsAuthenticated(isValid);
        
        if (!isValid) {
          // Clear invalid tokens
          clearAuth();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
// utils/auth.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Set auth token in localStorage and axios headers
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set user session
export const setUserSession = (user) => {
  if (user) {
    localStorage.setItem('userSession', JSON.stringify(user));
  } else {
    localStorage.removeItem('userSession');
  }
};

// Get user session
export const getUserSession = () => {
  const user = localStorage.getItem('userSession');
  return user ? JSON.parse(user) : null;
};

// Verify token with backend
export const verifyToken = async () => {
  const token = getAuthToken();
  
  if (!token) {
    return false;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Token verification failed:', error);
    // If token is invalid, clear it
    clearAuth();
    return false;
  }
};

// Clear authentication data
export const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userSession');
  delete axios.defaults.headers.common['Authorization'];
};

// Check if user is authenticated (with token verification)
export const isAuthenticated = async () => {
  const token = getAuthToken();
  
  if (!token) {
    return false;
  }

  // Verify token with backend
  const isValid = await verifyToken();
  return isValid;
};

// Logout function
export const logout = () => {
  clearAuth();
  window.location.href = '/login';
};
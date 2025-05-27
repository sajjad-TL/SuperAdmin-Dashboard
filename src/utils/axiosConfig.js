// utils/axiosConfig.js - Create this new file
import axios from 'axios';
import { clearAuth, getAuthToken } from './auth';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      clearAuth();
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Update your Login component to use this axios instance
// Replace axios with api in your login function
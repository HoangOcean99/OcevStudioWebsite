import axios from 'axios';
import toast from 'react-hot-toast';

// Base API configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach token
api.interceptors.request.use((config) => {
  // Try to get token from localStorage (set by AuthStore)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept responses for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle 401 Unauthorized or 403 Forbidden globally here
    if (error.response?.status === 401 || error.response?.status === 403) {
      const msg = error.response?.data?.message || '';
      
      if (error.response?.status === 403 && msg.includes('Tài khoản của bạn đã bị khóa')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          sessionStorage.removeItem('hasSkippedShippingModal');
          
          if (window.location.pathname !== '/login') {
            toast.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
          }
        }
      } else if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          sessionStorage.removeItem('hasSkippedShippingModal');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

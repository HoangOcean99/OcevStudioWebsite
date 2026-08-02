import axios from 'axios';

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
    // Optionally handle 401 Unauthorized globally here (e.g., redirect to login)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Or use Next router if needed
      }
    }
    return Promise.reject(error);
  }
);

export default api;

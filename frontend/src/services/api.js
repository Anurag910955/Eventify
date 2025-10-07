// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://eventify-olive-seven.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Add this if using cookies
});

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized - check credentials or session');
    }
    return Promise.reject(error);
  }
);

export const login = (data) => API.post('/api/auth/login', data);
export const register = (data) => API.post('/api/auth/register', data);

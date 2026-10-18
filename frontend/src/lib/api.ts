import axios from 'axios';

const PRODUCTION_BACKEND = 'https://barwaaqo-restaurant.vercel.app';

let rawUrl = (
  process.env.NEXT_PUBLIC_API_URL || PRODUCTION_BACKEND + '/api'
).trim().replace(/\/+$/, '');

if (!rawUrl.endsWith('/api')) {
  rawUrl += '/api';
}
const API_BASE_URL = rawUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('barwaaqo_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Storage restricted
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Optionally clear storage on unauthorized
      }
    }
    return Promise.reject(error);
  }
);

export default api;

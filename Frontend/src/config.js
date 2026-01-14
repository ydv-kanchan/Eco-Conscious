// config.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://eco-conscious-z418.onrender.com');

export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5173' : 'https://eco-conscious.vercel.app');

// For debugging
console.log('Environment:', {
  API_BASE_URL,
  FRONTEND_URL,
  NODE_ENV: import.meta.env.MODE,
  Hostname: window.location.hostname
});
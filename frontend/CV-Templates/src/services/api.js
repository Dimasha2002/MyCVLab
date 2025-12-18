import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies
  validateStatus: (status) => status < 500,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Cookies are sent automatically with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Profile APIs
export const profileAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Create or update profile
  saveProfile: async (profileData) => {
    const response = await api.post('/profile', profileData);
    return response.data;
  },

  // Upload profile photo
  uploadPhoto: async (photoFile) => {
    const formData = new FormData();
    formData.append('profilePhoto', photoFile);
    
    const response = await api.post('/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete profile photo
  deletePhoto: async () => {
    const response = await api.delete('/profile/photo');
    return response.data;
  },

  // Get profile completion status
  getCompletion: async () => {
    const response = await api.get('/profile/completion');
    return response.data;
  },
};

// CV Generation APIs
export const cvAPI = {
  // Get available templates
  getTemplates: async () => {
    const response = await api.get('/cv/templates');
    return response.data;
  },

  // Preview CV with specific template
  previewCV: async (templateId) => {
    const response = await api.get(`/cv/preview/${templateId}`);
    return response.data;
  },

  // Generate and download PDF
  generatePDF: async (templateId) => {
    const response = await api.post(
      '/cv/generate',
      { templateId },
      {
        responseType: 'blob', // Important for binary data
      }
    );
    return response;
  },

  // Get CV history
  getHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/cv/history?page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Health check API
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Utility functions
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // Remove '/api' from the base URL since uploads are served from root
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseURL = apiUrl.replace('/api', '');
  return `${baseURL}${imagePath}`;
};

export default api;
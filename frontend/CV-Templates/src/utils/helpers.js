import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to combine class names
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date utility
export const formatDate = (date) => {
  if (!date) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(date).toLocaleDateString('en-US', options);
};

// Format date for form inputs (YYYY-MM-DD)
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Calculate years of experience
export const calculateExperience = (experiences) => {
  if (!experiences || experiences.length === 0) return 0;
  
  let totalMonths = 0;
  
  experiences.forEach(exp => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.current ? new Date() : new Date(exp.endDate);
    
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth());
    
    totalMonths += monthsDiff;
  });
  
  return Math.floor(totalMonths / 12);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Validate URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// File size formatter
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text
export const truncate = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Sleep utility for testing
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Storage helpers - disabled (using MongoDB only)
// All data is now stored in MongoDB database through API calls
export const storage = {
  get: (key, defaultValue = null) => {
    console.warn('localStorage is disabled. All data is stored in MongoDB.');
    return defaultValue;
  },
  
  set: (key, value) => {
    console.warn('localStorage is disabled. Use API calls to save data to MongoDB.');
  },
  
  remove: (key) => {
    console.warn('localStorage is disabled. Use API calls to manage data in MongoDB.');
  },
  
  clear: () => {
    console.warn('localStorage is disabled. All data is managed through MongoDB.');
  }
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
};

// Download file from blob
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Form validation helpers
export const validation = {
  required: (value) => {
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return value !== null && value !== undefined;
  },
  
  minLength: (value, min) => {
    return value && value.length >= min;
  },
  
  maxLength: (value, max) => {
    return !value || value.length <= max;
  },
  
  email: (value) => {
    return !value || isValidEmail(value);
  },
  
  phone: (value) => {
    return !value || isValidPhone(value);
  },
  
  url: (value) => {
    return !value || isValidUrl(value);
  }
};

// Error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response - suppress network errors in development
    console.warn('Network request failed, but continuing in offline mode:', error);
    return null; // Return null to suppress error display
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};
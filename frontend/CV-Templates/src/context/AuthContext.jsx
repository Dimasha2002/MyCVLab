import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  // Initialize auth state - check server for existing session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get current user from server (cookie will be sent automatically)
        const response = await authAPI.getCurrentUser();
        
        if (response.success && response.data) {
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: response.data, token: null },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.log('No active session found');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { user } = response.data;
        
        // Token is stored in httpOnly cookie by server
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token: null },
        });
        
        return { success: true, user };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage;
      
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK' || 
          error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
        // For network errors during auto-login, don't show error to user
        errorMessage = null;
        console.warn('Backend not available, continuing in offline mode');
      } else if (error.response?.status === 0 || !error.response) {
        errorMessage = 'Server is not responding. Please try again later.';
      } else {
        errorMessage = error.response?.data?.message || error.message || 'Login failed';
      }
      
      if (errorMessage) {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: errorMessage,
        });
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { user } = response.data;
        
        // Token is stored in httpOnly cookie by server
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token: null },
        });
        
        return { success: true, user };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage;
      
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK' || 
          error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
        errorMessage = 'Unable to connect to server. Please check your connection and try again.';
      } else if (error.response?.status === 0 || !error.response) {
        errorMessage = 'Server is not responding. Please try again later.';
      } else {
        errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      }
      
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call server to clear cookie
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update user function
  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
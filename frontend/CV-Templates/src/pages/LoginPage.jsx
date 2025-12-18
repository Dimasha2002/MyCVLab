import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { LoadingButton } from '../components/Loading';
import { Alert } from '../components/Alert';
import { cn } from '../utils/helpers';

const LoginPage = () => {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearError();

      const result = await login(data);
      
      if (result.success) {
        toast.success('Welcome back!');
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      } else {
        // Only show toast if it's not a server connectivity issue
        if (!result.error?.includes('not responding') && !result.error?.includes('Unable to connect')) {
          toast.error(result.error || 'Invalid email or password');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Please check your credentials and try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden">
        <div className="flex">
          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
                {location.state?.from ? (
                  <p className="text-amber-600 mb-2 bg-amber-50 p-2 rounded-md text-sm">
                    Please sign in to access your CV builder
                  </p>
                ) : null}
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  >
                    Register here
                  </Link>
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-6">
                  <Alert type="error" onClose={clearError}>
                    {error}
                  </Alert>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Id
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email id here"
                    className={cn(
                      'w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50',
                      errors.email && 'border-red-500 focus:ring-red-500'
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('password', {
                        required: 'Password is required',
                      })}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password here"
                      className={cn(
                        'w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50',
                        errors.password && 'border-red-500 focus:ring-red-500'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <LoadingButton
                  type="submit"
                  loading={isLoading}
                  loadingText="Signing in..."
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Submit
                </LoadingButton>
              </form>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center p-12">
            <div className="relative">
              {/* Main illustration container */}
              <div className="relative z-10 flex items-center justify-center">
                {/* Dashboard/CV illustration */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform -rotate-12 hover:-rotate-6 transition-transform duration-500">
                  <div className="w-64 h-48 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-16 h-16 text-white" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                
                {/* Welcome back element */}
                <div className="absolute -left-8 -top-4">
                  <div className="w-20 h-28 bg-gradient-to-b from-green-400 to-green-600 rounded-full relative">
                    <div className="absolute top-2 left-4 w-12 h-12 bg-green-300 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-8 right-8 w-8 h-8 bg-green-300 rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute bottom-12 left-12 w-6 h-6 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute top-20 left-16 w-4 h-4 bg-green-400 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
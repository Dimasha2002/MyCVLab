import React from 'react';
import { cn } from '../utils/helpers';

const LoadingSpinner = ({ size = 'md', className, ...props }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div
      className={cn(
        'loading-spinner',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};

const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

const LoadingButton = ({ 
  loading = false, 
  children, 
  disabled, 
  className,
  loadingText = 'Loading...',
  ...props 
}) => {
  return (
    <button
      disabled={loading || disabled}
      className={cn(
        'btn-primary',
        'flex items-center justify-center space-x-2',
        (loading || disabled) && 'opacity-60 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="text-white" />}
      <span>{loading ? loadingText : children}</span>
    </button>
  );
};

const LoadingCard = ({ className }) => {
  return (
    <div className={cn('card animate-pulse', className)}>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

const LoadingTable = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {/* Header */}
          {Array.from({ length: cols }, (_, i) => (
            <div key={`header-${i}`} className="h-4 bg-gray-200 rounded"></div>
          ))}
          
          {/* Rows */}
          {Array.from({ length: rows }, (_, rowIndex) =>
            Array.from({ length: cols }, (_, colIndex) => (
              <div
                key={`row-${rowIndex}-col-${colIndex}`}
                className="h-3 bg-gray-200 rounded"
              ></div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export {
  LoadingSpinner,
  LoadingOverlay,
  LoadingButton,
  LoadingCard,
  LoadingTable,
};
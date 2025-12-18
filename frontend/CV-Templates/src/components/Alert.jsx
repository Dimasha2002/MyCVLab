import React from 'react';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { cn } from '../utils/helpers';

const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  onClose, 
  className,
  ...props 
}) => {
  const variants = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  };

  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <div
      className={cn(
        'border rounded-lg p-4',
        variant.container,
        className
      )}
      {...props}
    >
      <div className="flex items-start">
        <Icon className={cn('w-5 h-5 mt-0.5 mr-3 flex-shrink-0', variant.iconColor)} />
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              'ml-3 flex-shrink-0 rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2',
              variant.iconColor
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const ErrorBoundaryFallback = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <Alert type="error" title="Something went wrong">
          <p className="mb-4">
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
          <div className="space-y-2">
            <button
              onClick={resetError}
              className="btn-primary w-full"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary w-full"
            >
              Refresh Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">
                Error Details (Dev Only)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
        </Alert>
      </div>
    </div>
  );
};

export { Alert, ErrorBoundaryFallback };
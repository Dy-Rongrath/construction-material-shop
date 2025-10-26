'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export function DefaultErrorFallback({ error, resetError }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-4">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          {process.env.NODE_ENV === 'development' && error?.stack && (
            <details className="text-left bg-gray-800 p-4 rounded-lg mb-4 max-w-2xl mx-auto">
              <summary className="cursor-pointer text-gray-300 hover:text-white">
                Error Details (Development)
              </summary>
              <pre className="text-xs text-gray-400 mt-2 whitespace-pre-wrap overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
        <Button onClick={resetError} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}

// Hook for handling async errors in functional components
export function useErrorHandler() {
  return (error: Error | string) => {
    console.error('Error handled by hook:', error);

    // In a real app, you might want to send this to an error reporting service
    // like Sentry, LogRocket, etc.

    // For now, we'll just log it and potentially show a toast
    if (typeof window !== 'undefined') {
      // You could integrate with a toast library here
      console.error('Application Error:', error);
    }
  };
}

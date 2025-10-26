'use client';

import React from 'react';
import { Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Loading Spinner Component
 * Provides consistent loading states across the application
 */
export function LoadingSpinner({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return <Loader2 className={cn('animate-spin text-yellow-500', sizeClasses[size], className)} />;
}

/**
 * Loading Text Component
 * Combines spinner with loading text
 */
export function LoadingText({
  text = 'Loading...',
  size = 'md',
  className,
}: {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LoadingSpinner size={size} />
      <span className="text-gray-300">{text}</span>
    </div>
  );
}

/**
 * Skeleton Loader Component
 * Provides animated skeleton placeholders
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-gray-700', className)} {...props} />;
}

/**
 * Product Grid Skeleton
 * Skeleton loader for product grids
 */
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Status Message Component
 * For success, error, and info messages
 */
export function StatusMessage({
  type = 'info',
  title,
  message,
  className,
}: {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
}) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: AlertCircle,
  };

  const colors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  const bgColors = {
    success: 'bg-green-900/20 border-green-700',
    error: 'bg-red-900/20 border-red-700',
    warning: 'bg-yellow-900/20 border-yellow-700',
    info: 'bg-blue-900/20 border-blue-700',
  };

  const Icon = icons[type];

  return (
    <div className={cn('border rounded-lg p-4', bgColors[type], className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', colors[type])} />
        <div>
          {title && <h3 className="font-semibold text-white mb-1">{title}</h3>}
          <p className="text-gray-300 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Error Alert Component
 * Specialized component for error messages
 */
export function ErrorAlert({
  error,
  onRetry,
  className,
}: {
  error: string | Error;
  onRetry?: () => void;
  className?: string;
}) {
  const message = error instanceof Error ? error.message : error;

  return (
    <div className={cn('border border-red-700 bg-red-900/20 rounded-lg p-4 mb-4', className)}>
      <StatusMessage type="error" title="Something went wrong" message={message} />
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * Empty State Component
 * For when there's no data to display
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('text-center py-12', className)}>
      {Icon && <Icon className="h-12 w-12 text-gray-500 mx-auto mb-4" />}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-6">{description}</p>}
      {action}
    </div>
  );
}

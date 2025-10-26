import { NextResponse } from 'next/server';

// Error types for consistent error handling
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT_EXCEEDED',
  INTERNAL = 'INTERNAL_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
}

// Safe error class that doesn't leak sensitive information
export class SafeError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error factory functions for common scenarios
export const ErrorFactory = {
  validation: (message: string, _details?: string[]) =>
    new SafeError(message, ErrorType.VALIDATION, 400, true),

  authentication: (message: string = 'Authentication required') =>
    new SafeError(message, ErrorType.AUTHENTICATION, 401, true),

  authorization: (message: string = 'Insufficient permissions') =>
    new SafeError(message, ErrorType.AUTHORIZATION, 403, true),

  notFound: (resource: string = 'Resource') =>
    new SafeError(`${resource} not found`, ErrorType.NOT_FOUND, 404, true),

  conflict: (message: string) => new SafeError(message, ErrorType.CONFLICT, 409, true),

  rateLimit: (message: string = 'Too many requests') =>
    new SafeError(message, ErrorType.RATE_LIMIT, 429, true),

  internal: (message: string = 'Internal server error') =>
    new SafeError(message, ErrorType.INTERNAL, 500, false),

  externalApi: (service: string, message?: string) =>
    new SafeError(
      `External service error: ${service}${message ? ` - ${message}` : ''}`,
      ErrorType.EXTERNAL_API,
      502,
      true
    ),
};

// Error response formatter
export function formatErrorResponse(error: unknown): NextResponse {
  // Default error response
  let statusCode = 500;
  let type = ErrorType.INTERNAL;
  let message = 'An unexpected error occurred';

  if (error instanceof SafeError) {
    statusCode = error.statusCode;
    type = error.type;
    message = error.message;
  } else if (error instanceof Error) {
    // Log the actual error for debugging (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.error('Unhandled error:', error);
    }

    // Don't leak error details in production
    message =
      process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message;
  }

  // Create safe response
  const response = {
    success: false,
    error: {
      type,
      message,
      timestamp: new Date().toISOString(),
    },
  };

  // Add additional headers for specific error types
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (type === ErrorType.RATE_LIMIT) {
    headers['Retry-After'] = '60';
  }

  return NextResponse.json(response, {
    status: statusCode,
    headers,
  });
}

// Async error wrapper for API routes
export function withErrorHandler<T extends any[]>(fn: (...args: T) => Promise<NextResponse>) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await fn(...args);
    } catch (error) {
      return formatErrorResponse(error);
    }
  };
}

// Error logging utility (for production monitoring)
export function logError(error: unknown, context?: Record<string, any>): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : String(error),
    context,
    environment: process.env.NODE_ENV,
    // Add request context if available
    url: typeof window === 'undefined' ? undefined : window.location.href,
  };

  // In production, you would send this to a logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: send to logging service
    console.error('[PRODUCTION ERROR]', JSON.stringify(errorInfo, null, 2));
  } else {
    console.error('[DEVELOPMENT ERROR]', errorInfo);
  }
}

// Client-side error boundary helper
export function handleClientError(error: unknown, errorInfo?: { componentStack?: string }): void {
  const errorDetails = {
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : String(error),
    componentStack: errorInfo?.componentStack,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    timestamp: new Date().toISOString(),
  };

  // Send to error reporting service in production
  if (process.env.NODE_ENV === 'production') {
    // Example: send to error reporting service like Sentry
    console.error('[CLIENT ERROR]', JSON.stringify(errorDetails, null, 2));
  } else {
    console.error('[CLIENT ERROR]', errorDetails);
  }
}

// Database error sanitizer
export function sanitizeDatabaseError(error: unknown): SafeError {
  // Don't leak database-specific information
  if (error instanceof Error) {
    // Check for common database errors and convert to safe messages
    if (error.message.includes('duplicate key')) {
      return ErrorFactory.conflict('Resource already exists');
    }
    if (error.message.includes('foreign key')) {
      return ErrorFactory.validation('Invalid reference');
    }
    if (error.message.includes('check constraint')) {
      return ErrorFactory.validation('Data validation failed');
    }
  }

  return ErrorFactory.internal('Database operation failed');
}

// API error sanitizer
export function sanitizeApiError(_error: unknown, service: string): SafeError {
  // Don't leak external API details
  return ErrorFactory.externalApi(service, 'Service temporarily unavailable');
}

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, authLimiter, apiLimiter } from '@/lib/security';

/**
 * Rate limiting wrapper for API routes
 */
export function withRateLimit(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse,
  options: {
    limiter?: 'auth' | 'api' | 'general';
    identifier?: string;
  } = {}
) {
  return async (request: NextRequest, context?: any) => {
    const { limiter = 'api', identifier } = options;

    const limiterInstance =
      limiter === 'auth' ? authLimiter : limiter === 'general' ? apiLimiter : apiLimiter;

    const rateLimitResult = await rateLimit(request, limiterInstance, identifier);

    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    return handler(request, context);
  };
}

/**
 * Authentication wrapper for API routes
 */
export function withAuth(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse,
  options: {
    required?: boolean;
  } = { required: true }
) {
  return async (request: NextRequest, context?: any) => {
    try {
      // Import session utility dynamically to avoid circular dependencies
      const { getSession } = await import('@/lib/session');

      const session = await getSession(request);
      const isAuthenticated = !!session;

      if (options.required && !isAuthenticated) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        );
      }

      // Add session to request for use in handlers
      (request as any).session = session;

      return handler(request, context);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

/**
 * Input validation wrapper for API routes
 */
export function withValidation(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse,
  validators: {
    body?: (body: any) => boolean | Promise<boolean>;
    query?: (query: URLSearchParams) => boolean | Promise<boolean>;
  } = {}
) {
  return async (request: NextRequest, context?: any) => {
    try {
      // Validate query parameters
      if (validators.query) {
        const isValidQuery = await validators.query(request.nextUrl.searchParams);
        if (!isValidQuery) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Invalid query parameters' },
            { status: 400 }
          );
        }
      }

      // Validate request body for non-GET requests
      if (validators.body && request.method !== 'GET') {
        let body;
        try {
          body = await request.json();
        } catch {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Invalid JSON body' },
            { status: 400 }
          );
        }

        const isValidBody = await validators.body(body);
        if (!isValidBody) {
          return NextResponse.json(
            { error: 'Bad Request', message: 'Invalid request body' },
            { status: 400 }
          );
        }

        // Reconstruct request with parsed body for handlers
        (request as any).body = body;
      }

      return handler(request, context);
    } catch (error) {
      console.error('Validation error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Validation failed' },
        { status: 500 }
      );
    }
  };
}

/**
 * Comprehensive API route wrapper combining rate limiting, auth, and validation
 */
export function withApiHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse> | NextResponse,
  options: {
    rateLimit?: {
      type?: 'auth' | 'api' | 'general';
      identifier?: string;
    };
    auth?: {
      required?: boolean;
    };
    validation?: {
      body?: (body: any) => boolean | Promise<boolean>;
      query?: (query: URLSearchParams) => boolean | Promise<boolean>;
    };
  } = {}
) {
  return async (request: NextRequest, context?: any) => {
    let currentHandler = handler;

    // Apply validation first
    if (options.validation) {
      currentHandler = withValidation(currentHandler, options.validation);
    }

    // Apply authentication
    if (options.auth) {
      currentHandler = withAuth(currentHandler, options.auth);
    }

    // Apply rate limiting
    if (options.rateLimit) {
      currentHandler = withRateLimit(currentHandler, options.rateLimit);
    }

    return currentHandler(request, context);
  };
}

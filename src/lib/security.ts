import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiters for different endpoints
export const generalLimiter = new RateLimiterMemory({
  keyPrefix: 'general',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

export const authLimiter = new RateLimiterMemory({
  keyPrefix: 'auth',
  points: 5, // Number of auth attempts
  duration: 300, // Per 5 minutes
});

export const apiLimiter = new RateLimiterMemory({
  keyPrefix: 'api',
  points: 50, // Number of API calls
  duration: 60, // Per 60 seconds
});

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Security headers - base set used by middleware for dynamic responses
const securityHeaders: Record<string, string> = {
  'X-DNS-Prefetch-Control': 'on',
  'X-Download-Options': 'noopen',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  // We set X-XSS-Protection to 0 to defer to CSP instead (legacy header)
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  // A minimal, safe-ish CSP that allows fonts and Google Analytics/GTM where needed.
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://placehold.co; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://api.github.com https://www.google-analytics.com; frame-ancestors 'none';",
};

// Input validation patterns
const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-Z\s'-]{2,50}$/,
  phone: /^\+?[\d\s\-\(\)]{10,15}$/,
};

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// Validate input against patterns
export function validateInput(type: keyof typeof validationPatterns, value: string): boolean {
  return validationPatterns[type].test(value);
}

// Rate limiting middleware
export async function rateLimit(
  request: NextRequest,
  limiter: RateLimiterMemory,
  identifier?: string
): Promise<{ success: boolean; response?: NextResponse }> {
  try {
    const key =
      identifier ||
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'anonymous';
    await limiter.consume(key);
    return { success: true };
  } catch (rejRes) {
    const error = rejRes as { msBeforeNext: number };
    const response = NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.round(error.msBeforeNext / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.round(error.msBeforeNext / 1000).toString(),
          'X-RateLimit-Reset': new Date(Date.now() + error.msBeforeNext).toISOString(),
        },
      }
    );
    return { success: false, response };
  }
}

// CORS middleware
export function handleCORS(request: NextRequest): NextResponse | null {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin');
    const allowedOrigins =
      process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:3001'];

    const response = new NextResponse(null, { status: 200 });

    // Set CORS headers
    const allowedOrigin = allowedOrigins.includes(origin || '')
      ? origin || allowedOrigins[0]
      : allowedOrigins[0];
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin as string);
    response.headers.set(
      'Access-Control-Allow-Methods',
      corsHeaders['Access-Control-Allow-Methods']
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      corsHeaders['Access-Control-Allow-Headers']
    );
    response.headers.set(
      'Access-Control-Allow-Credentials',
      corsHeaders['Access-Control-Allow-Credentials']
    );
    response.headers.set('Access-Control-Max-Age', corsHeaders['Access-Control-Max-Age']);

    return response;
  }

  // For other requests, we'll add CORS headers in the main middleware
  return null;
}

// Security middleware
export function applySecurityHeaders(response: NextResponse): void {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

// CSRF protection
export function validateCSRF(request: NextRequest): boolean {
  const csrfToken = request.headers.get('x-csrf-token');
  const sessionToken = request.cookies.get('csrf-token')?.value;

  if (!csrfToken || !sessionToken) {
    return false;
  }

  // In a real implementation, you'd verify the token against a secure store
  return csrfToken === sessionToken;
}

// SQL injection protection
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(\\#)|(\%27)|(\%23))/,
    /('|(\\x27)|(\\x2D\\x2D)|(\\#)|(\%27)|(\%23)|(\;)|(\%3B))/,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

// XSS protection
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

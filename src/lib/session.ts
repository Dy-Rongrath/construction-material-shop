import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import 'dotenv/config';

const getRandomBytes = async (length: number): Promise<Uint8Array> => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

// CSRF secret for token generation
const CSRF_SECRET = new TextEncoder().encode(
  process.env.CSRF_SECRET || 'your-csrf-secret-key-change-in-production'
);

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  login: string | null;
  avatarUrl: string | null;
}

export interface SessionData extends JWTPayload {
  user: SessionUser;
  expiresAt: string;
  sessionId: string; // Unique session identifier
  csrfToken: string; // CSRF token for the session
}

// Generate a secure random string
async function generateSecureToken(length: number = 32): Promise<string> {
  const bytes = await getRandomBytes(length);
  // Convert Uint8Array to hex string
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Create a new session
export async function createSession(user: SessionUser): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const sessionId = await generateSecureToken();
  const csrfToken = await generateSecureToken(16);

  const sessionData: SessionData = {
    user,
    expiresAt: expiresAt.toISOString(),
    sessionId,
    csrfToken,
  };

  const token = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .setJti(sessionId) // JWT ID for additional uniqueness
    .sign(JWT_SECRET);

  return token;
}

// Verify and decode a session token
export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Extract our custom data from the payload
    const user = payload.user as SessionUser;
    const expiresAt = payload.expiresAt as string;
    const sessionId = (payload.sessionId as string) || (payload.jti as string);
    const csrfToken = payload.csrfToken as string;

    if (!user || !expiresAt || !sessionId || !csrfToken) {
      return null;
    }

    if (!user.id) {
      return null;
    }

    const sessionData: SessionData = {
      user,
      expiresAt,
      sessionId,
      csrfToken,
      ...payload, // Include any other JWT properties
    };

    // Check if session is expired
    if (new Date() > new Date(sessionData.expiresAt)) {
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

// Get session from request
export async function getSession(request: NextRequest): Promise<SessionData | null> {
  const sessionCookie = request.cookies.get('construction_material_shop_session')?.value;

  if (!sessionCookie) {
    return null;
  }

  const session = await verifySession(sessionCookie);

  // Check if session has valid user data with required fields
  if (!session || !session.user || !session.user.id) {
    return null;
  }

  return session;
}

// Create response with session cookie
export async function createSessionResponse(
  response: NextResponse,
  user: SessionUser
): Promise<NextResponse> {
  // Create session token
  const sessionToken = await createSession(user);

  // Set HttpOnly cookie
  response.cookies.set('construction_material_shop_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Changed from 'lax' to 'strict' for better security
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
  });

  return response;
}

// Clear session
export function clearSession(response: NextResponse): NextResponse {
  response.cookies.set('construction_material_shop_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
  });

  return response;
}

// Middleware helper to require authentication
export async function requireAuth(request: NextRequest): Promise<SessionData> {
  const session = await getSession(request);

  if (!session) {
    throw new Error('Authentication required');
  }

  return session;
}

// CSRF token management
export async function generateCSRFToken(session: SessionData): Promise<string> {
  const csrfToken = await new SignJWT({ sessionId: session.sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // CSRF tokens expire in 1 hour
    .sign(CSRF_SECRET);

  return csrfToken;
}

export async function verifyCSRFToken(token: string, session: SessionData): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, CSRF_SECRET);

    // Check if the session ID matches
    return payload.sessionId === session.sessionId;
  } catch {
    return false;
  }
}

// Session rotation for security
export async function rotateSession(
  _request: NextRequest,
  user: SessionUser
): Promise<NextResponse> {
  const response = NextResponse.next();

  // Clear old session
  clearSession(response);

  // Create new session
  await createSessionResponse(response, user);

  return response;
}

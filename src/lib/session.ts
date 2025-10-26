import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
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
  expiresAt: string; // Store as ISO string for JWT
}

// Create a new session
export async function createSession(user: SessionUser): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const sessionData: SessionData = {
    user,
    expiresAt: expiresAt.toISOString(),
  };

  const token = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET);

  return token;
}

// Verify and decode a session token
export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('JWT payload keys:', Object.keys(payload));
    console.log('JWT payload user:', payload.user);

    // Extract our custom data from the payload
    const user = payload.user as SessionUser;
    const expiresAt = payload.expiresAt as string;

    console.log('Extracted user:', user);
    console.log('Extracted expiresAt:', expiresAt);

    if (!user || !expiresAt) {
      console.log('Session missing user or expiresAt, returning null');
      return null;
    }

    if (!user.id) {
      console.log('Session user missing id, returning null');
      return null;
    }

    const sessionData: SessionData = {
      user,
      expiresAt,
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
    console.log('Session invalid or missing user data');
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
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}

// Clear session
export function clearSession(response: NextResponse): NextResponse {
  response.cookies.set('construction_material_shop_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
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

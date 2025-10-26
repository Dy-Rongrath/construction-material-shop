import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSessionResponse, SessionUser } from '@/lib/session';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// GitHub OAuth URLs
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // If no code, redirect to GitHub for authorization
  if (!code) {
    // Generate a secure state for CSRF protection
    const secureState = crypto.randomUUID();

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: `${BASE_URL}/api/auth/github`,
      scope: 'user:email,read:user',
      state: secureState,
    });

    const authUrl = `${GITHUB_AUTH_URL}?${params.toString()}`;

    // Store state in a temporary cookie for verification
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('oauth_state', secureState, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    return response;
  }

  // Verify state parameter for CSRF protection
  const storedState = request.cookies.get('oauth_state')?.value;
  if (!state || state !== storedState) {
    return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
  }

  // Clear the state cookie
  const response = NextResponse.next();
  response.cookies.set('oauth_state', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  // Handle the OAuth callback
  try {
    // Exchange code for access token
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${BASE_URL}/api/auth/github`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
    }

    // Get user information
    const userResponse = await fetch(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'Construction Material Shop App',
      },
    });

    const userData = await userResponse.json();

    // Get user emails
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'Construction Material Shop App',
      },
    });

    const emailsData = await emailsResponse.json();
    const primaryEmail =
      emailsData.find((email: { primary: boolean; email: string }) => email.primary)?.email ||
      userData.email;

    // Create or update user in database
    const dbUser = await prisma.user.upsert({
      where: { email: primaryEmail },
      update: {
        name: userData.name,
        login: userData.login,
        avatarUrl: userData.avatar_url,
      },
      create: {
        id: userData.id.toString(),
        email: primaryEmail,
        name: userData.name,
        login: userData.login,
        avatarUrl: userData.avatar_url,
      },
    });

    // Create session user object
    const sessionUser: SessionUser = {
      id: dbUser.id, // Keep as string ID from database
      email: dbUser.email,
      name: dbUser.name,
      login: dbUser.login || userData.login,
      avatarUrl: dbUser.avatarUrl,
    };

    // Create secure session and redirect
    const finalResponse = NextResponse.redirect(`${BASE_URL}?login=success`);
    return createSessionResponse(finalResponse, sessionUser);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function POST() {
  // Handle logout or token refresh if needed
  return NextResponse.json({ message: 'Method not implemented' }, { status: 501 });
}

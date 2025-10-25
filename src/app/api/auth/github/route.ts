import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

  // If no code, redirect to GitHub for authorization
  if (!code) {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: `${BASE_URL}/api/auth/github`,
      scope: 'user:email,read:user',
      state: 'construction-material-shop-auth', // You can make this more secure
    });

    const authUrl = `${GITHUB_AUTH_URL}?${params.toString()}`;
    return NextResponse.redirect(authUrl);
  }

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

    const user = {
      id: userData.id,
      login: userData.login,
      name: userData.name,
      email: primaryEmail,
      avatar_url: userData.avatar_url,
    };

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

    // Use database user ID for consistency
    const userWithDbId = {
      ...user,
      id: dbUser.id,
    };

    // Here you would typically:
    // 1. Create/update user in your database ✓ DONE
    // 2. Create a session/token
    // 3. Set cookies or return JWT

    // For now, set a cookie with user data and redirect
    const response = NextResponse.redirect(`${BASE_URL}?login=success`);
    response.cookies.set('construction_material_shop_user', JSON.stringify(userWithDbId), {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function POST() {
  // Handle logout or token refresh if needed
  return NextResponse.json({ message: 'Method not implemented' }, { status: 501 });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSessionResponse } from '@/lib/session';
import bcrypt from 'bcryptjs';

// Force Node.js runtime for crypto operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if user has a password (GitHub users won't have passwords)
    if (!user.password) {
      return NextResponse.json(
        { error: 'This account was created with GitHub. Please use GitHub to sign in.' },
        { status: 400 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create session response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        login: user.login,
        avatar_url: user.avatarUrl,
      },
    });

    return await createSessionResponse(response, {
      id: user.id, // Keep as string ID from database
      email: user.email,
      name: user.name || null,
      login: user.login || null,
      avatarUrl: user.avatarUrl || null,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

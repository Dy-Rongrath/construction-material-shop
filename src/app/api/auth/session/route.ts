import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// Force Node.js runtime for crypto operations
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}

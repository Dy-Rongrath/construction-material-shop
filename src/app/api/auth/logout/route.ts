import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/session';

// Force Node.js runtime for crypto operations
export const runtime = 'nodejs';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    return clearSession(response);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

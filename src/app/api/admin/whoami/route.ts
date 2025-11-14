import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const isAdmin = !!session && isAdminEmail(session.user.email);
    return NextResponse.json({ isAdmin });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}

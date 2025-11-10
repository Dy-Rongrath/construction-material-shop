import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import AdminOrdersClient from './AdminOrdersClient';

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export default async function Page() {
  const cookieJar = await cookies();
  const cookie = cookieJar.get('construction_material_shop_session')?.value;
  let ok = false;
  if (cookie) {
    const session = await verifySession(cookie);
    ok = !!session && isAdminEmail(session.user.email);
  }
  if (!ok) {
    redirect('/');
  }
  return <AdminOrdersClient />;
}

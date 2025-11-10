import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { sendOrderConfirmationEmail } from '@/lib/mail';
import { sendTelegramMessage } from '@/lib/telegram';

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession(request);
    if (!session || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const orderId = (await params).id;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
      include: { items: { include: { product: true } }, user: true },
    });

    // Send email (best-effort)
    try {
      await sendOrderConfirmationEmail({
        to: order.user.email,
        order: {
          id: order.id,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          items: order.items.map((it) => ({ name: it.product.name, quantity: it.quantity, price: it.price })),
          shippingAddress: (order.shippingAddress as any) || null,
        },
      });
    } catch (e) {
      console.error('Admin confirm email error', e);
    }

    // Telegram notify (best-effort)
    try {
      const total = order.totalAmount.toFixed(2);
      await sendTelegramMessage(
        `✅ Order confirmed by admin #${order.id.slice(-8)}\nTotal: $${total}\nItems: ${order.items
          .map((i) => `${i.product.name} x${i.quantity}`)
          .join(', ')}`
      );
    } catch (e) {
      console.error('Admin confirm telegram error', e);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin confirm error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


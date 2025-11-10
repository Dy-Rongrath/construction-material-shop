import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

function getBaseUrl(req: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  if (configured) return configured.replace(/\/$/, '');
  const host = req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || 'http';
  return `${proto}://${host}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body as { orderId: string };
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, user: true },
    });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const stripe = new Stripe(secret);

    const baseUrl = getBaseUrl(request);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      metadata: { orderId: order.id, userId: order.userId },
      line_items: order.items.map(it => ({
        quantity: it.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(it.price * 100),
          product_data: { name: it.product.name },
        },
      })),
      success_url: `${baseUrl}/order-confirmation?orderId=${order.id}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: order.user.email || undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

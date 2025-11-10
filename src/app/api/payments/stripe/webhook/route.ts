import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/mail';
import { sendTelegramMessage } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const sig = request.headers.get('stripe-signature') || '';
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!secret || !key) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const stripe = new Stripe(key);
    const body = await request.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, secret);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = (session.metadata?.orderId as string) || '';
      if (orderId) {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' },
          include: { items: { include: { product: true } }, user: true },
        });

        // Send email to customer
        try {
          await sendOrderConfirmationEmail({
            to: order.user.email,
            order: {
              id: order.id,
              totalAmount: order.totalAmount,
              createdAt: order.createdAt,
              items: order.items.map(it => ({
                name: it.product.name,
                quantity: it.quantity,
                price: it.price,
              })),
              shippingAddress: (order.shippingAddress as any) || null,
            },
          });
        } catch (e) {
          console.error('Email send error', e);
        }

        // Notify Telegram
        const total = order.totalAmount.toFixed(2);
        await sendTelegramMessage(
          `✅ New paid order #${order.id.slice(-8)}\nTotal: $${total}\nItems: ${order.items
            .map(i => `${i.product.name} x${i.quantity}`)
            .join(', ')}`
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook error', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

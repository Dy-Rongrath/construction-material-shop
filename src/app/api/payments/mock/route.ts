import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = (await request.json()) as { orderId: string };
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // For development: immediately mark order as confirmed (simulating payment success)
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
    });

    // Return URL to order confirmation page
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = `${baseUrl}/order-confirmation?orderId=${orderId}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error('Mock payment error', e);
    return NextResponse.json({ error: 'Failed to process mock payment' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = (await request.json()) as { orderId: string };
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Placeholder: in real integration use ABA PayWay API to create a payment
    const note =
      'ABA PayWay integration not configured. Provide your merchant keys to enable live payments.';
    const url = `https://pay.ababank.com/pay?orderId=${order.id}&amount=${order.totalAmount.toFixed(2)}`;
    return NextResponse.json({ url, note });
  } catch (e) {
    console.error('ABA error', e);
    return NextResponse.json({ error: 'Failed to create ABA payment' }, { status: 500 });
  }
}

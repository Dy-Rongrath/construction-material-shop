import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = (await request.json()) as { orderId: string };
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Placeholder: integrate with ACLEDA eCommerce API when credentials are available
    const note =
      'ACLEDA eCommerce integration not configured. Add credentials to enable live payments.';
    const url = `https://acledabank.com.kh/ecomm/pay?orderId=${order.id}&amount=${order.totalAmount.toFixed(2)}`;
    return NextResponse.json({ url, note });
  } catch (e) {
    console.error('AC error', e);
    return NextResponse.json({ error: 'Failed to create AC payment' }, { status: 500 });
  }
}

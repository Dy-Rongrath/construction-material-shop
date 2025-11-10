import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = (await request.json()) as { orderId: string };
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Basic KHQR-like payload (not certified) for demo purposes
    const merchant = process.env.KHQR_MERCHANT_NAME || 'Construction Shop';
    const account = process.env.KHQR_ACCOUNT || '0000000000';
    const amount = order.totalAmount.toFixed(2);
    const payload = `KHQR|ACC=${account}|NAME=${merchant}|AMT=${amount}|CUR=USD|ORDER=${order.id}`;

    const qrDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 320 });
    return NextResponse.json({ qrDataUrl, payload, amount, merchant, account });
  } catch (e) {
    console.error('KHQR error', e);
    return NextResponse.json({ error: 'Failed to generate KHQR' }, { status: 500 });
  }
}

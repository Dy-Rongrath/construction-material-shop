import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface OrderItemWithProduct {
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  price: number;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const orderId = (await params).id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Transform the data to match the frontend interface
    const transformedOrder = {
      id: order.id,
      createdAt: order.createdAt.toISOString(),
      total: order.totalAmount,
      status: order.status,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item: OrderItemWithProduct) => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

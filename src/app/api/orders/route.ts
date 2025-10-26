import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';
import { getSession } from '@/lib/session';

interface OrderWhereClause {
  userId?: string;
  status?: OrderStatus;
}

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from session
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id.toString();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause - always filter by authenticated user
    const where: OrderWhereClause = { userId };
    if (status) where.status = status as OrderStatus;

    // Get orders with items and products
    const orders = await prisma.order.findMany({
      where,
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
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get total count for pagination
    const total = await prisma.order.count({ where });

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from session
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id.toString();

    const body = await request.json();
    const { items, total, totalAmount, shippingAddress } = body;
    const amount = total || totalAmount;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Verify all products exist and are in stock
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      }

      if (!product.inStock) {
        return NextResponse.json(
          { error: `Product ${product.name} is out of stock` },
          { status: 400 }
        );
      }
    }

    // Create order with items in a transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = await prisma.$transaction(async (tx: any) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount: amount,
          shippingAddress: shippingAddress || null,
          status: 'PENDING',
        },
      });

      // Create order items
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }

      // Return order with items
      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

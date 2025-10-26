import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';

// Force Node.js runtime for crypto operations
export const runtime = 'nodejs';

// Type definitions for cart items with product data
interface CartItemWithProduct {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

interface TransformedCart {
  id: string;
  items: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
  }[];
  total: number;
  itemCount: number;
}

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    console.log('Cart API: Getting session...');
    // Get authenticated user from session
    const session = await getSession(request);
    console.log('Cart API: Session result:', session ? 'found' : 'null');

    if (!session || !session.user) {
      console.log('Cart API: No valid session, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = String(session.user.id);
    console.log('Cart API: User ID:', userId);

    if (!userId || userId === 'null' || userId === 'undefined') {
      console.log('Cart API: Invalid user ID, returning 401');
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Get or create cart for user
    console.log('Cart API: Querying database for cart...');
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    console.log('Cart API: Cart found:', cart ? 'yes' : 'no');

    if (!cart) {
      console.log('Cart API: Creating new cart...');
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      console.log('Cart API: New cart created');
    }

    // Transform cart data to match frontend interface
    const transformedCart: TransformedCart = {
      id: cart.id,
      items: cart.items.map((item: CartItemWithProduct) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
      })),
      total: cart.items.reduce(
        (sum: number, item: CartItemWithProduct) => sum + item.product.price * item.quantity,
        0
      ),
      itemCount: cart.items.reduce(
        (sum: number, item: CartItemWithProduct) => sum + item.quantity,
        0
      ),
    };

    console.log('Cart API: Returning cart with', transformedCart.items.length, 'items');
    return NextResponse.json(transformedCart);
  } catch (error) {
    console.error('Cart API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from session
    const session = await getSession(request);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = String(session.user.id);
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!updatedCart) {
      throw new Error('Failed to retrieve updated cart');
    }

    // Transform cart data to match frontend interface
    const transformedCart: TransformedCart = {
      id: updatedCart.id,
      items: updatedCart.items.map((item: CartItemWithProduct) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
      })),
      total: updatedCart.items.reduce(
        (sum: number, item: CartItemWithProduct) => sum + item.product.price * item.quantity,
        0
      ),
      itemCount: updatedCart.items.reduce(
        (sum: number, item: CartItemWithProduct) => sum + item.quantity,
        0
      ),
    };

    return NextResponse.json(transformedCart);
  } catch (error) {
    console.error('Cart POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

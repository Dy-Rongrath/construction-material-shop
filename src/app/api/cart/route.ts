import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';

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
    // Get authenticated user from session
    const session = await getSession(request);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = String(session.user.id);

    if (!userId || userId === 'null' || userId === 'undefined') {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Get or create cart for user
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

    if (!cart) {
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

// DELETE /api/cart - Remove item from cart or clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user from session
    const session = await getSession(request);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = String(session.user.id);
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    if (productId) {
      // Remove specific item from cart
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      if (!cartItem) {
        return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
      }

      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
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
    console.error('Cart DELETE Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user from session
    const session = await getSession(request);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = String(session.user.id);
    const { productId, quantity } = await request.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 });
    }

    if (quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Find the cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

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
    console.error('Cart PUT Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

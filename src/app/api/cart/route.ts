import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
    // For now, we'll get user ID from query params (in production, use auth)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
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
    console.error('Get cart error:', error);
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity = 1 } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID required' }, { status: 400 });
    }

    // Verify product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!product.inStock) {
      return NextResponse.json({ error: 'Product out of stock' }, { status: 400 });
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
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
      return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }

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
    console.error('Add to cart error:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity } = body;

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'User ID, Product ID, and quantity required' },
        { status: 400 }
      );
    }

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    if (quantity <= 0) {
      // Remove item from cart
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId,
        },
      });
    } else {
      // Update quantity
      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        update: { quantity },
        create: {
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
      return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }

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
    console.error('Update cart error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE /api/cart - Clear cart or remove specific item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    if (productId) {
      // Remove specific item
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId,
        },
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
      return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }

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
    console.error('Delete cart error:', error);
    return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 });
  }
}

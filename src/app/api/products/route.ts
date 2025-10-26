import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

type ProductWhereInput = Prisma.ProductWhereInput;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const slug = searchParams.get('slug');

    // Build where clause
    const where: ProductWhereInput = {};

    if (slug) {
      where.slug = slug;
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (sort === 'rating') {
      orderBy.rating = order === 'asc' ? 'asc' : 'desc';
    } else if (sort === 'price') {
      orderBy.price = order === 'asc' ? 'asc' : 'desc';
    } else if (sort === 'name') {
      orderBy.name = order === 'asc' ? 'asc' : 'desc';
    } else if (sort === 'id') {
      orderBy.id = order === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = order === 'asc' ? 'asc' : 'desc';
    }

    // Get products with category
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      skip,
      take: limit,
      orderBy,
    });

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Transform products to match frontend interface
    const transformedProducts = products.map((product: ProductWithCategory) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category.name,
      price: product.price,
      brand: product.brand,
      rating: product.rating,
      reviews: product.reviewCount,
      imageUrl: product.imageUrl,
      images: product.images,
      description: product.description,
      specs: product.specs as Record<string, string>,
      inStock: product.inStock,
    }));

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      brand,
      categorySlug,
      imageUrl,
      images,
      specs,
      inStock,
    } = body;

    // Find category
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        brand,
        imageUrl,
        images: images || [],
        specs: specs || {},
        inStock: inStock !== undefined ? inStock : true,
        categoryId: category.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

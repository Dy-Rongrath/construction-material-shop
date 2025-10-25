import { PrismaClient } from '@prisma/client';
import { allProducts } from '../src/lib/products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories first
  const categories = [
    { name: 'Cement', slug: 'cement', description: 'High-quality cement products' },
    { name: 'Steel', slug: 'steel', description: 'Steel reinforcement and structural materials' },
    { name: 'Lumber', slug: 'lumber', description: 'Wood and timber products' },
    { name: 'Paints', slug: 'paints', description: 'Paints and coatings' },
    { name: 'Concrete', slug: 'concrete', description: 'Ready-mix concrete and aggregates' },
  ];

  console.log('📁 Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Get all categories
  const dbCategories = await prisma.category.findMany();
  const categoryMap = new Map(
    dbCategories.map((cat: { name: string; id: string }) => [cat.name.toLowerCase(), cat.id])
  );

  // Create products
  console.log('📦 Creating products...');
  for (const product of allProducts) {
    const categoryId = categoryMap.get(product.category.toLowerCase());
    if (!categoryId) {
      console.warn(`⚠️  Category not found for product: ${product.name} (${product.category})`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        brand: product.brand,
        rating: product.rating,
        reviewCount: product.reviews,
        imageUrl: product.imageUrl,
        images: product.images,
        specs: product.specs,
        inStock: product.inStock,
        categoryId,
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        brand: product.brand,
        rating: product.rating,
        reviewCount: product.reviews,
        imageUrl: product.imageUrl,
        images: product.images,
        specs: product.specs,
        inStock: product.inStock,
        categoryId,
      },
    });
  }

  console.log('✅ Database seeding completed!');
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

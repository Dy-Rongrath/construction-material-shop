import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Reusable Icon component for the "Why Choose Us" section
const FeatureIcon = ({
  path,
  title,
  children,
}: {
  path: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="bg-yellow-400 p-4 rounded-full mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-gray-900"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{children}</p>
  </div>
);

// Reusable component for a product card
const ProductCard = ({
  name,
  price,
  image,
  category,
}: {
  name: string;
  price: string;
  image: string;
  category: string;
}) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden group">
    <Link href="/products/sample-product" className="block">
      <Image
        src={image}
        alt={name}
        width={400}
        height={300}
        className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
        unoptimized
      />
      <div className="p-4">
        <p className="text-xs text-yellow-400 uppercase font-semibold">{category}</p>
        <h4 className="text-lg font-semibold text-white truncate mt-1">{name}</h4>
        <p className="text-white mt-2 font-bold text-xl">{price}</p>
      </div>
    </Link>
  </div>
);

export default function HomePage() {
  const featuredProducts = [
    {
      name: 'Grade A Portland Cement',
      price: '$8.99 / bag',
      image: 'https://placehold.co/400x300/1F2937/FBBF24?text=Cement',
      category: 'Cement',
    },
    {
      name: 'High-Tensile Steel Rebar',
      price: '$25.50 / rod',
      image: 'https://placehold.co/400x300/1F2937/FBBF24?text=Steel+Rebar',
      category: 'Steel',
    },
    {
      name: 'Red Clay Facing Bricks',
      price: '$0.75 / brick',
      image: 'https://placehold.co/400x300/1F2937/FBBF24?text=Bricks',
      category: 'Masonry',
    },
    {
      name: 'Structural Pine Lumber',
      price: '$12.00 / plank',
      image: 'https://placehold.co/400x300/1F2937/FBBF24?text=Lumber',
      category: 'Wood',
    },
  ];

  const categories = [
    {
      name: 'Cement & Concrete',
      image: 'https://placehold.co/400x400/1F2937/FBBF24?text=Cement',
      href: '/products/cement',
    },
    {
      name: 'Steel & Rebar',
      image: 'https://placehold.co/400x400/1F2937/FBBF24?text=Steel',
      href: '/products/steel',
    },
    {
      name: 'Bricks & Masonry',
      image: 'https://placehold.co/400x400/1F2937/FBBF24?text=Bricks',
      href: '/products/masonry',
    },
    {
      name: 'Lumber & Wood',
      image: 'https://placehold.co/400x400/1F2937/FBBF24?text=Wood',
      href: '/products/wood',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://placehold.co/1600x900/111827/374151?text=Building+Site')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Quality Materials for a Solid Foundation
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            From foundation to finish, get the best construction supplies delivered right to your
            site.
          </p>
          <Link
            href="/products"
            className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
          >
            Shop All Materials
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {categories.map(category => (
              <Link key={category.name} href={category.href} className="group relative block">
                <div className="aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h3 className="text-white text-lg font-bold text-center p-2">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-800 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="border border-yellow-500 text-yellow-500 font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 hover:text-gray-900 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why BuildMart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureIcon title="Unmatched Quality" path="M5 13l4 4L19 7">
              We source only the highest-grade materials, ensuring your projects are durable and
              safe.
            </FeatureIcon>
            <FeatureIcon
              title="Reliable Delivery"
              path="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            >
              Fast, on-time delivery to your job site, keeping your project on schedule.
            </FeatureIcon>
            <FeatureIcon
              title="Expert Support"
              path="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h6l2-2h2l-2 2z"
            >
              Our experienced team is ready to help you choose the right materials for your needs.
            </FeatureIcon>
          </div>
        </div>
      </section>
    </>
  );
}

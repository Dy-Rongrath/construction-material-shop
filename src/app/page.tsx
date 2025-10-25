'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PromotionalBanner } from '@/components/ui';
import { useCart } from '@/lib/hooks';

// Database product interface
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  brand: string;
  imageUrl: string;
  images: string[];
  specs: Record<string, unknown>;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

// API response interface
interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

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

// Category icons as inline SVG components
const CategoryIcon = ({ category }: { category: string }) => {
  const getIconForCategory = (cat: string) => {
    if (!cat) return null; // Handle undefined/null categories

    switch (cat.toLowerCase()) {
      case 'cement':
        return (
          <svg width="400" height="400" viewBox="0 0 400 400" className="w-full h-full">
            <rect width="400" height="400" fill="#1F2937" />
            <circle cx="200" cy="150" r="60" fill="#FBBF24" opacity="0.2" />
            <circle cx="200" cy="150" r="40" fill="#FBBF24" opacity="0.4" />
            <circle cx="200" cy="150" r="20" fill="#FBBF24" />
            <rect x="150" y="250" width="100" height="60" fill="#FBBF24" opacity="0.8" />
          </svg>
        );
      case 'steel':
        return (
          <svg width="400" height="400" viewBox="0 0 400 400" className="w-full h-full">
            <rect width="400" height="400" fill="#1F2937" />
            <rect x="140" y="120" width="120" height="160" fill="#FBBF24" opacity="0.1" />
            <rect x="160" y="140" width="80" height="120" fill="#FBBF24" opacity="0.2" />
            <rect x="180" y="160" width="40" height="80" fill="#FBBF24" />
            <line x1="160" y1="200" x2="240" y2="200" stroke="#1F2937" strokeWidth="4" />
            <line x1="200" y1="160" x2="200" y2="240" stroke="#1F2937" strokeWidth="4" />
          </svg>
        );
      case 'lumber':
        return (
          <svg width="400" height="400" viewBox="0 0 400 400" className="w-full h-full">
            <rect width="400" height="400" fill="#1F2937" />
            <rect x="100" y="140" width="200" height="120" fill="#8B4513" />
            <rect x="120" y="160" width="160" height="80" fill="#D2691E" />
            <line x1="100" y1="170" x2="300" y2="170" stroke="#654321" strokeWidth="2" />
            <line x1="100" y1="190" x2="300" y2="190" stroke="#654321" strokeWidth="2" />
            <line x1="100" y1="210" x2="300" y2="210" stroke="#654321" strokeWidth="2" />
            <line x1="100" y1="230" x2="300" y2="230" stroke="#654321" strokeWidth="2" />
            <circle cx="200" cy="200" r="30" fill="#FBBF24" opacity="0.3" />
          </svg>
        );
      case 'paints':
        return (
          <svg width="400" height="400" viewBox="0 0 400 400" className="w-full h-full">
            <rect width="400" height="400" fill="#1F2937" />
            <rect x="140" y="120" width="120" height="160" fill="#FBBF24" rx="8" />
            <rect x="160" y="140" width="80" height="120" fill="#FF6B35" rx="4" />
            <rect x="170" y="150" width="60" height="20" fill="#4ECDC4" />
            <rect x="170" y="180" width="60" height="20" fill="#45B7D1" />
            <rect x="170" y="210" width="60" height="20" fill="#96CEB4" />
            <circle cx="200" cy="100" r="15" fill="#FBBF24" />
            <rect x="185" y="85" width="30" height="15" fill="#FBBF24" rx="7" />
          </svg>
        );
      case 'concrete':
        return (
          <svg width="400" height="400" viewBox="0 0 400 400" className="w-full h-full">
            <rect width="400" height="400" fill="#1F2937" />
            <rect x="120" y="160" width="160" height="80" fill="#A8A8A8" />
            <circle cx="140" cy="180" r="8" fill="#808080" />
            <circle cx="180" cy="190" r="6" fill="#808080" />
            <circle cx="220" cy="185" r="7" fill="#808080" />
            <circle cx="260" cy="195" r="5" fill="#808080" />
            <circle cx="160" cy="210" r="6" fill="#808080" />
            <circle cx="200" cy="215" r="7" fill="#808080" />
            <circle cx="240" cy="205" r="5" fill="#808080" />
            <rect x="120" y="140" width="160" height="20" fill="#FBBF24" opacity="0.6" />
          </svg>
        );
      default:
        return (
          <svg width="400" height="400" viewBox="0 0 400 400" className="w-full h-full">
            <rect width="400" height="400" fill="#1F2937" />
            <circle cx="200" cy="200" r="80" fill="#FBBF24" opacity="0.3" />
          </svg>
        );
    }
  };

  return getIconForCategory(category);
};

// Reusable component for a product card
const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  slug,
}: {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  slug: string;
}) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id,
        name,
        price: parseInt(price.replace(/[^\d]/g, '')), // Extract numeric price
        imageUrl: image,
      },
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden group">
      <Link href={`/products/${slug}`} className="block">
        <Image
          src={image}
          alt={name}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
          unoptimized
        />
      </Link>
      <div className="p-4">
        <p className="text-xs text-yellow-400 uppercase font-semibold">{category}</p>
        <h4 className="text-lg font-semibold text-white truncate mt-1">{name}</h4>
        <p className="text-white mt-2 font-bold text-xl">{price}</p>
        <div className="flex gap-2 mt-3">
          <Link
            href={`/products/${slug}`}
            className="flex-1 bg-gray-600 text-white font-bold py-2 px-3 rounded-md hover:bg-gray-500 transition-colors text-center text-sm"
          >
            View
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2 px-3 rounded-md hover:bg-yellow-400 transition-colors text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<
    Array<{
      id: string;
      name: string;
      price: string;
      image: string;
      category: string;
      slug: string;
    }>
  >([]);

  const [newArrivals, setNewArrivals] = useState<
    Array<{
      id: string;
      name: string;
      price: string;
      image: string;
      category: string;
      slug: string;
    }>
  >([]);

  const [categories, setCategories] = useState<
    Array<{
      name: string;
      href: string;
    }>
  >([]);

  const [, setIsLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setIsLoading(true);

        // Fetch best sellers (sort by rating)
        const bestSellersResponse = await fetch('/api/products?sort=rating&limit=4');
        if (bestSellersResponse.ok) {
          const bestSellersData: ProductsResponse = await bestSellersResponse.json();
          if (bestSellersData.products) {
            const formattedBestSellers = bestSellersData.products.map(product => ({
              id: product.id,
              name: product.name,
              price: `$${product.price.toLocaleString()}`,
              image: product.imageUrl,
              category: product.category.name,
              slug: product.slug,
            }));
            setBestSellers(formattedBestSellers);
          }
        }

        // Fetch new arrivals (sort by newest first - assuming higher ID = newer)
        const newArrivalsResponse = await fetch('/api/products?sort=id&order=desc&limit=4');
        if (newArrivalsResponse.ok) {
          const newArrivalsData: ProductsResponse = await newArrivalsResponse.json();
          if (newArrivalsData.products) {
            const formattedNewArrivals = newArrivalsData.products.map(product => ({
              id: product.id,
              name: product.name,
              price: `$${product.price.toLocaleString()}`,
              image: product.imageUrl,
              category: product.category.name,
              slug: product.slug,
            }));
            setNewArrivals(formattedNewArrivals);
          }
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/products?limit=1000');
        if (categoriesResponse.ok) {
          const categoriesData: ProductsResponse = await categoriesResponse.json();
          if (categoriesData.products) {
            const uniqueCategories = Array.from(
              new Set(categoriesData.products.map(p => p.category.slug))
            )
              .map(slug => categoriesData.products.find(p => p.category.slug === slug)?.category)
              .filter(Boolean) as Array<{ name: string; slug: string }>;

            const formattedCategories = uniqueCategories.slice(0, 4).map(category => ({
              name: category.name,
              href: `/products?category=${category.slug}`,
            }));
            setCategories(formattedCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

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
            {categories.map((category, index) => (
              <Link
                key={`${category.name}-${index}`}
                href={category.href}
                className="group relative block"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg">
                  <CategoryIcon category={category.name} />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h3 className="text-white text-lg font-bold text-center p-2">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <PromotionalBanner
        title="Special Construction Sale!"
        description="Get 20% off on all cement and concrete products this month. Limited time offer - don't miss out on premium building materials at unbeatable prices."
        ctaText="Shop Sale Items"
        ctaLink="/products"
        alignment="center"
        backgroundImage="https://placehold.co/1600x600/1F2937/FBBF24?text=Construction+Sale"
      />

      {/* Best Sellers Section */}
      <section className="bg-gray-800 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Best Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="border border-yellow-500 text-yellow-500 font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 hover:text-gray-900 transition-colors"
            >
              View All Best Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Construction Material Shop?</h2>
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

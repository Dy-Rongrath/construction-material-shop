'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/hooks';

// Reusable Icon component
const Icon = ({ path, className = 'w-6 h-6' }: { path: string; className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

// Product Card Component
const ProductCard = ({
  product,
}: {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    tag: string;
    shortDescription: string;
  };
}) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <div className="relative">
        <div className="relative w-full h-56">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="absolute top-0 right-0 bg-yellow-500 text-gray-900 font-bold px-3 py-1 m-2 rounded-md text-sm">
          {product.tag}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 truncate">{product.name}</h3>
        <p className="text-gray-400 mb-4 flex-grow">{product.shortDescription}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-2xl font-extrabold text-yellow-400">${product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-yellow-500 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <Icon
              path="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              className="w-5 h-5"
            />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Product Listing Page Component
export default function ProductsPage() {
  // In a real app, this data would be fetched from your database/API
  const mockProducts = [
    {
      id: 1,
      name: 'UltraGrade Portland Cement',
      price: 15.99,
      imageUrl: 'https://placehold.co/600x400/334155/eab308?text=Cement',
      tag: 'Best Seller',
      shortDescription: 'High-strength cement for all construction needs.',
    },
    {
      id: 2,
      name: 'Reinforced Steel Rebar (10ft)',
      price: 25.5,
      imageUrl: 'https://placehold.co/600x400/334155/eab308?text=Rebar',
      tag: 'New',
      shortDescription: 'Grade 60 steel for maximum structural integrity.',
    },
    {
      id: 3,
      name: 'Red Clay Facing Bricks (Pack of 500)',
      price: 250.0,
      imageUrl: 'https://placehold.co/600x400/334155/eab308?text=Bricks',
      tag: 'Bulk Deal',
      shortDescription: 'Durable and weatherproof, perfect for exteriors.',
    },
    {
      id: 4,
      name: 'Construction Grade Lumber (2x4x8)',
      price: 8.75,
      imageUrl: 'https://placehold.co/600x400/334155/eab308?text=Lumber',
      tag: 'On Sale',
      shortDescription: 'Kiln-dried pine for framing and general projects.',
    },
    {
      id: 5,
      name: 'PVC Drainage Pipe (4-inch)',
      price: 35.2,
      imageUrl: 'https://placehold.co/600x400/334155/eab308?text=Pipe',
      tag: 'New',
      shortDescription: 'Heavy-duty PVC for residential and commercial drainage.',
    },
    {
      id: 6,
      name: 'Asphalt Roofing Shingles (3-Tab)',
      price: 42.0,
      imageUrl: 'https://placehold.co/600x400/334155/eab308?text=Shingles',
      tag: 'Weatherproof',
      shortDescription: '25-year warranty architectural shingles.',
    },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-extrabold text-center mb-4">Our Products</h1>
        <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
          Browse our extensive catalog of high-quality construction materials.
        </p>

        {/* Filters Section */}
        <div className="bg-gray-800 p-4 rounded-lg mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Icon path="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
            <span className="font-bold">Filters:</span>
          </div>
          {/* Filter 1: Category */}
          <select className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 w-full md:w-auto">
            <option>All Categories</option>
            <option>Cement & Concrete</option>
            <option>Lumber & Wood</option>
            <option>Steel & Rebar</option>
            <option>Bricks & Masonry</option>
          </select>
          {/* Filter 2: Price Range */}
          <select className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 w-full md:w-auto">
            <option>Any Price</option>
            <option>$0 - $50</option>
            <option>$50 - $200</option>
            <option>$200+</option>
          </select>
          <button className="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors w-full md:w-auto">
            Apply
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

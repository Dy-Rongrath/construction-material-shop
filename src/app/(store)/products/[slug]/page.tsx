import React from 'react';
import Image from 'next/image';

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

// Main Product Detail Page Component
export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // In a real app, you would use params.slug to fetch the product data from your API.
  // const product = await getProductBySlug(params.slug);
  console.log('Product slug:', params.slug); // Using params to avoid lint warning
  const mockProduct = {
    id: 2,
    name: 'Reinforced Steel Rebar (10ft)',
    slug: 'reinforced-steel-rebar-10ft',
    price: 25.5,
    images: [
      'https://placehold.co/800x600/334155/eab308?text=Rebar+Main',
      'https://placehold.co/400x300/334155/eab308?text=Rebar+Angle',
      'https://placehold.co/400x300/334155/eab308?text=Rebar+Closeup',
      'https://placehold.co/400x300/334155/eab308?text=In+Use',
    ],
    description:
      'Ensure maximum structural integrity with our Grade 60 reinforced steel rebar. Each 10-foot bar is manufactured to the highest standards, offering superior tensile strength and durability for concrete reinforcement in foundations, walls, and columns. Corrosion-resistant coating ensures longevity.',
    category: 'Steel & Rebar',
    stock: 150,
    specs: {
      Material: 'Grade 60 Steel',
      Length: '10 feet',
      Diameter: '5/8 inch (#5)',
      'Tensile Strength': '90,000 psi',
      Weight: '10.4 lbs',
    },
  };

  const { name, price, images, description, category, stock, specs } = mockProduct;

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-800 rounded-lg overflow-hidden mb-4">
              <div className="relative w-full h-96">
                <Image src={images[0]} alt={name} fill unoptimized className="object-cover" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-yellow-400"
                >
                  <div className="relative w-full h-24">
                    <Image
                      src={img}
                      alt={`${name} thumbnail ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="text-yellow-400 font-semibold">{category}</span>
            <h1 className="text-4xl font-extrabold my-3">{name}</h1>
            <p className="text-gray-300 text-lg mb-6">{description}</p>

            <div className="mb-6">
              <p className="text-4xl font-extrabold text-yellow-400">${price.toFixed(2)}</p>
              <p className="text-green-400 font-semibold mt-2">
                {stock > 0 ? `In Stock (${stock} available)` : 'Out of Stock'}
              </p>
            </div>

            {/* Add to Cart Section */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-600 rounded-lg">
                <button className="px-4 py-2 hover:bg-gray-700">-</button>
                <span className="px-6 py-2">1</span>
                <button className="px-4 py-2 hover:bg-gray-700">+</button>
              </div>
              <button className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors flex-grow flex items-center justify-center gap-2">
                <Icon
                  path="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  className="w-5 h-5"
                />
                Add to Cart
              </button>
            </div>

            {/* Specifications */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Specifications</h3>
              <ul className="space-y-2 text-gray-300">
                {Object.entries(specs).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span className="font-semibold">{key}:</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

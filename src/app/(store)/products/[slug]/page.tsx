'use client';

import React, { useState, useEffect, use } from 'react';
import { Plus, Minus, Star, ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';
import FullPageLoader from '@/components/FullPageLoader';
import { Breadcrumbs } from '@/components';
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

// A small card component for the "Related Products" section
const ProductCard = ({ product }: { product: Product }) => (
  <a
    href={`/products/${product.slug}`}
    className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-105 hover:shadow-yellow-500/20 group"
  >
    <div className="overflow-hidden relative">
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        unoptimized
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-lg font-bold text-white mb-2 flex-grow">{product.name}</h3>
      <div className="flex items-center justify-between mt-auto">
        <p className="text-xl font-black text-white">₹{product.price.toLocaleString()}</p>
        <div className="bg-yellow-500 text-gray-900 font-bold py-2 px-3 rounded-md group-hover:bg-yellow-400 text-sm transition-colors">
          View
        </div>
      </div>
    </div>
  </a>
);

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const { dispatch } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const slug = resolvedParams?.slug;
      if (!slug) return;

      try {
        // Fetch product by slug
        const response = await fetch(`/api/products?slug=${slug}`);
        if (!response.ok) throw new Error('Product not found');

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const foundProduct = data.data[0];
          setProduct(foundProduct);
          setMainImage(foundProduct.imageUrl);

          // Fetch related products from same category
          const relatedResponse = await fetch(
            `/api/products?category=${foundProduct.category.slug}&limit=4`
          );
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out the current product
            const related = relatedData.data.filter((p: Product) => p.id !== foundProduct.id);
            setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [resolvedParams?.slug]);

  if (!product) {
    return <FullPageLoader />;
  }

  const handleQuantity = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        },
      });
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Products', href: '/products' },
            {
              name: product.category.name,
              href: `/products?category=${product.category.slug}`,
            },
            { name: product.name, href: '#' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image Gallery */}

          <div className="flex flex-col gap-4 sticky top-24">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                unoptimized
                className="object-cover transition-all duration-300 ease-in-out hover:scale-110"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square bg-gray-800 rounded-md overflow-hidden transition-all duration-200 relative ${mainImage === img ? 'ring-2 ring-yellow-500' : 'hover:opacity-75'}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details & Actions */}
          <div>
            <p className="text-yellow-400 font-semibold mb-2">{product.category.name}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill="currentColor"
                    className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-gray-400">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            <p className="text-4xl font-black text-white mb-6">₹{product.price.toLocaleString()}</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-600 rounded-md">
                <button
                  onClick={() => handleQuantity(-1)}
                  className="px-4 py-3 hover:bg-gray-700 transition-colors rounded-l-md"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 py-2 text-lg font-bold">{quantity}</span>
                <button
                  onClick={() => handleQuantity(1)}
                  className="px-4 py-3 hover:bg-gray-700 transition-colors rounded-r-md"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-grow bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-md text-lg hover:bg-yellow-400 transition-colors shadow-lg"
              >
                Add to Cart
              </button>
            </div>

            <div className="space-y-4 border-t border-gray-700 pt-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-yellow-500" size={24} />
                <p className="text-gray-300">100% Genuine Products from verified suppliers</p>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="text-yellow-500" size={24} />
                <p className="text-gray-300">Fast, reliable on-site delivery available</p>
              </div>
            </div>

            {/* Description, Specs, Reviews Tabs */}
            <div className="mt-12">
              <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`py-4 px-1 border-b-2 font-medium text-lg transition-colors ${activeTab === 'description' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`py-4 px-1 border-b-2 font-medium text-lg transition-colors ${activeTab === 'specs' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                  >
                    Specifications
                  </button>
                </nav>
              </div>
              <div className="mt-8">
                {activeTab === 'description' && (
                  <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                    <p>{product.description}</p>
                  </div>
                )}
                {activeTab === 'specs' && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <ul className="space-y-4">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <li
                          key={key}
                          className="flex justify-between border-b border-gray-700 pb-2"
                        >
                          <span className="font-semibold text-gray-400">{key}:</span>
                          <span className="text-white text-right">{String(value)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-700">
            <h2 className="text-3xl font-extrabold text-white mb-8 border-l-4 border-yellow-500 pl-4">
              Customers Also Bought
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

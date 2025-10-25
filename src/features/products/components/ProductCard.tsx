import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Star } from 'lucide-react';
import { useCart } from '@/lib/hooks';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  view: string;
  priority?: boolean;
}

export const ProductCard = ({ product, view, priority = false }: ProductCardProps) => {
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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < Math.round(rating) ? 'currentColor' : 'none'}
        className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}
      />
    ));
  };

  if (view === 'list') {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center w-full transition-transform duration-300 hover:scale-105 hover:shadow-yellow-500/20">
        <div className="relative w-full md:w-48 h-48">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority={priority}
            unoptimized
          />
        </div>
        <div className="p-6 flex-grow">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-yellow-400 font-semibold">{product.category.name}</p>
            <Link
              href={`/products/${product.slug}`}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <Eye size={16} />
            </Link>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-2">
            {product.brand} - {Object.values(product.specs || {})[0] as string}
          </p>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
            <span className="text-gray-400 text-sm">({product.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-white">${product.price.toLocaleString()}</p>
              <p className={`text-sm ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/products/${product.slug}`}
                className="bg-gray-600 text-white font-bold py-2 px-3 rounded-md hover:bg-gray-500 transition-colors text-sm"
              >
                View Details
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-105 hover:shadow-yellow-500/20">
      <div className="relative w-full h-48">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
        <Link
          href={`/products/${product.slug}`}
          className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <Eye size={16} />
        </Link>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-1">
          <p className="text-sm text-yellow-400 font-semibold">{product.category.name}</p>
          <span
            className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
          >
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 flex-grow line-clamp-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
          <span className="text-gray-400 text-xs">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-2xl font-black text-white">${product.price.toLocaleString()}</p>
          <div className="flex gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="bg-gray-600 text-white font-bold py-1 px-2 rounded-md hover:bg-gray-500 transition-colors text-xs"
            >
              View
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="bg-yellow-500 text-gray-900 font-bold py-1 px-3 rounded-md hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

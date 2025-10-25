/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

// Reusable component for a product card (consistent with homepage)
const ProductCard = ({
  slug,
  name,
  price,
  image,
  category,
}: {
  slug: string;
  name: string;
  price: string;
  image: string;
  category: string;
}) => (
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
      <div className="p-4 flex flex-col h-full">
        <p className="text-xs text-yellow-400 uppercase font-semibold">{category}</p>
        <h4 className="text-lg font-semibold text-white truncate mt-1 flex-grow">{name}</h4>
        <p className="text-white mt-2 font-bold text-xl">{price}</p>
      </div>
    </Link>
  </div>
);

// This is now a client component
export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=20`);
        if (!response.ok) throw new Error('Failed to search products');
        const data = await response.json();
        const formattedResults: SearchResult[] = data.products.map((product: any) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: `$${product.price.toLocaleString()}`,
          image: product.imageUrl,
          category: product.category,
        }));
        setSearchResults(formattedResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const hasResults = searchResults.length > 0;

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Search Results</h1>
          {query ? (
            <p className="mt-2 text-lg text-gray-400">
              Showing results for: <span className="text-yellow-400 font-semibold">"{query}"</span>
            </p>
          ) : (
            <p className="mt-2 text-lg text-gray-400">
              Please enter a search term in the navigation bar.
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar (similar to product catalog) */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Filter Results</h3>
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-200">Category</h4>
                <div className="space-y-2">
                  {['Cement', 'Concrete', 'Steel', 'Bricks', 'Wood'].map(cat => (
                    <label
                      key={cat}
                      className="flex items-center text-gray-300 hover:text-white cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 bg-gray-600 border-gray-500 rounded text-yellow-500 focus:ring-yellow-600"
                      />
                      <span className="ml-3">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-200">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="$ Min"
                    className="w-full bg-gray-700 border-gray-600 rounded-md px-2 py-1 text-sm"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="$ Max"
                    className="w-full bg-gray-700 border-gray-600 rounded-md px-2 py-1 text-sm"
                  />
                </div>
              </div>

              <button className="w-full bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors mt-6">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Search Results Grid */}
          <main className="w-full lg:w-3/4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Searching...</p>
              </div>
            ) : error ? (
              <div className="bg-red-800 p-10 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-white">Search Error</h2>
                <p className="text-gray-400 mt-2">{error}</p>
              </div>
            ) : hasResults ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {searchResults.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : query ? (
              <div className="bg-gray-800 p-10 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-white">No Results Found</h2>
                <p className="text-gray-400 mt-2">
                  We couldn't find any products matching "{query}". Try a different search term or
                  check your spelling.
                </p>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

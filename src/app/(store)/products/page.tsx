'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronDown, List, Grid, Search } from 'lucide-react';
import { useCart } from '@/lib/hooks';

// --- TYPES ---
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  brand: string;
  rating: number;
  imageUrl: string;
  spec: string;
}

interface Filters {
  search: string;
  categories: Set<string>;
  brands: Set<string>;
  minPrice: number | null;
  maxPrice: number | null;
}

// --- MOCK DATA ---
// In a real application, you would fetch this from your database.
const allProducts: Product[] = [
  {
    id: 1,
    name: 'OPC Grade 53 Cement',
    category: 'Cement',
    price: 350,
    brand: 'UltraTech',
    rating: 4.5,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Cement',
    spec: '50kg Bag',
  },
  {
    id: 2,
    name: 'TMT Steel Rebar',
    category: 'Steel',
    price: 5500,
    brand: 'TATA Tiscon',
    rating: 4.8,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Steel',
    spec: '12mm Rod',
  },
  {
    id: 3,
    name: 'Waterproofing Compound',
    category: 'Chemicals',
    price: 800,
    brand: 'Dr. Fixit',
    rating: 4.6,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Chemical',
    spec: '20L Can',
  },
  {
    id: 4,
    name: 'PPC Cement',
    category: 'Cement',
    price: 320,
    brand: 'Ambuja',
    rating: 4.4,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Cement',
    spec: '50kg Bag',
  },
  {
    id: 5,
    name: 'Fe 500D TMT Bar',
    category: 'Steel',
    price: 5800,
    brand: 'JSW Neosteel',
    rating: 4.7,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Steel',
    spec: '16mm Rod',
  },
  {
    id: 6,
    name: 'Construction Plywood',
    category: 'Lumber',
    price: 1200,
    brand: 'CenturyPly',
    rating: 4.3,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Lumber',
    spec: '18mm Sheet',
  },
  {
    id: 7,
    name: 'Ready Mix Concrete',
    category: 'Concrete',
    price: 4500,
    brand: 'ACC',
    rating: 4.9,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Concrete',
    spec: 'M25 Grade',
  },
  {
    id: 8,
    name: 'Ceramic Wall Tiles',
    category: 'Tiles',
    price: 45,
    brand: 'Kajaria',
    rating: 4.2,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Tiles',
    spec: 'per sq. ft.',
  },
  {
    id: 9,
    name: 'Plastic Emulsion Paint',
    category: 'Paint',
    price: 2500,
    brand: 'Asian Paints',
    rating: 4.8,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Paint',
    spec: '20L Bucket',
  },
  {
    id: 10,
    name: 'Teak Wood Plank',
    category: 'Lumber',
    price: 3500,
    brand: 'Generic Wood',
    rating: 4.5,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Lumber',
    spec: '8ft x 4in',
  },
  {
    id: 11,
    name: 'Adhesive Mortar',
    category: 'Chemicals',
    price: 550,
    brand: 'Weber',
    rating: 4.6,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Chemical',
    spec: '20kg Bag',
  },
];

const categories = ['All', 'Cement', 'Steel', 'Chemicals', 'Lumber', 'Concrete', 'Tiles', 'Paint'];
const brands = [
  'All',
  'UltraTech',
  'TATA Tiscon',
  'Dr. Fixit',
  'Ambuja',
  'JSW Neosteel',
  'CenturyPly',
  'ACC',
  'Kajaria',
  'Asian Paints',
];

// --- Sub-components for better organization ---

const ProductCard = ({ product, view }: { product: Product; view: string }) => {
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

  if (view === 'list') {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center w-full transition-transform duration-300 hover:scale-105 hover:shadow-yellow-500/20">
        <div className="relative w-full md:w-48 h-48">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="p-6 flex-grow">
          <p className="text-sm text-yellow-400 mb-1">{product.category}</p>
          <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-3">
            {product.brand} - {product.spec}
          </p>
          <div className="flex items-center mb-4">
            {/* Star rating component can be added here */}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-white">₹{product.price.toLocaleString()}</p>
            <button
              onClick={handleAddToCart}
              className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors"
            >
              Add to Cart
            </button>
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
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-yellow-400 mb-1">{product.category}</p>
        <h3 className="text-xl font-bold text-white mb-2 flex-grow">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{product.brand}</p>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-2xl font-black text-white">₹{product.price.toLocaleString()}</p>
          <button
            onClick={handleAddToCart}
            className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterSidebar = ({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : Number(e.target.value);
    setFilters(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleCheckboxChange = (
    type: keyof Pick<Filters, 'categories' | 'brands'>,
    value: string
  ) => {
    setFilters(prev => {
      const current = prev[type] as Set<string>;
      const newSet = new Set(current);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return { ...prev, [type]: newSet };
    });
  };

  return (
    <aside className="w-full lg:w-1/4 xl:w-1/5 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-6 border-b-2 border-yellow-500 pb-2">
        Filters
      </h3>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-bold text-lg text-white mb-3">Category</h4>
        {categories.slice(1).map(cat => (
          <div key={cat} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`cat-${cat}`}
              checked={filters.categories.has(cat)}
              onChange={() => handleCheckboxChange('categories', cat)}
              className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-600"
            />
            <label htmlFor={`cat-${cat}`} className="ml-2 text-gray-300">
              {cat}
            </label>
          </div>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-bold text-lg text-white mb-3">Brand</h4>
        {brands.slice(1).map(brand => (
          <div key={brand} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`brand-${brand}`}
              checked={filters.brands.has(brand)}
              onChange={() => handleCheckboxChange('brands', brand)}
              className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-600"
            />
            <label htmlFor={`brand-${brand}`} className="ml-2 text-gray-300">
              {brand}
            </label>
          </div>
        ))}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-bold text-lg text-white mb-3">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={handlePriceChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={handlePriceChange}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
      </div>

      <button
        onClick={() =>
          setFilters({
            search: '',
            categories: new Set(),
            brands: new Set(),
            minPrice: null,
            maxPrice: null,
          })
        }
        className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors"
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default function ProductCatalogPage() {
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [sort, setSort] = useState('popularity'); // 'popularity', 'price-asc', 'price-desc', 'name-asc'
  const [filters, setFilters] = useState<Filters>({
    search: '',
    categories: new Set<string>(),
    brands: new Set<string>(),
    minPrice: null,
    maxPrice: null,
  });

  const filteredAndSortedProducts = useMemo(() => {
    let products = allProducts;

    // Filtering logic
    products = products.filter(p => {
      const { search, categories, brands, minPrice, maxPrice } = filters;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categories.size > 0 && !categories.has(p.category)) return false;
      if (brands.size > 0 && !brands.has(p.brand)) return false;
      if (minPrice != null && p.price < minPrice) return false;
      if (maxPrice != null && p.price > maxPrice) return false;
      return true;
    });

    // Sorting logic
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
      default:
        products.sort((a, b) => b.rating - a.rating); // Assuming rating is popularity
        break;
    }

    return products;
  }, [filters, sort]);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Our Products
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Find all the construction materials you need for your next project.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <FilterSidebar filters={filters} setFilters={setFilters} />

          {/* Main Content */}
          <main className="w-full">
            {/* Toolbar: Search, Sort, View Toggle */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-auto flex-grow">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 pl-10 pr-4 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="appearance-none bg-gray-700 border border-gray-600 text-white rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-700 rounded-md">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-l-md ${view === 'grid' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:bg-gray-600'}`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded-r-md ${view === 'list' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:bg-gray-600'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Display */}
            {filteredAndSortedProducts.length > 0 ? (
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} view={view} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800 rounded-lg">
                <h3 className="text-2xl font-bold text-white">No Products Found</h3>
                <p className="text-gray-400 mt-2">
                  Try adjusting your filters to find what you&apos;re looking for.
                </p>
              </div>
            )}

            {/* Pagination would go here */}
          </main>
        </div>
      </div>
    </div>
  );
}

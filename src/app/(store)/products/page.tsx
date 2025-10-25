'use client';

import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { ChevronDown, List, Grid, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ProductCard, FilterSidebar } from '@/features/products/components';
import { Product, Category, Filters } from '@/types';
import ProductGridSkeleton from '@/components/ProductGridSkeleton';
import { Breadcrumbs, Pagination } from '@/components';

// --- Sub-components for better organization ---

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [sort, setSort] = useState('popularity'); // 'popularity', 'price-asc', 'price-desc', 'name-asc'
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // API data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [filters, setFilters] = useState<Filters>(() => {
    const categoryParam = searchParams.get('category');
    return {
      search: '',
      categories: categoryParam ? new Set([categoryParam]) : new Set<string>(),
      brands: new Set<string>(),
      minPrice: null,
      maxPrice: null,
    };
  });

  // Fetch products from API
  const fetchProducts = useCallback(
    async (page = 1, searchFilters?: Filters) => {
      const filtersToUse = searchFilters || {
        search: '',
        categories: new Set<string>(),
        brands: new Set<string>(),
        minPrice: null,
        maxPrice: null,
      };

      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: itemsPerPage.toString(),
        });

        if (filtersToUse.search) params.append('search', filtersToUse.search);
        if (filtersToUse.categories.size > 0) {
          Array.from(filtersToUse.categories).forEach(cat => params.append('category', cat));
        }
        if (filtersToUse.brands.size > 0) {
          Array.from(filtersToUse.brands).forEach(brand => params.append('brand', brand));
        }
        if (filtersToUse.minPrice != null) {
          params.append('minPrice', filtersToUse.minPrice.toString());
        }
        if (filtersToUse.maxPrice != null) {
          params.append('maxPrice', filtersToUse.maxPrice.toString());
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        setProducts(data.products || []);
        setTotalProducts(data.pagination?.total || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  // Fetch categories and brands
  const fetchCategoriesAndBrands = useCallback(async () => {
    try {
      // For now, we'll extract unique categories and brands from products
      // In a real app, you might have separate API endpoints for these
      const response = await fetch('/api/products?limit=1000'); // Get all products
      if (!response.ok) throw new Error('Failed to fetch categories and brands');

      const data = await response.json();
      const categorySlugs = Array.from(
        new Set(data.products.map((p: Product) => p.category.slug))
      ) as string[];
      const uniqueCategories = categorySlugs
        .map(
          (slug: string) => data.products.find((p: Product) => p.category.slug === slug)?.category
        )
        .filter(Boolean) as Category[];
      const uniqueBrands = Array.from(
        new Set(data.products.map((p: Product) => p.brand))
      ) as string[];

      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching categories and brands:', error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCategoriesAndBrands();
    fetchProducts(1);
  }, [fetchCategoriesAndBrands, fetchProducts]);

  // Update filters when search params change
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        categories: new Set([categoryParam]),
      }));
    }
  }, [searchParams]);

  // Refetch when filters or page change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  // Memoize categories and brands to ensure stable references
  const memoizedCategories = useMemo(() => categories, [categories]);
  const memoizedBrands = useMemo(() => brands, [brands]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Products', href: '#' },
          ]}
        />

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
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            categories={memoizedCategories}
            brands={memoizedBrands}
          />

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
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length > 0 ? (
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {products.map((product: Product) => (
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

            {/* Pagination */}
            {!isLoading && Math.ceil(totalProducts / itemsPerPage) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalProducts / itemsPerPage)}
                onPageChange={handlePageChange}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
      <ProductCatalogContent />
    </Suspense>
  );
}

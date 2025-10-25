import React from 'react';
import { Category, Filters } from '@/types';

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  categories: Category[];
  brands: string[];
}

export const FilterSidebar = ({ filters, setFilters, categories, brands }: FilterSidebarProps) => {
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
        {categories.map((cat: Category) => (
          <div key={cat.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`cat-${cat.slug}`}
              checked={filters.categories.has(cat.slug)}
              onChange={() => handleCheckboxChange('categories', cat.slug)}
              className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-600"
            />
            <label htmlFor={`cat-${cat.slug}`} className="ml-2 text-gray-300">
              {cat.name}
            </label>
          </div>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-bold text-lg text-white mb-3">Brand</h4>
        {brands.map((brand: string) => (
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

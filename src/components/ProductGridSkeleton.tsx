/**
 * A set of skeleton loaders to mimic the product grid while data is being fetched.
 * This provides a better user experience than a generic spinner.
 */

// A single card skeleton - this is a local component now.
const ProductCardSkeleton = () => (
  <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full animate-pulse">
    <div className="w-full h-48 bg-gray-700"></div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="h-6 w-3/4 bg-gray-700 rounded-md mb-4"></div>
      <div className="flex items-center justify-between mt-auto">
        <div className="h-8 w-1/3 bg-gray-700 rounded-md"></div>
        <div className="h-10 w-1/4 bg-gray-700 rounded-md"></div>
      </div>
    </div>
  </div>
);

// A grid of card skeletons, now the default export for easier importing.
// Usage: Render this component conditionally while your product data is loading.
export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

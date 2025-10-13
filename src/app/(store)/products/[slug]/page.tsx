'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Minus, Star, ShieldCheck, Truck, ZoomIn, ZoomOut } from 'lucide-react';

// --- TYPES ---
interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  brand: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  stockLevel: number; // 0 = out of stock, 1-10 = low stock, >10 = in stock
  unitOfMeasure: string; // e.g., "per bag", "per meter", "per sq.ft."
  keyFeatures: string[];
  dimensions?: string;
  material?: string;
  compliance?: string[];
}

// --- MOCK DATA ---
// This would be fetched from a database using the `params.slug`
const allProducts: Product[] = [
  {
    id: 1,
    slug: 'opc-grade-53-cement',
    name: 'OPC Grade 53 Cement',
    category: 'Cement',
    price: 350,
    brand: 'UltraTech',
    rating: 4.5,
    reviews: 120,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Cement+1',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=Cement+1',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Cement+2',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Cement+3',
    ],
    description:
      'UltraTech OPC 53 Grade is a high-strength, high-performance cement suitable for all types of construction, especially for concrete structures requiring high levels of durability and strength.',
    specs: {
      Weight: '50kg Bag',
      Standard: 'IS 269:2015',
      'Compressive Strength': '53 MPa at 28 days',
      'Best For': 'High-rise buildings, Bridges, Structural repairs',
    },
    stockLevel: 25,
    unitOfMeasure: 'per bag',
    keyFeatures: [
      'High compressive strength of 53 MPa',
      'Superior workability and finish',
      'Enhanced durability and long-term performance',
      'IS 269:2015 compliant',
      'Ideal for high-rise construction and infrastructure projects',
    ],
    dimensions: '50kg Bag',
    material: 'Portland Cement',
    compliance: ['IS 269:2015', 'BIS Certified'],
  },
  {
    id: 2,
    slug: 'tmt-steel-rebar',
    name: 'TMT Steel Rebar',
    category: 'Steel',
    price: 5500,
    brand: 'TATA Tiscon',
    rating: 4.8,
    reviews: 250,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Steel+1',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=Steel+1',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Steel+2',
    ],
    description:
      'TATA Tiscon 550SD (Super Ductile) is a new-generation rebar with advanced seismic resistance, making it ideal for construction in earthquake-prone areas.',
    specs: {
      Diameter: '12mm',
      Grade: 'Fe 550SD',
      Length: '12 meters',
      Feature: 'Superior ductility and strength',
    },
    stockLevel: 8,
    unitOfMeasure: 'per rod',
    keyFeatures: [
      'Fe 550SD grade for superior strength',
      'Advanced seismic resistance',
      'Superior ductility and bendability',
      'Corrosion resistance coating',
      '12-meter standard length for easy handling',
    ],
    dimensions: '12mm diameter × 12m length',
    material: 'Thermo-Mechanically Treated Steel',
    compliance: ['IS 1786:2008', 'Fe 550SD Grade'],
  },
  // Add more products to allow related products to be found
  {
    id: 3,
    slug: 'waterproofing-compound',
    name: 'Waterproofing Compound',
    category: 'Chemicals',
    price: 800,
    brand: 'Dr. Fixit',
    rating: 4.6,
    reviews: 85,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Chemical+1',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=Chemical+1',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Chemical+2',
    ],
    description:
      'Dr. Fixit waterproofing compound provides excellent waterproofing solutions for concrete and masonry structures.',
    specs: {
      Volume: '20L Can',
      Type: 'Crystalline Waterproofing',
      Coverage: '1-2 sq.m per liter',
      Application: 'Brush/Roller',
    },
    stockLevel: 15,
    unitOfMeasure: 'per can',
    keyFeatures: [
      'Crystalline waterproofing technology',
      'Penetrates deep into concrete pores',
      'Self-healing properties',
      'Resistant to positive and negative water pressure',
      'Easy application with brush or roller',
    ],
    dimensions: '20L Can',
    material: 'Crystalline Waterproofing Compound',
    compliance: ['BIS Standards', 'Waterproofing Standards'],
  },
  {
    id: 4,
    slug: 'construction-plywood',
    name: 'Construction Plywood',
    category: 'Lumber',
    price: 1200,
    brand: 'CenturyPly',
    rating: 4.3,
    reviews: 95,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Lumber+1',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=Lumber+1',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Lumber+2',
    ],
    description:
      'CenturyPly construction plywood is engineered for superior strength and durability in construction applications.',
    specs: {
      Thickness: '18mm',
      Size: '8ft x 4ft',
      Grade: 'BWP Grade',
      Usage: 'Formwork, Shuttering',
    },
    stockLevel: 0,
    unitOfMeasure: 'per sheet',
    keyFeatures: [
      'BWP grade for construction use',
      'Superior strength and durability',
      'Boiling water proof treatment',
      'Uniform thickness and smooth finish',
      'Ideal for formwork and shuttering',
    ],
    dimensions: '2440mm × 1220mm × 18mm',
    material: 'Hardwood Veneers',
    compliance: ['IS 303:1989', 'BWP Grade Standards'],
  },
];

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => (
  <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-105 hover:shadow-yellow-500/20">
    <div className="relative w-full h-48">
      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-lg font-bold text-white mb-2 flex-grow">{product.name}</h3>
      <div className="flex items-center justify-between mt-auto">
        <p className="text-xl font-black text-white">₹{product.price.toLocaleString()}</p>
        <a
          href={`/products/${product.slug}`}
          className="bg-yellow-500 text-gray-900 font-bold py-2 px-3 rounded-md hover:bg-yellow-400 text-sm transition-colors"
        >
          View
        </a>
      </div>
    </div>
  </div>
);

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const slug = params?.slug;
    if (slug) {
      const foundProduct = allProducts.find(p => p.slug === slug);
      if (foundProduct) {
        setProduct(foundProduct);
        setMainImage(foundProduct.imageUrl);
      }
    }
  }, [params?.slug]);

  if (!product) {
    return <div className="text-center py-20 bg-gray-900 text-white">Loading product...</div>;
  }

  // Find related products (same category, different product)
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleQuantity = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const getStockStatus = (stockLevel: number) => {
    if (stockLevel === 0) {
      return {
        text: 'Out of Stock',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
      };
    }

    if (stockLevel <= 10) {
      return {
        text: 'Low Stock',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
      };
    }

    return {
      text: 'In Stock',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    };
  };

  const stockStatus = getStockStatus(product.stockLevel);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image Gallery with Zoom */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg relative group cursor-pointer">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-300 ease-in-out ${
                  isZoomed ? 'scale-150' : 'hover:scale-110'
                }`}
                unoptimized
                onClick={() => setIsZoomed(!isZoomed)}
              />
              <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </div>
              {isZoomed && (
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  Click to zoom out
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMainImage(img);
                    setIsZoomed(false);
                  }}
                  className={`aspect-square bg-gray-800 rounded-md overflow-hidden transition-all duration-200 relative ${
                    mainImage === img ? 'ring-2 ring-yellow-500' : 'hover:opacity-75'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details & Actions */}
          <div>
            <p className="text-yellow-400 font-semibold mb-2">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
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
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Stock Status */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${stockStatus.bgColor}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${stockStatus.color.replace('text-', 'bg-')}`}
              ></div>
              <span className={stockStatus.color}>{stockStatus.text}</span>
              {product.stockLevel > 0 && (
                <span className="text-gray-400">({product.stockLevel} available)</span>
              )}
            </div>

            {/* Pricing with Unit of Measure */}
            <div className="mb-6">
              <p className="text-4xl font-black text-white mb-1">
                ₹{product.price.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm">{product.unitOfMeasure}</p>
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-600 rounded-md">
                <button
                  onClick={() => handleQuantity(-1)}
                  className="px-4 py-3 hover:bg-gray-700 transition-colors rounded-l-md"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 py-2 text-lg font-bold">{quantity}</span>
                <button
                  onClick={() => handleQuantity(1)}
                  className="px-4 py-3 hover:bg-gray-700 transition-colors rounded-r-md"
                  disabled={product.stockLevel === 0}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                className="flex-grow bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-md text-lg hover:bg-yellow-400 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stockLevel === 0}
              >
                {product.stockLevel === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Trust Indicators */}
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
          </div>
        </div>

        {/* Key Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-white mb-8 border-l-4 border-yellow-500 pl-4">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 bg-gray-800 p-4 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description, Specs, Reviews Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-lg ${
                  activeTab === 'description'
                    ? 'border-yellow-500 text-yellow-500'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-4 px-1 border-b-2 font-medium text-lg ${
                  activeTab === 'specs'
                    ? 'border-yellow-500 text-yellow-500'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                Technical Specifications
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Specifications */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Product Specifications</h3>
                    <ul className="space-y-3">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <li
                          key={key}
                          className="flex justify-between border-b border-gray-700 pb-2"
                        >
                          <span className="font-semibold text-gray-400">{key}:</span>
                          <span className="text-white">{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Additional Information</h3>
                    <ul className="space-y-3">
                      {product.dimensions && (
                        <li className="flex justify-between border-b border-gray-700 pb-2">
                          <span className="font-semibold text-gray-400">Dimensions:</span>
                          <span className="text-white">{product.dimensions}</span>
                        </li>
                      )}
                      {product.material && (
                        <li className="flex justify-between border-b border-gray-700 pb-2">
                          <span className="font-semibold text-gray-400">Material:</span>
                          <span className="text-white">{product.material}</span>
                        </li>
                      )}
                      {product.compliance && product.compliance.length > 0 && (
                        <li className="border-b border-gray-700 pb-2">
                          <span className="font-semibold text-gray-400 block mb-2">
                            Compliance Standards:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {product.compliance.map((standard, index) => (
                              <span
                                key={index}
                                className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm"
                              >
                                {standard}
                              </span>
                            ))}
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products / Customers Also Bought */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
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

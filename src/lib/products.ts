// Shared product data and types for the entire application

export interface Product {
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
  inStock: boolean;
}

// Unified product data - used across all pages
export const allProducts: Product[] = [
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
      'https://placehold.co/600x600/1a202c/ecc94b?text=Cement+4',
    ],
    description:
      'UltraTech OPC 53 Grade is a high-strength, high-performance cement suitable for all types of construction, especially for concrete structures requiring high levels of durability and strength.',
    specs: {
      Weight: '50kg Bag',
      Standard: 'IS 269:2015',
      'Compressive Strength': '53 MPa at 28 days',
      'Best For': 'High-rise buildings, Bridges, Structural repairs',
    },
    inStock: true,
  },
  {
    id: 2,
    slug: 'tmt-steel-rebar',
    name: 'TMT Steel Rebar',
    category: 'Steel',
    price: 75000,
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
      Unit: 'Tonne',
      Feature: 'Superior ductility and strength',
    },
    inStock: true,
  },
  {
    id: 3,
    slug: 'waterproof-plywood',
    name: 'Waterproof Plywood',
    category: 'Lumber',
    price: 2400,
    brand: 'CenturyPly',
    rating: 4.7,
    reviews: 180,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Lumber+1',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=Lumber+1',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Lumber+2',
    ],
    description:
      'CenturyPly Architect Ply is a premium quality, boiling water proof grade plywood, that is ideal for high-end furniture and cabinetry.',
    specs: {
      Thickness: '19mm',
      Size: '8ft x 4ft',
      Grade: 'BWP (Boiling Water Proof)',
      Warranty: 'Lifetime',
    },
    inStock: true,
  },
  {
    id: 4,
    slug: 'apex-ultima-protek',
    name: 'Apex Ultima Protek',
    category: 'Paints',
    price: 3200,
    brand: 'Asian Paints',
    rating: 4.9,
    reviews: 310,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Paint+1',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=Paint+1',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Paint+2',
    ],
    description:
      'A durable, all-weather exterior emulsion paint which provides excellent protection against extreme weather conditions.',
    specs: {
      Volume: '4 Litres',
      Finish: 'Satin',
      Use: 'Exterior Walls',
      Feature: 'Crack-bridging & waterproofing',
    },
    inStock: true,
  },
  {
    id: 5,
    slug: 'fe-500d-tmt-bar',
    name: 'Fe 500D TMT Bar',
    category: 'Steel',
    price: 5800,
    brand: 'JSW Neosteel',
    rating: 4.7,
    reviews: 180,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Steel',
    images: ['https://placehold.co/400x400/1a202c/ecc94b?text=Steel'],
    description:
      'JSW Neosteel Fe 500D TMT bars offer superior strength and ductility for construction.',
    specs: {
      Diameter: '16mm',
      Grade: 'Fe 500D',
      Unit: 'Rod',
      Feature: 'High strength and ductility',
    },
    inStock: true,
  },
  {
    id: 6,
    slug: 'construction-plywood',
    name: 'Construction Plywood',
    category: 'Lumber',
    price: 1200,
    brand: 'CenturyPly',
    rating: 4.3,
    reviews: 75,
    imageUrl: 'https://placehold.co/400x400/1a202c/ecc94b?text=Lumber',
    images: ['https://placehold.co/400x400/1a202c/ecc94b?text=Lumber'],
    description:
      'CenturyPly construction plywood is engineered for superior strength and durability.',
    specs: {
      Thickness: '18mm',
      Size: '8ft x 4ft',
      Grade: 'MR Grade',
      Warranty: '5 Years',
    },
    inStock: true,
  },
  {
    id: 7,
    slug: 'ready-mix-concrete',
    name: 'Ready Mix Concrete',
    category: 'Concrete',
    price: 4500,
    brand: 'ACC',
    rating: 4.9,
    reviews: 200,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Concrete',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=Concrete',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Concrete+2',
    ],
    description:
      'ACC Ready Mix Concrete M25 Grade provides consistent quality and strength for all your construction needs. Delivered fresh and ready to use, ensuring optimal performance and durability.',
    specs: {
      Grade: 'M25',
      'Compressive Strength': '25 MPa at 28 days',
      Slump: '75-100mm',
      'Best For': 'Foundations, Columns, Beams',
      Delivery: 'On-site mixing and delivery available',
    },
    inStock: true,
  },
];

// Helper functions for product data
export const getProductBySlug = (slug: string): Product | undefined => {
  return allProducts.find(product => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return allProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

export const getCategories = (): string[] => {
  return [...new Set(allProducts.map(product => product.category))];
};

export const getBrands = (): string[] => {
  return [...new Set(allProducts.map(product => product.brand))];
};

export const getFeaturedProducts = (limit: number = 4): Product[] => {
  return allProducts.slice(0, limit);
};

export const getBestSellers = (limit: number = 4): Product[] => {
  return [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, limit);
};

export const getNewArrivals = (limit: number = 4): Product[] => {
  return [...allProducts]
    .sort((a, b) => b.id - a.id) // Assuming higher ID = newer
    .slice(0, limit);
};

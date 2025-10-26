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
  {
    id: 8,
    slug: 'ppc-cement-grade-43',
    name: 'PPC Cement Grade 43',
    category: 'Cement',
    price: 320,
    brand: 'UltraTech',
    rating: 4.4,
    reviews: 95,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=PPC+Cement',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=PPC+Cement',
      'https://placehold.co/600x600/1a202c/ecc94b?text=PPC+Cement+2',
    ],
    description:
      'UltraTech PPC (Portland Pozzolana Cement) is ideal for general construction work, providing excellent workability and durability in various weather conditions.',
    specs: {
      Weight: '50kg Bag',
      Standard: 'IS 1489 (Part 1):2015',
      'Compressive Strength': '43 MPa at 28 days',
      'Best For': 'General construction, Plastering, Masonry work',
    },
    inStock: true,
  },
  {
    id: 9,
    slug: 'white-cement',
    name: 'White Cement',
    category: 'Cement',
    price: 450,
    brand: 'JK White',
    rating: 4.6,
    reviews: 140,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=White+Cement',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=White+Cement',
      'https://placehold.co/600x600/1a202c/ecc94b?text=White+Cement+2',
    ],
    description:
      'JK White Cement is specially designed for architectural applications requiring bright and aesthetic finishes. Perfect for decorative concrete, tile grouting, and artistic work.',
    specs: {
      Weight: '50kg Bag',
      Standard: 'IS 8042:2015',
      'Compressive Strength': '33 MPa at 28 days',
      'Best For': 'Decorative work, Tile fixing, Artistic applications',
      Whiteness: '85% minimum',
    },
    inStock: true,
  },
  {
    id: 10,
    slug: 'quick-setting-cement',
    name: 'Quick Setting Cement',
    category: 'Cement',
    price: 380,
    brand: 'ACC',
    rating: 4.3,
    reviews: 85,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Quick+Setting+Cement',
    images: ['https://placehold.co/600x600/1a202c/ecc94b?text=Quick+Setting+Cement'],
    description:
      'ACC Quick Setting Cement sets faster than ordinary cement, making it ideal for emergency repairs, underwater construction, and cold weather applications.',
    specs: {
      Weight: '50kg Bag',
      'Setting Time': 'Initial: 5-10 mins, Final: 30 mins',
      'Compressive Strength': '16 MPa at 1 day',
      'Best For': 'Emergency repairs, Underwater work, Cold weather',
    },
    inStock: true,
  },
  {
    id: 11,
    slug: 'tmt-steel-rebar-8mm',
    name: 'TMT Steel Rebar 8mm',
    category: 'Steel',
    price: 52000,
    brand: 'TATA Tiscon',
    rating: 4.6,
    reviews: 180,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Steel+8mm',
    images: ['https://placehold.co/600x600/1a202c/ecc94b?text=Steel+8mm'],
    description:
      'TATA Tiscon 8mm TMT bars are perfect for light construction work, slab reinforcement, and small structural elements.',
    specs: {
      Diameter: '8mm',
      Grade: 'Fe 500',
      Unit: 'Tonne',
      Feature: 'High tensile strength and corrosion resistance',
    },
    inStock: true,
  },
  {
    id: 12,
    slug: 'tmt-steel-rebar-20mm',
    name: 'TMT Steel Rebar 20mm',
    category: 'Steel',
    price: 78000,
    brand: 'JSW Neosteel',
    rating: 4.8,
    reviews: 220,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Steel+20mm',
    images: ['https://placehold.co/600x600/1a202c/ecc94b?text=Steel+20mm'],
    description:
      'JSW Neosteel 20mm TMT bars provide superior strength for heavy construction work, columns, and major structural elements.',
    specs: {
      Diameter: '20mm',
      Grade: 'Fe 550D',
      Unit: 'Tonne',
      Feature: 'Superior ductility and earthquake resistance',
    },
    inStock: true,
  },
  {
    id: 13,
    slug: 'mild-steel-angle',
    name: 'Mild Steel Angle 50x50x6mm',
    category: 'Steel',
    price: 65000,
    brand: 'TATA Steel',
    rating: 4.5,
    reviews: 95,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Steel+Angle',
    images: ['https://placehold.co/600x600/1a202c/ecc94b?text=Steel+Angle'],
    description:
      'TATA Steel MS Angle is widely used in construction for structural support, frames, and reinforcement work.',
    specs: {
      Size: '50x50x6mm',
      Length: '6 meters',
      Grade: 'IS 2062 E250',
      Unit: 'Tonne',
      Feature: 'High strength and weldability',
    },
    inStock: true,
  },
  {
    id: 14,
    slug: 'marine-plywood',
    name: 'Marine Plywood',
    category: 'Lumber',
    price: 3500,
    brand: 'CenturyPly',
    rating: 4.8,
    reviews: 160,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Marine+Plywood',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=Marine+Plywood',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Marine+Plywood+2',
    ],
    description:
      'CenturyPly Marine Ply is specially treated plywood that can withstand water exposure, making it ideal for boat building, furniture, and humid environments.',
    specs: {
      Thickness: '12mm',
      Size: '8ft x 4ft',
      Grade: 'Marine Grade',
      Warranty: 'Lifetime against borer and termite attack',
    },
    inStock: true,
  },
  {
    id: 15,
    slug: 'teak-wood-planks',
    name: 'Teak Wood Planks',
    category: 'Lumber',
    price: 8500,
    brand: 'Natural Woods',
    rating: 4.9,
    reviews: 75,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Teak+Wood',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=Teak+Wood',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Teak+Wood+2',
    ],
    description:
      'Premium teak wood planks known for their natural oil content, durability, and beautiful grain pattern. Perfect for high-end furniture and outdoor applications.',
    specs: {
      Thickness: '25mm',
      Width: '150mm',
      Length: '8ft',
      Type: 'Burmese Teak',
      Feature: 'Natural resistance to decay and insects',
    },
    inStock: true,
  },
  {
    id: 16,
    slug: 'interior-emulsion-paint',
    name: 'Interior Emulsion Paint',
    category: 'Paints',
    price: 2800,
    brand: 'Asian Paints',
    rating: 4.7,
    reviews: 290,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Interior+Paint',
    images: [
      'https://placehold.co/600x600/1a202c/ecc94b?text=Interior+Paint',
      'https://placehold.co/600x600/1a202c/ecc94b?text=Interior+Paint+2',
    ],
    description:
      'Asian Paints Royale Interior Emulsion provides a smooth, washable finish with excellent coverage and durability for interior walls.',
    specs: {
      Volume: '4 Litres',
      Finish: 'Matt',
      Coverage: '120-140 sq ft per litre',
      Drying: '2-4 hours',
      Feature: 'Washable and stain resistant',
    },
    inStock: true,
  },
  {
    id: 17,
    slug: 'waterproofing-coating',
    name: 'Waterproofing Coating',
    category: 'Paints',
    price: 4200,
    brand: 'Dr. Fixit',
    rating: 4.8,
    reviews: 180,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Waterproofing',
    images: ['https://placehold.co/600x600/1a202c/ecc94b?text=Waterproofing'],
    description:
      'Dr. Fixit Waterproofing Coating provides complete waterproofing solution for roofs, terraces, and wet areas. Forms a flexible, durable membrane.',
    specs: {
      Volume: '4 Litres',
      Type: 'Polymer modified cementitious coating',
      Coverage: '2-2.5 sq m per litre (2 coats)',
      Feature: 'Crack bridging up to 2mm',
      Warranty: '5 years',
    },
    inStock: true,
  },
  {
    id: 18,
    slug: 'concrete-blocks-6inch',
    name: 'Concrete Solid Blocks 6"',
    category: 'Concrete',
    price: 45,
    brand: 'Local Manufacturer',
    rating: 4.4,
    reviews: 320,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Concrete+Blocks',
    images: ['https://placehold.co/600x600/1a202c/ecc94b?text=Concrete+Blocks'],
    description:
      'High-quality concrete solid blocks for wall construction. Standard 6-inch blocks suitable for load-bearing and partition walls.',
    specs: {
      Size: '16" x 8" x 6"',
      Weight: '18-20 kg',
      Strength: '5 MPa minimum',
      'Best For': 'Wall construction, Boundary walls',
      Quantity: 'Per piece',
    },
    inStock: true,
  },
  {
    id: 19,
    slug: 'ready-mix-concrete-m30',
    name: 'Ready Mix Concrete M30',
    category: 'Concrete',
    price: 5200,
    brand: 'ACC',
    rating: 4.9,
    reviews: 150,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=RMC+M30',
    images: ['https://placehold.co/600x600/1a202c/ecc94b?text=RMC+M30'],
    description:
      'ACC Ready Mix Concrete M30 Grade provides higher strength concrete suitable for high-rise buildings, bridges, and heavy structural work.',
    specs: {
      Grade: 'M30',
      'Compressive Strength': '30 MPa at 28 days',
      Slump: '75-100mm',
      'Best For': 'High-rise buildings, Bridges, Heavy structures',
      Delivery: 'On-site mixing and delivery available',
    },
    inStock: true,
  },
  {
    id: 20,
    slug: 'construction-sand',
    name: 'Construction Sand',
    category: 'Concrete',
    price: 1200,
    brand: 'River Sand',
    rating: 4.2,
    reviews: 95,
    imageUrl: 'https://placehold.co/600x600/1a202c/ecc94b?text=Sand',
    images: ['https://placehold.co/600x600/1a202c/ecc94b?text=Sand'],
    description:
      'High-quality river sand suitable for construction work, concrete mixing, and plastering. Washed and graded for optimal performance.',
    specs: {
      Type: 'River Sand',
      Grading: 'Zone II (as per IS 383)',
      Unit: 'Cubic meter',
      Moisture: 'Less than 5%',
      'Best For': 'Concrete, Plastering, Masonry work',
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

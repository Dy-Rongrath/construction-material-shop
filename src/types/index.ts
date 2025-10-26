// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Product Types
export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  brand: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  images: string[];
  specs?: Record<string, unknown>;
  inStock: boolean;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface CartState {
  id?: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

// Order Types
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  login?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface CheckoutForm {
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'name' | 'price' | 'rating' | 'newest';
  order?: 'asc' | 'desc';
}

export interface Filters {
  search: string;
  categories: Set<string>;
  brands: Set<string>;
  minPrice: number | null;
  maxPrice: number | null;
}

// Component Props Types
export interface ComponentWithChildren {
  children: React.ReactNode;
}

export interface ComponentWithClassName {
  className?: string;
}

export interface IconProps {
  path: string;
  className?: string;
}

export interface InfoCardProps {
  title: string;
  iconPath: string;
  children: React.ReactNode;
}

export interface FaqItemProps {
  question: string;
  answer: string;
}

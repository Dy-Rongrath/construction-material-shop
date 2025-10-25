// App Constants
export const APP_CONFIG = {
  name: 'Construction Material Shop',
  description: 'Your trusted source for high-quality construction materials',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
} as const;

// API Constants
export const API_ROUTES = {
  products: '/api/products',
  orders: '/api/orders',
  cart: '/api/cart',
  auth: {
    github: '/api/auth/github',
    callback: '/api/auth/github/callback',
  },
} as const;

// Pagination Constants
export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 100,
} as const;

// Product Constants
export const PRODUCT_SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price', label: 'Price (Low to High)' },
  { value: '-price', label: 'Price (High to Low)' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
] as const;

export const PRODUCT_CATEGORIES = [
  { slug: 'cement', name: 'Cement', icon: '🏗️' },
  { slug: 'steel', name: 'Steel', icon: '🔧' },
  { slug: 'lumber', name: 'Lumber', icon: '🌲' },
  { slug: 'paints', name: 'Paints', icon: '🎨' },
] as const;

// Order Status Constants
export const ORDER_STATUS = {
  pending: 'pending',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
} as const;

// Cart Constants
export const CART_ACTIONS = {
  addItem: 'ADD_ITEM',
  removeItem: 'REMOVE_ITEM',
  updateQuantity: 'UPDATE_QUANTITY',
  clearCart: 'CLEAR_CART',
  setLoading: 'SET_LOADING',
  setError: 'SET_ERROR',
  setCart: 'SET_CART',
} as const;

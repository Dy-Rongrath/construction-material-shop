import { apiService } from '@/services/api';
import { ProductFilters } from '@/types';

/**
 * Products API service functions
 */
export const productsApi = {
  /**
   * Get all products with optional filtering and pagination
   */
  async getProducts(filters?: ProductFilters) {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    return apiService.get(endpoint);
  },

  /**
   * Get a single product by slug
   */
  async getProduct(slug: string) {
    return apiService.get(`/products/${slug}`);
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(categorySlug: string) {
    return apiService.get(`/products?category=${categorySlug}`);
  },

  /**
   * Search products
   */
  async searchProducts(query: string) {
    return apiService.get(`/products?search=${encodeURIComponent(query)}`);
  },
};

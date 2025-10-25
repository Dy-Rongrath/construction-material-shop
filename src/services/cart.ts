import { apiService } from './api';
import { CartState, CartItem, ApiResponse } from '@/types';

/**
 * Cart service for managing shopping cart operations
 */
export class CartService {
  /**
   * Get user's cart
   */
  async getCart(userId: string): Promise<ApiResponse<CartState>> {
    return apiService.get<CartState>(`/cart?userId=${userId}`);
  }

  /**
   * Add item to cart
   */
  async addToCart(
    userId: string,
    productId: string,
    quantity: number = 1
  ): Promise<ApiResponse<CartState>> {
    return apiService.post<CartState>('/cart', { userId, productId, quantity });
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ApiResponse<CartState>> {
    return apiService.put<CartState>('/cart', { userId, productId, quantity });
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId: string, productId?: string): Promise<ApiResponse<CartState>> {
    const queryParams = productId
      ? `?userId=${userId}&productId=${productId}`
      : `?userId=${userId}`;
    return apiService.delete<CartState>(`/cart${queryParams}`);
  }

  /**
   * Clear entire cart
   */
  async clearCart(userId: string): Promise<ApiResponse<CartState>> {
    return this.removeFromCart(userId);
  }

  /**
   * Merge guest cart with user cart (for when user logs in)
   */
  async mergeCart(userId: string, guestCartItems: CartItem[]): Promise<ApiResponse<CartState>> {
    return apiService.post<CartState>('/cart/merge', { userId, guestCartItems });
  }
}

export const cartService = new CartService();

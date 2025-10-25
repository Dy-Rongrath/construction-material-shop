import { apiService } from './api';
import { Order, ApiResponse } from '@/types';

/**
 * Orders service for managing order operations
 */
export class OrdersService {
  /**
   * Get orders for a user with pagination
   */
  async getOrders(
    userId?: string,
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<
    ApiResponse<{
      orders: Order[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>
  > {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return apiService.get<{
      orders: Order[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/orders?${params.toString()}`);
  }

  /**
   * Get a specific order by ID
   */
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiService.get<Order>(`/orders/${orderId}`);
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: {
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: string;
    paymentMethod: string;
  }): Promise<ApiResponse<Order>> {
    return apiService.post<Order>('/orders', orderData);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<Order>> {
    return apiService.put<Order>(`/orders/${orderId}`, { status });
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiService.put<Order>(`/orders/${orderId}`, { status: 'cancelled' });
  }

  /**
   * Get order statistics for a user
   */
  async getOrderStats(userId: string): Promise<
    ApiResponse<{
      totalOrders: number;
      totalSpent: number;
      pendingOrders: number;
      completedOrders: number;
    }>
  > {
    return apiService.get<{
      totalOrders: number;
      totalSpent: number;
      pendingOrders: number;
      completedOrders: number;
    }>(`/orders/stats?userId=${userId}`);
  }
}

export const ordersService = new OrdersService();

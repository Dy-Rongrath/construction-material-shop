import toast from 'react-hot-toast';
import { ApiResponse } from '@/types';

/**
 * Utility functions for handling API responses and user notifications
 */

export function handleApiError<T>(response: ApiResponse<T>, customMessage?: string): T | null {
  if (response.error) {
    const message = customMessage || response.error;
    toast.error(message);
    return null;
  }
  return response.data || null;
}

export function showSuccessToast(message: string) {
  toast.success(message);
}

export function showErrorToast(message: string) {
  toast.error(message);
}

export function showInfoToast(message: string) {
  toast(message, {
    style: {
      background: '#3b82f6',
      color: '#ffffff',
      border: '1px solid #2563eb',
    },
  });
}

export function showLoadingToast(message: string) {
  return toast.loading(message);
}

export function dismissToast(toastId: string) {
  toast.dismiss(toastId);
}

/**
 * Enhanced error handler for React Query mutations
 * @param error - The error from the mutation
 * @param customMessage - Optional custom error message
 */
export function handleMutationError(error: unknown, customMessage?: string) {
  let message = customMessage || 'An unexpected error occurred';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  showErrorToast(message);
}

/**
 * Success handler for React Query mutations
 * @param message - Success message to display
 */
export function handleMutationSuccess(message: string) {
  showSuccessToast(message);
}

/**
 * Generic async operation wrapper with toast notifications
 * @param operation - The async operation to perform
 * @param options - Toast options
 * @returns Promise with the operation result
 */
export async function withToast<T>(
  operation: () => Promise<T>,
  options: {
    loading?: string;
    success?: string;
    error?: string;
  } = {}
): Promise<T | null> {
  const { loading, success, error } = options;

  let toastId: string | undefined;

  if (loading) {
    toastId = showLoadingToast(loading);
  }

  try {
    const result = await operation();

    if (toastId) {
      toast.dismiss(toastId);
    }

    if (success) {
      showSuccessToast(success);
    }

    return result;
  } catch (err) {
    if (toastId) {
      toast.dismiss(toastId);
    }

    handleMutationError(err, error);
    return null;
  }
}

// Error message helpers
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  CART_EMPTY: 'Your cart is empty.',
  PRODUCT_OUT_OF_STOCK: 'This product is currently out of stock.',
  INSUFFICIENT_STOCK: 'Not enough stock available.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  ORDER_FAILED: 'Failed to place order. Please try again.',
} as const;

// Success message helpers
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED_TO_CART: 'Product added to cart!',
  CART_UPDATED: 'Cart updated successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  LOGIN_SUCCESS: 'Logged in successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
} as const;

import { ApiResponse } from '@/types';
import { showErrorToast, showSuccessToast, ERROR_MESSAGES } from '@/utils/notifications';

/**
 * Generic API service functions with automatic error handling
 */
class ApiService {
  private baseUrl = '/api';

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = this.getErrorMessage(response.status, data.error);
        showErrorToast(errorMessage);
        return { error: errorMessage };
      }

      return { data };
    } catch {
      const errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      showErrorToast(errorMessage);
      return { error: errorMessage };
    }
  }

  private getErrorMessage(status: number, apiError?: string): string {
    switch (status) {
      case 400:
        return apiError || ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return apiError || 'An unexpected error occurred';
    }
  }

  async get<T>(endpoint: string, showError = true): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);

      if (showError) {
        return await this.handleResponse<T>(response);
      }

      // Return raw response without error handling
      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'An error occurred' };
      }
      return { data };
    } catch {
      const errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      if (showError) {
        showErrorToast(errorMessage);
      }
      return { error: errorMessage };
    }
  }

  async post<T>(
    endpoint: string,
    body: unknown,
    options?: { showError?: boolean; successMessage?: string }
  ): Promise<ApiResponse<T>> {
    const { showError = true, successMessage } = options || {};

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await this.handleResponse<T>(response);

      if (successMessage && !result.error) {
        showSuccessToast(successMessage);
      }

      return result;
    } catch {
      const errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      if (showError) {
        showErrorToast(errorMessage);
      }
      return { error: errorMessage };
    }
  }

  async put<T>(
    endpoint: string,
    body: unknown,
    options?: { showError?: boolean; successMessage?: string }
  ): Promise<ApiResponse<T>> {
    const { showError = true, successMessage } = options || {};

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await this.handleResponse<T>(response);

      if (successMessage && !result.error) {
        showSuccessToast(successMessage);
      }

      return result;
    } catch {
      const errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      if (showError) {
        showErrorToast(errorMessage);
      }
      return { error: errorMessage };
    }
  }

  async delete<T>(
    endpoint: string,
    options?: { showError?: boolean; successMessage?: string }
  ): Promise<ApiResponse<T>> {
    const { showError = true, successMessage } = options || {};

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
      });

      const result = await this.handleResponse<T>(response);

      if (successMessage && !result.error) {
        showSuccessToast(successMessage);
      }

      return result;
    } catch {
      const errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      if (showError) {
        showErrorToast(errorMessage);
      }
      return { error: errorMessage };
    }
  }
}

export const apiService = new ApiService();

import { apiService } from './api';
import { User, ApiResponse } from '@/types';

/**
 * Auth service for managing authentication operations
 */
export class AuthService {
  /**
   * Initiate GitHub OAuth login
   */
  async loginWithGitHub(): Promise<void> {
    window.location.href = '/api/auth/github';
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    // Clear client-side auth state
    document.cookie =
      'construction_material_shop_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Call logout API if it exists
    return apiService.post('/auth/logout', {});
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get<User>('/auth/me');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(cookie =>
      cookie.trim().startsWith('construction_material_shop_user=')
    );
    return !!userCookie;
  }

  /**
   * Get user from cookie
   */
  getUserFromCookie(): User | null {
    try {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(cookie =>
        cookie.trim().startsWith('construction_material_shop_user=')
      );

      if (userCookie) {
        const userData = userCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(userData));
      }
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
    return null;
  }

  /**
   * Refresh user session
   */
  async refreshSession(): Promise<ApiResponse<User>> {
    return apiService.post<User>('/auth/refresh', {});
  }

  /**
   * Validate authentication token
   */
  async validateToken(): Promise<ApiResponse<{ valid: boolean }>> {
    return apiService.get('/auth/validate');
  }
}

export const authService = new AuthService();

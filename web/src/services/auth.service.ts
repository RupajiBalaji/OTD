import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResult,
  AuthSuccessData,
  ApiResponse,
} from './auth.types';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
).replace(/\/+$/, '');

/**
 * Authentication service handling HTTP communications with the backend.
 * Kept strictly decoupled from UI presentation components.
 */
export const authService = {
  /**
   * Submit user login credentials to POST /api/v1/auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResult<AuthSuccessData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });

      const responseData: ApiResponse<AuthSuccessData> = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText || 'Unexpected server response',
        success: false,
      }));

      if (!response.ok || !responseData.success) {
        return {
          success: false,
          error: responseData.message || `Login failed with status ${response.status}`,
        };
      }

      return {
        success: true,
        data: responseData.data,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Network connection failure';
      return {
        success: false,
        error: `Authentication server unreachable (${API_BASE_URL}). Backend service may be offline: ${message}`,
        isNetworkError: true,
      };
    }
  },

  /**
   * Submit registration data to POST /api/v1/auth/register
   */
  async register(credentials: RegisterCredentials): Promise<AuthResult<AuthSuccessData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: credentials.name.trim(),
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });

      const responseData: ApiResponse<AuthSuccessData> = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText || 'Unexpected server response',
        success: false,
      }));

      if (!response.ok || !responseData.success) {
        return {
          success: false,
          error: responseData.message || `Registration failed with status ${response.status}`,
        };
      }

      return {
        success: true,
        data: responseData.data,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Network connection failure';
      return {
        success: false,
        error: `Authentication server unreachable (${API_BASE_URL}). Backend service may be offline: ${message}`,
        isNetworkError: true,
      };
    }
  },

  /**
   * Request password reset instructions.
   * Clearly surfaces pending backend integration status without false claims.
   */
  async requestPasswordReset(identifier: string): Promise<AuthResult> {
    // If backend forgot-password endpoint is not yet deployed:
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      if (response.status === 404) {
        return {
          success: false,
          error: 'Password recovery endpoint (POST /api/v1/auth/forgot-password) is not yet available on the backend server.',
        };
      }

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return {
          success: false,
          error: data?.message || 'Password reset request failed.',
        };
      }

      return {
        success: true,
        data,
      };
    } catch {
      return {
        success: false,
        error: 'Password recovery endpoint is currently unavailable (backend service is unconfirmed).',
        isNetworkError: true,
      };
    }
  },
};

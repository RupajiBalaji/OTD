/**
 * Authentication type definitions for OTD Web.
 * Maps to backend endpoints POST /api/v1/auth/login and POST /api/v1/auth/register.
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthSuccessData {
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  data?: T;
  message: string;
  success: boolean;
}

export interface AuthResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  isNetworkError?: boolean;
}

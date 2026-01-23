import type { Tenant } from './tenant';

// ==========================================
// AUTH TYPES
// ==========================================

/**
 * Login request payload
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterInput {
  slug: string;
  name: string;
  category: string;
  email: string;
  password: string;
  whatsapp: string;
  description?: string;
  phone?: string;
  address?: string;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  message: string;
  access_token: string;
  tenant: Tenant;
}

/**
 * JWT Payload input (for signing)
 */
export interface JwtPayloadInput {
  sub: string; // tenant id
  email: string;
  slug: string;
}

/**
 * JWT Payload (decoded token - includes iat and exp from JWT)
 */
export interface JwtPayload extends JwtPayloadInput {
  iat: number;
  exp: number;
}

/**
 * Change password request
 */
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

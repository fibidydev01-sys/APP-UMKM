// ==========================================
// API INDEX
// ==========================================

// Client-side API
export { api, ApiRequestError, isApiError, getErrorMessage } from './client';
export type { RequestConfig } from './client';

// Server-side API


// API Services
export { authApi } from './auth';
export { tenantsApi } from './tenants';
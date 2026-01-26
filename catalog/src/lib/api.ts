// ==========================================
// CATALOG LOCAL API
// Single source of truth - reads ENV at runtime
// ==========================================

import type { PublicTenant, Product } from '@umkm/shared/types';

/**
 * API base URL - read from ENV at RUNTIME (not bundled!)
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// 🔥 DEBUG: Log API_URL at module load
console.log('[CATALOG API] API_URL:', API_URL);

// ==========================================
// RESPONSE TYPES
// ==========================================

interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

// ==========================================
// TENANTS API
// ==========================================

export const tenantsApi = {
  /**
   * Get tenant by slug (public endpoint)
   */
  async getBySlug(slug: string): Promise<PublicTenant> {
    const url = `${API_URL}/tenants/by-slug/${slug}`;
    console.log('[CATALOG API] Fetching tenant:', url);

    const res = await fetch(url, {
      cache: 'no-store', // Always fresh data
    });

    console.log('[CATALOG API] Response status:', res.status);

    if (!res.ok) {
      console.error('[CATALOG API] Tenant fetch failed:', res.status, res.statusText);
      throw new Error(`Tenant not found: ${slug}`);
    }

    const data = await res.json();
    console.log('[CATALOG API] Tenant data:', data?.slug, data?.status);
    return data;
  },
};

// ==========================================
// PRODUCTS API
// ==========================================

interface GetProductsOptions {
  isActive?: boolean;
  limit?: number;
  page?: number;
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'stock' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export const productsApi = {
  /**
   * Get products by store slug (public endpoint)
   */
  async getByStore(
    slug: string,
    options: GetProductsOptions = {}
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();

    if (options.isActive !== undefined) {
      params.append('isActive', String(options.isActive));
    }
    if (options.limit) {
      params.append('limit', String(options.limit));
    }
    if (options.page) {
      params.append('page', String(options.page));
    }
    if (options.search) {
      params.append('search', options.search);
    }
    if (options.category) {
      params.append('category', options.category);
    }
    if (options.sortBy) {
      params.append('sortBy', options.sortBy);
    }
    if (options.sortOrder) {
      params.append('sortOrder', options.sortOrder);
    }

    const queryString = params.toString();
    const url = `${API_URL}/products/store/${slug}${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: options.limit || 20, totalPages: 0 },
      };
    }

    return res.json();
  },

  /**
   * Get single product by store slug and product ID (public endpoint)
   */
  async getByStoreAndId(storeSlug: string, productId: string): Promise<Product | null> {
    const res = await fetch(`${API_URL}/products/store/${storeSlug}/${productId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  },

  /**
   * Get single product by ID
   */
  async getById(id: string): Promise<Product | null> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  },

  /**
   * Get product by slug within a store
   */
  async getBySlug(storeSlug: string, productSlug: string): Promise<Product | null> {
    const res = await fetch(`${API_URL}/products/store/${storeSlug}/slug/${productSlug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  },
};

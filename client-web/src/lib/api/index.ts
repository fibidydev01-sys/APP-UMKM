// ==========================================
// API CLIENT - Client-web minimal version
// ==========================================

import type { TenantDetail } from '@umkm/shared/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ==========================================
// TENANTS API
// ==========================================

export const tenantsApi = {
  async getBySlug(slug: string): Promise<TenantDetail> {
    const res = await fetch(`${API_URL}/tenants/by-slug/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch tenant');
    }

    return res.json();
  },
};

// ==========================================
// ERROR HELPER
// ==========================================

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Terjadi kesalahan';
}

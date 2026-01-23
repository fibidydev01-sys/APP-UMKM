// ==========================================
// API CLIENT - Client-web minimal version
// ==========================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ==========================================
// TENANTS API
// ==========================================

export const tenantsApi = {
  async getBySlug(slug: string) {
    const res = await fetch(`${API_URL}/tenants/public/${slug}`, {
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

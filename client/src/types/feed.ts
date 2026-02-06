// ==========================================
// FEED TYPES
// ==========================================

/**
 * Tenant info embedded in feed response
 */
export interface FeedTenant {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  whatsapp?: string;
}

/**
 * Product info embedded in feed response
 */
export interface FeedProduct {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock?: number | null;
  trackStock?: boolean;
  unit?: string | null;
}

/**
 * Feed entity
 */
export interface Feed {
  id: string;
  tenantId: string;
  productId: string;
  caption?: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  tenant: FeedTenant;
  product: FeedProduct;
}

/**
 * Feed pagination meta (uses hasMore instead of totalPages)
 */
export interface FeedPaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Feed list response
 */
export interface FeedListResponse {
  data: Feed[];
  meta: FeedPaginationMeta;
}

/**
 * Create feed input
 */
export interface CreateFeedInput {
  productId: string;
  caption?: string;
}

/**
 * Create feed response
 */
export interface CreateFeedResponse {
  message: string;
  feed: Feed;
}

/**
 * Delete feed response
 */
export interface DeleteFeedResponse {
  message: string;
}

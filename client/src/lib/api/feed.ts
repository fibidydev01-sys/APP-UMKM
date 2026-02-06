import { api } from './client';
import type {
  FeedListResponse,
  Feed,
  CreateFeedInput,
  CreateFeedResponse,
  DeleteFeedResponse,
} from '@/types';

// ==========================================
// FEED API SERVICE
// ==========================================

export const feedApi = {
  /**
   * Get feed list (public - chronological, paginated)
   * GET /feed?page=1&limit=20
   */
  getAll: async (params?: { page?: number; limit?: number }): Promise<FeedListResponse> => {
    return api.get<FeedListResponse>('/feed', { params });
  },

  /**
   * Get single feed detail (public)
   * GET /feed/:id
   */
  getById: async (id: string): Promise<Feed> => {
    return api.get<Feed>(`/feed/${id}`);
  },

  /**
   * Create feed post (protected - from own product)
   * POST /feed
   */
  create: async (data: CreateFeedInput): Promise<CreateFeedResponse> => {
    return api.post<CreateFeedResponse>('/feed', data);
  },

  /**
   * Delete own feed post (protected)
   * DELETE /feed/:id
   */
  delete: async (id: string): Promise<DeleteFeedResponse> => {
    return api.delete<DeleteFeedResponse>(`/feed/${id}`);
  },
};

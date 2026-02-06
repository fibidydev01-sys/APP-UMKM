'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, RefreshCw, Compass } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard';
import { FeedCard, FeedEndMessage, FeedCreateModal, FeedPreviewDrawer, TenantProfileDrawer } from '@/components/feed';
import { feedApi, getErrorMessage } from '@/lib/api';
import { useCurrentTenant } from '@/stores/auth-store';
import type { Feed, FeedPaginationMeta } from '@/types';

const FEED_LIMIT = 20;

export default function ExplorePage() {
  const tenant = useCurrentTenant();

  // Feed state
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [meta, setMeta] = useState<FeedPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Drawer state
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Tenant profile drawer state
  const [profileSlug, setProfileSlug] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Refs
  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  // Fetch feeds
  const fetchFeeds = useCallback(async (page: number, append = false) => {
    if (!isMounted.current) return;

    if (page === 1 && !append) {
      setIsLoading(true);
    }
    if (append) {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const res = await feedApi.getAll({ page, limit: FEED_LIMIT });

      if (!isMounted.current) return;

      if (append) {
        setFeeds((prev) => [...prev, ...res.data]);
      } else {
        setFeeds(res.data);
      }
      setMeta(res.meta);
    } catch (err) {
      if (!isMounted.current) return;
      setError(getErrorMessage(err));
    } finally {
      if (!isMounted.current) return;
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    isMounted.current = true;

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchFeeds(1);
    }

    return () => {
      isMounted.current = false;
    };
  }, [fetchFeeds]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFeeds(1);
  };

  // Load more handler
  const handleLoadMore = async () => {
    if (!meta?.hasMore || isLoadingMore) return;
    await fetchFeeds(meta.page + 1, true);
  };

  // Delete handler
  const handleDelete = async (feedId: string) => {
    try {
      await feedApi.delete(feedId);
      setFeeds((prev) => prev.filter((f) => f.id !== feedId));
      if (meta) {
        setMeta({ ...meta, total: meta.total - 1 });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // After creating a new feed post
  const handleCreateSuccess = () => {
    hasFetched.current = false;
    fetchFeeds(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader title="Explore" description="Lihat produk terbaru dari semua toko">
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Post ke Feed
          </Button>
        </PageHeader>
        <FeedSkeleton />
      </>
    );
  }

  // Error state
  if (error && feeds.length === 0) {
    return (
      <>
        <PageHeader title="Explore" description="Lihat produk terbaru dari semua toko">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post ke Feed
          </Button>
        </PageHeader>

        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat feed</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              hasFetched.current = false;
              fetchFeeds(1);
            }}
          >
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  // Empty state
  if (feeds.length === 0) {
    return (
      <>
        <PageHeader title="Explore" description="Lihat produk terbaru dari semua toko">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post ke Feed
          </Button>
        </PageHeader>

        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <Compass className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Belum ada postingan</h2>
          <p className="text-muted-foreground mb-6">Jadilah yang pertama memposting produk ke feed!</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post Produk Pertama
          </Button>
        </div>

        <FeedCreateModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Explore" description="Lihat produk terbaru dari semua toko">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post ke Feed
          </Button>
        </div>
      </PageHeader>

      {/* Feed List - single column, max-width for readability */}
      <div className="max-w-xl mx-auto space-y-4">
        {feeds.map((feed) => (
          <FeedCard
            key={feed.id}
            feed={feed}
            currentTenantId={tenant?.id ?? null}
            onDelete={handleDelete}
            onUpdate={(feedId, caption) => {
              setFeeds((prev) =>
                prev.map((f) => (f.id === feedId ? { ...f, caption } : f)),
              );
            }}
            onCardClick={(f) => {
              setSelectedFeed(f);
              setDrawerOpen(true);
            }}
          />
        ))}

        {/* Load More / End Message */}
        {meta?.hasMore ? (
          <div className="flex justify-center py-4">
            <Button variant="outline" onClick={handleLoadMore} disabled={isLoadingMore}>
              {isLoadingMore ? 'Memuat...' : 'Lihat Lebih Banyak'}
            </Button>
          </div>
        ) : (
          <FeedEndMessage totalPosts={meta?.total ?? feeds.length} />
        )}

        {/* Inline error for load more failures */}
        {error && feeds.length > 0 && (
          <div className="rounded-md bg-destructive/10 p-3 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>

      <FeedCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <FeedPreviewDrawer
        feed={selectedFeed}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentTenantId={tenant?.id ?? null}
        onDelete={handleDelete}
        onUpdate={(feedId, caption) => {
          setFeeds((prev) =>
            prev.map((f) => (f.id === feedId ? { ...f, caption } : f)),
          );
        }}
        onTenantClick={(slug) => {
          setProfileSlug(slug);
          setProfileOpen(true);
        }}
      />

      <TenantProfileDrawer
        slug={profileSlug}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

function FeedSkeleton() {
  return (
    <div className="max-w-xl mx-auto space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          {/* Caption */}
          <Skeleton className="h-4 w-3/4" />
          {/* Image */}
          <Skeleton className="aspect-square rounded-lg" />
          {/* Product info */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-28" />
          </div>
          {/* Stats */}
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

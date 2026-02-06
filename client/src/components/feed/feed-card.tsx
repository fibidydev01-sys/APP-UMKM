'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Eye, Store, Trash2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { feedApi } from '@/lib/api';
import type { Feed, FeedComment } from '@/types';

interface FeedCardProps {
  feed: Feed;
  currentTenantId?: string | null;
  onDelete?: (feedId: string) => void;
}

export function FeedCard({ feed, currentTenantId, onDelete }: FeedCardProps) {
  const isOwner = currentTenantId === feed.tenantId;
  const isLoggedIn = !!currentTenantId;
  const productImage = feed.product.images?.[0];

  // Like state
  const [liked, setLiked] = useState(feed.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(feed.likeCount);
  const [likePending, setLikePending] = useState(false);

  // Comment state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [commentCount, setCommentCount] = useState(feed.commentCount);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsMeta, setCommentsMeta] = useState<{ hasMore: boolean; page: number } | null>(null);

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(feed.product.price);

  const formattedComparePrice = feed.product.comparePrice
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(feed.product.comparePrice)
    : null;

  // Toggle like
  const handleLike = async () => {
    if (!isLoggedIn || likePending) return;
    setLikePending(true);

    // Optimistic update
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await feedApi.toggleLike(feed.id);
      setLiked(res.liked);
    } catch {
      // Rollback on error
      setLiked(liked);
      setLikeCount(likeCount);
    } finally {
      setLikePending(false);
    }
  };

  // Load comments
  const handleToggleComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);

    if (!commentsLoaded) {
      setLoadingComments(true);
      try {
        const res = await feedApi.getComments(feed.id, { page: 1, limit: 10 });
        setComments(res.data);
        setCommentsMeta({ hasMore: res.meta.hasMore, page: res.meta.page });
        setCommentsLoaded(true);
      } catch {
        // Silently fail - comments section will be empty
      } finally {
        setLoadingComments(false);
      }
    }
  };

  // Load more comments
  const handleLoadMoreComments = async () => {
    if (!commentsMeta?.hasMore || loadingComments) return;
    setLoadingComments(true);
    try {
      const res = await feedApi.getComments(feed.id, { page: commentsMeta.page + 1, limit: 10 });
      setComments((prev) => [...prev, ...res.data]);
      setCommentsMeta({ hasMore: res.meta.hasMore, page: res.meta.page });
    } catch {
      // Silently fail
    } finally {
      setLoadingComments(false);
    }
  };

  // Submit comment
  const handleSubmitComment = async () => {
    if (!commentText.trim() || submittingComment || !isLoggedIn) return;
    setSubmittingComment(true);

    try {
      const res = await feedApi.addComment(feed.id, { content: commentText.trim() });
      // Prepend new comment (newest first)
      setComments((prev) => [res.comment, ...prev]);
      setCommentCount((prev) => prev + 1);
      setCommentText('');
    } catch {
      // Keep text on error so user can retry
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4 space-y-3">
      {/* Header - Tenant Info */}
      <div className="flex items-center gap-3">
        <Link href={`/store/${feed.tenant.slug}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {feed.tenant.logo ? (
              <Image
                src={feed.tenant.logo}
                alt={feed.tenant.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <Store className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/store/${feed.tenant.slug}`} className="font-semibold text-sm hover:underline truncate block">
            {feed.tenant.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(feed.createdAt), {
              addSuffix: true,
              locale: localeId,
            })}
          </p>
        </div>

        {isOwner && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(feed.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Caption */}
      {feed.caption && (
        <p className="text-sm whitespace-pre-line">{feed.caption}</p>
      )}

      {/* Product Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
        {productImage ? (
          <Image
            src={productImage}
            alt={feed.product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 640px"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Store className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h3 className="font-semibold text-sm">{feed.product.name}</h3>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-primary">{formattedPrice}</p>
          {formattedComparePrice && (
            <p className="text-sm text-muted-foreground line-through">{formattedComparePrice}</p>
          )}
        </div>
      </div>

      {/* Interactive Engagement Bar */}
      <div className="flex items-center gap-1 pt-2 border-t">
        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
          onClick={handleLike}
          disabled={!isLoggedIn || likePending}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          <span className="text-xs">{likeCount}</span>
        </Button>

        {/* Comment Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 ${showComments ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={handleToggleComments}
        >
          <MessageCircle className={`h-4 w-4 ${showComments ? 'fill-current' : ''}`} />
          <span className="text-xs">{commentCount}</span>
        </Button>

        {/* View Count (passive) */}
        <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
          <Eye className="h-4 w-4" />
          <span className="text-xs">{feed.viewCount}</span>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-3 pt-2">
          {/* Comment Input */}
          {isLoggedIn && (
            <div className="flex gap-2">
              <Input
                placeholder="Tulis komentar..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
                maxLength={500}
                disabled={submittingComment}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || submittingComment}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Loading skeleton */}
          {loadingComments && !commentsLoaded && (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment List */}
          {comments.length > 0 && (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                    {comment.tenant.logo ? (
                      <Image
                        src={comment.tenant.logo}
                        alt={comment.tenant.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Store className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold">{comment.tenant.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: localeId,
                        })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}

              {/* Load more comments */}
              {commentsMeta?.hasMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                  onClick={handleLoadMoreComments}
                  disabled={loadingComments}
                >
                  {loadingComments ? 'Memuat...' : 'Lihat komentar lainnya'}
                </Button>
              )}
            </div>
          )}

          {/* Empty comments */}
          {commentsLoaded && comments.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              Belum ada komentar
            </p>
          )}
        </div>
      )}
    </div>
  );
}

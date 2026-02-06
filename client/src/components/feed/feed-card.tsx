'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Eye, Store, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import type { Feed } from '@/types';

interface FeedCardProps {
  feed: Feed;
  currentTenantId?: string | null;
  onDelete?: (feedId: string) => void;
}

export function FeedCard({ feed, currentTenantId, onDelete }: FeedCardProps) {
  const isOwner = currentTenantId === feed.tenantId;
  const productImage = feed.product.images?.[0];

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

      {/* Engagement Stats */}
      <div className="flex items-center gap-4 pt-2 border-t text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Heart className="h-4 w-4" />
          <span className="text-xs">{feed.likeCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{feed.commentCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          <span className="text-xs">{feed.viewCount}</span>
        </div>
      </div>
    </div>
  );
}

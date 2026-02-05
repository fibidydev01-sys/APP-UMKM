import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChannelsClient } from './client';
import { Skeleton } from '@/components/ui/skeleton';

// ==========================================
// METADATA
// ==========================================

export const metadata: Metadata = {
  title: 'Channels',
  description: 'Kelola pengaturan pencarian, pembayaran, dan pengiriman',
};

// ==========================================
// LOADING FALLBACK
// ==========================================

function ChannelsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-4 w-40 mx-auto" />
      <Skeleton className="h-10 w-full max-w-sm mx-auto" />
      <Skeleton className="h-10 w-full max-w-sm mx-auto" />
    </div>
  );
}

// ==========================================
// CHANNELS PAGE
// Pattern: page.tsx (server/metadata) + client.tsx (client/UI)
// Sticky tabs: Pencarian (SEO), Pembayaran, Pengiriman
// ==========================================

export default function ChannelsPage() {
  return (
    <Suspense fallback={<ChannelsLoading />}>
      <ChannelsClient />
    </Suspense>
  );
}

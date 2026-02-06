# 📱 FEED FEATURE - IMPLEMENTATION DOCUMENTATION

**Model:** TikTok Shop Feed (Simplified Version)  
**Konsep:** Chronological Product Discovery Feed  
**Philosophy:** Back to Basics - Healthy Digital Habit

---

## 🎯 OVERVIEW

Feed feature adalah social commerce marketplace dimana tenant bisa posting
produk mereka ke public feed. User lain bisa melihat, like, comment, dan view
produk tersebut. Sistem menggunakan **chronological order** (newest first) tanpa
algoritma ranking.

### Key Principles

- ✅ **Chronological** - Newest first, no algorithm
- ✅ **Public Discovery** - All users see all posts
- ✅ **One Product Per Post** - 1 tenant hanya bisa post 1 produk sekali
- ✅ **Simple Engagement** - View, Like, Comment only
- ✅ **Healthy UX** - "You're all caught up" endpoint
- ✅ **Fair for All** - No favoritism, equal opportunity

---

## 📊 DATABASE SCHEMA

### New Table: `Feed`

```prisma
model Feed {
  id            String   @id @default(cuid())

  // Relations
  tenantId      String
  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  productId     String
  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  // Content
  caption       String?  @db.Text  // Quotes/kata-kata dari tenant

  // Engagement Metrics (counters only)
  viewCount     Int      @default(0)
  likeCount     Int      @default(0)
  commentCount  Int      @default(0)

  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations (Phase 2)
  likes         FeedLike[]
  comments      FeedComment[]
  views         FeedView[]

  // Constraints
  @@unique([tenantId, productId])  // 1 tenant hanya bisa post 1 produk sekali
  @@index([createdAt(sort: Desc)]) // Untuk chronological query
  @@index([tenantId])
}
```

### Phase 2 Tables (Interaction Data)

```prisma
// Table untuk track siapa yang like
model FeedLike {
  id        String   @id @default(cuid())
  feedId    String
  feed      Feed     @relation(fields: [feedId], references: [id], onDelete: Cascade)
  tenantId  String   // Siapa yang like (sebagai tenant/user)
  createdAt DateTime @default(now())

  @@unique([feedId, tenantId])
  @@index([feedId])
  @@index([tenantId])
}

// Table untuk track comment
model FeedComment {
  id        String   @id @default(cuid())
  feedId    String
  feed      Feed     @relation(fields: [feedId], references: [id], onDelete: Cascade)
  tenantId  String   // Siapa yang comment
  content   String   @db.Text
  createdAt DateTime @default(now())

  @@index([feedId, createdAt(sort: Desc)])
  @@index([tenantId])
}

// Table untuk track unique views
model FeedView {
  id        String   @id @default(cuid())
  feedId    String
  feed      Feed     @relation(fields: [feedId], references: [id], onDelete: Cascade)
  tenantId  String   // Siapa yang view
  createdAt DateTime @default(now())

  @@unique([feedId, tenantId])  // 1 user hanya dihitung 1x view
  @@index([feedId])
}
```

---

## 🏗️ BACKEND ARCHITECTURE

### Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL (Prisma ORM)
- **Real-time:** Socket.IO (optional untuk live updates)

### Module Structure

```
src/
├── feed/
│   ├── feed.module.ts
│   ├── feed.controller.ts
│   ├── feed.service.ts
│   ├── dto/
│   │   ├── create-feed.dto.ts
│   │   ├── query-feed.dto.ts
│   │   └── interaction.dto.ts
│   └── entities/
│       └── feed.entity.ts
```

### API Endpoints

#### **Phase 1 - Core Feed**

```typescript
// POST /api/feed
// Create new feed post
POST /api/feed
Body: {
  productId: string;
  caption?: string;
}
Response: {
  id: string;
  tenantId: string;
  productId: string;
  caption: string;
  viewCount: 0;
  likeCount: 0;
  commentCount: 0;
  createdAt: string;
  product: Product;
  tenant: Tenant;
}

// GET /api/feed
// Get feed list (chronological, paginated)
GET /api/feed?page=1&limit=20
Response: {
  data: Feed[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;  // false jika sudah mentok = "You're all caught up"
  }
}

// GET /api/feed/:id
// Get single feed detail
GET /api/feed/:id
Response: Feed

// DELETE /api/feed/:id
// Delete own feed post
DELETE /api/feed/:id
Response: { message: "Feed deleted" }
```

#### **Phase 2 - Interactions**

```typescript
// POST /api/feed/:id/like
// Toggle like (like/unlike)
POST /api/feed/:id/like
Response: {
  liked: boolean;
  likeCount: number;
}

// POST /api/feed/:id/comment
// Add comment
POST /api/feed/:id/comment
Body: {
  content: string;
}
Response: FeedComment

// GET /api/feed/:id/comments
// Get comments
GET /api/feed/:id/comments?page=1&limit=10
Response: {
  data: FeedComment[];
  meta: PaginationMeta;
}

// POST /api/feed/:id/view
// Track view (called when feed masuk viewport)
POST /api/feed/:id/view
Response: {
  viewCount: number;
}
```

### Service Logic

```typescript
// feed.service.ts

@Injectable()
export class FeedService {
  // Create Feed
  async create(tenantId: string, dto: CreateFeedDto) {
    // Check: Apakah product sudah di-post sebelumnya
    const existing = await prisma.feed.findUnique({
      where: {
        tenantId_productId: {
          tenantId,
          productId: dto.productId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Product already posted to feed');
    }

    // Create feed
    return prisma.feed.create({
      data: {
        tenantId,
        productId: dto.productId,
        caption: dto.caption,
      },
      include: {
        product: true,
        tenant: {
          select: { id: true, name: true, logo: true, slug: true },
        },
      },
    });
  }

  // Get Feed (Chronological)
  async findAll(query: QueryFeedDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.feed.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // 🔥 CHRONOLOGICAL
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              slug: true,
            },
          },
          tenant: {
            select: {
              id: true,
              name: true,
              logo: true,
              slug: true,
            },
          },
        },
      }),
      prisma.feed.count(),
    ]);

    const hasMore = skip + data.length < total;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        hasMore, // ✅ Frontend check ini untuk "You're all caught up"
      },
    };
  }

  // Toggle Like (Phase 2)
  async toggleLike(feedId: string, tenantId: string) {
    const existing = await prisma.feedLike.findUnique({
      where: {
        feedId_tenantId: { feedId, tenantId },
      },
    });

    if (existing) {
      // Unlike
      await prisma.feedLike.delete({
        where: { id: existing.id },
      });

      await prisma.feed.update({
        where: { id: feedId },
        data: { likeCount: { decrement: 1 } },
      });

      return { liked: false };
    } else {
      // Like
      await prisma.feedLike.create({
        data: { feedId, tenantId },
      });

      await prisma.feed.update({
        where: { id: feedId },
        data: { likeCount: { increment: 1 } },
      });

      return { liked: true };
    }
  }

  // Track View (Phase 2)
  async trackView(feedId: string, tenantId: string) {
    // Check if already viewed
    const existing = await prisma.feedView.findUnique({
      where: {
        feedId_tenantId: { feedId, tenantId },
      },
    });

    if (!existing) {
      // Create view record
      await prisma.feedView.create({
        data: { feedId, tenantId },
      });

      // Increment counter
      await prisma.feed.update({
        where: { id: feedId },
        data: { viewCount: { increment: 1 } },
      });
    }

    // Return current count
    const feed = await prisma.feed.findUnique({
      where: { id: feedId },
      select: { viewCount: true },
    });

    return { viewCount: feed.viewCount };
  }
}
```

---

## 💻 FRONTEND ARCHITECTURE

### Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** Radix UI + Tailwind CSS
- **State:** Zustand
- **Data Fetching:** Native fetch / Axios
- **Infinite Scroll:** Tanstack Virtual (tapi dengan endpoint)

### Page Structure

```
app/
├── (main)/
│   ├── feed/
│   │   ├── page.tsx              // Feed list page
│   │   ├── [id]/
│   │   │   └── page.tsx          // Feed detail page
│   │   └── create/
│   │       └── page.tsx          // Create feed page
```

### Component Structure

```
components/
├── feed/
│   ├── feed-list.tsx              // Main feed list with scroll
│   ├── feed-card.tsx              // Single feed item
│   ├── feed-create-modal.tsx      // Modal untuk create feed
│   ├── feed-interactions.tsx      // Like, Comment, View buttons
│   ├── feed-comment-section.tsx   // Comment list & form
│   └── feed-end-message.tsx       // "You're all caught up"
```

### Key Components

#### 1. **feed-list.tsx** (Main Container)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { FeedCard } from './feed-card';
import { FeedEndMessage } from './feed-end-message';

interface FeedListProps {
  initialData?: Feed[];
}

export function FeedList({ initialData = [] }: FeedListProps) {
  const [feeds, setFeeds] = useState<Feed[]>(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/feed?page=${page + 1}&limit=20`);
      const json = await res.json();

      setFeeds(prev => [...prev, ...json.data]);
      setPage(page + 1);
      setHasMore(json.meta.hasMore);  // 🔥 Check hasMore
    } catch (error) {
      console.error('Failed to load feeds:', error);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer untuk auto-load
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    const sentinel = document.getElementById('feed-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [page, hasMore]);

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      {feeds.map(feed => (
        <FeedCard key={feed.id} feed={feed} />
      ))}

      {/* Sentinel untuk trigger load */}
      {hasMore && (
        <div id="feed-sentinel" className="h-20 flex items-center justify-center">
          {loading && <p className="text-muted-foreground">Loading...</p>}
        </div>
      )}

      {/* ✅ "You're all caught up" Message */}
      {!hasMore && feeds.length > 0 && (
        <FeedEndMessage totalPosts={feeds.length} />
      )}

      {feeds.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Belum ada postingan di feed</p>
        </div>
      )}
    </div>
  );
}
```

#### 2. **feed-card.tsx** (Feed Item)

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface FeedCardProps {
  feed: Feed;
}

export function FeedCard({ feed }: FeedCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(feed.likeCount);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/feed/${feed.id}/like`, {
        method: 'POST',
      });
      const json = await res.json();

      setLiked(json.liked);
      setLikeCount(json.likeCount);
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4 space-y-3">
      {/* Header - Tenant Info */}
      <div className="flex items-center gap-3">
        <Link href={`/${feed.tenant.slug}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            {feed.tenant.logo && (
              <Image
                src={feed.tenant.logo}
                alt={feed.tenant.name}
                width={40}
                height={40}
                className="object-cover"
              />
            )}
          </div>
        </Link>

        <div className="flex-1">
          <Link href={`/${feed.tenant.slug}`} className="font-semibold hover:underline">
            {feed.tenant.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(feed.createdAt), {
              addSuffix: true,
              locale: localeId
            })}
          </p>
        </div>
      </div>

      {/* Caption */}
      {feed.caption && (
        <p className="text-sm">{feed.caption}</p>
      )}

      {/* Product Image */}
      <Link href={`/feed/${feed.id}`}>
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition">
          <Image
            src={feed.product.images[0]}
            alt={feed.product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div>
        <Link href={`/${feed.tenant.slug}/products/${feed.product.slug}`}>
          <h3 className="font-semibold hover:underline">{feed.product.name}</h3>
        </Link>
        <p className="text-lg font-bold text-primary">
          Rp {feed.product.price.toLocaleString('id-ID')}
        </p>
      </div>

      {/* Interactions */}
      <div className="flex items-center gap-4 pt-2 border-t">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 hover:text-red-500 transition"
        >
          <Heart className={liked ? 'fill-red-500 text-red-500' : ''} size={20} />
          <span className="text-sm">{likeCount}</span>
        </button>

        <Link
          href={`/feed/${feed.id}#comments`}
          className="flex items-center gap-2 hover:text-blue-500 transition"
        >
          <MessageCircle size={20} />
          <span className="text-sm">{feed.commentCount}</span>
        </Link>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye size={20} />
          <span className="text-sm">{feed.viewCount}</span>
        </div>
      </div>
    </div>
  );
}
```

#### 3. **feed-end-message.tsx** (Healthy UX Element)

```typescript
'use client';

import { CheckCircle2 } from 'lucide-react';

interface FeedEndMessageProps {
  totalPosts: number;
}

export function FeedEndMessage({ totalPosts }: FeedEndMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-primary" />
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-lg">You're all caught up! 🎉</h3>
        <p className="text-sm text-muted-foreground">
          Kamu sudah melihat semua {totalPosts} postingan di feed
        </p>
        <p className="text-xs text-muted-foreground pt-2">
          Cek lagi nanti untuk postingan terbaru
        </p>
      </div>
    </div>
  );
}
```

#### 4. **feed-create-modal.tsx** (Create Flow)

```typescript
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

interface FeedCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function FeedCreateModal({ open, onClose, onSuccess }: FeedCreateModalProps) {
  const [step, setStep] = useState<'select-product' | 'write-caption'>('select-product');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedProduct) return;

    setLoading(true);

    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          caption: caption.trim() || undefined
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      // Success
      onSuccess?.();
      onClose();

      // Reset state
      setStep('select-product');
      setSelectedProduct(null);
      setCaption('');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'select-product' ? 'Pilih Produk' : 'Tulis Caption'}
          </DialogTitle>
        </DialogHeader>

        {step === 'select-product' && (
          <ProductSelector
            onSelect={(product) => {
              setSelectedProduct(product);
              setStep('write-caption');
            }}
          />
        )}

        {step === 'write-caption' && selectedProduct && (
          <div className="space-y-4">
            {/* Product Preview */}
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="relative w-20 h-20 rounded overflow-hidden">
                <Image
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{selectedProduct.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Rp {selectedProduct.price.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Caption Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Caption (Opsional)
              </label>
              <Textarea
                placeholder="Ceritakan tentang produk ini atau tulis quotes..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {caption.length}/500 karakter
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setStep('select-product')}
                disabled={loading}
              >
                Kembali
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post ke Feed'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🔄 USER FLOW

### Flow 1: Create Feed Post

```
1. Tenant klik "Create Post" button
   ↓
2. Modal terbuka → Step 1: Pilih produk dari list
   ↓
3. Klik produk → Step 2: Tulis caption (optional)
   ↓
4. Klik "Post ke Feed"
   ↓
5. Backend check:
   - Apakah product ini sudah pernah di-post?
   - Jika ya: Error "Product already posted"
   - Jika tidak: Create feed record
   ↓
6. Success → Modal close → Redirect ke feed page
   ↓
7. Feed baru muncul di paling atas (newest first)
```

### Flow 2: View Feed

```
1. User buka halaman /feed
   ↓
2. Load initial feeds (20 items)
   ↓
3. User scroll kebawah
   ↓
4. Ketika sentinel masuk viewport → Load page berikutnya
   ↓
5. Append feeds ke list
   ↓
6. Ulangi step 3-5 hingga hasMore = false
   ↓
7. Tampilkan "You're all caught up" message
   ↓
8. User bisa close app dengan tenang ✅
```

### Flow 3: Like Post (Phase 2)

```
1. User klik heart icon
   ↓
2. Toggle like:
   - Jika belum like → Create like record + increment counter
   - Jika sudah like → Delete like record + decrement counter
   ↓
3. Update UI (optimistic update)
   ↓
4. Sync with backend
```

### Flow 4: Comment Post (Phase 2)

```
1. User klik comment icon atau buka feed detail
   ↓
2. Scroll ke comment section
   ↓
3. Tulis comment di textarea
   ↓
4. Klik "Post Comment"
   ↓
5. Create comment record + increment commentCount
   ↓
6. Comment muncul di list (newest first)
```

---

## 📱 UI/UX GUIDELINES

### Design Principles

1. **Simplicity First**
   - Clean layout, minimal distractions
   - Focus on product & content
   - Easy to scan & browse

2. **Healthy Boundaries**
   - Clear endpoint ("You're all caught up")
   - No endless scroll trap
   - Encourage users to close app

3. **Fair Visibility**
   - All posts treated equally
   - No hidden algorithm
   - Transparent chronological order

4. **Mobile Optimized**
   - Touch-friendly buttons (min 44px)
   - Smooth scroll performance
   - Responsive images

### Component Specifications

#### Feed Card Dimensions

- Width: 100% (max 640px container)
- Image: Square aspect ratio (1:1)
- Spacing: 16px padding
- Gap: 16px between cards

#### Interaction Buttons

- Size: 20px icon
- Touch target: 44x44px
- Colors:
  - Default: muted-foreground
  - Hover: Primary color
  - Active (liked): Red (#EF4444)

#### Typography

- Tenant name: font-semibold, 16px
- Caption: font-normal, 14px
- Product name: font-semibold, 16px
- Price: font-bold, 18px, primary color
- Timestamp: font-normal, 12px, muted

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Core Feed (Week 1-2)

✅ Database schema  
✅ Backend API (CRUD feed)  
✅ Frontend feed list (chronological)  
✅ Create feed flow  
✅ "You're all caught up" message  
✅ Basic UI/UX

**Deliverable:** Users can post products to feed & browse chronologically

---

### Phase 2: Interactions (Week 3-4)

✅ Like system (toggle + counter)  
✅ Comment system (create + list)  
✅ View tracking (unique views)  
✅ Interaction UI polish  
✅ Real-time updates (optional - Socket.IO)

**Deliverable:** Full engagement features working

---

### Phase 3: Optimization (Week 5-6)

✅ Performance optimization (lazy loading images)  
✅ Caching strategy (Redis for counters)  
✅ Analytics tracking  
✅ Mobile app optimization  
✅ A/B testing setup

**Deliverable:** Production-ready, optimized performance

---

## 🔧 TECHNICAL CONSIDERATIONS

### Performance

1. **Image Optimization**
   - Use Next.js Image component with blur placeholder
   - CDN delivery (Cloudinary / Supabase Storage)
   - WebP format with fallback
   - Lazy loading (native or Intersection Observer)

2. **Query Optimization**
   - Index on `createdAt DESC`
   - Pagination with cursor-based (optional untuk scale)
   - Limit eager loading (select only needed fields)

3. **Caching**
   - Cache feed list for anonymous users (5 min TTL)
   - Cache tenant/product data (Redis)
   - Invalidate cache on new post

### Security

1. **Authorization**
   - Only authenticated tenants can create feed
   - Only owner can delete their feed
   - Rate limiting on API endpoints

2. **Validation**
   - Caption max length: 500 chars
   - XSS protection on caption input
   - Image URL validation

3. **Rate Limiting**
   - Create feed: 10 posts per hour per tenant
   - Like: 100 per hour per user
   - Comment: 30 per hour per user

### Monitoring

1. **Metrics to Track**
   - Feed creation rate
   - Average engagement per post
   - Load time (P95, P99)
   - Error rate
   - User retention

2. **Alerts**
   - High error rate (>5%)
   - Slow queries (>1s)
   - Failed image loads
   - Spam detection

---

## 📋 MIGRATION CHECKLIST

### Pre-Implementation

- [ ] Review existing Product & Tenant schema
- [ ] Design Feed table schema
- [ ] Plan interaction tables (Phase 2)
- [ ] Create API documentation
- [ ] Setup development environment

### Database Migration

- [ ] Create Feed table migration
- [ ] Add indexes (createdAt, tenantId, productId)
- [ ] Add unique constraint (tenantId + productId)
- [ ] Create seed data for testing
- [ ] Test migration rollback

### Backend Development

- [ ] Create Feed module (NestJS)
- [ ] Implement CRUD endpoints
- [ ] Add validation (DTO)
- [ ] Add authorization guards
- [ ] Write unit tests
- [ ] Write integration tests

### Frontend Development

- [ ] Create Feed pages (list, detail, create)
- [ ] Implement feed-list.tsx component
- [ ] Implement feed-card.tsx component
- [ ] Implement feed-create-modal.tsx component
- [ ] Add "You're all caught up" message
- [ ] Responsive design testing
- [ ] Cross-browser testing

### Testing

- [ ] Unit tests (backend services)
- [ ] Integration tests (API endpoints)
- [ ] E2E tests (create → view → delete flow)
- [ ] Performance testing (load 100+ feeds)
- [ ] Mobile responsiveness
- [ ] Accessibility (a11y)

### Deployment

- [ ] Deploy database migration
- [ ] Deploy backend to production
- [ ] Deploy frontend to production
- [ ] Smoke testing in production
- [ ] Monitor error logs
- [ ] Setup analytics tracking

---

## 🎯 SUCCESS METRICS

### Product Metrics

- **Adoption Rate:** % of tenants posting to feed
- **Engagement Rate:** Avg likes + comments per post
- **Retention:** % users returning to feed daily
- **Time on Feed:** Average session duration

### Technical Metrics

- **Load Time:** < 2s for initial feed load
- **API Response Time:** < 200ms (P95)
- **Error Rate:** < 1%
- **Uptime:** 99.9%

### Business Metrics

- **Product Discovery:** % products found via feed
- **Conversion Rate:** Feed → Product detail → Order
- **User Satisfaction:** NPS score from feed users

---

## 📚 REFERENCES

### Inspiration

- TikTok Shop Feed (video → static image version)
- Instagram Shopping
- Poshmark Feed
- Facebook Timeline (2008-2012 era)

### Technical Documentation

- [Prisma Pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination)
- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [NestJS Guards](https://docs.nestjs.com/guards)

---

## 🤝 COLLABORATION NOTES

### For Frontend Developer

- Use provided components as base
- Follow Radix UI patterns (already in package.json)
- Implement optimistic updates for better UX
- Focus on mobile-first design
- Test on real devices (iOS/Android)

### For Backend Developer

- Prioritize query performance (indexes!)
- Implement proper error handling
- Use transactions for atomic operations
- Add comprehensive logging
- Write clear API documentation

### For Designer

- Keep it simple & clean
- Use existing design system
- Focus on readability
- Consider accessibility (contrast, touch targets)
- Create loading states & empty states

---

## 💡 FUTURE ENHANCEMENTS (Post-Launch)

### Possible Features (After Phase 2)

- [ ] Feed categories/tags
- [ ] Search within feed
- [ ] Share feed post (WhatsApp, copy link)
- [ ] Report/flag inappropriate content
- [ ] Pin important posts (owner only)
- [ ] Draft posts (save before publishing)
- [ ] Schedule posts (future posting)
- [ ] Feed analytics dashboard (for tenants)
- [ ] Trending products section
- [ ] Featured posts (curated by admin)

**Note:** Evaluate each feature based on user feedback & data

---

## 📞 SUPPORT & QUESTIONS

If you have questions during implementation:

1. Check this documentation first
2. Review API documentation
3. Check existing codebase patterns
4. Ask team lead for clarification

**Remember:** Keep it simple, keep it chronological, keep users healthy! 🎯

---

**Version:** 1.0  
**Last Updated:** 2026-02-06  
**Status:** Ready for Implementation

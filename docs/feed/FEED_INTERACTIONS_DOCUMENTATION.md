# FEED INTERACTIONS - LIKE & COMMENT TECHNICAL DOCUMENTATION

**Phase:** 2 - Social Interactions
**Status:** Implemented
**Depends on:** Phase 1 (Core Feed CRUD)

---

## DATABASE SCHEMA

### Model: FeedLike

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | String (CUID) | `@id @default(cuid())` | Primary key |
| `feedId` | String | FK -> Feed.id | Feed yang di-like |
| `tenantId` | String | FK -> Tenant.id | Tenant yang nge-like |
| `createdAt` | DateTime | `@default(now())` | Waktu like |

**Constraints:**
- `@@unique([feedId, tenantId])` - 1 tenant hanya bisa like 1x per feed
- `@@index([feedId])` - Query likes per feed
- `onDelete: Cascade` - Hapus feed/tenant = hapus semua likes terkait

```prisma
model FeedLike {
  id        String   @id @default(cuid())
  feedId    String
  feed      Feed     @relation(fields: [feedId], references: [id], onDelete: Cascade)
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([feedId, tenantId])
  @@index([feedId])
}
```

### Model: FeedComment

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| `id` | String (CUID) | `@id @default(cuid())` | Primary key |
| `feedId` | String | FK -> Feed.id | Feed yang dikomentari |
| `tenantId` | String | FK -> Tenant.id | Tenant yang berkomentar |
| `content` | String | `@db.Text`, max 500 chars | Isi komentar |
| `createdAt` | DateTime | `@default(now())` | Waktu komentar |

**Constraints:**
- `@@index([feedId, createdAt(sort: Desc)])` - Query comments per feed, newest first
- `onDelete: Cascade` - Hapus feed/tenant = hapus semua comments terkait

```prisma
model FeedComment {
  id        String   @id @default(cuid())
  feedId    String
  feed      Feed     @relation(fields: [feedId], references: [id], onDelete: Cascade)
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  content   String   @db.Text
  createdAt DateTime @default(now())

  @@index([feedId, createdAt(sort: Desc)])
}
```

### Updated: Feed Model (Counter Fields)

Feed model sudah punya counter fields dari Phase 1, sekarang dipakai aktif:

```prisma
model Feed {
  // ... existing fields ...
  likeCount     Int @default(0)   // Synced via $transaction
  commentCount  Int @default(0)   // Synced via $transaction

  // New relations
  likes         FeedLike[]
  comments      FeedComment[]
}
```

### Updated: Tenant Model (Reverse Relations)

```prisma
model Tenant {
  // ... existing fields ...
  feedLikes     FeedLike[]
  feedComments  FeedComment[]
}
```

### Relasi Diagram

```
Tenant (1) ──── (N) FeedLike  (N) ──── (1) Feed
Tenant (1) ──── (N) FeedComment (N) ──── (1) Feed

No circular dependency. Simple one-to-many.
```

---

## API ENDPOINTS

### Overview

| Method | Endpoint | Auth | Description | HTTP Status |
|--------|----------|------|-------------|-------------|
| `GET` | `/feed` | Optional | List feed + `isLiked` flag | 200 |
| `GET` | `/feed/:id` | Public | Feed detail | 200 |
| `POST` | `/feed` | Required | Create feed post | 201 |
| `DELETE` | `/feed/:id` | Required | Delete own feed | 200 |
| `POST` | `/feed/:id/like` | Required | Toggle like/unlike | 200 |
| `POST` | `/feed/:id/comments` | Required | Add comment | 201 |
| `GET` | `/feed/:id/comments` | Public | List comments | 200 |

---

### POST /feed/:id/like - Toggle Like

**Auth:** `JwtAuthGuard` (Required)

**Request:**
```
POST /api/feed/clxyz123/like
Authorization: Bearer <token>
```
No body needed.

**Response (liked):**
```json
{
  "liked": true,
  "message": "Berhasil like"
}
```

**Response (unliked):**
```json
{
  "liked": false,
  "message": "Like dihapus"
}
```

**Error Responses:**
- `401` - Unauthorized (belum login)
- `404` - Feed tidak ditemukan

**Implementation Detail - Atomic Transaction:**
```typescript
// Like: create FeedLike + increment counter
await this.prisma.$transaction([
  this.prisma.feedLike.create({ data: { feedId, tenantId } }),
  this.prisma.feed.update({
    where: { id: feedId },
    data: { likeCount: { increment: 1 } },
  }),
]);

// Unlike: delete FeedLike + decrement counter
await this.prisma.$transaction([
  this.prisma.feedLike.delete({ where: { id: existing.id } }),
  this.prisma.feed.update({
    where: { id: feedId },
    data: { likeCount: { decrement: 1 } },
  }),
]);
```

**Kenapa pakai `$transaction`:**
Counter (`likeCount`) dan data (`FeedLike` row) harus selalu sinkron.
Tanpa transaction, kalau salah satu gagal, counter bisa drift dari actual count.

---

### POST /feed/:id/comments - Add Comment

**Auth:** `JwtAuthGuard` (Required)

**Request:**
```json
POST /api/feed/clxyz123/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Produknya bagus banget!"
}
```

**Validation (class-validator):**
- `content`: required, string, max 500 characters

**Response (201):**
```json
{
  "message": "Komentar berhasil ditambahkan",
  "comment": {
    "id": "clabc456",
    "feedId": "clxyz123",
    "tenantId": "cldef789",
    "content": "Produknya bagus banget!",
    "createdAt": "2026-02-06T10:30:00.000Z",
    "tenant": {
      "id": "cldef789",
      "name": "Toko ABC",
      "slug": "toko-abc",
      "logo": "https://..."
    }
  }
}
```

**Error Responses:**
- `400` - Validation error (content kosong / terlalu panjang)
- `401` - Unauthorized
- `404` - Feed tidak ditemukan

**Implementation Detail - Atomic Transaction:**
```typescript
const [comment] = await this.prisma.$transaction([
  this.prisma.feedComment.create({
    data: { feedId, tenantId, content: dto.content },
    include: { tenant: { select: { id, name, slug, logo } } },
  }),
  this.prisma.feed.update({
    where: { id: feedId },
    data: { commentCount: { increment: 1 } },
  }),
]);
```

---

### GET /feed/:id/comments - List Comments

**Auth:** Public (no auth required)

**Request:**
```
GET /api/feed/clxyz123/comments?page=1&limit=10
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

**Response (200):**
```json
{
  "data": [
    {
      "id": "clabc456",
      "feedId": "clxyz123",
      "tenantId": "cldef789",
      "content": "Produknya bagus banget!",
      "createdAt": "2026-02-06T10:30:00.000Z",
      "tenant": {
        "id": "cldef789",
        "name": "Toko ABC",
        "slug": "toko-abc",
        "logo": "https://..."
      }
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
```

**Order:** `createdAt DESC` (newest comment first)

---

### GET /feed - List Feed (Updated with isLiked)

**Auth:** `OptionalJwtAuthGuard` - Public, tapi kalau ada token valid, return `isLiked`

**Response field baru per feed item:**
```json
{
  "id": "clxyz123",
  "isLiked": true,
  "likeCount": 5,
  "commentCount": 3,
  "...": "..."
}
```

**Behavior:**
- **Tanpa token:** `isLiked` = `false` untuk semua feed
- **Dengan token valid:** `isLiked` = `true/false` berdasarkan apakah tenant sudah like

**Implementation - OptionalJwtAuthGuard:**

```typescript
// Guard TIDAK throw error kalau tidak ada token
// request.user = tenant object (kalau ada token valid)
// request.user = null (kalau tidak ada token)

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const cookieToken = request.cookies?.['fibidy_auth'];
    const headerToken = request.headers.authorization?.replace('Bearer ', '');

    // Tidak ada token? Skip auth, lanjut (user = null)
    if (!cookieToken && !headerToken) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, _info) {
    // Gagal auth? Jangan throw, biarkan user = null
    if (err || !user) return null;
    return user;
  }
}
```

**Query optimization - conditional include:**
```typescript
include: {
  // Hanya query FeedLike kalau user login
  ...(currentTenantId ? {
    likes: {
      where: { tenantId: currentTenantId },
      select: { id: true },  // Minimal data
    },
  } : {}),
}
```

---

## BACKEND FILE STRUCTURE

```
server/src/
├── common/
│   └── guards/
│       ├── jwt-auth.guard.ts              # Existing - required auth
│       └── optional-jwt-auth.guard.ts     # NEW - optional auth
├── feed/
│   ├── feed.module.ts                     # Module registration
│   ├── feed.controller.ts                 # 7 endpoints (3 public, 4 protected)
│   ├── feed.service.ts                    # Business logic + $transaction
│   └── dto/
│       ├── index.ts                       # Barrel export
│       ├── create-feed.dto.ts             # Phase 1
│       ├── query-feed.dto.ts              # Phase 1
│       ├── create-comment.dto.ts          # Phase 2
│       └── query-comment.dto.ts           # Phase 2
└── prisma/
    └── schema.prisma                      # Feed + FeedLike + FeedComment
```

---

## FRONTEND IMPLEMENTATION

### Types (`client/src/types/feed.ts`)

```typescript
// Feed entity - sekarang punya isLiked
interface Feed {
  id: string;
  tenantId: string;
  productId: string;
  caption?: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;          // NEW - dari OptionalJwtAuthGuard
  createdAt: string;
  updatedAt: string;
  tenant: FeedTenant;
  product: FeedProduct;
}

// Comment entity
interface FeedComment {
  id: string;
  feedId: string;
  tenantId: string;
  content: string;
  createdAt: string;
  tenant: FeedTenant;        // Embedded tenant info
}

// Toggle like response
interface ToggleLikeResponse {
  liked: boolean;
  message: string;
}
```

### API Service (`client/src/lib/api/feed.ts`)

```typescript
feedApi.toggleLike(feedId)                    // POST /feed/:id/like
feedApi.getComments(feedId, { page, limit })  // GET /feed/:id/comments
feedApi.addComment(feedId, { content })       // POST /feed/:id/comments
```

### FeedCard Component - Interaction UX

**Like Button:**
- Heart icon, merah (fill) kalau sudah like, outline kalau belum
- Optimistic update: UI berubah langsung sebelum API response
- Rollback kalau API gagal
- Disabled kalau belum login

**Comment Section:**
- Collapse/expand toggle via MessageCircle button
- Lazy-loaded: comments di-fetch hanya saat pertama kali dibuka
- Input field + Send button (Enter to submit)
- New comment prepended ke list (newest first)
- "Lihat komentar lainnya" button untuk pagination
- "Belum ada komentar" empty state
- Disabled input kalau belum login

**Engagement Bar Layout:**
```
[ Heart 5 ] [ Comment 3 ]              [ Eye 120 ]
  ^like       ^toggle comments           ^passive view count
```

---

## DESIGN DECISIONS

### 1. Counter + Detail Table (Hybrid Approach)

**Counter fields** (`likeCount`, `commentCount`) di Feed table:
- Fast read: tidak perlu `COUNT(*)` query setiap load feed
- Displayed in feed list tanpa JOIN

**Detail tables** (`FeedLike`, `FeedComment`):
- Track siapa yang like/comment
- Enable `isLiked` check per user
- Relational integrity

**Sinkronisasi:** `$transaction` memastikan counter selalu akurat.

### 2. Toggle Like (Single Endpoint)

Satu endpoint `POST /feed/:id/like` untuk like DAN unlike:
- Frontend simple: satu button, satu action
- Backend check: sudah ada? Unlike. Belum ada? Like.
- Idempotent by design (unique constraint mencegah duplicate)

### 3. OptionalJwtAuthGuard (New Pattern)

Endpoint `GET /feed` perlu:
- Tetap public (siapa saja bisa lihat feed)
- Tapi kalau user login, kasih info `isLiked`

Solusi: Guard baru yang TIDAK throw error kalau token tidak ada.
- Ada token valid -> `request.user` = tenant
- Tidak ada token -> `request.user` = null
- Token invalid -> `request.user` = null (tetap lanjut, bukan 401)

### 4. Optimistic Update (Frontend)

Like button menggunakan optimistic UI:
```
User klik like -> UI langsung berubah -> API call di background
                                      -> Sukses? Done
                                      -> Gagal? Rollback UI
```

Kenapa: Responsif. User tidak perlu menunggu API response untuk melihat feedback visual.

### 5. Lazy-Load Comments

Comments TIDAK di-load bersamaan dengan feed list:
- Feed list query sudah include product + tenant
- Menambahkan comments = N+1 problem
- Solution: load comments on-demand saat user klik toggle

---

## ERROR HANDLING

| Scenario | Backend Response | Frontend Behavior |
|----------|-----------------|-------------------|
| Like tanpa login | 401 Unauthorized | Button disabled |
| Like feed yang tidak ada | 404 Not Found | Error message |
| Comment kosong | 400 Validation | Input validation |
| Comment > 500 chars | 400 Validation | `maxLength={500}` |
| Comment tanpa login | 401 Unauthorized | Input disabled |
| Feed dihapus saat buka comments | 404 Not Found | Error message |
| Network error saat like | API error | Rollback optimistic update |
| Network error saat comment | API error | Text tetap di input, bisa retry |

---

## MIGRATION NOTES

Untuk menerapkan schema changes ke database yang sudah ada:

```bash
cd server

# Generate Prisma client
npx --package=prisma@6.0.1 prisma generate

# Run migration
npx --package=prisma@6.0.1 prisma migrate dev --name add_feed_interactions
```

Tables yang dibuat:
- `FeedLike` (baru)
- `FeedComment` (baru)

Columns yang ditambahkan di `Tenant`:
- `feedLikes` (relasi, bukan column fisik)
- `feedComments` (relasi, bukan column fisik)

**Zero downtime:** Menambahkan table baru tidak mempengaruhi table yang sudah ada.

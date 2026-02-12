# Midtrans Integration - Gap Analysis (UPDATED)

## Konteks: UMKM Bayar ke Platform untuk Fitur Premium

Model bisnis: **Freemium SaaS** - UMKM daftar gratis (Starter), upgrade ke Business (Rp 149.000/bulan) untuk unlock fitur premium. Pembayaran subscription via Midtrans Snap.

---

## 1. KONDISI SAAT INI

### Pricing Sudah Didefinisikan (Frontend)

| | Starter (Free) | Business (Rp 149.000/bln) |
|---|---|---|
| Produk/Layanan | Max 50 | Unlimited |
| Pelanggan/Klien | Max 200 | Unlimited |
| Subdomain | namakamu.fibidy.com | Custom domain (tokoku.com) |
| Branding Fibidy | Ada | Bisa dihapus |
| Laporan | - | Lengkap |
| Export Data | - | Ada |
| Struk | Dasar | Custom + logo |
| Support | Email | Prioritas |
| Fibidy AI | Ada | Ada |
| WhatsApp Order | Ada | Ada |
| Tanpa Iklan | Ada | Ada |

**Source:** `client-web/src/components/platform-landing/pricing-section.tsx`

### ✅ Schema SUDAH Ada

Berikut komponen yang **sudah diimplementasikan** di `prisma/schema.prisma`:

| Komponen | Status | Detail |
|----------|--------|--------|
| Enum `SubscriptionPlan` | ✅ Sudah ada | `STARTER`, `BUSINESS` |
| Enum `SubscriptionStatus` | ✅ Sudah ada | `ACTIVE`, `EXPIRED`, `CANCELLED`, `PAST_DUE` |
| Model `Subscription` | ✅ Sudah ada | Termasuk field `isTrial`, `trialEndsAt`, pricing snapshot, cancellation |
| Model `SubscriptionPayment` | ✅ Sudah ada | Midtrans fields lengkap (`snapToken`, `snapRedirectUrl`, `vaNumber`, dll) |
| Relasi di `Tenant` | ✅ Sudah ada | `subscription` (1:1) dan `subscriptionPayments` (1:many) |
| `Subscription.tenantId` @unique | ✅ Sudah ada | 1 tenant = 1 subscription |

### ❌ Yang BELUM Ada (Gap Tersisa)

| Gap | Detail |
|-----|--------|
| Feature gating | Tidak ada guard/middleware yang cek plan sebelum izinkan aksi |
| Limit enforcement | Limit 50 produk & 200 customer **tidak di-enforce** di backend |
| Payment infrastructure | Tidak ada integrasi Midtrans atau payment gateway apapun |
| Subscription management UI | Tidak ada halaman "Upgrade" atau "Subscription" di dashboard |

---

## 2. SCHEMA REVIEW (Kondisi Saat Ini)

### 2a. Enums ✅

```prisma
enum SubscriptionPlan {
  STARTER    // Free
  BUSINESS   // Rp 149.000/bln
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PAST_DUE   // Lewat jatuh tempo, grace period
}
```

### 2b. Model `Subscription` ✅

Sudah ada di schema dengan field berikut:

```prisma
model Subscription {
  id                 String             @id @default(cuid())

  tenantId           String             @unique  // ✅ 1:1 dengan Tenant
  tenant             Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  plan               SubscriptionPlan   @default(STARTER)
  status             SubscriptionStatus @default(ACTIVE)

  // Periode aktif
  currentPeriodStart DateTime?          @map("current_period_start")
  currentPeriodEnd   DateTime?          @map("current_period_end")

  // Trial support ✅ (ada di schema, belum di dokumen sebelumnya)
  isTrial            Boolean            @default(false) @map("is_trial")
  trialEndsAt        DateTime?          @map("trial_ends_at")

  // Pricing snapshot
  priceAmount        Float              @default(0) @map("price_amount")
  currency           String             @default("IDR")

  // Cancellation
  cancelledAt        DateTime?          @map("cancelled_at")
  cancelReason       String?            @map("cancel_reason")

  // Timestamps
  createdAt          DateTime           @default(now()) @map("created_at")
  updatedAt          DateTime           @updatedAt @map("updated_at")

  // Relations
  payments           SubscriptionPayment[]

  @@map("subscriptions")
  @@index([tenantId])
  @@index([status])
  @@index([plan])
  @@index([currentPeriodEnd])
}
```

### 2c. Model `SubscriptionPayment` ✅

Sudah ada di schema:

```prisma
model SubscriptionPayment {
  id                    String       @id @default(cuid())

  subscriptionId        String       @map("subscription_id")
  subscription          Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  tenantId              String       @map("tenant_id")
  tenant                Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Midtrans identifiers
  midtransOrderId       String       @unique @map("midtrans_order_id")
  midtransTransactionId String?      @unique @map("midtrans_transaction_id")
  snapToken             String?      @map("snap_token")
  snapRedirectUrl       String?      @map("snap_redirect_url")

  // Amount
  amount                Float
  currency              String       @default("IDR")

  // Payment method detail (dari Midtrans webhook)
  paymentType           String?      @map("payment_type")
  bank                  String?
  vaNumber              String?      @map("va_number")

  // Status
  paymentStatus         String       @default("pending") @map("payment_status")
  fraudStatus           String?      @map("fraud_status")

  // Periode yang dibayar
  periodStart           DateTime     @map("period_start")
  periodEnd             DateTime     @map("period_end")

  // Webhook raw data
  rawNotification       Json?        @map("raw_notification")
  metadata              Json?

  // Timestamps
  paidAt                DateTime?    @map("paid_at")
  createdAt             DateTime     @default(now()) @map("created_at")
  updatedAt             DateTime     @updatedAt @map("updated_at")

  @@map("subscription_payments")
  @@index([tenantId])
  @@index([subscriptionId])
  @@index([midtransOrderId])
  @@index([paymentStatus])
  @@index([tenantId, createdAt])
}
```

### 2d. Relasi di Model `Tenant` ✅

Sudah ada:

```prisma
model Tenant {
  // ... existing fields ...

  // Subscription (sudah ada)
  subscription          Subscription?
  subscriptionPayments  SubscriptionPayment[]

  // ... existing relations ...
}
```

### 2e. Plan Limits Config (Tetap di Code, bukan DB)

```typescript
// src/subscription/plan-limits.ts
export const PLAN_LIMITS = {
  STARTER: {
    maxProducts: 50,
    maxCustomers: 200,
    customDomain: false,
    removeBranding: false,
    advancedReports: false,
    exportData: false,
    customReceipt: false,
    prioritySupport: false,
  },
  BUSINESS: {
    maxProducts: Infinity,
    maxCustomers: Infinity,
    customDomain: true,
    removeBranding: true,
    advancedReports: true,
    exportData: true,
    customReceipt: true,
    prioritySupport: true,
  },
} as const;
```

---

## 3. BACKEND GAP ANALYSIS

### File/Module yang PERLU DIBUAT

```
server/src/
  ├── subscription/
  │   ├── subscription.module.ts        <- Module
  │   ├── subscription.service.ts       <- Business logic (CRUD, upgrade, cek limit)
  │   ├── subscription.controller.ts    <- API endpoints
  │   ├── plan-limits.ts                <- Config limit per plan
  │   ├── dto/
  │   │   ├── create-subscription.dto.ts
  │   │   └── index.ts
  │   └── guards/
  │       └── plan-feature.guard.ts     <- Guard cek fitur premium
  │
  ├── payment/
  │   ├── payment.module.ts             <- Module
  │   ├── payment.controller.ts         <- Webhook + status endpoints
  │   ├── midtrans.service.ts           <- Midtrans Snap logic
  │   └── dto/
  │       └── index.ts
  │
  └── config/
      └── midtrans.config.ts            <- Midtrans env config
```

### Existing Code yang PERLU DIMODIFIKASI

| File | Perubahan |
|------|-----------|
| `app.module.ts` | Import `SubscriptionModule`, `PaymentModule`, midtrans config |
| `products/products.service.ts` | Cek limit produk sebelum create (50 untuk Starter) |
| `customers/customers.service.ts` | Cek limit customer sebelum create (200 untuk Starter) |
| `.env` / `.env.example` | Tambah `MIDTRANS_*` variables |

> **Catatan:** `prisma/schema.prisma` TIDAK perlu dimodifikasi — schema subscription sudah lengkap.

---

## 4. FRONTEND GAP ANALYSIS

### File yang PERLU DIBUAT

```
client/src/
  ├── types/midtrans-snap.d.ts                    <- Snap.js type declarations
  ├── hooks/use-snap-payment.ts                    <- Hook load Snap.js
  ├── lib/api/subscription.ts                      <- Subscription API service
  ├── app/(dashboard)/dashboard/subscription/
  │   └── page.tsx                                 <- Halaman subscription/upgrade
  └── components/subscription/
      ├── current-plan-card.tsx                     <- Info plan sekarang
      ├── upgrade-dialog.tsx                        <- Dialog upgrade + Midtrans
      └── payment-history.tsx                       <- Riwayat pembayaran
```

### Existing Code yang PERLU DIMODIFIKASI

| File | Perubahan |
|------|-----------|
| Dashboard sidebar/navigation | Tambah menu "Langganan" / "Subscription" |
| `pricing-section.tsx` (client-web) | Business plan: ubah CTA dari "Daftar Waiting List" ke "Upgrade Sekarang" |
| `.env.local` | Tambah `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` |

---

## 5. PAYMENT FLOW: UMKM UPGRADE KE BUSINESS

```
┌─────────────────────────────────────────────┐
│ UMKM Login ke Dashboard                      │
│ Plan: Starter (Free)                         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ Klik menu "Langganan" / "Upgrade"            │
│ Lihat perbandingan plan                      │
│ Klik "Upgrade ke Business"                   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ Frontend:                                    │
│ POST /api/subscription/upgrade               │
│ -> Backend buat/update Subscription          │
│ -> Backend buat SubscriptionPayment          │
│ -> Backend panggil Midtrans Snap API         │
│ -> Return snapToken                          │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ Snap Popup muncul                            │
│ UMKM pilih metode bayar:                     │
│ - Bank Transfer (BCA/BNI/BRI/Mandiri VA)     │
│ - GoPay / ShopeePay                          │
│ - QRIS                                       │
│ - Kartu Kredit/Debit                         │
│ - Indomaret / Alfamart                       │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
┌──────────────┐ ┌────────────────────┐
│ Bayar sukses │ │ Close/Cancel popup │
│ onSuccess()  │ │ -> bisa bayar nanti│
└──────┬───────┘ └────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ Midtrans webhook:                            │
│ POST /api/payment/webhook                    │
│                                              │
│ Backend:                                     │
│ 1. Verify signature (SHA-512)                │
│ 2. Update SubscriptionPayment.paymentStatus  │
│ 3. If settlement:                            │
│    a. Update Subscription.plan = BUSINESS    │
│    b. Update Subscription.status = ACTIVE    │
│    c. Set periode: now -> +30 hari           │
│    d. Set SubscriptionPayment.paidAt = now   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ UMKM sekarang plan BUSINESS:                 │
│ - Produk unlimited                           │
│ - Customer unlimited                         │
│ - Custom domain                              │
│ - Hapus branding Fibidy                      │
│ - Laporan lengkap                            │
│ - Export data                                │
│ - Struk custom + logo                        │
│ - Support prioritas                          │
└─────────────────────────────────────────────┘
```

---

## 6. FEATURE GATING (Enforce Limits)

### Backend Guard untuk Premium Features

```typescript
// Contoh: guard di ProductsController
@Post()
@UseGuards(JwtAuthGuard)
async create(@CurrentTenant() tenantId: string, @Body() dto) {
  // Service cek limit:
  // 1. Ambil subscription tenant (include: { subscription: true })
  // 2. Kalau plan = STARTER (atau subscription null), cek count produk < 50
  // 3. Kalau >= 50, throw "Upgrade ke Business untuk tambah produk"
  return this.productsService.create(tenantId, dto);
}
```

### Limit yang Di-enforce

| Fitur | Starter | Business | Cara Enforce |
|-------|---------|----------|-------------|
| Create product | Max 50, tolak kalau > 50 | Unlimited | Cek count di `ProductsService.create()` |
| Create customer | Max 200, tolak kalau > 200 | Unlimited | Cek count di `CustomersService.create()` |
| Custom domain | Tidak bisa set | Bisa set di settings | Cek plan di `TenantsService.updateDomain()` |
| Hapus branding | Tidak bisa | Bisa toggle | Cek plan, return branding flag |
| Export data | Endpoint blocked | Endpoint accessible | Guard di endpoint export |
| Laporan lengkap | Basic stats | Full analytics | Conditional di `TenantsService.getStats()` |

### Trial Support

Schema sudah mendukung trial period via field `isTrial` dan `trialEndsAt` di model `Subscription`. Implementasi yang perlu dibuat:

```typescript
// Cek apakah tenant dalam trial period
function isInTrial(subscription: Subscription): boolean {
  return subscription.isTrial && subscription.trialEndsAt && new Date() < subscription.trialEndsAt;
}

// Cek apakah tenant punya akses Business features
function hasBusinessAccess(subscription: Subscription): boolean {
  return (
    subscription.plan === 'BUSINESS' && subscription.status === 'ACTIVE'
  ) || isInTrial(subscription);
}
```

---

## 7. ENV VARIABLES YANG PERLU DITAMBAH

### Backend (`server/.env`)
```env
# Midtrans (Platform Account)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
MIDTRANS_MERCHANT_ID=G999999999
MIDTRANS_IS_PRODUCTION=false

# Subscription Pricing
SUBSCRIPTION_BUSINESS_PRICE=149000
SUBSCRIPTION_BUSINESS_PERIOD_DAYS=30
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

---

## 8. KOMPATIBILITAS DENGAN GUIDE EXISTING

| Aspek di Guide | Tetap Pakai | Perlu Adaptasi |
|----------------|-------------|----------------|
| Midtrans Snap API | Ya | Konteks berubah: bukan checkout customer, tapi upgrade plan |
| `midtrans-client` npm | Ya | Sama |
| Signature verification (SHA-512) | Ya | Sama persis |
| Webhook handler | Ya | Status mapping: settlement -> activate subscription |
| Snap.js di frontend | Ya | Sama, load via CDN |
| `useSnapPayment` hook | Ya | Sama |
| Transaction model | Tidak | Gunakan `SubscriptionPayment` yang sudah ada di schema |
| Transaction di Order | Tidak | Payment ini bukan untuk Order tapi untuk Subscription |
| Customer details di Midtrans | Adaptasi | Yang bayar = Tenant (UMKM owner), bukan end-customer |
| Order ID format | Adaptasi | Format: `SUB-{tenantSlug}-{timestamp}` bukan `TXN-...` |
| Platform fee/commission | Tidak relevan | Tidak ada commission - ini direct payment ke platform |
| Callbacks/redirect | Adaptasi | Redirect ke dashboard subscription page, bukan tracking |

---

## 9. CHECKLIST KESIAPAN

### Backend
- [x] NestJS framework cocok
- [x] Prisma ORM siap extend
- [x] JWT auth sudah ada
- [x] Rate limiting sudah ada
- [x] CORS configured
- [x] ConfigModule siap tambah midtrans config
- [x] Schema `Subscription` sudah ada (termasuk trial support)
- [x] Schema `SubscriptionPayment` sudah ada (termasuk Midtrans fields)
- [x] Enum `SubscriptionPlan` & `SubscriptionStatus` sudah ada
- [x] Relasi Tenant ↔ Subscription sudah ada
- [ ] Perlu install `midtrans-client`
- [ ] Perlu buat `subscription/` module (service, controller, guards)
- [ ] Perlu buat `payment/` module (webhook, midtrans service)
- [ ] Perlu enforce limit di products & customers service
- [ ] Perlu tambah env variables
- [ ] Perlu implement trial logic (field sudah ada)

### Frontend
- [x] Dashboard framework siap
- [x] Radix UI components ready
- [x] API client pattern ada
- [x] Zustand untuk state
- [x] Pricing page sudah ada (tinggal update CTA)
- [ ] Perlu buat halaman subscription di dashboard
- [ ] Perlu buat Snap.js hook
- [ ] Perlu buat subscription API service
- [ ] Perlu tambah env variable

---

## RINGKASAN PERUBAHAN DARI DOKUMEN SEBELUMNYA

| Aspek | Dokumen Lama | Dokumen Ini (Updated) |
|-------|-------------|----------------------|
| Schema subscription | ❌ "Belum ada, perlu dibuat" | ✅ "Sudah ada di schema" |
| Relasi Tenant | ❌ "Perlu ditambah" | ✅ "Sudah ada" |
| Trial support | ❌ Tidak disebutkan | ✅ Didokumentasikan (`isTrial`, `trialEndsAt`) |
| `Subscription.tenantId` | Tidak `@unique` di contoh | ✅ Sudah `@unique` (1:1) |
| Checklist schema | `[ ]` (belum) | `[x]` (sudah) |
| Focus area | Schema + Backend + Frontend | **Backend logic + Frontend only** (schema selesai) |

---

**Dokumen selanjutnya:**
- `02_BACKEND_IMPLEMENTATION.md` - Step-by-step backend (focus: modules, guards, Midtrans integration)
- `03_FRONTEND_IMPLEMENTATION.md` - Step-by-step frontend (focus: subscription page, Snap.js, payment UI)
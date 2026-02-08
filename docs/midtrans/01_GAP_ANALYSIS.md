# Midtrans Integration - Gap Analysis

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

### Yang BELUM Ada (Gap)

| Gap | Detail |
|-----|--------|
| Schema subscription | Tidak ada model `Subscription`, `Plan`, atau `Payment` di Prisma |
| Field plan di Tenant | Tenant model tidak punya field `plan` atau `subscriptionStatus` |
| Feature gating | Tidak ada guard/middleware yang cek plan sebelum izinkan aksi |
| Limit enforcement | Limit 50 produk & 200 customer **tidak di-enforce** di backend |
| Payment infrastructure | Tidak ada integrasi Midtrans atau payment gateway apapun |
| Subscription management UI | Tidak ada halaman "Upgrade" atau "Subscription" di dashboard |

---

## 2. SCHEMA YANG PERLU DITAMBAH

### 2a. Enum `SubscriptionPlan`

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

### 2b. Model `Subscription`

Track subscription aktif per tenant.

```prisma
model Subscription {
  id                 String             @id @default(cuid())

  tenantId           String
  tenant             Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  plan               SubscriptionPlan   @default(STARTER)
  status             SubscriptionStatus @default(ACTIVE)

  // Periode
  currentPeriodStart DateTime?          @map("current_period_start")
  currentPeriodEnd   DateTime?          @map("current_period_end")

  // Pricing snapshot (harga saat subscribe, bisa berubah di kemudian hari)
  priceAmount        Float              @default(0) @map("price_amount")
  currency           String             @default("IDR")

  // Metadata
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

### 2c. Model `SubscriptionPayment`

Record setiap pembayaran subscription via Midtrans.

```prisma
model SubscriptionPayment {
  id                    String       @id @default(cuid())

  subscriptionId        String       @map("subscription_id")
  subscription          Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  tenantId              String       @map("tenant_id")
  tenant                Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Midtrans
  midtransOrderId       String       @unique @map("midtrans_order_id")
  midtransTransactionId String?      @unique @map("midtrans_transaction_id")
  snapToken             String?      @map("snap_token")
  snapRedirectUrl       String?      @map("snap_redirect_url")

  // Amount
  amount                Float
  currency              String       @default("IDR")

  // Payment info
  paymentType           String?      @map("payment_type")  // bank_transfer, gopay, credit_card, dll
  bank                  String?                             // bca, bni, mandiri, dll
  vaNumber              String?      @map("va_number")

  // Status: pending | settlement | capture | cancel | deny | expire | failure | refund
  paymentStatus         String       @default("pending") @map("payment_status")
  fraudStatus           String?      @map("fraud_status")

  // Periode yang dibayar
  periodStart           DateTime     @map("period_start")
  periodEnd             DateTime     @map("period_end")

  // Metadata
  rawNotification       Json?        @map("raw_notification")  // Webhook data terakhir
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

### 2d. Update Model `Tenant`

Tambah relasi:

```prisma
model Tenant {
  // ... existing fields ...

  // Subscription Relations
  subscription          Subscription?
  subscriptionPayments  SubscriptionPayment[]

  // ... existing relations ...
}
```

### 2e. Plan Limits Config (Tidak di DB - di Code)

Tidak perlu model `PlanFeature` terpisah. Cukup config di code:

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
| `prisma/schema.prisma` | Tambah `Subscription`, `SubscriptionPayment`, enums, relasi Tenant |
| `app.module.ts` | Import `SubscriptionModule`, `PaymentModule`, midtrans config |
| `products/products.service.ts` | Cek limit produk sebelum create (50 untuk Starter) |
| `customers/customers.service.ts` | Cek limit customer sebelum create (200 untuk Starter) |
| `.env` / `.env.example` | Tambah `MIDTRANS_*` variables |

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
│ -> Backend buat Subscription + Payment       │
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
│ 1. Verify signature                          │
│ 2. Update SubscriptionPayment.status = PAID  │
│ 3. Update Subscription.plan = BUSINESS       │
│ 4. Update Subscription.status = ACTIVE       │
│ 5. Set periode: now -> +30 hari              │
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
  // 1. Ambil subscription tenant
  // 2. Kalau STARTER, cek count produk < 50
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
| Transaction model | Tidak | Ganti jadi `SubscriptionPayment` (lebih spesifik) |
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
- [ ] Perlu install `midtrans-client`
- [ ] Perlu buat `subscription/` module
- [ ] Perlu buat `payment/` module
- [ ] Perlu tambah schema + migration
- [ ] Perlu enforce limit di products & customers service
- [ ] Perlu tambah env variables

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

**Dokumen selanjutnya:**
- `02_BACKEND_IMPLEMENTATION.md` - Step-by-step backend
- `03_FRONTEND_IMPLEMENTATION.md` - Step-by-step frontend

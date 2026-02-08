# Midtrans Integration - Gap Analysis & Schema Changes

## Hasil Analisis: Guide vs Infrastruktur Existing

---

## 1. KOMPATIBILITAS KESELURUHAN

| Aspek | Guide | Existing | Status |
|-------|-------|----------|--------|
| Backend Framework | NestJS 11.x | NestJS 11.0.1 | COCOK |
| Frontend Framework | Next.js 16.x | Next.js 16.1.1 | COCOK |
| Database | Prisma + PostgreSQL | Prisma 6.0.1 + PostgreSQL (Supabase) | COCOK |
| Auth | JWT | JWT (`@nestjs/jwt`) + Cookie | COCOK |
| Validation | `class-validator` | `class-validator` 0.14.3 | COCOK |
| Rate Limiting | `@nestjs/throttler` | `@nestjs/throttler` (100 req/60s) | COCOK |
| CORS | Configured | Dynamic CORS configured | COCOK |
| Multi-tenant | Supported | `tenantId` isolation di semua model | COCOK |
| API Client (FE) | Axios | Custom Fetch-based `ApiClient` | PERLU ADAPTASI |
| Checkout Flow | Standalone | WhatsApp-based checkout | PERLU INTEGRASI |

**Kesimpulan:** Guide 90% cocok dengan infrastruktur. Yang perlu disesuaikan hanya API client (FE pakai fetch bukan axios) dan integrasi dengan checkout flow yang sudah ada.

---

## 2. SCHEMA GAP ANALYSIS

### 2.1 Yang SUDAH ADA (Tidak Perlu Diubah)

```
Order model:
  - paymentMethod    String    -> Sudah support "midtrans_snap"
  - paymentStatus    PaymentStatus (PENDING | PAID | PARTIAL | FAILED)
  - paidAmount       Float
  - total            Float
  - metadata         Json      -> Bisa simpan extra data

PaymentStatus enum:
  - PENDING, PAID, PARTIAL, FAILED -> Sudah cukup

Tenant model:
  - currency         String (default: "IDR")
  - taxRate          Float
  - paymentMethods   Json -> Bisa ditambah config Midtrans
```

### 2.2 Yang PERLU DITAMBAH

#### A. Model `Transaction` (Baru)

Kenapa perlu model terpisah dari `Order`?
- `Order` = data pesanan internal (items, customer, status)
- `Transaction` = data transaksi pembayaran Midtrans (snap token, VA number, payment type)
- 1 Order bisa punya beberapa Transaction (misal: order pertama expire, customer bayar ulang)

```prisma
model Transaction {
  id                 String   @id @default(cuid())

  // Link ke Order internal
  orderId            String
  order              Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  // Midtrans Order ID (unique, format: TXN-{tenantSlug}-{orderNumber}-{timestamp})
  midtransOrderId    String   @unique @map("midtrans_order_id")

  // Tenant (Multi-tenant)
  tenantId           String   @map("tenant_id")
  tenant             Tenant   @relation(fields: [tenantId], references: [id])

  // Amount
  grossAmount        Float    @map("gross_amount")
  currency           String   @default("IDR")

  // Platform Revenue
  platformFee        Float    @default(0) @map("platform_fee")
  platformFeePercent Float    @default(0) @map("platform_fee_percent")
  merchantAmount     Float    @default(0) @map("merchant_amount")

  // Midtrans Snap Response
  snapToken          String?  @map("snap_token")
  snapRedirectUrl    String?  @map("snap_redirect_url")

  // Midtrans Transaction Info
  midtransTransactionId String? @unique @map("midtrans_transaction_id")
  paymentType        String?  @map("payment_type")
  bank               String?
  vaNumber           String?  @map("va_number")

  // Status
  transactionStatus  String   @default("pending") @map("transaction_status")
  fraudStatus        String?  @map("fraud_status")

  // Customer (snapshot dari Order)
  customerName       String?  @map("customer_name")
  customerEmail      String?  @map("customer_email")
  customerPhone      String?  @map("customer_phone")

  // Items snapshot
  itemDetails        Json?    @map("item_details")

  // Metadata
  metadata           Json?

  // Timestamps
  transactionTime    DateTime? @map("transaction_time")
  settlementTime     DateTime? @map("settlement_time")
  expiryTime         DateTime? @map("expiry_time")
  createdAt          DateTime  @default(now()) @map("created_at")
  updatedAt          DateTime  @updatedAt @map("updated_at")

  // Relations
  logs               TransactionLog[]

  @@map("transactions")
  @@index([tenantId])
  @@index([orderId])
  @@index([midtransOrderId])
  @@index([midtransTransactionId])
  @@index([transactionStatus])
  @@index([tenantId, transactionStatus])
  @@index([tenantId, createdAt])
}
```

#### B. Model `TransactionLog` (Baru)

Untuk audit trail semua webhook notification dari Midtrans.

```prisma
model TransactionLog {
  id                 String   @id @default(cuid())

  transactionId      String   @map("transaction_id")
  transaction        Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  // Log Details
  event              String   // webhook_received, status_changed, token_created, etc
  previousStatus     String?  @map("previous_status")
  newStatus          String?  @map("new_status")
  rawNotification    Json?    @map("raw_notification")

  createdAt          DateTime @default(now()) @map("created_at")

  @@map("transaction_logs")
  @@index([transactionId])
  @@index([transactionId, createdAt])
}
```

#### C. Perubahan pada Model `Order` (Update)

```prisma
model Order {
  // ... field existing tetap ...

  // TAMBAH relasi ke Transaction
  transactions      Transaction[]
}
```

#### D. Perubahan pada Model `Tenant` (Update)

```prisma
model Tenant {
  // ... field existing tetap ...

  // TAMBAH relasi ke Transaction
  transactions      Transaction[]
}
```

### 2.3 Yang TIDAK PERLU dari Guide

| Item di Guide | Alasan Skip |
|---------------|-------------|
| `TenantPaymentConfig` model | Untuk MVP, pakai 1 akun Midtrans platform. Per-tenant credentials terlalu kompleks dan UMKM kecil tidak punya akun Midtrans sendiri |
| `Decimal` type untuk `grossAmount` | Existing pakai `Float` untuk konsistensi dengan `Order.total`. Untuk IDR (tanpa sen), `Float` cukup |
| `uuid()` untuk ID | Existing pakai `cuid()`, konsistensi tetap `cuid()` |

---

## 3. BACKEND GAP ANALYSIS

### 3.1 Module/File yang PERLU DIBUAT

```
server/src/payment/
  ├── payment.module.ts         <- Module registration
  ├── payment.controller.ts     <- API endpoints
  ├── midtrans.service.ts       <- Midtrans business logic
  ├── midtrans.config.ts        <- Config registration
  └── dto/
      ├── create-payment.dto.ts <- Validation untuk create payment
      └── index.ts              <- Barrel export

server/src/config/
  └── midtrans.config.ts        <- Midtrans config (registerAs)
```

### 3.2 Existing Code yang PERLU DIMODIFIKASI

| File | Perubahan |
|------|-----------|
| `app.module.ts` | Tambah `PaymentModule` di imports |
| `prisma/schema.prisma` | Tambah model `Transaction`, `TransactionLog`, relasi di `Order` & `Tenant` |
| `orders/orders.service.ts` | Method baru: `updatePaymentFromWebhook()` untuk sync Transaction -> Order |
| `store/store.controller.ts` | Endpoint baru: `POST /api/store/:slug/pay` untuk create payment dari public checkout |
| `store/store.module.ts` | Tambah `PaymentModule` di imports |
| `.env` | Tambah `MIDTRANS_*` variables |

### 3.3 Package yang PERLU DIINSTALL

```bash
# Backend
npm install midtrans-client
```

Hanya 1 package. Tidak perlu `@types/node` (sudah ada), tidak perlu `@nestjs/axios` (sudah ada).

### 3.4 Endpoint Baru yang Akan Dibuat

```
POST /api/store/:slug/pay          <- Public: Create Midtrans transaction
POST /api/payment/webhook          <- Public: Midtrans webhook (NO AUTH)
GET  /api/payment/status/:orderId  <- Protected: Check transaction status
POST /api/payment/cancel/:orderId  <- Protected: Cancel transaction
```

### 3.5 Integrasi dengan Existing Code

**Flow: Customer Checkout dengan Midtrans**
```
1. Customer pilih items, isi form checkout
2. Frontend POST /api/store/:slug/checkout (existing)
   -> Order dibuat dengan paymentMethod: "midtrans"
   -> Return order data + orderId
3. Frontend POST /api/store/:slug/pay
   -> Backend buat Midtrans Transaction
   -> Return snapToken + redirectUrl
4. Frontend buka Snap popup (window.snap.pay)
5. Customer bayar
6. Midtrans kirim webhook POST /api/payment/webhook
   -> Backend update Transaction status
   -> Backend update Order.paymentStatus = PAID
   -> Backend trigger auto-reply WhatsApp notification (existing!)
7. Customer redirect ke tracking page (existing!)
```

**Key Integration Point: Webhook -> OrdersService**
```typescript
// Di midtrans.service.ts handleNotification():
// Setelah update Transaction, sinkronkan ke Order:

if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
  await this.ordersService.updatePaymentStatus(tenantId, order.id, {
    paymentStatus: 'PAID',
    paidAmount: grossAmount,
  });
  // ^ Ini otomatis trigger auto-reply WhatsApp notification!
}

if (transactionStatus === 'expire' || transactionStatus === 'cancel' || transactionStatus === 'deny') {
  await this.ordersService.updatePaymentStatus(tenantId, order.id, {
    paymentStatus: 'FAILED',
  });
}
```

---

## 4. FRONTEND GAP ANALYSIS

### 4.1 File yang PERLU DIBUAT

```
client/src/
  ├── types/midtrans-snap.d.ts          <- Snap.js type declarations
  ├── hooks/use-snap-payment.ts         <- Hook untuk load & trigger Snap.js
  ├── lib/api/payment.ts                <- Payment API service (pakai api client existing)
  └── components/store/
      └── midtrans-payment-dialog.tsx   <- Dialog payment Midtrans (replace/alongside WhatsApp dialog)
```

### 4.2 Existing Code yang PERLU DIMODIFIKASI

| File | Perubahan |
|------|-----------|
| `components/store/whatsapp-checkout-dialog.tsx` | Tambah opsi: "Bayar Online" selain "Kirim via WhatsApp" |
| `app/store/[slug]/layout.tsx` | Load Snap.js script via `<Script>` |
| `stores/cart-store.ts` | Tidak perlu diubah (sudah bagus) |
| `.env.local` | Tambah `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` |

### 4.3 Perbedaan dengan Guide yang PERLU DIADAPTASI

| Guide Menggunakan | Existing Menggunakan | Adaptasi |
|-------------------|---------------------|----------|
| `axios` | Custom `ApiClient` (fetch) | Pakai `api.post()` dari `lib/api/client.ts` |
| `paymentService` standalone | `lib/api/` pattern | Buat `lib/api/payment.ts` sesuai pattern existing |
| `useToast` dari shadcn | `sonner` toast | Pakai `toast` dari `sonner` |
| Checkout page standalone | Dialog-based checkout | Buat `MidtransPaymentDialog` sesuai pattern |
| Payment result pages `/payment/*` | Store context `/store/[slug]/*` | Pakai `/store/[slug]/payment/success`, dll |

### 4.4 Checkout Flow Baru (Dual-Path)

```
[Existing Flow - TETAP]
Customer -> Cart -> Checkout Form -> "Kirim via WhatsApp" -> WhatsApp + Order Tracking

[New Flow - TAMBAH]
Customer -> Cart -> Checkout Form -> "Bayar Online" ->
  -> Create Order (POST /store/:slug/checkout)
  -> Create Payment (POST /store/:slug/pay)
  -> Snap Popup muncul
  -> Customer bayar
  -> Redirect ke tracking page
  -> Webhook update status otomatis
```

---

## 5. ENVIRONMENT VARIABLES YANG PERLU DITAMBAH

### Backend (`server/.env`)
```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
MIDTRANS_MERCHANT_ID=G999999999
MIDTRANS_IS_PRODUCTION=false

# Platform Fee (percentage)
PLATFORM_FEE_PERCENT=5
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

---

## 6. MIGRATION PLAN

```sql
-- Migration: add_midtrans_payment_tables

-- 1. Create transactions table
CREATE TABLE "transactions" (
  "id" TEXT NOT NULL,
  "order_id" TEXT NOT NULL,           -- FK ke Order
  "midtrans_order_id" TEXT NOT NULL,  -- Unique Midtrans ID
  "tenant_id" TEXT NOT NULL,          -- FK ke Tenant
  "gross_amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'IDR',
  "platform_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "platform_fee_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "merchant_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "snap_token" TEXT,
  "snap_redirect_url" TEXT,
  "midtrans_transaction_id" TEXT,
  "payment_type" TEXT,
  "bank" TEXT,
  "va_number" TEXT,
  "transaction_status" TEXT NOT NULL DEFAULT 'pending',
  "fraud_status" TEXT,
  "customer_name" TEXT,
  "customer_email" TEXT,
  "customer_phone" TEXT,
  "item_details" JSONB,
  "metadata" JSONB,
  "transaction_time" TIMESTAMP(3),
  "settlement_time" TIMESTAMP(3),
  "expiry_time" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- 2. Create transaction_logs table
CREATE TABLE "transaction_logs" (
  "id" TEXT NOT NULL,
  "transaction_id" TEXT NOT NULL,
  "event" TEXT NOT NULL,
  "previous_status" TEXT,
  "new_status" TEXT,
  "raw_notification" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "transaction_logs_pkey" PRIMARY KEY ("id")
);

-- 3. Add unique constraints
CREATE UNIQUE INDEX "transactions_midtrans_order_id_key" ON "transactions"("midtrans_order_id");
CREATE UNIQUE INDEX "transactions_midtrans_transaction_id_key" ON "transactions"("midtrans_transaction_id");

-- 4. Add indexes
CREATE INDEX "transactions_tenant_id_idx" ON "transactions"("tenant_id");
CREATE INDEX "transactions_order_id_idx" ON "transactions"("order_id");
CREATE INDEX "transactions_midtrans_order_id_idx" ON "transactions"("midtrans_order_id");
CREATE INDEX "transactions_transaction_status_idx" ON "transactions"("transaction_status");
CREATE INDEX "transactions_tenant_id_transaction_status_idx" ON "transactions"("tenant_id", "transaction_status");
CREATE INDEX "transactions_tenant_id_created_at_idx" ON "transactions"("tenant_id", "created_at");
CREATE INDEX "transaction_logs_transaction_id_idx" ON "transaction_logs"("transaction_id");
CREATE INDEX "transaction_logs_transaction_id_created_at_idx" ON "transaction_logs"("transaction_id", "created_at");

-- 5. Add foreign keys
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_fkey"
  FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "transaction_logs" ADD CONSTRAINT "transaction_logs_transaction_id_fkey"
  FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## 7. REVENUE MODEL (Platform Fee)

```
Customer bayar: Rp 100,000
  |
  v
Masuk ke Platform Midtrans Account
  |
  v
Platform hitung:
  - Midtrans fee (~2.9% CC, ~1% VA): ditanggung platform/customer (configurable)
  - Platform commission (5%): Rp 5,000
  - Tenant receivable: Rp 95,000
  |
  v
Di Transaction record:
  - grossAmount: 100,000
  - platformFeePercent: 5
  - platformFee: 5,000
  - merchantAmount: 95,000
  |
  v
Settlement (weekly/monthly):
  Platform transfer Rp 95,000 ke tenant
```

---

## 8. CHECKLIST KESIAPAN

### Backend Ready
- [x] NestJS framework cocok
- [x] Prisma ORM siap extend
- [x] JWT auth sudah ada
- [x] Rate limiting sudah ada
- [x] CORS sudah configured
- [x] Multi-tenant isolation sudah ada
- [x] Auto-reply WhatsApp notification sudah ada (akan otomatis trigger saat payment status berubah)
- [x] Order service punya `updatePaymentStatus()` method
- [ ] Perlu install `midtrans-client`
- [ ] Perlu buat `payment/` module
- [ ] Perlu tambah env variables
- [ ] Perlu migration schema

### Frontend Ready
- [x] Cart system sudah ada (Zustand)
- [x] Checkout form sudah ada
- [x] Order tracking sudah ada
- [x] API client pattern sudah ada
- [x] Radix UI components ready
- [ ] Perlu buat Snap.js hook
- [ ] Perlu buat payment API service
- [ ] Perlu modify checkout dialog
- [ ] Perlu tambah env variable

---

**Dokumen selanjutnya:**
- `02_BACKEND_IMPLEMENTATION.md` - Step-by-step backend
- `03_FRONTEND_IMPLEMENTATION.md` - Step-by-step frontend

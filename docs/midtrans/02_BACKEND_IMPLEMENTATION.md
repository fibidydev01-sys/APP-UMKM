# Midtrans Backend Implementation - Step by Step

## Konteks: UMKM Bayar ke Platform untuk Upgrade Plan (Subscription)

> Bukan customer checkout. Yang bayar = UMKM owner (Tenant).
> Yang terima = Platform (Fibidy).
> Untuk: Upgrade dari Starter (Free) ke Business (Rp 149.000/bulan).

---

## STEP 1: Install Package

```bash
cd server
npm install midtrans-client
```

Hanya 1 package baru.

---

## STEP 2: Tambah Environment Variables

### File: `server/.env`

```env
# ==========================================
# MIDTRANS PAYMENT GATEWAY (Platform Account)
# ==========================================
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
MIDTRANS_MERCHANT_ID=G999999999
MIDTRANS_IS_PRODUCTION=false

# ==========================================
# SUBSCRIPTION PRICING
# ==========================================
SUBSCRIPTION_BUSINESS_PRICE=149000
SUBSCRIPTION_BUSINESS_PERIOD_DAYS=30
```

### File: `server/.env.example`

Tambah template yang sama (tanpa value sensitif).

---

## STEP 3: Update Prisma Schema

### File: `server/prisma/schema.prisma`

#### 3a. Tambah Enums

```prisma
enum SubscriptionPlan {
  STARTER
  BUSINESS
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PAST_DUE
}
```

#### 3b. Tambah Model `Subscription`

```prisma
// ==========================================
// SUBSCRIPTION (Plan UMKM)
// ==========================================

model Subscription {
  id                 String             @id @default(cuid())

  tenantId           String             @unique
  tenant             Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  plan               SubscriptionPlan   @default(STARTER)
  status             SubscriptionStatus @default(ACTIVE)

  // Periode aktif (null = Starter/free, tidak ada expiry)
  currentPeriodStart DateTime?          @map("current_period_start")
  currentPeriodEnd   DateTime?          @map("current_period_end")

  // Harga saat subscribe (snapshot, bisa berubah di kemudian hari)
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

#### 3c. Tambah Model `SubscriptionPayment`

```prisma
// ==========================================
// SUBSCRIPTION PAYMENT (Pembayaran via Midtrans)
// ==========================================

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

  // Status: pending | settlement | capture | cancel | deny | expire | failure | refund
  paymentStatus         String       @default("pending") @map("payment_status")
  fraudStatus           String?      @map("fraud_status")

  // Periode yang dibayar
  periodStart           DateTime     @map("period_start")
  periodEnd             DateTime     @map("period_end")

  // Webhook raw data (untuk audit/debugging)
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

#### 3d. Update Model `Tenant` - Tambah Relasi

```prisma
model Tenant {
  // ... existing fields ...

  // Subscription
  subscription          Subscription?
  subscriptionPayments  SubscriptionPayment[]

  // ... existing relations (products, orders, etc.) ...
}
```

#### 3e. Jalankan Migration

```bash
npx prisma migrate dev --name add_subscription_payment
npx prisma generate
```

---

## STEP 4: Buat Plan Limits Config

### File: `server/src/subscription/plan-limits.ts` (BARU)

```typescript
/**
 * Definisi limit per plan
 * Kalau plan baru ditambah, cukup tambah di sini
 */
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

export type PlanName = keyof typeof PLAN_LIMITS;
export type PlanFeature = keyof typeof PLAN_LIMITS.STARTER;
```

---

## STEP 5: Buat Midtrans Config

### File: `server/src/config/midtrans.config.ts` (BARU)

```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('midtrans', () => ({
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
  merchantId: process.env.MIDTRANS_MERCHANT_ID,
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
}));
```

### Update: `server/src/app.module.ts`

```typescript
import midtransConfig from './config/midtrans.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [midtransConfig],  // TAMBAHKAN
    }),
    // ... existing modules ...
    SubscriptionModule,  // TAMBAHKAN
    PaymentModule,       // TAMBAHKAN
  ],
})
export class AppModule {}
```

---

## STEP 6: Buat Subscription Service

### File: `server/src/subscription/subscription.service.ts` (BARU)

```typescript
import {
  Injectable,
  Logger,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PLAN_LIMITS, PlanFeature } from './plan-limits';
import { SubscriptionPlan } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get subscription tenant (auto-create Starter kalau belum ada)
   */
  async getSubscription(tenantId: string) {
    let subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
    });

    // Auto-create STARTER subscription kalau belum ada
    if (!subscription) {
      subscription = await this.prisma.subscription.create({
        data: {
          tenantId,
          plan: 'STARTER',
          status: 'ACTIVE',
          priceAmount: 0,
        },
      });
    }

    return subscription;
  }

  /**
   * Get plan info + usage counts
   */
  async getPlanInfo(tenantId: string) {
    const subscription = await this.getSubscription(tenantId);
    const limits = PLAN_LIMITS[subscription.plan];

    // Count current usage
    const [productCount, customerCount] = await Promise.all([
      this.prisma.product.count({ where: { tenantId } }),
      this.prisma.customer.count({ where: { tenantId } }),
    ]);

    return {
      subscription,
      limits,
      usage: {
        products: productCount,
        customers: customerCount,
      },
      isAtLimit: {
        products: productCount >= limits.maxProducts,
        customers: customerCount >= limits.maxCustomers,
      },
    };
  }

  /**
   * Cek apakah tenant boleh pakai fitur tertentu
   */
  async checkFeatureAccess(tenantId: string, feature: PlanFeature): Promise<boolean> {
    const subscription = await this.getSubscription(tenantId);

    // Cek apakah subscription masih aktif
    if (subscription.plan === 'BUSINESS') {
      if (subscription.status !== 'ACTIVE') return false;
      if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < new Date()) {
        return false; // Expired
      }
    }

    return !!PLAN_LIMITS[subscription.plan][feature];
  }

  /**
   * Cek limit produk sebelum create
   * Throw error kalau sudah mentok
   */
  async checkProductLimit(tenantId: string) {
    const subscription = await this.getSubscription(tenantId);
    const limit = PLAN_LIMITS[subscription.plan].maxProducts;

    if (limit === Infinity) return; // Unlimited

    const count = await this.prisma.product.count({ where: { tenantId } });

    if (count >= limit) {
      throw new ForbiddenException(
        `Batas ${limit} produk tercapai. Upgrade ke Business untuk produk unlimited.`,
      );
    }
  }

  /**
   * Cek limit customer sebelum create
   */
  async checkCustomerLimit(tenantId: string) {
    const subscription = await this.getSubscription(tenantId);
    const limit = PLAN_LIMITS[subscription.plan].maxCustomers;

    if (limit === Infinity) return;

    const count = await this.prisma.customer.count({ where: { tenantId } });

    if (count >= limit) {
      throw new ForbiddenException(
        `Batas ${limit} pelanggan tercapai. Upgrade ke Business untuk pelanggan unlimited.`,
      );
    }
  }

  /**
   * Activate Business plan (dipanggil setelah payment success)
   */
  async activateBusinessPlan(tenantId: string, periodDays: number, price: number) {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + periodDays);

    const subscription = await this.prisma.subscription.upsert({
      where: { tenantId },
      create: {
        tenantId,
        plan: 'BUSINESS',
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        priceAmount: price,
      },
      update: {
        plan: 'BUSINESS',
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        priceAmount: price,
        cancelledAt: null,
        cancelReason: null,
      },
    });

    this.logger.log(`Tenant ${tenantId} upgraded to BUSINESS until ${periodEnd.toISOString()}`);

    return subscription;
  }

  /**
   * Get payment history tenant
   */
  async getPaymentHistory(tenantId: string) {
    return this.prisma.subscriptionPayment.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
```

---

## STEP 7: Buat Subscription Controller

### File: `server/src/subscription/subscription.controller.ts` (BARU)

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Get current plan info + usage
   * GET /api/subscription/me
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyPlan(@CurrentTenant() tenantId: string) {
    return this.subscriptionService.getPlanInfo(tenantId);
  }

  /**
   * Get payment history
   * GET /api/subscription/payments
   */
  @Get('payments')
  @UseGuards(JwtAuthGuard)
  async getPaymentHistory(@CurrentTenant() tenantId: string) {
    return this.subscriptionService.getPaymentHistory(tenantId);
  }
}
```

---

## STEP 8: Buat Midtrans Service (untuk Subscription Payment)

### File: `server/src/payment/midtrans.service.ts` (BARU)

```typescript
import {
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class MidtransService {
  private readonly logger = new Logger(MidtransService.name);
  private readonly snap: any;
  private readonly core: any;
  private readonly serverKey: string;
  private readonly isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    this.serverKey = this.configService.get<string>('midtrans.serverKey');
    this.isProduction = this.configService.get<boolean>('midtrans.isProduction');

    const clientKey = this.configService.get<string>('midtrans.clientKey');

    this.snap = new midtransClient.Snap({
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      clientKey,
    });

    this.core = new midtransClient.CoreApi({
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      clientKey,
    });
  }

  /**
   * Create Snap transaction untuk upgrade subscription
   */
  async createSubscriptionPayment(tenantId: string) {
    // 1. Get tenant info
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, slug: true, name: true, email: true, phone: true, whatsapp: true },
    });

    if (!tenant) throw new BadRequestException('Tenant tidak ditemukan');

    // 2. Get current subscription
    const subscription = await this.subscriptionService.getSubscription(tenantId);

    if (subscription.plan === 'BUSINESS' && subscription.status === 'ACTIVE') {
      // Cek apakah masih aktif
      if (subscription.currentPeriodEnd && subscription.currentPeriodEnd > new Date()) {
        throw new BadRequestException('Subscription Business masih aktif');
      }
      // Kalau expired, boleh perpanjang
    }

    // 3. Check existing pending payment
    const existingPending = await this.prisma.subscriptionPayment.findFirst({
      where: { tenantId, paymentStatus: 'pending' },
      orderBy: { createdAt: 'desc' },
    });

    if (existingPending?.snapToken) {
      const tokenAge = Date.now() - existingPending.createdAt.getTime();
      const isExpired = tokenAge > 24 * 60 * 60 * 1000; // 24 jam

      if (!isExpired) {
        // Return existing snap token
        return {
          token: existingPending.snapToken,
          redirect_url: existingPending.snapRedirectUrl,
          payment_id: existingPending.id,
          order_id: existingPending.midtransOrderId,
        };
      }
    }

    // 4. Pricing
    const price = parseInt(this.configService.get('SUBSCRIPTION_BUSINESS_PRICE', '149000'));
    const periodDays = parseInt(this.configService.get('SUBSCRIPTION_BUSINESS_PERIOD_DAYS', '30'));

    // 5. Generate unique order ID
    const timestamp = Date.now();
    const midtransOrderId = `SUB-${tenant.slug}-${timestamp}`;

    // 6. Calculate period
    const periodStart = new Date();
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + periodDays);

    // 7. Build Midtrans parameter
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: price,
      },
      item_details: [
        {
          id: 'business-plan',
          name: `Fibidy Business Plan (${periodDays} hari)`,
          price: price,
          quantity: 1,
        },
      ],
      customer_details: {
        first_name: tenant.name,
        email: tenant.email,
        phone: tenant.whatsapp || tenant.phone || '',
      },
      callbacks: {
        finish: `${frontendUrl}/dashboard/subscription?payment=finish`,
        unfinish: `${frontendUrl}/dashboard/subscription?payment=unfinish`,
        error: `${frontendUrl}/dashboard/subscription?payment=error`,
      },
    };

    this.logger.log(`Creating subscription payment: ${midtransOrderId} for tenant ${tenant.slug}`);

    try {
      // 8. Call Midtrans Snap
      const snapResponse = await this.snap.createTransaction(parameter);

      // 9. Save payment record
      const payment = await this.prisma.subscriptionPayment.create({
        data: {
          subscriptionId: subscription.id,
          tenantId,
          midtransOrderId,
          snapToken: snapResponse.token,
          snapRedirectUrl: snapResponse.redirect_url,
          amount: price,
          currency: 'IDR',
          paymentStatus: 'pending',
          periodStart,
          periodEnd,
        },
      });

      this.logger.log(`Payment created: ${payment.id}`);

      return {
        token: snapResponse.token,
        redirect_url: snapResponse.redirect_url,
        payment_id: payment.id,
        order_id: midtransOrderId,
      };
    } catch (error) {
      this.logger.error(`Midtrans error: ${error.message}`, error.stack);
      throw new BadRequestException(`Gagal membuat pembayaran: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature (SHA-512)
   */
  verifySignature(notification: any): boolean {
    const { order_id, status_code, gross_amount, signature_key } = notification;
    const input = `${order_id}${status_code}${gross_amount}${this.serverKey}`;
    const hash = crypto.createHash('sha512').update(input).digest('hex');
    return hash === signature_key;
  }

  /**
   * Handle webhook notification dari Midtrans
   */
  async handleNotification(notification: any) {
    const {
      order_id,
      transaction_id,
      transaction_status,
      fraud_status,
      payment_type,
      gross_amount,
      settlement_time,
    } = notification;

    this.logger.log(`Webhook: ${order_id} -> ${transaction_status}`);

    // 1. Verify signature
    if (!this.verifySignature(notification)) {
      this.logger.warn(`Invalid signature: ${order_id}`);
      throw new BadRequestException('Invalid signature');
    }

    // 2. Find payment
    const payment = await this.prisma.subscriptionPayment.findUnique({
      where: { midtransOrderId: order_id },
      include: { subscription: true },
    });

    if (!payment) {
      this.logger.warn(`Payment not found: ${order_id}`);
      throw new BadRequestException('Payment not found');
    }

    // 3. Idempotency: skip kalau sudah terminal
    const terminalStatuses = ['settlement', 'capture', 'cancel', 'deny', 'expire', 'refund'];
    if (terminalStatuses.includes(payment.paymentStatus) && payment.paymentStatus === transaction_status) {
      return { status: 'already_processed' };
    }

    // 4. Update payment record
    await this.prisma.subscriptionPayment.update({
      where: { id: payment.id },
      data: {
        midtransTransactionId: transaction_id,
        paymentStatus: transaction_status,
        fraudStatus: fraud_status,
        paymentType: payment_type,
        bank: payment_type === 'bank_transfer'
          ? notification.va_numbers?.[0]?.bank
          : payment_type === 'echannel' ? 'mandiri' : null,
        vaNumber: payment_type === 'bank_transfer'
          ? notification.va_numbers?.[0]?.va_number
          : payment_type === 'echannel' ? notification.bill_key : null,
        rawNotification: notification,
        paidAt: (transaction_status === 'settlement' || transaction_status === 'capture')
          ? new Date(settlement_time || new Date())
          : null,
      },
    });

    // 5. Activate subscription kalau bayar sukses
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      const price = parseFloat(gross_amount);
      const periodDays = parseInt(this.configService.get('SUBSCRIPTION_BUSINESS_PERIOD_DAYS', '30'));

      await this.subscriptionService.activateBusinessPlan(
        payment.tenantId,
        periodDays,
        price,
      );

      this.logger.log(`Subscription activated for tenant: ${payment.tenantId}`);
    }

    // 6. Handle failed/cancelled
    if (['deny', 'cancel', 'expire', 'failure'].includes(transaction_status)) {
      this.logger.log(`Payment failed for ${order_id}: ${transaction_status}`);
      // Subscription tetap di plan sebelumnya, tidak perlu action
    }

    return { status: 'success' };
  }

  /**
   * Get client key untuk frontend
   */
  getClientKey(): string {
    return this.configService.get<string>('midtrans.clientKey');
  }
}
```

---

## STEP 9: Buat Payment Controller

### File: `server/src/payment/payment.controller.ts` (BARU)

```typescript
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MidtransService } from './midtrans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly midtransService: MidtransService) {}

  /**
   * Get Midtrans Client Key (untuk frontend load Snap.js)
   * GET /api/payment/client-key
   * PUBLIC
   */
  @Get('client-key')
  getClientKey() {
    return { clientKey: this.midtransService.getClientKey() };
  }

  /**
   * Create subscription payment (upgrade to Business)
   * POST /api/payment/subscribe
   * PROTECTED - tenant owner only
   */
  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  async createSubscription(@CurrentTenant() tenantId: string) {
    return this.midtransService.createSubscriptionPayment(tenantId);
  }

  /**
   * Webhook dari Midtrans
   * POST /api/payment/webhook
   * PUBLIC - TANPA AUTH (dipanggil Midtrans server, diamankan signature)
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() notification: any) {
    this.logger.log(`Webhook: ${notification.order_id} -> ${notification.transaction_status}`);

    try {
      await this.midtransService.handleNotification(notification);
      return { status: 'success' };
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`, error.stack);
      // Return 200 agar Midtrans tidak retry terus
      return { status: 'error', message: error.message };
    }
  }
}
```

---

## STEP 10: Buat Modules

### File: `server/src/subscription/subscription.module.ts` (BARU)

```typescript
import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
```

### File: `server/src/payment/payment.module.ts` (BARU)

```typescript
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { MidtransService } from './midtrans.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [PrismaModule, SubscriptionModule],
  controllers: [PaymentController],
  providers: [MidtransService],
  exports: [MidtransService],
})
export class PaymentModule {}
```

---

## STEP 11: Enforce Limits di Existing Services

### File: `server/src/products/products.service.ts` (UPDATE)

Tambahkan cek limit di method `create()`:

```typescript
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private subscriptionService: SubscriptionService,  // INJECT
    // ... existing deps ...
  ) {}

  async create(tenantId: string, dto: CreateProductDto) {
    // TAMBAHKAN: Cek limit plan
    await this.subscriptionService.checkProductLimit(tenantId);

    // ... existing create logic ...
  }
}
```

### File: `server/src/customers/customers.service.ts` (UPDATE)

Sama, tambah cek limit di method create:

```typescript
async create(tenantId: string, dto: CreateCustomerDto) {
  // TAMBAHKAN: Cek limit plan
  await this.subscriptionService.checkCustomerLimit(tenantId);

  // ... existing create logic ...
}
```

### Update Module Imports

`products.module.ts` dan `customers.module.ts` perlu import `SubscriptionModule`:

```typescript
imports: [PrismaModule, SubscriptionModule],
```

---

## STEP 12: Register di AppModule

### File: `server/src/app.module.ts` (UPDATE)

```typescript
import { SubscriptionModule } from './subscription/subscription.module';
import { PaymentModule } from './payment/payment.module';
import midtransConfig from './config/midtrans.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [midtransConfig],
    }),
    // ... existing modules ...
    SubscriptionModule,
    PaymentModule,
  ],
})
export class AppModule {}
```

---

## STEP 13: Konfigurasi Midtrans Dashboard

### Payment Notification URL (Webhook)
```
Midtrans Dashboard > Settings > Configuration > Payment Notification URL
https://your-api.com/api/payment/webhook
```

### Redirect URLs
Sudah di-handle via callbacks di code:
```
Finish:   /dashboard/subscription?payment=finish
Unfinish: /dashboard/subscription?payment=unfinish
Error:    /dashboard/subscription?payment=error
```

### Enable Payment Methods
```
Settings > Configuration > Payment Methods
- Bank Transfer (BCA VA, BNI VA, BRI VA, Mandiri Bill, Permata VA)
- E-Wallet (GoPay, ShopeePay)
- QRIS
- Credit/Debit Card
- Convenience Store (Indomaret, Alfamart)
```

---

## API ENDPOINTS (Summary)

```
# Subscription
GET  /api/subscription/me          <- Get plan info + usage (PROTECTED)
GET  /api/subscription/payments    <- Payment history (PROTECTED)

# Payment
GET  /api/payment/client-key       <- Midtrans client key (PUBLIC)
POST /api/payment/subscribe        <- Create payment for upgrade (PROTECTED)
POST /api/payment/webhook          <- Midtrans webhook (PUBLIC, no auth)
```

---

## FILE CHANGES SUMMARY

### BARU:
```
server/src/config/midtrans.config.ts
server/src/subscription/subscription.module.ts
server/src/subscription/subscription.controller.ts
server/src/subscription/subscription.service.ts
server/src/subscription/plan-limits.ts
server/src/payment/payment.module.ts
server/src/payment/payment.controller.ts
server/src/payment/midtrans.service.ts
```

### UPDATE:
```
server/.env                           -> MIDTRANS_*, SUBSCRIPTION_* vars
server/.env.example                   -> Template
server/prisma/schema.prisma           -> Subscription, SubscriptionPayment, enums, Tenant relasi
server/src/app.module.ts              -> Import modules + config
server/src/products/products.service.ts  -> checkProductLimit()
server/src/products/products.module.ts   -> Import SubscriptionModule
server/src/customers/customers.service.ts -> checkCustomerLimit()
server/src/customers/customers.module.ts  -> Import SubscriptionModule
```

### PACKAGE:
```
npm install midtrans-client
```

---

## SECURITY CHECKLIST

- [x] Webhook signature verification (SHA-512)
- [x] Server key hanya di backend env
- [x] Webhook endpoint tanpa JWT (diamankan signature)
- [x] Idempotency (skip duplicate webhooks)
- [x] Rate limiting dari global ThrottlerGuard
- [x] Input validation
- [x] Tenant isolation (tenantId check di semua query)
- [x] Snap token reuse (tidak generate baru kalau pending masih ada)
- [x] Existing pending payment check sebelum buat baru

---

## TESTING

### Test Upgrade Flow
```bash
# 1. Login
POST /api/auth/login
-> JWT token

# 2. Cek plan sekarang
GET /api/subscription/me
-> { plan: "STARTER", usage: { products: 5, customers: 10 } }

# 3. Upgrade
POST /api/payment/subscribe
-> { token: "snap-xxx", redirect_url: "https://..." }

# 4. Buka redirect_url di browser -> Snap UI
# 5. Bayar (sandbox)
# 6. Webhook datang otomatis

# 7. Cek plan sekarang
GET /api/subscription/me
-> { plan: "BUSINESS", status: "ACTIVE", currentPeriodEnd: "2026-03-10T..." }
```

### Test Limit Enforcement
```bash
# Dengan plan STARTER, coba create produk ke-51:
POST /api/products
-> 403: "Batas 50 produk tercapai. Upgrade ke Business untuk produk unlimited."
```

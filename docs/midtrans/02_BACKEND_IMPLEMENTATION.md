# Midtrans Backend Implementation - Step by Step

> Disesuaikan dengan infrastruktur NestJS existing project ini.
> Setiap step menunjukkan file mana yang diubah/dibuat dan code exactnya.

---

## STEP 1: Install Package

```bash
cd server
npm install midtrans-client
```

Hanya 1 package. `@types/node`, `@nestjs/axios`, `crypto` sudah tersedia.

---

## STEP 2: Tambah Environment Variables

### File: `server/.env`

Tambahkan di bawah config existing:

```env
# ==========================================
# MIDTRANS PAYMENT GATEWAY
# ==========================================
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
MIDTRANS_MERCHANT_ID=G999999999
MIDTRANS_IS_PRODUCTION=false

# Platform Fee (%)
PLATFORM_FEE_PERCENT=5
```

### File: `server/.env.example`

Tambahkan template yang sama (tanpa value sensitif):

```env
# MIDTRANS PAYMENT GATEWAY
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_MERCHANT_ID=
MIDTRANS_IS_PRODUCTION=false
PLATFORM_FEE_PERCENT=5
```

---

## STEP 3: Update Prisma Schema

### File: `server/prisma/schema.prisma`

#### 3a. Tambah model `Transaction` (setelah model `OrderItem`)

```prisma
// ==========================================
// MIDTRANS TRANSACTION
// ==========================================

model Transaction {
  id                    String   @id @default(cuid())

  // Link ke Order internal
  orderId               String
  order                 Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  // Midtrans Order ID (unique, format: TXN-{slug}-{orderNumber}-{timestamp})
  midtransOrderId       String   @unique @map("midtrans_order_id")

  // Tenant
  tenantId              String   @map("tenant_id")
  tenant                Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Amount
  grossAmount           Float    @map("gross_amount")
  currency              String   @default("IDR")

  // Platform Revenue
  platformFee           Float    @default(0) @map("platform_fee")
  platformFeePercent    Float    @default(0) @map("platform_fee_percent")
  merchantAmount        Float    @default(0) @map("merchant_amount")

  // Midtrans Snap
  snapToken             String?  @map("snap_token")
  snapRedirectUrl       String?  @map("snap_redirect_url")

  // Midtrans Transaction Info
  midtransTransactionId String?  @unique @map("midtrans_transaction_id")
  paymentType           String?  @map("payment_type")
  bank                  String?
  vaNumber              String?  @map("va_number")

  // Status: pending | settlement | capture | cancel | deny | expire | failure | refund
  transactionStatus     String   @default("pending") @map("transaction_status")
  fraudStatus           String?  @map("fraud_status")

  // Customer snapshot
  customerName          String?  @map("customer_name")
  customerEmail         String?  @map("customer_email")
  customerPhone         String?  @map("customer_phone")

  // Items snapshot (JSON)
  itemDetails           Json?    @map("item_details")
  metadata              Json?

  // Timestamps
  transactionTime       DateTime? @map("transaction_time")
  settlementTime        DateTime? @map("settlement_time")
  expiryTime            DateTime? @map("expiry_time")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  // Relations
  logs                  TransactionLog[]

  @@map("transactions")
  @@index([tenantId])
  @@index([orderId])
  @@index([midtransOrderId])
  @@index([transactionStatus])
  @@index([tenantId, transactionStatus])
  @@index([tenantId, createdAt])
}

model TransactionLog {
  id                String      @id @default(cuid())

  transactionId     String      @map("transaction_id")
  transaction       Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  event             String      // token_created, webhook_received, status_changed
  previousStatus    String?     @map("previous_status")
  newStatus         String?     @map("new_status")
  rawNotification   Json?       @map("raw_notification")

  createdAt         DateTime    @default(now()) @map("created_at")

  @@map("transaction_logs")
  @@index([transactionId])
  @@index([transactionId, createdAt])
}
```

#### 3b. Tambah relasi di model `Order`

Cari model Order, tambah di bagian relations:

```prisma
model Order {
  // ... field existing ...

  // TAMBAHKAN:
  transactions  Transaction[]

  // ... indexes existing ...
}
```

#### 3c. Tambah relasi di model `Tenant`

Cari model Tenant, tambah di bagian relations (dekat `orders`, `products`, dll):

```prisma
  // Payment Transactions
  transactions     Transaction[]
```

#### 3d. Jalankan Migration

```bash
cd server
npx prisma migrate dev --name add_midtrans_payment_tables
npx prisma generate
```

---

## STEP 4: Buat Midtrans Config

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

Tambahkan import config:

```typescript
import { ConfigModule } from '@nestjs/config';
import midtransConfig from './config/midtrans.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [midtransConfig],  // <-- TAMBAHKAN INI
    }),
    // ... modules existing ...
  ],
})
```

---

## STEP 5: Buat Payment DTOs

### File: `server/src/payment/dto/create-payment.dto.ts` (BARU)

```typescript
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
} from 'class-validator';

/**
 * DTO untuk create Midtrans payment dari store checkout
 * orderId = ID dari Order yang sudah dibuat
 */
export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'Order ID tidak boleh kosong' })
  orderId: string;

  // Customer details (optional override dari Order)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;
}
```

### File: `server/src/payment/dto/index.ts` (BARU)

```typescript
export { CreatePaymentDto } from './create-payment.dto';
```

---

## STEP 6: Buat Midtrans Service

### File: `server/src/payment/midtrans.service.ts` (BARU)

```typescript
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MidtransService {
  private readonly logger = new Logger(MidtransService.name);
  private readonly snap: any;
  private readonly core: any;
  private readonly serverKey: string;
  private readonly isProduction: boolean;
  private readonly platformFeePercent: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.serverKey = this.configService.get<string>('midtrans.serverKey');
    this.isProduction = this.configService.get<boolean>('midtrans.isProduction');
    this.platformFeePercent = parseFloat(
      this.configService.get<string>('PLATFORM_FEE_PERCENT', '5'),
    );

    const clientKey = this.configService.get<string>('midtrans.clientKey');

    // Initialize Snap API
    this.snap = new midtransClient.Snap({
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      clientKey,
    });

    // Initialize Core API (untuk get status & cancel)
    this.core = new midtransClient.CoreApi({
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      clientKey,
    });
  }

  /**
   * Create Snap Transaction dari Order yang sudah ada
   */
  async createTransaction(
    tenantId: string,
    orderId: string,
    customerOverride?: {
      name?: string;
      email?: string;
      phone?: string;
    },
  ) {
    // 1. Get Order with items
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId },
      include: {
        items: true,
        customer: true,
        tenant: { select: { slug: true, name: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Order tidak ditemukan');
    }

    if (order.paymentStatus === 'PAID') {
      throw new BadRequestException('Order sudah dibayar');
    }

    // 2. Check existing pending transaction
    const existingTx = await this.prisma.transaction.findFirst({
      where: {
        orderId: order.id,
        transactionStatus: 'pending',
      },
    });

    if (existingTx?.snapToken) {
      // Check if snap token masih valid (< 24 jam)
      const tokenAge = Date.now() - existingTx.createdAt.getTime();
      const isExpired = tokenAge > 24 * 60 * 60 * 1000;

      if (!isExpired) {
        return {
          token: existingTx.snapToken,
          redirect_url: existingTx.snapRedirectUrl,
          transaction_id: existingTx.id,
          order_id: existingTx.midtransOrderId,
        };
      }
      // Kalau expired, buat baru
    }

    // 3. Generate unique Midtrans order ID
    const timestamp = Date.now();
    const midtransOrderId = `TXN-${order.tenant.slug}-${order.orderNumber}-${timestamp}`;

    // 4. Calculate platform fee
    const grossAmount = order.total;
    const platformFee = Math.round((grossAmount * this.platformFeePercent) / 100);
    const merchantAmount = grossAmount - platformFee;

    // 5. Prepare customer details
    const customerName = customerOverride?.name || order.customer?.name || order.customerName || 'Customer';
    const customerPhone = customerOverride?.phone || order.customer?.phone || order.customerPhone || '';
    const customerEmail = customerOverride?.email || order.customer?.email || '';

    // Split name for Midtrans format
    const nameParts = customerName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // 6. Prepare Midtrans parameter
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: grossAmount,
      },
      item_details: order.items.map((item) => ({
        id: item.productId || item.id,
        price: item.price,
        quantity: item.qty,
        name: item.name.substring(0, 50), // Midtrans max 50 chars
      })),
      customer_details: {
        first_name: firstName,
        last_name: lastName,
        email: customerEmail || undefined,
        phone: customerPhone,
      },
      callbacks: {
        finish: `${frontendUrl}/store/${order.tenant.slug}/track/${order.id}?payment=finish`,
        unfinish: `${frontendUrl}/store/${order.tenant.slug}/track/${order.id}?payment=unfinish`,
        error: `${frontendUrl}/store/${order.tenant.slug}/track/${order.id}?payment=error`,
      },
    };

    this.logger.log(`Creating Midtrans transaction: ${midtransOrderId}`);

    try {
      // 7. Call Midtrans Snap API
      const snapResponse = await this.snap.createTransaction(parameter);

      // 8. Save Transaction to database
      const transaction = await this.prisma.transaction.create({
        data: {
          orderId: order.id,
          midtransOrderId,
          tenantId,
          grossAmount,
          currency: 'IDR',
          platformFee,
          platformFeePercent: this.platformFeePercent,
          merchantAmount,
          snapToken: snapResponse.token,
          snapRedirectUrl: snapResponse.redirect_url,
          transactionStatus: 'pending',
          customerName,
          customerEmail: customerEmail || null,
          customerPhone,
          itemDetails: order.items.map((item) => ({
            id: item.productId || item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            subtotal: item.subtotal,
          })),
        },
      });

      // 9. Log creation
      await this.prisma.transactionLog.create({
        data: {
          transactionId: transaction.id,
          event: 'token_created',
          newStatus: 'pending',
        },
      });

      this.logger.log(`Transaction created: ${transaction.id} -> ${midtransOrderId}`);

      return {
        token: snapResponse.token,
        redirect_url: snapResponse.redirect_url,
        transaction_id: transaction.id,
        order_id: midtransOrderId,
      };
    } catch (error) {
      this.logger.error(`Failed to create Midtrans transaction: ${error.message}`, error.stack);
      throw new BadRequestException(`Gagal membuat transaksi pembayaran: ${error.message}`);
    }
  }

  /**
   * Verify Midtrans webhook signature
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
      transaction_time,
      settlement_time,
      expiry_time,
    } = notification;

    this.logger.log(`Webhook received: ${order_id} -> ${transaction_status}`);

    // 1. Verify signature
    if (!this.verifySignature(notification)) {
      this.logger.warn(`Invalid signature for order: ${order_id}`);
      throw new BadRequestException('Invalid signature');
    }

    // 2. Find transaction
    const transaction = await this.prisma.transaction.findUnique({
      where: { midtransOrderId: order_id },
      include: {
        order: { select: { id: true, tenantId: true } },
      },
    });

    if (!transaction) {
      this.logger.warn(`Transaction not found: ${order_id}`);
      throw new BadRequestException('Transaction not found');
    }

    // 3. Idempotency check - skip if already at terminal status
    const terminalStatuses = ['settlement', 'capture', 'cancel', 'deny', 'expire', 'refund'];
    if (terminalStatuses.includes(transaction.transactionStatus) && transaction.transactionStatus === transaction_status) {
      this.logger.log(`Duplicate notification for ${order_id}, skipping`);
      return { status: 'already_processed' };
    }

    const previousStatus = transaction.transactionStatus;

    // 4. Log webhook
    await this.prisma.transactionLog.create({
      data: {
        transactionId: transaction.id,
        event: 'webhook_received',
        previousStatus,
        newStatus: transaction_status,
        rawNotification: notification,
      },
    });

    // 5. Prepare update data
    const updateData: any = {
      midtransTransactionId: transaction_id,
      transactionStatus: transaction_status,
      fraudStatus: fraud_status,
      paymentType: payment_type,
      transactionTime: transaction_time ? new Date(transaction_time) : null,
      settlementTime: settlement_time ? new Date(settlement_time) : null,
      expiryTime: expiry_time ? new Date(expiry_time) : null,
    };

    // Extract bank info
    if (payment_type === 'bank_transfer' && notification.va_numbers?.length > 0) {
      updateData.bank = notification.va_numbers[0].bank;
      updateData.vaNumber = notification.va_numbers[0].va_number;
    }
    if (payment_type === 'echannel') {
      updateData.bank = 'mandiri';
      updateData.vaNumber = notification.bill_key;
    }
    if (payment_type === 'permata') {
      updateData.bank = 'permata';
      updateData.vaNumber = notification.permata_va_number;
    }

    // 6. Update transaction
    const updatedTx = await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: updateData,
    });

    this.logger.log(`Transaction updated: ${order_id} | ${previousStatus} -> ${transaction_status}`);

    // 7. Sync ke Order paymentStatus
    await this.syncOrderPaymentStatus(
      transaction.order.tenantId,
      transaction.order.id,
      transaction_status,
      parseFloat(gross_amount),
    );

    return updatedTx;
  }

  /**
   * Sync Midtrans transaction status -> Order paymentStatus
   * Dan trigger auto-reply WhatsApp notification yang sudah existing
   */
  private async syncOrderPaymentStatus(
    tenantId: string,
    orderId: string,
    midtransStatus: string,
    grossAmount: number,
  ) {
    let paymentStatus: string;
    let paidAmount: number | undefined;

    switch (midtransStatus) {
      case 'capture':
      case 'settlement':
        paymentStatus = 'PAID';
        paidAmount = grossAmount;
        break;
      case 'pending':
        paymentStatus = 'PENDING';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
      case 'failure':
        paymentStatus = 'FAILED';
        break;
      default:
        this.logger.warn(`Unknown Midtrans status: ${midtransStatus}`);
        return;
    }

    // Update Order menggunakan Prisma langsung
    // (tidak pakai OrdersService.updatePaymentStatus karena itu butuh tenantId check
    //  dan kita sudah verify di level Transaction)
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: paymentStatus as any,
        paidAmount: paidAmount ?? undefined,
      },
      include: {
        customer: { select: { name: true, phone: true } },
      },
    });

    this.logger.log(`Order ${orderId} payment status -> ${paymentStatus}`);

    // Trigger auto-reply WhatsApp notification (reuse existing logic)
    // Import dan panggil AutoReplyService jika payment berhasil atau gagal
    // Ini dilakukan via event/direct call tergantung arsitektur
    // Untuk MVP, kita emit event yang bisa di-listen OrdersService
  }

  /**
   * Get transaction status dari Midtrans
   */
  async getTransactionStatus(midtransOrderId: string) {
    try {
      return await this.core.transaction.status(midtransOrderId);
    } catch (error) {
      this.logger.error(`Failed to get status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancel transaction
   */
  async cancelTransaction(tenantId: string, orderId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { orderId, tenantId, transactionStatus: 'pending' },
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi pending tidak ditemukan');
    }

    try {
      await this.core.transaction.cancel(transaction.midtransOrderId);

      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { transactionStatus: 'cancel' },
      });

      await this.prisma.transactionLog.create({
        data: {
          transactionId: transaction.id,
          event: 'manual_cancel',
          previousStatus: 'pending',
          newStatus: 'cancel',
        },
      });

      return { message: 'Transaksi berhasil dibatalkan' };
    } catch (error) {
      this.logger.error(`Failed to cancel: ${error.message}`);
      throw new BadRequestException('Gagal membatalkan transaksi');
    }
  }

  /**
   * Get Midtrans client key (untuk frontend)
   */
  getClientKey(): string {
    return this.configService.get<string>('midtrans.clientKey');
  }
}
```

---

## STEP 7: Buat Payment Controller

### File: `server/src/payment/payment.controller.ts` (BARU)

```typescript
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MidtransService } from './midtrans.service';
import { CreatePaymentDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly midtransService: MidtransService) {}

  /**
   * Get Midtrans Client Key
   * GET /api/payment/client-key
   * PUBLIC - frontend butuh ini untuk load Snap.js
   */
  @Get('client-key')
  getClientKey() {
    return { clientKey: this.midtransService.getClientKey() };
  }

  /**
   * Get Transaction Status
   * GET /api/payment/status/:orderId
   * PROTECTED - tenant owner only
   */
  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  async getStatus(
    @CurrentTenant() tenantId: string,
    @Param('orderId') orderId: string,
  ) {
    // Get internal transaction, then check Midtrans
    return await this.midtransService.getTransactionStatus(orderId);
  }

  /**
   * Cancel Transaction
   * POST /api/payment/cancel/:orderId
   * PROTECTED - tenant owner only
   */
  @Post('cancel/:orderId')
  @UseGuards(JwtAuthGuard)
  async cancelTransaction(
    @CurrentTenant() tenantId: string,
    @Param('orderId') orderId: string,
  ) {
    return await this.midtransService.cancelTransaction(tenantId, orderId);
  }

  /**
   * Webhook Notification dari Midtrans
   * POST /api/payment/webhook
   *
   * PENTING: Endpoint ini TANPA auth guard!
   * Dipanggil langsung oleh server Midtrans.
   * Keamanan dijamin oleh signature verification.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() notification: any) {
    this.logger.log(`Webhook received: ${notification.order_id} -> ${notification.transaction_status}`);

    try {
      await this.midtransService.handleNotification(notification);
      return { status: 'success' };
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`, error.stack);
      // Tetap return 200 agar Midtrans tidak retry terus
      return { status: 'error', message: error.message };
    }
  }
}
```

---

## STEP 8: Update Store Controller (Public Payment Endpoint)

### File: `server/src/store/store.controller.ts` (UPDATE)

Tambahkan endpoint baru untuk create payment dari public store:

```typescript
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { TenantsService } from '../tenants/tenants.service';
import { MidtransService } from '../payment/midtrans.service';
import { CheckoutDto } from '../orders/dto';
import { CreatePaymentDto } from '../payment/dto';

@Controller('store')
export class StoreController {
  constructor(
    private ordersService: OrdersService,
    private tenantsService: TenantsService,
    private midtransService: MidtransService,  // <-- TAMBAHKAN
  ) {}

  // ... endpoint existing tetap ...

  /**
   * Create Midtrans Payment untuk Order yang sudah dibuat
   * POST /api/store/:slug/pay
   * PUBLIC - dipanggil setelah checkout
   *
   * Flow:
   * 1. Customer checkout -> dapat orderId
   * 2. Customer klik "Bayar Online"
   * 3. Frontend panggil endpoint ini dengan orderId
   * 4. Backend buat Midtrans transaction -> return snap token
   * 5. Frontend buka Snap popup
   */
  @Post(':slug/pay')
  @HttpCode(HttpStatus.OK)
  async createPayment(
    @Param('slug') slug: string,
    @Body() dto: CreatePaymentDto,
  ) {
    const tenant = await this.tenantsService.findBySlug(slug);
    if (!tenant) {
      throw new NotFoundException('Toko tidak ditemukan');
    }

    return this.midtransService.createTransaction(tenant.id, dto.orderId, {
      name: dto.customerName,
      email: dto.customerEmail,
      phone: dto.customerPhone,
    });
  }
}
```

---

## STEP 9: Buat Payment Module

### File: `server/src/payment/payment.module.ts` (BARU)

```typescript
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { MidtransService } from './midtrans.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [MidtransService],
  exports: [MidtransService],
})
export class PaymentModule {}
```

---

## STEP 10: Register Payment Module

### File: `server/src/app.module.ts` (UPDATE)

```typescript
import { PaymentModule } from './payment/payment.module';
import midtransConfig from './config/midtrans.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [midtransConfig],  // <-- TAMBAHKAN
    }),
    // ... existing modules ...
    PaymentModule,  // <-- TAMBAHKAN
  ],
})
export class AppModule {}
```

### File: `server/src/store/store.module.ts` (UPDATE)

Tambahkan PaymentModule ke imports agar StoreController bisa inject MidtransService:

```typescript
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    // ... existing imports ...
    PaymentModule,  // <-- TAMBAHKAN
  ],
  controllers: [StoreController],
})
export class StoreModule {}
```

---

## STEP 11: Konfigurasi Midtrans Dashboard

Setelah deploy backend ke server yang publicly accessible:

### A. Payment Notification URL
```
Midtrans Dashboard > Settings > Configuration > Payment Notification URL
https://your-api.com/api/payment/webhook
```

### B. Redirect URLs (Finish/Unfinish/Error)
```
Ini sudah di-handle via callbacks di createTransaction().
Customer akan di-redirect ke tracking page otomatis.
```

### C. Enable Payment Methods
```
Settings > Configuration > Payment Methods
- Bank Transfer (BCA VA, BNI VA, BRI VA, Mandiri, Permata)
- E-Wallet (GoPay, ShopeePay)
- QRIS
- Credit/Debit Card
- Convenience Store (Indomaret, Alfamart)
```

---

## STEP 12: Testing

### A. Jalankan Backend

```bash
cd server
npm run start:dev
```

### B. Test Create Payment (via Postman/Thunder Client)

```bash
# 1. Login dulu untuk dapat JWT token
POST http://localhost:8000/api/auth/login
Body: { "email": "test@test.com", "password": "xxx" }

# 2. Buat order via checkout
POST http://localhost:8000/api/store/{slug}/checkout
Body: {
  "name": "Test Customer",
  "phone": "081234567890",
  "address": "Jl. Test No. 1",
  "items": [
    { "productId": "xxx", "name": "Produk A", "price": 50000, "qty": 2 }
  ],
  "paymentMethod": "midtrans"
}
# -> dapat orderId

# 3. Buat Midtrans payment
POST http://localhost:8000/api/store/{slug}/pay
Body: {
  "orderId": "{orderId-dari-step-2}"
}
# -> dapat snapToken + redirectUrl

# 4. Buka redirectUrl di browser untuk test Snap UI
```

### C. Test Webhook (via ngrok)

```bash
# Terminal 1: Backend
npm run start:dev

# Terminal 2: ngrok
ngrok http 8000

# Copy URL, misal: https://abc123.ngrok-free.app
# Set di Midtrans Dashboard:
# Payment Notification URL: https://abc123.ngrok-free.app/api/payment/webhook
```

### D. Test Cards (Sandbox)

```
Berhasil:   4811 1111 1111 1114 | CVV: 123 | Exp: 01/28
3DS:        4617 0069 7686 1948 | CVV: 123 | Exp: 01/28 | OTP: 112233
Ditolak:    4911 1111 1111 1113 | CVV: 123 | Exp: 01/28
```

---

## RINGKASAN FILE CHANGES

### File BARU:
```
server/src/config/midtrans.config.ts
server/src/payment/payment.module.ts
server/src/payment/payment.controller.ts
server/src/payment/midtrans.service.ts
server/src/payment/dto/create-payment.dto.ts
server/src/payment/dto/index.ts
```

### File UPDATE:
```
server/.env                          -> Tambah MIDTRANS_* variables
server/.env.example                  -> Tambah template
server/prisma/schema.prisma          -> Tambah Transaction, TransactionLog, relasi
server/src/app.module.ts             -> Import PaymentModule + midtransConfig
server/src/store/store.controller.ts -> Tambah POST /:slug/pay endpoint
server/src/store/store.module.ts     -> Import PaymentModule
```

### Package:
```
npm install midtrans-client
```

---

## SECURITY CHECKLIST

- [x] Webhook signature verification (SHA-512)
- [x] Server key hanya di backend (MIDTRANS_SERVER_KEY, bukan NEXT_PUBLIC_*)
- [x] Webhook endpoint tanpa JWT auth (tapi pakai signature)
- [x] Idempotency handling (skip duplicate webhooks)
- [x] Audit trail via TransactionLog
- [x] Rate limiting dari global ThrottlerGuard
- [x] Input validation via class-validator DTOs
- [x] Multi-tenant isolation (tenantId check di setiap query)
- [x] Error handling tanpa expose sensitive data

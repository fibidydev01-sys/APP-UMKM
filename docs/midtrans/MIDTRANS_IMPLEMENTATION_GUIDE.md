# 📘 Dokumentasi Implementasi Midtrans Payment Gateway

## NestJS Backend + Next.js Frontend

---

## 📋 Daftar Isi

1. [Overview & Arsitektur](#overview--arsitektur)
2. [Prerequisite](#prerequisite)
3. [Setup Akun Midtrans](#setup-akun-midtrans)
4. [Package & Dependencies](#package--dependencies)
5. [Backend Implementation (NestJS)](#backend-implementation-nestjs)
6. [Frontend Implementation (Next.js)](#frontend-implementation-nextjs)
7. [Security & Best Practices](#security--best-practices)
8. [Testing & Debugging](#testing--debugging)
9. [Multi-Tenant Considerations](#multi-tenant-considerations)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview & Arsitektur

### Flow Diagram
```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Next.js    │      │   NestJS     │      │   Midtrans   │
│   Frontend   │◄────►│   Backend    │◄────►│   Server     │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                      │
       │  1. Request Token   │                      │
       ├────────────────────►│                      │
       │                     │  2. Create Snap      │
       │                     │     Transaction      │
       │                     ├─────────────────────►│
       │                     │                      │
       │                     │  3. Return Token     │
       │                     │◄─────────────────────│
       │  4. Snap Token      │                      │
       │◄────────────────────┤                      │
       │                     │                      │
       │  5. Open Snap UI    │                      │
       ├──────────────────────────────────────────►│
       │                     │                      │
       │  6. Payment         │                      │
       ├◄────────────────────────────────────────►│
       │                     │                      │
       │                     │  7. Webhook          │
       │                     │     Notification     │
       │                     │◄─────────────────────│
       │                     │                      │
       │  8. Update Status   │                      │
       │◄────────────────────┤                      │
       │                     │                      │
```

### Metode Integrasi Midtrans

#### 1. **Snap API** (Recommended)
- UI payment page sudah disediakan Midtrans
- Customizable dengan callback
- Support semua payment method
- Implementasi tercepat

#### 2. **Core API**
- Full custom UI di frontend
- Kontrol penuh atas UX
- Lebih kompleks
- Butuh handle setiap payment method

#### 3. **Payment Link**
- Generate link dari dashboard
- No code integration
- Tidak cocok untuk UMKM multi-tenant

**Pilihan untuk project ini: Snap API**

---

## 🔧 Prerequisite

### System Requirements
- Node.js >= 18.0.0
- npm >= 9.0.0
- NestJS 11.x
- Next.js 16.x
- Database (PostgreSQL dengan Prisma)

### Tech Stack Existing
```json
{
  "backend": {
    "framework": "NestJS 11.0.1",
    "database": "Prisma 6.0.1 + PostgreSQL",
    "auth": "@nestjs/jwt 11.0.2",
    "validation": "class-validator 0.14.3",
    "api": "@nestjs/axios 4.0.1"
  },
  "frontend": {
    "framework": "Next.js 16.1.1",
    "ui": "Radix UI + Tailwind CSS",
    "forms": "react-hook-form 7.69.0",
    "state": "zustand 5.0.9"
  }
}
```

---

## 🏦 Setup Akun Midtrans

### 1. Registrasi Akun

1. **Buka** https://midtrans.com
2. **Klik** "Sign Up" atau "Get Started"
3. **Isi** data business:
   - Business Name
   - Business Type
   - Email
   - Phone Number
4. **Verifikasi** email & phone

### 2. Dapatkan API Credentials

#### Sandbox (Development)
```bash
# Login ke Dashboard Sandbox
https://dashboard.sandbox.midtrans.com

# Navigate to: Settings > Access Keys

CLIENT_KEY: SB-Mid-client-xxxxxxxxxx
SERVER_KEY: SB-Mid-server-xxxxxxxxxx
MERCHANT_ID: G999999999
```

#### Production
```bash
# Login ke Dashboard Production
https://dashboard.midtrans.com

# Navigate to: Settings > Access Keys

CLIENT_KEY: Mid-client-xxxxxxxxxx
SERVER_KEY: Mid-server-xxxxxxxxxx
MERCHANT_ID: G999999999
```

### 3. Konfigurasi Dashboard

#### Payment Notification URL
```
Settings > Configuration > Payment Notification URL
https://your-api.com/api/midtrans/webhook
```

#### Redirect URLs
```
Finish URL: https://your-app.com/payment/success
Unfinish URL: https://your-app.com/payment/pending
Error URL: https://your-app.com/payment/error
```

#### Payment Methods
```
Settings > Configuration > Payment Methods
☑ Credit/Debit Card
☑ Bank Transfer (BCA, BNI, BRI, Mandiri, Permata)
☑ E-Wallet (GoPay, ShopeePay, Dana, LinkAja)
☑ QRIS
☑ Indomaret / Alfamart
☑ Akulaku
☑ Kredivo
```

---

## 📦 Package & Dependencies

### Backend (NestJS)

#### Option 1: Official Midtrans Client
```bash
npm install midtrans-client
npm install --save-dev @types/node
```

#### Option 2: Community NestJS Module (Alternative)
```bash
npm install @ruraim/nestjs-midtrans
```

**Recommendation:** Gunakan `midtrans-client` official untuk kontrol lebih baik

### Frontend (Next.js)

```bash
# No additional package needed
# Snap.js akan di-load via CDN
```

---

## 🔨 Backend Implementation (NestJS)

### 1. Environment Configuration

#### `.env` atau `.env.local`
```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
MIDTRANS_MERCHANT_ID=G999999999
MIDTRANS_IS_PRODUCTION=false

# Midtrans URLs
MIDTRANS_SNAP_URL_SANDBOX=https://app.sandbox.midtrans.com/snap/v1/transactions
MIDTRANS_SNAP_URL_PRODUCTION=https://app.midtrans.com/snap/v1/transactions

# Application URLs
APP_FRONTEND_URL=http://localhost:3000
APP_BACKEND_URL=http://localhost:8000
```

### 2. Prisma Schema Update

```prisma
// prisma/schema.prisma

model Transaction {
  id                 String   @id @default(uuid())
  orderId            String   @unique @map("order_id") // Midtrans order_id
  
  // Tenant Info (Multi-tenant)
  tenantId           String   @map("tenant_id")
  tenant             Tenant   @relation(fields: [tenantId], references: [id])
  
  // Transaction Details
  grossAmount        Decimal  @map("gross_amount") @db.Decimal(15, 2)
  currency           String   @default("IDR")
  
  // Midtrans Response
  snapToken          String?  @map("snap_token")
  snapRedirectUrl    String?  @map("snap_redirect_url")
  transactionId      String?  @unique @map("transaction_id") // From Midtrans
  
  // Payment Info
  paymentType        String?  @map("payment_type") // bank_transfer, gopay, credit_card
  bank               String?  // bca, bni, mandiri, etc
  vaNumber           String?  @map("va_number") // Virtual Account Number
  
  // Status
  transactionStatus  String   @default("pending") @map("transaction_status")
  // pending, settlement, cancel, deny, expire, failure
  fraudStatus        String?  @map("fraud_status") // accept, challenge, deny
  
  // Customer Details
  customerName       String?  @map("customer_name")
  customerEmail      String?  @map("customer_email")
  customerPhone      String?  @map("customer_phone")
  
  // Items (JSON)
  itemDetails        Json?    @map("item_details")
  
  // Metadata
  metadata           Json?    // Additional data
  
  // Timestamps
  transactionTime    DateTime? @map("transaction_time")
  settlementTime     DateTime? @map("settlement_time")
  expiryTime         DateTime? @map("expiry_time")
  
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")
  
  @@map("transactions")
  @@index([tenantId])
  @@index([orderId])
  @@index([transactionId])
  @@index([transactionStatus])
}

model TransactionLog {
  id                 String   @id @default(uuid())
  transactionId      String   @map("transaction_id")
  transaction        Transaction @relation(fields: [transactionId], references: [id])
  
  // Log Details
  event              String   // webhook_received, status_changed, etc
  status             String?
  rawNotification    Json?    @map("raw_notification")
  
  createdAt          DateTime @default(now()) @map("created_at")
  
  @@map("transaction_logs")
  @@index([transactionId])
}
```

Jalankan migration:
```bash
npx prisma migrate dev --name add_payment_tables
npx prisma generate
```

### 3. Midtrans Configuration Module

#### `src/config/midtrans.config.ts`
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('midtrans', () => ({
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
  merchantId: process.env.MIDTRANS_MERCHANT_ID,
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  snapUrl: process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? process.env.MIDTRANS_SNAP_URL_PRODUCTION
    : process.env.MIDTRANS_SNAP_URL_SANDBOX,
  appUrl: {
    frontend: process.env.APP_FRONTEND_URL,
    backend: process.env.APP_BACKEND_URL,
  },
}));
```

#### Register di `app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import midtransConfig from './config/midtrans.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [midtransConfig],
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

### 4. Midtrans Service

#### `src/payment/midtrans.service.ts`
```typescript
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
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
  private readonly clientKey: string;
  private readonly isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.serverKey = this.configService.get<string>('midtrans.serverKey');
    this.clientKey = this.configService.get<string>('midtrans.clientKey');
    this.isProduction = this.configService.get<boolean>('midtrans.isProduction');

    // Initialize Snap API
    this.snap = new midtransClient.Snap({
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      clientKey: this.clientKey,
    });

    // Initialize Core API (optional, untuk get status)
    this.core = new midtransClient.CoreApi({
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      clientKey: this.clientKey,
    });
  }

  /**
   * Create Snap Transaction
   */
  async createTransaction(params: CreateTransactionDto) {
    try {
      const { tenantId, orderId, grossAmount, items, customer } = params;

      // Format parameter untuk Midtrans
      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        item_details: items.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.name,
        })),
        customer_details: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
        callbacks: {
          finish: `${this.configService.get('midtrans.appUrl.frontend')}/payment/finish`,
          unfinish: `${this.configService.get('midtrans.appUrl.frontend')}/payment/unfinish`,
          error: `${this.configService.get('midtrans.appUrl.frontend')}/payment/error`,
        },
        enabled_payments: [
          'credit_card',
          'mandiri_clickpay',
          'cimb_clicks',
          'bca_klikbca',
          'bca_klikpay',
          'bri_epay',
          'echannel',
          'permata_va',
          'bca_va',
          'bni_va',
          'bri_va',
          'other_va',
          'gopay',
          'indomaret',
          'alfamart',
          'danamon_online',
          'akulaku',
          'shopeepay',
        ],
      };

      this.logger.log(`Creating transaction for order: ${orderId}`);

      // Call Midtrans Snap API
      const transaction = await this.snap.createTransaction(parameter);

      // Save to database
      const savedTransaction = await this.prisma.transaction.create({
        data: {
          orderId,
          tenantId,
          grossAmount,
          currency: 'IDR',
          snapToken: transaction.token,
          snapRedirectUrl: transaction.redirect_url,
          transactionStatus: 'pending',
          customerName: `${customer.firstName} ${customer.lastName}`,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          itemDetails: items,
        },
      });

      this.logger.log(`Transaction created: ${savedTransaction.id}`);

      return {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        transaction_id: savedTransaction.id,
      };
    } catch (error) {
      this.logger.error(`Error creating transaction: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create transaction: ${error.message}`);
    }
  }

  /**
   * Get Transaction Status
   */
  async getTransactionStatus(orderId: string) {
    try {
      const status = await this.core.transaction.status(orderId);
      return status;
    } catch (error) {
      this.logger.error(`Error getting transaction status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify Signature from Webhook
   */
  verifySignature(notification: any): boolean {
    const { order_id, status_code, gross_amount, signature_key } = notification;

    // Generate signature
    const input = `${order_id}${status_code}${gross_amount}${this.serverKey}`;
    const hash = crypto.createHash('sha512').update(input).digest('hex');

    this.logger.debug(`Verifying signature for order: ${order_id}`);
    this.logger.debug(`Generated hash: ${hash}`);
    this.logger.debug(`Received signature: ${signature_key}`);

    return hash === signature_key;
  }

  /**
   * Handle Webhook Notification
   */
  async handleNotification(notification: any) {
    try {
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

      // Verify signature
      if (!this.verifySignature(notification)) {
        this.logger.warn(`Invalid signature for order: ${order_id}`);
        throw new BadRequestException('Invalid signature');
      }

      // Find transaction
      const transaction = await this.prisma.transaction.findUnique({
        where: { orderId: order_id },
      });

      if (!transaction) {
        this.logger.warn(`Transaction not found: ${order_id}`);
        throw new BadRequestException('Transaction not found');
      }

      // Log notification
      await this.prisma.transactionLog.create({
        data: {
          transactionId: transaction.id,
          event: 'webhook_received',
          status: transaction_status,
          rawNotification: notification,
        },
      });

      // Update transaction based on status
      const updateData: any = {
        transactionId: transaction_id,
        transactionStatus: transaction_status,
        fraudStatus: fraud_status,
        paymentType: payment_type,
        transactionTime: transaction_time ? new Date(transaction_time) : null,
        settlementTime: settlement_time ? new Date(settlement_time) : null,
        expiryTime: expiry_time ? new Date(expiry_time) : null,
      };

      // Add bank info for bank_transfer
      if (payment_type === 'bank_transfer') {
        updateData.bank = notification.va_numbers?.[0]?.bank;
        updateData.vaNumber = notification.va_numbers?.[0]?.va_number;
      }

      // Add bank info for echannel (Mandiri Bill)
      if (payment_type === 'echannel') {
        updateData.bank = 'mandiri';
        updateData.vaNumber = notification.bill_key;
      }

      const updatedTransaction = await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: updateData,
      });

      this.logger.log(
        `Transaction updated: ${order_id} - Status: ${transaction_status}`,
      );

      // Handle specific statuses
      await this.handleTransactionStatus(updatedTransaction, transaction_status);

      return updatedTransaction;
    } catch (error) {
      this.logger.error(`Error handling notification: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Handle specific transaction status
   */
  private async handleTransactionStatus(transaction: any, status: string) {
    switch (status) {
      case 'capture':
      case 'settlement':
        // Payment sukses
        this.logger.log(`Payment successful for order: ${transaction.orderId}`);
        // TODO: Update order status, send email, etc
        break;

      case 'pending':
        // Payment pending (waiting for payment)
        this.logger.log(`Payment pending for order: ${transaction.orderId}`);
        // TODO: Send payment instruction email
        break;

      case 'deny':
      case 'cancel':
      case 'expire':
        // Payment failed
        this.logger.log(`Payment failed for order: ${transaction.orderId} - ${status}`);
        // TODO: Update order status, notify customer
        break;

      case 'refund':
        // Payment refunded
        this.logger.log(`Payment refunded for order: ${transaction.orderId}`);
        // TODO: Handle refund logic
        break;

      default:
        this.logger.warn(`Unknown status: ${status} for order: ${transaction.orderId}`);
    }
  }

  /**
   * Cancel Transaction
   */
  async cancelTransaction(orderId: string) {
    try {
      const result = await this.core.transaction.cancel(orderId);
      
      await this.prisma.transaction.update({
        where: { orderId },
        data: { transactionStatus: 'cancel' },
      });

      return result;
    } catch (error) {
      this.logger.error(`Error canceling transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Expire Transaction
   */
  async expireTransaction(orderId: string) {
    try {
      const result = await this.core.transaction.expire(orderId);
      
      await this.prisma.transaction.update({
        where: { orderId },
        data: { transactionStatus: 'expire' },
      });

      return result;
    } catch (error) {
      this.logger.error(`Error expiring transaction: ${error.message}`);
      throw error;
    }
  }
}
```

### 5. DTOs (Data Transfer Objects)

#### `src/payment/dto/create-transaction.dto.ts`
```typescript
import { IsString, IsNumber, IsArray, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class ItemDetailDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}

class CustomerDetailDto {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}

export class CreateTransactionDto {
  @IsString()
  tenantId: string;

  @IsString()
  orderId: string;

  @IsNumber()
  grossAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDetailDto)
  items: ItemDetailDto[];

  @ValidateNested()
  @Type(() => CustomerDetailDto)
  customer: CustomerDetailDto;
}
```

### 6. Payment Controller

#### `src/payment/payment.controller.ts`
```typescript
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MidtransService } from './midtrans.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly midtransService: MidtransService) {}

  /**
   * Create Payment Transaction
   * POST /api/payment/create
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createTransaction(@Body() dto: CreateTransactionDto, @Req() req) {
    this.logger.log(`Creating transaction for tenant: ${dto.tenantId}`);
    
    // Validate tenant access
    // if (req.user.tenantId !== dto.tenantId) {
    //   throw new ForbiddenException('Access denied');
    // }

    return await this.midtransService.createTransaction(dto);
  }

  /**
   * Get Transaction Status
   * GET /api/payment/status/:orderId
   */
  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  async getStatus(@Param('orderId') orderId: string) {
    return await this.midtransService.getTransactionStatus(orderId);
  }

  /**
   * Webhook Notification from Midtrans
   * POST /api/payment/webhook
   * 
   * IMPORTANT: This endpoint should NOT have authentication guard
   * because it's called by Midtrans server
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() notification: any) {
    this.logger.log(`Webhook received for order: ${notification.order_id}`);
    this.logger.debug(`Notification data:`, JSON.stringify(notification));

    try {
      await this.midtransService.handleNotification(notification);
      return { status: 'success' };
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`, error.stack);
      
      // Still return 200 to avoid Midtrans retry
      // but log the error for investigation
      return { status: 'error', message: error.message };
    }
  }

  /**
   * Cancel Transaction
   * POST /api/payment/cancel/:orderId
   */
  @Post('cancel/:orderId')
  @UseGuards(JwtAuthGuard)
  async cancelTransaction(@Param('orderId') orderId: string) {
    return await this.midtransService.cancelTransaction(orderId);
  }
}
```

### 7. Payment Module

#### `src/payment/payment.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentController } from './payment.controller';
import { MidtransService } from './midtrans.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
  ],
  controllers: [PaymentController],
  providers: [MidtransService],
  exports: [MidtransService],
})
export class PaymentModule {}
```

---

## 🎨 Frontend Implementation (Next.js)

### 1. Environment Configuration

#### `.env.local`
```env
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_SNAP_URL_SANDBOX=https://app.sandbox.midtrans.com/snap/snap.js
NEXT_PUBLIC_MIDTRANS_SNAP_URL_PRODUCTION=https://app.midtrans.com/snap/snap.js
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. Snap.js Type Declaration

#### `src/types/midtrans-snap.d.ts`
```typescript
interface SnapOptions {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
}

interface SnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

interface Snap {
  pay: (snapToken: string, options?: SnapOptions) => void;
  hide: () => void;
  show: () => void;
}

interface Window {
  snap: Snap;
}
```

### 3. Snap.js Hook

#### `src/hooks/useSnapPayment.ts`
```typescript
import { useEffect, useState } from 'react';
import Script from 'next/script';

interface UseSnapPaymentProps {
  clientKey: string;
  isProduction?: boolean;
}

export const useSnapPayment = ({ clientKey, isProduction = false }: UseSnapPaymentProps) => {
  const [snapLoaded, setSnapLoaded] = useState(false);
  const [snapError, setSnapError] = useState<string | null>(null);

  const snapUrl = isProduction
    ? process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL_PRODUCTION
    : process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL_SANDBOX;

  useEffect(() => {
    // Check if snap is already loaded
    if (typeof window !== 'undefined' && window.snap) {
      setSnapLoaded(true);
    }
  }, []);

  const handleSnapLoad = () => {
    setSnapLoaded(true);
    console.log('Snap.js loaded successfully');
  };

  const handleSnapError = () => {
    setSnapError('Failed to load Snap.js');
    console.error('Failed to load Snap.js');
  };

  const SnapScript = () => (
    <Script
      src={snapUrl}
      data-client-key={clientKey}
      strategy="afterInteractive"
      onLoad={handleSnapLoad}
      onError={handleSnapError}
    />
  );

  const openSnap = (snapToken: string, options?: SnapOptions) => {
    if (!snapLoaded || !window.snap) {
      console.error('Snap.js is not loaded yet');
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: (result) => {
        console.log('Payment success:', result);
        options?.onSuccess?.(result);
      },
      onPending: (result) => {
        console.log('Payment pending:', result);
        options?.onPending?.(result);
      },
      onError: (result) => {
        console.error('Payment error:', result);
        options?.onError?.(result);
      },
      onClose: () => {
        console.log('Payment popup closed');
        options?.onClose?.();
      },
    });
  };

  return {
    snapLoaded,
    snapError,
    SnapScript,
    openSnap,
  };
};
```

### 4. Payment Service (API Client)

#### `src/services/payment.service.ts`
```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface CreatePaymentData {
  tenantId: string;
  orderId: string;
  grossAmount: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customer: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
  };
}

export interface CreatePaymentResponse {
  token: string;
  redirect_url: string;
  transaction_id: string;
}

export interface TransactionStatus {
  order_id: string;
  transaction_id: string;
  transaction_status: string;
  payment_type: string;
  gross_amount: string;
  transaction_time: string;
}

export const paymentService = {
  /**
   * Create payment transaction
   */
  async createTransaction(data: CreatePaymentData, token: string): Promise<CreatePaymentResponse> {
    const response = await axios.post(`${API_URL}/payment/create`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Get transaction status
   */
  async getTransactionStatus(orderId: string, token: string): Promise<TransactionStatus> {
    const response = await axios.get(`${API_URL}/payment/status/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Cancel transaction
   */
  async cancelTransaction(orderId: string, token: string): Promise<any> {
    const response = await axios.post(
      `${API_URL}/payment/cancel/${orderId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
};
```

### 5. Payment Component

#### `src/components/PaymentButton.tsx`
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSnapPayment } from '@/hooks/useSnapPayment';
import { paymentService, CreatePaymentData } from '@/services/payment.service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  paymentData: CreatePaymentData;
  token: string; // JWT token
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
}

export function PaymentButton({
  paymentData,
  token,
  onSuccess,
  onPending,
  onError,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const { snapLoaded, SnapScript, openSnap } = useSnapPayment({
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    isProduction: process.env.NODE_ENV === 'production',
  });

  const handlePayment = async () => {
    if (!snapLoaded) {
      toast({
        title: 'Error',
        description: 'Payment system is loading. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create transaction and get snap token
      const response = await paymentService.createTransaction(paymentData, token);

      // Open Snap payment page
      openSnap(response.token, {
        onSuccess: (result) => {
          toast({
            title: 'Payment Successful',
            description: `Transaction ${result.order_id} completed successfully.`,
          });
          onSuccess?.(result);
        },
        onPending: (result) => {
          toast({
            title: 'Payment Pending',
            description: `Please complete your payment for transaction ${result.order_id}.`,
          });
          onPending?.(result);
        },
        onError: (result) => {
          toast({
            title: 'Payment Error',
            description: `Transaction ${result.order_id} failed. Please try again.`,
            variant: 'destructive',
          });
          onError?.(result);
        },
        onClose: () => {
          console.log('Payment popup closed');
        },
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to process payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SnapScript />
      <Button
        onClick={handlePayment}
        disabled={loading || !snapLoaded}
        className="w-full"
        size="lg"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </>
  );
}
```

### 6. Checkout Page Example

#### `src/app/checkout/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentButton } from '@/components/PaymentButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems] = useState([
    {
      id: '1',
      name: 'Product 1',
      price: 100000,
      quantity: 2,
    },
    {
      id: '2',
      name: 'Product 2',
      price: 50000,
      quantity: 1,
    },
  ]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const paymentData = {
    tenantId: 'tenant-123', // Get from context or auth
    orderId: `ORDER-${Date.now()}`,
    grossAmount: totalAmount,
    items: cartItems,
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+628123456789',
    },
  };

  const handleSuccess = (result: SnapResult) => {
    router.push(`/payment/success?order_id=${result.order_id}`);
  };

  const handlePending = (result: SnapResult) => {
    router.push(`/payment/pending?order_id=${result.order_id}`);
  };

  const handleError = (result: SnapResult) => {
    router.push(`/payment/error?order_id=${result.order_id}`);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Complete your payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="font-semibold">Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Payment Button */}
          <PaymentButton
            paymentData={paymentData}
            token="your-jwt-token" // Get from auth context
            onSuccess={handleSuccess}
            onPending={handlePending}
            onError={handleError}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

### 7. Payment Result Pages

#### `src/app/payment/success/page.tsx`
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { paymentService } from '@/services/payment.service';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      // Fetch transaction status
      paymentService
        .getTransactionStatus(orderId, 'your-jwt-token')
        .then(setTransaction)
        .catch(console.error);
    }
  }, [orderId]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>Your payment has been processed successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {transaction && (
            <div className="text-left space-y-2 bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{transaction.order_id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">{transaction.transaction_id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">
                  Rp {parseFloat(transaction.gross_amount).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{transaction.payment_type}</span>
              </div>
            </div>
          )}
          <Button onClick={() => router.push('/orders')} className="w-full">
            View My Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### Similar pages untuk `/payment/pending` dan `/payment/error`

---

## 🔒 Security & Best Practices

### 1. Signature Verification

**CRITICAL:** Selalu verifikasi signature pada webhook notification

```typescript
// GOOD ✅
const isValid = this.verifySignature(notification);
if (!isValid) {
  throw new BadRequestException('Invalid signature');
}

// BAD ❌ - Never trust notification without verification
await this.updateOrder(notification.order_id, 'paid');
```

### 2. Idempotency

Handle duplicate notifications:

```typescript
async handleNotification(notification: any) {
  const { order_id, transaction_id } = notification;
  
  // Check if already processed
  const existingLog = await this.prisma.transactionLog.findFirst({
    where: {
      transaction: { orderId: order_id },
      event: 'webhook_received',
      rawNotification: {
        path: ['transaction_id'],
        equals: transaction_id,
      },
    },
  });
  
  if (existingLog) {
    this.logger.warn(`Duplicate notification for ${order_id}`);
    return { status: 'already_processed' };
  }
  
  // Process notification...
}
```

### 3. Server Key Security

```typescript
// ✅ GOOD - Server key hanya di backend
// backend/.env
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx

// ❌ BAD - NEVER expose server key di frontend
// frontend/.env
NEXT_PUBLIC_MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx // DON'T DO THIS!
```

### 4. HTTPS Only

```typescript
// Production configuration
if (process.env.NODE_ENV === 'production') {
  // Force HTTPS
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 5. Rate Limiting

```typescript
// payment.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10, // 10 requests per minute per IP
    }),
  ],
})
export class PaymentModule {}
```

### 6. Input Validation

```typescript
// ALWAYS validate and sanitize input
@Post('create')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
async createTransaction(@Body() dto: CreateTransactionDto) {
  // Validation handled by class-validator
  return await this.midtransService.createTransaction(dto);
}
```

### 7. Error Handling

```typescript
// DON'T expose sensitive info in errors
try {
  await this.midtransService.createTransaction(dto);
} catch (error) {
  // ❌ BAD
  throw new Error(error.message); // Might contain sensitive data
  
  // ✅ GOOD
  this.logger.error(error); // Log full error
  throw new BadRequestException('Failed to create transaction'); // Generic message to client
}
```

---

## 🧪 Testing & Debugging

### 1. Test Cards (Sandbox)

```typescript
// Berhasil
Card Number: 4811 1111 1111 1114
CVV: 123
Exp: 12/25

// 3DS Challenge
Card Number: 4617 0069 7686 1948
CVV: 123
Exp: 12/25
OTP: 112233

// Ditolak
Card Number: 4911 1111 1111 1113
CVV: 123
Exp: 12/25
```

### 2. Virtual Account Testing

```typescript
// Bank Transfer - Auto Settlement in 10 minutes
Bank: BCA
VA: Will be generated automatically

// E-Money
GoPay: Use any phone number, auto success
ShopeePay: Auto success
```

### 3. Webhook Testing dengan Ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start your backend
npm run start:dev

# Expose backend
ngrok http 8000

# Update notification URL di Midtrans Dashboard
https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/payment/webhook
```

### 4. Logging

```typescript
// Enable detailed logging
this.logger.debug('Notification received', {
  orderId: notification.order_id,
  status: notification.transaction_status,
  amount: notification.gross_amount,
});

// Log to file in production
// main.ts
import * as fs from 'fs';
import * as path from 'path';

if (process.env.NODE_ENV === 'production') {
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
}
```

### 5. Testing dengan Postman/Thunder Client

```bash
# Create Transaction
POST http://localhost:8000/api/payment/create
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "tenantId": "tenant-123",
  "orderId": "ORDER-1234567890",
  "grossAmount": 250000,
  "items": [
    {
      "id": "item-1",
      "name": "Product A",
      "price": 100000,
      "quantity": 2
    },
    {
      "id": "item-2",
      "name": "Product B",
      "price": 50000,
      "quantity": 1
    }
  ],
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+628123456789"
  }
}

# Get Status
GET http://localhost:8000/api/payment/status/ORDER-1234567890
Authorization: Bearer YOUR_JWT_TOKEN

# Simulate Webhook (for testing)
POST http://localhost:8000/api/payment/webhook
Content-Type: application/json

{
  "transaction_time": "2025-02-05 12:00:00",
  "transaction_status": "settlement",
  "transaction_id": "abc123",
  "status_message": "midtrans payment notification",
  "status_code": "200",
  "signature_key": "generated_signature_here",
  "payment_type": "bank_transfer",
  "order_id": "ORDER-1234567890",
  "merchant_id": "G999999999",
  "gross_amount": "250000.00",
  "fraud_status": "accept",
  "currency": "IDR"
}
```

---

## 🏢 Multi-Tenant Considerations

### 1. Per-Tenant Midtrans Credentials

```typescript
// Untuk UMKM yang punya akun Midtrans sendiri

interface TenantMidtransConfig {
  tenantId: string;
  serverKey: string;
  clientKey: string;
  merchantId: string;
}

// Store in database
model TenantPaymentConfig {
  id              String   @id @default(uuid())
  tenantId        String   @unique
  provider        String   // 'midtrans', 'xendit', etc
  serverKey       String   @map("server_key") // Encrypted!
  clientKey       String   @map("client_key")
  merchantId      String   @map("merchant_id")
  isProduction    Boolean  @default(false)
  isActive        Boolean  @default(true)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("tenant_payment_configs")
}

// Service implementation
async createTransaction(dto: CreateTransactionDto) {
  // Get tenant's Midtrans config
  const config = await this.prisma.tenantPaymentConfig.findUnique({
    where: { tenantId: dto.tenantId },
  });
  
  if (!config) {
    throw new BadRequestException('Payment not configured for this tenant');
  }
  
  // Create Snap instance with tenant's credentials
  const snap = new midtransClient.Snap({
    isProduction: config.isProduction,
    serverKey: this.decrypt(config.serverKey), // Decrypt server key
    clientKey: config.clientKey,
  });
  
  // Continue with transaction...
}
```

### 2. Platform-Level Midtrans (Single Account)

```typescript
// Semua tenant pakai 1 akun Midtrans platform
// Order ID harus unique across all tenants

function generateOrderId(tenantId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${tenantId}-ORDER-${timestamp}-${random}`;
}

// Webhook handler
async handleNotification(notification: any) {
  const { order_id } = notification;
  
  // Extract tenant ID from order ID
  const tenantId = order_id.split('-')[0];
  
  // Find tenant
  const tenant = await this.prisma.tenant.findUnique({
    where: { id: tenantId },
  });
  
  // Process payment for specific tenant...
}
```

### 3. Commission/Fee Handling

```typescript
// Untuk platform yang potong komisi

async createTransaction(dto: CreateTransactionDto) {
  const tenant = await this.prisma.tenant.findUnique({
    where: { id: dto.tenantId },
    include: { subscription: true },
  });
  
  // Calculate platform fee
  const platformFeePercentage = tenant.subscription.feePercentage || 5;
  const platformFee = (dto.grossAmount * platformFeePercentage) / 100;
  const merchantAmount = dto.grossAmount - platformFee;
  
  // Save for later settlement
  await this.prisma.transaction.create({
    data: {
      ...transactionData,
      grossAmount: dto.grossAmount,
      platformFee,
      merchantAmount,
      metadata: {
        feePercentage: platformFeePercentage,
      },
    },
  });
  
  // Create Midtrans transaction with full amount
  // Platform handles fee internally
}
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. **"Invalid Signature" Error**

```typescript
// Problem: Signature tidak match
// Solution: Pastikan format exact

// CORRECT ✅
const input = `${order_id}${status_code}${gross_amount}${serverKey}`;
// Contoh: "ORDER-1232003500001.00SB-Mid-server-xxx"

// WRONG ❌
const input = `${order_id} ${status_code} ${gross_amount} ${serverKey}`;
// Spasi akan menghasilkan signature berbeda
```

#### 2. **Webhook Not Received**

```bash
# Check:
1. URL accessible dari public internet (tidak localhost)
2. Tidak ada authentication required
3. Port 80/443 (bukan port custom)
4. HTTPS (production)
5. No redirect dari URL

# Test dengan:
curl -X POST https://your-api.com/api/payment/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

#### 3. **Snap Token Expired**

```typescript
// Snap token valid selama 24 jam
// Untuk session lama, generate token baru

// Check expiry
const tokenAge = Date.now() - transaction.createdAt.getTime();
const isExpired = tokenAge > 24 * 60 * 60 * 1000; // 24 hours

if (isExpired) {
  // Generate new token dengan order_id sama
  // (only if transaction still pending)
}
```

#### 4. **Order ID Already Used**

```typescript
// Midtrans tidak allow duplicate order_id
// Pastikan order_id unique

// SOLUTION 1: Append timestamp
const orderId = `ORDER-${Date.now()}`;

// SOLUTION 2: Use UUID
import { v4 as uuidv4 } from 'uuid';
const orderId = `ORDER-${uuidv4()}`;

// SOLUTION 3: Check before create
const exists = await this.prisma.transaction.findUnique({
  where: { orderId: dto.orderId },
});

if (exists) {
  throw new BadRequestException('Order ID already exists');
}
```

#### 5. **CORS Error pada Frontend**

```typescript
// Backend: Enable CORS
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});

// Frontend: Check Snap.js loading
console.log('Snap loaded:', !!window.snap);
```

#### 6. **Transaction Status Not Updated**

```bash
# Check webhook logs di Midtrans Dashboard
Settings > Configuration > View Notification History

# Common causes:
- Webhook URL salah
- Server error (5xx)
- Signature verification failed
- Database connection issue
```

---

## 📚 Referensi & Resources

### Official Documentation
- [Midtrans Docs](https://docs.midtrans.com/)
- [Snap API Guide](https://docs.midtrans.com/docs/snap)
- [Webhook Notification](https://docs.midtrans.com/docs/https-notification-webhooks)
- [midtrans-client NPM](https://www.npmjs.com/package/midtrans-client)

### Testing
- [Midtrans Sandbox](https://dashboard.sandbox.midtrans.com)
- [Test Credentials](https://docs.midtrans.com/docs/test-credentials)
- [Payment Simulator](https://simulator.sandbox.midtrans.com/)

### Community
- [Midtrans GitHub](https://github.com/Midtrans)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/midtrans)

---

## ✅ Implementation Checklist

### Backend
- [ ] Install `midtrans-client` package
- [ ] Setup environment variables
- [ ] Create Prisma schema untuk transactions
- [ ] Implement Midtrans service
- [ ] Create payment controller dengan webhook endpoint
- [ ] Add signature verification
- [ ] Setup logging
- [ ] Add error handling
- [ ] Test dengan Postman/Thunder Client
- [ ] Test webhook dengan ngrok

### Frontend
- [ ] Setup environment variables
- [ ] Create Snap.js type declarations
- [ ] Implement useSnapPayment hook
- [ ] Create payment service (API client)
- [ ] Build PaymentButton component
- [ ] Create checkout page
- [ ] Create payment result pages (success/pending/error)
- [ ] Test payment flow
- [ ] Handle loading states
- [ ] Add error messages

### Security
- [ ] Verify webhook signatures
- [ ] Use HTTPS in production
- [ ] Encrypt server keys in database
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Validate all inputs
- [ ] Add logging untuk audit trail
- [ ] Setup monitoring alerts

### Testing
- [ ] Test dengan test cards
- [ ] Test different payment methods
- [ ] Test webhook notifications
- [ ] Test error scenarios
- [ ] Load testing untuk concurrent payments
- [ ] Test multi-tenant scenarios

### Production
- [ ] Change to production credentials
- [ ] Update notification URL
- [ ] Setup monitoring
- [ ] Configure backup strategy
- [ ] Document runbook untuk on-call
- [ ] Setup alerting untuk failed payments

---

## 🎓 Best Practices Summary

1. **NEVER trust frontend callbacks alone** - Always verify via webhook
2. **Always verify signature** - Protect against fake notifications
3. **Use HTTPS** - Especially in production
4. **Log everything** - Especially webhooks untuk debugging
5. **Handle idempotency** - Protect against duplicate notifications
6. **Test thoroughly** - Use sandbox before production
7. **Monitor actively** - Setup alerts untuk failed payments
8. **Secure API keys** - Never expose server key, encrypt in DB
9. **Handle errors gracefully** - Don't break user experience
10. **Document everything** - For team dan future self

---

## 📝 Notes

- Dokumentasi ini dibuat berdasarkan research dari dokumentasi official Midtrans dan community implementations
- Stack: NestJS 11.x + Next.js 16.x + Prisma 6.x
- Untuk UMKM multi-tenant platform
- Updated: February 2025

📊 Penjelasan Flow Dokumen 1Yang Terjadi:┌─────────────────────────────────────────────────────────────┐
│  CUSTOMER CHECKOUT DI TENANT A                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  PLATFORM BACKEND (NestJS)                                  │
│  - Generate Snap Token                                      │
│  - Pakai PLATFORM's Midtrans Credentials                    │
│  - Order ID: "tenant-123-ORDER-1234567890"                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  MIDTRANS SNAP PAGE                                         │
│  - Customer bayar Rp 100,000                                │
│  - Payment methods: Bank Transfer / GoPay / CC              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  PAYMENT SUCCESS                                            │
│  - Uang masuk ke PLATFORM's Midtrans Account                │
│  - Midtrans kirim webhook ke platform backend               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  PLATFORM BACKEND                                           │
│  - Terima webhook notification                              │
│  - Update transaction status                                │
│  - Calculate commission (5%)                                │
│  - Tenant A receivable: Rp 95,000                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  SETTLEMENT SCHEDULE (Weekly/Monthly)                       │
│  - Platform transfer Rp 95,000 ke bank Tenant A             │
└─────────────────────────────────────────────────────────────┘🔑 Bukti di Code - Dokumen 11. Single Midtrans Credentialstypescript// src/config/midtrans.config.ts
export default registerAs('midtrans', () => ({
  serverKey: process.env.MIDTRANS_SERVER_KEY,      // ← PLATFORM punya
  clientKey: process.env.MIDTRANS_CLIENT_KEY,      // ← PLATFORM punya
  merchantId: process.env.MIDTRANS_MERCHANT_ID,    // ← PLATFORM punya
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
}));Ini artinya:

✅ 1 akun Midtrans untuk SEMUA tenant
✅ Credentials disimpan di platform backend
✅ Tenant TIDAK punya akun Midtrans sendiri
2. Order ID Structuretypescript// Di Dokumen 1
async createTransaction(params: CreateTransactionDto) {
  const { tenantId, orderId, grossAmount, items, customer } = params;
  
  // Order ID format: tenant-specific
  // Contoh: "tenant-123-ORDER-1234567890"
  const parameter = {
    transaction_details: {
      order_id: orderId,  // ← Include tenantId di prefix
      gross_amount: grossAmount,
    },
    // ...
  };
  
  // Call Midtrans dengan PLATFORM credentials
  const transaction = await this.snap.createTransaction(parameter);
}Kenapa tenantId di order_id?

Supaya platform tahu transaksi ini untuk tenant mana
Webhook nanti bisa route ke tenant yang tepat
3. Commission Calculation (Implied)typescript// Prisma schema di Dokumen 1
model Transaction {
  id                 String   @id @default(uuid())
  orderId            String   @unique @map("order_id")
  
  tenantId           String   @map("tenant_id")  // ← Transaksi milik tenant mana
  tenant             Tenant   @relation(fields: [tenantId], references: [id])
  
  grossAmount        Decimal  @map("gross_amount")  // ← Total yang customer bayar
  
  // Platform bisa add field ini:
  // platformFee      Decimal  @map("platform_fee")    // ← 5% commission
  // merchantAmount   Decimal  @map("merchant_amount") // ← 95% untuk tenant
}Flow uang:
typescriptCustomer bayar: Rp 100,000
    ↓
Masuk ke Platform Midtrans Account
    ↓
Platform calculate:
- Midtrans fee (2.9%): Rp 2,900
- Platform commission (5%): Rp 5,000
- Tenant receivable: Rp 100,000 - Rp 5,000 = Rp 95,000
    ↓
Platform transfer Rp 95,000 ke tenant (weekly/monthly)4. Webhook Handlertypescript// src/payment/midtrans.service.ts
async handleNotification(notification: any) {
  const { order_id } = notification;
  
  // Find transaction berdasarkan order_id
  const transaction = await this.prisma.transaction.findUnique({
    where: { orderId: order_id },
    include: { tenant: true }  // ← Tau ini transaksi tenant mana
  });
  
  // Update status
  await this.prisma.transaction.update({
    where: { id: transaction.id },
    data: { transactionStatus: 'settlement' }
  });
  
  // Platform logic: calculate tenant receivable
  // ...
}Platform receives webhook karena:

Payment masuk ke platform's Midtrans account
Webhook URL: https://platform-api.com/api/payment/webhook
Platform yang process & distribute ke tenant

---

**Happy Coding! 🚀**

Jika ada pertanyaan atau butuh bantuan lebih lanjut, silakan refer ke dokumentasi official Midtrans atau community resources.

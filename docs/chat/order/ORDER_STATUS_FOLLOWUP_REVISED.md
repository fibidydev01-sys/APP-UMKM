# 📦 ORDER STATUS FOLLOW-UP SYSTEM (REVISED)

**Project:** UMKM Multi-Tenant - WhatsApp Chat Module  
**Feature:** Automatic Order Status Update via WhatsApp  
**Version:** 2.0.0 (REVISED & SIMPLIFIED)  
**Date:** 2026-01-29

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Business Flow](#business-flow)
3. [Database Schema](#database-schema)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [API Design](#api-design)
7. [Testing Guide](#testing-guide)
8. [Best Practices](#best-practices)
9. [Success Criteria](#success-criteria)

---

## 🎯 OVERVIEW

### **Konsep Utama**

Sistem automatis untuk mengirim update status order ke customer melalui
WhatsApp. **TIDAK ADA NOTIFIKASI PUSH, TIDAK ADA LOGIN CUSTOMER** - semua
komunikasi melalui WhatsApp chat yang sudah terhubung.

### **Key Improvements (Revised Version)**

✅ **Simplified Schema** - Reuse `keywords` field (no new `statusTrigger`
field)  
✅ **UUID Already Built-in** - Use `order.id` (already cuid/UUID, no need
generate new)  
✅ **All Status Supported** - Including PENDING (no skip)  
✅ **Better Error Logging** - Detailed context for debugging  
✅ **Separate Frontend Pages** - 4 dedicated pages, no confusion  
✅ **One Rule Per Status** - Prevent duplicates, locked after creation

### **Problem yang Diselesaikan**

❌ **Before:**

- Owner harus manual kirim update ke customer satu-satu
- Customer harus tanya-tanya "Pesanan saya sudah sampai mana?"
- Tidak ada tracking timeline order
- Unprofessional & memakan waktu

✅ **After:**

- Owner cukup klik update status → Customer auto dapat update
- Customer tenang karena selalu dapat info terbaru
- Ada history timeline perubahan status
- Professional & efficient

---

## 💼 BUSINESS FLOW

### **Alur Bisnis End-to-End**

```
[CUSTOMER]
    ↓
Kirim pesan WhatsApp: "Halo, mau pesan 100pcs kaos polo"
    ↓
[SYSTEM - Auto Reply: WELCOME]
    ↓
"Halo! Terima kasih sudah hubungi kami. Ada yang bisa kami bantu?"
    ↓
[OWNER - via Dashboard]
    ↓
Baca chat → Create Order dari conversation
    ↓
Order dibuat dengan status: PENDING
    ↓
[SYSTEM - Auto Send WA: ORDER_STATUS PENDING]
    ↓
Customer terima: "Halo Budi! Terima kasih sudah order!
Order #ORD-001 sudah kami terima. Total Rp5.000.000
Cek status: https://toko.com/store/toko-budi/track/cm123abc"
    ↓
[OWNER - Update Status]
    ↓
Click: Update Status → PROCESSING
    ↓
[SYSTEM - Auto Send WA: ORDER_STATUS PROCESSING]
    ↓
Customer terima: "Hi Budi! Kabar baik nih!
Order #ORD-001 sedang dalam PROSES.
Cek status: https://toko.com/store/toko-budi/track/cm123abc"
    ↓
[OWNER - Confirm Payment]
    ↓
Click: Update Payment → PAID
    ↓
[SYSTEM - Auto Send WA: PAYMENT_STATUS PAID]
    ↓
Customer terima: "Terima kasih! Pembayaran order #ORD-001 sudah kami terima ✅"
    ↓
[OWNER - Update Status]
    ↓
Click: Update Status → COMPLETED
    ↓
[SYSTEM - Auto Send WA: ORDER_STATUS COMPLETED]
    ↓
Customer terima: "Yeay! Order #ORD-001 udah SELESAI!
Terima kasih sudah order di kami Budi!"
    ↓
[CUSTOMER]
    ↓
Happy & Trust meningkat ✅
```

### **Business Rules**

1. **Rule Creation:**
   - **MAKSIMAL 1 RULE PER STATUS** (prevent duplicates)
   - Setelah dibuat, status itu **LOCKED** (ga bisa bikin lagi)
   - Owner bisa **UPDATE/DELETE** rule existing
   - Priority & delay **AUTO-ASSIGNED** by system

2. **Order Creation:**
   - Order bisa dibuat dari conversation yang sudah ada
   - Order bisa dibuat manual (tanpa conversation)
   - Jika ada conversation → Auto-link ke order
   - Customer phone WAJIB ada (untuk send WA)

3. **Status Update:**
   - Setiap update status → Auto-send WhatsApp message
   - Owner bisa matikan auto-send jika perlu
   - Status history tersimpan dengan timestamp
   - Tracking link menggunakan **order.id** (already UUID/cuid)

4. **Message Templates:**
   - Template customizable per tenant
   - Support variables: {{name}}, {{order_number}}, {{total}}, {{tracking_link}}
   - Ada delay 2-5 detik sebelum kirim (human-like)

---

## 🗄️ DATABASE SCHEMA

### **1. Enum Update (Existing)**

```prisma
enum AutoReplyTriggerType {
  WELCOME
  KEYWORD
  TIME_BASED
  ORDER_STATUS      // ✅ NEW
  PAYMENT_STATUS    // ✅ NEW
}
```

### **2. AutoReplyRule Model (NO NEW FIELDS!)**

```prisma
model AutoReplyRule {
  id                String                @id @default(cuid())

  // Foreign Keys
  tenantId          String
  tenant            Tenant                @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Rule Info
  name              String
  description       String?               @db.Text

  // Trigger Type
  triggerType       AutoReplyTriggerType

  // ✅ REUSE EXISTING FIELD (no new statusTrigger field!)
  // For ORDER_STATUS: keywords = ["PENDING"] or ["PROCESSING"]
  // For PAYMENT_STATUS: keywords = ["PAID"] or ["FAILED"]
  keywords          String[]

  // Match Type (not used for ORDER_STATUS/PAYMENT_STATUS)
  matchType         KeywordMatchType      @default(CONTAINS)
  caseSensitive     Boolean               @default(false)

  // Time-based (not used for ORDER_STATUS/PAYMENT_STATUS)
  workingHours      Json?

  // Response
  responseMessage   String                @db.Text

  // Behavior (AUTO-ASSIGNED for ORDER_STATUS/PAYMENT_STATUS)
  priority          Int                   @default(50)
  delaySeconds      Int                   @default(2)

  // Tracking
  totalTriggered    Int                   @default(0)
  lastTriggeredAt   DateTime?

  // Status
  isActive          Boolean               @default(true)

  // Timestamps
  createdAt         DateTime              @default(now())
  updatedAt         DateTime              @updatedAt

  // Relations
  logs              AutoReplyLog[]

  @@unique([tenantId, triggerType, keywords])  // ✅ Prevent duplicate rules
  @@index([tenantId])
  @@index([tenantId, isActive])
  @@index([tenantId, priority(sort: Desc)])
}
```

**Important Notes:**

1. **NO `statusTrigger` field** - Reuse existing `keywords` array
2. **Unique constraint** - `[tenantId, triggerType, keywords]` prevents
   duplicates
3. **Priority & delaySeconds** - Auto-assigned by backend for
   ORDER_STATUS/PAYMENT_STATUS

---

### **3. Order Model (Already has UUID!)**

```prisma
model Order {
  id            String        @id @default(cuid())  // ✅ Already UUID!
  tenantId      String

  // ... existing fields ...

  orderNumber   String        // Display number: "ORD-20260129-001"
  status        OrderStatus
  paymentStatus PaymentStatus
  total         Float

  // ... other fields ...
}
```

**Important:**

- `id` = UUID (cuid) → Used for **secure tracking link**
- `orderNumber` = Display number → Used for **customer-facing messages**

---

### **4. Migration (MINIMAL!)**

```sql
-- Add new enum values to existing AutoReplyTriggerType
ALTER TYPE "AutoReplyTriggerType" ADD VALUE 'ORDER_STATUS';
ALTER TYPE "AutoReplyTriggerType" ADD VALUE 'PAYMENT_STATUS';

-- Add unique constraint to prevent duplicate rules
ALTER TABLE "AutoReplyRule"
ADD CONSTRAINT "AutoReplyRule_tenantId_triggerType_keywords_key"
UNIQUE ("tenantId", "triggerType", "keywords");
```

**That's it!** No new tables, no new fields! 🎉

---

## 💻 BACKEND IMPLEMENTATION

### **1. OrderStatusEngine** (NEW)

**File:** `server/src/auto-reply/engines/order-status-engine.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { AutoReplyRule } from '@prisma/client';

@Injectable()
export class OrderStatusEngine {
  /**
   * Check if rule matches current status
   */
  matchesStatus(rule: AutoReplyRule, currentStatus: string): boolean {
    // For ORDER_STATUS & PAYMENT_STATUS, check if status in keywords array
    return rule.keywords.includes(currentStatus);
  }

  /**
   * Validate status trigger value
   */
  isValidStatusTrigger(triggerType: string, status: string): boolean {
    const validOrderStatuses = [
      'PENDING',
      'PROCESSING',
      'COMPLETED',
      'CANCELLED',
    ];
    const validPaymentStatuses = ['PENDING', 'PAID', 'PARTIAL', 'FAILED'];

    if (triggerType === 'ORDER_STATUS') {
      return validOrderStatuses.includes(status);
    }
    if (triggerType === 'PAYMENT_STATUS') {
      return validPaymentStatuses.includes(status);
    }
    return false;
  }

  /**
   * Get auto-assigned priority based on trigger type
   */
  getDefaultPriority(triggerType: string): number {
    switch (triggerType) {
      case 'WELCOME':
        return 100; // Highest (first contact)
      case 'PAYMENT_STATUS':
        return 80; // High (money matters!)
      case 'ORDER_STATUS':
        return 70; // Medium-high
      case 'KEYWORD':
        return 50; // Medium
      case 'TIME_BASED':
        return 40; // Low
      default:
        return 50;
    }
  }

  /**
   * Get auto-assigned delay based on status
   */
  getDefaultDelay(triggerType: string, status?: string): number {
    if (triggerType === 'ORDER_STATUS') {
      switch (status) {
        case 'PENDING':
          return 3; // New order
        case 'PROCESSING':
          return 5; // Update info
        case 'COMPLETED':
          return 2; // Good news, fast!
        case 'CANCELLED':
          return 4; // Bad news, gentle
        default:
          return 3;
      }
    }

    if (triggerType === 'PAYMENT_STATUS') {
      switch (status) {
        case 'PAID':
          return 2; // Good news!
        case 'PARTIAL':
          return 3;
        case 'FAILED':
          return 4;
        default:
          return 3;
      }
    }

    return 2; // Default
  }
}
```

---

### **2. AutoReplyService Extensions**

**File:** `server/src/auto-reply/auto-reply.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { OrderStatusEngine } from './engines/order-status-engine';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AutoReplyService {
  private readonly logger = new Logger(AutoReplyService.name);

  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsAppService,
    private orderStatusEngine: OrderStatusEngine,
    private config: ConfigService
  ) {}

  /**
   * Trigger notification for order status change
   */
  async triggerOrderStatusNotification(
    tenantId: string,
    customerPhone: string,
    statusType: 'ORDER_STATUS' | 'PAYMENT_STATUS',
    status: string,
    variables: {
      orderId: string; // ✅ UUID from order.id
      orderNumber: string; // Display number
      name: string;
      total: number;
    }
  ): Promise<{ sent: boolean; reason?: string }> {
    this.logger.log(
      `[${statusType}] Triggering notification for ${customerPhone}: ${status}`
    );

    try {
      // 1. Get tenant slug for tracking link
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { slug: true },
      });

      if (!tenant) {
        this.logger.warn(`Tenant ${tenantId} not found`);
        return { sent: false, reason: 'Tenant not found' };
      }

      // 2. Get active rule for this status
      const rule = await this.prisma.autoReplyRule.findFirst({
        where: {
          tenantId,
          triggerType: statusType as any,
          keywords: { has: status }, // ✅ Check if status in keywords array
          isActive: true,
        },
        orderBy: { priority: 'desc' },
      });

      if (!rule) {
        this.logger.log(`No active rule found for ${statusType}:${status}`);
        return { sent: false, reason: 'No active rule found' };
      }

      // 3. Generate tracking link using order.id (already UUID!)
      const frontendUrl = this.config.get<string>('FRONTEND_URL');
      const trackingLink = `${frontendUrl}/store/${tenant.slug}/track/${variables.orderId}`;

      // 4. Generate message with variables
      const message = this.replaceOrderVariables(rule.responseMessage, {
        ...variables,
        phone: customerPhone,
        trackingLink,
      });

      // 5. Delay (natural typing effect)
      this.logger.log(`Waiting ${rule.delaySeconds}s before sending...`);
      await this.sleep(rule.delaySeconds * 1000);

      // 6. Send WhatsApp message
      const result = await this.whatsappService.sendMessage(
        tenantId,
        customerPhone,
        message
      );

      if (result.success) {
        // 7. Update rule stats
        await this.updateRuleStats(rule);

        this.logger.log(
          `[${statusType}] Notification sent successfully to ${customerPhone}`
        );
        return { sent: true };
      }

      this.logger.warn(
        `[${statusType}] Failed to send message: ${result.error}`
      );
      return { sent: false, reason: result.error || 'Unknown error' };
    } catch (error) {
      this.logger.error(`[${statusType}] Error sending notification`, {
        orderId: variables.orderId,
        orderNumber: variables.orderNumber,
        phone: customerPhone,
        status,
        error: error.message,
        stack: error.stack,
      });
      return { sent: false, reason: error.message };
    }
  }

  /**
   * Replace order-specific variables in template
   */
  private replaceOrderVariables(
    template: string,
    vars: {
      name: string;
      phone: string;
      orderNumber: string;
      total: number;
      trackingLink: string;
    }
  ): string {
    return template
      .replace(/\{\{name\}\}/g, vars.name || 'Customer')
      .replace(/\{\{phone\}\}/g, vars.phone || '')
      .replace(/\{\{order_number\}\}/g, vars.orderNumber)
      .replace(/\{\{total\}\}/g, this.formatPrice(vars.total))
      .replace(/\{\{tracking_link\}\}/g, vars.trackingLink);
  }

  /**
   * Format price to IDR currency
   */
  private formatPrice(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Update rule statistics
   */
  private async updateRuleStats(rule: AutoReplyRule): Promise<void> {
    await this.prisma.autoReplyRule.update({
      where: { id: rule.id },
      data: {
        totalTriggered: { increment: 1 },
        lastTriggeredAt: new Date(),
      },
    });
  }

  /**
   * Sleep utility for delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

---

### **3. OrdersService Integration**

**File:** `server/src/orders/orders.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AutoReplyService } from '../auto-reply/auto-reply.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private autoReply: AutoReplyService
  ) {}

  /**
   * Update order status
   */
  async updateStatus(
    tenantId: string,
    orderId: string,
    dto: UpdateOrderStatusDto
  ) {
    // 1. Update order in database
    const order = await this.prisma.order.update({
      where: { id: orderId, tenantId },
      data: {
        status: dto.status,
        ...(dto.status === 'COMPLETED' && { completedAt: new Date() }),
      },
      include: { customer: true },
    });

    // 2. Get customer phone
    const phone = order.customer?.phone || order.customerPhone;

    // 3. Trigger notification (if phone exists)
    if (phone) {
      // ✅ Run in background, don't block response
      this.autoReply
        .triggerOrderStatusNotification(
          tenantId,
          phone,
          'ORDER_STATUS',
          dto.status,
          {
            orderId: order.id, // ✅ Already UUID (cuid)!
            orderNumber: order.orderNumber,
            name: order.customer?.name || order.customerName || 'Customer',
            total: order.total,
          }
        )
        .catch((error) => {
          // ✅ Graceful error handling, don't crash
          this.logger.error('Failed to send order status notification', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: dto.status,
            error: error.message,
          });
        });
    }

    return {
      message: `Status order diubah ke ${dto.status}`,
      order,
    };
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(
    tenantId: string,
    orderId: string,
    dto: UpdatePaymentStatusDto
  ) {
    // 1. Update payment status
    const order = await this.prisma.order.update({
      where: { id: orderId, tenantId },
      data: {
        paymentStatus: dto.paymentStatus,
        ...(dto.paidAmount && { paidAmount: dto.paidAmount }),
      },
      include: { customer: true },
    });

    // 2. Get customer phone
    const phone = order.customer?.phone || order.customerPhone;

    // 3. Trigger notification
    if (phone) {
      this.autoReply
        .triggerOrderStatusNotification(
          tenantId,
          phone,
          'PAYMENT_STATUS',
          dto.paymentStatus,
          {
            orderId: order.id,
            orderNumber: order.orderNumber,
            name: order.customer?.name || order.customerName || 'Customer',
            total: order.total,
          }
        )
        .catch((error) => {
          this.logger.error('Failed to send payment status notification', {
            orderId: order.id,
            paymentStatus: dto.paymentStatus,
            error: error.message,
          });
        });
    }

    return {
      message: `Status pembayaran diubah ke ${dto.paymentStatus}`,
      order,
    };
  }
}
```

---

### **4. Module Configuration**

**File:** `server/src/auto-reply/auto-reply.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { AutoReplyService } from './auto-reply.service';
import { AutoReplyController } from './auto-reply.controller';
import { KeywordEngine } from './engines/keyword-engine';
import { TimeBasedEngine } from './engines/time-based-engine';
import { WelcomeEngine } from './engines/welcome-engine';
import { OrderStatusEngine } from './engines/order-status-engine'; // ✅ NEW

@Module({
  imports: [PrismaModule, WhatsAppModule],
  controllers: [AutoReplyController],
  providers: [
    AutoReplyService,
    KeywordEngine,
    TimeBasedEngine,
    WelcomeEngine,
    OrderStatusEngine, // ✅ NEW
  ],
  exports: [AutoReplyService],
})
export class AutoReplyModule {}
```

**File:** `server/src/orders/orders.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AutoReplyModule } from '../auto-reply/auto-reply.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [AutoReplyModule], // ✅ Import AutoReplyModule
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
```

---

## 🎨 FRONTEND IMPLEMENTATION

### **CRITICAL CHANGE: 4 SEPARATE PAGES!**

❌ **OLD (CONFUSING):**

```
/dashboard/auto-reply/new
  └─ Form dengan dropdown trigger type (WELCOME, KEYWORD, ORDER_STATUS, dll)
     └─ Semua jadi 1, BIKIN BINGUNG! ❌
```

✅ **NEW (CLEAN & CLEAR):**

```
/dashboard/auto-reply/welcome       → Dedicated untuk WELCOME
/dashboard/auto-reply/keywords      → Dedicated untuk KEYWORD (bisa multiple)
/dashboard/auto-reply/order-status  → Dedicated untuk ORDER_STATUS (4 status)
/dashboard/auto-reply/payment       → Dedicated untuk PAYMENT_STATUS (3 status)
```

---

### **1. Route Structure**

**File:** `client/src/app/dashboard/auto-reply/layout.tsx`

```tsx
export default function AutoReplyLayout({ children }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Auto-Reply Rules</h1>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/dashboard/auto-reply">All Rules</Link>
          </TabsTrigger>
          <TabsTrigger value="welcome" asChild>
            <Link href="/dashboard/auto-reply/welcome">Welcome Message</Link>
          </TabsTrigger>
          <TabsTrigger value="keywords" asChild>
            <Link href="/dashboard/auto-reply/keywords">Keywords</Link>
          </TabsTrigger>
          <TabsTrigger value="order-status" asChild>
            <Link href="/dashboard/auto-reply/order-status">Order Status</Link>
          </TabsTrigger>
          <TabsTrigger value="payment" asChild>
            <Link href="/dashboard/auto-reply/payment">Payment Status</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}
```

---

### **2. Order Status Page (DEDICATED)**

**File:** `client/src/app/dashboard/auto-reply/order-status/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { OrderStatusRuleForm } from './components/order-status-rule-form';
import { useAutoReplyRules } from '@/hooks/use-auto-reply-rules';
import { Loader2, Plus, AlertCircle } from 'lucide-react';

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending (Menunggu)', color: 'yellow' },
  { value: 'PROCESSING', label: 'Processing (Diproses)', color: 'blue' },
  { value: 'COMPLETED', label: 'Completed (Selesai)', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled (Dibatalkan)', color: 'red' },
];

export default function OrderStatusPage() {
  const { rules, loading, createRule, updateRule, deleteRule } =
    useAutoReplyRules();
  const [editingRule, setEditingRule] = useState(null);
  const [creatingStatus, setCreatingStatus] = useState<string | null>(null);

  // Filter order status rules only
  const orderStatusRules = rules.filter(
    (r) => r.triggerType === 'ORDER_STATUS'
  );

  // Get which statuses already have rules
  const existingStatuses = orderStatusRules.map((r) => r.keywords[0]);

  // Get available statuses (not yet created)
  const availableStatuses = ORDER_STATUSES.filter(
    (s) => !existingStatuses.includes(s.value)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Order Status Notifications</strong> - Auto-send WhatsApp saat
          owner update status order. Maksimal 1 rule per status. Priority &
          delay diatur otomatis.
        </AlertDescription>
      </Alert>

      {/* Existing Rules */}
      <div className="grid gap-4 md:grid-cols-2">
        {orderStatusRules.map((rule) => {
          const status = ORDER_STATUSES.find(
            (s) => s.value === rule.keywords[0]
          );

          return (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{status?.label}</CardTitle>
                  <Badge variant={status?.color as any}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Message Preview */}
                <div className="bg-gray-50 p-3 rounded text-sm">
                  {rule.responseMessage.substring(0, 100)}...
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Sent: {rule.totalTriggered}x</span>
                  <span>Delay: {rule.delaySeconds}s</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingRule(rule)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteRule(rule.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Available Statuses (Not Yet Created) */}
      {availableStatuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {availableStatuses.map((status) => (
                <Button
                  key={status.value}
                  variant="outline"
                  className="justify-start"
                  onClick={() => setCreatingStatus(status.value)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {status.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Slots Filled */}
      {availableStatuses.length === 0 && orderStatusRules.length === 4 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Semua status sudah memiliki rule. Edit atau hapus rule existing
            untuk membuat perubahan.
          </AlertDescription>
        </Alert>
      )}

      {/* Create/Edit Form Modal */}
      {(creatingStatus || editingRule) && (
        <OrderStatusRuleForm
          status={creatingStatus}
          rule={editingRule}
          onSave={(data) => {
            if (editingRule) {
              updateRule(editingRule.id, data);
            } else {
              createRule(data);
            }
            setCreatingStatus(null);
            setEditingRule(null);
          }}
          onCancel={() => {
            setCreatingStatus(null);
            setEditingRule(null);
          }}
        />
      )}
    </div>
  );
}
```

---

### **3. Order Status Rule Form Component**

**File:**
`client/src/app/dashboard/auto-reply/order-status/components/order-status-rule-form.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageEditor } from '@/components/auto-reply/message-editor';
import { Info } from 'lucide-react';

const STATUS_LABELS = {
  PENDING: 'Pending (Menunggu)',
  PROCESSING: 'Processing (Diproses)',
  COMPLETED: 'Completed (Selesai)',
  CANCELLED: 'Cancelled (Dibatalkan)',
};

const DEFAULT_TEMPLATES = {
  PENDING: `Halo {{name}}! 👋

Terima kasih sudah order!

📝 Order #{{order_number}}
💰 Total: {{total}}

Order kamu udah kami terima dan akan segera kami proses ya!

Cek status: {{tracking_link}}`,

  PROCESSING: `Hi {{name}}! 🚀

Kabar baik nih!

📦 Order #{{order_number}} sedang dalam *PROSES*

Cek status terbaru: {{tracking_link}}

Kami akan update lagi nanti! 💪`,

  COMPLETED: `Yeay! 🎉

Order #{{order_number}} udah *SELESAI*!

Terima kasih sudah order di kami {{name}}!

Jangan lupa kasih review ya ⭐⭐⭐⭐⭐

Sampai jumpa lagi! 👋`,

  CANCELLED: `Halo {{name}},

Mohon maaf, order #{{order_number}} harus kami batalkan.

Jika ada pertanyaan, silakan hubungi kami ya.

Terima kasih atas pengertiannya 🙏`,
};

interface Props {
  status: string | null; // For create
  rule?: any; // For edit
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function OrderStatusRuleForm({ status, rule, onSave, onCancel }: Props) {
  const currentStatus = status || rule?.keywords[0];
  const [message, setMessage] = useState(
    rule?.responseMessage || DEFAULT_TEMPLATES[currentStatus] || ''
  );

  const handleSave = () => {
    onSave({
      name: `Order Status: ${STATUS_LABELS[currentStatus]}`,
      triggerType: 'ORDER_STATUS',
      keywords: [currentStatus], // ✅ Status disimpan di keywords array!
      responseMessage: message,
      isActive: true,
      // Priority & delay will be auto-assigned by backend
    });
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'Edit' : 'Create'} Rule: {STATUS_LABELS[currentStatus]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Auto-assigned settings:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Priority: 70 (high)</li>
                <li>• Delay: {currentStatus === 'COMPLETED' ? '2s' : '3-5s'} (natural timing)</li>
                <li>• Trigger: Saat owner update status ke "{STATUS_LABELS[currentStatus]}"</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Message Editor */}
          <div className="space-y-3">
            <Label>Pesan Template *</Label>
            <MessageEditor
              value={message}
              onChange={setMessage}
              triggerType="ORDER_STATUS"
              placeholder="Gunakan {{name}}, {{order_number}}, {{total}}, {{tracking_link}}"
            />
            <p className="text-sm text-gray-500">
              Available variables: {{'{'}name{'}'}, {{'{'}order_number{'}'}, {{'{'}total{'}'}, {{'{'}tracking_link{'}'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!message.trim()}>
              {rule ? 'Update' : 'Create'} Rule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

### **4. Payment Status Page (SIMILAR STRUCTURE)**

**File:** `client/src/app/dashboard/auto-reply/payment/page.tsx`

```tsx
// Same structure as order-status/page.tsx
// But with payment statuses:

const PAYMENT_STATUSES = [
  { value: 'PAID', label: 'Paid (Lunas)', color: 'green' },
  { value: 'PARTIAL', label: 'Partial (Sebagian)', color: 'yellow' },
  { value: 'FAILED', label: 'Failed (Gagal)', color: 'red' },
];

// Same component structure, different data
```

---

### **5. Welcome Message Page (SINGLE RULE ONLY)**

**File:** `client/src/app/dashboard/auto-reply/welcome/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WelcomeRuleForm } from './components/welcome-rule-form';
import { useAutoReplyRules } from '@/hooks/use-auto-reply-rules';
import { Loader2, Plus, AlertCircle } from 'lucide-react';

export default function WelcomePage() {
  const { rules, loading, createRule, updateRule, deleteRule } =
    useAutoReplyRules();
  const [isEditing, setIsEditing] = useState(false);

  // Get welcome rule (should be only 1)
  const welcomeRule = rules.find((r) => r.triggerType === 'WELCOME');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Welcome Message</strong> - Pesan otomatis yang dikirim saat
          customer kontak pertama kali. Maksimal 1 rule welcome message.
        </AlertDescription>
      </Alert>

      {/* Existing Rule */}
      {welcomeRule ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Welcome Message</CardTitle>
              <Badge variant={welcomeRule.isActive ? 'success' : 'secondary'}>
                {welcomeRule.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Message Preview */}
            <div className="bg-gray-50 p-4 rounded">
              <pre className="whitespace-pre-wrap text-sm">
                {welcomeRule.responseMessage}
              </pre>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Sent: {welcomeRule.totalTriggered}x</span>
              <span>Delay: {welcomeRule.delaySeconds}s</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button
                variant="destructive"
                onClick={() => deleteRule(welcomeRule.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // No Rule Yet - Show Create Button
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">Belum ada welcome message</p>
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Welcome Message
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit/Create Form */}
      {isEditing && (
        <WelcomeRuleForm
          rule={welcomeRule}
          onSave={(data) => {
            if (welcomeRule) {
              updateRule(welcomeRule.id, data);
            } else {
              createRule(data);
            }
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
```

---

### **6. Keywords Page (MULTIPLE RULES ALLOWED)**

**File:** `client/src/app/dashboard/auto-reply/keywords/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KeywordRuleForm } from './components/keyword-rule-form';
import { useAutoReplyRules } from '@/hooks/use-auto-reply-rules';
import { Loader2, Plus, AlertCircle } from 'lucide-react';

export default function KeywordsPage() {
  const { rules, loading, createRule, updateRule, deleteRule } =
    useAutoReplyRules();
  const [editingRule, setEditingRule] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Filter keyword rules only
  const keywordRules = rules.filter((r) => r.triggerType === 'KEYWORD');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Alert className="flex-1 mr-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Keyword Auto-Reply</strong> - Balas otomatis saat customer
            kirim kata kunci tertentu. Bisa buat multiple rules.
          </AlertDescription>
        </Alert>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {keywordRules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{rule.name}</CardTitle>
                <Badge variant={rule.isActive ? 'success' : 'secondary'}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Keywords */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {rule.keywords.map((kw) => (
                    <Badge key={kw} variant="outline">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Message Preview */}
              <div className="bg-gray-50 p-3 rounded text-sm">
                {rule.responseMessage.substring(0, 80)}...
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingRule(rule)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteRule(rule.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {keywordRules.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">Belum ada keyword rules</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Rule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingRule) && (
        <KeywordRuleForm
          rule={editingRule}
          onSave={(data) => {
            if (editingRule) {
              updateRule(editingRule.id, data);
            } else {
              createRule(data);
            }
            setIsCreating(false);
            setEditingRule(null);
          }}
          onCancel={() => {
            setIsCreating(false);
            setEditingRule(null);
          }}
        />
      )}
    </div>
  );
}
```

---

## 🔌 API DESIGN

### **No Changes Needed!**

Existing auto-reply endpoints work as-is:

```typescript
// Get all rules
GET /api/auto-reply/rules

// Create rule
POST /api/auto-reply/rules
{
  "name": "Order Processing",
  "triggerType": "ORDER_STATUS",
  "keywords": ["PROCESSING"],  // ✅ Status here!
  "responseMessage": "Hi {{name}}! Order {{order_number}} is being processed..."
  // Priority & delay auto-assigned by backend
}

// Update rule
PUT /api/auto-reply/rules/:id

// Delete rule
DELETE /api/auto-reply/rules/:id
```

---

## 🧪 TESTING GUIDE

### **Test Case 1: Create ORDER_STATUS Rule**

**Steps:**

1. Login → `/dashboard/auto-reply/order-status`
2. Click "Create New Rule" → Select "Processing"
3. Edit message template (or use default)
4. Click "Create Rule"

**Expected:**

- ✅ Rule created successfully
- ✅ Rule appears in "Processing" card
- ✅ "Processing" button disappears from "Create New Rule" section
- ✅ Cannot create another "Processing" rule (button gone)

---

### **Test Case 2: Trigger Notification**

**Steps:**

1. Create order with customer phone
2. Update order status: PENDING → PROCESSING
3. Wait 5 seconds
4. Check customer's WhatsApp

**Expected:**

- ✅ Order status updated in database
- ✅ WhatsApp message sent to customer
- ✅ Message contains: name, order number, total (formatted), tracking link
- ✅ Tracking link format: `/store/{slug}/track/{uuid}`
- ✅ Tracking link works (opens order tracking page)

---

### **Test Case 3: Prevent Duplicates**

**Steps:**

1. Create "PENDING" rule
2. Try to create another "PENDING" rule

**Expected:**

- ✅ Button for "PENDING" is gone after first creation
- ✅ Cannot create duplicate
- ✅ Can only edit or delete existing rule

---

### **Test Case 4: UUID Security**

**Check tracking link:**

```
✅ Format: https://toko.com/store/budi-shop/track/cm123abc456def
✅ UUID is from order.id (cuid, unpredictable)
✅ Cannot guess other order UUIDs
✅ Link opens order tracking page correctly
```

---

### **Test Case 5: Variable Replacement**

**Check message received:**

```
✅ {{name}} → "Budi"
✅ {{order_number}} → "ORD-20260129-001"
✅ {{total}} → "Rp 70.000"
✅ {{tracking_link}} → Full URL with UUID
```

---

### **Test Case 6: All Status Types**

**Create rules for all statuses:**

- ✅ PENDING rule → Works
- ✅ PROCESSING rule → Works
- ✅ COMPLETED rule → Works
- ✅ CANCELLED rule → Works
- ✅ All 4 slots filled → No more "Create New Rule" buttons

---

## ✅ BEST PRACTICES

### **1. One Rule Per Status (LOCKED)**

```typescript
// ✅ GOOD: Each status has exactly 1 rule
PENDING → 1 rule
PROCESSING → 1 rule
COMPLETED → 1 rule
CANCELLED → 1 rule

// ❌ BAD: Multiple rules for same status
PENDING → 2 rules  // PREVENTED by unique constraint!
```

**Enforcement:**

- Database: `UNIQUE(tenantId, triggerType, keywords)`
- Frontend: Hide "Create" button after rule exists
- Backend: Reject duplicate creation

---

### **2. Auto-Assigned Settings**

```typescript
// ✅ GOOD: Backend assigns priority & delay
createRule({
  triggerType: 'ORDER_STATUS',
  keywords: ['PROCESSING'],
  // Priority & delay NOT sent by frontend
});

// Backend auto-assigns:
// - priority: 70
// - delaySeconds: 5

// ❌ BAD: Frontend tries to set priority
createRule({
  priority: 100, // IGNORED by backend!
  delaySeconds: 10, // IGNORED by backend!
});
```

---

### **3. Message Templates**

**DO ✅**

```
"Hi {{name}}!

Order {{order_number}} sedang diproses 🚀

Total: {{total}}

Cek status: {{tracking_link}}

Terima kasih!"
```

**DON'T ❌**

```
"ORDER_PROCESSING. ID:{{order_number}}. CHECK:{{tracking_link}}"
```

**Tips:**

- Natural & friendly language
- Use emojis (but not excessive)
- Include tracking link
- Personal (use {{name}})

---

### **4. Separate Pages**

**DO ✅**

```
/dashboard/auto-reply/welcome       → WELCOME only
/dashboard/auto-reply/keywords      → KEYWORD only
/dashboard/auto-reply/order-status  → ORDER_STATUS only
/dashboard/auto-reply/payment       → PAYMENT_STATUS only
```

**DON'T ❌**

```
/dashboard/auto-reply/new
  └─ Dropdown dengan semua trigger types
     └─ CONFUSING! User bingung mana yang mana
```

---

### **5. Error Handling**

```typescript
// ✅ GOOD: Graceful error handling
try {
  await this.autoReply.triggerOrderStatusNotification(...);
} catch (error) {
  this.logger.error('Failed to send notification', {
    orderId: order.id,
    status: dto.status,
    error: error.message,
  });
  // Order still updated successfully
}

// ❌ BAD: Let error crash the app
await this.autoReply.triggerOrderStatusNotification(...);
// If fails → whole request fails!
```

---

## 🎯 SUCCESS CRITERIA

### **Functional Requirements**

- [x] Owner dapat create rule untuk ORDER_STATUS (4 statuses)
- [x] Owner dapat create rule untuk PAYMENT_STATUS (3 statuses)
- [x] **MAKSIMAL 1 RULE PER STATUS** (enforced)
- [x] Priority & delay **auto-assigned** by backend
- [x] System auto-send WhatsApp saat status berubah
- [x] Support variable replacement ({{name}}, {{order_number}}, {{total}},
      {{tracking_link}})
- [x] Tracking link uses **order.id** (already UUID)
- [x] Status history tersimpan dengan timestamp
- [x] **4 SEPARATE FRONTEND PAGES** (no confusion)
- [x] Track total notification sent per rule

---

### **Non-Functional Requirements**

- [x] Response time update status < 1 detik
- [x] WhatsApp send delay sesuai auto-assigned (2-5 detik)
- [x] 99% success rate notification delivery
- [x] Zero duplicates (unique constraint enforced)
- [x] Database optimized (indexed queries)
- [x] Error handling comprehensive (no crashes)
- [x] Logging untuk debugging (detailed context)

---

### **User Experience**

**Owner:**

- ✅ **Clear navigation** - 4 separate pages, no confusion
- ✅ **Cannot create duplicates** - Button hidden after rule exists
- ✅ **Simple form** - No priority/delay inputs (auto-assigned)
- ✅ **Default templates** - Pre-filled, tinggal edit
- ✅ **Visual feedback** - See which statuses already have rules

**Customer:**

- ✅ Selalu dapat update status order
- ✅ Message jelas & mudah dipahami
- ✅ Tidak spam (max 1 update per status)
- ✅ Personal (pakai nama customer)
- ✅ Tracking link works (secure UUID)

---

## 🚀 ROLLOUT PLAN

### **Phase 1: Backend (Week 1)**

- [x] Migration (add enum values + unique constraint)
- [ ] OrderStatusEngine implementation
- [ ] AutoReplyService extensions
- [ ] OrdersService integration
- [ ] Module configuration
- [ ] Unit tests
- [ ] Integration tests

### **Phase 2: Frontend (Week 2)**

- [ ] Route structure (4 separate pages)
- [ ] Order Status page
- [ ] Payment Status page
- [ ] Welcome page (enforce single rule)
- [ ] Keywords page (allow multiple)
- [ ] MessageEditor component
- [ ] Hook updates
- [ ] UI/UX polish

### **Phase 3: Testing (Week 3)**

- [ ] QA testing all pages
- [ ] Test duplicate prevention
- [ ] Test variable replacement
- [ ] Test tracking links
- [ ] Load testing
- [ ] Bug fixes

### **Phase 4: Deployment (Week 4)**

- [ ] Production migration
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Monitor logs
- [ ] User training
- [ ] Documentation

---

## 📊 MONITORING

### **Metrics to Track**

1. **Notification Success Rate**
   - Total sent vs failed
   - Target: >99% success

2. **Rule Usage**
   - Which statuses most triggered
   - Which statuses never triggered (investigate)

3. **Tracking Link Clicks**
   - How many customers click tracking link
   - Target: >60% click rate

4. **Error Rate**
   - WhatsApp connection failures
   - Variable replacement errors
   - Target: <1% error rate

---

## 🐛 TROUBLESHOOTING

### **Problem 1: Duplicate Rule Created**

**Error:**

```
Unique constraint failed on the fields: (`tenantId`,`triggerType`,`keywords`)
```

**Solution:**

- This should NOT happen (frontend prevents it)
- If happens → Bug in frontend logic
- Check: Is "Create" button properly hidden?

---

### **Problem 2: Variable Not Replaced**

**Symptom:** Customer receives: "Hi {{name}}! Order {{order_number}}..."

**Debug:**

1. Check template syntax: `{{name}}` not `{name}` or `{{ name }}`
2. Check backend logs for variable values
3. Verify `replaceOrderVariables()` method

**Solution:**

```typescript
// Add debug logging
this.logger.debug('Replacing variables', {
  template: rule.responseMessage,
  variables: vars,
});
```

---

### **Problem 3: Notification Not Sent**

**Debug Checklist:**

- [ ] Rule exists for this status?
- [ ] Rule is active?
- [ ] WhatsApp connected?
- [ ] Customer phone exists?
- [ ] Backend logs show attempt?

**Solution:** Check logs:

```bash
tail -f server/logs/app.log | grep "ORDER_STATUS"
```

---

## 📝 APPENDIX

### **A. Priority Mapping**

| Trigger Type   | Priority | Rationale                       |
| -------------- | -------- | ------------------------------- |
| WELCOME        | 100      | First contact, highest priority |
| PAYMENT_STATUS | 80       | Money matters, urgent           |
| ORDER_STATUS   | 70       | Important updates               |
| KEYWORD        | 50       | Medium importance               |
| TIME_BASED     | 40       | Lower priority                  |

### **B. Delay Mapping**

| Status     | Delay | Rationale                 |
| ---------- | ----- | ------------------------- |
| PENDING    | 3s    | New order, moderate speed |
| PROCESSING | 5s    | Update info, take time    |
| COMPLETED  | 2s    | Good news, fast!          |
| CANCELLED  | 4s    | Bad news, gentle          |
| PAID       | 2s    | Good news, fast!          |
| PARTIAL    | 3s    | Neutral news              |
| FAILED     | 4s    | Bad news, gentle          |

### **C. Sample Queries**

**Get all ORDER_STATUS rules:**

```sql
SELECT * FROM "AutoReplyRule"
WHERE "triggerType" = 'ORDER_STATUS'
  AND "isActive" = true;
```

**Check for duplicates (should return 0):**

```sql
SELECT "tenantId", "triggerType", "keywords", COUNT(*) as count
FROM "AutoReplyRule"
GROUP BY "tenantId", "triggerType", "keywords"
HAVING COUNT(*) > 1;
```

---

## 🎓 GLOSSARY

| Term               | Definition                                                    |
| ------------------ | ------------------------------------------------------------- |
| **ORDER_STATUS**   | Trigger type untuk notifikasi perubahan status order          |
| **PAYMENT_STATUS** | Trigger type untuk notifikasi perubahan status pembayaran     |
| **cuid**           | Collision-resistant unique identifier (like UUID)             |
| **Variable**       | Placeholder dalam template yang diganti dengan data aktual    |
| **Tracking Link**  | URL untuk customer cek status order (format: `/track/{uuid}`) |
| **Auto-Assigned**  | Setting yang diatur otomatis oleh system (priority, delay)    |
| **Locked**         | Status yang sudah punya rule, ga bisa bikin lagi (max 1)      |

---

**END OF REVISED DOCUMENTATION**

Version: 2.0.0 (REVISED & SIMPLIFIED)  
Last Updated: 2026-01-29  
Author: Development Team

**Key Changes from v1.0:**

- ✅ Simplified schema (reuse keywords, no new fields)
- ✅ UUID from order.id (no need generate new)
- ✅ Support all statuses (no skip PENDING)
- ✅ 4 separate frontend pages (no confusion)
- ✅ Enforce 1 rule per status (prevent duplicates)
- ✅ Better error logging (detailed context)

---

## 📚 REFERENCES

- [Prisma Unique Constraints](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#unique)
- [NestJS Logger](https://docs.nestjs.com/techniques/logger)
- [React Router](https://reactrouter.com/en/main)
- [Baileys WhatsApp](https://github.com/WhiskeySockets/Baileys)

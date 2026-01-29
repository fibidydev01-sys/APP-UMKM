# 📦 FITUR: ORDER STATUS FOLLOW-UP SYSTEM

**Project:** UMKM Multi-Tenant - WhatsApp Chat Module  
**Feature:** Automatic Order Status Update via WhatsApp  
**Version:** 1.0.0  
**Date:** 2026-01-29

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Business Flow](#business-flow)
3. [Technical Flow](#technical-flow)
4. [Database Schema](#database-schema)
5. [API Design](#api-design)
6. [Module Structure](#module-structure)
7. [Implementation Guide](#implementation-guide)
8. [Use Cases & Examples](#use-cases--examples)
9. [Best Practices](#best-practices)
10. [Success Criteria](#success-criteria)

---

## 🎯 OVERVIEW

### **Konsep Utama**

Sistem automatis untuk mengirim update status order ke customer melalui WhatsApp yang sudah terkoneksi dengan tenant. **TIDAK ADA NOTIFIKASI PUSH, TIDAK ADA LOGIN CUSTOMER** - semua komunikasi melalui WhatsApp chat yang sudah terhubung.

### **Karakteristik**

- ✅ **Pure Rule-Based** - NO AI, ringan, cepat
- ✅ **WhatsApp Only** - Semua update via chat WhatsApp
- ✅ **Single Tenant Mode** - 1 Tenant = 1 WhatsApp Session = 1 Owner
- ✅ **Automatic** - Owner update status → System auto-send message
- ✅ **Template-Based** - Customizable message templates
- ✅ **Conversation-Linked** - Order terhubung dengan chat conversation

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
[SYSTEM - Auto Reply]
    ↓
"Halo! Terima kasih sudah hubungi kami. Ada yang bisa kami bantu?"
    ↓
[OWNER - via Dashboard]
    ↓
Baca chat → Create Order dari conversation
    ↓
Order dibuat dengan status: PENDING
    ↓
[SYSTEM - Auto Send WA]
    ↓
Customer terima: "Halo Budi! Terima kasih sudah order! 
Order #ORD-001 sudah kami terima dan akan segera kami proses."
    ↓
[OWNER - Update Status]
    ↓
Click: Update Status → PROCESSING
Input: Estimasi 3 hari
    ↓
[SYSTEM - Auto Send WA]
    ↓
Customer terima: "Hi Budi! Kabar baik nih! 
Order #ORD-001 sedang dalam PROSES. Estimasi selesai dalam 3 hari ya."
    ↓
[OWNER - Update Status]
    ↓
Click: Update Status → COMPLETED
    ↓
[SYSTEM - Auto Send WA]
    ↓
Customer terima: "Yeay! Order #ORD-001 udah SELESAI! 
Terima kasih sudah order di kami Budi!"
    ↓
[CUSTOMER]
    ↓
Happy & Trust meningkat ✅
```

### **Business Rules**

1. **Order Creation:**
   - Order bisa dibuat dari conversation yang sudah ada
   - Order bisa dibuat manual (tanpa conversation)
   - Jika ada conversation → Auto-link ke order
   - Customer phone WAJIB ada (untuk send WA)

2. **Status Update:**
   - Setiap update status → Auto-send WhatsApp message
   - Owner bisa matikan auto-send jika perlu
   - Owner bisa tambah note untuk customer
   - Owner bisa set estimasi hari completion

3. **Message Templates:**
   - Setiap status punya template message sendiri
   - Template bisa di-customize per tenant
   - Support variables: {{name}}, {{order_number}}, {{status}}, {{days}}, {{total}}
   - Ada delay 2-5 detik sebelum kirim (human-like)

4. **Status History:**
   - Semua perubahan status tersimpan
   - Timeline lengkap dengan timestamp
   - Bisa add note di setiap perubahan
   - Bisa track estimasi completion

---

## 🔧 TECHNICAL FLOW

### **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  (Owner Dashboard - Order Management)                       │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ PATCH /api/orders/:id/status
                ↓
┌───────────────────────────────────────────────────────────┐
│                    BACKEND - NestJS                        │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  OrdersController                                 │    │
│  │  └─> updateOrderStatus()                         │    │
│  └────────────┬──────────────────────────────────────┘    │
│               │                                            │
│               ↓                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  StatusNotificationsService                       │    │
│  │                                                    │    │
│  │  1. Update Order Status                          │    │
│  │  2. Add to Status History                        │    │
│  │  3. Get Active Template                          │    │
│  │  4. Generate Message (replace variables)         │    │
│  │  5. Delay (2-5 seconds)                          │    │
│  │  6. Send WhatsApp Message                        │    │
│  │  7. Update Template Stats                        │    │
│  └────────────┬──────────────────────────────────────┘    │
│               │                                            │
│               ↓                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  WhatsAppService (Baileys)                       │    │
│  │  └─> sendMessage(phone, message)                │    │
│  └────────────┬──────────────────────────────────────┘    │
└───────────────┼────────────────────────────────────────────┘
                │
                ↓
        ┌───────────────┐
        │   WhatsApp    │
        │   (Customer)  │
        └───────────────┘
```

### **Data Flow**

```
1. ORDER UPDATE REQUEST
   ↓
   {
     orderId: "order_123",
     status: "PROCESSING",
     estimatedDays: 3,
     note: "Sedang dikerjakan tim produksi"
   }

2. DATABASE UPDATE
   ↓
   Order.update({
     status: "PROCESSING",
     statusHistory: [...old, {
       status: "PROCESSING",
       timestamp: "2026-01-29T10:00:00Z",
       note: "Sedang dikerjakan tim produksi",
       estimatedDays: 3
     }],
     estimatedCompletionDate: "2026-02-01"
   })

3. TEMPLATE LOOKUP
   ↓
   StatusUpdateTemplate.findOne({
     tenantId: "tenant_123",
     statusTrigger: "PROCESSING",
     isActive: true,
     autoSend: true
   })

4. MESSAGE GENERATION
   ↓
   Template: "Hi {{name}}! Order {{order_number}} sedang {{status}}. Estimasi {{days}} hari."
   ↓
   Result: "Hi Budi! Order ORD-001 sedang Sedang Diproses. Estimasi 3 hari."

5. DELAY
   ↓
   await sleep(5000) // 5 seconds

6. SEND WHATSAPP
   ↓
   WhatsAppService.sendMessage(
     tenantId: "tenant_123",
     to: "628123456789",
     message: "Hi Budi! Order ORD-001..."
   )

7. UPDATE STATS
   ↓
   StatusUpdateTemplate.update({
     totalSent: totalSent + 1
   })
```

---

## 🗄️ DATABASE SCHEMA

### **1. Schema Update - Order Table (EXISTING)**

```sql
-- Tambah field baru di tabel Order yang sudah ada
ALTER TABLE "Order" 
ADD COLUMN "statusHistory" JSONB DEFAULT '[]',
ADD COLUMN "estimatedCompletionDate" TIMESTAMP,
ADD COLUMN "conversationId" VARCHAR(36);

-- Add foreign key
ALTER TABLE "Order"
ADD CONSTRAINT fk_order_conversation 
FOREIGN KEY ("conversationId") 
REFERENCES "Conversation"("id") 
ON DELETE SET NULL;

-- Add index
CREATE INDEX idx_order_conversation ON "Order"("conversationId");
CREATE INDEX idx_order_status_history ON "Order" USING GIN("statusHistory");
```

**Field Descriptions:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `statusHistory` | JSONB | Array timeline perubahan status | `[{status: "PENDING", timestamp: "...", note: "..."}]` |
| `estimatedCompletionDate` | TIMESTAMP | Estimasi tanggal selesai | `2026-02-05T00:00:00Z` |
| `conversationId` | VARCHAR(36) | Link ke WhatsApp conversation (optional) | `conv_abc123` |

**Status History JSON Structure:**

```json
[
  {
    "status": "PENDING",
    "timestamp": "2026-01-29T09:00:00Z",
    "note": "",
    "estimatedDays": null
  },
  {
    "status": "PROCESSING",
    "timestamp": "2026-01-29T10:00:00Z",
    "note": "Sedang dikerjakan tim produksi",
    "estimatedDays": 3
  },
  {
    "status": "COMPLETED",
    "timestamp": "2026-02-01T15:00:00Z",
    "note": "Pesanan sudah selesai dan siap diambil",
    "estimatedDays": null
  }
]
```

---

### **2. New Table - StatusUpdateTemplate**

```sql
-- Create ENUM for status triggers
CREATE TYPE "StatusTrigger" AS ENUM (
  'PENDING',
  'PROCESSING', 
  'COMPLETED',
  'CANCELLED'
);

-- Create table
CREATE TABLE "StatusUpdateTemplate" (
  "id" VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  "tenantId" VARCHAR(36) NOT NULL,
  
  -- Template Info
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  
  -- Trigger
  "statusTrigger" "StatusTrigger" NOT NULL,
  
  -- Message Template
  "messageTemplate" TEXT NOT NULL,
  
  -- Auto-send Settings
  "autoSend" BOOLEAN DEFAULT TRUE,
  "delaySeconds" INTEGER DEFAULT 5,
  
  -- Tracking
  "totalSent" INTEGER DEFAULT 0,
  
  -- Status
  "isActive" BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  
  -- Foreign Key Constraint
  CONSTRAINT fk_template_tenant 
    FOREIGN KEY ("tenantId") 
    REFERENCES "Tenant"("id") 
    ON DELETE CASCADE,
  
  -- Unique Constraint (1 template per status per tenant)
  CONSTRAINT unique_tenant_status 
    UNIQUE("tenantId", "statusTrigger")
);

-- Indexes
CREATE INDEX idx_status_templates_tenant 
  ON "StatusUpdateTemplate"("tenantId");
  
CREATE INDEX idx_status_templates_active 
  ON "StatusUpdateTemplate"("tenantId", "isActive") 
  WHERE "isActive" = TRUE;
  
CREATE INDEX idx_status_templates_trigger 
  ON "StatusUpdateTemplate"("tenantId", "statusTrigger");
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | VARCHAR(36) | Yes | Primary key |
| `tenantId` | VARCHAR(36) | Yes | FK to Tenant |
| `name` | VARCHAR(100) | Yes | Template name (e.g., "Order Processing Started") |
| `description` | TEXT | No | Template description |
| `statusTrigger` | ENUM | Yes | Which status triggers this template |
| `messageTemplate` | TEXT | Yes | Message template with variables |
| `autoSend` | BOOLEAN | No | Auto-send when status changes (default: true) |
| `delaySeconds` | INTEGER | No | Delay before sending (default: 5) |
| `totalSent` | INTEGER | No | Counter for analytics |
| `isActive` | BOOLEAN | No | Enable/disable template |

---

### **3. Prisma Schema Update**

```prisma
// ==========================================
// ADD NEW ENUM
// ==========================================

enum StatusTrigger {
  PENDING
  PROCESSING
  COMPLETED
  CANCELLED
}

// ==========================================
// UPDATE EXISTING MODEL: Order
// ==========================================

model Order {
  id            String        @id @default(cuid())
  tenantId      String
  tenant        Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  customerId    String?
  customer      Customer?     @relation(fields: [customerId], references: [id], onDelete: SetNull)
  
  // ========== EXISTING FIELDS ==========
  orderNumber   String
  items         OrderItem[]
  subtotal      Float
  discount      Float         @default(0)
  tax           Float         @default(0)
  total         Float
  paymentMethod String?
  paymentStatus PaymentStatus @default(PENDING)
  paidAmount    Float         @default(0)
  status        OrderStatus   @default(PENDING)
  customerName  String?
  customerPhone String?
  notes         String?
  metadata      Json?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  completedAt   DateTime?
  
  // ========== NEW FIELDS ==========
  statusHistory            Json?              // Array of status changes
  estimatedCompletionDate  DateTime?          // Estimated completion date
  conversationId           String?            // Link to WhatsApp conversation
  conversation             Conversation?      @relation(fields: [conversationId], references: [id], onDelete: SetNull)
  
  @@unique([tenantId, orderNumber])
  @@index([tenantId])
  @@index([tenantId, status])
  @@index([tenantId, paymentStatus])
  @@index([tenantId, createdAt])
  @@index([customerId])
  @@index([tenantId, paymentStatus, createdAt])
  @@index([conversationId])  // NEW INDEX
}

// ==========================================
// UPDATE EXISTING MODEL: Conversation
// ==========================================

model Conversation {
  id                  String              @id @default(cuid())
  tenantId            String
  tenant              Tenant              @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  contactId           String?
  contact             Contact?            @relation(fields: [contactId], references: [id], onDelete: SetNull)
  
  // EXISTING FIELDS...
  customerPhone       String
  customerName        String?
  customerAvatarUrl   String?             @db.Text
  status              ConversationStatus  @default(ACTIVE)
  unreadCount         Int                 @default(0)
  totalMessages       Int                 @default(0)
  lastMessageAt       DateTime            @default(now())
  lastMessageContent  String?             @db.Text
  lastMessageFrom     String?
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt
  
  messages            Message[]
  autoReplyLogs       AutoReplyLog[]
  
  // ========== NEW RELATION ==========
  orders              Order[]             // Link back to orders
  
  @@unique([tenantId, customerPhone])
  @@index([tenantId])
  @@index([tenantId, lastMessageAt(sort: Desc)])
  @@index([tenantId, unreadCount])
}

// ==========================================
// NEW MODEL: StatusUpdateTemplate
// ==========================================

model StatusUpdateTemplate {
  id              String         @id @default(cuid())
  
  // Foreign Keys
  tenantId        String
  tenant          Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Template Info
  name            String
  description     String?        @db.Text
  
  // Trigger
  statusTrigger   StatusTrigger
  
  // Message Template
  messageTemplate String         @db.Text
  
  // Auto-send Settings
  autoSend        Boolean        @default(true)
  delaySeconds    Int            @default(5)
  
  // Tracking
  totalSent       Int            @default(0)
  
  // Status
  isActive        Boolean        @default(true)
  
  // Timestamps
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  @@unique([tenantId, statusTrigger])
  @@index([tenantId])
  @@index([tenantId, isActive])
  @@index([tenantId, statusTrigger])
}

// ==========================================
// UPDATE EXISTING MODEL: Tenant
// ==========================================

model Tenant {
  // ... existing fields ...
  
  // ========== NEW RELATION ==========
  statusUpdateTemplates StatusUpdateTemplate[]
}
```

---

### **4. Database Relationships**

```
┌─────────────┐
│   Tenant    │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────────────────────────────┐
       │                                      │
       ↓                                      ↓
┌──────────────────┐              ┌─────────────────────────┐
│      Order       │              │ StatusUpdateTemplate    │
│                  │              │                         │
│ - statusHistory  │              │ - statusTrigger         │
│ - conversation   │◄─────────────│ - messageTemplate       │
└──────┬───────────┘     Uses     │ - autoSend              │
       │                          └─────────────────────────┘
       │ N:1
       │
       ↓
┌──────────────────┐
│  Conversation    │
│                  │
│ - customerPhone  │
│ - messages       │
└──────────────────┘
```

---

## 🔌 API DESIGN

### **Module: Status Notifications**

#### **Endpoint 1: Get All Templates**

```
GET /api/status-templates
```

**Headers:**
```
Authorization: Bearer <tenant_token>
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "template_123",
      "name": "Order Processing Started",
      "description": "Template for when order status changes to PROCESSING",
      "statusTrigger": "PROCESSING",
      "messageTemplate": "Hi {{name}}! Order {{order_number}} sedang dalam PROSES. Estimasi {{days}} hari ya.",
      "autoSend": true,
      "delaySeconds": 5,
      "totalSent": 156,
      "isActive": true,
      "createdAt": "2026-01-29T09:00:00Z",
      "updatedAt": "2026-01-29T09:00:00Z"
    }
  ]
}
```

---

#### **Endpoint 2: Create Template**

```
POST /api/status-templates
```

**Headers:**
```
Authorization: Bearer <tenant_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Order Completed",
  "description": "Template for completed orders",
  "statusTrigger": "COMPLETED",
  "messageTemplate": "Yeay! Order {{order_number}} udah SELESAI! Terima kasih {{name}}!",
  "autoSend": true,
  "delaySeconds": 3,
  "isActive": true
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "template_456",
    "name": "Order Completed",
    "statusTrigger": "COMPLETED",
    "messageTemplate": "Yeay! Order {{order_number}} udah SELESAI! Terima kasih {{name}}!",
    "autoSend": true,
    "delaySeconds": 3,
    "totalSent": 0,
    "isActive": true,
    "createdAt": "2026-01-29T10:00:00Z",
    "updatedAt": "2026-01-29T10:00:00Z"
  }
}
```

**Validation Rules:**
- `name`: Required, max 100 chars
- `statusTrigger`: Required, must be valid enum value
- `messageTemplate`: Required, min 10 chars
- `delaySeconds`: Optional, min 0, max 60
- Each tenant can only have 1 template per status trigger

---

#### **Endpoint 3: Update Template**

```
PUT /api/status-templates/:id
```

**Headers:**
```
Authorization: Bearer <tenant_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Order Completed (Updated)",
  "messageTemplate": "Yeay {{name}}! Order {{order_number}} sudah SELESAI! 🎉",
  "delaySeconds": 5,
  "isActive": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "template_456",
    "name": "Order Completed (Updated)",
    "messageTemplate": "Yeay {{name}}! Order {{order_number}} sudah SELESAI! 🎉",
    "delaySeconds": 5,
    "totalSent": 23,
    "updatedAt": "2026-01-29T11:00:00Z"
  }
}
```

---

#### **Endpoint 4: Delete Template**

```
DELETE /api/status-templates/:id
```

**Headers:**
```
Authorization: Bearer <tenant_token>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

---

#### **Endpoint 5: Update Order Status (MODIFIED)**

```
PATCH /api/orders/:id/status
```

**Headers:**
```
Authorization: Bearer <tenant_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "PROCESSING",
  "note": "Sedang dikerjakan tim produksi",
  "estimatedDays": 3,
  "sendNotification": true
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_123",
      "orderNumber": "ORD-001",
      "status": "PROCESSING",
      "statusHistory": [
        {
          "status": "PENDING",
          "timestamp": "2026-01-29T09:00:00Z",
          "note": "",
          "estimatedDays": null
        },
        {
          "status": "PROCESSING",
          "timestamp": "2026-01-29T10:00:00Z",
          "note": "Sedang dikerjakan tim produksi",
          "estimatedDays": 3
        }
      ],
      "estimatedCompletionDate": "2026-02-01T10:00:00Z",
      "updatedAt": "2026-01-29T10:00:00Z"
    },
    "notification": {
      "sent": true,
      "message": "Hi Budi! Order ORD-001 sedang dalam PROSES. Estimasi 3 hari ya.",
      "sentTo": "628123456789",
      "templateUsed": "template_123",
      "sentAt": "2026-01-29T10:00:05Z"
    }
  }
}
```

**Response 200 (Notification Not Sent):**
```json
{
  "success": true,
  "data": {
    "order": { /* ... */ },
    "notification": {
      "sent": false,
      "reason": "No active template found for this status"
    }
  }
}
```

**Validation Rules:**
- `status`: Required, must be valid OrderStatus enum
- `note`: Optional, max 500 chars
- `estimatedDays`: Optional, min 1, max 365
- `sendNotification`: Optional, default true

---

### **API Error Responses**

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "statusTrigger",
        "message": "statusTrigger must be a valid enum value"
      }
    ]
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Order not found"
  }
}
```

**409 Conflict:**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_TEMPLATE",
    "message": "Template for this status already exists"
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "code": "WHATSAPP_SEND_FAILED",
    "message": "Failed to send WhatsApp message",
    "details": "Connection timeout"
  }
}
```

---

## 📦 MODULE STRUCTURE

```
server/src/
│
├── status-notifications/              # NEW MODULE
│   ├── status-notifications.module.ts
│   ├── status-notifications.service.ts
│   ├── status-notifications.controller.ts
│   │
│   ├── dto/
│   │   ├── create-template.dto.ts
│   │   ├── update-template.dto.ts
│   │   ├── update-order-status.dto.ts
│   │   └── query-template.dto.ts
│   │
│   ├── entities/
│   │   └── status-update-template.entity.ts
│   │
│   └── processors/
│       └── notification.processor.ts
│
├── orders/                            # MODIFIED MODULE
│   ├── orders.module.ts               # Import StatusNotificationsModule
│   ├── orders.service.ts              # Use StatusNotificationsService
│   ├── orders.controller.ts           # Update status endpoint
│   └── ...
│
└── whatsapp/                          # EXISTING MODULE
    ├── whatsapp.module.ts
    ├── whatsapp.service.ts            # sendMessage() method
    └── ...
```

---

## 📝 IMPLEMENTATION GUIDE

### **Phase 1: Database Setup**

**Step 1.1: Create Migration File**

```bash
npx prisma migrate dev --name add_order_status_followup
```

**Step 1.2: Update Prisma Schema**

Copy schema dari section **Database Schema** di atas.

**Step 1.3: Generate Prisma Client**

```bash
npx prisma generate
```

**Step 1.4: Verify Migration**

```bash
npx prisma studio
# Check tables: Order (new fields), StatusUpdateTemplate (new table)
```

---

### **Phase 2: Seed Default Templates**

**Step 2.1: Create Seed Script**

```typescript
// prisma/seeds/status-templates.seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const defaultStatusTemplates = [
  {
    name: 'Order Diterima',
    description: 'Template ketika order pertama kali dibuat',
    statusTrigger: 'PENDING',
    messageTemplate: `Halo {{name}}! 👋

Terima kasih sudah order!

📝 *Order #{{order_number}}*
💰 Total: *{{total}}*

Order kamu udah kami terima dan akan segera kami proses ya!

Ditunggu konfirmasi pembayarannya 🙏`,
    autoSend: true,
    delaySeconds: 3,
    isActive: true,
  },
  
  {
    name: 'Sedang Diproses',
    description: 'Template ketika order mulai diproses',
    statusTrigger: 'PROCESSING',
    messageTemplate: `Hi {{name}}! 🚀

Kabar baik nih!

📦 Order #{{order_number}} sedang dalam *PROSES*

Estimasi selesai dalam *{{days}} hari* ya.

Kami akan update lagi nanti! 💪`,
    autoSend: true,
    delaySeconds: 5,
    isActive: true,
  },
  
  {
    name: 'Order Selesai',
    description: 'Template ketika order sudah selesai',
    statusTrigger: 'COMPLETED',
    messageTemplate: `Yeay! 🎉

Order #{{order_number}} udah *SELESAI*!

Terima kasih sudah order di kami {{name}}!

Jangan lupa kasih review ya ⭐⭐⭐⭐⭐

Sampai jumpa lagi! 👋`,
    autoSend: true,
    delaySeconds: 2,
    isActive: true,
  },
  
  {
    name: 'Order Dibatalkan',
    description: 'Template ketika order dibatalkan',
    statusTrigger: 'CANCELLED',
    messageTemplate: `Halo {{name}},

Mohon maaf, order #{{order_number}} harus kami batalkan.

Jika ada pertanyaan, silakan hubungi kami ya.

Terima kasih atas pengertiannya 🙏`,
    autoSend: true,
    delaySeconds: 3,
    isActive: true,
  },
];

async function seedStatusTemplates() {
  console.log('Seeding status templates...');
  
  // Get all active tenants
  const tenants = await prisma.tenant.findMany({
    where: { status: 'ACTIVE' },
  });
  
  for (const tenant of tenants) {
    console.log(`Creating templates for tenant: ${tenant.name}`);
    
    for (const template of defaultStatusTemplates) {
      await prisma.statusUpdateTemplate.upsert({
        where: {
          tenantId_statusTrigger: {
            tenantId: tenant.id,
            statusTrigger: template.statusTrigger as any,
          },
        },
        update: {},
        create: {
          ...template,
          tenantId: tenant.id,
        },
      });
    }
  }
  
  console.log('Status templates seeded successfully!');
}

seedStatusTemplates()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Step 2.2: Run Seed**

```bash
npx ts-node prisma/seeds/status-templates.seed.ts
```

---

### **Phase 3: Backend Implementation**

**Step 3.1: Create DTOs**

```typescript
// src/status-notifications/dto/create-template.dto.ts

import { IsString, IsEnum, IsBoolean, IsInt, IsOptional, MinLength, MaxLength, Min, Max } from 'class-validator';
import { StatusTrigger } from '@prisma/client';

export class CreateTemplateDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsEnum(StatusTrigger)
  statusTrigger: StatusTrigger;

  @IsString()
  @MinLength(10)
  messageTemplate: string;

  @IsOptional()
  @IsBoolean()
  autoSend?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  delaySeconds?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

```typescript
// src/status-notifications/dto/update-order-status.dto.ts

import { IsEnum, IsOptional, IsString, IsInt, IsBoolean, MaxLength, Min, Max } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  estimatedDays?: number;

  @IsOptional()
  @IsBoolean()
  sendNotification?: boolean;
}
```

**Step 3.2: Create Service**

```typescript
// src/status-notifications/status-notifications.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { OrderStatus, StatusTrigger } from '@prisma/client';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class StatusNotificationsService {
  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsAppService,
  ) {}

  // ===========================
  // TEMPLATE MANAGEMENT
  // ===========================

  async getAllTemplates(tenantId: string) {
    return this.prisma.statusUpdateTemplate.findMany({
      where: { tenantId },
      orderBy: { statusTrigger: 'asc' },
    });
  }

  async createTemplate(tenantId: string, dto: CreateTemplateDto) {
    // Check if template for this status already exists
    const existing = await this.prisma.statusUpdateTemplate.findUnique({
      where: {
        tenantId_statusTrigger: {
          tenantId,
          statusTrigger: dto.statusTrigger,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Template for this status already exists');
    }

    return this.prisma.statusUpdateTemplate.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async updateTemplate(id: string, tenantId: string, dto: UpdateTemplateDto) {
    const template = await this.prisma.statusUpdateTemplate.findFirst({
      where: { id, tenantId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.prisma.statusUpdateTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTemplate(id: string, tenantId: string) {
    const template = await this.prisma.statusUpdateTemplate.findFirst({
      where: { id, tenantId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await this.prisma.statusUpdateTemplate.delete({
      where: { id },
    });

    return { success: true };
  }

  // ===========================
  // ORDER STATUS UPDATE
  // ===========================

  async updateOrderStatusWithNotification(
    orderId: string,
    tenantId: string,
    status: OrderStatus,
    options?: {
      note?: string;
      estimatedDays?: number;
      sendNotification?: boolean;
    },
  ) {
    // 1. Update order
    const order = await this.updateOrderStatus(
      orderId,
      tenantId,
      status,
      options?.note,
      options?.estimatedDays,
    );

    // 2. Check if notification should be sent
    const shouldSend = options?.sendNotification !== false;
    if (!shouldSend) {
      return { order, notification: { sent: false } };
    }

    // 3. Get template
    const template = await this.getActiveTemplate(tenantId, status);
    if (!template || !template.autoSend) {
      return {
        order,
        notification: { sent: false, reason: 'No active template' },
      };
    }

    // 4. Get customer phone
    const phone = order.customerPhone || order.customer?.phone;
    if (!phone) {
      return {
        order,
        notification: { sent: false, reason: 'No customer phone' },
      };
    }

    // 5. Generate message
    const message = this.generateMessage(template, order, options?.estimatedDays);

    // 6. Delay
    await this.sleep(template.delaySeconds * 1000);

    // 7. Send WhatsApp
    try {
      await this.whatsappService.sendMessage(tenantId, phone, message);

      // 8. Update stats
      await this.prisma.statusUpdateTemplate.update({
        where: { id: template.id },
        data: { totalSent: { increment: 1 } },
      });

      return {
        order,
        notification: {
          sent: true,
          message,
          sentTo: phone,
          templateUsed: template.id,
          sentAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Failed to send notification:', error);
      return {
        order,
        notification: {
          sent: false,
          reason: 'Failed to send WhatsApp message',
          error: error.message,
        },
      };
    }
  }

  // ===========================
  // HELPER METHODS
  // ===========================

  private async updateOrderStatus(
    orderId: string,
    tenantId: string,
    status: OrderStatus,
    note?: string,
    estimatedDays?: number,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order || order.tenantId !== tenantId) {
      throw new NotFoundException('Order not found');
    }

    // Create history entry
    const historyEntry = {
      status,
      timestamp: new Date().toISOString(),
      note: note || '',
      estimatedDays: estimatedDays || null,
    };

    const existingHistory = (order.statusHistory as any[]) || [];

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        statusHistory: [...existingHistory, historyEntry],
        updatedAt: new Date(),
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
        ...(estimatedDays && {
          estimatedCompletionDate: new Date(
            Date.now() + estimatedDays * 24 * 60 * 60 * 1000,
          ),
        }),
      },
      include: { customer: true },
    });
  }

  private async getActiveTemplate(tenantId: string, status: OrderStatus) {
    return this.prisma.statusUpdateTemplate.findFirst({
      where: {
        tenantId,
        statusTrigger: status as unknown as StatusTrigger,
        isActive: true,
        autoSend: true,
      },
    });
  }

  private generateMessage(
    template: any,
    order: any,
    estimatedDays?: number,
  ): string {
    let message = template.messageTemplate;

    const customerName = order.customerName || order.customer?.name || 'Customer';
    const statusLabel = this.getStatusLabel(order.status);
    const days = estimatedDays?.toString() || '3';

    message = message
      .replace(/\{\{name\}\}/g, customerName)
      .replace(/\{\{order_number\}\}/g, order.orderNumber)
      .replace(/\{\{status\}\}/g, statusLabel)
      .replace(/\{\{days\}\}/g, days)
      .replace(/\{\{total\}\}/g, this.formatCurrency(order.total));

    return message;
  }

  private getStatusLabel(status: string): string {
    const labels = {
      PENDING: 'Menunggu Konfirmasi',
      PROCESSING: 'Sedang Diproses',
      COMPLETED: 'Selesai',
      CANCELLED: 'Dibatalkan',
    };
    return labels[status] || status;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

**Step 3.3: Create Controller**

```typescript
// src/status-notifications/status-notifications.controller.ts

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StatusNotificationsService } from './status-notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../auth/decorators/get-tenant.decorator';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('status-templates')
@UseGuards(JwtAuthGuard)
export class StatusNotificationsController {
  constructor(private readonly service: StatusNotificationsService) {}

  @Get()
  async getAllTemplates(@GetTenant() tenantId: string) {
    const templates = await this.service.getAllTemplates(tenantId);
    return { success: true, data: templates };
  }

  @Post()
  async createTemplate(
    @GetTenant() tenantId: string,
    @Body() dto: CreateTemplateDto,
  ) {
    const template = await this.service.createTemplate(tenantId, dto);
    return { success: true, data: template };
  }

  @Put(':id')
  async updateTemplate(
    @Param('id') id: string,
    @GetTenant() tenantId: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    const template = await this.service.updateTemplate(id, tenantId, dto);
    return { success: true, data: template };
  }

  @Delete(':id')
  async deleteTemplate(
    @Param('id') id: string,
    @GetTenant() tenantId: string,
  ) {
    const result = await this.service.deleteTemplate(id, tenantId);
    return result;
  }
}
```

**Step 3.4: Update Orders Controller**

```typescript
// src/orders/orders.controller.ts

import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { StatusNotificationsService } from '../status-notifications/status-notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../auth/decorators/get-tenant.decorator';
import { UpdateOrderStatusDto } from '../status-notifications/dto/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly statusNotificationsService: StatusNotificationsService,
  ) {}

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @GetTenant() tenantId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const result = await this.statusNotificationsService.updateOrderStatusWithNotification(
      id,
      tenantId,
      dto.status,
      {
        note: dto.note,
        estimatedDays: dto.estimatedDays,
        sendNotification: dto.sendNotification,
      },
    );

    return { success: true, data: result };
  }
}
```

---

### **Phase 4: Testing**

**Step 4.1: Unit Tests**

```typescript
// src/status-notifications/status-notifications.service.spec.ts

describe('StatusNotificationsService', () => {
  // Test template CRUD
  // Test message generation
  // Test variable replacement
  // Test WhatsApp integration
});
```

**Step 4.2: Integration Tests**

```bash
# Test flow:
1. Create order → Check notification sent
2. Update status PENDING → PROCESSING → Check message
3. Update status PROCESSING → COMPLETED → Check message
4. Disable auto-send → Update status → No notification
```

**Step 4.3: Manual Testing**

```bash
# 1. Create template
POST /api/status-templates
{
  "name": "Test Template",
  "statusTrigger": "PROCESSING",
  "messageTemplate": "Hi {{name}}! Order {{order_number}} is {{status}}.",
  "autoSend": true,
  "delaySeconds": 3
}

# 2. Create order
POST /api/orders
{
  "customerPhone": "628123456789",
  "customerName": "Budi",
  "items": [...]
}

# 3. Update order status
PATCH /api/orders/{orderId}/status
{
  "status": "PROCESSING",
  "estimatedDays": 3,
  "note": "Sedang dikerjakan"
}

# 4. Check WhatsApp → Customer harus terima message!
```

---

## 🎯 USE CASES & EXAMPLES

### **Use Case 1: Toko Kaos Custom**

**Scenario:**
Customer pesan 100pcs kaos polo dengan design custom.

**Flow:**

```
Day 1 - Order Created:
├─ Customer WA: "Halo, mau pesan 100pcs kaos polo"
├─ Owner: Buat order via dashboard
├─ System: Auto-send WA
└─ Customer terima: "Halo Budi! Order #ORD-001 sudah kami terima. Total Rp5.000.000"

Day 2 - Design Approved:
├─ Owner: Update status → PROCESSING, estimasi 5 hari
├─ System: Auto-send WA (delay 5 detik)
└─ Customer terima: "Hi Budi! Order ORD-001 sedang PROSES. Estimasi 5 hari ya."

Day 7 - Production Done:
├─ Owner: Update status → COMPLETED
├─ System: Auto-send WA (delay 2 detik)
└─ Customer terima: "Yeay! Order ORD-001 udah SELESAI! Terima kasih!"
```

**Template yang Digunakan:**

```
PENDING Template:
"Halo {{name}}! 👋
Terima kasih sudah order!
📝 Order #{{order_number}}
💰 Total: {{total}}
Order kamu udah kami terima!"

PROCESSING Template:
"Hi {{name}}! 🚀
Order #{{order_number}} sedang dalam PROSES
Estimasi selesai dalam {{days}} hari ya."

COMPLETED Template:
"Yeay! 🎉
Order #{{order_number}} udah SELESAI!
Terima kasih {{name}}!"
```

---

### **Use Case 2: Service Bengkel Motor**

**Scenario:**
Customer service motor, ada beberapa tahap perbaikan.

**Flow:**

```
Order Created (Status: PENDING):
└─ "Terima kasih sudah datang! Motor kamu sedang kami cek dulu ya."

Status Update → PROCESSING:
├─ Note: "Ganti oli + tune up mesin"
├─ Estimasi: 2 jam
└─ Message: "Motor kamu sedang dikerjakan. Estimasi 2 jam ya Pak."

Status Update → COMPLETED:
└─ Message: "Motor sudah selesai Pak! Bisa diambil sekarang."
```

---

### **Use Case 3: Toko Kue**

**Scenario:**
Pre-order kue untuk acara.

**Flow:**

```
Day 1 - Order Created:
└─ "Terima kasih order kue untuk acara tanggal 5 Februari!"

Day 3 - Mulai Produksi:
├─ Status: PROCESSING
├─ Estimasi: 2 hari
└─ "Kue kamu udah mulai kami buat! Estimasi jadi 2 hari ya."

Day 5 - Selesai:
├─ Status: COMPLETED
└─ "Kue sudah siap! Bisa diambil hari ini jam 14:00."
```

---

## ✅ BEST PRACTICES

### **1. Template Writing**

**DO ✅**
```
"Halo {{name}}! 👋
Order {{order_number}} sedang diproses.
Estimasi {{days}} hari ya!"
```

**DON'T ❌**
```
"STATUS_UPDATE: ORDER_PROCESSING. ETA: {{days}}D"
```

**Tips:**
- Gunakan bahasa natural & friendly
- Pakai emoji (tapi jangan berlebihan)
- Jelas & informatif
- Personal (pakai {{name}})

---

### **2. Delay Settings**

**Recommended:**
- PENDING → 3 seconds (first contact)
- PROCESSING → 5 seconds (update info)
- COMPLETED → 2 seconds (good news, cepat ok)
- CANCELLED → 3 seconds (bad news, kasih waktu)

**DON'T:**
- 0 seconds → Keliatan bot
- >10 seconds → Terlalu lama

---

### **3. Status Update Frequency**

**DO ✅**
```
PENDING → PROCESSING → COMPLETED
(3 updates, semua meaningful)
```

**DON'T ❌**
```
PENDING → PROCESSING → PROCESSING (update lagi) → PROCESSING (update lagi)
(Spam customer!)
```

**Rule:**
- Update hanya saat ada perubahan signifikan
- Max 1 update per status
- Jangan update status yang sama berulang kali

---

### **4. Variable Usage**

**Available Variables:**
- `{{name}}` - Customer name
- `{{order_number}}` - Order number
- `{{status}}` - Status in Indonesian
- `{{days}}` - Estimated days
- `{{total}}` - Total amount (formatted)

**Example:**
```
Input:
"Halo {{name}}! Order {{order_number}} total {{total}} sedang {{status}}."

Output:
"Halo Budi! Order ORD-001 total Rp5.000.000 sedang Sedang Diproses."
```

---

### **5. Error Handling**

**Scenario 1: WhatsApp Not Connected**
```
Result: notification.sent = false
Reason: "WhatsApp session not connected"
Action: Owner should reconnect WhatsApp
```

**Scenario 2: No Customer Phone**
```
Result: notification.sent = false
Reason: "No customer phone"
Action: Owner should add customer phone to order
```

**Scenario 3: Template Disabled**
```
Result: notification.sent = false
Reason: "Template is disabled"
Action: Owner should enable template
```

---

### **6. Privacy & Security**

**DO ✅**
- Validate tenant ownership before sending
- Check WhatsApp session active
- Log all sent notifications
- Rate limit WhatsApp sending (max 1 msg/sec per tenant)

**DON'T ❌**
- Send to phone numbers not in order
- Allow cross-tenant message sending
- Store customer phone without encryption
- Send marketing messages (only order updates!)

---

## ✅ SUCCESS CRITERIA

### **Functional Requirements**

- [x] Owner dapat create/update/delete message templates
- [x] Setiap status punya max 1 template per tenant
- [x] System auto-send WhatsApp saat status berubah
- [x] Support variable replacement ({{name}}, {{order_number}}, dll)
- [x] Ada delay sebelum send (configurable 0-60 detik)
- [x] Status history tersimpan dengan timestamp
- [x] Owner bisa disable auto-send per update
- [x] Template bisa di-enable/disable
- [x] Track total notification sent per template

---

### **Non-Functional Requirements**

- [x] Response time update status < 1 detik
- [x] WhatsApp send delay sesuai setting (2-5 detik)
- [x] 99% success rate notification delivery
- [x] Zero spam (max 1 update per status change)
- [x] Database optimized (indexed queries)
- [x] Error handling comprehensive
- [x] Logging untuk debugging

---

### **User Experience**

**Owner:**
- ✅ Simple 1-click update status
- ✅ Preview message sebelum send (optional)
- ✅ Dapat konfirmasi "notification sent"
- ✅ Bisa customize template via dashboard
- ✅ Bisa track berapa kali template dipakai

**Customer:**
- ✅ Selalu dapat update status order
- ✅ Message jelas & mudah dipahami
- ✅ Tidak spam (max 1 update per status)
- ✅ Personal (pakai nama customer)
- ✅ Ada estimasi waktu completion

---

## 🚀 ROLLOUT PLAN

### **Phase 1: Development (Week 1-2)**
- [ ] Database migration
- [ ] Backend service implementation
- [ ] API endpoints
- [ ] Unit tests
- [ ] Integration tests

### **Phase 2: Testing (Week 3)**
- [ ] QA testing
- [ ] Load testing
- [ ] User acceptance testing
- [ ] Bug fixes

### **Phase 3: Deployment (Week 4)**
- [ ] Production deployment
- [ ] Seed default templates
- [ ] Monitor logs
- [ ] Performance monitoring

### **Phase 4: Post-Launch (Week 5+)**
- [ ] Collect user feedback
- [ ] Analytics tracking
- [ ] Template optimization
- [ ] Feature enhancements

---

## 📊 MONITORING & ANALYTICS

### **Metrics to Track**

1. **Notification Success Rate**
   - Total sent vs failed
   - Target: >99% success

2. **Template Usage**
   - Which templates most used
   - Which templates never used (consider removal)

3. **Response Time**
   - Average time from status update to notification sent
   - Target: <10 seconds (including delay)

4. **Customer Engagement**
   - Do customers reply after receiving updates?
   - Customer satisfaction (optional survey)

5. **Error Rate**
   - WhatsApp connection failures
   - Template generation errors
   - Target: <1% error rate

---

## 🔒 SECURITY CONSIDERATIONS

### **Data Privacy**
- Customer phone numbers encrypted at rest
- No sharing of customer data between tenants
- Audit log for all notifications sent

### **Rate Limiting**
- Max 100 notifications per tenant per hour
- Max 1 notification per second per tenant
- Prevent abuse/spam

### **Authentication**
- All endpoints require valid JWT token
- Tenant isolation enforced
- No cross-tenant access

---

## 📝 APPENDIX

### **A. Database ERD**

```
┌─────────────┐
│   Tenant    │
└──────┬──────┘
       │
       │ 1:N
       ├────────────────────────────────────┐
       │                                    │
       ↓                                    ↓
┌──────────────────┐          ┌─────────────────────────┐
│      Order       │          │ StatusUpdateTemplate    │
│                  │          │                         │
│ - id             │          │ - id                    │
│ - orderNumber    │          │ - statusTrigger         │
│ - status ───────┼──────────│ - messageTemplate       │
│ - statusHistory  │  Uses    │ - autoSend              │
│ - conversation ─┼─┐        │ - delaySeconds          │
└──────────────────┘ │        └─────────────────────────┘
                     │
                     │ N:1
                     ↓
              ┌──────────────────┐
              │  Conversation    │
              │                  │
              │ - customerPhone  │
              │ - messages       │
              └──────────────────┘
```

### **B. Sample Queries**

**Get all orders with status history:**
```sql
SELECT 
  id,
  orderNumber,
  status,
  statusHistory,
  estimatedCompletionDate
FROM "Order"
WHERE tenantId = 'tenant_123'
ORDER BY createdAt DESC;
```

**Get template performance:**
```sql
SELECT 
  name,
  statusTrigger,
  totalSent,
  isActive
FROM "StatusUpdateTemplate"
WHERE tenantId = 'tenant_123'
ORDER BY totalSent DESC;
```

**Get orders pending notification:**
```sql
SELECT o.*
FROM "Order" o
LEFT JOIN "StatusUpdateTemplate" t 
  ON t.tenantId = o.tenantId 
  AND t.statusTrigger = o.status::text
WHERE o.tenantId = 'tenant_123'
  AND t.autoSend = true
  AND t.isActive = true;
```

---

## 🎓 GLOSSARY

| Term | Definition |
|------|------------|
| **Status Trigger** | Event yang memicu pengiriman notifikasi (PENDING, PROCESSING, COMPLETED, CANCELLED) |
| **Message Template** | Template pesan dengan variable placeholders |
| **Variable** | Placeholder dalam template yang akan diganti dengan data aktual ({{name}}, {{order_number}}) |
| **Status History** | Timeline perubahan status order dengan timestamp |
| **Auto-send** | Feature untuk otomatis mengirim notifikasi saat status berubah |
| **Delay** | Waktu tunggu sebelum mengirim pesan (untuk efek human-like) |
| **Conversation** | Chat WhatsApp antara tenant dan customer |

---

**END OF DOCUMENTATION**

Version: 1.0.0  
Last Updated: 2026-01-29  
Author: Development Team  

**Questions?**  
Contact: dev@yourcompany.com

---

## 📚 REFERENCES

- [Baileys WhatsApp Library](https://github.com/WhiskeySockets/Baileys)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)

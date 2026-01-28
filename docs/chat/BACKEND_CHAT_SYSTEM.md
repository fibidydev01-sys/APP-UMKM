# 🔥 BACKEND: WhatsApp Chat Management System

**Project:** UMKM Multi-Tenant - WhatsApp Chat Module  
**Focus:** Customer-initiated chat, Auto-reply, Zero spam risk  
**Architecture:** NestJS + Baileys + PostgreSQL + Redis + WebSocket

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [Module Structure](#module-structure)
4. [API Contracts](#api-contracts)
5. [WebSocket Events](#websocket-events)
6. [Auto-Reply Engine](#auto-reply-engine)
7. [Integration Flow](#integration-flow)
8. [Phase Roadmap](#phase-roadmap)

---

## 🎯 SYSTEM OVERVIEW

### **Core Value Proposition**
```
"Kelola Semua Chat WhatsApp Bisnis Anda dalam 1 Dashboard"

✅ Never miss customer messages
✅ 24/7 auto-reply (smart chatbot)
✅ Team collaboration (multi-CS)
✅ Customer insights (CRM)
✅ 100% AMAN (no spam, customer-initiated only!)
```

### **Technical Principles**

```typescript
1. CUSTOMER-INITIATED ONLY
   - Customer chat first → We respond
   - NO unsolicited messages
   - NO broadcast spam
   
2. REAKTIF AUTO-REPLY
   - Welcome message (first contact)
   - Keyword-based FAQ
   - Outside hours notification
   - Smart routing to CS
   
3. ONE-TO-ONE CONVERSATIONS
   - Each chat is unique & contextual
   - Personal responses
   - Natural conversation flow
   
4. REASONABLE VOLUME
   - 50-500 chats/day per tenant
   - Normal business usage pattern
   - Human-like delays (1-5 seconds)
   
5. MULTI-TENANT ISOLATION
   - Each tenant = separate WhatsApp session
   - Data completely isolated
   - No cross-tenant data leak
```

### **Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                    Next.js 14 + Shadcn UI                    │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ WebSocket (Socket.io)
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (NestJS Server)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   WhatsApp   │  │ Conversation │  │  Auto-Reply  │      │
│  │    Module    │  │    Module    │  │    Engine    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Message    │  │   Contact    │  │   WebSocket  │      │
│  │    Module    │  │    Module    │  │   Gateway    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ @whiskeysockets/baileys
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    WHATSAPP SERVERS                          │
│                  (Official WhatsApp API)                     │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ End-to-end encrypted
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER (WhatsApp App)                   │
│                   Mobile / Desktop / Web                     │
└─────────────────────────────────────────────────────────────┘

DATA LAYER:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │     Redis    │  │  File System │
│  (Supabase)  │  │   (Upstash)  │  │  (Sessions)  │
│   Main Data  │  │  Cache/Queue │  │ Auth States  │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🗄️ DATABASE SCHEMA

### **1. WhatsApp Sessions** (whatsapp_sessions)

```sql
CREATE TABLE whatsapp_sessions (
  -- Primary
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- WhatsApp Connection
  phone_number VARCHAR(20) UNIQUE NOT NULL, -- Format: 6281234567890
  qr_code TEXT, -- Base64 QR for initial pairing
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'disconnected',
    -- 'qr_pending' | 'connecting' | 'connected' | 'disconnected' | 'logout'
  connection_state JSONB, -- Baileys connection state
  
  -- Session Data (Encrypted!)
  auth_state_path VARCHAR(255), -- Path to session files
  credentials JSONB, -- Encrypted credentials backup
  
  -- Metadata
  last_connected_at TIMESTAMP,
  last_disconnected_at TIMESTAMP,
  last_qr_generated_at TIMESTAMP,
  retry_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT unique_tenant_session UNIQUE(tenant_id)
);

CREATE INDEX idx_whatsapp_sessions_status ON whatsapp_sessions(status);
CREATE INDEX idx_whatsapp_sessions_tenant ON whatsapp_sessions(tenant_id);
```

**Relationships:**
- 1 Tenant → 1 WhatsApp Session (one-to-one)
- Cascade delete when tenant deleted

---

### **2. Conversations** (conversations)

```sql
CREATE TABLE conversations (
  -- Primary
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id VARCHAR(36) REFERENCES contacts(id) ON DELETE SET NULL,
  assigned_cs_id VARCHAR(36) REFERENCES cs_operators(id) ON DELETE SET NULL,
  
  -- Customer Info (Denormalized for quick access)
  customer_phone VARCHAR(20) NOT NULL, -- WhatsApp ID (6281234567890@s.whatsapp.net)
  customer_name VARCHAR(100),
  customer_avatar_url TEXT,
  
  -- Conversation State
  status VARCHAR(20) NOT NULL DEFAULT 'active',
    -- 'active' | 'pending' | 'resolved' | 'closed' | 'spam'
  priority VARCHAR(20) DEFAULT 'normal',
    -- 'low' | 'normal' | 'high' | 'urgent'
  
  -- Counters
  unread_count INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  
  -- Last Message Info (for sorting/preview)
  last_message_at TIMESTAMP DEFAULT NOW(),
  last_message_content TEXT,
  last_message_from VARCHAR(20), -- 'customer' | 'cs' | 'system'
  
  -- Tags & Categories
  tags TEXT[], -- ['vip', 'complaint', 'new-customer']
  category VARCHAR(50), -- Optional grouping
  
  -- Internal Notes (CS only)
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  
  -- Unique constraint
  CONSTRAINT unique_tenant_customer UNIQUE(tenant_id, customer_phone)
);

CREATE INDEX idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX idx_conversations_status ON conversations(tenant_id, status);
CREATE INDEX idx_conversations_assigned ON conversations(assigned_cs_id);
CREATE INDEX idx_conversations_last_message ON conversations(tenant_id, last_message_at DESC);
CREATE INDEX idx_conversations_unread ON conversations(tenant_id, unread_count) WHERE unread_count > 0;
```

**Relationships:**
- N Conversations → 1 Tenant
- 1 Conversation → 0..1 Contact (optional link to customer table)
- 1 Conversation → 0..1 CS Operator (assigned CS)

---

### **3. Messages** (messages)

```sql
CREATE TABLE messages (
  -- Primary
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- WhatsApp Message ID (untuk tracking delivery/read)
  wa_message_id VARCHAR(100) UNIQUE,
  
  -- Sender Info
  sender_type VARCHAR(20) NOT NULL,
    -- 'customer' | 'cs' | 'system' | 'auto_reply'
  sender_id VARCHAR(100), -- Phone number or CS ID
  sender_name VARCHAR(100),
  
  -- Message Content
  message_type VARCHAR(20) NOT NULL DEFAULT 'text',
    -- 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'location'
  content TEXT, -- Text content or caption
  media_url TEXT, -- URL to uploaded media
  media_mime_type VARCHAR(50),
  media_size INTEGER, -- Bytes
  
  -- Message Metadata
  quoted_message_id VARCHAR(36), -- Reply to message
  is_forwarded BOOLEAN DEFAULT FALSE,
  forward_count INTEGER DEFAULT 0,
  
  -- Delivery Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  error_message TEXT,
  
  -- Timestamps
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  FOREIGN KEY (quoted_message_id) REFERENCES messages(id) ON DELETE SET NULL
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, sent_at DESC);
CREATE INDEX idx_messages_wa_id ON messages(wa_message_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_sender ON messages(sender_type, sender_id);
```

**Relationships:**
- N Messages → 1 Conversation
- Messages can quote other messages (self-referential)

---

### **4. Contacts** (Enhanced from existing customers table)

```sql
-- Extend existing Customer table or create new Contacts table
CREATE TABLE contacts (
  -- Primary
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id VARCHAR(36) REFERENCES customers(id) ON DELETE SET NULL,
  
  -- WhatsApp Info
  phone VARCHAR(20) NOT NULL,
  wa_id VARCHAR(100), -- WhatsApp ID with @s.whatsapp.net
  name VARCHAR(100),
  avatar_url TEXT,
  
  -- Profile Info
  email VARCHAR(100),
  address TEXT,
  notes TEXT,
  
  -- Tags & Segmentation
  tags TEXT[],
  segment VARCHAR(50), -- 'vip' | 'regular' | 'new' | 'inactive'
  
  -- Interaction Stats
  total_conversations INTEGER DEFAULT 0,
  total_messages_sent INTEGER DEFAULT 0,
  total_messages_received INTEGER DEFAULT 0,
  first_contact_at TIMESTAMP,
  last_contact_at TIMESTAMP,
  
  -- Business Stats (link to orders)
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  average_order_value DECIMAL(12,2) DEFAULT 0,
  last_order_at TIMESTAMP,
  
  -- Status
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_reason TEXT,
  blocked_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Unique constraint
  CONSTRAINT unique_tenant_phone UNIQUE(tenant_id, phone)
);

CREATE INDEX idx_contacts_tenant ON contacts(tenant_id);
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);
CREATE INDEX idx_contacts_segment ON contacts(tenant_id, segment);
CREATE INDEX idx_contacts_last_contact ON contacts(tenant_id, last_contact_at DESC);
```

**Relationships:**
- N Contacts → 1 Tenant
- 1 Contact → 0..1 Customer (link to order system)

---

### **5. Auto Reply Rules** (auto_reply_rules)

```sql
CREATE TABLE auto_reply_rules (
  -- Primary
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Rule Info
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Trigger Conditions
  trigger_type VARCHAR(20) NOT NULL,
    -- 'welcome' | 'keyword' | 'time_based' | 'pattern' | 'menu_selection'
  
  -- Keyword Matching (for keyword type)
  keywords TEXT[], -- ['halo', 'hi', 'hello', 'hai']
  match_type VARCHAR(20) DEFAULT 'contains',
    -- 'exact' | 'contains' | 'starts_with' | 'ends_with' | 'regex'
  case_sensitive BOOLEAN DEFAULT FALSE,
  
  -- Time-based Conditions (for outside hours)
  working_hours JSONB,
    -- { "start": "09:00", "end": "21:00", "timezone": "Asia/Jakarta", "days": [1,2,3,4,5] }
  
  -- Pattern Matching
  regex_pattern TEXT,
  
  -- Conditions (Advanced)
  conditions JSONB,
    -- {
    --   "is_first_message": true,
    --   "has_order_history": false,
    --   "customer_tags": ["new"],
    --   "message_count_min": 1,
    --   "message_count_max": 5
    -- }
  
  -- Response Configuration
  response_type VARCHAR(20) NOT NULL DEFAULT 'text',
    -- 'text' | 'template' | 'menu' | 'forward_to_cs' | 'smart_route'
  response_message TEXT,
  response_template VARCHAR(100), -- Template name
  
  -- Menu Options (for menu type)
  menu_options JSONB,
    -- [
    --   { "key": "1", "label": "Lihat Produk", "next_rule_id": "xxx" },
    --   { "key": "2", "label": "Cek Harga", "action": "show_pricing" }
    -- ]
  
  -- Smart Routing (for forward_to_cs type)
  route_to_cs_id VARCHAR(36) REFERENCES cs_operators(id),
  route_condition TEXT, -- 'complaint' | 'urgent' | 'technical'
  
  -- Behavior Control
  priority INTEGER DEFAULT 50, -- Higher = checked first (0-100)
  cooldown_minutes INTEGER, -- Prevent same rule triggering too often
  max_triggers_per_day INTEGER, -- Limit per customer
  delay_seconds INTEGER DEFAULT 2, -- Human-like delay before reply
  
  -- Action Tracking
  total_triggered INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMP,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_auto_reply_rules_tenant ON auto_reply_rules(tenant_id);
CREATE INDEX idx_auto_reply_rules_active ON auto_reply_rules(tenant_id, is_active);
CREATE INDEX idx_auto_reply_rules_priority ON auto_reply_rules(tenant_id, priority DESC);
CREATE INDEX idx_auto_reply_rules_trigger ON auto_reply_rules(trigger_type);
```

**Relationships:**
- N Auto Reply Rules → 1 Tenant
- Can reference CS Operators for routing

---

### **6. Auto Reply Logs** (auto_reply_logs)

```sql
CREATE TABLE auto_reply_logs (
  -- Primary
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  rule_id VARCHAR(36) NOT NULL REFERENCES auto_reply_rules(id) ON DELETE CASCADE,
  conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  message_id VARCHAR(36) REFERENCES messages(id) ON DELETE SET NULL,
  
  -- Trigger Info
  triggered_by_message TEXT, -- Customer's message that triggered
  response_sent TEXT, -- Auto-reply sent
  
  -- Metadata
  matched_keyword VARCHAR(100),
  execution_time_ms INTEGER, -- Performance tracking
  
  -- Result
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  
  -- Timestamps
  triggered_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_auto_reply_logs_rule ON auto_reply_logs(rule_id, triggered_at DESC);
CREATE INDEX idx_auto_reply_logs_conversation ON auto_reply_logs(conversation_id);
```

**Purpose:** Track auto-reply performance & debugging

---

### **7. CS Operators** (cs_operators)

```sql
CREATE TABLE cs_operators (
  -- Primary
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id VARCHAR(36), -- Link to auth user (optional)
  
  -- Profile
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  avatar_url TEXT,
  
  -- Role & Permissions
  role VARCHAR(20) DEFAULT 'operator',
    -- 'admin' | 'supervisor' | 'operator' | 'viewer'
  permissions JSONB,
    -- { "can_delete_messages": false, "can_assign_chats": true, ... }
  
  -- Status
  status VARCHAR(20) DEFAULT 'offline',
    -- 'online' | 'away' | 'busy' | 'offline'
  last_seen_at TIMESTAMP,
  
  -- Workload Management
  max_concurrent_chats INTEGER DEFAULT 10,
  current_chat_count INTEGER DEFAULT 0,
  
  -- Performance Stats
  total_chats_handled INTEGER DEFAULT 0,
  total_messages_sent INTEGER DEFAULT 0,
  average_response_time_seconds INTEGER,
  customer_satisfaction_score DECIMAL(3,2), -- 0.00 - 5.00
  
  -- Working Hours
  working_hours JSONB,
    -- { "monday": { "start": "09:00", "end": "17:00" }, ... }
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cs_operators_tenant ON cs_operators(tenant_id);
CREATE INDEX idx_cs_operators_status ON cs_operators(tenant_id, status);
CREATE INDEX idx_cs_operators_email ON cs_operators(email);
```

**Relationships:**
- N CS Operators → 1 Tenant
- CS Operators can be assigned to conversations

---

### **8. Quick Replies** (quick_replies)

```sql
CREATE TABLE quick_replies (
  -- Primary
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_by_cs_id VARCHAR(36) REFERENCES cs_operators(id) ON DELETE SET NULL,
  
  -- Content
  shortcut VARCHAR(50) NOT NULL, -- e.g., "/greeting", "/price"
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  
  -- Categorization
  category VARCHAR(50), -- 'greeting' | 'pricing' | 'faq' | 'closing'
  tags TEXT[],
  
  -- Usage
  use_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_global BOOLEAN DEFAULT TRUE, -- Available to all CS or specific CS only
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Unique constraint
  CONSTRAINT unique_tenant_shortcut UNIQUE(tenant_id, shortcut)
);

CREATE INDEX idx_quick_replies_tenant ON quick_replies(tenant_id);
CREATE INDEX idx_quick_replies_active ON quick_replies(tenant_id, is_active);
CREATE INDEX idx_quick_replies_category ON quick_replies(category);
```

**Purpose:** Pre-defined message templates for CS quick response

---

### **9. Chat Analytics** (chat_analytics)

```sql
CREATE TABLE chat_analytics (
  -- Primary
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Date Dimension
  date DATE NOT NULL,
  hour INTEGER, -- 0-23 (for hourly breakdown)
  
  -- Metrics
  total_conversations INTEGER DEFAULT 0,
  new_conversations INTEGER DEFAULT 0,
  active_conversations INTEGER DEFAULT 0,
  resolved_conversations INTEGER DEFAULT 0,
  
  total_messages INTEGER DEFAULT 0,
  messages_from_customers INTEGER DEFAULT 0,
  messages_from_cs INTEGER DEFAULT 0,
  messages_auto_reply INTEGER DEFAULT 0,
  
  unique_customers INTEGER DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  
  -- Performance
  average_response_time_seconds INTEGER,
  average_resolution_time_minutes INTEGER,
  first_response_time_seconds INTEGER,
  
  -- Auto-Reply Stats
  auto_reply_triggered INTEGER DEFAULT 0,
  auto_reply_success_rate DECIMAL(5,2), -- Percentage
  
  -- CS Performance
  cs_online_count INTEGER DEFAULT 0,
  cs_utilization_rate DECIMAL(5,2), -- Percentage
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Unique constraint
  CONSTRAINT unique_tenant_date_hour UNIQUE(tenant_id, date, hour)
);

CREATE INDEX idx_chat_analytics_tenant ON chat_analytics(tenant_id, date DESC);
CREATE INDEX idx_chat_analytics_date ON chat_analytics(date);
```

**Purpose:** Daily/hourly aggregated metrics for dashboard

---

## 📦 MODULE STRUCTURE

### **New Modules to Create**

```
server/src/
├── whatsapp/              # 🆕 WhatsApp Integration Module
│   ├── whatsapp.module.ts
│   ├── whatsapp.service.ts
│   ├── whatsapp.controller.ts
│   ├── whatsapp.gateway.ts      # WebSocket for QR codes
│   ├── dto/
│   │   ├── connect-whatsapp.dto.ts
│   │   ├── send-message.dto.ts
│   │   └── disconnect-whatsapp.dto.ts
│   └── interfaces/
│       ├── baileys-session.interface.ts
│       └── whatsapp-message.interface.ts
│
├── conversations/         # 🆕 Conversation Management Module
│   ├── conversations.module.ts
│   ├── conversations.service.ts
│   ├── conversations.controller.ts
│   ├── dto/
│   │   ├── query-conversation.dto.ts
│   │   ├── update-conversation.dto.ts
│   │   └── assign-cs.dto.ts
│   └── interfaces/
│       └── conversation-filter.interface.ts
│
├── messages/              # 🆕 Message Module
│   ├── messages.module.ts
│   ├── messages.service.ts
│   ├── messages.controller.ts
│   ├── messages.gateway.ts       # WebSocket for real-time chat
│   ├── dto/
│   │   ├── send-message.dto.ts
│   │   ├── query-message.dto.ts
│   │   └── mark-as-read.dto.ts
│   └── interfaces/
│       └── message-event.interface.ts
│
├── contacts/              # 🆕 Contact Management Module (or enhance existing customers/)
│   ├── contacts.module.ts
│   ├── contacts.service.ts
│   ├── contacts.controller.ts
│   ├── dto/
│   │   ├── create-contact.dto.ts
│   │   ├── update-contact.dto.ts
│   │   └── query-contact.dto.ts
│   └── interfaces/
│       └── contact-stats.interface.ts
│
├── auto-reply/            # 🆕 Auto-Reply Engine Module
│   ├── auto-reply.module.ts
│   ├── auto-reply.service.ts
│   ├── auto-reply.controller.ts
│   ├── auto-reply.processor.ts   # Background job processor
│   ├── dto/
│   │   ├── create-rule.dto.ts
│   │   ├── update-rule.dto.ts
│   │   └── test-rule.dto.ts
│   ├── engines/
│   │   ├── keyword-engine.ts
│   │   ├── time-based-engine.ts
│   │   ├── pattern-engine.ts
│   │   └── menu-engine.ts
│   └── interfaces/
│       └── auto-reply-result.interface.ts
│
├── cs-operators/          # 🆕 CS Management Module
│   ├── cs-operators.module.ts
│   ├── cs-operators.service.ts
│   ├── cs-operators.controller.ts
│   ├── dto/
│   │   ├── create-operator.dto.ts
│   │   ├── update-operator.dto.ts
│   │   └── update-status.dto.ts
│   └── interfaces/
│       └── operator-stats.interface.ts
│
├── quick-replies/         # 🆕 Quick Reply Templates Module
│   ├── quick-replies.module.ts
│   ├── quick-replies.service.ts
│   ├── quick-replies.controller.ts
│   └── dto/
│       ├── create-quick-reply.dto.ts
│       └── update-quick-reply.dto.ts
│
├── chat-analytics/        # 🆕 Analytics & Reporting Module
│   ├── chat-analytics.module.ts
│   ├── chat-analytics.service.ts
│   ├── chat-analytics.controller.ts
│   ├── jobs/
│   │   ├── daily-aggregation.job.ts
│   │   └── hourly-aggregation.job.ts
│   └── dto/
│       └── analytics-query.dto.ts
│
└── common/
    ├── guards/
    │   └── cs-auth.guard.ts       # 🆕 CS authentication
    ├── decorators/
    │   └── current-cs.decorator.ts # 🆕 Get current CS
    └── interfaces/
        └── websocket-client.interface.ts
```

### **Module Dependencies Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                         APP MODULE                           │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   WHATSAPP   │◄────►│ CONVERSATION │◄───►│   MESSAGE    │
│    MODULE    │      │    MODULE    │     │    MODULE    │
└──────────────┘      └──────────────┘     └──────────────┘
        │                     │                     │
        │                     ▼                     │
        │             ┌──────────────┐              │
        └────────────►│   CONTACT    │◄─────────────┘
                      │    MODULE    │
                      └──────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │  AUTO-REPLY  │
                      │    ENGINE    │
                      └──────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│ CS OPERATORS │      │ QUICK REPLIES│     │   ANALYTICS  │
│    MODULE    │      │    MODULE    │     │    MODULE    │
└──────────────┘      └──────────────┘     └──────────────┘
```

---

## 🔌 API CONTRACTS

### **WhatsApp Module**

#### **POST /api/whatsapp/connect**
```typescript
// Initialize WhatsApp connection (show QR code)
Request:
{
  tenantId: string; // From JWT auth
}

Response:
{
  status: 'qr_pending' | 'connecting' | 'connected';
  qrCode?: string; // Base64 QR code (if qr_pending)
  phoneNumber?: string; // If already connected
  sessionId: string;
}
```

#### **DELETE /api/whatsapp/disconnect**
```typescript
// Logout WhatsApp session
Request: Empty (tenantId from JWT)

Response:
{
  success: boolean;
  message: string;
}
```

#### **GET /api/whatsapp/status**
```typescript
// Check connection status
Response:
{
  status: 'connected' | 'disconnected' | 'qr_pending';
  phoneNumber?: string;
  lastConnected?: string; // ISO timestamp
  isOnline: boolean;
}
```

---

### **Conversations Module**

#### **GET /api/conversations**
```typescript
// Get conversation list with filters
Query Params:
{
  status?: 'active' | 'pending' | 'resolved' | 'closed';
  assignedTo?: string; // CS operator ID
  search?: string; // Customer name or phone
  unreadOnly?: boolean;
  tags?: string[]; // Filter by tags
  sortBy?: 'last_message' | 'created_at' | 'unread_count';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

Response:
{
  data: Array<{
    id: string;
    customerPhone: string;
    customerName: string;
    customerAvatar?: string;
    status: string;
    priority: string;
    unreadCount: number;
    lastMessage: {
      content: string;
      from: 'customer' | 'cs' | 'system';
      timestamp: string;
    };
    assignedCs?: {
      id: string;
      name: string;
    };
    tags: string[];
    createdAt: string;
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

#### **GET /api/conversations/:id**
```typescript
// Get single conversation with messages
Response:
{
  conversation: {
    id: string;
    customerPhone: string;
    customerName: string;
    customerAvatar?: string;
    status: string;
    priority: string;
    tags: string[];
    internalNotes?: string;
    assignedCs?: {
      id: string;
      name: string;
      avatar?: string;
    };
    contact: {
      id: string;
      email?: string;
      address?: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderAt?: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  messages: Array<{
    id: string;
    senderType: 'customer' | 'cs' | 'system' | 'auto_reply';
    senderName: string;
    messageType: 'text' | 'image' | 'video' | 'audio' | 'document';
    content: string;
    mediaUrl?: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    sentAt: string;
    readAt?: string;
  }>;
}
```

#### **PATCH /api/conversations/:id**
```typescript
// Update conversation (status, assignment, tags, notes)
Request:
{
  status?: 'active' | 'pending' | 'resolved' | 'closed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  assignedCsId?: string;
  tags?: string[];
  internalNotes?: string;
}

Response:
{
  success: boolean;
  conversation: { /* updated conversation */ };
}
```

#### **POST /api/conversations/:id/assign**
```typescript
// Assign conversation to CS
Request:
{
  csOperatorId: string;
}

Response:
{
  success: boolean;
  message: string;
}
```

---

### **Messages Module**

#### **POST /api/messages/send**
```typescript
// Send message to customer
Request:
{
  conversationId: string;
  messageType: 'text' | 'image' | 'document';
  content: string; // Text or caption
  mediaUrl?: string; // For media messages
  quotedMessageId?: string; // Reply to message
}

Response:
{
  success: boolean;
  message: {
    id: string;
    waMessageId: string;
    status: 'sent' | 'pending';
    sentAt: string;
  };
}
```

#### **GET /api/messages**
```typescript
// Get messages for conversation (paginated)
Query Params:
{
  conversationId: string;
  before?: string; // Message ID (for pagination)
  limit?: number; // Default 50
}

Response:
{
  messages: Array<{
    id: string;
    senderType: string;
    senderName: string;
    messageType: string;
    content: string;
    mediaUrl?: string;
    status: string;
    sentAt: string;
    readAt?: string;
  }>;
  hasMore: boolean;
}
```

#### **PATCH /api/messages/:id/mark-read**
```typescript
// Mark message(s) as read
Request:
{
  messageIds: string[]; // Can mark multiple
}

Response:
{
  success: boolean;
  markedCount: number;
}
```

---

### **Auto-Reply Module**

#### **POST /api/auto-reply/rules**
```typescript
// Create auto-reply rule
Request:
{
  name: string;
  triggerType: 'welcome' | 'keyword' | 'time_based' | 'pattern';
  
  // For keyword type
  keywords?: string[];
  matchType?: 'exact' | 'contains' | 'starts_with' | 'regex';
  
  // For time_based type
  workingHours?: {
    start: string; // "09:00"
    end: string;   // "21:00"
    timezone: string;
    days?: number[]; // [1,2,3,4,5] = Mon-Fri
  };
  
  // Response
  responseType: 'text' | 'menu' | 'forward_to_cs';
  responseMessage?: string;
  menuOptions?: Array<{
    key: string;
    label: string;
    action: string;
  }>;
  
  // Behavior
  priority?: number; // 0-100
  cooldownMinutes?: number;
  maxTriggersPerDay?: number;
  delaySeconds?: number; // Human-like delay
  
  isActive?: boolean;
}

Response:
{
  success: boolean;
  rule: { /* created rule */ };
}
```

#### **GET /api/auto-reply/rules**
```typescript
// List all auto-reply rules
Response:
{
  rules: Array<{
    id: string;
    name: string;
    triggerType: string;
    responseType: string;
    priority: number;
    isActive: boolean;
    totalTriggered: number;
    lastTriggeredAt?: string;
    createdAt: string;
  }>;
}
```

#### **PUT /api/auto-reply/rules/:id**
```typescript
// Update rule (same structure as POST)
```

#### **DELETE /api/auto-reply/rules/:id**
```typescript
// Delete rule
Response:
{
  success: boolean;
}
```

#### **POST /api/auto-reply/rules/:id/test**
```typescript
// Test rule with sample message
Request:
{
  testMessage: string;
  customerContext?: {
    isFirstMessage?: boolean;
    hasOrderHistory?: boolean;
  };
}

Response:
{
  matched: boolean;
  response?: string;
  matchedKeyword?: string;
  executionTimeMs: number;
}
```

---

### **CS Operators Module**

#### **POST /api/cs-operators**
```typescript
// Create CS operator account
Request:
{
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'operator';
  maxConcurrentChats?: number;
  workingHours?: { /* schedule */ };
}

Response:
{
  success: boolean;
  operator: { /* created operator */ };
  inviteLink: string; // For operator to set password
}
```

#### **GET /api/cs-operators**
```typescript
// List CS operators
Response:
{
  operators: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'online' | 'away' | 'busy' | 'offline';
    currentChatCount: number;
    maxConcurrentChats: number;
    totalChatsHandled: number;
    averageResponseTime: number;
    lastSeenAt?: string;
  }>;
}
```

#### **PATCH /api/cs-operators/:id/status**
```typescript
// Update CS online status
Request:
{
  status: 'online' | 'away' | 'busy' | 'offline';
}

Response:
{
  success: boolean;
}
```

---

### **Quick Replies Module**

#### **POST /api/quick-replies**
```typescript
// Create quick reply template
Request:
{
  shortcut: string; // e.g., "/greeting"
  title: string;
  message: string;
  category?: string;
  isGlobal?: boolean; // Available to all CS
}

Response:
{
  success: boolean;
  quickReply: { /* created template */ };
}
```

#### **GET /api/quick-replies**
```typescript
// List quick replies (with search)
Query Params:
{
  category?: string;
  search?: string;
}

Response:
{
  quickReplies: Array<{
    id: string;
    shortcut: string;
    title: string;
    message: string;
    category: string;
    useCount: number;
  }>;
}
```

---

### **Analytics Module**

#### **GET /api/analytics/dashboard**
```typescript
// Get dashboard overview
Query Params:
{
  dateFrom: string; // ISO date
  dateTo: string;
}

Response:
{
  overview: {
    totalConversations: number;
    activeConversations: number;
    resolvedConversations: number;
    totalMessages: number;
    uniqueCustomers: number;
    averageResponseTime: number; // seconds
    autoReplyRate: number; // percentage
  };
  
  trends: {
    conversations: Array<{ date: string; count: number }>;
    messages: Array<{ date: string; count: number }>;
    responseTime: Array<{ date: string; avgSeconds: number }>;
  };
  
  topAutoReplies: Array<{
    ruleName: string;
    triggeredCount: number;
  }>;
  
  csPerformance: Array<{
    csName: string;
    chatsHandled: number;
    avgResponseTime: number;
  }>;
}
```

#### **GET /api/analytics/conversations**
```typescript
// Detailed conversation analytics
Response:
{
  byStatus: {
    active: number;
    pending: number;
    resolved: number;
    closed: number;
  };
  
  byHour: Array<{ hour: number; count: number }>;
  
  averageMessagesPerConversation: number;
  averageResolutionTime: number; // minutes
}
```

---

## 🔌 WEBSOCKET EVENTS

### **Connection**

```typescript
// Client connects to WebSocket
io.connect('wss://api.umkm.com', {
  auth: {
    token: 'jwt_token_here'
  }
});

// Server validates JWT and joins tenant room
socket.join(`tenant:${tenantId}`);
```

---

### **Events: WhatsApp Gateway** (`/whatsapp` namespace)

#### **Client → Server**

```typescript
// Join tenant room for QR updates
socket.emit('join-tenant', { tenantId: string });

// Disconnect WhatsApp
socket.emit('disconnect-whatsapp', { tenantId: string });
```

#### **Server → Client**

```typescript
// QR code generated (for initial pairing)
socket.on('qr-code', (data: {
  qrCode: string; // Base64
  expiresIn: number; // seconds
}) => {
  // Display QR code to user
});

// Connection status changed
socket.on('connection-status', (data: {
  status: 'connecting' | 'connected' | 'disconnected';
  phoneNumber?: string;
  reason?: string; // If disconnected
}) => {
  // Update UI
});

// Session expired (need re-scan)
socket.on('session-expired', (data: {
  reason: string;
}) => {
  // Prompt user to reconnect
});
```

---

### **Events: Messages Gateway** (`/messages` namespace)

#### **Client → Server**

```typescript
// Join conversation room
socket.emit('join-conversation', {
  conversationId: string
});

// Leave conversation room
socket.emit('leave-conversation', {
  conversationId: string
});

// Send typing indicator
socket.emit('typing-start', {
  conversationId: string
});

socket.emit('typing-stop', {
  conversationId: string
});

// Mark messages as read
socket.emit('mark-as-read', {
  conversationId: string;
  messageIds: string[];
});
```

#### **Server → Client**

```typescript
// New message received (from customer or another CS)
socket.on('new-message', (data: {
  conversationId: string;
  message: {
    id: string;
    senderType: 'customer' | 'cs' | 'auto_reply';
    senderName: string;
    content: string;
    messageType: 'text' | 'image' | 'audio' | 'document';
    mediaUrl?: string;
    sentAt: string;
  };
}) => {
  // Add message to chat window
  // Play notification sound
});

// Message status updated (delivered/read)
socket.on('message-status-updated', (data: {
  messageId: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}) => {
  // Update message checkmarks
});

// Typing indicator from customer
socket.on('customer-typing', (data: {
  conversationId: string;
  isTyping: boolean;
}) => {
  // Show "Customer is typing..."
});

// Conversation updated (status, assignment, etc)
socket.on('conversation-updated', (data: {
  conversationId: string;
  updates: {
    status?: string;
    assignedCsId?: string;
    priority?: string;
    tags?: string[];
  };
}) => {
  // Update conversation in list
});

// New conversation created
socket.on('new-conversation', (data: {
  conversation: { /* conversation object */ };
}) => {
  // Add to conversation list
  // Play notification
});
```

---

## 🤖 AUTO-REPLY ENGINE

### **Processing Flow**

```typescript
// Step 1: Customer sends message
WhatsApp → Baileys → messages.upsert event
                         ↓
// Step 2: Save message to database
MessageService.create(message)
                         ↓
// Step 3: Check if auto-reply should trigger
AutoReplyService.processMessage(message)
                         ↓
// Step 4: Evaluate rules (by priority)
FOR EACH rule IN rules (ORDER BY priority DESC):
  IF rule.checkConditions(message, context):
    response = rule.generateResponse()
    BREAK (first match wins)
                         ↓
// Step 5: Apply human-like delay
DELAY random(rule.delaySeconds, rule.delaySeconds + 2)
                         ↓
// Step 6: Send auto-reply
WhatsAppService.sendMessage(response)
                         ↓
// Step 7: Log auto-reply
AutoReplyLogService.create(log)
                         ↓
// Step 8: Update rule stats
rule.totalTriggered++
rule.lastTriggeredAt = NOW()
```

### **Rule Evaluation Engine**

```typescript
class AutoReplyEngine {
  async processIncomingMessage(
    tenantId: string,
    from: string,
    message: string,
    messageType: string
  ): Promise<void> {
    // Get conversation context
    const conversation = await this.getOrCreateConversation(tenantId, from);
    const contact = await this.getContact(tenantId, from);
    
    // Build context
    const context = {
      isFirstMessage: conversation.totalMessages === 0,
      hasOrderHistory: contact.totalOrders > 0,
      messageCount: conversation.totalMessages,
      lastContactHoursAgo: this.getHoursSince(contact.lastContactAt),
      customerTags: contact.tags,
      messageType,
    };
    
    // Get active rules (ordered by priority)
    const rules = await this.prisma.autoReplyRule.findMany({
      where: {
        tenantId,
        isActive: true,
      },
      orderBy: { priority: 'desc' },
    });
    
    // Evaluate each rule
    for (const rule of rules) {
      // Check cooldown
      const canTrigger = await this.checkCooldown(rule, from);
      if (!canTrigger) continue;
      
      // Check if rule matches
      const matches = await this.evaluateRule(rule, message, context);
      if (!matches) continue;
      
      // Generate response
      const response = await this.generateResponse(rule, contact, context);
      
      // Apply human-like delay
      const delay = this.getRandomDelay(rule.delaySeconds || 2);
      await this.sleep(delay);
      
      // Send auto-reply
      await this.whatsappService.sendMessage(tenantId, from, response);
      
      // Log trigger
      await this.logAutoReply(rule, conversation, message, response);
      
      // Update stats
      await this.updateRuleStats(rule);
      
      // Stop at first match (unless rule.continueToNext = true)
      if (!rule.continueToNext) break;
    }
  }
  
  private async evaluateRule(
    rule: AutoReplyRule,
    message: string,
    context: Context
  ): Promise<boolean> {
    // WELCOME type
    if (rule.triggerType === 'welcome') {
      return context.isFirstMessage;
    }
    
    // KEYWORD type
    if (rule.triggerType === 'keyword') {
      return this.matchKeyword(rule, message);
    }
    
    // TIME_BASED type (outside hours)
    if (rule.triggerType === 'time_based') {
      return this.isOutsideWorkingHours(rule.workingHours);
    }
    
    // PATTERN type (regex)
    if (rule.triggerType === 'pattern') {
      return new RegExp(rule.regexPattern).test(message);
    }
    
    return false;
  }
  
  private matchKeyword(rule: AutoReplyRule, message: string): boolean {
    const text = rule.caseSensitive ? message : message.toLowerCase();
    const keywords = rule.keywords || [];
    
    for (const keyword of keywords) {
      const key = rule.caseSensitive ? keyword : keyword.toLowerCase();
      
      switch (rule.matchType) {
        case 'exact':
          if (text === key) return true;
          break;
        case 'contains':
          if (text.includes(key)) return true;
          break;
        case 'starts_with':
          if (text.startsWith(key)) return true;
          break;
        case 'ends_with':
          if (text.endsWith(key)) return true;
          break;
        case 'regex':
          if (new RegExp(key).test(text)) return true;
          break;
      }
    }
    
    return false;
  }
  
  private async generateResponse(
    rule: AutoReplyRule,
    contact: Contact,
    context: Context
  ): Promise<string> {
    let response = rule.responseMessage || '';
    
    // Replace variables
    response = response
      .replace(/\{\{name\}\}/g, contact.name || 'Customer')
      .replace(/\{\{phone\}\}/g, contact.phone)
      .replace(/\{\{first_name\}\}/g, contact.name?.split(' ')[0] || 'Customer');
    
    // Add menu if menu type
    if (rule.responseType === 'menu' && rule.menuOptions) {
      response += '\n\n';
      for (const option of rule.menuOptions) {
        response += `${option.key}. ${option.label}\n`;
      }
    }
    
    return response;
  }
  
  private async checkCooldown(rule: AutoReplyRule, from: string): Promise<boolean> {
    if (!rule.cooldownMinutes) return true;
    
    const key = `cooldown:${rule.id}:${from}`;
    const lastTrigger = await this.redis.get(key);
    
    if (!lastTrigger) return true;
    
    const elapsed = Date.now() - parseInt(lastTrigger);
    const cooldownMs = rule.cooldownMinutes * 60 * 1000;
    
    return elapsed > cooldownMs;
  }
  
  private getRandomDelay(baseSeconds: number): number {
    // Random delay between base and base+2 seconds (human-like)
    return (baseSeconds + Math.random() * 2) * 1000;
  }
}
```

---

## 🔄 INTEGRATION FLOW

### **1. WhatsApp Connection Flow**

```
[FRONTEND]                [BACKEND]               [WHATSAPP]
    │                         │                        │
    │ POST /whatsapp/connect  │                        │
    ├────────────────────────►│                        │
    │                         │ Initialize Baileys     │
    │                         │ Generate session       │
    │                         ├───────────────────────►│
    │                         │◄───────────────────────┤
    │                         │   QR Code generated    │
    │◄────────────────────────┤                        │
    │ { qrCode: "..." }       │                        │
    │                         │                        │
    │ Display QR to user      │                        │
    │ (via WebSocket)         │                        │
    │                         │                        │
    │                         │ User scans with WA app │
    │                         │◄───────────────────────┤
    │                         │   Connection success   │
    │                         │                        │
    │◄────────────────────────┤                        │
    │ WS: connection-status   │                        │
    │ { status: 'connected' } │                        │
    │                         │                        │
    │ Save session to DB      │                        │
    │                         │                        │
```

### **2. Incoming Message Flow**

```
[CUSTOMER WA]             [BAILEYS]          [BACKEND]              [FRONTEND]
      │                       │                   │                      │
      │ Customer sends "Halo" │                   │                      │
      ├──────────────────────►│                   │                      │
      │                       │ messages.upsert   │                      │
      │                       ├──────────────────►│                      │
      │                       │                   │ 1. Save to DB        │
      │                       │                   │ 2. Check auto-reply  │
      │                       │                   │ 3. Send via WS       │
      │                       │                   ├─────────────────────►│
      │                       │                   │ WS: new-message      │
      │                       │                   │                      │
      │                       │◄──────────────────┤                      │
      │◄──────────────────────┤ Auto-reply sent   │                      │
      │ "Halo! Ada yang..."   │                   │                      │
      │                       │                   │                      │
```

### **3. CS Reply Flow**

```
[FRONTEND]                [BACKEND]          [BAILEYS]           [CUSTOMER WA]
    │                         │                   │                   │
    │ User types reply        │                   │                   │
    │ POST /messages/send     │                   │                   │
    ├────────────────────────►│                   │                   │
    │                         │ 1. Save to DB     │                   │
    │                         │ 2. Send via       │                   │
    │                         │    Baileys        │                   │
    │                         ├──────────────────►│                   │
    │                         │                   ├──────────────────►│
    │                         │                   │ Message delivered │
    │                         │                   │                   │
    │◄────────────────────────┤                   │                   │
    │ { success: true }       │                   │                   │
    │                         │                   │                   │
    │                         │◄──────────────────┤                   │
    │                         │ Delivery receipt  │                   │
    │◄────────────────────────┤                   │                   │
    │ WS: message-status      │                   │                   │
    │ { status: 'delivered' } │                   │                   │
    │                         │                   │                   │
```

### **4. Auto-Reply Trigger Flow**

```
[CUSTOMER]     [BAILEYS]      [MESSAGE SVC]    [AUTO-REPLY]     [WHATSAPP SVC]
    │              │                 │               │                  │
    │ "Jam buka?" │                 │               │                  │
    ├─────────────►│                 │               │                  │
    │              ├────────────────►│               │                  │
    │              │ messages.upsert │               │                  │
    │              │                 │ Save msg      │                  │
    │              │                 ├──────────────►│                  │
    │              │                 │ Process       │                  │
    │              │                 │               │ Check rules      │
    │              │                 │               │ Match keyword    │
    │              │                 │               │ Generate response│
    │              │                 │               │ Delay 2s         │
    │              │                 │◄──────────────┤                  │
    │              │                 │ Send auto-reply                  │
    │              │                 ├─────────────────────────────────►│
    │              │                 │                                  │
    │◄─────────────┼─────────────────┼──────────────────────────────────┤
    │ "Kami buka  │                 │                                  │
    │  09:00-21:00"│                 │                                  │
    │              │                 │                                  │
```

---

## 🗺️ PHASE ROADMAP

### **PHASE 1: Foundation (Week 1-2)**
**Goal:** Basic WhatsApp connection + simple chat

**Backend Tasks:**
- [ ] Database migrations (all new tables)
- [ ] Prisma models generation
- [ ] WhatsApp module (Baileys integration)
  - [ ] Session management
  - [ ] QR code generation
  - [ ] Send/receive messages
- [ ] Conversation module (basic CRUD)
- [ ] Message module (basic CRUD)
- [ ] WebSocket gateway (basic)
- [ ] Contact module (basic)

**API Endpoints:**
- [ ] POST /whatsapp/connect
- [ ] DELETE /whatsapp/disconnect
- [ ] GET /whatsapp/status
- [ ] GET /conversations
- [ ] GET /conversations/:id
- [ ] POST /messages/send
- [ ] GET /messages

**WebSocket Events:**
- [ ] qr-code
- [ ] connection-status
- [ ] new-message

**Deliverable:** Can connect WhatsApp, see conversations, send/receive messages

---

### **PHASE 2: Auto-Reply Engine (Week 3-4)**
**Goal:** Smart chatbot with FAQ automation

**Backend Tasks:**
- [ ] Auto-reply module
  - [ ] Rule engine (keyword matching)
  - [ ] Welcome message trigger
  - [ ] Time-based trigger (outside hours)
  - [ ] Response generator (variable replacement)
  - [ ] Cooldown & rate limiting
- [ ] Auto-reply logs (tracking)
- [ ] Background job processor (BullMQ)

**API Endpoints:**
- [ ] POST /auto-reply/rules
- [ ] GET /auto-reply/rules
- [ ] PUT /auto-reply/rules/:id
- [ ] DELETE /auto-reply/rules/:id
- [ ] POST /auto-reply/rules/:id/test

**Features:**
- [ ] Keyword-based FAQ
- [ ] Welcome message (first contact)
- [ ] Outside hours auto-reply
- [ ] Menu system (interactive)
- [ ] Variable replacement ({{name}}, {{phone}})

**Deliverable:** Auto-reply system working, FAQ automation

---

### **PHASE 3: Team Collaboration (Week 5-6)**
**Goal:** Multi-CS support, assignments, quick replies

**Backend Tasks:**
- [ ] CS Operators module
  - [ ] CRUD operations
  - [ ] Status management (online/offline)
  - [ ] Workload tracking
- [ ] Conversation assignment logic
  - [ ] Manual assignment
  - [ ] Auto-assignment (round-robin)
- [ ] Quick Replies module
  - [ ] Template management
  - [ ] Usage tracking
- [ ] Internal notes (CS-only)

**API Endpoints:**
- [ ] POST /cs-operators
- [ ] GET /cs-operators
- [ ] PATCH /cs-operators/:id/status
- [ ] POST /conversations/:id/assign
- [ ] POST /quick-replies
- [ ] GET /quick-replies

**WebSocket Events:**
- [ ] conversation-assigned
- [ ] cs-status-changed
- [ ] typing-start/stop

**Deliverable:** Team can collaborate, assign chats, use quick replies

---

### **PHASE 4: Analytics & Insights (Week 7-8)**
**Goal:** Dashboard, reporting, performance tracking

**Backend Tasks:**
- [ ] Chat Analytics module
  - [ ] Daily/hourly aggregation jobs
  - [ ] Metrics calculation
  - [ ] Trend analysis
- [ ] Contact CRM enhancement
  - [ ] Order history integration
  - [ ] Customer segmentation
  - [ ] Tags & notes
- [ ] CS Performance tracking
  - [ ] Response time
  - [ ] Resolution time
  - [ ] Chat count

**API Endpoints:**
- [ ] GET /analytics/dashboard
- [ ] GET /analytics/conversations
- [ ] GET /analytics/auto-replies
- [ ] GET /analytics/cs-performance

**Features:**
- [ ] Dashboard overview (totals, trends)
- [ ] Auto-reply performance stats
- [ ] CS performance leaderboard
- [ ] Customer insights (top customers, segments)

**Deliverable:** Complete analytics dashboard

---

### **PHASE 5: Advanced Features (Week 9-10)**
**Goal:** Polish, optimization, advanced automation

**Backend Tasks:**
- [ ] Smart routing (complaint detection)
- [ ] Scheduled reminders (one-to-one)
- [ ] Media handling (images, documents)
- [ ] Contact tagging automation
- [ ] Performance optimization
  - [ ] Query optimization
  - [ ] Caching strategy
  - [ ] Message queue
- [ ] Error handling & logging
  - [ ] Sentry integration
  - [ ] Health checks
  - [ ] Alerting

**API Endpoints:**
- [ ] POST /messages/send-media
- [ ] POST /contacts/:id/tags
- [ ] POST /conversations/:id/schedule-reminder

**Features:**
- [ ] Smart keyword detection (complaint, urgent)
- [ ] Auto-tagging based on conversation
- [ ] Scheduled follow-ups
- [ ] Media gallery
- [ ] Advanced search

**Deliverable:** Production-ready system

---

### **PHASE 6: Future Enhancements**
**Goal:** Scale & expand

**Features to Consider:**
- [ ] Multi-channel (Instagram DM, Telegram)
- [ ] AI-powered responses (GPT integration)
- [ ] Voice message support
- [ ] Video call scheduling
- [ ] Product catalog in chat
- [ ] Payment integration
- [ ] Customer satisfaction surveys
- [ ] Chatbot flow builder (visual)
- [ ] API for third-party integration

---

## 🔐 SECURITY CONSIDERATIONS

### **Authentication & Authorization**

```typescript
// JWT Token Structure
{
  sub: tenantId,
  email: tenant.email,
  role: 'tenant' | 'cs_operator',
  permissions: ['view_conversations', 'send_messages', ...]
}

// Guard Examples
@UseGuards(JwtAuthGuard)           // Tenant auth
@UseGuards(CsAuthGuard)             // CS auth
@UseGuards(TenantOwnerGuard)        // Tenant owner only
```

### **Data Isolation**

```typescript
// ALWAYS filter by tenantId
const conversations = await this.prisma.conversation.findMany({
  where: {
    tenantId: currentTenant.id, // ✅ CRITICAL!
  },
});

// NEVER expose cross-tenant data
// ❌ BAD:
const allMessages = await this.prisma.message.findMany();

// ✅ GOOD:
const messages = await this.prisma.message.findMany({
  where: {
    conversation: {
      tenantId: currentTenant.id,
    },
  },
});
```

### **WhatsApp Session Security**

```typescript
// Encrypt session credentials
const encryptedCreds = encrypt(sessionData, ENCRYPTION_KEY);

// Store encrypted in database
await this.prisma.whatsappSession.update({
  data: {
    credentials: encryptedCreds,
  },
});

// Session files location (outside web root)
const sessionPath = `/var/whatsapp-sessions/${tenantId}`;
```

### **Rate Limiting**

```typescript
// Global rate limit (per IP)
@Throttle(100, 60) // 100 requests per minute

// Endpoint-specific
@Throttle(10, 60) // Send message: 10 per minute
async sendMessage() {}

// Per-tenant limits
if (await this.exceedsTenantLimit(tenantId)) {
  throw new TooManyRequestsException();
}
```

---

## 📊 PERFORMANCE OPTIMIZATION

### **Caching Strategy**

```typescript
// Redis cache keys
const CACHE_KEYS = {
  CONVERSATION_LIST: (tenantId, filters) => 
    `conv:list:${tenantId}:${hashFilters(filters)}`,
  CONVERSATION_DETAIL: (conversationId) => 
    `conv:detail:${conversationId}`,
  MESSAGES: (conversationId, page) => 
    `msg:${conversationId}:${page}`,
  AUTO_REPLY_RULES: (tenantId) => 
    `auto-reply:rules:${tenantId}`,
  CONTACT_PROFILE: (contactId) => 
    `contact:${contactId}`,
};

// TTL configuration
const CACHE_TTL = {
  CONVERSATION_LIST: 60, // 1 minute
  CONVERSATION_DETAIL: 300, // 5 minutes
  MESSAGES: 600, // 10 minutes
  AUTO_REPLY_RULES: 3600, // 1 hour
};
```

### **Database Indexing**

All critical indexes already defined in schema above. Key indexes:
- Conversation list sorting: `(tenant_id, last_message_at DESC)`
- Message retrieval: `(conversation_id, sent_at DESC)`
- Auto-reply matching: `(tenant_id, is_active, priority DESC)`

### **Message Queue**

```typescript
// Use BullMQ for background jobs
@Processor('messages')
export class MessageProcessor {
  @Process('send-message')
  async handleSendMessage(job: Job) {
    const { tenantId, to, message } = job.data;
    
    // Send via Baileys
    await this.whatsappService.sendMessage(tenantId, to, message);
    
    // Update status in DB
    await this.updateMessageStatus(job.data.messageId, 'sent');
  }
  
  @Process('auto-reply')
  async handleAutoReply(job: Job) {
    const { conversationId, ruleId } = job.data;
    
    // Process auto-reply
    await this.autoReplyService.executeRule(conversationId, ruleId);
  }
}
```

---

## 🚨 ERROR HANDLING

### **Common Errors & Handling**

```typescript
// WhatsApp connection errors
try {
  await this.whatsappService.connect(tenantId);
} catch (error) {
  if (error.code === 'SESSION_EXPIRED') {
    // Notify user to rescan QR
    this.notifySessionExpired(tenantId);
  } else if (error.code === 'PHONE_BANNED') {
    // Critical: Phone number banned
    this.alertTenantBanned(tenantId);
  } else {
    // Generic error
    this.logger.error('WhatsApp connection failed', error);
  }
}

// Message send errors
try {
  await this.sendMessage(to, message);
} catch (error) {
  if (error.code === 'MESSAGE_RATE_LIMIT') {
    // Queue for retry
    await this.queueMessageRetry(messageId);
  } else if (error.code === 'RECIPIENT_NOT_FOUND') {
    // Invalid number
    await this.markMessageFailed(messageId, 'Invalid recipient');
  }
}
```

---

## 📝 ENVIRONMENT VARIABLES

```bash
# WhatsApp Configuration
WHATSAPP_SESSION_PATH=/var/whatsapp-sessions
WHATSAPP_ENCRYPTION_KEY=your-32-char-encryption-key
WHATSAPP_MAX_RETRIES=3
WHATSAPP_RETRY_DELAY_MS=5000

# Redis (BullMQ)
BULL_REDIS_HOST=localhost
BULL_REDIS_PORT=6379
BULL_REDIS_PASSWORD=

# Auto-Reply Configuration
AUTO_REPLY_ENABLED=true
AUTO_REPLY_DEFAULT_DELAY_SECONDS=2
AUTO_REPLY_MAX_TRIGGERS_PER_DAY=50

# Rate Limiting
MESSAGE_RATE_LIMIT_PER_MINUTE=10
API_RATE_LIMIT_PER_MINUTE=100

# Analytics
ANALYTICS_AGGREGATION_CRON=0 */6 * * * # Every 6 hours
```

---

## ✅ TESTING STRATEGY

### **Unit Tests**

```typescript
// Auto-reply engine tests
describe('AutoReplyEngine', () => {
  it('should trigger welcome message on first contact', async () => {
    const result = await engine.processMessage(tenantId, from, 'Halo', {
      isFirstMessage: true,
    });
    
    expect(result.triggered).toBe(true);
    expect(result.ruleName).toBe('Welcome Message');
  });
  
  it('should match keyword (case insensitive)', async () => {
    const rule = createKeywordRule(['halo', 'hi'], { caseSensitive: false });
    
    expect(engine.matchKeyword(rule, 'HALO')).toBe(true);
    expect(engine.matchKeyword(rule, 'hi')).toBe(true);
    expect(engine.matchKeyword(rule, 'bye')).toBe(false);
  });
});
```

### **Integration Tests**

```typescript
// WhatsApp connection flow
describe('WhatsApp Connection (E2E)', () => {
  it('should generate QR code on first connect', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/whatsapp/connect')
      .set('Authorization', `Bearer ${tenantToken}`)
      .expect(200);
    
    expect(response.body.status).toBe('qr_pending');
    expect(response.body.qrCode).toBeDefined();
  });
});
```

---

## 🎯 SUCCESS METRICS

**Technical Metrics:**
- [ ] Message delivery rate > 99%
- [ ] API response time < 200ms (p95)
- [ ] WebSocket latency < 100ms
- [ ] Auto-reply trigger rate < 1s
- [ ] Database query time < 50ms (p95)

**Business Metrics:**
- [ ] Auto-reply resolution rate > 60%
- [ ] Average CS response time < 2 minutes
- [ ] Customer satisfaction score > 4.5/5
- [ ] Conversation resolution rate > 80%

---

## 📚 DOCUMENTATION TODOS

- [ ] API documentation (Swagger/OpenAPI)
- [ ] WebSocket event documentation
- [ ] Auto-reply rule examples library
- [ ] Deployment guide (Docker, PM2)
- [ ] Monitoring & alerting setup
- [ ] Backup & disaster recovery plan

---

**END OF BACKEND DOCUMENTATION**

Generated: 2026-01-28  
Version: 1.0.0  
Status: Ready for Implementation

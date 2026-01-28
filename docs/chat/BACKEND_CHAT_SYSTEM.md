# 🔥 BACKEND: WhatsApp Chat - SIMPLE VERSION

**Project:** UMKM Multi-Tenant - WhatsApp Chat Module  
**Focus:** Phase 1 & 2 ONLY - Basic chat + Auto-reply  
**Stack:** NestJS + Baileys + PostgreSQL (Supabase) + Redis (Upstash)

---

## 📋 FOKUS FITUR

### ✅ YANG DIBUAT (Phase 1 & 2)

**Phase 1: Basic WhatsApp Connection + Chat**
- WhatsApp connection via QR code
- Send/receive messages
- Basic conversation list
- Simple contact management

**Phase 2: Auto-Reply Engine**
- Keyword-based auto-reply
- Welcome message (first contact)
- Outside hours auto-reply
- Variable replacement ({{name}}, {{phone}})

### ❌ YANG TIDAK DIBUAT

- ❌ Analytics dashboard
- ❌ Team/CS management (multi-operator)
- ❌ CS assignment & collaboration
- ❌ Quick replies management
- ❌ Advanced reporting
- ❌ Performance tracking

**Single tenant mode:** 1 tenant = 1 WhatsApp session = 1 user (owner)

---

## 🗄️ DATABASE SCHEMA (SIMPLIFIED)

### **1. whatsapp_sessions**

```sql
CREATE TABLE whatsapp_sessions (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- WhatsApp Connection
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  qr_code TEXT,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'disconnected',
    -- 'qr_pending' | 'connecting' | 'connected' | 'disconnected'
  connection_state JSONB,
  
  -- Session Data
  auth_state_path VARCHAR(255),
  
  -- Metadata
  last_connected_at TIMESTAMP,
  last_disconnected_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_tenant_session UNIQUE(tenant_id)
);

CREATE INDEX idx_whatsapp_sessions_status ON whatsapp_sessions(status);
CREATE INDEX idx_whatsapp_sessions_tenant ON whatsapp_sessions(tenant_id);
```

---

### **2. conversations**

```sql
CREATE TABLE conversations (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id VARCHAR(36) REFERENCES contacts(id) ON DELETE SET NULL,
  
  -- Customer Info
  customer_phone VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100),
  customer_avatar_url TEXT,
  
  -- State
  status VARCHAR(20) NOT NULL DEFAULT 'active',
    -- 'active' | 'resolved' | 'closed'
  
  -- Counters
  unread_count INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  
  -- Last Message (for sorting)
  last_message_at TIMESTAMP DEFAULT NOW(),
  last_message_content TEXT,
  last_message_from VARCHAR(20), -- 'customer' | 'owner' | 'auto_reply'
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_tenant_customer UNIQUE(tenant_id, customer_phone)
);

CREATE INDEX idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX idx_conversations_last_message ON conversations(tenant_id, last_message_at DESC);
CREATE INDEX idx_conversations_unread ON conversations(tenant_id, unread_count) WHERE unread_count > 0;
```

---

### **3. messages**

```sql
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- WhatsApp Message ID
  wa_message_id VARCHAR(100) UNIQUE,
  
  -- Sender Info
  sender_type VARCHAR(20) NOT NULL,
    -- 'customer' | 'owner' | 'auto_reply'
  sender_id VARCHAR(100),
  sender_name VARCHAR(100),
  
  -- Message Content
  message_type VARCHAR(20) NOT NULL DEFAULT 'text',
    -- 'text' | 'image' | 'audio' | 'document'
  content TEXT,
  media_url TEXT,
  media_mime_type VARCHAR(50),
  
  -- Quoted Message (reply)
  quoted_message_id VARCHAR(36),
  
  -- Delivery Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  
  -- Timestamps
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (quoted_message_id) REFERENCES messages(id) ON DELETE SET NULL
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, sent_at DESC);
CREATE INDEX idx_messages_wa_id ON messages(wa_message_id);
```

---

### **4. contacts**

```sql
CREATE TABLE contacts (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- WhatsApp Info
  phone VARCHAR(20) NOT NULL,
  wa_id VARCHAR(100),
  name VARCHAR(100),
  avatar_url TEXT,
  
  -- Interaction Stats
  total_conversations INTEGER DEFAULT 0,
  first_contact_at TIMESTAMP,
  last_contact_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_tenant_phone UNIQUE(tenant_id, phone)
);

CREATE INDEX idx_contacts_tenant ON contacts(tenant_id);
CREATE INDEX idx_contacts_phone ON contacts(phone);
```

---

### **5. auto_reply_rules**

```sql
CREATE TABLE auto_reply_rules (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Rule Info
  name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Trigger Type
  trigger_type VARCHAR(20) NOT NULL,
    -- 'welcome' | 'keyword' | 'time_based'
  
  -- Keyword Matching (for keyword type)
  keywords TEXT[],
  match_type VARCHAR(20) DEFAULT 'contains',
    -- 'exact' | 'contains' | 'starts_with'
  case_sensitive BOOLEAN DEFAULT FALSE,
  
  -- Time-based (for outside hours)
  working_hours JSONB,
    -- { "start": "09:00", "end": "21:00", "timezone": "Asia/Jakarta", "days": [1,2,3,4,5] }
  
  -- Response
  response_message TEXT NOT NULL,
  
  -- Behavior
  priority INTEGER DEFAULT 50, -- Higher = checked first
  delay_seconds INTEGER DEFAULT 2, -- Human-like delay
  
  -- Tracking
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
```

---

### **6. auto_reply_logs**

```sql
CREATE TABLE auto_reply_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  rule_id VARCHAR(36) NOT NULL REFERENCES auto_reply_rules(id) ON DELETE CASCADE,
  conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  message_id VARCHAR(36) REFERENCES messages(id) ON DELETE SET NULL,
  
  -- Trigger Info
  triggered_by_message TEXT,
  response_sent TEXT,
  matched_keyword VARCHAR(100),
  
  -- Timestamp
  triggered_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_auto_reply_logs_rule ON auto_reply_logs(rule_id, triggered_at DESC);
CREATE INDEX idx_auto_reply_logs_conversation ON auto_reply_logs(conversation_id);
```

---

## 📦 MODULE STRUCTURE (SIMPLIFIED)

```
server/src/
├── whatsapp/              # WhatsApp Integration
│   ├── whatsapp.module.ts
│   ├── whatsapp.service.ts
│   ├── whatsapp.controller.ts
│   ├── whatsapp.gateway.ts      # WebSocket for QR codes
│   └── dto/
│       ├── connect-whatsapp.dto.ts
│       └── send-message.dto.ts
│
├── conversations/         # Conversation Management
│   ├── conversations.module.ts
│   ├── conversations.service.ts
│   ├── conversations.controller.ts
│   └── dto/
│       ├── query-conversation.dto.ts
│       └── update-conversation.dto.ts
│
├── messages/              # Message Module
│   ├── messages.module.ts
│   ├── messages.service.ts
│   ├── messages.controller.ts
│   ├── messages.gateway.ts       # WebSocket for real-time chat
│   └── dto/
│       ├── send-message.dto.ts
│       └── query-message.dto.ts
│
├── contacts/              # Contact Management
│   ├── contacts.module.ts
│   ├── contacts.service.ts
│   ├── contacts.controller.ts
│   └── dto/
│       ├── create-contact.dto.ts
│       └── update-contact.dto.ts
│
└── auto-reply/            # Auto-Reply Engine
    ├── auto-reply.module.ts
    ├── auto-reply.service.ts
    ├── auto-reply.controller.ts
    ├── auto-reply.processor.ts   # Background processor
    ├── dto/
    │   ├── create-rule.dto.ts
    │   └── update-rule.dto.ts
    └── engines/
        ├── keyword-engine.ts
        ├── time-based-engine.ts
        └── welcome-engine.ts
```

---

## 🔌 API ENDPOINTS (SIMPLIFIED)

### **WhatsApp Module**

#### **POST /api/whatsapp/connect**
```typescript
// Initialize WhatsApp connection
Response: {
  status: 'qr_pending' | 'connecting' | 'connected';
  qrCode?: string; // Base64 QR code
  phoneNumber?: string;
  sessionId: string;
}
```

#### **DELETE /api/whatsapp/disconnect**
```typescript
// Logout WhatsApp session
Response: {
  success: boolean;
  message: string;
}
```

#### **GET /api/whatsapp/status**
```typescript
// Check connection status
Response: {
  status: 'connected' | 'disconnected' | 'qr_pending';
  phoneNumber?: string;
  lastConnected?: string;
  isOnline: boolean;
}
```

---

### **Conversations Module**

#### **GET /api/conversations**
```typescript
// Get conversation list
Query: {
  status?: 'active' | 'resolved' | 'closed';
  search?: string;
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

Response: {
  data: Array<{
    id: string;
    customerPhone: string;
    customerName: string;
    customerAvatar?: string;
    status: string;
    unreadCount: number;
    lastMessage: {
      content: string;
      from: 'customer' | 'owner' | 'auto_reply';
      timestamp: string;
    };
    createdAt: string;
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
```

#### **GET /api/conversations/:id**
```typescript
// Get single conversation with messages
Response: {
  conversation: {
    id: string;
    customerPhone: string;
    customerName: string;
    status: string;
    contact: {
      phone: string;
      name: string;
      totalConversations: number;
    };
  };
  messages: Array<{
    id: string;
    senderType: 'customer' | 'owner' | 'auto_reply';
    messageType: 'text' | 'image' | 'audio';
    content: string;
    mediaUrl?: string;
    status: 'sent' | 'delivered' | 'read';
    sentAt: string;
  }>;
}
```

#### **PATCH /api/conversations/:id**
```typescript
// Update conversation status
Request: {
  status?: 'active' | 'resolved' | 'closed';
}

Response: {
  success: boolean;
  conversation: { /* updated */ };
}
```

---

### **Messages Module**

#### **POST /api/messages/send**
```typescript
// Send message to customer
Request: {
  conversationId: string;
  messageType: 'text' | 'image';
  content: string;
  mediaUrl?: string;
}

Response: {
  success: boolean;
  message: {
    id: string;
    waMessageId: string;
    status: 'sent';
    sentAt: string;
  };
}
```

#### **GET /api/messages**
```typescript
// Get messages for conversation
Query: {
  conversationId: string;
  before?: string; // Message ID for pagination
  limit?: number;
}

Response: {
  messages: Array<{
    id: string;
    senderType: string;
    content: string;
    status: string;
    sentAt: string;
  }>;
  hasMore: boolean;
}
```

---

### **Auto-Reply Module**

#### **POST /api/auto-reply/rules**
```typescript
// Create auto-reply rule
Request: {
  name: string;
  triggerType: 'welcome' | 'keyword' | 'time_based';
  
  // For keyword type
  keywords?: string[];
  matchType?: 'exact' | 'contains' | 'starts_with';
  
  // For time_based type
  workingHours?: {
    start: string; // "09:00"
    end: string;   // "21:00"
    timezone: string; // "Asia/Jakarta"
    days?: number[]; // [1,2,3,4,5] = Mon-Fri
  };
  
  // Response
  responseMessage: string; // Supports {{name}}, {{phone}}
  
  // Behavior
  priority?: number; // 0-100, default 50
  delaySeconds?: number; // default 2
  
  isActive?: boolean;
}

Response: {
  success: boolean;
  rule: { /* created rule */ };
}
```

#### **GET /api/auto-reply/rules**
```typescript
// List all auto-reply rules
Response: {
  rules: Array<{
    id: string;
    name: string;
    triggerType: string;
    priority: number;
    isActive: boolean;
    totalTriggered: number;
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
Response: {
  success: boolean;
}
```

---

## 🔌 WEBSOCKET EVENTS (SIMPLIFIED)

### **WhatsApp Gateway** (`/whatsapp` namespace)

#### Server → Client

```typescript
// QR code generated
socket.on('qr-code', (data: {
  qrCode: string; // Base64
  expiresIn: number; // seconds
}) => {});

// Connection status changed
socket.on('connection-status', (data: {
  status: 'connecting' | 'connected' | 'disconnected';
  phoneNumber?: string;
}) => {});
```

---

### **Messages Gateway** (`/messages` namespace)

#### Client → Server

```typescript
// Join conversation
socket.emit('join-conversation', {
  conversationId: string
});

// Mark as read
socket.emit('mark-as-read', {
  conversationId: string;
});
```

#### Server → Client

```typescript
// New message received
socket.on('new-message', (data: {
  conversationId: string;
  message: {
    id: string;
    senderType: 'customer' | 'owner' | 'auto_reply';
    content: string;
    sentAt: string;
  };
}) => {});

// Message status updated
socket.on('message-status-updated', (data: {
  messageId: string;
  status: 'sent' | 'delivered' | 'read';
}) => {});

// New conversation created
socket.on('new-conversation', (data: {
  conversation: { /* conversation object */ };
}) => {});
```

---

## 🤖 AUTO-REPLY ENGINE (SIMPLIFIED)

### **Processing Flow**

```typescript
// Incoming message → Check auto-reply rules

class AutoReplyService {
  async processIncomingMessage(
    tenantId: string,
    from: string,
    message: string,
  ): Promise<void> {
    // Get conversation
    const conversation = await this.getOrCreateConversation(tenantId, from);
    const contact = await this.getContact(tenantId, from);
    
    // Get active rules (by priority)
    const rules = await this.prisma.autoReplyRule.findMany({
      where: { tenantId, isActive: true },
      orderBy: { priority: 'desc' },
    });
    
    // Check each rule
    for (const rule of rules) {
      const matches = await this.evaluateRule(rule, message, conversation);
      if (!matches) continue;
      
      // Generate response
      const response = this.generateResponse(rule, contact);
      
      // Delay (human-like)
      await this.sleep(rule.delaySeconds * 1000);
      
      // Send auto-reply
      await this.whatsappService.sendMessage(tenantId, from, response);
      
      // Log
      await this.logAutoReply(rule, conversation, message, response);
      
      // Update stats
      await this.updateRuleStats(rule);
      
      break; // First match wins
    }
  }
  
  private async evaluateRule(
    rule: AutoReplyRule,
    message: string,
    conversation: Conversation
  ): Promise<boolean> {
    // WELCOME type
    if (rule.triggerType === 'welcome') {
      return conversation.totalMessages === 0;
    }
    
    // KEYWORD type
    if (rule.triggerType === 'keyword') {
      return this.matchKeyword(rule, message);
    }
    
    // TIME_BASED type
    if (rule.triggerType === 'time_based') {
      return this.isOutsideWorkingHours(rule.workingHours);
    }
    
    return false;
  }
  
  private matchKeyword(rule: AutoReplyRule, message: string): boolean {
    const text = rule.caseSensitive ? message : message.toLowerCase();
    
    for (const keyword of rule.keywords || []) {
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
      }
    }
    
    return false;
  }
  
  private generateResponse(rule: AutoReplyRule, contact: Contact): string {
    let response = rule.responseMessage;
    
    // Replace variables
    response = response
      .replace(/\{\{name\}\}/g, contact.name || 'Customer')
      .replace(/\{\{phone\}\}/g, contact.phone);
    
    return response;
  }
  
  private isOutsideWorkingHours(workingHours: any): boolean {
    if (!workingHours) return false;
    
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
    
    // Check if today is working day
    const workingDays = workingHours.days || [1, 2, 3, 4, 5]; // Default Mon-Fri
    if (!workingDays.includes(currentDay)) {
      return true; // Outside working days
    }
    
    // Check time range
    const start = workingHours.start; // "09:00"
    const end = workingHours.end;     // "21:00"
    
    return currentTime < start || currentTime > end;
  }
}
```

---

## 🔄 INTEGRATION FLOW

### **1. WhatsApp Connection**

```
[FRONTEND] → POST /whatsapp/connect
                ↓
[BACKEND] → Initialize Baileys
                ↓
[BACKEND] → Generate QR code
                ↓
[BACKEND] → WebSocket: emit 'qr-code'
                ↓
[FRONTEND] → Display QR
                ↓
[USER] → Scan with WhatsApp app
                ↓
[BACKEND] → Connection success
                ↓
[BACKEND] → WebSocket: emit 'connection-status'
                ↓
[FRONTEND] → Show connected status
```

### **2. Incoming Message + Auto-Reply**

```
[CUSTOMER] → Sends "Halo"
                ↓
[BAILEYS] → messages.upsert event
                ↓
[MESSAGE SERVICE] → Save to DB
                ↓
[AUTO-REPLY SERVICE] → Process message
                ↓
[AUTO-REPLY SERVICE] → Check rules
                ↓
[AUTO-REPLY SERVICE] → Match "welcome" rule
                ↓
[AUTO-REPLY SERVICE] → Delay 2 seconds
                ↓
[WHATSAPP SERVICE] → Send reply
                ↓
[CUSTOMER] → Receives auto-reply
                ↓
[WEBSOCKET] → Emit 'new-message' to frontend
                ↓
[FRONTEND] → Show message in chat
```

### **3. Owner Reply**

```
[FRONTEND] → POST /messages/send
                ↓
[BACKEND] → Save to DB
                ↓
[WHATSAPP SERVICE] → Send via Baileys
                ↓
[CUSTOMER] → Receives message
                ↓
[WEBSOCKET] → Emit 'message-status-updated'
                ↓
[FRONTEND] → Update checkmarks
```

---

## 📝 ENVIRONMENT VARIABLES

```bash
# Database (Supabase)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# App
NODE_ENV=development
PORT=8000

# CORS
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# WhatsApp
WHATSAPP_SESSION_PATH=./whatsapp-sessions
WHATSAPP_MAX_RETRIES=3

# Auto-Reply
AUTO_REPLY_ENABLED=true
AUTO_REPLY_DEFAULT_DELAY_SECONDS=2
```

---

## 🗺️ IMPLEMENTATION ROADMAP

### **PHASE 1: Core Foundation (Week 1-2)**

**Backend Tasks:**
- [x] Database migrations
- [x] Prisma schema
- [ ] WhatsApp module
  - [ ] Baileys integration
  - [ ] QR code generation
  - [ ] Send/receive messages
  - [ ] Session management
- [ ] Conversation module (basic CRUD)
- [ ] Message module (basic CRUD)
- [ ] Contact module (basic CRUD)
- [ ] WebSocket gateway (basic)

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

**Backend Tasks:**
- [ ] Auto-reply module
  - [ ] Rule engine (keyword matching)
  - [ ] Welcome message trigger
  - [ ] Time-based trigger
  - [ ] Response generator
- [ ] Auto-reply logs
- [ ] Background processor (BullMQ optional)

**API Endpoints:**
- [ ] POST /auto-reply/rules
- [ ] GET /auto-reply/rules
- [ ] PUT /auto-reply/rules/:id
- [ ] DELETE /auto-reply/rules/:id

**Features:**
- [ ] Keyword-based FAQ
- [ ] Welcome message
- [ ] Outside hours auto-reply
- [ ] Variable replacement ({{name}}, {{phone}})

**Deliverable:** Auto-reply system working

---

## ✅ SUCCESS CRITERIA

**Phase 1:**
- ✅ WhatsApp connected via QR code
- ✅ Can send/receive messages
- ✅ Messages saved to database
- ✅ Real-time updates via WebSocket
- ✅ Conversation list shows properly

**Phase 2:**
- ✅ Auto-reply triggers on keywords
- ✅ Welcome message sent to first-time customers
- ✅ Outside hours reply works
- ✅ Variables {{name}} and {{phone}} replaced correctly
- ✅ Response delay feels natural (2+ seconds)

---

## 🚨 CRITICAL NOTES

### **WhatsApp Safety**

```typescript
// ✅ SAFE: Customer-initiated only
- Customer sends first message → We respond
- Auto-reply to incoming messages only
- One-to-one conversations
- Human-like delays (2-5 seconds)

// ❌ UNSAFE (DON'T DO THIS!)
- Mass broadcast messages
- Unsolicited messages
- Rapid-fire responses (no delay)
- Automated campaigns to non-customers
```

### **Rate Limiting**

```typescript
// Safe usage pattern
- 50-500 messages per day
- 2-5 second delays between messages
- Only respond to customer messages
- Normal business conversation flow
```

---

**END OF SIMPLIFIED BACKEND DOCUMENTATION**

Version: 1.0.0 (Simplified)  
Focus: Phase 1 & 2 Only  
Generated: 2026-01-28
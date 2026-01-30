# Auto-Reply System Documentation

**Last Updated:** January 30, 2026
**Version:** 2.0
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Trigger Types](#trigger-types)
4. [Variable System](#variable-system)
5. [UI Components](#ui-components)
6. [ContentEditable Chip System](#contenteditable-chip-system)
7. [Form Components](#form-components)
8. [Backend Integration](#backend-integration)
9. [Usage Examples](#usage-examples)
10. [Best Practices](#best-practices)

---

## Overview

The Auto-Reply System enables businesses to automatically respond to customer messages on WhatsApp based on various trigger events. The system features a modern, user-friendly interface with inline variable chips for safe message templating.

### Key Features

- **Multiple Trigger Types**: Welcome, Keywords, Order Status, Payment Status
- **Variable Substitution**: Dynamic content replacement with customer/order data
- **Inline Chip Editor**: TikTok-style chip system for safe variable insertion
- **Priority & Delay**: Smart message timing and ordering
- **Bottom Sheet UI**: Mobile-first drawer interface
- **Text-Only Chips**: Clean, minimal design without icons

### System Highlights

- ✅ **Syntax Protection**: Variables cannot be accidentally broken
- ✅ **Visual Clarity**: Chips provide clear distinction between text and variables
- ✅ **One Per Type**: Each variable can only be added once
- ✅ **Backspace Deletion**: Intuitive chip removal
- ✅ **Real-time Preview**: See how messages will look with sample data

---

## Architecture

### Frontend Structure

```
client/src/app/(dashboard)/dashboard/auto-reply/
├── layout.tsx                    # Tab navigation (Welcome, Keywords, Order Status, Payment)
├── page.tsx                      # Root redirect to Welcome
├── welcome/
│   ├── page.tsx                  # Welcome message listing
│   └── components/
│       └── welcome-rule-form.tsx # Form with ContentEditable chips
├── keywords/
│   ├── page.tsx                  # Keyword rules listing
│   └── components/
│       └── keyword-rule-form.tsx # Form with match type & case sensitivity
├── order-status/
│   ├── page.tsx                  # Order status cards (PENDING, PROCESSING, COMPLETED, CANCELLED)
│   └── components/
│       └── order-status-rule-form.tsx # Status-specific templates
└── payment/
    ├── page.tsx                  # Payment status cards (PAID, PARTIAL, FAILED)
    └── components/
        └── payment-status-rule-form.tsx # Payment-specific templates
```

### Backend Structure

```
server/src/routes/auto-reply/
├── router.ts                     # Route registration
├── service.ts                    # Business logic
├── types.ts                      # TypeScript interfaces
└── validation.ts                 # Input validation schemas
```

### Database Schema

```sql
CREATE TABLE auto_reply_rules (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('WELCOME', 'KEYWORD', 'ORDER_STATUS', 'PAYMENT_STATUS')),
  keywords TEXT[],                -- For KEYWORD, ORDER_STATUS, PAYMENT_STATUS
  match_type TEXT,                -- For KEYWORD: EXACT, CONTAINS, STARTS_WITH
  case_sensitive BOOLEAN,         -- For KEYWORD
  response_message TEXT NOT NULL,
  priority INTEGER NOT NULL,      -- 100=WELCOME, 80=PAYMENT, 70=ORDER, 50=KEYWORD
  delay_seconds INTEGER NOT NULL, -- Delay before sending (2-5s)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Trigger Types

### 1. WELCOME (Priority: 100)

**Purpose**: Greet customers on first contact

**Trigger**: Customer sends their first message to the business

**Default Delay**: 2 seconds (quick response)

**Available Variables**:
- `{{name}}` - Customer name (fallback: "Customer")
- `{{phone}}` - Customer WhatsApp number

**Example Use Case**:
```
Halo {{name}}! 👋

Terima kasih sudah menghubungi kami.

Ada yang bisa kami bantu? Silakan sampaikan kebutuhan Anda, kami siap membantu! 😊
```

---

### 2. KEYWORD (Priority: 50)

**Purpose**: Respond to specific keywords in customer messages

**Trigger**: Customer message matches keyword(s)

**Default Delay**: 2 seconds

**Match Types**:
- **CONTAINS**: Message contains the keyword anywhere
- **EXACT**: Message exactly matches the keyword
- **STARTS_WITH**: Message starts with the keyword

**Options**:
- Case sensitive matching (on/off)
- Multiple keywords per rule (OR logic)

**Available Variables**:
- `{{name}}` - Customer name
- `{{phone}}` - Customer WhatsApp number

**Example Use Case**:
```
Keywords: ["harga", "price", "berapa"]
Match Type: CONTAINS
Case Sensitive: No

Response:
Halo {{name}}! 👋

Terima kasih atas pertanyaannya. Berikut daftar harga produk kami:
...
```

---

### 3. ORDER_STATUS (Priority: 70)

**Purpose**: Notify customers when order status changes

**Trigger**: Owner updates order status in system

**Status Types**:
- **PENDING** (Delay: 3s) - Order received
- **PROCESSING** (Delay: 5s) - Order being prepared
- **COMPLETED** (Delay: 2s) - Order completed (good news faster!)
- **CANCELLED** (Delay: 4s) - Order cancelled

**Available Variables**:
- `{{name}}` - Customer name
- `{{order_number}}` - Order ID (e.g., ORD-20260129-001)
- `{{total}}` - Total amount (formatted IDR)
- `{{tracking_link}}` - Order tracking URL

**Example Use Case**:
```
Status: COMPLETED

Hi {{name}}! 🎉

Order #{{order_number}} udah *SELESAI*!

Terima kasih sudah order di kami!

Jangan lupa kasih review ya ⭐⭐⭐⭐⭐

Sampai jumpa lagi! 👋
```

---

### 4. PAYMENT_STATUS (Priority: 80)

**Purpose**: Notify customers about payment status

**Trigger**: Owner updates payment status in system

**Status Types**:
- **PAID** (Delay: 2s) - Payment confirmed (good news fastest!)
- **PARTIAL** (Delay: 3s) - Partial payment received
- **FAILED** (Delay: 4s) - Payment failed (gentle timing)

**Available Variables**:
- `{{name}}` - Customer name
- `{{order_number}}` - Order ID
- `{{total}}` - Total amount (formatted IDR)
- `{{tracking_link}}` - Order tracking URL

**Example Use Case**:
```
Status: PAID

Terima kasih {{name}}! ✅

Pembayaran untuk order #{{order_number}} sudah kami terima!

💰 Total: {{total}}
📦 Status: *LUNAS*

Order akan segera kami proses. Terima kasih atas kepercayaannya!

Cek order: {{tracking_link}}
```

---

## Variable System

### Variable Types

| Variable | Label | Available In | Description |
|----------|-------|--------------|-------------|
| `{{name}}` | NAMA | All types | Customer name (fallback: "Customer") |
| `{{phone}}` | TELEPON | Welcome, Keywords | Customer WhatsApp number |
| `{{order_number}}` | NO. ORDER | Order Status, Payment | Order ID (e.g., ORD-001) |
| `{{total}}` | TOTAL | Order Status, Payment | Formatted price (e.g., Rp 150.000) |
| `{{tracking_link}}` | LINK | Order Status, Payment | Order tracking URL (uses UUID for security, NOT order number) |

### Variable Substitution

**Backend Logic**:
```typescript
// Replace variables with actual data
const replacedMessage = template
  .replace(/\{\{name\}\}/g, customer.name || 'Customer')
  .replace(/\{\{phone\}\}/g, customer.phone)
  .replace(/\{\{order_number\}\}/g, order.orderNumber)
  .replace(/\{\{total\}\}/g, formatCurrency(order.total))
  .replace(/\{\{tracking_link\}\}/g, order.trackingUrl); // Uses order.id (UUID), NOT order number
```

### Security: Tracking Link Implementation

**IMPORTANT SECURITY PRACTICE**:
- The `{{tracking_link}}` variable is replaced with a URL containing the **order UUID** (order.id), NOT the order number
- Example: `/store/toko-saya/track/550e8400-e29b-41d4-a716-446655440000`
- This prevents unauthorized users from guessing order tracking URLs
- Order numbers are sequential and predictable (ORD-20260130-001, ORD-20260130-002, etc.)
- UUIDs are random and cannot be guessed, providing security for customer order data

**Backend Implementation**:
```typescript
// orders.service.ts (Line 364, 438)
const trackingLink = `${FRONTEND_URL}/store/${tenant.slug}/track/${order.id}`; // ✅ UUID (secure)
// NOT: /track/${order.orderNumber} ❌ Predictable (insecure)
```

### Fallback Values

- **{{name}}**: Falls back to "Customer" if not available
- **{{phone}}**: Always available from WhatsApp
- **{{order_number}}**: Generated by system (ORD-YYYYMMDD-NNN)
- **{{total}}**: Always available from order
- **{{tracking_link}}**: Generated when order is created (uses order.id UUID for security, e.g., /store/slug/track/550e8400-e29b-41d4-a716-446655440000)

---

## UI Components

### Tab Navigation

**Location**: `/dashboard/auto-reply`

**Tabs**:
- 🗨️ Welcome - First contact message
- 🔑 Keywords - Keyword-based replies
- 📦 Order Status - Order status notifications
- 💳 Payment - Payment status notifications

**Features**:
- Active tab highlighting
- Icon + label for clarity
- Horizontal scroll on mobile
- Persistent across navigation

---

### Bottom Sheet Drawer

**Pattern**: All forms use bottom sheet (slide from bottom)

**Features**:
- Drag handle for intuitive closing
- Rounded top corners (20px)
- Max height 92vh (always visible)
- Dark overlay backdrop (60% opacity)
- Floating close button (top right)
- Sticky header and footer

**Implementation**:
```tsx
<Drawer.Root open={open} onOpenChange={onClose}>
  <Drawer.Portal>
    <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[9999]" />
    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[10000] bg-background rounded-t-[20px] max-h-[92vh] outline-none flex flex-col">
      {/* Drag Handle */}
      <div className="flex justify-center pt-3 pb-2 shrink-0">
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
      </div>

      {/* Header */}
      <div className="px-4 pb-4 border-b shrink-0">...</div>

      {/* Scrollable Content */}
      <form className="flex-1 overflow-y-auto">...</form>

      {/* Sticky Footer */}
      <div className="px-4 py-4 border-t bg-background shrink-0 sticky bottom-0">...</div>

      {/* Floating Close Button */}
      <button className="absolute top-4 right-4 ...">
        <X className="h-4 w-4" />
      </button>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

---

## ContentEditable Chip System

### Overview

The ContentEditable chip system replaces traditional textarea + external variable buttons with an inline editing experience where variables appear as read-only chips inside the editor (similar to TikTok tags or Gmail recipient chips).

### Key Benefits

1. **Syntax Protection**: Users cannot accidentally break `{{variable}}` syntax
2. **Visual Clarity**: Clear distinction between text and variables
3. **Intuitive UX**: Variables appear as colored badges in-context
4. **One Per Type**: Each variable can only be added once
5. **Easy Deletion**: Backspace key removes chips cleanly
6. **Clean Design**: Text-only chips without icons

### Architecture

#### Core Functions

```typescript
// 1. Convert HTML editor content to {{variable}} format
const getMessageFromEditor = () => {
  if (!editorRef.current) return '';

  const clonedContent = editorRef.current.cloneNode(true) as HTMLElement;

  // Replace chip spans with {{variable}} format
  clonedContent.querySelectorAll('[data-variable]').forEach((chip) => {
    const varKey = chip.getAttribute('data-variable');
    const textNode = document.createTextNode(varKey || '');
    chip.parentNode?.replaceChild(textNode, chip);
  });

  return clonedContent.innerText.trim();
};

// 2. Insert variable chip at cursor position
const insertVariableChip = (variable: typeof VARIABLES[0]) => {
  if (!editorRef.current) return;
  if (hasVariable(variable.key)) return; // Max 1 per type

  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);

  if (!range || !editorRef.current.contains(range.commonAncestorContainer)) {
    // If no selection, append to end
    editorRef.current.focus();
    const newRange = document.createRange();
    newRange.selectNodeContents(editorRef.current);
    newRange.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(newRange);
  }

  // Create chip element
  const chip = document.createElement('span');
  chip.setAttribute('data-variable', variable.key);
  chip.setAttribute('contenteditable', 'false'); // Read-only!
  chip.className = 'inline-flex items-center px-2 py-0.5 mx-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium cursor-default';
  chip.innerHTML = `<span>${variable.label}</span>`; // Text-only (NAMA, TELEPON, etc.)

  // Insert chip at cursor
  const currentRange = window.getSelection()?.getRangeAt(0);
  if (currentRange) {
    currentRange.deleteContents();
    currentRange.insertNode(chip);

    // Move cursor after chip
    currentRange.setStartAfter(chip);
    currentRange.setEndAfter(chip);
    selection?.removeAllRanges();
    selection?.addRange(currentRange);
  }

  updateMessageFromEditor();
  editorRef.current?.focus();
};

// 3. Render {{variable}} as HTML chips in editor
const renderMessageWithChips = (text: string) => {
  if (!editorRef.current) return;

  let html = text;

  // Replace {{variable}} with chip HTML
  VARIABLES.forEach((variable) => {
    const regex = new RegExp(variable.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const chipHtml = `<span data-variable="${variable.key}" contenteditable="false" class="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium cursor-default"><span>${variable.label}</span></span>`;
    html = html.replace(regex, chipHtml);
  });

  editorRef.current.innerHTML = html || '<br>';
};

// 4. Handle backspace to delete chips
const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key === 'Backspace') {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (range && range.collapsed) {
      const cursorNode = range.startContainer;
      const cursorOffset = range.startOffset;

      if (cursorNode.nodeType === Node.TEXT_NODE && cursorOffset === 0) {
        const prevSibling = cursorNode.previousSibling;
        if (prevSibling && (prevSibling as HTMLElement).hasAttribute?.('data-variable')) {
          e.preventDefault();
          prevSibling.remove();
          updateMessageFromEditor();
          return;
        }
      } else if (cursorNode.nodeType === Node.ELEMENT_NODE) {
        const element = cursorNode as HTMLElement;
        const prevChild = element.childNodes[cursorOffset - 1];
        if (prevChild && (prevChild as HTMLElement).hasAttribute?.('data-variable')) {
          e.preventDefault();
          prevChild.remove();
          updateMessageFromEditor();
          return;
        }
      }
    }
  }
};
```

#### ContentEditable Editor JSX

```tsx
<div
  ref={editorRef}
  contentEditable
  onInput={handleEditorInput}
  onKeyDown={handleEditorKeyDown}
  className="min-h-[250px] p-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background"
  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
  suppressContentEditableWarning
/>
```

#### Add Variable Buttons

```tsx
<div className="flex items-center gap-2">
  <Label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
    Tambah Variabel:
  </Label>
  <div className="flex flex-wrap gap-2">
    {VARIABLES.map((variable) => {
      const isUsed = hasVariable(variable.key);
      return (
        <Button
          key={variable.key}
          type="button"
          variant={isUsed ? "secondary" : "outline"}
          size="sm"
          onClick={() => insertVariableChip(variable)}
          disabled={isUsed}
          title={isUsed ? `${variable.label} sudah digunakan` : variable.description}
          className="h-7 text-xs"
        >
          {variable.label}  {/* Text-only: NAMA, TELEPON, NO. ORDER, TOTAL, LINK */}
        </Button>
      );
    })}
  </div>
</div>
```

### Chip Styling

**CSS Classes**:
```css
.chip {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;  /* py-0.5 px-2 */
  margin: 0 0.125rem;        /* mx-0.5 */
  border-radius: 9999px;     /* rounded-full */
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 0.75rem;        /* text-xs */
  font-weight: 500;          /* font-medium */
  cursor: default;
}
```

**Visual Example**:

```
Halo [NAMA]! 👋

Terima kasih sudah order!

📝 Order #[NO. ORDER]
💰 Total: [TOTAL]

Cek status: [LINK]
```

Where `[NAMA]`, `[NO. ORDER]`, `[TOTAL]`, `[LINK]` are colored chips with blue background.

### Data Flow

1. **Form Open**: Load rule data
2. **Render**: Convert `{{variable}}` → HTML chips via `renderMessageWithChips()`
3. **User Edits**: Type text, click variable buttons
4. **Chip Insert**: Add chip at cursor via `insertVariableChip()`
5. **User Input**: Update state via `handleEditorInput()` → `getMessageFromEditor()`
6. **Form Submit**: Send message with `{{variable}}` format to backend
7. **Backend**: Store as `{{variable}}` in database
8. **Runtime**: Replace variables with actual data when sending

### Edge Cases Handled

- ✅ Cursor outside editor → append to end
- ✅ Backspace at chip boundary → delete chip
- ✅ Duplicate variable → button disabled
- ✅ Empty editor → show `<br>` to maintain editability
- ✅ Multi-line text → preserve whitespace with `white-space: pre-wrap`
- ✅ Load existing rule → convert `{{variable}}` to chips on mount

---

## Form Components

### 1. Welcome Rule Form

**File**: `welcome-rule-form.tsx`

**Fields**:
- Rule Name (text input)
- Message Template (ContentEditable with chips)

**Auto-assigned**:
- Priority: 100 (highest)
- Delay: 2s
- Trigger: First customer contact

**Variables**: NAMA, TELEPON

---

### 2. Keyword Rule Form

**File**: `keyword-rule-form.tsx`

**Fields**:
- Rule Name (text input)
- Description (text input, optional)
- Keywords (dynamic chip list)
- Match Type (select: CONTAINS, EXACT, STARTS_WITH)
- Case Sensitive (checkbox)
- Message Template (ContentEditable with chips)

**Auto-assigned**:
- Priority: 50
- Delay: 2s
- Trigger: Message matches keyword(s)

**Variables**: NAMA, TELEPON

**Keyword Management**:
```tsx
// Add keyword
const addKeyword = () => {
  const trimmed = keywordInput.trim();
  if (trimmed && !keywords.includes(trimmed)) {
    setKeywords([...keywords, trimmed]);
    setKeywordInput('');
  }
};

// Remove keyword
const removeKeyword = (keyword: string) => {
  setKeywords(keywords.filter((k) => k !== keyword));
};
```

---

### 3. Order Status Rule Form

**File**: `order-status-rule-form.tsx`

**Status-Specific**:
- PENDING (Delay: 3s)
- PROCESSING (Delay: 5s)
- COMPLETED (Delay: 2s)
- CANCELLED (Delay: 4s)

**Auto-assigned**:
- Priority: 70
- Rule Name: "Order Status: {STATUS}"
- Trigger: Order status update

**Variables**: NAMA, NO. ORDER, TOTAL, LINK

**Default Templates**: Pre-filled templates for each status

---

### 4. Payment Status Rule Form

**File**: `payment-status-rule-form.tsx`

**Status-Specific**:
- PAID (Delay: 2s)
- PARTIAL (Delay: 3s)
- FAILED (Delay: 4s)

**Auto-assigned**:
- Priority: 80 (higher than orders)
- Rule Name: "Payment Status: {STATUS}"
- Trigger: Payment status update

**Variables**: NAMA, NO. ORDER, TOTAL, LINK

**Default Templates**: Pre-filled templates for each status

---

## Backend Integration

### API Endpoints

```typescript
// List all rules for tenant
GET /api/tenants/:tenantId/auto-reply/rules

// Create new rule
POST /api/tenants/:tenantId/auto-reply/rules
Body: {
  name: string;
  description?: string;
  triggerType: 'WELCOME' | 'KEYWORD' | 'ORDER_STATUS' | 'PAYMENT_STATUS';
  keywords?: string[];
  matchType?: 'EXACT' | 'CONTAINS' | 'STARTS_WITH';
  caseSensitive?: boolean;
  responseMessage: string;
  isActive: boolean;
}

// Update rule
PUT /api/tenants/:tenantId/auto-reply/rules/:ruleId
Body: Same as create

// Delete rule
DELETE /api/tenants/:tenantId/auto-reply/rules/:ruleId
```

### Service Logic

```typescript
export class AutoReplyService {
  // Find applicable rules for incoming message
  async findApplicableRules(
    tenantId: string,
    triggerType: string,
    message?: string,
    statusValue?: string
  ): Promise<AutoReplyRule[]> {
    const query = this.db
      .selectFrom('auto_reply_rules')
      .where('tenant_id', '=', tenantId)
      .where('trigger_type', '=', triggerType)
      .where('is_active', '=', true)
      .orderBy('priority', 'desc')
      .orderBy('created_at', 'asc');

    if (triggerType === 'KEYWORD' && message) {
      // Match keywords against message
      const rules = await query.selectAll().execute();
      return rules.filter(rule => this.matchesKeyword(rule, message));
    }

    if (triggerType === 'ORDER_STATUS' && statusValue) {
      query.where(sql`${statusValue} = ANY(keywords)`);
    }

    if (triggerType === 'PAYMENT_STATUS' && statusValue) {
      query.where(sql`${statusValue} = ANY(keywords)`);
    }

    return query.selectAll().execute();
  }

  // Check if message matches keyword rule
  private matchesKeyword(rule: AutoReplyRule, message: string): boolean {
    const msg = rule.caseSensitive ? message : message.toLowerCase();

    return rule.keywords.some(keyword => {
      const kw = rule.caseSensitive ? keyword : keyword.toLowerCase();

      switch (rule.matchType) {
        case 'EXACT':
          return msg === kw;
        case 'STARTS_WITH':
          return msg.startsWith(kw);
        case 'CONTAINS':
        default:
          return msg.includes(kw);
      }
    });
  }

  // Replace variables in template
  replaceVariables(
    template: string,
    data: {
      name?: string;
      phone?: string;
      orderNumber?: string;
      total?: string;
      trackingLink?: string;
    }
  ): string {
    return template
      .replace(/\{\{name\}\}/g, data.name || 'Customer')
      .replace(/\{\{phone\}\}/g, data.phone || '')
      .replace(/\{\{order_number\}\}/g, data.orderNumber || '')
      .replace(/\{\{total\}\}/g, data.total || '')
      .replace(/\{\{tracking_link\}\}/g, data.trackingLink || '');
  }
}
```

### Hook: useAutoReply

```typescript
export function useAutoReply() {
  const [rules, setRules] = useState<AutoReplyRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tenants/${tenantId}/auto-reply/rules`);
      const data = await response.json();
      setRules(data);
    } catch (error) {
      toast.error('Failed to load rules');
    } finally {
      setIsLoading(false);
    }
  };

  const createRule = async (data: CreateAutoReplyRuleInput) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/tenants/${tenantId}/auto-reply/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create rule');
      toast.success('Rule created successfully');
      await fetchRules();
    } catch (error) {
      toast.error('Failed to create rule');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updateRule = async (ruleId: string, data: UpdateAutoReplyRuleInput) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/tenants/${tenantId}/auto-reply/rules/${ruleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update rule');
      toast.success('Rule updated successfully');
      await fetchRules();
    } catch (error) {
      toast.error('Failed to update rule');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRule = async (ruleId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tenants/${tenantId}/auto-reply/rules/${ruleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete rule');
      toast.success('Rule deleted successfully');
      await fetchRules();
    } catch (error) {
      toast.error('Failed to delete rule');
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    rules,
    isLoading,
    isSaving,
    isDeleting,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
  };
}
```

---

## Usage Examples

### Example 1: Welcome Message

**Setup**:
1. Go to Auto-Reply → Welcome tab
2. Click "Create Welcome Rule"
3. Rule Name: "Welcome Message"
4. Click "NAMA" button to insert chip
5. Type your message around the chip:

```
Halo [NAMA]! 👋

Terima kasih sudah menghubungi kami.

Ada yang bisa kami bantu?
```

6. Click "Create Rule"

**Result**: When customer "Budi" sends first message, they receive:
```
Halo Budi! 👋

Terima kasih sudah menghubungi kami.

Ada yang bisa kami bantu?
```

---

### Example 2: Keyword Auto-Reply

**Setup**:
1. Go to Auto-Reply → Keywords tab
2. Click "Create Keyword Rule"
3. Rule Name: "Info Harga"
4. Keywords: "harga", "price", "berapa"
5. Match Type: CONTAINS
6. Case Sensitive: No
7. Message with chips:

```
Halo [NAMA]! 👋

Berikut daftar harga produk kami:

• Product A: Rp 50.000
• Product B: Rp 75.000
• Product C: Rp 100.000

Untuk order, silakan chat [TELEPON]
```

8. Click "Create Rule"

**Result**: When customer sends "Harga berapa ya?", they receive the price list.

---

### Example 3: Order Status Update

**Setup**:
1. Go to Auto-Reply → Order Status tab
2. Click on "COMPLETED" card
3. Message with chips:

```
Yeay! 🎉

Order #[NO. ORDER] udah *SELESAI*!

Terima kasih sudah order di kami [NAMA]!

Total: [TOTAL]

Jangan lupa kasih review ya ⭐⭐⭐⭐⭐

Cek detail: [LINK]
```

4. Click "Create Rule"

**Result**: When owner marks order as COMPLETED, customer receives:
```
Yeay! 🎉

Order #ORD-20260130-001 udah *SELESAI*!

Terima kasih sudah order di kami Siti!

Total: Rp 150.000

Jangan lupa kasih review ya ⭐⭐⭐⭐⭐

Cek detail: https://tokosaya.com/store/toko-saya/track/550e8400-e29b-41d4-a716-446655440000
```

---

### Example 4: Payment Confirmation

**Setup**:
1. Go to Auto-Reply → Payment tab
2. Click on "PAID" card
3. Message with chips:

```
Terima kasih [NAMA]! ✅

Pembayaran untuk order #[NO. ORDER] sudah kami terima!

💰 Total: [TOTAL]
📦 Status: *LUNAS*

Order akan segera kami proses.
```

4. Click "Create Rule"

**Result**: When payment is confirmed, customer immediately receives confirmation.

---

## Best Practices

### Message Writing

1. **Personalize**: Always use `{{name}}` when appropriate
2. **Clear CTA**: Tell customers what to do next
3. **Emojis**: Use sparingly for visual appeal
4. **Brevity**: Keep messages concise and scannable
5. **Tone**: Match your brand voice (formal/casual)

### Variable Usage

1. **Test Fallbacks**: Ensure `{{name}}` fallback to "Customer" makes sense
2. **Link Context**: Always explain what the `{{tracking_link}}` is for
3. **Format Consistency**: Use consistent formatting for order numbers and prices

### Priority Management

**Default priorities work well**:
- 100 = WELCOME (greet first)
- 80 = PAYMENT (urgent financial updates)
- 70 = ORDER_STATUS (order updates)
- 50 = KEYWORD (general inquiries)

**Don't change unless**:
- You want keywords to take precedence over order updates
- You have custom business logic

### Delay Timing

**Good news faster, bad news gentle**:
- 2s = WELCOME, ORDER_COMPLETED, PAYMENT_PAID
- 3s = ORDER_PENDING, PAYMENT_PARTIAL
- 4s = ORDER_CANCELLED, PAYMENT_FAILED
- 5s = ORDER_PROCESSING

### Testing

1. **Preview**: Always check preview with dummy data
2. **Test Messages**: Send test messages to yourself
3. **Edge Cases**: Test with missing customer names
4. **Multiple Rules**: Ensure rules don't conflict
5. **Disable When Needed**: Toggle `isActive` to pause rules without deleting

### Keyword Rules

1. **Use Multiple Keywords**: Cover variations (harga, price, berapa)
2. **CONTAINS is Best**: Most flexible for natural language
3. **Case Insensitive**: Most user-friendly
4. **Avoid Overlap**: Different rules for different topics
5. **One Response**: Don't create multiple rules for same keywords

### Order & Payment Rules

1. **One Per Status**: Only create one rule per status type
2. **Update, Don't Create New**: Edit existing rules instead of duplicating
3. **Default Templates**: Use provided templates as starting point
4. **Include Links**: Always include tracking links when available
5. **Clear Status**: State the status clearly (LUNAS, PROSES, etc.)

---

## Technical Notes

### Performance

- Rules cached in memory after first load
- Variable replacement is O(n) where n = number of variables (max 5)
- Regex matching for keywords (optimized with case-insensitive flag)
- Database queries use indexes on `tenant_id`, `trigger_type`, `is_active`

### Security

- Message templates sanitized before storage
- No XSS risk (messages sent via WhatsApp API, not rendered as HTML)
- Variable names validated against whitelist
- Tenant isolation enforced at database level

### Limitations

- Maximum 1 WELCOME rule per tenant
- Maximum 1 rule per ORDER_STATUS type
- Maximum 1 rule per PAYMENT_STATUS type
- Unlimited KEYWORD rules
- Message length: 4096 characters (WhatsApp limit)
- Keywords: Maximum 50 per rule

### Browser Compatibility

ContentEditable chip system requires:
- Modern browser with `contentEditable` support
- `window.getSelection()` and `Range` API
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Future Enhancements

- [ ] Rich text formatting (bold, italic)
- [ ] Image/media attachments
- [ ] Conditional logic (if/else)
- [ ] A/B testing for messages
- [ ] Analytics dashboard
- [ ] Scheduled messages
- [ ] Multi-language support
- [ ] AI-powered message suggestions

---

## Troubleshooting

### Chips Not Rendering

**Issue**: Variables show as `{{name}}` instead of chips

**Solution**: Check that `renderMessageWithChips()` is called on mount:
```typescript
useEffect(() => {
  if (open && rule) {
    setTimeout(() => renderMessageWithChips(rule.responseMessage), 0);
  }
}, [open, rule]);
```

### Backspace Not Working

**Issue**: Backspace doesn't delete chips

**Solution**: Ensure `handleEditorKeyDown` is bound to editor:
```tsx
<div
  contentEditable
  onKeyDown={handleEditorKeyDown}
  ...
/>
```

### Variables Not Replaced

**Issue**: Message sent with `{{name}}` instead of actual name

**Solution**: Check backend variable replacement logic and ensure data is available:
```typescript
const replacedMessage = template
  .replace(/\{\{name\}\}/g, customer.name || 'Customer');
```

### Duplicate Variables Allowed

**Issue**: Same variable can be added multiple times

**Solution**: Check `hasVariable()` check in `insertVariableChip()`:
```typescript
if (hasVariable(variable.key)) return; // Already exists
```

---

## Conclusion

The Auto-Reply System provides a robust, user-friendly solution for automated WhatsApp responses. The ContentEditable chip system ensures safe variable templating while maintaining an intuitive UX. The bottom sheet drawer pattern provides a mobile-first experience, and the comprehensive variable system covers all common use cases.

For questions or issues, refer to the troubleshooting section or contact the development team.

---

**Last Updated**: January 30, 2026
**Version**: 2.0
**Maintained by**: Development Team

# 🎨 FRONTEND: WhatsApp Chat Management System

**Project:** UMKM Multi-Tenant - WhatsApp Chat UI  
**Focus:** Professional chat interface, Real-time updates, Team collaboration  
**Stack:** Next.js 14 + TypeScript + Shadcn UI + Tailwind CSS

---

## 📋 TABLE OF CONTENTS

1. [UI Overview](#ui-overview)
2. [Design System](#design-system)
3. [Page Structure](#page-structure)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Real-time Integration](#real-time-integration)
7. [Phase Roadmap](#phase-roadmap)
8. [UI Specifications](#ui-specifications)

---

## 🎯 UI OVERVIEW

### **Marketing Positioning**

```
"Professional WhatsApp Inbox untuk UMKM Indonesia"

Seperti WhatsApp Web, tapi lebih powerful:
✅ Multi-CS collaboration
✅ Smart auto-reply chatbot
✅ Customer CRM & insights
✅ Analytics dashboard
✅ Zero risk banned (customer-initiated only!)
```

### **User Personas**

**1. Tenant/Owner (Admin)**
- Wants: Overview analytics, team performance, auto-reply setup
- Access: Full dashboard, settings, reports
- Key pages: Dashboard, Analytics, Auto-Reply Builder, CS Management

**2. CS Operator**
- Wants: Fast response, customer context, collaboration
- Access: Inbox, customer profiles, quick replies
- Key pages: Inbox, Conversations, Quick Replies

**3. Customer (External)**
- Wants: Fast response, helpful answers, easy ordering
- Access: WhatsApp app only (not web interface)
- Interaction: Chat via WhatsApp → Auto-reply/CS responds

---

## 🎨 DESIGN SYSTEM

### **Color Palette**

```typescript
// Base Colors (WhatsApp-inspired but customized)
const colors = {
  // Primary (WhatsApp green, slightly adjusted)
  primary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#25D366', // Main WhatsApp green
    600: '#1EBD5C',
    700: '#17A54D',
    800: '#128C3F',
    900: '#0D7330',
  },
  
  // Neutral (Clean, professional)
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Status Colors
  success: '#10B981', // Green
  warning: '#F59E0B', // Orange
  error: '#EF4444',   // Red
  info: '#3B82F6',    // Blue
  
  // Chat Bubble Colors
  bubble: {
    sent: '#DCF8C6',     // Light green (like WA)
    received: '#FFFFFF', // White
    system: '#F3F4F6',   // Light gray
    autoReply: '#E0F2FE', // Light blue (to differentiate)
  },
  
  // Background
  bg: {
    default: '#F0F2F5',  // Light gray (like WA Web)
    chat: '#E5DDD5',     // Beige pattern (like WA chat bg)
    sidebar: '#FFFFFF',
  },
};
```

### **Typography**

```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};
```

### **Spacing**

```typescript
const spacing = {
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
};
```

### **Shadows**

```typescript
const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};
```

### **Border Radius**

```typescript
const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  full: '9999px',
};
```

---

## 📱 PAGE STRUCTURE

### **Main Layout**

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (Fixed)                                    [Profile] │
│ Logo | Dashboard | Inbox | Analytics | Settings             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                        PAGE CONTENT                          │
│                     (Dynamic per route)                      │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### **Routes & Pages**

```typescript
// app/ directory structure (Next.js 14 App Router)

app/
├── (auth)/                    # Auth pages (no layout)
│   ├── login/
│   │   └── page.tsx          # Login page
│   └── register/
│       └── page.tsx          # Registration
│
├── (dashboard)/               # Main app (with layout)
│   ├── layout.tsx            # Dashboard layout (sidebar, header)
│   │
│   ├── page.tsx              # Dashboard home (analytics overview)
│   │
│   ├── inbox/                # 🔥 MAIN: Chat inbox
│   │   ├── page.tsx          # Conversation list + chat window
│   │   └── [conversationId]/ # Single conversation (optional route)
│   │       └── page.tsx
│   │
│   ├── contacts/             # Contact management
│   │   ├── page.tsx          # Contact list
│   │   └── [contactId]/      # Contact detail
│   │       └── page.tsx
│   │
│   ├── auto-reply/           # Auto-reply rule builder
│   │   ├── page.tsx          # Rule list
│   │   ├── new/              # Create rule
│   │   │   └── page.tsx
│   │   └── [ruleId]/         # Edit rule
│   │       └── page.tsx
│   │
│   ├── quick-replies/        # Quick reply templates
│   │   └── page.tsx
│   │
│   ├── team/                 # CS operators management
│   │   ├── page.tsx          # Team list
│   │   └── [operatorId]/     # Operator detail
│   │       └── page.tsx
│   │
│   ├── analytics/            # Analytics & reports
│   │   ├── page.tsx          # Main analytics dashboard
│   │   ├── conversations/    # Conversation analytics
│   │   │   └── page.tsx
│   │   ├── auto-reply/       # Auto-reply performance
│   │   │   └── page.tsx
│   │   └── team/             # Team performance
│   │       └── page.tsx
│   │
│   ├── settings/             # Settings
│   │   ├── page.tsx          # General settings
│   │   ├── whatsapp/         # WhatsApp connection
│   │   │   └── page.tsx
│   │   ├── profile/          # Tenant profile
│   │   │   └── page.tsx
│   │   └── billing/          # Subscription & billing
│   │       └── page.tsx
│   │
│   └── onboarding/           # First-time setup wizard
│       └── page.tsx          # Connect WhatsApp + setup auto-reply
│
└── api/                      # API routes (if needed for client-side)
    └── [...catchall]/
        └── route.ts          # Proxy to backend API
```

---

## 🧩 COMPONENT ARCHITECTURE

### **Component Hierarchy**

```
pages/
└── inbox/
    └── page.tsx
        ├── <InboxLayout>                    # Main 3-column layout
        │   ├── <ConversationListSidebar>    # Left: Conversation list
        │   │   ├── <SearchBar>
        │   │   ├── <FilterTabs>
        │   │   └── <ConversationItem>[]     # List of conversations
        │   │       ├── <Avatar>
        │   │       ├── <CustomerInfo>
        │   │       ├── <LastMessage>
        │   │       ├── <UnreadBadge>
        │   │       └── <Timestamp>
        │   │
        │   ├── <ChatWindow>                 # Center: Active chat
        │   │   ├── <ChatHeader>
        │   │   │   ├── <CustomerProfile>
        │   │   │   ├── <AssignedCS>
        │   │   │   └── <ConversationActions>
        │   │   │
        │   │   ├── <MessageList>
        │   │   │   └── <MessageBubble>[]
        │   │   │       ├── <MessageContent>
        │   │   │       ├── <MessageStatus>  # Read receipts
        │   │   │       ├── <Timestamp>
        │   │   │       └── <QuotedMessage>  # If replying
        │   │   │
        │   │   ├── <TypingIndicator>        # "Customer is typing..."
        │   │   │
        │   │   └── <MessageInput>
        │   │       ├── <TextArea>
        │   │       ├── <EmojiPicker>
        │   │       ├── <MediaUpload>
        │   │       ├── <QuickReplyDropdown>
        │   │       └── <SendButton>
        │   │
        │   └── <CustomerProfileSidebar>     # Right: Customer info
        │       ├── <ContactCard>
        │       │   ├── <Avatar>
        │       │   ├── <ContactInfo>
        │       │   └── <Tags>
        │       │
        │       ├── <OrderHistory>
        │       │   └── <OrderCard>[]
        │       │
        │       ├── <InternalNotes>
        │       │   └── <NoteEditor>
        │       │
        │       └── <ConversationMetadata>
        │           ├── <CreatedAt>
        │           ├── <TotalMessages>
        │           └── <ConversationActions>
```

### **Core Components (Reusable)**

#### **1. MessageBubble Component**

```typescript
// components/chat/MessageBubble.tsx

interface MessageBubbleProps {
  message: {
    id: string;
    senderType: 'customer' | 'cs' | 'system' | 'auto_reply';
    senderName: string;
    content: string;
    messageType: 'text' | 'image' | 'audio' | 'document';
    mediaUrl?: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    sentAt: string;
    quotedMessage?: {
      id: string;
      content: string;
      senderName: string;
    };
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isSent = message.senderType !== 'customer';
  
  return (
    <div className={cn(
      "flex gap-2 mb-2",
      isSent ? "justify-end" : "justify-start"
    )}>
      {/* Avatar (customer only) */}
      {!isSent && <Avatar src={message.senderAvatar} />}
      
      <div className={cn(
        "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
        isSent ? "bg-bubble-sent" : "bg-bubble-received",
        message.senderType === 'auto_reply' && "bg-bubble-autoReply"
      )}>
        {/* Quoted message (if replying) */}
        {message.quotedMessage && (
          <div className="bg-black/10 rounded p-2 mb-2 text-sm">
            <p className="font-semibold">{message.quotedMessage.senderName}</p>
            <p className="truncate">{message.quotedMessage.content}</p>
          </div>
        )}
        
        {/* Message content */}
        {message.messageType === 'text' && (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}
        
        {message.messageType === 'image' && (
          <div>
            <img src={message.mediaUrl} className="rounded max-w-full" />
            {message.content && <p className="mt-2">{message.content}</p>}
          </div>
        )}
        
        {/* Timestamp + Status */}
        <div className="flex items-center gap-1 mt-1 justify-end">
          <span className="text-xs text-gray-600">
            {formatTime(message.sentAt)}
          </span>
          
          {isSent && (
            <MessageStatus status={message.status} />
          )}
        </div>
      </div>
    </div>
  );
}
```

#### **2. ConversationItem Component**

```typescript
// components/inbox/ConversationItem.tsx

interface ConversationItemProps {
  conversation: {
    id: string;
    customerName: string;
    customerAvatar?: string;
    lastMessage: {
      content: string;
      from: 'customer' | 'cs';
      timestamp: string;
    };
    unreadCount: number;
    status: 'active' | 'pending' | 'resolved';
    assignedCs?: {
      name: string;
      avatar?: string;
    };
    tags: string[];
  };
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50",
        "border-b border-gray-200",
        isActive && "bg-gray-100"
      )}
    >
      {/* Avatar + Online Status */}
      <div className="relative">
        <Avatar src={conversation.customerAvatar} />
        {conversation.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {conversation.unreadCount}
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm truncate">
            {conversation.customerName}
          </h3>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(conversation.lastMessage.timestamp)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {conversation.lastMessage.from === 'cs' && (
            <CheckIcon className="h-3 w-3 text-primary-500" />
          )}
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage.content}
          </p>
        </div>
        
        {/* Tags */}
        {conversation.tags.length > 0 && (
          <div className="flex gap-1 mt-1">
            {conversation.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
      
      {/* Assigned CS indicator */}
      {conversation.assignedCs && (
        <Avatar 
          src={conversation.assignedCs.avatar} 
          size="xs"
          title={`Assigned to ${conversation.assignedCs.name}`}
        />
      )}
    </div>
  );
}
```

#### **3. MessageInput Component**

```typescript
// components/chat/MessageInput.tsx

export function MessageInput({ conversationId }: { conversationId: string }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  
  const { mutate: sendMessage, isPending } = useSendMessage();
  
  // Typing indicator (debounced)
  useEffect(() => {
    if (message.length > 0 && !isTyping) {
      setIsTyping(true);
      socket.emit('typing-start', { conversationId });
    }
    
    const timeout = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socket.emit('typing-stop', { conversationId });
      }
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [message]);
  
  const handleSend = () => {
    if (!message.trim()) return;
    
    sendMessage({
      conversationId,
      messageType: 'text',
      content: message,
    });
    
    setMessage('');
  };
  
  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {/* Quick Reply Dropdown */}
      <QuickReplyDropdown 
        open={showQuickReplies}
        onSelect={(template) => {
          setMessage(template.message);
          setShowQuickReplies(false);
        }}
      />
      
      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Emoji Picker */}
        <EmojiPicker onSelect={(emoji) => setMessage(m => m + emoji)} />
        
        {/* Text Area */}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
            
            if (e.key === '/' && message === '') {
              setShowQuickReplies(true);
            }
          }}
          placeholder="Type a message..."
          className="flex-1 min-h-[40px] max-h-[120px]"
          rows={1}
        />
        
        {/* Media Upload */}
        <MediaUploadButton conversationId={conversationId} />
        
        {/* Send Button */}
        <Button 
          onClick={handleSend}
          disabled={!message.trim() || isPending}
          size="icon"
          className="h-10 w-10"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Character count (if > 500) */}
      {message.length > 500 && (
        <p className="text-xs text-gray-500 mt-1 text-right">
          {message.length} / 1000
        </p>
      )}
    </div>
  );
}
```

#### **4. TypingIndicator Component**

```typescript
// components/chat/TypingIndicator.tsx

export function TypingIndicator({ customerName }: { customerName: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-t">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-gray-600">
        {customerName} is typing...
      </span>
    </div>
  );
}
```

#### **5. QuickReplyDropdown Component**

```typescript
// components/chat/QuickReplyDropdown.tsx

export function QuickReplyDropdown({ open, onSelect }: Props) {
  const { data: quickReplies } = useQuickReplies();
  const [search, setSearch] = useState('');
  
  const filtered = quickReplies?.filter(qr => 
    qr.title.toLowerCase().includes(search.toLowerCase()) ||
    qr.shortcut.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search quick replies..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No quick replies found.</CommandEmpty>
            <CommandGroup heading="Quick Replies">
              {filtered?.map((qr) => (
                <CommandItem
                  key={qr.id}
                  onSelect={() => onSelect(qr)}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{qr.shortcut}</Badge>
                      <span className="font-medium">{qr.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {qr.message}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

---

## 🔄 STATE MANAGEMENT

### **Global State (Zustand)**

```typescript
// stores/chat-store.ts

interface ChatState {
  // Active conversation
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  
  // Conversations
  conversations: Conversation[];
  setConversations: (convs: Conversation[]) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  incrementUnread: (id: string) => void;
  markAsRead: (id: string) => void;
  
  // Messages
  messages: Record<string, Message[]>; // conversationId → messages[]
  addMessage: (conversationId: string, message: Message) => void;
  updateMessageStatus: (messageId: string, status: MessageStatus) => void;
  
  // Typing indicators
  typingUsers: Record<string, boolean>; // conversationId → isTyping
  setTyping: (conversationId: string, isTyping: boolean) => void;
  
  // Filters
  filters: {
    status: 'all' | 'active' | 'pending' | 'resolved';
    assignedTo: string | null;
    unreadOnly: boolean;
    search: string;
  };
  setFilters: (filters: Partial<ChatState['filters']>) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  
  conversations: [],
  setConversations: (convs) => set({ conversations: convs }),
  
  updateConversation: (id, updates) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === id ? { ...conv, ...updates } : conv
    ),
  })),
  
  incrementUnread: (id) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === id 
        ? { ...conv, unreadCount: conv.unreadCount + 1 }
        : conv
    ),
  })),
  
  markAsRead: (id) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === id ? { ...conv, unreadCount: 0 } : conv
    ),
  })),
  
  messages: {},
  
  addMessage: (conversationId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [conversationId]: [
        ...(state.messages[conversationId] || []),
        message,
      ],
    },
  })),
  
  updateMessageStatus: (messageId, status) => set((state) => {
    const newMessages = { ...state.messages };
    
    for (const convId in newMessages) {
      newMessages[convId] = newMessages[convId].map(msg =>
        msg.id === messageId ? { ...msg, status } : msg
      );
    }
    
    return { messages: newMessages };
  }),
  
  typingUsers: {},
  setTyping: (conversationId, isTyping) => set((state) => ({
    typingUsers: { ...state.typingUsers, [conversationId]: isTyping },
  })),
  
  filters: {
    status: 'all',
    assignedTo: null,
    unreadOnly: false,
    search: '',
  },
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
}));
```

### **Server State (React Query)**

```typescript
// hooks/use-conversations.ts

export function useConversations() {
  const filters = useChatStore(state => state.filters);
  
  return useQuery({
    queryKey: ['conversations', filters],
    queryFn: () => api.getConversations(filters),
    refetchInterval: 30000, // Refetch every 30s
  });
}

// hooks/use-messages.ts

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => conversationId ? api.getMessages(conversationId) : null,
    enabled: !!conversationId,
  });
}

// hooks/use-send-message.ts

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SendMessageData) => api.sendMessage(data),
    onMutate: async (newMessage) => {
      // Optimistic update
      const conversationId = newMessage.conversationId;
      
      await queryClient.cancelQueries({ 
        queryKey: ['messages', conversationId] 
      });
      
      const previousMessages = queryClient.getQueryData(['messages', conversationId]);
      
      queryClient.setQueryData(['messages', conversationId], (old: Message[]) => [
        ...old,
        {
          id: `temp-${Date.now()}`,
          ...newMessage,
          status: 'pending',
          sentAt: new Date().toISOString(),
        },
      ]);
      
      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['messages', newMessage.conversationId],
        context?.previousMessages
      );
    },
    onSuccess: (data, variables) => {
      // Update with real message from server
      queryClient.invalidateQueries({ 
        queryKey: ['messages', variables.conversationId] 
      });
    },
  });
}
```

---

## 🔌 REAL-TIME INTEGRATION

### **WebSocket Setup**

```typescript
// lib/socket.ts

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initializeSocket(token: string) {
  if (socket) return socket;
  
  socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
    auth: { token },
    transports: ['websocket'],
  });
  
  socket.on('connect', () => {
    console.log('✅ WebSocket connected');
  });
  
  socket.on('disconnect', () => {
    console.log('❌ WebSocket disconnected');
  });
  
  return socket;
}

export function getSocket() {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
}
```

### **Real-time Event Handlers**

```typescript
// hooks/use-realtime-chat.ts

export function useRealtimeChat() {
  const queryClient = useQueryClient();
  const { incrementUnread, addMessage, updateMessageStatus, setTyping } = useChatStore();
  
  useEffect(() => {
    const socket = getSocket();
    
    // New message received
    socket.on('new-message', (data: NewMessageEvent) => {
      const { conversationId, message } = data;
      
      // Add to local state
      addMessage(conversationId, message);
      
      // Increment unread if not active conversation
      const activeConvId = useChatStore.getState().activeConversationId;
      if (conversationId !== activeConvId) {
        incrementUnread(conversationId);
        
        // Show notification
        showNotification({
          title: message.senderName,
          body: message.content,
          onClick: () => {
            // Navigate to conversation
            router.push(`/inbox?conversation=${conversationId}`);
          },
        });
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ 
        queryKey: ['messages', conversationId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['conversations'] 
      });
    });
    
    // Message status updated
    socket.on('message-status-updated', (data: MessageStatusEvent) => {
      updateMessageStatus(data.messageId, data.status);
    });
    
    // Typing indicator
    socket.on('customer-typing', (data: TypingEvent) => {
      setTyping(data.conversationId, data.isTyping);
    });
    
    // Conversation updated
    socket.on('conversation-updated', (data: ConversationUpdateEvent) => {
      queryClient.invalidateQueries({ 
        queryKey: ['conversations'] 
      });
    });
    
    // New conversation created
    socket.on('new-conversation', (data: NewConversationEvent) => {
      queryClient.invalidateQueries({ 
        queryKey: ['conversations'] 
      });
      
      // Show notification
      showNotification({
        title: 'New Chat',
        body: `${data.conversation.customerName} started a conversation`,
      });
    });
    
    return () => {
      socket.off('new-message');
      socket.off('message-status-updated');
      socket.off('customer-typing');
      socket.off('conversation-updated');
      socket.off('new-conversation');
    };
  }, []);
}
```

### **Join/Leave Conversation Rooms**

```typescript
// hooks/use-conversation-room.ts

export function useConversationRoom(conversationId: string | null) {
  useEffect(() => {
    if (!conversationId) return;
    
    const socket = getSocket();
    
    // Join room
    socket.emit('join-conversation', { conversationId });
    
    // Mark as read
    socket.emit('mark-as-read', { conversationId });
    
    return () => {
      // Leave room
      socket.emit('leave-conversation', { conversationId });
    };
  }, [conversationId]);
}
```

---

## 🗺️ PHASE ROADMAP

### **PHASE 1: Core UI (Week 1-2)**

**Goal:** Basic chat interface working

**Tasks:**
- [ ] Design system setup (Tailwind config, color palette)
- [ ] Core components
  - [ ] MessageBubble
  - [ ] ConversationItem
  - [ ] MessageInput
  - [ ] TypingIndicator
- [ ] Pages
  - [ ] Inbox layout (3-column)
  - [ ] Conversation list
  - [ ] Chat window
- [ ] State management (Zustand store)
- [ ] API integration (React Query)
- [ ] WebSocket setup (basic)

**Deliverable:** Can view conversations, send/receive messages

---

### **PHASE 2: Real-time & Polish (Week 3-4)**

**Goal:** Smooth real-time experience

**Tasks:**
- [ ] WebSocket event handlers
  - [ ] New message notifications
  - [ ] Typing indicators
  - [ ] Read receipts
  - [ ] Status updates
- [ ] Optimistic updates (send message instantly)
- [ ] Notifications (browser push)
- [ ] Message status icons (checkmarks)
- [ ] Smooth animations (Framer Motion)
- [ ] Error handling & retry logic
- [ ] Loading states & skeletons

**Deliverable:** Professional real-time chat experience

---

### **PHASE 3: Advanced Features (Week 5-6)**

**Goal:** Team collaboration & productivity

**Tasks:**
- [ ] Customer profile sidebar
  - [ ] Contact info
  - [ ] Order history
  - [ ] Internal notes
  - [ ] Tags
- [ ] Quick replies system
  - [ ] Dropdown with search
  - [ ] Keyboard shortcuts (/)
  - [ ] Templates management
- [ ] Conversation actions
  - [ ] Assign to CS
  - [ ] Change status
  - [ ] Add tags
  - [ ] Mark resolved
- [ ] Filters & search
  - [ ] Status filter
  - [ ] Assigned CS filter
  - [ ] Unread only
  - [ ] Search customers
- [ ] Media handling
  - [ ] Image upload
  - [ ] Document preview
  - [ ] Audio player

**Deliverable:** Full-featured inbox for teams

---

### **PHASE 4: Auto-Reply Builder (Week 7-8)**

**Goal:** Visual rule builder for auto-replies

**Tasks:**
- [ ] Auto-reply pages
  - [ ] Rule list
  - [ ] Create/edit rule form
  - [ ] Test rule interface
- [ ] Rule components
  - [ ] Trigger type selector
  - [ ] Keyword input (with chips)
  - [ ] Working hours picker
  - [ ] Response editor (with variables)
  - [ ] Menu builder (drag & drop)
  - [ ] Priority slider
  - [ ] Cooldown settings
- [ ] Performance analytics
  - [ ] Trigger count
  - [ ] Success rate
  - [ ] Most used rules

**Deliverable:** Easy-to-use chatbot builder

---

### **PHASE 5: Analytics Dashboard (Week 9-10)**

**Goal:** Insights & reporting

**Tasks:**
- [ ] Dashboard overview
  - [ ] Key metrics cards
  - [ ] Trend charts (Recharts)
  - [ ] Top auto-replies
  - [ ] CS performance
- [ ] Detailed analytics pages
  - [ ] Conversation analytics
  - [ ] Auto-reply performance
  - [ ] Team performance
- [ ] Charts & visualizations
  - [ ] Line charts (messages over time)
  - [ ] Bar charts (CS comparison)
  - [ ] Pie charts (status breakdown)
  - [ ] Heat map (activity by hour)
- [ ] Export reports (CSV, PDF)
- [ ] Date range picker
- [ ] Filter & drill-down

**Deliverable:** Complete analytics system

---

## 📐 UI SPECIFICATIONS

### **Inbox Layout (3-Column)**

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                [Profile] │
│ Logo | Dashboard | Inbox | Analytics | Settings                │
├─────────┬──────────────────────────────────┬─────────────────────┤
│         │                                  │                     │
│ CONVS   │        CHAT WINDOW               │   CUSTOMER INFO     │
│ LIST    │                                  │                     │
│         │                                  │                     │
│ 320px   │           Flexible               │      360px          │
│         │                                  │                     │
│         │                                  │                     │
│         │                                  │                     │
│         │                                  │                     │
│         │                                  │                     │
└─────────┴──────────────────────────────────┴─────────────────────┘
```

**Responsive Breakpoints:**
- Desktop (>= 1280px): 3-column layout
- Tablet (768px - 1279px): 2-column (hide customer info)
- Mobile (< 768px): Single column (stack views)

### **Color Usage Guide**

```typescript
// Message Bubbles
const bubbleColors = {
  // Customer messages (received)
  customer: {
    bg: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-200',
  },
  
  // CS messages (sent)
  cs: {
    bg: 'bg-bubble-sent', // Light green
    text: 'text-gray-900',
  },
  
  // Auto-reply (differentiate from manual)
  autoReply: {
    bg: 'bg-bubble-autoReply', // Light blue
    text: 'text-gray-900',
    badge: 'Auto-reply',
  },
  
  // System messages
  system: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    style: 'italic text-center',
  },
};

// Status Indicators
const statusColors = {
  active: 'bg-green-500',    // Green dot
  pending: 'bg-yellow-500',  // Yellow dot
  resolved: 'bg-gray-400',   // Gray dot
  urgent: 'bg-red-500',      // Red dot
};

// Message Status Icons
const messageStatusIcons = {
  sent: <CheckIcon className="text-gray-400" />,        // Single gray check
  delivered: <CheckCheckIcon className="text-gray-400" />, // Double gray checks
  read: <CheckCheckIcon className="text-primary-500" />,   // Double green checks
  failed: <AlertCircleIcon className="text-red-500" />,    // Red alert
};
```

### **Typography Scale**

```typescript
// Conversation List
const conversationItemText = {
  name: 'text-sm font-semibold',
  lastMessage: 'text-sm text-gray-600',
  timestamp: 'text-xs text-gray-500',
};

// Chat Bubbles
const messageBubbleText = {
  content: 'text-sm',
  timestamp: 'text-xs text-gray-600',
};

// Customer Sidebar
const customerInfoText = {
  name: 'text-lg font-bold',
  label: 'text-xs font-medium text-gray-500 uppercase',
  value: 'text-sm text-gray-900',
};

// Dashboard
const dashboardText = {
  cardTitle: 'text-sm font-medium text-gray-600',
  cardValue: 'text-3xl font-bold',
  sectionTitle: 'text-xl font-bold',
};
```

### **Spacing System**

```typescript
// Chat bubbles
const bubbleSpacing = {
  padding: 'px-4 py-2',     // Inside bubble
  gap: 'mb-2',              // Between bubbles
  maxWidth: 'max-w-[70%]',  // Bubble max width
};

// Conversation list
const conversationItemSpacing = {
  padding: 'p-3',
  gap: 'gap-3',  // Between avatar and content
};

// Input area
const inputAreaSpacing = {
  padding: 'p-4',
  gap: 'gap-2',  // Between buttons
};
```

### **Animation Guidelines**

```typescript
// Message appear animation
const messageAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 },
};

// Typing indicator
const typingAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Conversation item hover
const conversationHover = {
  hover: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    transition: { duration: 0.1 },
  },
};
```

---

## 🎨 UI MOCKUPS (Text-based)

### **Inbox Page**

```
┌──────────────────────────────────────────────────────────────────────┐
│ 🏪 UMKM Chat       Dashboard  Inbox  Analytics  Settings   [Profile] │
├──────────┬───────────────────────────────────────┬────────────────────┤
│          │                                       │                    │
│ 📱 Inbox │  Chat with John Doe            [...]  │ 👤 John Doe        │
│          │                                       │ 📞 +62 812-3456... │
│ 🔍 Search│  🟢 John Doe • Online                 │ 📧 john@email.com  │
│          │  ─────────────────────────────────    │                    │
│ [All]    │                                       │ 📊 Stats           │
│  Active  │     Halo, ada promo?            ⬅️   │ • Orders: 5        │
│  Pending │     10:30 AM                          │ • Spent: Rp 2.5M   │
│  Closed  │                                       │ • Last: 2 days ago │
│          │  Ya ada! Diskon 50% 🎉                │                    │
│ ─────    │  10:31 AM                       ➡️   │ 🏷️ Tags           │
│          │                                       │ [VIP] [Regular]    │
│ 🟢 John  │     Wah mantap! Info dong?           │                    │
│    Halo..│     10:32 AM                    ⬅️   │ 📝 Notes           │
│    2m    │                                       │ Suka beli sepatu   │
│   [2]    │  ✍️ John is typing...                 │ size 42            │
│          │                                       │                    │
│ 🟡 Sarah │  ┌────────────────────────────────┐   │ 🛒 Recent Orders   │
│    Tks.. │  │ Type a message...       [📎]  │   │ #1234 - Rp 250K    │
│    15m   │  └────────────────────────────────┘   │ Nike Shoes         │
│          │                                       │ 29 Jan 2026        │
│ ⚪ Mike  │  [Quick Replies ▼] [Templates ▼]     │                    │
│    OK    │                                       │ [Assign] [Close]   │
│    1h    │                                       │                    │
└──────────┴───────────────────────────────────────┴────────────────────┘
```

### **Auto-Reply Builder**

```
┌──────────────────────────────────────────────────────────────────────┐
│ 🏪 UMKM Chat       Dashboard  Inbox  Analytics  Settings   [Profile] │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Auto-Reply Rules                                    [+ Create Rule]  │
│  ─────────────────────────────────────────────────────────────────   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ✅ Welcome Message                      [Edit] [Test] [⋮]    │   │
│  │ Trigger: First contact                                       │   │
│  │ Triggered: 89 times today                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ✅ Store Hours                          [Edit] [Test] [⋮]    │   │
│  │ Trigger: Keywords "jam buka", "buka kapan"                   │   │
│  │ Triggered: 34 times today                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ✅ Outside Hours                        [Edit] [Test] [⋮]    │   │
│  │ Trigger: Time-based (outside 09:00-21:00)                    │   │
│  │ Triggered: 19 times today                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ⏸️ How to Order                         [Edit] [Test] [⋮]    │   │
│  │ Trigger: Keywords "cara order", "gimana order"               │   │
│  │ Status: Inactive                                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

**END OF FRONTEND DOCUMENTATION**

Generated: 2026-01-28  
Version: 1.0.0  
Status: Ready for Implementation

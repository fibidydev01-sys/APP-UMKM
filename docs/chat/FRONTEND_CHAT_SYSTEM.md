# 🎨 FRONTEND: WhatsApp Chat - SIMPLE VERSION

**Project:** UMKM Multi-Tenant - WhatsApp Chat UI  
**Focus:** Phase 1 & 2 ONLY - Basic chat + Auto-reply builder  
**Stack:** Next.js 14 + TypeScript + Shadcn UI + Tailwind CSS

---

## 📋 FOKUS FITUR

### ✅ YANG DIBUAT (Phase 1 & 2)

**Phase 1: Basic Chat Interface**
- WhatsApp connection (QR code)
- Conversation list
- Chat window (send/receive messages)
- Real-time updates via WebSocket

**Phase 2: Auto-Reply Builder**
- Auto-reply rule management
- Keyword-based rules
- Welcome message setup
- Outside hours auto-reply

### ❌ YANG TIDAK DIBUAT

- ❌ Team collaboration (multi-CS)
- ❌ Quick replies management
- ❌ Advanced filters
- ❌ Analytics dashboard
- ❌ Customer profile sidebar (detailed)
- ❌ Internal notes
- ❌ Tags & assignments

**Single user mode:** 1 tenant = 1 owner (no team)

---

## 🎨 DESIGN SYSTEM

### **Color Palette**

```typescript
const colors = {
  // Primary (WhatsApp green)
  primary: {
    500: '#25D366', // Main green
    600: '#1EBD5C',
  },
  
  // Neutral
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    600: '#757575',
    900: '#212121',
  },
  
  // Status
  success: '#10B981',
  error: '#EF4444',
  
  // Chat Bubbles
  bubble: {
    sent: '#DCF8C6',     // Light green
    received: '#FFFFFF', // White
    autoReply: '#E0F2FE', // Light blue
  },
  
  // Background
  bg: {
    default: '#F0F2F5',
    chat: '#E5DDD5', // Beige (like WhatsApp)
    sidebar: '#FFFFFF',
  },
};
```

### **Typography**

```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui'],
  },
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
  },
};
```

---

## 📱 PAGE STRUCTURE (SIMPLIFIED)

### **Routes**

```typescript
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx          # Login
│   └── register/
│       └── page.tsx          # Register
│
├── (dashboard)/
│   ├── layout.tsx            # Main layout
│   │
│   ├── page.tsx              # Home (redirect to /inbox)
│   │
│   ├── inbox/                # 🔥 MAIN: Chat interface
│   │   └── page.tsx          # Conversation list + chat window
│   │
│   ├── auto-reply/           # Auto-reply management
│   │   ├── page.tsx          # Rule list
│   │   ├── new/
│   │   │   └── page.tsx      # Create rule
│   │   └── [ruleId]/
│   │       └── page.tsx      # Edit rule
│   │
│   └── settings/
│       ├── page.tsx          # General settings
│       └── whatsapp/
│           └── page.tsx      # WhatsApp connection
```

---

## 🧩 COMPONENT STRUCTURE

### **Inbox Layout (2-Column)**

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                      [Profile]   │
│ Logo | Inbox | Auto-Reply | Settings                   │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│  CONVS   │          CHAT WINDOW                         │
│  LIST    │                                              │
│          │                                              │
│  320px   │           Flexible                           │
│          │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

**Responsive:**
- Desktop (>= 1024px): 2-column
- Mobile (< 1024px): Single column (stack)

---

### **Component Hierarchy**

```
pages/inbox/page.tsx
└── <InboxLayout>
    ├── <ConversationListSidebar>      # Left
    │   ├── <SearchBar>
    │   ├── <FilterTabs>
    │   └── <ConversationItem>[]
    │       ├── <Avatar>
    │       ├── <CustomerInfo>
    │       ├── <LastMessage>
    │       └── <UnreadBadge>
    │
    └── <ChatWindow>                    # Right
        ├── <ChatHeader>
        │   ├── <CustomerProfile>
        │   └── <StatusIndicator>
        │
        ├── <MessageList>
        │   └── <MessageBubble>[]
        │       ├── <MessageContent>
        │       ├── <MessageStatus>     # Checkmarks
        │       └── <Timestamp>
        │
        └── <MessageInput>
            ├── <TextArea>
            ├── <EmojiPicker>
            └── <SendButton>
```

---

## 🎨 CORE COMPONENTS

### **1. MessageBubble**

```typescript
// components/chat/MessageBubble.tsx

interface MessageBubbleProps {
  message: {
    id: string;
    senderType: 'customer' | 'owner' | 'auto_reply';
    content: string;
    messageType: 'text' | 'image';
    mediaUrl?: string;
    status: 'sent' | 'delivered' | 'read';
    sentAt: string;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isSent = message.senderType !== 'customer';
  
  return (
    <div className={cn(
      "flex gap-2 mb-2",
      isSent ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
        isSent ? "bg-bubble-sent" : "bg-bubble-received",
        message.senderType === 'auto_reply' && "bg-bubble-autoReply"
      )}>
        {/* Content */}
        {message.messageType === 'text' && (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}
        
        {message.messageType === 'image' && (
          <img src={message.mediaUrl} className="rounded max-w-full" />
        )}
        
        {/* Timestamp + Status */}
        <div className="flex items-center gap-1 mt-1 justify-end">
          <span className="text-xs text-gray-600">
            {formatTime(message.sentAt)}
          </span>
          {isSent && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
}
```

---

### **2. ConversationItem**

```typescript
// components/inbox/ConversationItem.tsx

interface ConversationItemProps {
  conversation: {
    id: string;
    customerName: string;
    customerAvatar?: string;
    lastMessage: {
      content: string;
      from: 'customer' | 'owner';
      timestamp: string;
    };
    unreadCount: number;
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
      {/* Avatar */}
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
        
        <p className="text-sm text-gray-600 truncate">
          {conversation.lastMessage.content}
        </p>
      </div>
    </div>
  );
}
```

---

### **3. MessageInput**

```typescript
// components/chat/MessageInput.tsx

export function MessageInput({ conversationId }: { conversationId: string }) {
  const [message, setMessage] = useState('');
  const { mutate: sendMessage, isPending } = useSendMessage();
  
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
          }}
          placeholder="Type a message..."
          className="flex-1 min-h-[40px] max-h-[120px]"
          rows={1}
        />
        
        {/* Send Button */}
        <Button 
          onClick={handleSend}
          disabled={!message.trim() || isPending}
          size="icon"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
```

---

### **4. AutoReplyRuleCard**

```typescript
// components/auto-reply/RuleCard.tsx

interface RuleCardProps {
  rule: {
    id: string;
    name: string;
    triggerType: 'welcome' | 'keyword' | 'time_based';
    isActive: boolean;
    totalTriggered: number;
  };
}

export function RuleCard({ rule }: RuleCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{rule.name}</CardTitle>
            <CardDescription>
              Trigger: {rule.triggerType === 'welcome' && 'First contact'}
              {rule.triggerType === 'keyword' && 'Keywords'}
              {rule.triggerType === 'time_based' && 'Outside hours'}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch checked={rule.isActive} />
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ActivityIcon className="h-4 w-4" />
          <span>Triggered {rule.totalTriggered} times</span>
        </div>
      </CardContent>
    </Card>
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
  incrementUnread: (id: string) => void;
  markAsRead: (id: string) => void;
  
  // Messages
  messages: Record<string, Message[]>;
  addMessage: (conversationId: string, message: Message) => void;
  
  // Filters
  filters: {
    status: 'all' | 'active' | 'resolved';
    search: string;
  };
  setFilters: (filters: Partial<ChatState['filters']>) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  
  conversations: [],
  setConversations: (convs) => set({ conversations: convs }),
  
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
  
  filters: {
    status: 'all',
    search: '',
  },
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
}));
```

---

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
    
    // Optimistic update
    onMutate: async (newMessage) => {
      const conversationId = newMessage.conversationId;
      
      queryClient.setQueryData(['messages', conversationId], (old: Message[]) => [
        ...old,
        {
          id: `temp-${Date.now()}`,
          ...newMessage,
          status: 'pending',
          sentAt: new Date().toISOString(),
        },
      ]);
    },
    
    onSuccess: (data, variables) => {
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

import { io } from 'socket.io-client';

let socket: Socket | null = null;

export function initializeSocket(token: string) {
  if (socket) return socket;
  
  socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
    auth: { token },
    transports: ['websocket'],
  });
  
  socket.on('connect', () => {
    console.log('✅ Connected');
  });
  
  return socket;
}

export function getSocket() {
  if (!socket) throw new Error('Socket not initialized');
  return socket;
}
```

---

### **Event Handlers**

```typescript
// hooks/use-realtime-chat.ts

export function useRealtimeChat() {
  const { addMessage, incrementUnread } = useChatStore();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const socket = getSocket();
    
    // New message
    socket.on('new-message', (data: NewMessageEvent) => {
      const { conversationId, message } = data;
      
      // Add to state
      addMessage(conversationId, message);
      
      // Increment unread if not active
      const activeConvId = useChatStore.getState().activeConversationId;
      if (conversationId !== activeConvId) {
        incrementUnread(conversationId);
        
        // Show notification
        showNotification({
          title: message.senderName,
          body: message.content,
        });
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });
    
    // Message status updated
    socket.on('message-status-updated', (data) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    });
    
    // New conversation
    socket.on('new-conversation', () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });
    
    return () => {
      socket.off('new-message');
      socket.off('message-status-updated');
      socket.off('new-conversation');
    };
  }, []);
}
```

---

## 📄 PAGE EXAMPLES

### **1. Inbox Page**

```typescript
// app/(dashboard)/inbox/page.tsx

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { data: conversations, isLoading } = useConversations();
  const { data: messagesData } = useMessages(selectedConversation);
  
  // Real-time updates
  useRealtimeChat();
  
  return (
    <div className="flex h-screen">
      {/* Conversation List */}
      <div className="w-80 border-r bg-white">
        <div className="p-4 border-b">
          <SearchBar />
          <FilterTabs />
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {conversations?.data.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={selectedConversation === conv.id}
              onClick={() => setSelectedConversation(conv.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <ChatHeader conversation={messagesData?.conversation} />
            <MessageList messages={messagesData?.messages || []} />
            <MessageInput conversationId={selectedConversation} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
```

---

### **2. Auto-Reply Rules Page**

```typescript
// app/(dashboard)/auto-reply/page.tsx

export default function AutoReplyPage() {
  const { data: rules, isLoading } = useQuery({
    queryKey: ['auto-reply-rules'],
    queryFn: () => api.getAutoReplyRules(),
  });
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Auto-Reply Rules</h1>
          <p className="text-gray-600">Manage automated responses</p>
        </div>
        
        <Button asChild>
          <Link href="/auto-reply/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Rule
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {rules?.rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### **3. Create Auto-Reply Rule Page**

```typescript
// app/(dashboard)/auto-reply/new/page.tsx

export default function CreateRulePage() {
  const [triggerType, setTriggerType] = useState<'welcome' | 'keyword' | 'time_based'>('keyword');
  
  const { mutate: createRule, isPending } = useMutation({
    mutationFn: (data: CreateRuleData) => api.createAutoReplyRule(data),
    onSuccess: () => {
      router.push('/auto-reply');
    },
  });
  
  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Auto-Reply Rule</h1>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Rule Name */}
        <FormField
          label="Rule Name"
          error={errors.name?.message}
        >
          <Input {...register('name')} placeholder="e.g., Welcome Message" />
        </FormField>
        
        {/* Trigger Type */}
        <FormField label="Trigger Type">
          <Select value={triggerType} onValueChange={setTriggerType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome">First Contact (Welcome)</SelectItem>
              <SelectItem value="keyword">Keywords</SelectItem>
              <SelectItem value="time_based">Outside Hours</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        
        {/* Conditional fields based on trigger type */}
        {triggerType === 'keyword' && (
          <FormField label="Keywords">
            <Input 
              {...register('keywords')} 
              placeholder="halo, hi, hello (comma separated)"
            />
          </FormField>
        )}
        
        {triggerType === 'time_based' && (
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Time">
              <Input {...register('workingHours.start')} type="time" />
            </FormField>
            <FormField label="End Time">
              <Input {...register('workingHours.end')} type="time" />
            </FormField>
          </div>
        )}
        
        {/* Response Message */}
        <FormField label="Response Message">
          <Textarea
            {...register('responseMessage')}
            rows={5}
            placeholder="Halo {{name}}! Terima kasih telah menghubungi kami..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Use {{'{name}'}} and {{'{phone}'}} for personalization
          </p>
        </FormField>
        
        {/* Priority */}
        <FormField label="Priority (0-100)">
          <Slider
            {...register('priority')}
            min={0}
            max={100}
            step={10}
            defaultValue={[50]}
          />
        </FormField>
        
        {/* Delay */}
        <FormField label="Delay (seconds)">
          <Input
            {...register('delaySeconds')}
            type="number"
            min={1}
            max={10}
            defaultValue={2}
          />
        </FormField>
        
        {/* Submit */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/auto-reply">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Rule'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
```

---

### **4. WhatsApp Connection Page**

```typescript
// app/(dashboard)/settings/whatsapp/page.tsx

export default function WhatsAppConnectionPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'disconnected' | 'qr_pending' | 'connected'>('disconnected');
  
  const { mutate: connect } = useMutation({
    mutationFn: () => api.connectWhatsApp(),
    onSuccess: (data) => {
      if (data.qrCode) {
        setQrCode(data.qrCode);
        setStatus('qr_pending');
      }
    },
  });
  
  // Listen to WebSocket for connection updates
  useEffect(() => {
    const socket = getSocket();
    
    socket.on('qr-code', (data) => {
      setQrCode(data.qrCode);
      setStatus('qr_pending');
    });
    
    socket.on('connection-status', (data) => {
      setStatus(data.status);
      if (data.status === 'connected') {
        setQrCode(null);
      }
    });
    
    return () => {
      socket.off('qr-code');
      socket.off('connection-status');
    };
  }, []);
  
  return (
    <div className="container max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">WhatsApp Connection</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        
        <CardContent>
          {status === 'disconnected' && (
            <div className="text-center py-8">
              <PhoneOffIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Not connected to WhatsApp</p>
              <Button onClick={() => connect()}>
                Connect WhatsApp
              </Button>
            </div>
          )}
          
          {status === 'qr_pending' && qrCode && (
            <div className="text-center py-8">
              <p className="mb-4">Scan this QR code with WhatsApp</p>
              <img src={qrCode} alt="QR Code" className="mx-auto max-w-xs" />
              <p className="text-sm text-gray-500 mt-4">
                Open WhatsApp → Settings → Linked Devices → Link a Device
              </p>
            </div>
          )}
          
          {status === 'connected' && (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">Connected</p>
              <p className="text-gray-600 mb-4">Your WhatsApp is connected</p>
              <Button variant="outline" onClick={() => api.disconnectWhatsApp()}>
                Disconnect
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🗺️ IMPLEMENTATION ROADMAP

### **PHASE 1: Basic UI (Week 1-2)**

**Tasks:**
- [ ] Design system setup (Tailwind config)
- [ ] Core components
  - [ ] MessageBubble
  - [ ] ConversationItem
  - [ ] MessageInput
  - [ ] ChatHeader
- [ ] Pages
  - [ ] Login/Register
  - [ ] Inbox (2-column layout)
  - [ ] WhatsApp connection page
- [ ] State management (Zustand)
- [ ] API integration (React Query)
- [ ] WebSocket setup

**Deliverable:** Working chat interface

---

### **PHASE 2: Auto-Reply Builder (Week 3-4)**

**Tasks:**
- [ ] Auto-reply pages
  - [ ] Rule list
  - [ ] Create rule form
  - [ ] Edit rule form
- [ ] Components
  - [ ] RuleCard
  - [ ] TriggerTypeSelector
  - [ ] KeywordInput
  - [ ] WorkingHoursPicker
  - [ ] ResponseEditor
- [ ] Form validation (Zod)
- [ ] Real-time rule updates

**Deliverable:** Auto-reply management interface

---

## 📐 UI SPECIFICATIONS

### **Color Usage**

```typescript
// Message Bubbles
const bubbleColors = {
  customer: 'bg-white border border-gray-200',
  owner: 'bg-bubble-sent', // Light green
  autoReply: 'bg-bubble-autoReply', // Light blue
};

// Status Icons
const statusIcons = {
  sent: <CheckIcon className="text-gray-400" />,
  delivered: <CheckCheckIcon className="text-gray-400" />,
  read: <CheckCheckIcon className="text-primary-500" />,
};
```

### **Spacing**

```typescript
const spacing = {
  bubblePadding: 'px-4 py-2',
  bubbleGap: 'mb-2',
  inputPadding: 'p-4',
  sidebarWidth: 'w-80',
};
```

---

## ✅ SUCCESS CRITERIA

**Phase 1:**
- ✅ WhatsApp QR code displays
- ✅ Can send/receive messages
- ✅ Real-time updates work
- ✅ Conversation list shows correctly
- ✅ Mobile responsive

**Phase 2:**
- ✅ Can create auto-reply rules
- ✅ Rules can be edited/deleted
- ✅ Form validation works
- ✅ Rule list shows properly

---

**END OF SIMPLIFIED FRONTEND DOCUMENTATION**

Version: 1.0.0 (Simplified)  
Focus: Phase 1 & 2 Only  
Generated: 2026-01-28
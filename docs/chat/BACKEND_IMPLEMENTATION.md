# 📱 WhatsApp Chat System - Panduan Implementasi Backend

**Proyek:** UMKM Multi-Tenant - WhatsApp Chat Backend  
**Versi:** 1.0.0  
**Status:** ✅ Selesai (Fase 1 & 2)  
**Stack:** NestJS + Prisma + Baileys + Socket.IO + Redis

---

## 📋 Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Fitur](#fitur)
- [Arsitektur](#arsitektur)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Struktur Database](#struktur-database)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Referensi Tambahan](#referensi-tambahan)

---

## 🎯 Gambaran Umum

Integrasi lengkap WhatsApp chat untuk platform multi-tenant UMKM dengan sistem auto-reply yang cerdas. Setiap tenant dapat menghubungkan akun WhatsApp Business mereka, mengelola percakapan, dan mengotomatiskan respon.

### ✅ Fitur yang Telah Diimplementasikan (Fase 1 & 2)

**Fase 1: Chat Dasar**
- ✅ Koneksi WhatsApp via QR code (Baileys)
- ✅ Kirim/terima pesan secara real-time
- ✅ Manajemen percakapan dengan paginasi
- ✅ Pelacakan kontak dan riwayat
- ✅ WebSocket untuk update real-time

**Fase 2: Auto-Reply Engine**
- ✅ Pesan selamat datang (kontak pertama)
- ✅ Balasan berbasis kata kunci (exact, contains, starts_with)
- ✅ Balasan berbasis waktu (di luar jam kerja)
- ✅ Penggantian variabel ({{name}}, {{phone}})
- ✅ Sistem prioritas (0-100)
- ✅ Delay seperti manusia (1-60 detik)
- ✅ Logging komprehensif

---

## 🏗️ Arsitektur

### Struktur Modul

```
server/src/
├── whatsapp/              # Koneksi & messaging WhatsApp
│   ├── whatsapp.service.ts       # Integrasi Baileys
│   ├── whatsapp.controller.ts    # HTTP endpoints
│   ├── whatsapp.gateway.ts       # WebSocket gateway
│   └── dto/                      # Data Transfer Objects
│
├── conversations/         # Manajemen percakapan
│   ├── conversations.service.ts
│   ├── conversations.controller.ts
│   └── dto/
│
├── messages/             # Penanganan pesan
│   ├── messages.service.ts
│   ├── messages.controller.ts
│   ├── messages.gateway.ts       # Real-time events
│   └── dto/
│
├── contacts/             # Manajemen kontak
│   ├── contacts.service.ts
│   ├── contacts.controller.ts
│   └── dto/
│
└── auto-reply/           # Auto-reply engine
    ├── auto-reply.service.ts
    ├── auto-reply.controller.ts
    ├── dto/
    └── engines/
        ├── keyword-engine.ts     # Pencocokan kata kunci
        ├── time-based-engine.ts  # Pemeriksaan jam kerja
        └── welcome-engine.ts     # Deteksi kontak pertama
```

### Stack Teknologi

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Runtime | Node.js | ≥18.0.0 |
| Framework | NestJS | 11.0.1 |
| Database | PostgreSQL (Supabase) | - |
| ORM | Prisma | 6.0.1 |
| Cache | Redis (Upstash) | - |
| WhatsApp API | Baileys | 7.0.0-rc.9 |
| WebSocket | Socket.IO | 4.8.3 |
| Authentication | JWT | - |

---

## 🚀 Instalasi

### Prerequisites

```bash
- Node.js >= 18.0.0
- pnpm >= 9.0.0
- PostgreSQL database (Supabase)
- Redis instance (Upstash)
```

### Langkah-langkah Setup

**1. Install Dependencies**

```bash
cd server
pnpm install
```

**2. Konfigurasi Environment**

Buat file `.env`:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Database (Supabase)
DATABASE_URL=postgresql://user:pass@host:5432/db?pgbouncer=true
DIRECT_URL=postgresql://user:pass@host:5432/db

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Redis Cache (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# WhatsApp Configuration
WHATSAPP_SESSION_PATH=./whatsapp-sessions
WHATSAPP_MAX_RETRIES=3

# Auto-Reply Settings
AUTO_REPLY_ENABLED=true
AUTO_REPLY_DEFAULT_DELAY_SECONDS=2

# Server
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**3. Migrasi Database**

```bash
# Jalankan migrasi untuk membuat tabel
pnpm prisma migrate dev --name add_whatsapp_chat_system

# Generate Prisma Client
pnpm prisma generate
```

**4. Build Project**

```bash
pnpm build
```

**5. Jalankan Server**

```bash
# Mode development (dengan watch)
pnpm start:dev

# Mode production
pnpm start:prod
```

Server akan berjalan di: `http://localhost:8000`

---

## ⚙️ Konfigurasi

### Penyimpanan Sesi WhatsApp

Sesi autentikasi WhatsApp disimpan secara lokal:

```
whatsapp-sessions/
└── {tenantId}/
    ├── creds.json
    ├── app-state-sync-key-*.json
    └── ...
```

**⚠️ Penting:** Backup folder ini secara berkala untuk mencegah autentikasi ulang.

### Konfigurasi Auto-Reply

Pengaturan default di `.env`:

```env
AUTO_REPLY_ENABLED=true                    # Aktifkan/nonaktifkan auto-reply
AUTO_REPLY_DEFAULT_DELAY_SECONDS=2         # Delay default sebelum balas
```

Konfigurasi per-aturan melalui API (lihat Referensi API).

---

## 🗄️ Struktur Database

### Tabel yang Dibuat

1. **WhatsAppSession** - Status koneksi WhatsApp per tenant
2. **Conversation** - Percakapan pelanggan
3. **Message** - Pesan individual
4. **Contact** - Informasi kontak pelanggan
5. **AutoReplyRule** - Aturan auto-reply
6. **AutoReplyLog** - Log trigger auto-reply

### Schema Prisma

```prisma
// WhatsApp Session untuk setiap tenant
model WhatsAppSession {
  id            String    @id @default(cuid())
  tenantId      String    @unique
  phoneNumber   String?
  status        String    @default("DISCONNECTED") // DISCONNECTED, QR_PENDING, CONNECTING, CONNECTED
  qrCode        String?   @db.Text
  lastConnected DateTime?
  isOnline      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([status])
  @@map("whatsapp_sessions")
}

// Percakapan dengan pelanggan
model Conversation {
  id             String    @id @default(cuid())
  tenantId       String
  customerPhone  String
  customerName   String?
  customerAvatar String?
  status         String    @default("ACTIVE") // ACTIVE, RESOLVED, CLOSED
  unreadCount    Int       @default(0)
  lastMessageAt  DateTime  @default(now())
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  tenant   Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  messages Message[]
  contact  Contact?  @relation(fields: [customerPhone, tenantId], references: [phone, tenantId])

  @@unique([tenantId, customerPhone])
  @@index([tenantId, status])
  @@index([tenantId, lastMessageAt])
  @@map("conversations")
}

// Pesan dalam percakapan
model Message {
  id             String    @id @default(cuid())
  conversationId String
  tenantId       String
  waMessageId    String?   @unique
  senderType     String    // CUSTOMER, OWNER, AUTO_REPLY
  senderName     String?
  messageType    String    // TEXT, IMAGE, AUDIO, DOCUMENT
  content        String    @db.Text
  mediaUrl       String?
  status         String    @default("PENDING") // PENDING, SENT, DELIVERED, READ, FAILED
  sentAt         DateTime  @default(now())
  deliveredAt    DateTime?
  readAt         DateTime?
  createdAt      DateTime  @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([conversationId, sentAt])
  @@index([tenantId, sentAt])
  @@index([waMessageId])
  @@map("messages")
}

// Kontak pelanggan
model Contact {
  id                 String         @id @default(cuid())
  tenantId           String
  phone              String
  name               String?
  avatarUrl          String?
  totalConversations Int            @default(0)
  firstContactAt     DateTime       @default(now())
  lastContactAt      DateTime       @default(now())
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  tenant        Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  conversations Conversation[]

  @@unique([phone, tenantId])
  @@index([tenantId, lastContactAt])
  @@map("contacts")
}

// Aturan Auto-Reply
model AutoReplyRule {
  id              String    @id @default(cuid())
  tenantId        String
  name            String
  description     String?
  triggerType     String    // WELCOME, KEYWORD, TIME_BASED
  keywords        String[]  @default([])
  matchType       String?   // EXACT, CONTAINS, STARTS_WITH
  caseSensitive   Boolean   @default(false)
  workingHours    Json?     // { start: "09:00", end: "21:00", timezone: "Asia/Jakarta", days: [1,2,3,4,5] }
  responseMessage String    @db.Text
  priority        Int       @default(0) // 0-100, higher = checked first
  delaySeconds    Int       @default(2) // Delay sebelum kirim balasan
  isActive        Boolean   @default(true)
  totalTriggered  Int       @default(0)
  lastTriggeredAt DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  tenant Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  logs   AutoReplyLog[]

  @@index([tenantId, isActive, priority])
  @@index([tenantId, triggerType])
  @@map("auto_reply_rules")
}

// Log Auto-Reply
model AutoReplyLog {
  id                   String   @id @default(cuid())
  ruleId               String
  tenantId             String
  conversationId       String
  triggeredByMessage   String   @db.Text
  responseSent         String   @db.Text
  matchedKeyword       String?
  delaySeconds         Int
  triggeredAt          DateTime @default(now())

  rule   AutoReplyRule @relation(fields: [ruleId], references: [id], onDelete: Cascade)
  tenant Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId, triggeredAt])
  @@index([ruleId, triggeredAt])
  @@map("auto_reply_logs")
}
```

### Relasi Tabel

```
Tenant
  ├── WhatsAppSession (1:1)
  ├── Conversation (1:N)
  ├── Message (1:N)
  ├── Contact (1:N)
  ├── AutoReplyRule (1:N)
  └── AutoReplyLog (1:N)

Conversation
  ├── Message (1:N)
  └── Contact (N:1)

AutoReplyRule
  └── AutoReplyLog (1:N)
```

---

## 🧪 Testing

### Test Koneksi WhatsApp

```bash
# Menggunakan curl
curl -X POST http://localhost:8000/api/whatsapp/connect \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json"
```

### Test Auto-Reply

1. Hubungkan WhatsApp
2. Buat aturan pesan selamat datang
3. Kirim pesan dari nomor berbeda ke WhatsApp Anda
4. Auto-reply harus terkirim setelah delay

### Cek Log

```bash
# Log server menampilkan trigger auto-reply
[WhatsApp] Pesan diterima dari 628123456789: Halo
[AutoReply] Aturan cocok: Pesan Selamat Datang (WELCOME)
[AutoReply] Auto-reply terkirim untuk aturan: Pesan Selamat Datang
```

### Test dengan Postman

**Collection Endpoint:**
1. `POST /auth/login` - Login dan dapatkan token
2. `POST /whatsapp/connect` - Koneksi WhatsApp
3. `GET /whatsapp/status` - Cek status koneksi
4. `GET /conversations` - Dapatkan daftar percakapan
5. `POST /messages/send` - Kirim pesan
6. `POST /auto-reply/rules` - Buat aturan auto-reply

---

## 🐛 Troubleshooting

### Masalah: QR Code Tidak Muncul

**Penyebab:** WebSocket tidak terhubung  
**Solusi:**
- Cek pengaturan CORS di `main.ts`
- Pastikan frontend terhubung ke URL WebSocket yang benar
- Cek console browser untuk error koneksi

```typescript
// main.ts - Konfigurasi CORS
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

### Masalah: Pesan Tidak Terkirim

**Penyebab:** Sesi WhatsApp terputus  
**Solusi:**
- Cek status koneksi: `GET /whatsapp/status`
- Hubungkan ulang jika diperlukan: `POST /whatsapp/connect`
- Cek log server untuk error

```bash
# Cek status via curl
curl -X GET http://localhost:8000/api/whatsapp/status \
  -H "Authorization: Bearer <token>"
```

### Masalah: Auto-Reply Tidak Terpicu

**Penyebab:** Aturan tidak aktif atau konflik prioritas  
**Solusi:**
- Cek aturan aktif: `GET /auto-reply/rules`
- Verifikasi pencocokan kata kunci (pengaturan case-sensitive)
- Cek prioritas aturan (prioritas lebih tinggi = dicek pertama)
- Review log: `GET /auto-reply/rules/:id` (menampilkan log terbaru)

```bash
# Toggle aturan
curl -X PATCH http://localhost:8000/api/auto-reply/rules/rule123/toggle \
  -H "Authorization: Bearer <token>"
```

### Masalah: Error Build

**Penyebab:** Prisma Client tidak di-generate  
**Solusi:**
```bash
pnpm prisma generate
pnpm build
```

### Masalah: Error Koneksi Database

**Penyebab:** DATABASE_URL atau DIRECT_URL tidak valid  
**Solusi:**
- Verifikasi kredensial di `.env`
- Test koneksi: `pnpm prisma studio`
- Cek dashboard Supabase untuk info koneksi

```bash
# Test koneksi database
pnpm prisma db push
```

### Masalah: Redis Connection Error

**Penyebab:** Kredensial Upstash Redis tidak valid  
**Solusi:**
- Verifikasi `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN`
- Cek dashboard Upstash Redis
- Pastikan Redis instance aktif

### Masalah: WebSocket Disconnect Terus-menerus

**Penyebab:** Token JWT expired atau tidak valid  
**Solusi:**
- Login ulang untuk mendapatkan token baru
- Cek pengaturan `JWT_EXPIRES_IN` di `.env`
- Verifikasi token di client-side

### Masalah: Pesan Duplicate

**Penyebab:** Multiple WebSocket connections  
**Solusi:**
- Pastikan hanya satu koneksi WebSocket per user
- Disconnect socket lama sebelum membuat koneksi baru
- Gunakan `socket.disconnect()` saat component unmount

```javascript
// React useEffect cleanup
useEffect(() => {
  const socket = io('http://localhost:8000/messages');
  
  return () => {
    socket.disconnect();
  };
}, []);
```

---

## 📊 Monitoring & Logging

### Log Levels

```typescript
// Logging configuration
Logger.log('Info message');      // Informasi umum
Logger.warn('Warning message');  // Peringatan
Logger.error('Error message');   // Error
Logger.debug('Debug message');   // Debug (hanya di development)
```

### Monitoring Auto-Reply

```bash
# Check total triggers
GET /auto-reply/rules

# Check recent logs
GET /auto-reply/rules/:id

# Monitor via server logs
tail -f logs/app.log
```

---

## 🔐 Best Practices

### Keamanan

1. **Environment Variables**
   - Jangan commit file `.env` ke repository
   - Gunakan secrets manager di production
   - Rotasi JWT_SECRET secara berkala

2. **Database**
   - Gunakan connection pooling (Prisma default)
   - Enable SSL untuk koneksi database
   - Backup database secara berkala

3. **WhatsApp Session**
   - Backup folder `whatsapp-sessions/` secara berkala
   - Encrypt session files di production
   - Monitor unauthorized access

### Performance

1. **Caching**
   - Gunakan Redis untuk cache frequent queries
   - Cache conversation list dan contact list
   - Set TTL yang sesuai untuk setiap data

2. **Database Queries**
   - Gunakan proper indexing (sudah ada di schema)
   - Limit query results dengan pagination
   - Gunakan select untuk field yang diperlukan saja

3. **WebSocket**
   - Implement room-based messaging
   - Disconnect inactive connections
   - Use Redis adapter untuk multi-server setup

---

## 📚 Referensi Tambahan

- [Baileys Documentation](https://whiskeysockets.github.io/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Redis Documentation](https://redis.io/documentation)

---

## 🤝 Contributing

Lihat [CONTRIBUTING.md](../../CONTRIBUTING.md) untuk panduan kontribusi.

---

## 📄 License

MIT License - Lihat [LICENSE](../../LICENSE)

---

**Terakhir Diperbarui:** 28 Januari 2024  
**Maintainer:** Fibidy Development Team

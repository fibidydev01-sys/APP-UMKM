# 🌐 Referensi API WhatsApp Chat System

Dokumentasi lengkap untuk endpoint backend WhatsApp Chat System.

**Base URL:** `http://localhost:8000/api`  
**Autentikasi:** JWT token (Cookie atau Bearer)  
**Versi API:** 1.0.0  
**Terakhir Diperbarui:** 28 Januari 2024

---

## 📑 Daftar Isi

- [Autentikasi](#autentikasi)
- [Koneksi WhatsApp](#koneksi-whatsapp)
- [Percakapan](#percakapan)
- [Pesan](#pesan)
- [Kontak](#kontak)
- [Aturan Auto-Reply](#aturan-auto-reply)
- [Kode Error](#kode-error)
- [Rate Limiting](#rate-limiting)
- [WebSocket Events](#websocket-events)

---

## 🔐 Autentikasi

Semua endpoint memerlukan autentikasi JWT.

### Metode Autentikasi

**1. Cookie Authentication**
```http
Cookie: fibidy_auth=<jwt-token>
```

**2. Bearer Token**
```http
Authorization: Bearer <jwt-token>
```

### Mendapatkan Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "tenant@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tenant": {
    "id": "clxxxx",
    "slug": "my-store",
    "name": "My Store"
  }
}
```

---

## 📱 Koneksi WhatsApp

### POST /whatsapp/connect

Inisialisasi koneksi WhatsApp dan dapatkan QR code.

**Request:**
```http
POST /api/whatsapp/connect
Authorization: Bearer <token>
Content-Type: application/json

{
  "phoneNumber": "628123456789"  // Opsional
}
```

**Response (QR Pending):**
```json
{
  "status": "QR_PENDING",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "sessionId": "clxxxx"
}
```

**Response (Sudah Terhubung):**
```json
{
  "status": "CONNECTED",
  "phoneNumber": "628123456789",
  "sessionId": "clxxxx"
}
```

**Status Codes:**
- `200` - Sukses
- `401` - Tidak terautentikasi
- `500` - Server error

---

### GET /whatsapp/status

Dapatkan status koneksi WhatsApp saat ini.

**Request:**
```http
GET /api/whatsapp/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "CONNECTED",
  "phoneNumber": "628123456789",
  "lastConnected": "2024-01-28T10:00:00.000Z",
  "isOnline": true
}
```

**Status Koneksi:**
- `DISCONNECTED` - Tidak terhubung
- `QR_PENDING` - Menunggu scan QR
- `CONNECTING` - Sedang menghubungkan
- `CONNECTED` - Berhasil terhubung

---

### DELETE /whatsapp/disconnect

Putuskan koneksi WhatsApp.

**Request:**
```http
DELETE /api/whatsapp/disconnect
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "WhatsApp berhasil diputuskan"
}
```

**Catatan:**
- Menghapus file sesi dari server
- Memerlukan autentikasi ulang untuk koneksi berikutnya

---

### POST /whatsapp/send

Kirim pesan test (hanya untuk testing).

**Request:**
```http
POST /api/whatsapp/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "628123456789",
  "messageType": "text",
  "content": "Hello dari API",
  "mediaUrl": "https://example.com/image.jpg"  // Opsional, untuk gambar
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "3EB0XXXXXXXXXXXX"
}
```

---

## 💬 Percakapan

### GET /conversations

Dapatkan daftar percakapan dengan paginasi dan filter.

**Request:**
```http
GET /api/conversations?status=ACTIVE&page=1&limit=20&search=john
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Default | Deskripsi |
|-----------|------|---------|-----------|
| `status` | string | - | Filter berdasarkan status: `ACTIVE`, `RESOLVED`, `CLOSED` |
| `search` | string | - | Cari berdasarkan nama atau nomor telepon pelanggan |
| `unreadOnly` | boolean | false | Hanya tampilkan percakapan yang belum dibaca |
| `page` | number | 1 | Nomor halaman |
| `limit` | number | 20 | Item per halaman (maksimal: 100) |

**Response:**
```json
{
  "data": [
    {
      "id": "clxxxx",
      "customerPhone": "628123456789",
      "customerName": "John Doe",
      "customerAvatar": null,
      "status": "ACTIVE",
      "unreadCount": 3,
      "lastMessage": {
        "content": "Halo, saya punya pertanyaan tentang produk",
        "from": "customer",
        "timestamp": "2024-01-28T10:00:00.000Z"
      },
      "createdAt": "2024-01-28T09:00:00.000Z",
      "contact": {
        "phone": "628123456789",
        "name": "John Doe",
        "totalConversations": 5
      }
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### GET /conversations/:id

Dapatkan detail percakapan dengan riwayat pesan.

**Request:**
```http
GET /api/conversations/clxxxx
Authorization: Bearer <token>
```

**Response:**
```json
{
  "conversation": {
    "id": "clxxxx",
    "customerPhone": "628123456789",
    "customerName": "John Doe",
    "customerAvatar": null,
    "status": "ACTIVE",
    "unreadCount": 0,
    "totalMessages": 15,
    "contact": {
      "phone": "628123456789",
      "name": "John Doe",
      "totalConversations": 5,
      "firstContactAt": "2024-01-20T10:00:00.000Z",
      "lastContactAt": "2024-01-28T10:00:00.000Z"
    },
    "createdAt": "2024-01-28T09:00:00.000Z"
  },
  "messages": [
    {
      "id": "msg123",
      "senderType": "CUSTOMER",
      "senderName": "John Doe",
      "messageType": "TEXT",
      "content": "Halo, saya punya pertanyaan",
      "mediaUrl": null,
      "status": "READ",
      "sentAt": "2024-01-28T10:00:00.000Z",
      "deliveredAt": "2024-01-28T10:00:01.000Z",
      "readAt": "2024-01-28T10:00:05.000Z"
    },
    {
      "id": "msg124",
      "senderType": "OWNER",
      "messageType": "TEXT",
      "content": "Halo! Ada yang bisa saya bantu?",
      "status": "SENT",
      "sentAt": "2024-01-28T10:01:00.000Z"
    }
  ]
}
```

**Tipe Pengirim Pesan:**
- `CUSTOMER` - Pesan dari pelanggan
- `OWNER` - Pesan dari pemilik toko
- `AUTO_REPLY` - Balasan otomatis

**Status Pesan:**
- `PENDING` - Antrian untuk dikirim
- `SENT` - Terkirim ke WhatsApp
- `DELIVERED` - Terkirim ke pelanggan
- `READ` - Dibaca oleh pelanggan
- `FAILED` - Gagal dikirim

---

### PATCH /conversations/:id

Update status percakapan.

**Request:**
```http
PATCH /api/conversations/clxxxx
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "RESOLVED"
}
```

**Response:**
```json
{
  "success": true,
  "conversation": {
    "id": "clxxxx",
    "status": "RESOLVED",
    "updatedAt": "2024-01-28T10:00:00.000Z"
  }
}
```

---

### POST /conversations/:id/mark-read

Tandai semua pesan dalam percakapan sebagai sudah dibaca.

**Request:**
```http
POST /api/conversations/clxxxx/mark-read
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true
}
```

---

## 📨 Pesan

### POST /messages/send

Kirim pesan ke pelanggan.

**Request:**
```http
POST /api/messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "clxxxx",
  "messageType": "TEXT",
  "content": "Terima kasih atas pertanyaan Anda!",
  "mediaUrl": "https://example.com/image.jpg"
}
```

**Tipe Pesan:**
- `TEXT` - Pesan teks biasa
- `IMAGE` - Gambar dengan caption (memerlukan `mediaUrl`)
- `AUDIO` - File audio (memerlukan `mediaUrl`)
- `DOCUMENT` - File dokumen (memerlukan `mediaUrl`)

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg456",
    "waMessageId": "3EB0XXXXXXXXXXXX",
    "status": "SENT",
    "sentAt": "2024-01-28T10:05:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "statusCode": 404,
  "message": "Percakapan tidak ditemukan",
  "error": "Not Found"
}
```

---

### GET /messages

Dapatkan pesan untuk percakapan dengan cursor-based pagination.

**Request:**
```http
GET /api/messages?conversationId=clxxxx&limit=50&before=msg123
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Required | Deskripsi |
|-----------|------|----------|-----------|
| `conversationId` | string | Ya | ID Percakapan |
| `before` | string | Tidak | ID Pesan untuk cursor pagination (muat pesan lebih lama) |
| `limit` | number | Tidak | Jumlah pesan (default: 50, max: 100) |

**Response:**
```json
{
  "messages": [
    {
      "id": "msg123",
      "senderType": "CUSTOMER",
      "senderName": "John Doe",
      "messageType": "TEXT",
      "content": "Halo",
      "status": "READ",
      "sentAt": "2024-01-28T10:00:00.000Z"
    }
  ],
  "hasMore": true
}
```

---

## 👥 Kontak

### GET /contacts

Dapatkan semua kontak untuk tenant.

**Request:**
```http
GET /api/contacts
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "contact123",
      "phone": "628123456789",
      "name": "John Doe",
      "avatarUrl": null,
      "totalConversations": 3,
      "firstContactAt": "2024-01-20T10:00:00.000Z",
      "lastContactAt": "2024-01-28T10:00:00.000Z",
      "createdAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### GET /contacts/:id

Dapatkan detail kontak dengan riwayat percakapan.

**Request:**
```http
GET /api/contacts/contact123
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "contact123",
  "phone": "628123456789",
  "name": "John Doe",
  "avatarUrl": null,
  "totalConversations": 3,
  "firstContactAt": "2024-01-20T10:00:00.000Z",
  "lastContactAt": "2024-01-28T10:00:00.000Z",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "conversations": [
    {
      "id": "conv1",
      "status": "RESOLVED",
      "lastMessageAt": "2024-01-28T10:00:00.000Z",
      "lastMessageContent": "Terima kasih!"
    }
  ]
}
```

---

### POST /contacts

Buat kontak baru secara manual.

**Request:**
```http
POST /api/contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "628123456789",
  "name": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "contact": {
    "id": "contact123",
    "phone": "628123456789",
    "name": "John Doe",
    "createdAt": "2024-01-28T10:00:00.000Z"
  }
}
```

---

### PUT /contacts/:id

Update informasi kontak.

**Request:**
```http
PUT /api/contacts/contact123
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "contact": {
    "id": "contact123",
    "phone": "628123456789",
    "name": "John Smith",
    "avatarUrl": "https://example.com/new-avatar.jpg",
    "updatedAt": "2024-01-28T10:00:00.000Z"
  }
}
```

---

### DELETE /contacts/:id

Hapus kontak.

**Request:**
```http
DELETE /api/contacts/contact123
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Kontak berhasil dihapus"
}
```

---

## 🤖 Aturan Auto-Reply

### GET /auto-reply/rules

Dapatkan semua aturan auto-reply untuk tenant.

**Request:**
```http
GET /api/auto-reply/rules
Authorization: Bearer <token>
```

**Response:**
```json
{
  "rules": [
    {
      "id": "rule123",
      "name": "Pesan Selamat Datang",
      "description": "Sambutan otomatis untuk pelanggan baru",
      "triggerType": "WELCOME",
      "keywords": [],
      "matchType": null,
      "workingHours": null,
      "responseMessage": "Halo {{name}}! Terima kasih telah menghubungi kami.",
      "priority": 100,
      "delaySeconds": 2,
      "isActive": true,
      "totalTriggered": 45,
      "lastTriggeredAt": "2024-01-28T10:00:00.000Z",
      "createdAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### GET /auto-reply/rules/:id

Dapatkan detail aturan dengan log trigger terbaru.

**Request:**
```http
GET /api/auto-reply/rules/rule123
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "rule123",
  "name": "Pesan Selamat Datang",
  "triggerType": "WELCOME",
  "responseMessage": "Halo {{name}}!",
  "priority": 100,
  "isActive": true,
  "totalTriggered": 45,
  "recentLogs": [
    {
      "id": "log1",
      "triggeredByMessage": "Halo",
      "responseSent": "Halo John Doe!",
      "matchedKeyword": null,
      "triggeredAt": "2024-01-28T10:00:00.000Z"
    }
  ]
}
```

---

### POST /auto-reply/rules

Buat aturan auto-reply baru.

**Request (Pesan Selamat Datang):**
```http
POST /api/auto-reply/rules
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pesan Selamat Datang",
  "description": "Menyapa pelanggan baru",
  "triggerType": "WELCOME",
  "responseMessage": "Halo {{name}}! Terima kasih telah menghubungi kami. Ada yang bisa kami bantu?",
  "priority": 100,
  "delaySeconds": 2,
  "isActive": true
}
```

**Request (Berbasis Kata Kunci):**
```http
POST /api/auto-reply/rules
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pertanyaan Produk",
  "triggerType": "KEYWORD",
  "keywords": ["harga", "price", "berapa"],
  "matchType": "CONTAINS",
  "caseSensitive": false,
  "responseMessage": "Untuk informasi harga produk, silakan kunjungi katalog kami di website.",
  "priority": 50,
  "delaySeconds": 3
}
```

**Tipe Pencocokan:**
- `EXACT` - Pencocokan tepat (contoh: "harga" cocok dengan "harga" saja)
- `CONTAINS` - Mengandung kata kunci (contoh: "harga" cocok dengan "berapa harga ini?")
- `STARTS_WITH` - Dimulai dengan kata kunci (contoh: "harga" cocok dengan "harga produk A")

**Request (Berbasis Waktu):**
```http
POST /api/auto-reply/rules
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Balasan di Luar Jam Kerja",
  "triggerType": "TIME_BASED",
  "workingHours": {
    "start": "09:00",
    "end": "21:00",
    "timezone": "Asia/Jakarta",
    "days": [1, 2, 3, 4, 5]
  },
  "responseMessage": "Terima kasih telah menghubungi kami. Saat ini kami sedang offline. Jam kerja kami: Senin-Jumat 09:00-21:00 WIB.",
  "priority": 30,
  "delaySeconds": 2
}
```

**Hari Jam Kerja:**
- `0` = Minggu
- `1` = Senin
- `2` = Selasa
- `3` = Rabu
- `4` = Kamis
- `5` = Jumat
- `6` = Sabtu

**Penggantian Variabel:**
- `{{name}}` - Nama pelanggan (atau nomor telepon jika nama tidak diatur)
- `{{phone}}` - Nomor telepon pelanggan

**Response:**
```json
{
  "success": true,
  "rule": {
    "id": "rule123",
    "name": "Pesan Selamat Datang",
    "triggerType": "WELCOME",
    "isActive": true,
    "createdAt": "2024-01-28T10:00:00.000Z"
  }
}
```

---

### PUT /auto-reply/rules/:id

Update aturan auto-reply.

**Request:**
```http
PUT /api/auto-reply/rules/rule123
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pesan Selamat Datang Diperbarui",
  "responseMessage": "Halo {{name}}! Selamat datang di toko kami.",
  "priority": 90,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "rule": {
    "id": "rule123",
    "name": "Pesan Selamat Datang Diperbarui",
    "triggerType": "WELCOME",
    "isActive": true,
    "updatedAt": "2024-01-28T10:00:00.000Z"
  }
}
```

---

### DELETE /auto-reply/rules/:id

Hapus aturan auto-reply.

**Request:**
```http
DELETE /api/auto-reply/rules/rule123
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Aturan auto-reply berhasil dihapus"
}
```

---

### PATCH /auto-reply/rules/:id/toggle

Toggle status aktif aturan (aktifkan/nonaktifkan).

**Request:**
```http
PATCH /api/auto-reply/rules/rule123/toggle
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "isActive": false
}
```

---

## ⚠️ Kode Error

### HTTP Status Codes

| Kode | Deskripsi |
|------|-----------|
| `200` | Sukses |
| `201` | Berhasil dibuat |
| `400` | Bad Request (error validasi) |
| `401` | Unauthorized (token hilang/tidak valid) |
| `403` | Forbidden (izin tidak cukup) |
| `404` | Not Found |
| `409` | Conflict (resource duplikat) |
| `429` | Too Many Requests (rate limit terlampaui) |
| `500` | Internal Server Error |

### Format Response Error

```json
{
  "statusCode": 400,
  "message": ["nama tidak boleh kosong", "prioritas harus berupa angka"],
  "error": "Bad Request"
}
```

### Pesan Error Umum

**Error Autentikasi:**
```json
{
  "statusCode": 401,
  "message": "Token tidak ditemukan",
  "error": "Unauthorized"
}
```

**Error Validasi:**
```json
{
  "statusCode": 400,
  "message": [
    "triggerType harus salah satu dari: WELCOME, KEYWORD, TIME_BASED",
    "responseMessage tidak boleh kosong"
  ],
  "error": "Bad Request"
}
```

**Not Found:**
```json
{
  "statusCode": 404,
  "message": "Percakapan tidak ditemukan",
  "error": "Not Found"
}
```

---

## 🚦 Rate Limiting

**Rate Limit Global:**
- 100 request per 60 detik per alamat IP
- Berlaku untuk semua endpoint

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643400000
```

**Rate Limit Terlampaui:**
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests",
  "error": "Too Many Requests"
}
```

---

## 🔌 WebSocket Events

### Namespace: `/whatsapp`

**Events yang Dikirim:**
- `qr-code` - QR code untuk scan
- `connection-status` - Update status koneksi

**Contoh Penggunaan:**
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000/whatsapp', {
  auth: { token: 'your-jwt-token' }
});

socket.on('qr-code', (data) => {
  console.log('QR Code:', data.qrCode);
});

socket.on('connection-status', (data) => {
  console.log('Status:', data.status);
});
```

### Namespace: `/messages`

**Events yang Diterima:**
- `join-conversation` - Bergabung ke room percakapan
- `leave-conversation` - Keluar dari room percakapan
- `mark-as-read` - Tandai pesan sebagai dibaca

**Events yang Dikirim:**
- `new-message` - Pesan baru diterima
- `message-status-updated` - Status pesan berubah
- `new-conversation` - Percakapan baru dibuat

**Contoh Penggunaan:**
```javascript
const socket = io('http://localhost:8000/messages', {
  auth: { token: 'your-jwt-token' }
});

// Join conversation room
socket.emit('join-conversation', { conversationId: 'conv123' });

// Listen for new messages
socket.on('new-message', (message) => {
  console.log('Pesan baru:', message);
});

// Listen for status updates
socket.on('message-status-updated', (data) => {
  console.log('Status diperbarui:', data);
});
```

---

## 📊 Paginasi

**Offset-based Pagination** (Percakapan, Kontak):
```
?page=1&limit=20
```

**Cursor-based Pagination** (Pesan):
```
?before=msg123&limit=50
```

Cursor pagination lebih efisien untuk dataset besar.

---

## 🔒 Best Practices Keamanan

1. **Selalu gunakan HTTPS di production**
2. **Simpan JWT token dengan aman** (HttpOnly cookie direkomendasikan)
3. **Rotasi JWT_SECRET secara berkala**
4. **Implementasikan request signing** untuk operasi sensitif
5. **Monitor rate limits** untuk mencegah penyalahgunaan
6. **Validasi nomor telepon** sebelum mengirim pesan
7. **Sanitasi input pengguna** dalam pesan auto-reply

---

## 📝 Catatan

- Semua timestamp dalam format ISO 8601 (UTC)
- Nomor telepon harus dalam format internasional tanpa '+' (contoh: 628123456789)
- Panjang pesan maksimal: 4096 karakter
- Format gambar yang didukung: JPG, PNG, GIF (max 5MB)
- Aturan auto-reply dievaluasi berdasarkan prioritas (tertinggi pertama)
- Aturan pertama yang cocok akan menang (tidak ada balasan ganda per pesan)

---

**Versi API:** 1.0.0  
**Terakhir Diperbarui:** 28 Januari 2024

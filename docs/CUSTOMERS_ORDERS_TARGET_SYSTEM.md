# Panduan Fitur Customers & Orders - TARGET SYSTEM (AUTO-CREATE)

## 🚀 STATUS: TARGET PENGEMBANGAN - SISTEM OTOMATIS

Dokumentasi ini menjelaskan **sistem target** di mana customer dan order **otomatis dibuat** saat checkout, tanpa input manual!

---

## Daftar Isi
- [Overview](#overview)
- [Perbedaan dengan Sistem Saat Ini](#perbedaan-dengan-sistem-saat-ini)
- [Alur Checkout Store (Auto-Create)](#alur-checkout-store-auto-create)
- [Alur Kerja Pemilik Toko (Simplified)](#alur-kerja-pemilik-toko-simplified)
- [Sistem Customer (Auto-Managed)](#sistem-customer-auto-managed)
- [Sistem Order (Auto-Created)](#sistem-order-auto-created)
- [Customer Tracking (Tanpa Login)](#customer-tracking-tanpa-login)
- [Fitur Edit & Update](#fitur-edit--update)
- [Technical Implementation](#technical-implementation)
- [FAQ](#faq)

---

## Overview

### ✅ Apakah Data Customer & Order Otomatis Dibuat?

**YA! SEMUANYA OTOMATIS!** 🎉

| Aspek | Status | Penjelasan |
|-------|--------|------------|
| Customer | **AUTO-CREATE** ✅ | Otomatis dibuat saat checkout (jika belum ada) |
| Order | **AUTO-CREATE** ✅ | Otomatis dibuat saat checkout dengan status PENDING |
| WhatsApp | Konfirmasi saja | WhatsApp sebagai notifikasi, bukan data entry |
| Customer Tracking | **TERSEDIA** ✅ | Customer bisa track order tanpa login |
| Dashboard | **SIMPLIFIED** ✅ | Pemilik toko cuma update status |

### Kenapa Sistem Baru Lebih Baik?

| Fitur | Sistem Lama ❌ | Sistem Baru ✅ |
|-------|---------------|---------------|
| Input data | Manual 2x (customer + dashboard) | 1x aja (checkout) |
| Waktu per order | 5-10 menit | 30 detik |
| Prone to error | Tinggi (salah ketik, lupa catat) | Rendah (data langsung akurat) |
| Customer tracking | Tidak ada | Ada (via order ID) |
| Scalability | Max 10-20 order/hari | Unlimited! |
| Customer experience | Buruk (harus tanya terus) | Baik (ada konfirmasi & tracking) |
| Real-time data | Tidak | Ya |

---

## Perbedaan dengan Sistem Saat Ini

### Sistem Lama (Manual) ❌

```
Customer checkout → WhatsApp message
                         ↓
                    (data hilang)
                         ↓
Pemilik toko ketik ulang di dashboard
                         ↓
               Order created manual
```

**Masalah:**
- 😫 Cape (kerja 2x)
- ❌ Error-prone
- 🐌 Lambat
- 📉 Not scalable

### Sistem Baru (Auto) ✅

```
Customer checkout → AUTO-CREATE:
                    ├─ Customer (if new)
                    └─ Order (PENDING)
                         ↓
                    WhatsApp konfirmasi
                         ↓
               Customer dapat tracking link
                         ↓
    Pemilik toko cuma update status → DONE!
```

**Keuntungan:**
- 🚀 Cepat (auto!)
- ✅ Akurat (no typo)
- 📈 Scalable
- 😊 Happy customer

---

## Alur Checkout Store (Auto-Create)

### Customer Journey (New Flow)

```
┌─────────────────────────────────────────────────────────────┐
│  CUSTOMER JOURNEY - AUTO SYSTEM                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Buka store: /store/burgerchina                         │
│                      │                                      │
│                      ▼                                      │
│  2. Pilih produk → Add to cart                             │
│                      │                                      │
│                      ▼                                      │
│  3. Klik "Checkout"                                        │
│                      │                                      │
│                      ▼                                      │
│  4. Isi form checkout:                                      │
│     ├── Nama (wajib)                                       │
│     ├── Nomor WhatsApp (wajib)                             │
│     ├── Alamat (wajib)                                     │
│     ├── Kurir (opsional)                                   │
│     ├── Metode Bayar (opsional)                            │
│     └── Catatan (opsional)                                 │
│                      │                                      │
│                      ▼                                      │
│  5. Klik "Kirim Pesanan"                                   │
│                      │                                      │
│                      ▼                                      │
│  ✅ BACKEND AUTO-CREATE (INSTANT!):                        │
│     ├─ Cek nomor HP                                        │
│     ├─ Customer baru? → Create customer                    │
│     ├─ Customer lama? → Update data (jika beda)            │
│     └─ Create order (PENDING)                              │
│          Order ID: cmkv4uh4c001atzlod9chuhfp               │
│          Order Number: ORD-20240127-001                    │
│                      │                                      │
│                      ▼                                      │
│  6. Customer dapat:                                         │
│     ├── ✅ Konfirmasi order berhasil                       │
│     ├── 📱 WhatsApp link (konfirmasi ke toko)             │
│     └── 🔗 Tracking link: /track/cmkv4uh4c001atzlod9chuhfp │
│                      │                                      │
│                      ▼                                      │
│  7. Customer:                                               │
│     ├── Bisa klik WhatsApp (opsional konfirmasi)           │
│     └── Bisa track status kapan aja!                       │
│                                                             │
│  🎉 Order & customer DATA SUDAH ADA DI DATABASE!           │
│  ⚡ Total waktu: 2-3 detik!                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Contoh WhatsApp Message (Konfirmasi)

```
✅ *Pesanan Berhasil Dibuat!*

Nomor Pesanan: #ORD-20240127-001
Order ID: cmkv4uh4c001atzlod9chuhfp

Track pesanan Anda di:
https://yourstore.com/track/cmkv4uh4c001atzlod9chuhfp

---

*Detail Pesanan:*
2x Burger Cheese - Rp 50.000
1x French Fries - Rp 15.000

*Total:* Rp 65.000

*Informasi Pengiriman:*
Nama: Budi Santoso
No. WhatsApp: 081234567890
Alamat: Jl. Sudirman No. 123, Jakarta
Kurir: JNE Regular

*Pembayaran:* Transfer Bank BCA

Catatan: Tanpa bawang ya

---

Terima kasih sudah berbelanja! 🙏
```

---

## Alur Kerja Pemilik Toko (Simplified)

### Workflow Pemilik Toko (Super Simple!)

```
┌─────────────────────────────────────────────────────────────┐
│  PEMILIK TOKO WORKFLOW - TARGET SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Terima notifikasi order baru                           │
│     ├── Via WhatsApp (jika customer kirim)                 │
│     ├── Via email (opsional)                               │
│     └── Via dashboard notification                         │
│                      │                                      │
│                      ▼                                      │
│  2. Buka Dashboard → Pesanan                               │
│     ├── Order SUDAH ADA! ✅                                │
│     ├── Customer SUDAH ADA! ✅                             │
│     └── Semua data LENGKAP! ✅                             │
│         ├─ Nama                                            │
│         ├─ Nomor HP                                        │
│         ├─ Alamat                                          │
│         ├─ Items                                           │
│         ├─ Total                                           │
│         └─ Metode bayar                                    │
│                      │                                      │
│                      ▼                                      │
│  3. Review order:                                           │
│     ├── Data benar? → Proses!                              │
│     └── Data salah? → Edit/Update (bisa edit!)             │
│                      │                                      │
│                      ▼                                      │
│  4. Update status:                                          │
│     ├── PENDING → PROCESSING                               │
│     ├── Customer auto-notified via tracking page           │
│     └── Lanjut proses pesanan                              │
│                      │                                      │
│                      ▼                                      │
│  5. Setelah kirim/selesai:                                 │
│     ├── PROCESSING → COMPLETED                             │
│     └── Update pembayaran: PENDING → PAID                  │
│                      │                                      │
│                      ▼                                      │
│  6. Customer auto-notified!                                 │
│     └── Cek tracking page → status updated                 │
│                                                             │
│  ⚡ Total waktu: 30 detik - 1 menit!                       │
│  😊 NO MANUAL INPUT! Just update status!                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sistem Customer (Auto-Managed)

### Auto-Create Logic

**Saat checkout, sistem akan:**

```typescript
// Pseudo-code
1. Normalize nomor HP (081234567890 → 6281234567890)
2. Cek customer by phone:
   
   IF customer EXISTS:
      - Update data jika ada perubahan (nama/alamat)
      - Return existing customer
   
   ELSE:
      - Create new customer
      - Return new customer
```

### Data Customer (Auto-Populated)

| Field | Source | Auto-Update? |
|-------|--------|--------------|
| Nama | Checkout form | Ya (jika beda) |
| No. HP | Checkout form | Ya (normalized) |
| Alamat | Checkout form | Ya (jika beda) |
| Email | Checkout form (opsional) | Ya (jika ada) |
| Total Orders | Auto-increment | Ya (setiap order) |
| Total Spent | Auto-sum | Ya (saat COMPLETED & PAID) |
| Created At | Auto | Tidak |
| Updated At | Auto | Ya (setiap update) |

### Normalisasi HP (Automatic)

```
Input dari customer:
├─ "081234567890"   → 6281234567890
├─ "81234567890"    → 6281234567890
├─ "+6281234567890" → 6281234567890
└─ "6281234567890"  → 6281234567890

Semua jadi sama! Jadi customer gak duplikat.
```

### Customer Detection (Smart!)

**Skenario 1: Customer Baru**
```
1. Customer pertama kali checkout
2. HP: 081234567890 (belum ada di DB)
3. Sistem: CREATE customer baru
4. Result: Customer ID assigned
```

**Skenario 2: Repeat Customer**
```
1. Customer checkout lagi
2. HP: 081234567890 (udah ada di DB)
3. Sistem: FOUND existing customer
4. Nama beda? → UPDATE nama
5. Alamat beda? → UPDATE alamat
6. Result: Pake customer ID yang sama
```

**Skenario 3: Customer Ganti Nomor**
```
1. Customer checkout dengan nomor baru
2. HP: 082987654321 (belum ada)
3. Sistem: CREATE customer baru
4. Note: Ini akan jadi customer record terpisah
   (karena identifier = nomor HP)
```

---

## Sistem Order (Auto-Created)

### Auto-Create Flow

```
Checkout submitted
      ↓
Customer created/found
      ↓
Order created with:
├─ Random ID: cmkv4uh4c001atzlod9chuhfp (secure!)
├─ Order Number: ORD-20240127-001 (readable)
├─ Customer ID: linked
├─ Store ID: linked
├─ Items: JSON dari cart
├─ Total: calculated
├─ Status: PENDING
├─ Payment Status: PENDING
└─ All form data saved
```

### Order Data (Auto-Populated)

| Field | Source | Editable? |
|-------|--------|-----------|
| Order ID | Auto (CUID) | ❌ Tidak |
| Order Number | Auto (sequential) | ❌ Tidak |
| Customer ID | Auto (dari detection) | ✅ Ya (bisa ganti customer) |
| Store ID | Auto (dari store slug) | ❌ Tidak |
| Items | Checkout cart | ✅ Ya (bisa edit/tambah) |
| Subtotal | Auto (calculated) | ✅ Ya (recalculate) |
| Discount | Checkout form | ✅ Ya |
| Total | Auto (calculated) | ✅ Ya (recalculate) |
| Status | PENDING (default) | ✅ Ya |
| Payment Status | PENDING (default) | ✅ Ya |
| Payment Method | Checkout form | ✅ Ya |
| Shipping Address | Checkout form | ✅ Ya |
| Courier | Checkout form | ✅ Ya |
| Notes | Checkout form | ✅ Ya |
| Created At | Auto | ❌ Tidak |
| Updated At | Auto | Ya (on edit) |

### Order URLs

```
Dashboard View:
/dashboard/orders/cmkv4uh4c001atzlod9chuhfp

Customer Tracking:
/track/cmkv4uh4c001atzlod9chuhfp
```

**Security:** Order ID random (CUID) = aman dari guessing!

---

## Customer Tracking (Tanpa Login)

### Fitur Tracking Page

**URL:** `/track/[orderId]`

**Contoh:** `/track/cmkv4uh4c001atzlod9chuhfp`

### Apa yang Customer Bisa Lihat?

```
┌─────────────────────────────────────────┐
│  Tracking Pesanan                        │
├─────────────────────────────────────────┤
│                                         │
│  Order #ORD-20240127-001                │
│  Status: 🟡 Sedang Diproses             │
│  Pembayaran: ⏳ Menunggu Pembayaran     │
│                                         │
│  ┌───────────────────────────────┐     │
│  │  Timeline:                     │     │
│  │  ✅ Pesanan Dibuat             │     │
│  │     27 Jan 2024, 10:30        │     │
│  │                                │     │
│  │  🟡 Sedang Diproses (aktif)    │     │
│  │     27 Jan 2024, 11:00        │     │
│  │                                │     │
│  │  ⚪ Sedang Dikirim             │     │
│  │                                │     │
│  │  ⚪ Selesai                    │     │
│  └───────────────────────────────┘     │
│                                         │
│  Detail Pesanan:                        │
│  ├─ 2x Burger Cheese    Rp 50.000      │
│  └─ 1x French Fries     Rp 15.000      │
│                                         │
│  Total: Rp 65.000                       │
│                                         │
│  Penerima:                              │
│  Budi Santoso                           │
│  Jl. Sudirman No. 123, Jakarta          │
│                                         │
│  ┌───────────────────────────────┐     │
│  │  Hubungi Toko                  │     │
│  │  [WhatsApp] 📱                │     │
│  └───────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

### Keamanan Tracking

**Pertanyaan:** Apakah aman? Siapa aja bisa akses?

**Jawaban:** 
- Order ID = Random CUID (impossible to guess)
- Contoh: `cmkv4uh4c001atzlod9chuhfp`
- Gak ada pattern (beda sama `ORD-001`, `ORD-002`)
- Kemungkinan ditebak: ~0%

**Level keamanan:**
- ✅ Cukup untuk UMKM
- ✅ Lebih baik dari order number sequential
- ✅ Gak perlu login (UX lebih baik)

**Note:** Kalau butuh extra security, bisa tambah phone verification atau token expiry nanti.

---

## Fitur Edit & Update

### Kenapa Bisa Edit?

**Philosophy:**
- Data auto-created dari checkout **≠ data final**
- Customer mungkin salah input alamat
- Nego harga via WhatsApp
- Tambah/kurang items
- Update info pengiriman

**Jadi sistem harus FLEKSIBEL untuk update!**

### Apa yang Bisa Diedit?

#### Customer Data ✅
```
Dashboard → Pelanggan → Edit
├─ Nama (bisa update)
├─ Nomor HP (bisa update, tapi hati-hati duplikasi!)
├─ Email (bisa update)
├─ Alamat (bisa update)
└─ Catatan (bisa update)
```

**Use case:**
- Customer typo nama
- Ganti nomor HP
- Update alamat lebih detail
- Tambah catatan (preferensi, dll)

#### Order Data ✅
```
Dashboard → Pesanan → Edit
├─ Customer (bisa ganti customer lain)
├─ Items (bisa tambah/kurang/edit)
├─ Discount (bisa tambah)
├─ Shipping Address (bisa update)
├─ Courier (bisa ganti)
├─ Payment Method (bisa ganti)
├─ Notes (bisa update)
├─ Status (bisa update)
└─ Payment Status (bisa update)
```

**Use case:**
- Customer nego harga → tambah diskon
- Customer mau tambah item → edit items
- Alamat salah → update alamat
- Status update → change status
- Udah bayar → mark as PAID

#### Yang TIDAK Bisa Diedit ❌
```
├─ Order ID (immutable)
├─ Order Number (immutable)
├─ Store ID (immutable)
└─ Created At (immutable)
```

### Edit Flow

```
┌─────────────────────────────────────────┐
│  Edit Order Example                      │
├─────────────────────────────────────────┤
│                                         │
│  Skenario: Customer nego via WhatsApp   │
│                                         │
│  1. Order auto-created:                 │
│     Total: Rp 65.000                    │
│                      ↓                  │
│  2. Customer WA: "Mas, diskon dong 10k" │
│                      ↓                  │
│  3. Pemilik toko:                       │
│     ├─ Buka order di dashboard          │
│     ├─ Klik "Edit"                      │
│     ├─ Tambah discount: Rp 10.000       │
│     ├─ Total jadi: Rp 55.000            │
│     └─ Save                             │
│                      ↓                  │
│  4. Customer cek tracking:              │
│     └─ Total udah update: Rp 55.000 ✅  │
│                                         │
└─────────────────────────────────────────┘
```

### Audit Trail (Optional Future Feature)

```
Order History:
├─ Created: 27 Jan 10:30 (auto from checkout)
├─ Edited: 27 Jan 10:45 (discount added: Rp 10k)
├─ Status Changed: 27 Jan 11:00 (PENDING → PROCESSING)
└─ Payment Updated: 27 Jan 14:30 (PENDING → PAID)
```

---

## Technical Implementation

### API Endpoints

#### New Endpoints (untuk auto-create)

```
POST /api/orders/create-from-checkout
├─ Input: checkout form data
├─ Process:
│  ├─ Find/create customer
│  ├─ Create order
│  └─ Return order + customer
└─ Output: { order, customer, trackingUrl }
```

#### Enhanced Endpoints

```
PATCH /api/orders/:id
├─ Update order data (items, discount, etc)
└─ Recalculate totals

PATCH /api/customers/:id
├─ Update customer data
└─ Update related orders (address change)
```

### Database Schema (No Change!)

**Good news:** Schema TIDAK PERLU DIUBAH!

```prisma
model Customer {
  id          String   @id @default(cuid())
  storeId     String
  name        String
  phone       String   // Normalized
  email       String?
  address     String?
  totalOrders Int      @default(0)
  totalSpent  Decimal  @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orders      Order[]
  store       Store    @relation(...)
  
  @@unique([storeId, phone]) // Prevent duplicate by phone
}

model Order {
  id              String   @id @default(cuid())
  orderNumber     String   @unique
  storeId         String
  customerId      String?
  items           Json
  subtotal        Decimal
  discount        Decimal  @default(0)
  total           Decimal
  status          OrderStatus
  paymentStatus   PaymentStatus
  paymentMethod   String?
  shippingAddress String?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  customer        Customer? @relation(...)
  store           Store     @relation(...)
}
```

**Yang perlu ditambah:**
- ✅ Unique constraint: `[storeId, phone]` (prevent duplicate)
- ✅ Index: `phone` (faster lookup)

### Frontend Changes

#### 1. Checkout Component
```typescript
// Before: only WhatsApp
handleCheckout() {
  openWhatsApp(message);
}

// After: Create order first!
async handleCheckout() {
  const { order } = await createOrder(formData);
  openWhatsApp(message);
  router.push(`/track/${order.id}`);
}
```

#### 2. New Tracking Page
```
src/app/track/[orderId]/page.tsx (NEW!)
```

#### 3. Dashboard Enhancements
```typescript
// Add "Edit" button to order detail
// Add inline edit for common fields
// Add "Notify Customer" button (send WA)
```

---

## FAQ

### Q: Apakah semua order dari checkout otomatis masuk?

**A:** YA! 100% otomatis. Setiap checkout = 1 order created.

### Q: Bagaimana kalau customer salah input data?

**A:** Bisa diedit! Pemilik toko bisa edit order/customer data di dashboard.

### Q: Apakah customer bisa edit sendiri?

**A:** Untuk fase 1: TIDAK. Customer harus kontak toko via WhatsApp. Untuk fase 2 (future): bisa tambah fitur "Request Edit" di tracking page.

### Q: Bagaimana kalau customer cancel?

**A:** 
1. Customer WA ke toko
2. Pemilik toko update status: CANCELLED
3. Customer lihat di tracking page

### Q: Apakah WhatsApp masih dipakai?

**A:** YA! Tapi fungsinya berubah:
- ❌ Dulu: Data entry
- ✅ Sekarang: Konfirmasi & komunikasi

### Q: Customer harus login gak?

**A:** TIDAK! Cukup punya order ID (dari tracking link).

### Q: Bagaimana kalau link tracking hilang?

**A:** Customer bisa:
1. Cek email (jika ada notif email)
2. Cek WhatsApp (ada di message)
3. Kontak toko untuk minta link lagi

### Q: Apakah data customer aman?

**A:** 
- ✅ Order ID random (susah ditebak)
- ✅ HTTPS (encrypted)
- ✅ No login = no password to hack
- ⚠️ Tapi: siapa yang punya link bisa akses

### Q: Bagaimana kalau toko punya cabang?

**A:** 
- Customer terpisah per store (storeId)
- Order terpisah per store
- 1 nomor HP bisa jadi customer di banyak toko

### Q: Apakah statistik customer otomatis?

**A:** YA! 
- `totalOrders` auto-increment saat order created
- `totalSpent` auto-sum saat order COMPLETED & PAID

### Q: Bagaimana kalau sistem down saat checkout?

**A:**
- Customer dapat error message
- Order TIDAK jadi (rollback)
- Customer bisa coba lagi
- Atau WA langsung (fallback)

### Q: Perlu payment gateway gak?

**A:** Untuk fase 1: TIDAK. Masih manual (transfer/COD). Untuk fase 2: Bisa integrate (Midtrans/Xendit).

### Q: Berapa lama proses dari checkout ke order created?

**A:** 2-3 detik! (instant dari sudut pandang customer)

### Q: Apakah bisa bulk import customer lama?

**A:** YA! Bisa import CSV dengan format:
```
name,phone,email,address
Budi,081234567890,budi@email.com,Jl. Sudirman 123
```

---

## Migration Path (Sistem Lama → Baru)

### Step 1: Add API Endpoint
```
✅ Create /api/orders/create-from-checkout
✅ Test dengan Postman/curl
```

### Step 2: Update Checkout Component
```
✅ Integrate API call
✅ Add error handling
✅ Test checkout flow
```

### Step 3: Create Tracking Page
```
✅ Create /track/[orderId] page
✅ Add status timeline
✅ Test with sample orders
```

### Step 4: Enhance Dashboard
```
✅ Add edit capabilities
✅ Add notification buttons
✅ Improve order detail view
```

### Step 5: Test End-to-End
```
✅ Customer checkout → Order created
✅ Tracking page accessible
✅ Dashboard shows order
✅ Edit works
✅ Status updates reflect
```

### Step 6: Deploy & Monitor
```
✅ Deploy to production
✅ Monitor error logs
✅ Gather user feedback
✅ Iterate!
```

---

## Kesimpulan Target System

### ✅ Benefits

| Aspek | Improvement |
|-------|-------------|
| Efisiensi | 90% lebih cepat (5-10 menit → 30 detik) |
| Akurasi | 100% (no typo, auto-populate) |
| Scalability | Unlimited (auto-handle) |
| Customer UX | 10x lebih baik (tracking, konfirmasi) |
| Data Quality | Real-time & akurat |
| Workload | 80% berkurang (no manual input) |

### 🎯 Key Features

1. **Auto-Create Everything** ✅
   - Customer (smart detection)
   - Order (instant)
   
2. **Customer Tracking** ✅
   - No login required
   - Real-time status
   - Order history
   
3. **Editable Data** ✅
   - Flexible untuk nego
   - Update info
   - Rapikan data
   
4. **WhatsApp Integration** ✅
   - Konfirmasi otomatis
   - Quick contact
   
5. **Dashboard Simplified** ✅
   - Less manual work
   - Focus on fulfillment

### 🚀 Future Enhancements

- [ ] Payment gateway integration (Midtrans/Xendit)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Customer account (optional login)
- [ ] Order history for customer
- [ ] Review & rating
- [ ] Loyalty points
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced analytics

---

**Status Dokumentasi:** TARGET SYSTEM (AUTO-CREATE)  
**Terakhir Update:** 27 Januari 2024  
**Previous System:** [CUSTOMERS_ORDERS_CURRENT_SYSTEM.md](CUSTOMERS_ORDERS_CURRENT_SYSTEM.md)  
**Ready for Implementation:** YES 🚀

# Panduan Fitur Customers & Orders - SISTEM SAAT INI (MANUAL)

## 🚨 STATUS: SISTEM MANUAL - WORK IN PROGRESS

Dokumentasi ini menjelaskan **sistem yang sedang berjalan saat ini** di mana semua data customer dan order **dibuat secara MANUAL** oleh pemilik toko.

---

## Daftar Isi
- [Overview](#overview)
- [Alur Checkout Store (Customer)](#alur-checkout-store-customer)
- [Alur Kerja Pemilik Toko (Dashboard)](#alur-kerja-pemilik-toko-dashboard)
- [Sistem Customer](#sistem-customer)
- [Sistem Order](#sistem-order)
- [Kenapa Sistem Ini Kurang Efisien](#kenapa-sistem-ini-kurang-efisien)
- [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Overview

### ⚠️ Apakah Data Customer & Order Otomatis Dibuat?

**TIDAK.** Sistem ini menggunakan **WhatsApp-based checkout**, bukan traditional e-commerce checkout.

| Aspek | Status | Penjelasan |
|-------|--------|------------|
| Customer | **MANUAL** ❌ | Dibuat manual oleh pemilik toko di dashboard |
| Order | **MANUAL** ❌ | Dibuat manual oleh pemilik toko di dashboard |
| WhatsApp Checkout | Hanya kirim pesan | Tidak membuat record di database |

### Kenapa Begini?

Sistem ini dirancang untuk **UMKM Indonesia** yang:
- Lebih familiar dengan WhatsApp untuk komunikasi bisnis
- Butuh fleksibilitas dalam negosiasi harga/pengiriman
- Tidak ingin kompleksitas payment gateway
- Bisa handle manual karena volume order tidak terlalu besar

**TAPI... Sistem ini punya masalah:**
- 🔴 **Kerja ganda:** Customer udah input data, pemilik toko input lagi
- 🔴 **Prone to error:** Salah ketik, lupa catat, data gak konsisten
- 🔴 **Tidak scalable:** Kalau order banyak = cape banget
- 🔴 **Data disconnect:** Customer gak tau status pesanan

---

## Alur Checkout Store (Customer)

### Langkah Customer Berbelanja

```
┌─────────────────────────────────────────────────────────────┐
│  CUSTOMER JOURNEY (dari store page)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Buka store: /store/[nama-toko]                         │
│     Contoh: /store/burgerchina                              │
│                      │                                      │
│                      ▼                                      │
│  2. Lihat produk & tambah ke keranjang                     │
│     atau klik "Pesan via WhatsApp" langsung                │
│                      │                                      │
│                      ▼                                      │
│  3. Klik "Checkout" di keranjang                           │
│                      │                                      │
│                      ▼                                      │
│  4. Isi form checkout:                                      │
│     ├── Nama (wajib)                                       │
│     ├── Nomor WhatsApp (wajib)                             │
│     ├── Alamat Pengiriman (wajib)                          │
│     ├── Pilih Kurir (opsional)                             │
│     ├── Metode Pembayaran (opsional)                       │
│     └── Catatan (opsional)                                 │
│                      │                                      │
│                      ▼                                      │
│  5. Klik "Kirim Pesanan"                                   │
│                      │                                      │
│                      ▼                                      │
│  6. WhatsApp terbuka dengan pesan otomatis                 │
│     berisi detail pesanan                                   │
│                      │                                      │
│                      ▼                                      │
│  7. Customer kirim pesan ke WhatsApp toko                  │
│                                                             │
│  ❌ TIDAK ADA order/customer yang dibuat di database!      │
│  ❌ Data customer HILANG setelah kirim WhatsApp!           │
│  ❌ Pemilik toko harus INPUT ULANG semua data!             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Contoh Pesan WhatsApp yang Dihasilkan

```
Halo, saya ingin memesan:

*Detail Pesanan:*
1. Burger Cheese (2x) - Rp 50.000
2. French Fries (1x) - Rp 15.000

*Subtotal:* Rp 65.000

*Informasi Pengiriman:*
Nama: Budi Santoso
No. WhatsApp: 081234567890
Alamat: Jl. Sudirman No. 123, Jakarta
Kurir: JNE Regular

*Pembayaran:* Transfer Bank BCA

Catatan: Tanpa bawang ya

Terima kasih!
```

**⚠️ Catatan:** Data ini HANYA ada di WhatsApp, tidak tersimpan di database!

---

## Alur Kerja Pemilik Toko (Dashboard)

### Setelah Menerima Pesan WhatsApp

```
┌─────────────────────────────────────────────────────────────┐
│  PEMILIK TOKO WORKFLOW (di dashboard)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Terima pesan WhatsApp dari customer                    │
│     📱 "Halo, saya mau pesan Burger Cheese..."             │
│                      │                                      │
│                      ▼                                      │
│  2. Buka Dashboard → Pelanggan                             │
│     ├── Cari customer by nomor HP                          │
│     ├── Jika ada: langsung ke step 3                       │
│     └── Jika tidak ada: MANUAL INPUT ❌                    │
│         ├── Ketik ulang nama                               │
│         ├── Ketik ulang nomor HP                           │
│         └── Ketik ulang alamat                             │
│                      │                                      │
│                      ▼                                      │
│  3. Buka Dashboard → Pesanan → Buat Pesanan                │
│     ├── Pilih customer (opsional)                          │
│     ├── Atau isi nama & HP langsung (guest order)          │
│     ├── MANUAL INPUT items (ketik ulang!) ❌               │
│     │   └── Tambah produk satu per satu                    │
│     ├── Set metode pembayaran (pilih lagi) ❌              │
│     ├── Set diskon (jika ada)                              │
│     └── Simpan                                             │
│                      │                                      │
│                      ▼                                      │
│  4. Order dibuat dengan status:                            │
│     ├── Order ID: cmkv4uh4c001atzlod9chuhfp (auto)         │
│     ├── Order Number: ORD-20240127-001 (auto)              │
│     ├── Status: PENDING                                    │
│     └── Pembayaran: PENDING                                │
│                      │                                      │
│                      ▼                                      │
│  5. Update status sesuai progress:                         │
│     ├── PENDING → PROCESSING (sedang diproses)             │
│     ├── PROCESSING → COMPLETED (selesai)                   │
│     └── Atau CANCELLED (dibatalkan)                        │
│                      │                                      │
│                      ▼                                      │
│  6. Update status pembayaran:                              │
│     ├── PENDING → PAID (sudah bayar)                       │
│     └── Atau CANCELLED (batal)                             │
│                                                             │
│  ⏰ Total waktu: 5-10 menit per order                      │
│  😫 Prone to error: salah ketik, data gak lengkap          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sistem Customer

### Cara Membuat Customer

**Lokasi:** Dashboard → Pelanggan → Tambah Pelanggan

**Field yang tersedia:**

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Nama | Ya | Nama lengkap customer (ketik manual!) |
| No. HP | Ya | Format: 08xx, 62xx, atau +62xx (ketik manual!) |
| Email | Tidak | Email customer |
| Alamat | Tidak | Alamat lengkap (ketik manual!) |
| Catatan | Tidak | Catatan internal |

### Normalisasi Nomor HP

Sistem otomatis menormalisasi nomor HP:

```
Input: "081234567890"  → Disimpan: "6281234567890"
Input: "81234567890"   → Disimpan: "6281234567890"
Input: "+6281234567890" → Disimpan: "6281234567890"
Input: "628123456789"  → Disimpan: "6281234567890"
```

### Statistik Customer (Otomatis)

Sistem otomatis tracking:

| Field | Update Otomatis |
|-------|-----------------|
| `totalOrders` | +1 saat order dibuat dengan customerId |
| `totalSpent` | +total saat order COMPLETED & PAID |

### View Mode

- **List View:** Tampilan tabel dengan search & pagination
- **Grid View:** Tampilan card dengan avatar

---

## Sistem Order

### Cara Membuat Order

**Lokasi:** Dashboard → Pesanan → Buat Pesanan

### Tipe Order

#### 1. Order dengan Customer (Recommended)
- Pilih customer yang sudah ada
- Statistik customer akan ter-update otomatis
- Bisa lihat history pesanan customer

#### 2. Guest Order
- Tidak pilih customer
- Isi nama & HP langsung di form order
- Tidak ada tracking statistik

### Field Order

| Field | Wajib | Keterangan |
|-------|-------|------------|
| Customer | Tidak | Pilih dari daftar atau kosongkan |
| Nama Guest | Tidak | Jika tanpa customer (ketik manual!) |
| HP Guest | Tidak | Jika tanpa customer (ketik manual!) |
| Items | Ya | Minimal 1 item (pilih manual satu-satu!) |
| Metode Bayar | Tidak | cash, transfer, qris, dll |
| Diskon | Tidak | Dalam rupiah |
| Catatan | Tidak | Catatan internal |

### Order ID & Number

| Field | Format | Contoh |
|-------|--------|--------|
| Order ID | Random CUID | `cmkv4uh4c001atzlod9chuhfp` |
| Order Number | `ORD-YYYYMMDD-XXX` | `ORD-20240127-001` |

**URL Order:**
```
/dashboard/orders/cmkv4uh4c001atzlod9chuhfp
```

### Status Order

```
PENDING ──────► PROCESSING ──────► COMPLETED
    │               │
    │               │
    ▼               ▼
CANCELLED       CANCELLED
```

| Status | Artinya |
|--------|---------|
| PENDING | Baru dibuat, belum diproses |
| PROCESSING | Sedang diproses/dikirim |
| COMPLETED | Selesai |
| CANCELLED | Dibatalkan |

### Status Pembayaran

| Status | Artinya |
|--------|---------|
| PENDING | Belum bayar |
| PAID | Sudah bayar |
| CANCELLED | Batal |

### View Mode

- **List View:** Tampilan tabel dengan filter & sorting
- **Grid View:** Tampilan card dengan status badges

---

## Kenapa Sistem Ini Kurang Efisien

### 🔴 Masalah Utama

#### 1. Double Work (Kerja 2x)
```
Customer isi form checkout → Data hilang
                              ↓
Pemilik toko ketik ulang di dashboard → Cape!
```

#### 2. Prone to Error
- ❌ Salah ketik nama/alamat
- ❌ Nomor HP typo
- ❌ Item order salah jumlah
- ❌ Harga salah input
- ❌ Lupa catat order

#### 3. Tidak Scalable
```
5 order/hari   → 30-50 menit manual input
10 order/hari  → 1-2 jam manual input
50 order/hari  → IMPOSSIBLE! 😵
```

#### 4. Customer Experience Buruk
- ❌ Gak ada konfirmasi order otomatis
- ❌ Gak bisa tracking status
- ❌ Harus tanya via WhatsApp terus

#### 5. Data Disconnect
- Customer udah checkout ≠ Order tercatat
- Statistik gak real-time
- Laporan gak akurat
- Susah analisa penjualan

---

## FAQ & Troubleshooting

### Q: Kenapa order dari checkout tidak masuk ke dashboard?

**A:** Karena checkout WhatsApp hanya mengirim pesan, tidak membuat order di database. Pemilik toko harus **membuat order manual** di dashboard setelah menerima pesan WhatsApp.

**Ini adalah KETERBATASAN sistem saat ini.** Lihat [target pengembangan](CUSTOMERS_ORDERS_TARGET_SYSTEM.md) untuk solusi yang lebih baik.

### Q: Customer sudah checkout tapi tidak ada datanya?

**A:** Normal untuk sistem saat ini. Customer perlu dibuat manual di dashboard. Workflow:
1. Terima pesan WhatsApp
2. Buat customer baru (atau cari jika sudah ada)
3. Buat order dengan customer tersebut

**Catatan:** Ini kerja 2x! Sistem baru akan auto-create.

### Q: Bagaimana jika customer repeat order?

**A:**
1. Cari customer by nomor HP di halaman Pelanggan
2. Klik customer → lihat detail
3. Buat pesanan baru dari detail customer, atau
4. Buat pesanan baru dan pilih customer tersebut

**Tips:** Selalu search by HP dulu sebelum buat customer baru (hindari duplikasi!)

### Q: Order salah input, bagaimana cara edit?

**A:**
- Untuk status: Bisa diubah langsung di preview drawer
- Untuk item/harga: Saat ini belum ada fitur edit order, solusi:
  1. Cancel order yang salah
  2. Buat order baru dengan data yang benar

**Ini alasan kenapa manual input ribet!** 😫

### Q: Bagaimana tracking total belanja customer?

**A:** Otomatis! Saat order dengan customerId:
- Status = COMPLETED
- Payment = PAID

Maka `totalSpent` customer akan bertambah otomatis.

### Q: Bisa hapus customer yang sudah punya order?

**A:** Tergantung implementasi. Biasanya:
- Jika ada order terkait: Tidak bisa hapus (data integrity)
- Solusi: Soft delete atau arsip saja

### Q: Kenapa saya harus input data yang udah customer isi?

**A:** Karena **sistem saat ini belum terintegrasi**. Customer isi di checkout form, tapi data gak masuk database. Jadi harus input manual lagi.

**Solusi:** Tunggu sistem baru yang auto-create! (Lihat dokumentasi target system)

### Q: Berapa lama rata-rata input 1 order?

**A:** 
- Customer baru: **7-10 menit** (buat customer + buat order)
- Customer lama: **5-7 menit** (cuma buat order)
- Kalau salah input: **+5 menit** (cancel & buat ulang)

**Total:** Bisa 15-20 menit jika ada kesalahan!

---

## Kesimpulan Sistem Saat Ini

### ✅ Yang Sudah Berjalan:
1. WhatsApp checkout flow (customer bisa kirim pesan)
2. Manual CRUD customer & order di dashboard
3. Order ID random (aman: `cmkv4uh4c001atzlod9chuhfp`)
4. Statistik customer otomatis
5. Grid/List view untuk customer & order
6. Status tracking manual

### ❌ Yang Masih Kurang:
1. **Tidak ada auto-create** customer/order dari checkout
2. **Data disconnect** antara checkout dan dashboard
3. **Manual input** semua data (cape & error-prone)
4. **Tidak scalable** untuk volume tinggi
5. **Customer experience** kurang baik (no tracking)

---

## 🎯 Next Step

Lihat dokumentasi target system untuk pengembangan selanjutnya:

📄 **[CUSTOMERS_ORDERS_TARGET_SYSTEM.md](CUSTOMERS_ORDERS_TARGET_SYSTEM.md)**

Target system akan menghilangkan semua masalah di atas dengan **auto-create** customer & order dari checkout!

---

## File Terkait (untuk Developer)

### Frontend (Client)

| File | Fungsi |
|------|--------|
| `src/app/store/[slug]/page.tsx` | Halaman store |
| `src/components/store/whatsapp-checkout-dialog.tsx` | Dialog checkout WhatsApp |
| `src/components/store/cart-sheet.tsx` | Keranjang belanja |
| `src/app/(dashboard)/dashboard/customers/page.tsx` | Halaman customers |
| `src/app/(dashboard)/dashboard/orders/page.tsx` | Halaman orders |
| `src/components/customers/customers-grid.tsx` | Grid view customers |
| `src/components/orders/orders-grid.tsx` | Grid view orders |

### Backend (Server)

| File | Fungsi |
|------|--------|
| `src/customers/customers.service.ts` | Logic CRUD customer |
| `src/orders/orders.service.ts` | Logic CRUD order |
| `prisma/schema.prisma` | Database schema |

### API Endpoints

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/customers` | List customers |
| POST | `/customers` | Create customer |
| PATCH | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |
| GET | `/orders` | List orders |
| POST | `/orders` | Create order |
| PATCH | `/orders/:id/status` | Update order status |
| PATCH | `/orders/:id/payment-status` | Update payment status |

---

**Status Dokumentasi:** SISTEM SAAT INI (MANUAL)  
**Terakhir Update:** 27 Januari 2024  
**Target Migrasi:** Lihat CUSTOMERS_ORDERS_TARGET_SYSTEM.md

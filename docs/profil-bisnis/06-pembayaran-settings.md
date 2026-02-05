# Pembayaran (Payment) Settings - Dokumentasi

## 📍 Lokasi File
**Path**: `app/client/src/app/settings/pembayaran/page.tsx`

**Access**: Standalone page (DEFAULT redirect dari `/settings`)

**Sidebar Menu**: "Pembayaran" (icon: 💳)

---

## 🎯 Tujuan Halaman

Halaman ini untuk mengatur **metode pembayaran** yang tersedia di toko, termasuk:
- Mata uang transaksi
- Tarif pajak (tax rate)
- Rekening bank
- E-wallet (OVO, GoPay, DANA, dll)
- Cash on Delivery (COD)

Ini adalah **halaman wajib** yang harus dikonfigurasi sebelum toko bisa menerima pesanan.

---

## 📋 Form Fields

### Section 1: Mata Uang & Pajak

| # | Field | Tipe Input | Required | Default | Keterangan |
|---|-------|-----------|----------|---------|------------|
| 1 | **Mata Uang** | `Select` dropdown | ❌ Tidak | `IDR` | Pilihan: IDR, USD, SGD, MYR<br/>💡 Akan ditampilkan di semua harga produk |
| 2 | **Tarif Pajak (%)** | `Input` (number) | ❌ Tidak | `0` | Range: 0-100<br/>💡 Contoh: 11 untuk PPN 11%<br/>Ditampilkan di checkout sebagai line item |

---

### Section 2: Rekening Bank

**Dynamic List** dengan CRUD operations via Dialog

| Sub-Field | Tipe | Required | Keterangan |
|-----------|------|----------|------------|
| **Nama Bank** | `Select` dropdown | ✅ Ya | Pilihan: BCA, Mandiri, BNI, BRI, BSI, CIMB, Permata, Danamon, Other |
| **Nomor Rekening** | `Input` (text) | ✅ Ya | Contoh: "1234567890"<br/>💡 Validasi: hanya angka |
| **Atas Nama** | `Input` (text) | ✅ Ya | Nama pemilik rekening<br/>Contoh: "PT Toko Bunga Mawar" |
| **Enabled** | `Switch` toggle | - | Status aktif/nonaktif<br/>Hanya rekening aktif yang muncul di checkout |

**Dialog Actions**:
- ➕ Tambah Rekening Baru
- ✏️ Edit Rekening
- 🗑️ Hapus Rekening
- 🔄 Toggle Enabled/Disabled

---

### Section 3: E-Wallet

**Dynamic List** dengan CRUD operations via Dialog

| Sub-Field | Tipe | Required | Keterangan |
|-----------|------|----------|------------|
| **Provider** | `Select` dropdown | ✅ Ya | Pilihan: GoPay, OVO, DANA, ShopeePay, LinkAja, Other |
| **Nomor** | `Input` (text) | ✅ Ya | Nomor e-wallet<br/>Contoh: "081234567890"<br/>💡 Biasanya sama dengan nomor HP |
| **Nama Pemilik** | `Input` (text) | ❌ Tidak | Nama pemilik e-wallet (opsional)<br/>Contoh: "Budi Santoso" |
| **Enabled** | `Switch` toggle | - | Status aktif/nonaktif<br/>Hanya e-wallet aktif yang muncul di checkout |

**Dialog Actions**:
- ➕ Tambah E-Wallet Baru
- ✏️ Edit E-Wallet
- 🗑️ Hapus E-Wallet
- 🔄 Toggle Enabled/Disabled

---

### Section 4: Cash on Delivery (COD)

| # | Field | Tipe Input | Required | Default | Keterangan |
|---|-------|-----------|----------|---------|------------|
| 1 | **Aktifkan COD** | `Switch` toggle | ❌ Tidak | `false` | Enable/disable bayar di tempat |
| 2 | **Catatan COD** | `Input` (text) | ❌ Tidak | - | Muncul jika COD aktif<br/>Contoh: "Bayar cash saat terima barang"<br/>atau "Hanya untuk area Jakarta" |

---

## 🔌 API Integration

### Request Body (Contoh)

```json
{
  "currency": "IDR",
  "taxRate": 11,
  "paymentMethods": {
    "bankAccounts": [
      {
        "id": "bank_001",
        "bank": "BCA",
        "accountNumber": "1234567890",
        "accountName": "PT Toko Bunga Mawar",
        "enabled": true
      },
      {
        "id": "bank_002",
        "bank": "Mandiri",
        "accountNumber": "9876543210",
        "accountName": "PT Toko Bunga Mawar",
        "enabled": false
      }
    ],
    "eWallets": [
      {
        "id": "ewallet_001",
        "provider": "OVO",
        "number": "081234567890",
        "name": "Budi Santoso",
        "enabled": true
      },
      {
        "id": "ewallet_002",
        "provider": "GoPay",
        "number": "081234567890",
        "name": null,
        "enabled": true
      }
    ],
    "cod": {
      "enabled": true,
      "note": "Bayar cash saat terima barang. Hanya untuk area Jakarta."
    }
  }
}
```

### API Endpoint

```
PATCH /api/tenants/{tenantId}
```

### Fields Mapping

| Form Field | API Field Path | Tipe Data |
|-----------|----------------|-----------|
| Mata Uang | `currency` | string (enum) |
| Tarif Pajak | `taxRate` | number (0-100) |
| Rekening Bank | `paymentMethods.bankAccounts[]` | array of objects |
| ↳ Nama Bank | `.bank` | string (enum) |
| ↳ Nomor Rekening | `.accountNumber` | string |
| ↳ Atas Nama | `.accountName` | string |
| ↳ Enabled | `.enabled` | boolean |
| E-Wallet | `paymentMethods.eWallets[]` | array of objects |
| ↳ Provider | `.provider` | string |
| ↳ Nomor | `.number` | string |
| ↳ Nama | `.name` | string (nullable) |
| ↳ Enabled | `.enabled` | boolean |
| COD Enabled | `paymentMethods.cod.enabled` | boolean |
| COD Note | `paymentMethods.cod.note` | string |

---

## 🔄 Alur Data

### Alur CRUD Rekening Bank / E-Wallet

```
1. User klik "Tambah Rekening Bank"
   ↓
2. Dialog/Modal muncul dengan form kosong
   ↓
3. User mengisi:
   - Nama Bank
   - Nomor Rekening
   - Atas Nama
   - Toggle Enabled (default: true)
   ↓
4. User klik "Simpan" di dialog
   ↓
5. Validasi (semua field required terisi?)
   ↓
6. Generate unique ID (bank_xxx atau ewallet_xxx)
   ↓
7. Tambahkan ke array state (bankAccounts atau eWallets)
   ↓
8. Close dialog
   ↓
9. User klik "Simpan" di halaman utama
   ↓
10. tenantsApi.update(tenantId, { paymentMethods })
   ↓
11. Backend menyimpan ke database
   ↓
12. useTenant().refresh()
   ↓
13. Toast notification
```

### Alur Edit

```
1. User klik icon Edit pada item
   ↓
2. Dialog muncul dengan data item yang dipilih (pre-filled)
   ↓
3. User ubah data
   ↓
4. User klik "Simpan"
   ↓
5. Update item di array state
   ↓
6. Close dialog
   ↓
7. User klik "Simpan" di halaman utama
   ↓
8. API call → Backend → Refresh
```

### Alur Delete

```
1. User klik icon Hapus
   ↓
2. Confirmation dialog: "Yakin hapus rekening BCA?"
   ↓
3. User confirm
   ↓
4. Remove item dari array state
   ↓
5. User klik "Simpan" di halaman utama
   ↓
6. API call → Backend → Refresh
```

---

## ✅ Validasi

### Client-Side Validation

```javascript
// Validasi Currency
const validCurrencies = ['IDR', 'USD', 'SGD', 'MYR'];
if (!validCurrencies.includes(currency)) {
  toast.error('Mata uang tidak valid');
  return;
}

// Validasi Tax Rate
if (taxRate < 0 || taxRate > 100) {
  toast.error('Tarif pajak harus antara 0-100%');
  return;
}

// Validasi Rekening Bank
bankAccounts.forEach((account, index) => {
  if (!account.bank) {
    toast.error(`Nama bank rekening #${index + 1} harus dipilih`);
    return;
  }
  
  if (!account.accountNumber || account.accountNumber.trim() === '') {
    toast.error(`Nomor rekening #${index + 1} harus diisi`);
    return;
  }
  
  // Validasi hanya angka untuk nomor rekening
  if (!/^\d+$/.test(account.accountNumber)) {
    toast.error(`Nomor rekening #${index + 1} hanya boleh berisi angka`);
    return;
  }
  
  if (!account.accountName || account.accountName.trim() === '') {
    toast.error(`Nama pemilik rekening #${index + 1} harus diisi`);
    return;
  }
});

// Validasi E-Wallet
eWallets.forEach((wallet, index) => {
  if (!wallet.provider || wallet.provider.trim() === '') {
    toast.error(`Provider e-wallet #${index + 1} harus diisi`);
    return;
  }
  
  if (!wallet.number || wallet.number.trim() === '') {
    toast.error(`Nomor e-wallet #${index + 1} harus diisi`);
    return;
  }
  
  // Validasi format nomor HP (untuk e-wallet)
  if (!/^(08|628)\d{8,11}$/.test(wallet.number)) {
    toast.warning(`Nomor e-wallet #${index + 1} sebaiknya format: 08xxx atau 628xxx`);
  }
});

// Validasi minimal 1 metode pembayaran aktif
const hasActivePayment = 
  bankAccounts.some(acc => acc.enabled) ||
  eWallets.some(w => w.enabled) ||
  cod.enabled;

if (!hasActivePayment) {
  toast.error('Minimal harus ada 1 metode pembayaran yang aktif');
  return;
}
```

### Business Rules

1. **Currency**: Harus salah satu dari enum yang valid
2. **Tax Rate**: 0-100, default 0 (tidak ada pajak)
3. **Minimal 1 metode pembayaran aktif**: Bank ATAU E-Wallet ATAU COD
4. **Nomor Rekening**: Hanya angka, tidak boleh ada spasi/karakter lain
5. **E-Wallet Number**: Biasanya nomor HP, validasi format Indonesia (08xxx atau 628xxx)
6. **Duplicate Prevention**: Tidak boleh ada 2 rekening dengan nomor yang sama

---

## 💡 Best Practices

### Bank Account Configuration

**Nama Bank - Gunakan Nama Resmi**:
```
✅ BAIK:
"BCA" (bukan "Bank Central Asia")
"Mandiri"
"BNI"
"BRI"

❌ HINDARI:
"Bank BCA" (redundant)
"bca" (lowercase, kurang profesional)
"Bank Central Asia" (terlalu panjang)
```

**Nomor Rekening**:
```
✅ BAIK:
"1234567890" (hanya angka)

❌ HINDARI:
"1234-5678-90" (ada separator)
"1234 5678 90" (ada spasi)
"BCA 1234567890" (ada prefix)
```

**Atas Nama**:
```
✅ BAIK:
"PT Toko Bunga Mawar"
"Budi Santoso"

Tips:
- Gunakan nama yang SAMA dengan di buku tabungan
- Untuk PT/CV, tulis lengkap dengan badan hukumnya
- Untuk perorangan, tulis nama lengkap (sesuai KTP)
```

---

### E-Wallet Best Practices

**Provider Options**:
```
Popular di Indonesia:
1. OVO
2. GoPay
3. DANA
4. ShopeePay
5. LinkAja

Others:
6. Jenius Pay
7. i.saku
8. Sakuku
```

**Nomor E-Wallet**:
```
Format Indonesia:
08XXXXXXXXXX  (contoh: 081234567890)
628XXXXXXXXX  (contoh: 6281234567890)

✅ BAIK:
"081234567890"
"6281234567890"

❌ HINDARI:
"+6281234567890" (ada tanda +)
"0812-3456-7890" (ada separator)
```

**Pro Tip**: 
Gunakan nomor yang SAMA untuk semua e-wallet (jika memungkinkan) untuk memudahkan customer dan reduce confusion.

---

### COD (Cash on Delivery) Guidelines

**Kapan Enable COD?**
```
✅ Enable jika:
- Toko punya tim delivery sendiri
- Area delivery terbatas (bisa control)
- Produk tidak terlalu mahal (risk rendah)
- Target market prefer cash payment

❌ Disable jika:
- Toko online only (dropship)
- Produk high-value (risk tinggi)
- Area delivery luas (sulit verify)
- Sering ada customer yang cancel setelah barang sampai
```

**Catatan COD yang Efektif**:
```
✅ BAIK:
"Bayar cash saat terima barang. Hanya untuk Jakarta & Tangerang."
"COD tersedia dengan minimal pembelian Rp 100.000"
"Siapkan uang pas untuk mempercepat proses"

❌ HINDARI:
"COD tersedia" (kurang detail)
"Bayar di tempat" (terlalu singkat, tidak ada terms)
```

---

## 🎯 Display di Checkout

### Tampilan untuk Customer

**Step 1: Pilih Metode Pembayaran**
```
┌─────────────────────────────────────┐
│ 💳 Transfer Bank                    │
│ ○ BCA - 1234567890                  │
│   a.n PT Toko Bunga Mawar           │
│                                     │
│ ○ Mandiri - 9876543210              │
│   a.n PT Toko Bunga Mawar           │
│                                     │
│ 💸 E-Wallet                         │
│ ○ OVO - 081234567890                │
│ ○ GoPay - 081234567890              │
│                                     │
│ 💰 Cash on Delivery                 │
│ ○ Bayar cash saat terima barang     │
│   Hanya untuk area Jakarta          │
└─────────────────────────────────────┘
```

**Step 2: Instruksi Pembayaran** (jika pilih Transfer Bank)
```
┌─────────────────────────────────────┐
│ Instruksi Pembayaran Transfer Bank  │
│                                     │
│ 1. Transfer ke rekening:            │
│    BCA 1234567890                   │
│    a.n PT Toko Bunga Mawar          │
│                                     │
│ 2. Total yang harus dibayar:        │
│    Rp 550.000                       │
│    (Subtotal Rp 500.000 + PPN 11%)  │
│                                     │
│ 3. Upload bukti transfer            │
│    [Choose File]                    │
│                                     │
│ 4. Pesanan diproses setelah         │
│    pembayaran terverifikasi         │
└─────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Masalah Umum

**1. "Tidak ada metode pembayaran yang tersedia" di checkout**
```
Cek:
- Apakah ada minimal 1 metode yang enabled?
- Apakah data sudah tersimpan? (klik "Simpan" di halaman settings)
- Apakah tenant data ter-refresh? (coba reload halaman)
```

**2. Rekening baru tidak muncul di list**
```
Cek:
- Apakah sudah klik "Simpan" di dialog?
- Apakah sudah klik "Simpan" di halaman utama?
- Apakah toggle "Enabled" dalam status ON?
```

**3. Tidak bisa hapus rekening**
```
Cek:
- Apakah ini rekening terakhir yang enabled?
- Sistem prevent delete jika hanya tersisa 1 metode pembayaran aktif
Solusi: Enable metode lain terlebih dahulu, baru hapus
```

**4. Customer complain nomor rekening salah**
```
Double-check:
- Login ke internet banking, verifikasi nomor rekening
- Pastikan tidak ada typo atau digit yang kurang/lebih
- Test transfer kecil (Rp 10.000) untuk memastikan
```

**5. E-wallet payment tidak masuk**
```
Cek:
- Apakah nomor e-wallet benar dan aktif?
- Apakah customer transfer ke nomor yang tepat?
- Beberapa e-wallet punya limit transaksi per hari
- Customer harus screenshot bukti transfer
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
- Payment methods: 2 columns (Bank Accounts | E-Wallets)
- Dialog: Medium width (max-w-md)
- Table view untuk list rekening

### Tablet (768px - 1024px)
- Payment methods: Stack vertical
- Dialog: Medium width

### Mobile (< 768px)
- Payment methods: Full width, stack vertical
- Dialog: Full width with padding
- Card view (bukan table) untuk list rekening
- Large buttons untuk add/edit/delete

---

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan:

1. **Payment Gateway Integration** (Midtrans, Xendit, Doku)
   - Auto-verify payment
   - Credit card support
   - Installment payment

2. **QR Code Generation** untuk transfer bank
   - Generate QRIS code
   - Customer scan & pay instantly

3. **Auto-reconciliation** bank statements
   - Upload bank statement CSV
   - Auto-match payments dengan orders

4. **Multi-Currency Support** (enhanced)
   - Real-time exchange rates
   - Display prices in customer's currency

5. **Payment Reminders** automation
   - Auto email/WhatsApp reminder jika belum bayar dalam 24 jam

6. **Installment Payment** (cicilan 0%)
   - Integration dengan fintech (Kredivo, Akulaku)

7. **Crypto Payment** (for specific markets)
   - Bitcoin, USDT, etc.

8. **Payment Analytics Dashboard**
   - Most popular payment method
   - Payment success rate
   - Average payment time

9. **Split Payment**
   - Customer bisa bayar sebagian dulu (DP)

10. **Bulk Payment Verification**
    - Upload multiple payment proofs at once
    - Bulk approve/reject

---

## 📊 Payment Method Statistics

### Indonesia Market Trends (2024-2025)

```
1. E-Wallet: 45%
   - GoPay: 18%
   - OVO: 15%
   - DANA: 12%

2. Bank Transfer: 35%
   - BCA: 15%
   - Mandiri: 10%
   - BRI: 5%
   - BNI: 5%

3. COD: 15%
   (mostly for low-ticket items)

4. Payment Gateway (CC/Debit): 5%
```

**Rekomendasi**:
- **Wajib**: Minimal 1 bank transfer (BCA/Mandiri) + 1 e-wallet (GoPay/OVO)
- **Optional**: COD untuk area terbatas
- **Future**: Payment gateway untuk scale up

---

## 📝 Checklist Before Go-Live

**Payment Methods Setup**:
- [ ] Minimal 2 metode pembayaran aktif (1 bank + 1 e-wallet, atau 1 bank + COD)
- [ ] Semua nomor rekening sudah diverifikasi (test transfer)
- [ ] Semua nomor e-wallet aktif dan bisa terima transaksi
- [ ] Nama pemilik rekening/e-wallet sesuai dengan dokumen resmi
- [ ] COD note jelas (jika COD enabled)

**Technical**:
- [ ] Currency sudah benar (IDR untuk Indonesia)
- [ ] Tax rate sudah sesuai regulasi (11% untuk PPN di Indonesia)
- [ ] Payment instructions jelas di checkout page
- [ ] Upload bukti transfer working (jika manual transfer)
- [ ] Email notification untuk payment confirmation working

**Policy & Legal**:
- [ ] Terms & conditions mencantumkan payment policy
- [ ] Refund policy jelas (jika ada)
- [ ] Privacy policy mention payment data security

---

## 💳 Payment Security Best Practices

### Data Security

```javascript
// NEVER store sensitive payment data di frontend
❌ DON'T:
localStorage.setItem('card_number', cardNumber);
setState({ cvv: '123' });

✅ DO:
// Only store reference/token
setState({ paymentMethodId: 'pm_xyz123' });
```

### PCI-DSS Compliance (jika ada credit card)

**Requirement minimal**:
1. Never store CVV/CVC
2. Encrypt card numbers at rest
3. Use HTTPS for all transactions
4. Implement fraud detection
5. Regular security audits

**Recommendation**: 
Gunakan **Payment Gateway** (Midtrans, Stripe, dll) daripada handle credit card sendiri. Mereka sudah PCI-DSS compliant.

---

## 📧 Email Templates

### Email: Menunggu Pembayaran

```
Subject: [Toko XYZ] Menunggu Pembayaran - Order #12345

Halo {nama_customer},

Terima kasih sudah berbelanja di {nama_toko}!

Order Anda #12345 sedang menunggu pembayaran.

Detail Pembayaran:
- Metode: Transfer Bank BCA
- Nomor Rekening: 1234567890
- Atas Nama: PT Toko Bunga Mawar
- Total: Rp 550.000

Silakan upload bukti transfer di:
{link_upload}

Atau balas email ini dengan attachment bukti transfer.

Pesanan akan diproses setelah pembayaran terverifikasi 
(maksimal 2x24 jam).

Terima kasih,
Tim {nama_toko}
```

### Email: Pembayaran Terkonfirmasi

```
Subject: [Toko XYZ] Pembayaran Diterima - Order #12345

Halo {nama_customer},

Pembayaran Anda sudah kami terima! 🎉

Order #12345 sedang diproses dan akan segera dikirim.

Detail Order:
- Total: Rp 550.000
- Status: Sedang Diproses
- Estimasi Pengiriman: 1-3 hari kerja

Track pesanan Anda di:
{link_tracking}

Terima kasih sudah berbelanja!

Tim {nama_toko}
```

---

*Dokumentasi dibuat: Februari 2025*  
*Versi: 1.0*

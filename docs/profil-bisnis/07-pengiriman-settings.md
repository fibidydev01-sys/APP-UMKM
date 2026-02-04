# Pengiriman (Shipping) Settings - Dokumentasi

## 📍 Lokasi File
**Path**: `app/client/src/app/settings/pengiriman/page.tsx`

**Access**: Standalone page

**Sidebar Menu**: "Pengiriman" (icon: 📦)

---

## 🎯 Tujuan Halaman

Halaman ini untuk mengatur **metode pengiriman** yang tersedia di toko, termasuk:
- Batas gratis ongkir (free shipping threshold)
- Ongkos kirim default
- Daftar kurir yang tersedia (JNE, J&T, SiCepat, dll)

Pengaturan ini akan mempengaruhi perhitungan ongkir di halaman checkout.

---

## 📋 Form Fields

### Section 1: Pengaturan Ongkir

| # | Field | Tipe Input | Required | Default | Keterangan |
|---|-------|-----------|----------|---------|------------|
| 1 | **Batas Gratis Ongkir (Rp)** | `Input` (number) | ❌ Tidak | `null` | Minimal pembelian untuk gratis ongkir<br/>💡 Contoh: 200000 (untuk Rp 200.000)<br/>Kosongkan jika tidak ada program gratis ongkir |
| 2 | **Ongkos Kirim Default (Rp)** | `Input` (number) | ❌ Tidak | `0` | Flat rate ongkir untuk semua area<br/>💡 Berlaku jika total < batas gratis ongkir<br/>Kosongkan jika hitung ongkir via API kurir |

---

### Section 2: Kurir Pengiriman

**Toggle List** dengan switch per kurir

| Kurir | Toggle | Catatan Field | Keterangan |
|-------|--------|--------------|------------|
| **JNE** | `Switch` | `Input` (text, opsional) | Jalur Nugraha Ekakurir<br/>Catatan: "REG, YES, OKE tersedia" |
| **J&T Express** | `Switch` | `Input` (text, opsional) | J&T Express<br/>Catatan: "Reguler & Ekonomi" |
| **SiCepat** | `Switch` | `Input` (text, opsional) | SiCepat Ekspres<br/>Catatan: "SIUNTUNG, REG, BEST, HALU" |
| **AnterAja** | `Switch` | `Input` (text, opsional) | AnterAja<br/>Catatan: "Reguler & Same Day (Jakarta)" |
| **Ninja Express** | `Switch` | `Input` (text, opsional) | Ninja Xpress<br/>Catatan: "Standard & Next Day" |
| **Pos Indonesia** | `Switch` | `Input` (text, opsional) | Pos Indonesia<br/>Catatan: "Paket Kilat Khusus" |
| **ID Express** | `Switch` | `Input` (text, opsional) | ID Express<br/>Catatan: "Reguler & Cargo" |
| **Lion Parcel** | `Switch` | `Input` (text, opsional) | Lion Parcel<br/>Catatan: "Regpack & One Day Service" |

**Catatan**:
- **Enabled**: Switch ON = kurir muncul di pilihan checkout
- **Note**: Opsional, untuk info tambahan (layanan tersedia, estimasi, dll)

---

## 🔌 API Integration

### Request Body (Contoh)

```json
{
  "freeShippingThreshold": 200000,
  "defaultShippingCost": 15000,
  "shippingMethods": {
    "couriers": [
      {
        "id": "jne",
        "name": "JNE",
        "enabled": true,
        "note": "REG, YES, OKE tersedia"
      },
      {
        "id": "jnt",
        "name": "J&T Express",
        "enabled": true,
        "note": "Reguler & Ekonomi"
      },
      {
        "id": "sicepat",
        "name": "SiCepat",
        "enabled": false,
        "note": null
      },
      {
        "id": "anteraja",
        "name": "AnterAja",
        "enabled": true,
        "note": "Same Day untuk Jakarta"
      },
      {
        "id": "ninja",
        "name": "Ninja Express",
        "enabled": false,
        "note": null
      }
    ]
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
| Batas Gratis Ongkir | `freeShippingThreshold` | number (nullable) |
| Ongkos Kirim Default | `defaultShippingCost` | number |
| Kurir Pengiriman | `shippingMethods.couriers[]` | array of objects |
| ↳ ID Kurir | `.id` | string |
| ↳ Nama Kurir | `.name` | string |
| ↳ Enabled | `.enabled` | boolean |
| ↳ Catatan | `.note` | string (nullable) |

---

## 🔄 Alur Data

```
1. User mengatur batas gratis ongkir (opsional)
   ↓
2. User mengatur ongkos kirim default (opsional)
   ↓
3. User toggle ON/OFF kurir yang tersedia
   ↓
4. User mengisi catatan per kurir (opsional)
   ↓
5. User klik "Simpan"
   ↓
6. Validasi (minimal 1 kurir aktif, values valid)
   ↓
7. tenantsApi.update(tenantId, shippingData)
   ↓
8. Backend menyimpan ke database
   ↓
9. useTenant().refresh()
   ↓
10. Toast notification
   ↓
11. Shipping options ter-update di checkout
```

---

## ✅ Validasi

### Client-Side Validation

```javascript
// Validasi Free Shipping Threshold
if (freeShippingThreshold !== null && freeShippingThreshold !== '') {
  if (freeShippingThreshold < 0) {
    toast.error('Batas gratis ongkir tidak boleh negatif');
    return;
  }
  
  if (freeShippingThreshold < 50000) {
    toast.warning('Batas gratis ongkir terlalu rendah (< Rp 50.000). Yakin?');
  }
}

// Validasi Default Shipping Cost
if (defaultShippingCost < 0) {
  toast.error('Ongkos kirim default tidak boleh negatif');
  return;
}

// Validasi minimal 1 kurir aktif
const activeCouriers = couriers.filter(c => c.enabled);
if (activeCouriers.length === 0) {
  toast.error('Minimal harus ada 1 kurir yang aktif');
  return;
}

// Warning jika tidak ada gratis ongkir DAN ongkir default = 0
if ((freeShippingThreshold === null || freeShippingThreshold === '') && 
    defaultShippingCost === 0) {
  toast.warning('Ongkir gratis? Pastikan Anda punya strategi pengiriman yang jelas.');
}
```

### Business Rules

1. **Free Shipping Threshold**: Opsional, jika diisi harus > 0
2. **Default Shipping Cost**: Default 0, bisa diisi dengan flat rate
3. **Minimal 1 kurir aktif**: Harus ada minimal 1 kurir yang enabled
4. **Catatan kurir**: Opsional, maksimal 200 karakter

---

## 💡 Best Practices

### Free Shipping Strategy

**Kapan Set Gratis Ongkir?**

```
✅ Set Gratis Ongkir jika:
- Average Order Value (AOV) sekitar Rp 150.000
- Set threshold Rp 200.000 (1.3x AOV)
- Goal: Increase AOV

Contoh:
AOV saat ini: Rp 150.000
Target AOV: Rp 200.000
→ Set gratis ongkir Rp 200.000
→ Customer cenderung beli lebih banyak untuk dapet gratis ongkir

❌ JANGAN Set Gratis Ongkir jika:
- Produk low margin (< 20%)
- Ongkir mahal relatif terhadap harga produk
- Belum punya data tentang AOV

Alternatif:
- Subsidi ongkir (customer bayar Rp 5.000, toko subsidi sisanya)
- Gratis ongkir untuk member/loyalty program
- Gratis ongkir untuk area tertentu saja
```

**Perhitungan Break-Even**:
```
Contoh:
Harga Produk: Rp 100.000
Margin: 30% = Rp 30.000
Ongkir Rata-rata: Rp 15.000

Jika gratis ongkir:
Profit = Rp 30.000 - Rp 15.000 = Rp 15.000 (turun 50%)

Agar tetap profit:
Customer harus beli minimal 2 item
2 x Rp 100.000 = Rp 200.000
Margin = Rp 60.000 - Rp 15.000 = Rp 45.000 ✅

→ Set threshold Rp 200.000
```

---

### Default Shipping Cost Strategy

**3 Pendekatan**:

**1. Flat Rate (Recommended untuk UMKM)**
```
Ongkir sama untuk semua area: Rp 15.000

Pros:
✅ Simple untuk customer (tidak perlu input alamat dulu)
✅ Easy to calculate
✅ Predictable revenue

Cons:
❌ Area jauh subsidi area dekat
❌ Kurang adil
```

**2. Tiered Rate (by Region)**
```
Jakarta: Rp 10.000
Jabodetabek: Rp 15.000
Jawa: Rp 20.000
Luar Jawa: Rp 30.000

Pros:
✅ Lebih fair
✅ Still simple

Cons:
❌ Need region detection
❌ Need UI untuk select region
```

**3. API Integration (Advanced)**
```
Hitung real-time via API kurir (RajaOngkir, dll)

Pros:
✅ Paling akurat
✅ Customer tahu exact ongkir

Cons:
❌ Complex integration
❌ API cost
❌ Dependency on 3rd party
```

**Rekomendasi untuk UMKM**: 
Start dengan **Flat Rate**, upgrade ke **API Integration** setelah GMV > Rp 50 juta/bulan.

---

### Courier Selection Strategy

**Must-Have Couriers** (Pilih minimal 2):
```
1. JNE
   - Coverage: Seluruh Indonesia
   - Reliability: High
   - Cost: Medium-High
   - Use Case: General purpose

2. J&T Express
   - Coverage: Seluruh Indonesia
   - Reliability: Medium-High
   - Cost: Low-Medium
   - Use Case: Budget-friendly

3. SiCepat
   - Coverage: Jawa-Bali-Sumatra
   - Reliability: High
   - Cost: Medium
   - Use Case: Fast delivery

4. AnterAja
   - Coverage: Urban areas (Jakarta, Surabaya, Bandung)
   - Reliability: Medium
   - Cost: Low
   - Use Case: Same-day delivery (Jakarta)
```

**Rekomendasi Kombinasi**:
```
Kombinasi 1 (Budget):
JNE (nationwide) + J&T (cheaper alternative)

Kombinasi 2 (Speed):
JNE (nationwide) + SiCepat (fast for Jawa) + AnterAja (same-day Jakarta)

Kombinasi 3 (Premium):
JNE (YES for urgent) + SiCepat (BEST for premium)
```

---

### Courier Notes Examples

**JNE**:
```
✅ BAIK:
"REG (2-3 hari), YES (1 hari), OKE (3-5 hari ekonomis)"
"Tersedia pengiriman express (YES) dan ekonomis (OKE)"

❌ TERLALU PANJANG:
"JNE adalah kurir terpercaya dengan berbagai layanan termasuk..."
```

**J&T Express**:
```
✅ BAIK:
"Reguler 2-4 hari, Ekonomi 5-7 hari"
"Gratis asuransi hingga Rp 5 juta"
```

**SiCepat**:
```
✅ BAIK:
"REG 2-3 hari, BEST 1-2 hari, SIUNTUNG ekonomis 4-6 hari"
"Same Day tersedia Jakarta-Tangerang-Bekasi"
```

**AnterAja**:
```
✅ BAIK:
"Same Day delivery untuk Jakarta (order sebelum jam 12 siang)"
"Reguler 2-4 hari"
```

---

## 🎯 Shipping Logic di Checkout

### Contoh Flow

```javascript
// 1. Customer cart total
const cartTotal = 180000; // Rp 180.000

// 2. Check free shipping
const freeShippingThreshold = 200000; // Rp 200.000
const defaultShippingCost = 15000; // Rp 15.000

let shippingCost = 0;

if (freeShippingThreshold && cartTotal >= freeShippingThreshold) {
  shippingCost = 0; // GRATIS ONGKIR
  showBadge('🎉 Gratis Ongkir!');
} else {
  shippingCost = defaultShippingCost;
  
  // Show message: "Belanja Rp 20.000 lagi untuk gratis ongkir!"
  const remaining = freeShippingThreshold - cartTotal;
  if (remaining > 0 && remaining < 50000) {
    showMessage(`Belanja Rp ${formatCurrency(remaining)} lagi untuk gratis ongkir!`);
  }
}

// 3. Display available couriers
const activeCouriers = couriers.filter(c => c.enabled);

// 4. Calculate final total
const subtotal = cartTotal;
const tax = subtotal * (taxRate / 100);
const total = subtotal + tax + shippingCost;
```

### UI Checkout - Shipping Section

```
┌─────────────────────────────────────────────┐
│ 📦 Pilih Kurir Pengiriman                   │
│                                             │
│ ○ JNE - Rp 15.000                           │
│   REG (2-3 hari), YES (1 hari), OKE (3-5)   │
│                                             │
│ ○ J&T Express - Rp 12.000                   │
│   Reguler 2-4 hari, Ekonomi 5-7 hari        │
│                                             │
│ ○ SiCepat - Rp 13.000                       │
│   REG 2-3 hari, BEST 1-2 hari               │
│                                             │
│ ○ AnterAja - Rp 25.000                      │
│   Same Day Jakarta (order < 12pm)           │
│                                             │
│ 💡 Belanja Rp 20.000 lagi untuk             │
│    GRATIS ONGKIR se-Indonesia! 🎉           │
└─────────────────────────────────────────────┘

Order Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:        Rp 180.000
Ongkir (JNE):    Rp  15.000
PPN 11%:         Rp  21.450
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:           Rp 216.450
```

---

## 🔧 Troubleshooting

### Masalah Umum

**1. "Tidak ada kurir yang tersedia" di checkout**
```
Cek:
- Apakah ada minimal 1 kurir yang enabled?
- Apakah data sudah tersimpan? (klik "Simpan")
- Apakah tenant data ter-refresh?
- Cek console browser untuk error
```

**2. Gratis ongkir tidak terapply meski sudah melebihi threshold**
```
Cek:
- Apakah freeShippingThreshold terisi dengan nilai yang benar?
- Apakah cart total sudah include semua items?
- Apakah ada bug di frontend calculation?

Debug:
console.log('Cart Total:', cartTotal);
console.log('Threshold:', freeShippingThreshold);
console.log('Is Free?', cartTotal >= freeShippingThreshold);
```

**3. Ongkir terlalu mahal, customer komplain**
```
Solusi:
- Review default shipping cost (mungkin terlalu tinggi?)
- Pertimbangkan subsidi ongkir untuk customer baru
- Tawarkan gratis ongkir dengan minimum purchase
- Gunakan kurir yang lebih murah (J&T, SiCepat)
```

**4. Customer bingung pilih kurir mana**
```
Solusi:
- Tambahkan catatan yang jelas per kurir (estimasi, harga)
- Highlight "Rekomendasi" untuk kurir terpopuler
- Group by speed: "Express (1-2 hari)", "Regular (2-4 hari)", "Ekonomis (5-7 hari)"
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
- Courier list: 2 columns
- Large radio buttons
- Full courier notes visible

### Tablet (768px - 1024px)
- Courier list: 2 columns
- Medium radio buttons

### Mobile (< 768px)
- Courier list: 1 column, stack vertical
- Large touch-friendly radio buttons
- Truncate long courier notes with "Lihat detail"
- Sticky "Lanjut Pembayaran" button

---

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan:

1. **API Integration** dengan RajaOngkir / Shipper / Biteship
   - Real-time shipping cost calculation
   - Accurate ETD (Estimated Time of Delivery)
   - Auto-select cheapest courier

2. **Multi-Origin Shipping**
   - Support multiple warehouses/stores
   - Calculate shipping from nearest location

3. **Free Shipping Vouchers**
   - Generate promo codes untuk gratis ongkir
   - Time-limited atau customer-specific

4. **Shipping Insurance**
   - Optional insurance untuk high-value items
   - Auto-calculate insurance fee

5. **Tracking Integration**
   - Real-time tracking via API kurir
   - Auto-update order status based on tracking

6. **Shipping Label Generation**
   - Auto-generate shipping labels
   - Print batch labels for multiple orders

7. **COD Integration**
   - COD fee configuration
   - COD limit per area

8. **International Shipping**
   - Support DHL, FedEx, UPS
   - Customs declaration form

9. **Same-Day/Next-Day Filters**
   - Let customer filter by delivery speed
   - Auto-suggest fastest option

10. **Shipping Analytics**
    - Most popular courier
    - Average shipping cost
    - Free shipping conversion impact

---

## 📊 Shipping Metrics to Track

### Key Metrics

```javascript
1. Average Shipping Cost
   = Total Shipping Revenue / Total Orders
   
   Benchmark:
   - Low: < 5% of AOV
   - Medium: 5-10% of AOV
   - High: > 10% of AOV (reconsider strategy)

2. Free Shipping Conversion Rate
   = Orders with Free Shipping / Total Orders
   
   Good: > 30%
   If < 30%: Lower threshold or promote better

3. Cart Abandonment at Shipping
   = Users who left at shipping page / Total checkouts
   
   If > 20%: Shipping cost might be too high

4. Courier Preference
   JNE: 40%
   J&T: 35%
   SiCepat: 15%
   Others: 10%
   
   → Focus on most popular couriers

5. Delivery Success Rate
   = Successfully delivered / Total shipped
   
   Target: > 95%
   If < 95%: Review courier reliability
```

---

## 📋 Checklist Before Go-Live

**Shipping Setup**:
- [ ] Minimal 2 kurir aktif (untuk backup jika 1 bermasalah)
- [ ] Ongkir default sudah di-set (jika tidak pakai API)
- [ ] Free shipping threshold di-set (jika ada program gratis ongkir)
- [ ] Catatan per kurir jelas dan informatif
- [ ] Test checkout flow sampai selesai

**Strategy**:
- [ ] Shipping cost calculation sudah akurat
- [ ] Free shipping threshold profitable (tidak rugi)
- [ ] Courier coverage mencakup target market Anda
- [ ] Ada backup courier jika courier utama bermasalah

**Technical**:
- [ ] Shipping cost ter-display jelas di checkout
- [ ] Free shipping badge muncul jika applicable
- [ ] Mobile-friendly (radio buttons cukup besar)
- [ ] Error handling jika API kurir down (fallback ke default)

**Communication**:
- [ ] Shipping policy jelas di halaman FAQ/Help
- [ ] Estimasi pengiriman realistic (jangan over-promise)
- [ ] Tracking info provided after shipped
- [ ] Customer support ready untuk shipping issues

---

## 💰 Shipping Cost Optimization

### Tips Reduce Shipping Cost

**1. Negotiate with Couriers**
```
Jika volume > 100 orders/bulan:
- Hubungi account manager JNE/J&T/SiCepat
- Minta corporate rate (bisa diskon 10-30%)
- Commit minimum volume per bulan
```

**2. Optimize Packaging**
```
- Use smaller boxes → lighter weight → cheaper
- Standardize box sizes untuk efficiency
- Nego dengan supplier packaging untuk bulk order
```

**3. Dropship from Supplier**
```
Jika produk dari supplier:
- Minta supplier kirim langsung ke customer
- Anda bayar ongkir dari supplier, bukan dari toko Anda
- Could save 30-50% shipping cost
```

**4. Bulk Shipping**
```
Jika ada multiple orders ke area sama:
- Kirim dalam 1 batch
- Split cost antar orders
```

**5. Regional Warehouses** (Advanced)
```
Jika 60% customer dari Jakarta:
- Buka mini warehouse di Jakarta
- Ship dari Jakarta untuk Jakarta customers
- Much cheaper than from Surabaya/Bandung
```

---

## 📧 Customer Communication

### Email: Pesanan Dikirim

```
Subject: [Toko XYZ] Pesanan Anda Dikirim! 📦

Halo {nama_customer},

Kabar baik! Pesanan Anda sudah dikirim! 🎉

Detail Pengiriman:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Kurir: JNE REG
No. Resi: 1234567890123
Estimasi Tiba: 2-3 hari kerja
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Track pesanan Anda:
{link_tracking_jne}

Atau cek status di:
{link_order_status_website}

Jika ada kendala, hubungi kami di:
WhatsApp: {whatsapp}

Terima kasih sudah berbelanja!

Tim {nama_toko}
```

---

*Dokumentasi dibuat: Februari 2025*  
*Versi: 1.0*

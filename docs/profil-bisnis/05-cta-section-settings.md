# CTA (Call to Action) Section Settings - Dokumentasi

## 📍 Lokasi File
**Path**: `app/client/src/app/settings/cta/page.tsx`

**Dual Access**:
1. **Standalone Route**: `/settings/cta` (dengan tombol Kembali)
2. **Tab di Toko**: `/settings/toko` → Tab "CTA" (dengan Drawer preview)

---

## 🎯 Tujuan Halaman

Halaman ini untuk mengatur **section Call to Action (CTA)** pada landing page. CTA adalah bagian terakhir sebelum footer yang **mendorong pengunjung untuk mengambil aksi** (beli produk, hubungi toko, daftar newsletter, dll). CTA yang efektif bisa meningkatkan conversion rate secara signifikan.

---

## 📋 Form Fields

### Tabel Field Details

| # | Field | Tipe Input | Required | Default | Keterangan |
|---|-------|-----------|----------|---------|------------|
| 1 | **Judul CTA** | `Input` (text) | ❌ Tidak | "Siap Memulai?" | Heading utama CTA section<br/>💡 Gunakan pertanyaan atau pernyataan yang provokatif |
| 2 | **Subtitle CTA** | `Input` (text) | ❌ Tidak | - | Sub-heading yang menjelaskan value proposition<br/>Contoh: "Bergabung dengan ribuan pelanggan puas kami" |
| 3 | **Teks Tombol** | `Input` (text) | ❌ Tidak | "Mulai Sekarang" | Label pada tombol CTA<br/>💡 Action-oriented, 2-4 kata |
| 4 | **Link Tombol** | `Input` (text) | ❌ Tidak | "/products" | URL tujuan saat tombol diklik<br/>Bisa internal (/products) atau eksternal (https://...) |
| 5 | **Gaya Tombol** | `Select` dropdown | ❌ Tidak | "Primary" | Pilihan: Primary, Secondary, Outline |

---

## 🔌 API Integration

### Request Body (Contoh)

```json
{
  "ctaTitle": "Siap Mempercantik Hari Anda?",
  "ctaSubtitle": "Pesan bunga segar sekarang dan nikmati gratis ongkir se-Jakarta",
  "ctaButtonText": "Lihat Produk",
  "ctaButtonLink": "/products",
  "ctaButtonStyle": "primary"
}
```

### API Endpoint

```
PATCH /api/tenants/{tenantId}
```

### Fields Mapping

| Form Field | API Field Path | Tipe Data | Enum Values |
|-----------|----------------|-----------|-------------|
| Judul CTA | `ctaTitle` | string | - |
| Subtitle CTA | `ctaSubtitle` | string | - |
| Teks Tombol | `ctaButtonText` | string | - |
| Link Tombol | `ctaButtonLink` | string (URL) | - |
| Gaya Tombol | `ctaButtonStyle` | string (enum) | `primary`, `secondary`, `outline` |

---

## 🎨 Preview Component

**Component**: `Cta1` + Inline Button Preview

**Lokasi Preview**:
- **Standalone page**: Live preview di bawah form + preview tombol inline
- **Tab di Toko**: Drawer preview (slide-out panel)

**Preview menampilkan**:
- Background gradient/solid sesuai tema
- CTA Title (besar, bold, centered)
- CTA Subtitle (medium, centered)
- CTA Button dengan style yang dipilih:
  - **Primary**: Background warna tema, text putih
  - **Secondary**: Background abu-abu, text hitam
  - **Outline**: Border warna tema, background transparan

---

## 🔄 Alur Data

```
1. User mengisi CTA title & subtitle
   ↓
2. User mengatur button text & link
   ↓
3. User memilih button style (Primary/Secondary/Outline)
   ↓
4. Preview ter-update secara real-time (controlled input)
   ↓
5. User klik "Simpan"
   ↓
6. Validasi (semua field opsional, tapi jika ada buttonLink harus valid URL)
   ↓
7. tenantsApi.update(tenantId, ctaData)
   ↓
8. Backend menyimpan ke database
   ↓
9. useTenant().refresh()
   ↓
10. Toast notification
   ↓
11. Preview di landing page ter-update
```

---

## ✅ Validasi

### Client-Side Validation

```javascript
// Semua field opsional, tapi jika diisi harus valid

// Validasi URL (jika diisi)
if (ctaButtonLink && ctaButtonLink.trim() !== '') {
  // Internal link (dimulai dengan /)
  if (ctaButtonLink.startsWith('/')) {
    // Valid internal link
  } 
  // External link (harus HTTPS)
  else if (ctaButtonLink.startsWith('http://') || ctaButtonLink.startsWith('https://')) {
    // Valid external link
  } 
  else {
    toast.error('Link tombol harus dimulai dengan "/" (internal) atau "https://" (external)');
    return;
  }
}

// Validasi panjang teks tombol (UI concern)
if (ctaButtonText && ctaButtonText.length > 25) {
  toast.warning('Teks tombol terlalu panjang. Maksimal 25 karakter untuk tampilan optimal.');
}

// Validasi button style (harus salah satu dari enum)
const validStyles = ['primary', 'secondary', 'outline'];
if (ctaButtonStyle && !validStyles.includes(ctaButtonStyle)) {
  toast.error('Gaya tombol tidak valid');
  return;
}
```

### Business Rules

1. **Semua field CTA opsional**: Jika tidak diisi, section CTA tidak ditampilkan di landing page
2. **Button Link**: Bisa internal (`/products`, `/about`) atau external (`https://wa.me/...`)
3. **Button Text**: Ideal 2-4 kata, maksimal 25 karakter
4. **Button Style**: Harus salah satu dari `primary`, `secondary`, atau `outline`

---

## 💡 Best Practices

### CTA Title Guidelines

**Formula yang Efektif**:
```
1. PERTANYAAN (Question)
   "Siap Memulai?"
   "Masih Ragu?"
   "Ingin Tahu Lebih Lanjut?"

2. URGENSI (Urgency)
   "Jangan Lewatkan Penawaran Ini!"
   "Stok Terbatas, Pesan Sekarang!"
   "Promo Berakhir Besok!"

3. VALUE PROPOSITION (Benefit)
   "Dapatkan Diskon 20% Hari Ini"
   "Gratis Ongkir Se-Indonesia"
   "Jaminan Uang Kembali 100%"

4. DIRECT CALL (Action)
   "Mulai Belanja Sekarang"
   "Hubungi Kami Hari Ini"
   "Daftar Sekarang Gratis"
```

**Perbandingan**:
```
❌ LEMAH:
"Terima Kasih Sudah Berkunjung"
"Sampai Jumpa Lagi"
"Kembali ke Atas"

✅ KUAT:
"Siap Mempercantik Ruang Anda?"
"Wujudkan Impian Anda Hari Ini"
"Bergabunglah dengan 10,000+ Pelanggan Kami"
```

### CTA Subtitle Guidelines

**Best Practices**:
```
Panjang: 10-20 kata
Fokus: Benefit atau social proof
Tone: Persuasive tapi tidak pushy

✅ BAIK:
"Pesan sekarang dan nikmati gratis konsultasi interior senilai 2 juta rupiah"
"Lebih dari 5,000 pelanggan telah mempercayai kami untuk acara spesial mereka"
"Garansi uang kembali 100% jika produk tidak sesuai harapan"

❌ HINDARI:
"Kami menjual produk berkualitas" (terlalu generic)
"Hubungi kami untuk info lebih lanjut" (tidak ada urgency)
"" (kosong - kurang persuasif)
```

### Button Text Guidelines

**Formula AIDA**:
```
A - Action verb (kata kerja)
I - Immediate (sekarang)
D - Desirable (benefit)
A - Achievable (tidak berlebihan)

Contoh:
"Pesan Sekarang"        → Action + Immediate
"Lihat Koleksi"         → Action
"Mulai Gratis"          → Action + Desirable
"Dapatkan Diskon"       → Action + Desirable
"Hubungi Kami"          → Action
"Coba Sekarang"         → Action + Immediate
```

**Perbandingan**:
```
❌ LEMAH:
"Klik Di Sini"
"Submit"
"OK"
"Selanjutnya"

✅ KUAT:
"Pesan Sekarang"
"Lihat Produk"
"Mulai Belanja"
"Chat WhatsApp"
"Dapatkan Penawaran"
```

---

## 🎯 Button Style Guidelines

### Primary Button
**Kapan digunakan**: 
- Main action (pembelian, kontak, sign up)
- High-priority conversion goal

**Visual**:
- Background: Warna tema utama (sky, emerald, rose, dll)
- Text: Putih
- Efek: Shadow, hover scale up 5%

**Contoh Use Case**:
```
Toko E-commerce → "Beli Sekarang"
Jasa Konsultasi → "Jadwalkan Konsultasi"
SaaS Product → "Coba Gratis 14 Hari"
```

### Secondary Button
**Kapan digunakan**:
- Alternative action (kurang prioritas dari primary)
- Informational action

**Visual**:
- Background: Abu-abu terang (#E5E7EB)
- Text: Hitam (#111827)
- Efek: Hover darkens background

**Contoh Use Case**:
```
Primary: "Beli Sekarang"
Secondary: "Pelajari Lebih Lanjut"

Primary: "Daftar Sekarang"
Secondary: "Lihat Demo"
```

### Outline Button
**Kapan digunakan**:
- Subtle action
- Complement to primary (tidak bersaing)

**Visual**:
- Background: Transparan
- Border: 2px solid warna tema
- Text: Warna tema
- Efek: Hover fills background

**Contoh Use Case**:
```
Primary: "Mulai Belanja"
Outline: "Lihat Katalog"

Primary: "Hubungi Sales"
Outline: "Download Brosur"
```

---

## 🎨 CTA Section Variations

### Variation 1: Simple Centered
```
┌─────────────────────────────────────┐
│                                     │
│         Siap Memulai?               │
│   Bergabung dengan 1000+ pelanggan  │
│                                     │
│         [Pesan Sekarang]            │
│                                     │
└─────────────────────────────────────┘
```

### Variation 2: Split Screen
```
┌──────────────────┬──────────────────┐
│                  │                  │
│  Siap Memulai?   │  [Image/Icon]    │
│  Subtitle here   │                  │
│  [Button]        │                  │
│                  │                  │
└──────────────────┴──────────────────┘
```

### Variation 3: With Stats (Future Enhancement)
```
┌─────────────────────────────────────┐
│         Siap Memulai?               │
│                                     │
│  [5000+]  [4.9★]  [99%]             │
│  Pelanggan Rating Satisfaction      │
│                                     │
│         [Pesan Sekarang]            │
└─────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Masalah Umum

**1. CTA tidak muncul di landing page**
```
Cek:
- Apakah ctaTitle atau ctaButtonText terisi?
- Apakah section CTA di-enable di layout settings?
- Cek console browser untuk error
```

**2. Button link tidak berfungsi**
```
Cek:
- Format URL sudah benar? (/products atau https://...)
- Apakah ada typo di link?
- Untuk external link, harus ada protokol (https://)
```

**3. Button style tidak berubah**
```
Cek:
- Apakah sudah klik "Simpan"?
- Clear cache browser
- Hard refresh (Ctrl+Shift+R)
```

**4. Preview tidak sesuai dengan live site**
```
- Preview menggunakan draft data (sebelum disimpan)
- Setelah "Simpan", tunggu useTenant().refresh() selesai
- Refresh halaman landing untuk lihat perubahan final
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
- CTA Section: Full width dengan padding generous
- Title: Font size 48px (3xl)
- Subtitle: Font size 20px (xl)
- Button: Padding large (px-8 py-4)
- Layout: Centered, max-width 800px

### Tablet (768px - 1024px)
- Title: Font size 36px (2xl)
- Subtitle: Font size 18px (lg)
- Button: Padding medium (px-6 py-3)

### Mobile (< 768px)
- Title: Font size 28px (xl)
- Subtitle: Font size 16px (base)
- Button: Full width, padding medium
- Reduced vertical spacing

---

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan:

1. **Multiple CTAs** (Primary + Secondary button side by side)
2. **Background Image/Gradient** customization
3. **Countdown Timer** untuk urgency (promo ends in X hours)
4. **Social Proof Stats** (5000+ customers, 4.9★ rating)
5. **Micro-animations** (button pulse, fade-in on scroll)
6. **A/B Testing** different CTA variants
7. **Exit-Intent Popup** CTA untuk visitors yang akan leave
8. **Video Background** untuk CTA section
9. **Form Integration** (newsletter signup inline)
10. **Personalization** based on user behavior

---

## 📊 CTA Effectiveness Metrics

### Metrics to Track

```javascript
// Analytics tracking
gtag('event', 'cta_impression', {
  'event_category': 'engagement',
  'event_label': 'landing_page_cta'
});

gtag('event', 'cta_click', {
  'event_category': 'conversion',
  'event_label': ctaButtonText,
  'value': 1
});

// Calculate CTA Click-Through Rate (CTR)
CTR = (CTA Clicks / CTA Impressions) × 100%

// Benchmark:
// Good CTR: > 3%
// Average CTR: 1-3%
// Poor CTR: < 1%
```

### Optimization Tips

**If CTR is low (<1%)**:
1. **Test different CTA copy** (more urgent, more benefit-focused)
2. **Increase button size** (make it more prominent)
3. **Add social proof** (customer count, ratings)
4. **Create urgency** (limited time offer, countdown)
5. **Improve placement** (move CTA higher on page)

**If CTR is good but conversion is low**:
1. **Check landing page** after CTA click (is it relevant?)
2. **Reduce friction** (too many steps to convert?)
3. **Improve value proposition** on next page
4. **Add trust signals** (guarantees, testimonials)

---

## 🎯 Industry-Specific CTA Examples

### E-Commerce Fashion
```
Title: "Tampil Percaya Diri Hari Ini"
Subtitle: "Koleksi terbaru dengan diskon hingga 50% untuk member baru"
Button: "Belanja Sekarang"
Link: /products?sort=new&discount=true
```

### Food & Beverage
```
Title: "Lapar? Pesan Sekarang!"
Subtitle: "Gratis ongkir untuk pemesanan pertama Anda"
Button: "Lihat Menu"
Link: /products/categories/makanan
```

### Jasa Konsultasi
```
Title: "Siap Mengembangkan Bisnis Anda?"
Subtitle: "Konsultasi gratis 30 menit dengan expert kami"
Button: "Jadwalkan Sekarang"
Link: https://calendly.com/yourbusiness
```

### SaaS/Software
```
Title: "Coba Gratis 14 Hari"
Subtitle: "Tidak perlu kartu kredit, aktifkan langsung dalam 2 menit"
Button: "Mulai Sekarang"
Link: /signup
```

### Event/Kursus
```
Title: "Jangan Lewatkan Kesempatan Ini!"
Subtitle: "Hanya tersisa 5 kursi untuk batch Maret 2025"
Button: "Daftar Sekarang"
Link: /register
```

---

## 📝 Catatan Penting

⚠️ **CTA Placement**: CTA section biasanya ditempatkan di:
- **Akhir landing page** (setelah semua content sections)
- **Sticky bottom bar** (mobile, always visible)
- **Pop-up** (exit intent)

✅ **Single vs Multiple CTAs**:
- **Single CTA**: Lebih fokus, higher conversion (recommended untuk UMKM)
- **Multiple CTAs**: Lebih fleksibel, tapi bisa bikin bingung

💡 **Consistency Matters**: 
- CTA di Hero Section vs CTA Section sebaiknya **konsisten**
- Atau differentiate: Hero CTA = "Lihat Produk", Bottom CTA = "Hubungi Kami"

🎨 **Color Psychology**:
- **Red/Orange**: Urgency, energy (e-commerce, fast food)
- **Green**: Growth, trust (finance, health)
- **Blue**: Professional, calm (corporate, SaaS)
- **Purple**: Luxury, premium (fashion, beauty)

---

## 🧪 A/B Testing Ideas

### Elements to Test

**1. CTA Title**:
```
Version A: "Siap Memulai?"
Version B: "Dapatkan Diskon 20% Hari Ini"

Hipotesis: Version B lebih konkret, mungkin perform better
```

**2. Button Text**:
```
Version A: "Pesan Sekarang"
Version B: "Lihat Produk Terlaris"

Hipotesis: Version B lebih spesifik, reduce anxiety
```

**3. Button Style**:
```
Version A: Primary (solid background)
Version B: Outline (transparent background)

Hipotesis: Primary lebih eye-catching, higher CTR
```

**4. Urgency Element**:
```
Version A: No urgency
Version B: "Promo berakhir dalam 24 jam!"

Hipotesis: Urgency increases conversion
```

---

## 📋 Checklist Before Go-Live

- [ ] CTA Title menarik dan jelas
- [ ] CTA Subtitle menjelaskan value proposition
- [ ] Button Text action-oriented (2-4 kata)
- [ ] Button Link valid dan sudah di-test (klik berfungsi)
- [ ] Button Style konsisten dengan branding
- [ ] CTA tidak konflik dengan CTA di Hero Section
- [ ] Mobile responsive (button tidak terlalu kecil)
- [ ] Tracking analytics sudah di-setup
- [ ] A/B testing planned (jika applicable)

---

*Dokumentasi dibuat: Februari 2025*  
*Versi: 1.0*

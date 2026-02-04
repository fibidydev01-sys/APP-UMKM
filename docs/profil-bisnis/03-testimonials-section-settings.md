# Testimonials Section Settings - Dokumentasi

## 📍 Lokasi File
**Path**: `app/client/src/app/settings/testimonials/page.tsx`

**Dual Access**:
1. **Standalone Route**: `/settings/testimonials` (dengan tombol Kembali)
2. **Tab di Toko**: `/settings/toko` → Tab "Testimonials" (dengan Drawer preview)

---

## 🎯 Tujuan Halaman

Halaman ini untuk mengatur **section testimoni pelanggan** pada landing page. Testimoni adalah salah satu elemen paling powerful untuk membangun **social proof** dan **trust** terhadap toko.

---

## 📋 Form Fields

### Tabel Field Details

| # | Field | Tipe Input | Required | Default | Keterangan |
|---|-------|-----------|----------|---------|------------|
| 1 | **Judul Section** | `Input` (text) | ❌ Tidak | "Kata Mereka" | Heading utama section Testimonials |
| 2 | **Subtitle Section** | `Input` (text) | ❌ Tidak | - | Sub-heading di bawah judul<br/>Contoh: "Apa Kata Pelanggan Kami?" |
| 3 | **Daftar Testimonial** | Dynamic List | ❌ Tidak | `[]` (array kosong) | List testimoni dengan nama, role, avatar, dan isi testimoni |

---

## 🧩 Sub-Fields: Item Testimonial

Setiap item dalam **Daftar Testimonial** memiliki:

| Sub-Field | Tipe | Required | Keterangan |
|-----------|------|----------|------------|
| **Nama Pelanggan** | `Input` (text) | ✅ Ya | Nama lengkap atau nama depan pelanggan<br/>Contoh: "Budi Santoso" atau "Budi S." |
| **Role/Pekerjaan** | `Input` (text) | ❌ Tidak | Jabatan atau identitas pelanggan<br/>Contoh: "CEO Startup ABC", "Ibu Rumah Tangga", "Mahasiswa UI" |
| **Avatar** | `ImageUpload` | ❌ Tidak | Foto pelanggan (opsional)<br/>📐 Rekomendasi: Square 200x200px, format PNG/JPG<br/>💡 Jika kosong, tampilkan initial letter avatar |
| **Isi Testimoni** | `Textarea` (3 rows) | ✅ Ya | Isi testimoni pelanggan<br/>💡 Rekomendasi: 50-150 kata untuk readability |

### Contoh Testimonial

```json
[
  {
    "name": "Sarah Wijaya",
    "role": "Owner Kafe Aroma",
    "avatar": "https://cdn.fibidy.com/avatars/sarah.jpg",
    "testimonial": "Pelayanan sangat memuaskan! Bunga datang tepat waktu dan masih sangat segar. Pelanggan saya juga sangat suka dengan dekorasi bunga untuk grand opening kemarin. Highly recommended!"
  },
  {
    "name": "Rudi Hermawan",
    "role": "Marketing Manager PT XYZ",
    "avatar": null,
    "testimonial": "Sudah 3 kali order untuk acara kantor, tidak pernah mengecewakan. Harga kompetitif, kualitas premium. Tim support juga fast response. Terima kasih Toko Bunga Mawar!"
  },
  {
    "name": "Linda",
    "role": "Ibu Rumah Tangga",
    "avatar": "https://cdn.fibidy.com/avatars/linda.jpg",
    "testimonial": "Beli bunga untuk anniversary, suami saya sampai speechless liat rangkaiannya. Cantik banget dan wanginya semerbak! Pasti bakal order lagi next year. 5 stars!"
  }
]
```

---

## 🔌 API Integration

### Request Body (Contoh)

```json
{
  "testimonialsTitle": "Apa Kata Pelanggan Kami?",
  "testimonialsSubtitle": "Ribuan Pelanggan Puas di Seluruh Indonesia",
  "testimonials": [
    {
      "name": "Sarah Wijaya",
      "role": "Owner Kafe Aroma",
      "avatar": "https://cdn.fibidy.com/avatars/sarah.jpg",
      "testimonial": "Pelayanan sangat memuaskan! Bunga datang tepat waktu dan masih sangat segar. Pelanggan saya juga sangat suka dengan dekorasi bunga untuk grand opening kemarin. Highly recommended!"
    },
    {
      "name": "Rudi Hermawan",
      "role": "Marketing Manager PT XYZ",
      "avatar": null,
      "testimonial": "Sudah 3 kali order untuk acara kantor, tidak pernah mengecewakan. Harga kompetitif, kualitas premium. Tim support juga fast response. Terima kasih Toko Bunga Mawar!"
    }
  ]
}
```

### API Endpoint

```
PATCH /api/tenants/{tenantId}
```

### Fields Mapping

| Form Field | API Field Path | Tipe Data |
|-----------|----------------|-----------|
| Judul Section | `testimonialsTitle` | string |
| Subtitle Section | `testimonialsSubtitle` | string |
| Daftar Testimonial | `testimonials` | array of objects |
| ↳ Nama Pelanggan | `testimonials[].name` | string |
| ↳ Role/Pekerjaan | `testimonials[].role` | string |
| ↳ Avatar | `testimonials[].avatar` | string (URL) atau null |
| ↳ Isi Testimoni | `testimonials[].testimonial` | string |

---

## 🎨 Preview Component

**Component**: `Testimonials1`

**Lokasi Preview**:
- **Standalone page**: Live preview di bawah form
- **Tab di Toko**: Drawer preview (slide-out panel)

**Preview menampilkan**:
- Title & subtitle section
- Card testimonial dengan:
  - Avatar (atau initial letter jika avatar kosong)
  - Nama dan role
  - Quote icon
  - Isi testimoni (dengan ellipsis jika terlalu panjang)
- Layout: 
  - Desktop: 3 cards per row
  - Mobile: 1 card per row (swipeable carousel)

---

## 🔄 Alur Data

```
1. User mengisi Judul & Subtitle
   ↓
2. User klik "Tambah Testimonial"
   ↓
3. Dialog/Form muncul untuk input:
   - Nama (wajib)
   - Role (opsional)
   - Avatar (opsional via ImageUpload)
   - Testimonial (wajib)
   ↓
4. User klik "Simpan" di dialog
   ↓
5. Testimonial ditambahkan ke array state
   ↓
6. User bisa Edit/Delete per item
   ↓
7. User klik "Simpan" di halaman utama
   ↓
8. Validasi (minimal 1 testimonial, nama & testimonial wajib)
   ↓
9. tenantsApi.update(tenantId, { testimonialsTitle, testimonials, ... })
   ↓
10. Backend menyimpan ke database
   ↓
11. useTenant().refresh()
   ↓
12. Toast notification
   ↓
13. Preview ter-update
```

---

## ✅ Validasi

### Client-Side Validation

```javascript
// Validasi per testimonial item
testimonials.forEach((item, index) => {
  if (!item.name || item.name.trim() === '') {
    toast.error(`Nama pelanggan testimonial #${index + 1} harus diisi`);
    return;
  }
  
  if (!item.testimonial || item.testimonial.trim() === '') {
    toast.error(`Isi testimonial #${index + 1} harus diisi`);
    return;
  }
  
  // Validasi panjang testimoni
  if (item.testimonial.length < 20) {
    toast.warning(`Testimoni #${index + 1} terlalu pendek (minimal 20 karakter)`);
  }
  
  if (item.testimonial.length > 500) {
    toast.warning(`Testimoni #${index + 1} terlalu panjang (maksimal 500 karakter)`);
  }
});

// Jumlah testimoni
if (testimonials.length === 0) {
  toast.info('Belum ada testimonial. Tambahkan minimal 1 untuk menampilkan section ini.');
}

if (testimonials.length > 12) {
  toast.warning('Terlalu banyak testimoni (> 12). Sebaiknya tampilkan 6-9 yang terbaik.');
}
```

### Business Rules

1. **Nama Pelanggan**: Wajib diisi (minimal 2 karakter)
2. **Isi Testimoni**: Wajib diisi (minimal 20 karakter, ideal 50-150 kata)
3. **Role**: Opsional, tapi sangat direkomendasikan untuk kredibilitas
4. **Avatar**: Opsional, jika kosong tampilkan placeholder initial
5. **Jumlah Testimoni**: Ideal 6-9 testimoni (tidak terlalu sedikit/banyak)

---

## 💡 Best Practices

### Testimonial Writing Guidelines

#### Struktur Testimoni yang Efektif

**Format 3-Part Testimonial**:
```
1. Problem → 2. Solution → 3. Result

Contoh:
"Saya sempat ragu order online karena takut bunga tidak fresh [Problem]. 
Ternyata tim Toko Bunga Mawar sangat profesional, packaging rapi, 
dan bunga sampai dalam kondisi sempurna [Solution]. 
Suami saya sangat senang! Pasti order lagi next month [Result]."
```

#### Ciri Testimoni yang Bagus

✅ **BAIK**:
- Spesifik (menyebut produk/layanan tertentu)
- Emosional (menunjukkan perasaan)
- Hasil terukur ("3x order", "5 stars", "2 tahun langganan")
- Natural (seperti percakapan biasa)
- Ada before-after atau transformasi

❌ **HINDARI**:
- Terlalu generic ("Bagus, recommended")
- Terlalu singkat (< 20 kata)
- Terlalu panjang (> 200 kata, membosankan)
- Terlalu formal/kaku
- Tidak autentik (terdengar seperti iklan)

### Contoh Perbandingan

| ❌ Testimoni Lemah | ✅ Testimoni Kuat |
|-------------------|-------------------|
| "Bagus banget, recommended!" | "Sudah 2 tahun langganan, tidak pernah mengecewakan. Bunga selalu segar dan harga terjangkau. Tim support juga ramah dan fast response. Highly recommended!" |
| "Pelayanan memuaskan" | "Pelayanan luar biasa! Saya order H-1 untuk anniversary, tim langsung kasih solusi express delivery. Bunga sampai tepat waktu dan istri saya sampai nangis terharu." |
| "Produk berkualitas" | "Kualitas bunga premium banget! Rangkaian buket untuk grand opening kemarin jadi pusat perhatian. Banyak tamu tanya beli dimana. Pasti rekomendasiin ke rekan bisnis." |

---

## 🎯 Tips Mengumpulkan Testimoni

### Strategi Mendapatkan Testimonial

1. **Timing yang Tepat**
   - Minta review 3-7 hari setelah produk diterima
   - Gunakan email/WhatsApp follow-up otomatis
   
2. **Make it Easy**
   - Sediakan template pertanyaan:
     - "Bagaimana pengalaman Anda berbelanja di toko kami?"
     - "Apa yang paling Anda suka dari produk/layanan kami?"
     - "Apakah Anda akan merekomendasikan kami ke teman/keluarga?"
   
3. **Incentivize**
   - Berikan diskon 10% untuk review (opsional)
   - Masukkan ke lucky draw bulanan
   
4. **Ask Permission**
   - Selalu minta izin untuk publish nama & foto
   - Tawarkan opsi anonim jika pelanggan tidak nyaman

---

## 🖼️ Image Guidelines

### Avatar Pelanggan

```
Resolusi: 200x200px (1:1 square)
Format: JPG atau PNG
Ukuran file: < 100KB
Style: 
  - Headshot (fokus ke wajah)
  - Background polos/buram
  - Lighting bagus
  - Ekspresi friendly

Alternatif jika tidak ada foto:
- Initial letter avatar (otomatis generate dari nama)
- Generic avatar icon
- Ilustrasi cartoon (jika konsisten untuk semua)
```

**Privacy Consideration**:
⚠️ Selalu minta izin pelanggan sebelum menampilkan foto mereka di website!

---

## 🎨 Layout & Design Tips

### Desktop Layout (> 1024px)

**Option 1: Grid 3 Columns**
```
[Card 1] [Card 2] [Card 3]
[Card 4] [Card 5] [Card 6]
```

**Option 2: Carousel/Slider**
```
← [Card 2] [Card 3 (focus)] [Card 4] →
```

**Option 3: Masonry Grid** (jika panjang testimoni bervariasi)
```
[Card 1    ] [Card 2]
[Card 3]     [Card 4    ]
             [Card 5]
```

### Mobile Layout (< 768px)

**Swipeable Carousel** (recommended)
```
[Card 1 (active)]
● ○ ○ ○ (dots indicator)
```

---

## 🔧 Troubleshooting

### Masalah Umum

**1. Testimonial tidak tampil di landing page**
```
Cek:
- Apakah array testimonials kosong?
- Apakah section testimonials di-enable di layout?
- Apakah ada error saat fetch tenant data?
```

**2. Avatar tidak muncul**
```
Cek:
- Apakah URL avatar valid?
- Apakah CORS enabled untuk image domain?
- Apakah file format didukung? (JPG, PNG, WebP)
- Fallback ke initial avatar jika URL null
```

**3. Testimoni terlalu panjang, layout berantakan**
```
Solusi:
- Implementasi "Read More" button untuk testimonial > 150 kata
- Atau truncate otomatis dengan ellipsis di frontend
```

**4. Urutan testimonial tidak bisa diubah**
```
Workaround saat ini:
1. Hapus testimonial yang ingin dipindah
2. Tambahkan ulang di posisi yang diinginkan

Future: Drag-and-drop sorting
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
- Grid 3 columns
- Avatar size: 80px
- Full testimonial text (max 200 kata)

### Tablet (768px - 1024px)
- Grid 2 columns
- Avatar size: 60px
- Truncate di 150 kata dengan "Read More"

### Mobile (< 768px)
- Carousel mode (1 card visible)
- Avatar size: 50px
- Truncate di 100 kata
- Swipe gesture enabled

---

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan:

1. **Star Rating System** (1-5 stars per testimonial)
2. **Video Testimonials** support (embed YouTube/Vimeo)
3. **Verified Badge** untuk testimonial dari order real
4. **Filter by Product/Category** jika ada banyak testimonial
5. **Auto-import from Google Reviews** atau platform review lain
6. **Social Media Integration** (pull reviews dari Facebook/Instagram)
7. **Rich Snippets** untuk SEO (schema.org Review markup)
8. **Drag-and-drop** untuk sorting testimonial
9. **Highlight/Featured** testimonial (tampilkan lebih besar)
10. **Date Added** untuk menampilkan "Recent Reviews"

---

## 📝 Catatan Penting

⚠️ **Authenticity is Key**: Jangan gunakan fake testimonial! User saat ini sangat pandai mendeteksi review palsu. Lebih baik 3 testimonial asli daripada 10 testimonial palsu.

✅ **Diversity Matters**: Tampilkan testimoni dari berbagai **demografi** (gender, usia, profesi) untuk menarik berbagai segmen pelanggan.

💡 **Update Regularly**: Refresh testimonial setiap 3-6 bulan dengan review terbaru untuk menunjukkan bahwa bisnis masih aktif dan berkembang.

🎯 **Quality over Quantity**: 6-9 testimonial berkualitas tinggi lebih efektif daripada 20+ testimonial biasa-biasa saja.

---

## 📊 SEO & Conversion Tips

### SEO Benefits

1. **Rich Snippets**: Implementasi schema.org Review markup
```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "reviewRating": { "@type": "Rating", "ratingValue": "5" },
  "author": { "@type": "Person", "name": "Sarah Wijaya" },
  "reviewBody": "Pelayanan sangat memuaskan!"
}
```

2. **User-Generated Content**: Testimoni = fresh content yang disukai Google

3. **Long-Tail Keywords**: User sering menulis keyword natural dalam testimonial

### Conversion Optimization

**Placement Strategy**:
```
Homepage: 6 best testimonials (grid)
Product Page: 3 product-specific testimonials
Checkout Page: 1-2 short testimonials (trust signal)
```

**Trust Elements to Add**:
- Verified purchase badge
- Star rating aggregate (e.g., "4.8/5 dari 328 reviews")
- Third-party review platform logos (Google, Tokopedia, dll)

---

## 🎬 Testimonial Template (Copy-Paste)

Gunakan template ini untuk memandu pelanggan menulis testimonial:

```
Template 1 (Problem-Solution-Result):
"Sebelumnya saya [masalah/keraguan]. 
Setelah [menggunakan produk/layanan], saya [hasil positif]. 
Sekarang saya [rekomendasi/action]."

Template 2 (Feature-Benefit-Emotion):
"Yang saya suka dari [nama toko] adalah [fitur]. 
Ini membantu saya [benefit]. 
Saya merasa [emosi positif]."

Template 3 (Comparison):
"Dibandingkan [kompetitor/alternatif lain], 
[nama toko] lebih [keunggulan]. 
Saya sudah [berapa lama/berapa kali] dan sangat puas."
```

---

*Dokumentasi dibuat: Februari 2025*  
*Versi: 1.0*

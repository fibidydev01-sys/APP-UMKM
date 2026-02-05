# About Section Settings - Dokumentasi

## 📍 Lokasi File
**Path**: `app/client/src/app/settings/about/page.tsx`

**Dual Access**:
1. **Standalone Route**: `/settings/about` (dengan tombol Kembali)
2. **Tab di Toko**: `/settings/toko` → Tab "About" (dengan Drawer preview)

---

## 🎯 Tujuan Halaman

Halaman ini untuk mengatur **section "Tentang Kami"** pada landing page. Bagian ini menceritakan kisah toko, misi, visi, dan fitur-fitur unggulan yang membedakan toko dari kompetitor.

---

## 📋 Form Fields

### Tabel Field Details

| # | Field | Tipe Input | Required | Default | Keterangan |
|---|-------|-----------|----------|---------|------------|
| 1 | **Judul Section** | `Input` (text) | ❌ Tidak | "Tentang Kami" | Heading utama section About |
| 2 | **Subtitle Section** | `Input` (text) | ❌ Tidak | - | Sub-heading di bawah judul |
| 3 | **Deskripsi Lengkap** | `Textarea` (4 rows) | ❌ Tidak | - | Cerita lengkap tentang toko<br/>💡 Rekomendasi: 150-300 kata |
| 4 | **About Section Image** | `ImageUpload` | ❌ Tidak | - | Gambar ilustrasi untuk section<br/>📐 Rekomendasi: 800x533px atau 1200x800px |
| 5 | **Fitur-Fitur Unggulan** | Dynamic List | ❌ Tidak | `[]` (array kosong) | List fitur dengan icon, judul, deskripsi |

---

## 🧩 Sub-Fields: Fitur Unggulan

Setiap item dalam **Fitur-Fitur Unggulan** memiliki:

| Sub-Field | Tipe | Required | Keterangan |
|-----------|------|----------|------------|
| **Feature Icon** | `ImageUpload` | ❌ Tidak | Icon/gambar kecil untuk fitur<br/>📐 Rekomendasi: Square 200x200px, PNG dengan background transparan |
| **Judul Fitur** | `Input` (text) | ✅ Ya | Nama fitur (3-6 kata)<br/>Contoh: "Pengiriman Cepat 24 Jam" |
| **Deskripsi Fitur** | `Input` (text) | ❌ Tidak | Penjelasan singkat fitur (10-20 kata)<br/>Contoh: "Gratis ongkir untuk wilayah Jabodetabek" |

### Contoh Fitur Unggulan

```json
[
  {
    "icon": "https://cdn.fibidy.com/icons/fast-delivery.png",
    "title": "Pengiriman Cepat",
    "description": "Same-day delivery untuk area Jakarta"
  },
  {
    "icon": "https://cdn.fibidy.com/icons/quality.png",
    "title": "Produk Berkualitas",
    "description": "Semua produk telah lulus quality control"
  },
  {
    "icon": "https://cdn.fibidy.com/icons/support.png",
    "title": "Customer Support 24/7",
    "description": "Tim kami siap membantu kapan saja"
  }
]
```

---

## 🔌 API Integration

### Request Body (Contoh)

```json
{
  "aboutTitle": "Tentang Toko Bunga Mawar",
  "aboutSubtitle": "Menghadirkan Kesegaran Sejak 2015",
  "aboutContent": "Toko Bunga Mawar berdiri sejak 2015 dengan misi menghadirkan bunga-bunga segar berkualitas tinggi untuk setiap momen spesial Anda. Kami bekerja sama langsung dengan petani lokal untuk memastikan kesegaran dan kualitas terbaik. Dengan pengalaman lebih dari 8 tahun, kami telah melayani ribuan pelanggan di seluruh Indonesia. Kepuasan pelanggan adalah prioritas utama kami.",
  "aboutImage": "https://cdn.fibidy.com/uploads/about-image.jpg",
  "aboutFeatures": [
    {
      "icon": "https://cdn.fibidy.com/icons/fresh.png",
      "title": "Bunga Segar Setiap Hari",
      "description": "Kami restocking bunga setiap pagi dari kebun lokal"
    },
    {
      "icon": "https://cdn.fibidy.com/icons/warranty.png",
      "title": "Garansi Kesegaran 7 Hari",
      "description": "Uang kembali 100% jika bunga layu dalam 7 hari"
    },
    {
      "icon": "https://cdn.fibidy.com/icons/free-shipping.png",
      "title": "Gratis Ongkir Jakarta",
      "description": "Tidak ada biaya pengiriman untuk wilayah Jakarta"
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
| Judul Section | `aboutTitle` | string |
| Subtitle Section | `aboutSubtitle` | string |
| Deskripsi Lengkap | `aboutContent` | string (long text) |
| About Section Image | `aboutImage` | string (URL) |
| Fitur-Fitur Unggulan | `aboutFeatures` | array of objects |
| ↳ Feature Icon | `aboutFeatures[].icon` | string (URL) |
| ↳ Judul Fitur | `aboutFeatures[].title` | string |
| ↳ Deskripsi Fitur | `aboutFeatures[].description` | string |

---

## 🎨 Preview Component

**Component**: `About1`

**Lokasi Preview**:
- **Standalone page**: Live preview di bawah form
- **Tab di Toko**: Drawer preview (slide-out panel)

**Preview menampilkan**:
- Title & subtitle
- About image (dengan aspect ratio preserved)
- About content (paragraf)
- Grid fitur-fitur unggulan (3 kolom di desktop, 1 kolom di mobile)

---

## 🔄 Alur Data

```
1. User mengisi form About
   ↓
2. useState untuk aboutTitle, aboutSubtitle, aboutContent, aboutImage
   ↓
3. Dynamic list state untuk aboutFeatures[]
   ↓
4. User menambah/edit/hapus fitur via CRUD buttons
   ↓
5. User klik "Simpan"
   ↓
6. Validasi (opsional, semua field tidak wajib)
   ↓
7. tenantsApi.update(tenantId, { aboutTitle, aboutSubtitle, ... })
   ↓
8. Backend menyimpan ke database
   ↓
9. useTenant().refresh()
   ↓
10. Toast notification
   ↓
11. Preview ter-update
```

---

## ✅ Validasi

### Client-Side Validation

```javascript
// Semua field About tidak wajib, namun jika mengisi fitur:
aboutFeatures.forEach((feature, index) => {
  if (!feature.title || feature.title.trim() === '') {
    toast.error(`Judul Fitur #${index + 1} harus diisi`);
    return;
  }
});

// Validasi panjang konten (opsional)
if (aboutContent && aboutContent.length > 1000) {
  toast.warning('Deskripsi terlalu panjang, maksimal 1000 karakter');
}
```

### Business Rules

1. **About Content**: Rekomendasi 150-300 kata untuk readability
2. **Jumlah Fitur**: Ideal 3-6 fitur (terlalu banyak membingungkan)
3. **Judul Fitur**: Wajib diisi jika fitur ditambahkan
4. **Icon Fitur**: Opsional, jika kosong gunakan placeholder icon

---

## 💡 Best Practices

### Content Writing Tips

#### About Title
```
✅ BAIK:
- "Tentang [Nama Toko]"
- "Kisah Kami"
- "Siapa Kami"
- "Kenapa Memilih Kami?"

❌ HINDARI:
- "About Us" (terlalu formal/Inggris)
- Judul terlalu panjang (> 10 kata)
```

#### About Content Structure

**Template Ideal** (3 paragraf):

```
Paragraf 1: Origin Story
"[Nama Toko] didirikan pada tahun [tahun] dengan misi [misi]. 
Berawal dari [latar belakang], kami kini telah [pencapaian]."

Paragraf 2: What Makes You Different
"Apa yang membedakan kami? [USP 1], [USP 2], dan [USP 3]. 
Kami berkomitmen untuk [komitmen]."

Paragraf 3: Customer-Centric
"Kepuasan pelanggan adalah prioritas utama kami. 
[Testimoni/stats]. Mari bergabung dengan [jumlah] pelanggan 
yang telah mempercayai kami."
```

#### Fitur Unggulan

**Format Ideal**:
```
Judul: 3-5 kata (action-oriented)
Deskripsi: 10-15 kata (benefit-focused)

Contoh:
Judul: "Gratis Konsultasi"
Deskripsi: "Chat dengan tim ahli kami sebelum membeli"

Judul: "Jaminan Uang Kembali"
Deskripsi: "100% refund jika produk tidak sesuai deskripsi"
```

### Image Guidelines

```
About Section Image:
- Resolusi: 800x533px (3:2) atau 1200x800px
- Format: JPG untuk foto, PNG untuk ilustrasi
- Ukuran file: < 300KB
- Konten: Foto tim, produk, atau workspace
- Hindari: Stock photo generic

Feature Icons:
- Resolusi: 200x200px (1:1 square)
- Format: PNG dengan background transparan atau SVG
- Ukuran file: < 50KB per icon
- Style: Konsisten (semua flat design, atau semua line art)
- Warna: Sesuai dengan tema toko
```

---

## 🎯 Feature Ideas (Inspirasi)

### Contoh Fitur untuk Berbagai Bisnis

**E-commerce Fashion:**
```
- "Original 100%" → "Semua produk dijamin keasliannya"
- "Easy Return" → "Gratis retur dalam 7 hari"
- "Size Guide" → "Panduan ukuran lengkap untuk semua produk"
```

**Toko Makanan:**
```
- "Bahan Pilihan" → "Hanya menggunakan bahan premium"
- "Higienis" → "Dapur bersertifikat BPOM"
- "Fast Delivery" → "Panas sampai di rumah Anda"
```

**Jasa Konsultasi:**
```
- "Berpengalaman" → "Tim dengan 10+ tahun pengalaman"
- "Gratis Konsultasi Awal" → "30 menit sesi pertama gratis"
- "Hasil Terukur" → "Kami bantu capai target Anda"
```

---

## 🔧 Troubleshooting

### Masalah Umum

**1. Fitur tidak bisa ditambahkan**
```
Cek:
- Apakah sudah ada 6 fitur? (batas maksimal)
- Apakah ada error di console browser?
```

**2. Icon fitur tidak tampil**
```
Cek:
- Apakah URL icon valid dan accessible?
- Apakah format didukung? (PNG, JPG, SVG, WebP)
- Apakah ukuran file < 5MB?
```

**3. About content terpotong di preview**
```
- Preview mungkin menampilkan excerpt (truncate)
- Full content akan tampil di landing page public
```

**4. Urutan fitur tidak bisa diubah**
```
Saat ini belum ada drag-and-drop.
Workaround:
1. Hapus fitur yang ingin dipindah
2. Tambahkan ulang di posisi yang diinginkan
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
- About image di kiri, content di kanan (2 kolom)
- Fitur tampil 3 kolom grid
- Spacing generous

### Tablet (768px - 1024px)
- About image di atas, content di bawah (stack)
- Fitur tampil 2 kolom grid
- Spacing medium

### Mobile (< 768px)
- Semua element stack vertical
- Fitur tampil 1 kolom
- Image full width
- Spacing compact

---

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan:

1. **Rich text editor** untuk About Content (bold, italic, bullet points)
2. **Drag-and-drop** untuk mengurutkan fitur
3. **Templates** untuk About Content (by industry)
4. **Video embed** support di About section
5. **Team members showcase** dengan foto dan role
6. **Timeline** untuk company history
7. **Awards/Certifications** display

---

## 📝 Catatan Penting

⚠️ **About Content** sebaiknya **tidak terlalu panjang** (maksimal 300 kata). User mobile biasanya tidak membaca text panjang.

✅ **Fitur Unggulan** lebih efektif jika **fokus pada benefit**, bukan pada feature. Contoh:
- ❌ "Kami punya 10 cabang" → Feature
- ✅ "Ambil pesanan di lokasi terdekat" → Benefit

💡 **Gunakan data konkret** untuk membangun trust:
- ❌ "Banyak pelanggan puas"
- ✅ "5000+ pelanggan di seluruh Indonesia"

🎨 **Consistency is key**: Pastikan style writing di About section sejalan dengan tone di Hero section.

---

## 📊 SEO Tips

About section penting untuk SEO karena:

1. **Keyword placement**: Masukkan keyword utama secara natural
2. **Long-form content**: Google menyukai konten informatif 200+ kata
3. **Internal linking**: Link ke halaman produk/kategori dari About content
4. **Schema markup**: Bisa ditambahkan untuk Organization schema

**Contoh Optimasi**:
```
Sebelum:
"Kami jual bunga segar dan murah."

Sesudah:
"Toko Bunga Mawar adalah toko bunga online terpercaya di Jakarta 
yang menyediakan berbagai jenis bunga segar untuk acara pernikahan, 
ulang tahun, dan momen spesial lainnya sejak 2015."
```

---

*Dokumentasi dibuat: Februari 2025*  
*Versi: 1.0*

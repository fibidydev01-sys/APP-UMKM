# Hero Section Settings - Dokumentasi

## 📍 Lokasi File
**Path**: `app/client/src/app/settings/hero-section/page.tsx`

**Dual Access**:
1. **Standalone Route**: `/settings/hero-section` (dengan tombol Kembali)
2. **Tab di Toko**: `/settings/toko` → Tab "Hero Section" (dengan Drawer preview)

---

## 🎯 Tujuan Halaman

Halaman ini untuk mengatur **identitas dan branding utama toko** yang tampil di hero banner (bagian paling atas landing page). Ini adalah kesan pertama pengunjung saat membuka website toko.

---

## 📋 Form Fields

### Tabel Field Details

| # | Field | Tipe Input | Required | Default | Keterangan |
|---|-------|-----------|----------|---------|------------|
| 1 | **Nama Toko** | `Input` (text) | ✅ Ya | - | Nama resmi toko yang tampil di hero banner dan branding |
| 2 | **Deskripsi Singkat** | `Input` (text) | ❌ Tidak | - | Tagline 1 kalimat untuk menjelaskan bisnis |
| 3 | **Judul Marketing** (Hero Title) | `Input` (text) | ❌ Tidak | - | Headline marketing yang eye-catching dan persuasif |
| 4 | **Subtitle** (Value Proposition) | `Input` (text) | ❌ Tidak | - | Value proposition / penjelasan singkat manfaat produk |
| 5 | **Teks Tombol CTA** | `Input` (text) | ❌ Tidak | "Pesan Sekarang" | Teks yang muncul di tombol call-to-action |
| 6 | **Link Tombol CTA** | `Input` (text) | ❌ Tidak | "/products" | URL tujuan saat tombol diklik |
| 7 | **Hero Background Image** | `ImageUpload` | ❌ Tidak | - | Gambar background hero banner<br/>📐 Rekomendasi: 1920x800px, JPG/PNG |
| 8 | **Kategori Toko** | `Input` (disabled) | 🔒 Readonly | - | Dipilih saat registrasi, tidak bisa diubah |
| 9 | **Logo Toko** | `ImageUpload` | ❌ Tidak | - | Logo yang tampil di header dan branding<br/>📐 Rekomendasi: 200x200px, PNG/JPG |
| 10 | **Warna Tema** | Color Picker | ❌ Tidak | "Sky" | 6 preset warna: Sky, Emerald, Rose, Amber, Violet, Orange |

---

## 🔌 API Integration

### Request Body (Contoh)

```json
{
  "name": "Toko Bunga Mawar",
  "description": "Bunga segar untuk setiap momen spesial",
  "heroTitle": "Hadirkan Kebahagiaan dengan Bunga Segar",
  "heroSubtitle": "Pengiriman cepat se-Jabodetabek dalam 24 jam",
  "heroCtaText": "Lihat Koleksi",
  "heroCtaLink": "/products",
  "heroBackgroundImage": "https://cdn.fibidy.com/uploads/hero-bg.jpg",
  "logo": "https://cdn.fibidy.com/uploads/logo.png",
  "theme": {
    "primaryColor": "emerald"
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
| Nama Toko | `name` | string |
| Deskripsi Singkat | `description` | string |
| Judul Marketing | `heroTitle` | string |
| Subtitle | `heroSubtitle` | string |
| Teks Tombol CTA | `heroCtaText` | string |
| Link Tombol CTA | `heroCtaLink` | string |
| Hero Background Image | `heroBackgroundImage` | string (URL) |
| Logo Toko | `logo` | string (URL) |
| Warna Tema | `theme.primaryColor` | string (enum) |

---

## 🎨 Preview Component

**Component**: `Hero1`

**Lokasi Preview**:
- **Standalone page**: Live preview di bawah form
- **Tab di Toko**: Drawer preview (slide-out panel)

**Preview menampilkan**:
- Background image
- Logo di header
- Hero title & subtitle
- Tombol CTA dengan warna tema
- Layout responsif

---

## 🔄 Alur Data

```
1. User mengisi form
   ↓
2. useState (local state)
   ↓
3. User klik "Simpan"
   ↓
4. Validasi (minimal Nama Toko terisi)
   ↓
5. tenantsApi.update(tenantId, data)
   ↓
6. Backend menyimpan ke database
   ↓
7. useTenant().refresh() untuk sinkronisasi
   ↓
8. Toast notification (success/error)
   ↓
9. Preview ter-update otomatis
```

---

## ✅ Validasi

### Client-Side Validation

```javascript
// Field wajib
if (!formData.name || formData.name.trim() === '') {
  toast.error('Nama Toko harus diisi');
  return;
}

// Validasi URL (opsional)
if (formData.heroCtaLink && !isValidURL(formData.heroCtaLink)) {
  toast.error('Format Link CTA tidak valid');
  return;
}
```

### Business Rules

1. **Nama Toko**: Wajib diisi, minimal 3 karakter
2. **Kategori Toko**: Readonly (tidak bisa diubah setelah registrasi)
3. **Warna Tema**: Hanya boleh dari 6 preset yang tersedia
4. **Hero CTA Link**: Harus valid URL (internal atau eksternal)

---

## 💡 Best Practices

### Content Guidelines

| Field | Rekomendasi | Contoh Baik | Contoh Buruk |
|-------|-------------|-------------|--------------|
| Hero Title | 5-10 kata, action-oriented | "Dapatkan Bunga Segar Hari Ini" | "Kami Jual Bunga" |
| Hero Subtitle | 10-15 kata, fokus benefit | "Gratis ongkir untuk pembelian di atas Rp 200.000" | "Bunga bagus dan murah" |
| CTA Text | 2-4 kata, imperatif | "Pesan Sekarang", "Lihat Produk" | "Klik di sini untuk melihat" |
| Deskripsi Singkat | 1 kalimat, maksimal 15 kata | "Produk organik berkualitas tinggi sejak 2015" | "Kami adalah perusahaan yang menjual..." |

### Image Guidelines

```
Hero Background Image:
- Resolusi: 1920x800px (minimal 1366x600px)
- Format: JPG (untuk foto) atau PNG (untuk grafis)
- Ukuran file: < 500KB (optimasi untuk loading speed)
- Aspect ratio: 16:9 atau 21:9

Logo Toko:
- Resolusi: 200x200px (minimal 150x150px)
- Format: PNG dengan background transparan
- Ukuran file: < 100KB
- Bentuk: Square atau circle
```

---

## 🔧 Troubleshooting

### Masalah Umum

**1. Gambar tidak muncul setelah upload**
```
Cek:
- Apakah URL gambar valid?
- Apakah file > 5MB? (melebihi batas)
- Apakah format didukung? (JPG, PNG, WebP)
```

**2. Warna tema tidak berubah**
```
Cek:
- Apakah sudah klik "Simpan"?
- Apakah refresh() berhasil dipanggil?
- Clear cache browser
```

**3. Preview tidak sesuai**
```
- Preview menggunakan data draft (sebelum disimpan)
- Setelah "Simpan", preview akan sync dengan backend
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
- Hero banner full width
- Text rata tengah
- CTA button ukuran besar

### Tablet (768px - 1024px)
- Hero banner sedikit lebih kecil
- Text tetap rata tengah
- CTA button ukuran medium

### Mobile (< 768px)
- Hero banner compact
- Text stack vertical
- CTA button full width

---

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan:

1. **Multi-language support** untuk hero content
2. **A/B testing** untuk hero variants
3. **Video background** support (MP4, WebM)
4. **Animated hero** dengan parallax effect
5. **Hero templates** siap pakai
6. **Analytics tracking** untuk CTA button clicks

---

## 📝 Catatan Penting

⚠️ **Kategori Toko tidak bisa diubah** setelah registrasi karena mempengaruhi template dan fitur yang tersedia.

⚠️ **Nama Toko** digunakan di banyak tempat (SEO meta title, email notifications, invoices), pastikan sudah benar sebelum go-live.

✅ **Warna tema** akan diterapkan ke seluruh komponen (buttons, links, icons) untuk konsistensi branding.

---

*Dokumentasi dibuat: Februari 2025*  
*Versi: 1.0*

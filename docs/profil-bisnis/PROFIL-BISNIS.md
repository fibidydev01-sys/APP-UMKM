# PROFIL BISNIS - Dokumentasi Settings

> Dokumentasi lengkap struktur folder `/settings` beserta form fields, alur
> data, dan rekomendasi wizard.

---

## 1. Struktur Folder

```
app/client/src/app/settings/
├── about/
│   └── page.tsx              # Standalone page (dengan tombol Kembali)
├── contact/
│   └── page.tsx              # Standalone page (dengan tombol Kembali)
├── cta/
│   └── page.tsx              # Standalone page (dengan tombol Kembali)
├── hero-section/
│   └── page.tsx              # Standalone page (dengan tombol Kembali)
├── pembayaran/
│   └── page.tsx              # Halaman utama (default redirect)
├── pengiriman/
│   └── page.tsx              # Halaman pengiriman
├── seo/
│   └── page.tsx              # Halaman SEO & sosmed
├── testimonials/
│   └── page.tsx              # Standalone page (dengan tombol Kembali)
├── toko/
│   ├── client.tsx            # Tab-based client component (Hero, About, Testimonials, Contact, CTA)
│   └── page.tsx              # Server wrapper + metadata
├── layout.tsx                # AuthGuard + SettingsLayout (sidebar)
└── page.tsx                  # Redirect ke /settings/pembayaran
```

### Catatan Arsitektur

- **Dual Access Pattern**: Halaman `about`, `contact`, `cta`, `hero-section`,
  `testimonials` punya 2 cara akses:
  1. **Standalone route** (`/settings/about`, dll) - dengan tombol "Kembali" dan
     `PageHeader`
  2. **Sebagai tab** di `/settings/toko` via `client.tsx` - dengan sticky tabs
     dan Drawer preview
- **Default redirect**: `/settings` otomatis redirect ke `/settings/pembayaran`
- **Sidebar navigation**: Menu utama = Toko, SEO, Pembayaran, Pengiriman

---

## 2. Inventaris Form Fields per Halaman

### 2.1 Hero Section (`/settings/hero-section` atau Tab di `/settings/toko`)

| #   | Field                        | Tipe Input              | Required | Keterangan                                           |
| --- | ---------------------------- | ----------------------- | -------- | ---------------------------------------------------- |
| 1   | Nama Toko                    | `Input` text            | Ya (\*)  | Nama resmi toko, digunakan di hero banner & branding |
| 2   | Deskripsi Singkat            | `Input` text            | Tidak    | Tagline 1 kalimat                                    |
| 3   | Judul Marketing (Hero Title) | `Input` text            | Tidak    | Headline marketing yang eye-catching                 |
| 4   | Subtitle (Value Proposition) | `Input` text            | Tidak    | Value proposition / penjelasan singkat               |
| 5   | Teks Tombol CTA              | `Input` text            | Tidak    | Teks tombol hero (default: "Pesan Sekarang")         |
| 6   | Link Tombol CTA              | `Input` text            | Tidak    | URL tujuan tombol (default: "/products")             |
| 7   | Hero Background Image        | `ImageUpload`           | Tidak    | Rekomendasi 1920x800px, JPG/PNG                      |
| 8   | Kategori Toko                | `Input` disabled        | Readonly | Dipilih saat registrasi, tidak bisa diubah           |
| 9   | Logo Toko                    | `ImageUpload`           | Tidak    | Rekomendasi 200x200px, PNG/JPG                       |
| 10  | Warna Tema                   | Color picker (6 preset) | Tidak    | Sky, Emerald, Rose, Amber, Violet, Orange            |

**API fields yang dikirim**: `name`, `description`, `heroTitle`, `heroSubtitle`,
`heroCtaText`, `heroCtaLink`, `heroBackgroundImage`, `logo`,
`theme.primaryColor`

**Preview**: Hero1 component (live preview / drawer)

---

### 2.2 About Section (`/settings/about` atau Tab di `/settings/toko`)

| #   | Field                | Tipe Input          | Required | Keterangan                              |
| --- | -------------------- | ------------------- | -------- | --------------------------------------- |
| 1   | Judul                | `Input` text        | Tidak    | Judul section (default: "Tentang Kami") |
| 2   | Subtitle             | `Input` text        | Tidak    | Subtitle section                        |
| 3   | Deskripsi Lengkap    | `Textarea` (4 rows) | Tidak    | Cerita lengkap tentang toko             |
| 4   | About Section Image  | `ImageUpload`       | Tidak    | Rekomendasi 800x533px / 1200x800px      |
| 5   | Fitur-Fitur Unggulan | Dynamic list        | Tidak    | Array of `FeatureItem`                  |

**Sub-fields per Fitur Unggulan**: | Field | Tipe | Keterangan |
|-------|------|------------| | Feature Icon | `ImageUpload` | Square, 200x200px
| | Judul | `Input` text | Nama fitur | | Deskripsi | `Input` text | Penjelasan
fitur |

**API fields**: `aboutTitle`, `aboutSubtitle`, `aboutContent`, `aboutImage`,
`aboutFeatures[]`

**Preview**: About1 component

---

### 2.3 Testimonials (`/settings/testimonials` atau Tab di `/settings/toko`)

| #   | Field              | Tipe Input   | Required | Keterangan                             |
| --- | ------------------ | ------------ | -------- | -------------------------------------- |
| 1   | Judul              | `Input` text | Tidak    | Judul section (default: "Kata Mereka") |
| 2   | Subtitle           | `Input` text | Tidak    | Subtitle section                       |
| 3   | Daftar Testimonial | Dynamic list | Tidak    | Array of `Testimonial`                 |

**Sub-fields per Testimonial**: | Field | Tipe | Keterangan |
|-------|------|------------| | Nama | `Input` text | Nama pelanggan | |
Role/Pekerjaan | `Input` text | Jabatan/pekerjaan | | Avatar | `ImageUpload`
(opsional) | Foto pelanggan, square 200x200px | | Testimoni | `Textarea` (3
rows) | Isi testimoni |

**API fields**: `testimonialsTitle`, `testimonialsSubtitle`, `testimonials[]`

**Preview**: Testimonials1 component

---

### 2.4 Contact (`/settings/contact` atau Tab di `/settings/toko`)

| #   | Field                 | Tipe Input          | Required | Keterangan                              |
| --- | --------------------- | ------------------- | -------- | --------------------------------------- |
| 1   | Judul                 | `Input` text        | Tidak    | Judul section (default: "Hubungi Kami") |
| 2   | Subtitle              | `Input` text        | Tidak    | Subtitle section                        |
| 3   | Nomor Telepon         | `Input` text        | Tidak    | Format: +62 812-3456-7890               |
| 4   | WhatsApp              | `Input` text        | Ya (\*)  | Format tanpa +, contoh: 6281234567890   |
| 5   | Email                 | `Input` disabled    | Readonly | Email tenant, tidak bisa diubah         |
| 6   | Domain Toko           | `Input` disabled    | Readonly | Otomatis dari slug: `{slug}.fibidy.com` |
| 7   | Alamat Lengkap        | `Textarea` (2 rows) | Tidak    | Alamat fisik toko                       |
| 8   | URL Google Maps Embed | `Input` text        | Tidak    | URL embed iframe Google Maps            |
| 9   | Tampilkan Peta        | `Switch` toggle     | Tidak    | Show/hide Google Maps (default: false)  |
| 10  | Tampilkan Form        | `Switch` toggle     | Tidak    | Show/hide form kontak (default: true)   |

**API fields**: `contactTitle`, `contactSubtitle`, `contactMapUrl`,
`contactShowMap`, `contactShowForm`, `phone`, `whatsapp`, `address`

**Preview**: Contact1 component

---

### 2.5 CTA / Call to Action (`/settings/cta` atau Tab di `/settings/toko`)

| #   | Field        | Tipe Input        | Required | Keterangan                                   |
| --- | ------------ | ----------------- | -------- | -------------------------------------------- |
| 1   | Judul CTA    | `Input` text      | Tidak    | Judul ajakan (default: "Siap Memulai?")      |
| 2   | Subtitle CTA | `Input` text      | Tidak    | Sub-judul ajakan                             |
| 3   | Teks Tombol  | `Input` text      | Tidak    | Teks pada tombol (default: "Mulai Sekarang") |
| 4   | Link Tombol  | `Input` text      | Tidak    | URL tujuan tombol (default: "/products")     |
| 5   | Gaya Tombol  | `Select` dropdown | Tidak    | Primary / Secondary / Outline                |

**API fields**: `ctaTitle`, `ctaSubtitle`, `ctaButtonText`, `ctaButtonLink`,
`ctaButtonStyle`

**Preview**: Cta1 component + button preview inline

---

### 2.6 Pembayaran (`/settings/pembayaran`) - DEFAULT PAGE

| #                     | Field                | Tipe Input            | Required | Keterangan                     |
| --------------------- | -------------------- | --------------------- | -------- | ------------------------------ |
| **Mata Uang & Pajak** |                      |                       |          |                                |
| 1                     | Mata Uang            | `Select` dropdown     | Tidak    | IDR, USD, SGD, MYR             |
| 2                     | Tarif Pajak (%)      | `Input` number        | Tidak    | 0-100, ditampilkan di checkout |
| **Rekening Bank**     |                      |                       |          |                                |
| 3                     | Daftar Rekening Bank | Dynamic list + Dialog | Tidak    | CRUD via `BankAccountDialog`   |
|                       | - Nama Bank          | `Input` text          | Ya       | Nama bank                      |
|                       | - Nomor Rekening     | `Input` text          | Ya       | Nomor rekening                 |
|                       | - Atas Nama          | `Input` text          | Ya       | Nama pemilik rekening          |
|                       | - Enabled            | `Switch` toggle       | -        | Aktif/nonaktif per rekening    |
| **E-Wallet**          |                      |                       |          |                                |
| 4                     | Daftar E-Wallet      | Dynamic list + Dialog | Tidak    | CRUD via `EwalletDialog`       |
|                       | - Provider           | `Input`/`Select`      | Ya       | Nama e-wallet                  |
|                       | - Nomor              | `Input` text          | Ya       | Nomor e-wallet                 |
|                       | - Nama (opsional)    | `Input` text          | Tidak    | Nama pemilik                   |
|                       | - Enabled            | `Switch` toggle       | -        | Aktif/nonaktif                 |
| **COD**               |                      |                       |          |                                |
| 5                     | Aktifkan COD         | `Switch` toggle       | Tidak    | Bayar di tempat                |
| 6                     | Catatan COD          | `Input` text          | Tidak    | Muncul jika COD aktif          |

**API fields**: `currency`, `taxRate`,
`paymentMethods { bankAccounts[], eWallets[], cod { enabled, note } }`

---

### 2.7 Pengiriman (`/settings/pengiriman`)

| #   | Field                     | Tipe Input      | Required | Keterangan                                      |
| --- | ------------------------- | --------------- | -------- | ----------------------------------------------- |
| 1   | Batas Gratis Ongkir (Rp)  | `Input` number  | Tidak    | Kosongkan jika tidak ada                        |
| 2   | Ongkos Kirim Default (Rp) | `Input` number  | Tidak    | Berlaku di bawah batas gratis ongkir            |
| 3   | Kurir Pengiriman          | Toggle list     | Tidak    | JNE, J&T, SiCepat, AnterAja, Ninja Express, dll |
|     | - Enabled per kurir       | `Switch` toggle | -        | Aktif/nonaktif                                  |
|     | - Catatan per kurir       | `Input` text    | Tidak    | Contoh: "REG, YES, OKE tersedia"                |

**API fields**: `freeShippingThreshold`, `defaultShippingCost`,
`shippingMethods { couriers[] }`

---

### 2.8 SEO & Media Sosial (`/settings/seo`)

| #                | Field            | Tipe Input            | Required | Keterangan                |
| ---------------- | ---------------- | --------------------- | -------- | ------------------------- |
| **SEO**          |                  |                       |          |                           |
| 1                | Meta Title       | `Input` text (max 60) | Tidak    | Judul di hasil Google     |
| 2                | Meta Description | `Textarea` (max 160)  | Tidak    | Deskripsi di hasil Google |
| **Social Media** |                  |                       |          |                           |
| 3                | Instagram        | `Input` URL           | Tidak    | Link profil Instagram     |
| 4                | Facebook         | `Input` URL           | Tidak    | Link halaman Facebook     |
| 5                | TikTok           | `Input` URL           | Tidak    | Link profil TikTok        |
| 6                | YouTube          | `Input` URL           | Tidak    | Link channel YouTube      |
| 7                | Twitter / X      | `Input` URL           | Tidak    | Link profil Twitter       |

**API fields**: `metaTitle`, `metaDescription`,
`socialLinks { instagram, facebook, tiktok, youtube, twitter }`

**Preview**: Google search result preview (inline)

---

## 3. Ringkasan Total Form Fields

| Halaman      | Jumlah Field Utama | Dynamic Items                     | Preview                     |
| ------------ | ------------------ | --------------------------------- | --------------------------- |
| Hero Section | 10                 | -                                 | Hero1 (live/drawer)         |
| About        | 5                  | Features (n items x 3 fields)     | About1 (live/drawer)        |
| Testimonials | 3                  | Testimonials (n items x 4 fields) | Testimonials1 (live/drawer) |
| Contact      | 10                 | -                                 | Contact1 (live/drawer)      |
| CTA          | 5                  | -                                 | Cta1 (live/drawer)          |
| Pembayaran   | 6                  | Bank (n x 3), E-Wallet (n x 3)    | -                           |
| Pengiriman   | 2                  | Kurir (5-10 items x 2)            | -                           |
| SEO          | 7                  | -                                 | Google preview              |
| **TOTAL**    | **~48 fields**     | **+ dynamic items**               |                             |

---

## 4. Rekomendasi Wizard Setup

### Apakah Wizard Diperlukan?

**YA, sangat direkomendasikan.** Alasannya:

1. **Terlalu banyak halaman terpisah** - 8 section dengan ~48 fields membuat
   tenant baru kewalahan
2. **Tidak ada urutan yang jelas** - User saat ini di-redirect ke Pembayaran
   terlebih dahulu, padahal logikanya identitas toko (Hero Section) harus diisi
   dulu
3. **Duplikasi akses** - Landing content punya dual access (standalone + tab),
   membingungkan
4. **Tidak ada progress tracking** - User tidak tahu sudah sampai mana pengisian
   profil bisnisnya

### Desain Wizard yang Disarankan

#### Pendekatan: **4-Step Wizard** (Progressive Disclosure)

```
Step 1: Identitas Toko          ← WAJIB (blocking)
Step 2: Konten Landing Page     ← OPSIONAL (skip-able)
Step 3: Pembayaran & Pengiriman ← WAJIB (blocking)
Step 4: SEO & Finishing         ← OPSIONAL (skip-able)
```

---

#### Step 1: Identitas Toko (Wajib)

> "Kenalkan toko Anda kepada pelanggan"

**Fields yang dimasukkan:** | Field | Asal | Prioritas |
|-------|------|-----------| | Nama Toko | Hero Section | Wajib | | Deskripsi
Singkat | Hero Section | Wajib | | Logo Toko | Hero Section | Opsional | | Warna
Tema | Hero Section | Opsional (default: Sky) | | Kategori Toko | Hero Section |
Readonly (dari registrasi) | | Nomor WhatsApp | Contact | Wajib | | Nomor
Telepon | Contact | Opsional | | Alamat Lengkap | Contact | Opsional |

**Validasi**: Nama Toko dan WhatsApp harus terisi sebelum lanjut.

---

#### Step 2: Konten Landing Page (Opsional, bisa di-skip)

> "Buat halaman toko Anda menarik"

**Sub-steps (accordion/tab dalam wizard):**

| Sub-step       | Fields                                                     | Bisa Skip? |
| -------------- | ---------------------------------------------------------- | ---------- |
| Hero Banner    | Hero Title, Subtitle, CTA Text, CTA Link, Background Image | Ya         |
| Tentang Toko   | About Title, Subtitle, Content, Image, Features            | Ya         |
| Testimonial    | Title, Subtitle, Daftar Testimonial                        | Ya         |
| Call to Action | CTA Title, Subtitle, Button Text/Link/Style                | Ya         |

**Catatan**: Sediakan opsi "Isi Nanti" untuk masing-masing sub-step. Semua
landing content bersifat opsional karena landing page tetap bisa tampil dengan
data minimal (nama toko saja).

---

#### Step 3: Pembayaran & Pengiriman (Wajib minimal 1 metode)

> "Siapkan cara pelanggan membayar dan menerima pesanan"

**Tab 1 - Pembayaran:** | Field | Prioritas | |-------|-----------| | Mata Uang
| Wajib (default IDR) | | Minimal 1 metode pembayaran (Bank/E-Wallet/COD) |
Wajib | | Tarif Pajak | Opsional |

**Tab 2 - Pengiriman:** | Field | Prioritas | |-------|-----------| | Ongkos
Kirim Default | Opsional | | Minimal 1 kurir aktif | Direkomendasikan | | Batas
Gratis Ongkir | Opsional |

**Validasi**: Minimal 1 metode pembayaran harus dikonfigurasi.

---

#### Step 4: SEO & Finishing (Opsional)

> "Optimasi agar toko mudah ditemukan"

| Field                      | Prioritas                               |
| -------------------------- | --------------------------------------- |
| Meta Title                 | Opsional (auto-generate dari nama toko) |
| Meta Description           | Opsional (auto-generate dari deskripsi) |
| Social Media Links         | Opsional                                |
| Google Maps URL            | Opsional                                |
| Toggle Tampilkan Peta/Form | Opsional                                |

**Auto-fill suggestion**: Meta Title dan Description bisa di-auto-generate dari
Nama Toko dan Deskripsi yang sudah diisi di Step 1.

---

### Progress Bar & Completion Tracking

```
┌─────────────────────────────────────────────────┐
│  Setup Profil Bisnis                            │
│  ████████████░░░░░░░░░░░░░░░░░░  45% Complete   │
│                                                 │
│  [✓] Step 1: Identitas Toko                     │
│  [→] Step 2: Konten Landing Page (opsional)     │
│  [ ] Step 3: Pembayaran & Pengiriman            │
│  [ ] Step 4: SEO & Finishing (opsional)         │
└─────────────────────────────────────────────────┘
```

### Kapan Wizard Muncul?

- **Pertama kali** setelah tenant berhasil registrasi
- **Bisa diakses ulang** via tombol "Setup Wizard" di dashboard jika profil
  belum 100%
- **Skip keseluruhan** memungkinkan, tapi tampilkan reminder di dashboard

### Komponen UI yang Disarankan

| Komponen         | Library                        | Keterangan                            |
| ---------------- | ------------------------------ | ------------------------------------- |
| Stepper/Progress | Custom atau `@shadcn/ui` Steps | Navigasi antar step                   |
| Form validation  | `react-hook-form` + `zod`      | Validasi per step                     |
| Image upload     | Existing `ImageUpload`         | Sudah ada                             |
| Color picker     | Existing preset buttons        | Sudah ada                             |
| Dynamic lists    | Existing pattern               | Sudah ada untuk features/testimonials |

---

## 5. Alur Data

```
User Input → React State (useState)
           → tenantsApi.update() → Backend API
           → useTenant().refresh() → Re-fetch tenant data
           → Toast notification (success/error)
```

Semua settings halaman menggunakan pola yang sama:

1. `useTenant()` hook untuk ambil data tenant
2. Local state via `useState` untuk form data
3. `useEffect` untuk inisialisasi form dari tenant data (sekali saja)
4. `tenantsApi.update()` untuk simpan perubahan
5. `refresh()` untuk sinkronisasi ulang

---

## 6. Kesimpulan

Sistem settings saat ini sudah **fungsional** namun **tersebar** di banyak
halaman tanpa panduan urutan pengisian. Implementasi wizard 4-step akan:

1. **Menurunkan cognitive load** - User UMKM tidak perlu menebak halaman mana
   yang harus diisi dulu
2. **Meningkatkan completion rate** - Step wajib memastikan data minimum
   terpenuhi
3. **Mempertahankan fleksibilitas** - Step opsional bisa di-skip dan diisi nanti
   via halaman settings yang sudah ada
4. **Backward compatible** - Halaman settings individual tetap berfungsi untuk
   editing setelah wizard selesai

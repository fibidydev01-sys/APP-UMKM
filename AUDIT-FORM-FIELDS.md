# 🔍 AUDIT FORM FIELDS - Informasi Toko

## 📊 TABEL PERBANDINGAN

### ✅ YANG ADA DI DATABASE (Prisma Schema)

| Field | Type | Location in DB | Currently in Form? |
|-------|------|----------------|-------------------|
| **BASIC INFO** | | | |
| id | String | Tenant.id | ❌ (readonly, auto) |
| slug | String | Tenant.slug | ✅ (readonly) |
| name | String | Tenant.name | ✅ |
| category | String | Tenant.category | ❌ **KURANG!** |
| description | String? | Tenant.description | ✅ |
| **CONTACT INFO** | | | |
| whatsapp | String | Tenant.whatsapp | ❌ **KURANG!** |
| email | String | Tenant.email | ✅ (readonly) |
| phone | String? | Tenant.phone | ✅ |
| address | String? | Tenant.address | ✅ |
| **BRANDING** | | | |
| logo | String? | Tenant.logo | ❌ **KURANG!** |
| banner | String? | Tenant.banner | ❌ **KURANG!** |
| theme | Json? | Tenant.theme | ❌ **KURANG!** (primaryColor) |
| landingConfig | Json? | Tenant.landingConfig | ❌ (beda context) |
| **SEO** | | | |
| metaTitle | String? | Tenant.metaTitle | ❌ **KURANG!** |
| metaDescription | String? | Tenant.metaDescription | ❌ **KURANG!** |
| socialLinks | Json? | Tenant.socialLinks | ❌ **KURANG!** |
| **PAYMENT** | | | |
| currency | String | Tenant.currency | ❌ (beda tab) |
| taxRate | Float | Tenant.taxRate | ❌ (beda tab) |
| paymentMethods | Json? | Tenant.paymentMethods | ❌ (beda tab) |
| **SHIPPING** | | | |
| freeShippingThreshold | Float? | Tenant.freeShippingThreshold | ❌ (beda tab) |
| defaultShippingCost | Float | Tenant.defaultShippingCost | ❌ (beda tab) |
| shippingMethods | Json? | Tenant.shippingMethods | ❌ (beda tab) |
| **HERO SECTION** | | | |
| heroTitle | String? | Tenant.heroTitle | ✅ |
| heroSubtitle | String? | Tenant.heroSubtitle | ✅ |
| heroCtaText | String? | Tenant.heroCtaText | ✅ |
| heroCtaLink | String? | Tenant.heroCtaLink | ✅ |
| heroBackgroundImage | String? | Tenant.heroBackgroundImage | ✅ |
| **ABOUT SECTION** | | | |
| aboutTitle | String? | Tenant.aboutTitle | ✅ |
| aboutSubtitle | String? | Tenant.aboutSubtitle | ✅ |
| aboutContent | String? | Tenant.aboutContent | ✅ |
| aboutImage | String? | Tenant.aboutImage | ✅ |
| aboutFeatures | Json? | Tenant.aboutFeatures | ✅ |
| **TESTIMONIALS** | | | |
| testimonialsTitle | String? | Tenant.testimonialsTitle | ✅ |
| testimonialsSubtitle | String? | Tenant.testimonialsSubtitle | ✅ |
| testimonials | Json? | Tenant.testimonials | ✅ |
| **CONTACT SECTION** | | | |
| contactTitle | String? | Tenant.contactTitle | ✅ |
| contactSubtitle | String? | Tenant.contactSubtitle | ✅ |
| contactMapUrl | String? | Tenant.contactMapUrl | ✅ |
| contactShowMap | Boolean | Tenant.contactShowMap | ✅ |
| contactShowForm | Boolean | Tenant.contactShowForm | ✅ |
| **CTA SECTION** | | | |
| ctaTitle | String? | Tenant.ctaTitle | ✅ |
| ctaSubtitle | String? | Tenant.ctaSubtitle | ✅ |
| ctaButtonText | String? | Tenant.ctaButtonText | ✅ |
| ctaButtonLink | String? | Tenant.ctaButtonLink | ✅ |
| ctaButtonStyle | String? | Tenant.ctaButtonStyle | ✅ |
| **SYSTEM** | | | |
| status | TenantStatus | Tenant.status | ❌ (readonly) |
| createdAt | DateTime | Tenant.createdAt | ❌ (readonly) |
| updatedAt | DateTime | Tenant.updatedAt | ❌ (readonly) |

---

## 🔴 YANG KURANG DI FORM (CRITICAL):

### 1. **category** - Kategori Toko
- **Type:** String (RESTORAN, FASHION, ELEKTRONIK, dll)
- **Required:** YES (database tidak nullable)
- **Should be in:** Informasi Dasar
- **Status:** ❌ MISSING!

### 2. **whatsapp** - Nomor WhatsApp
- **Type:** String
- **Required:** YES (database tidak nullable)
- **Should be in:** Informasi Dasar
- **Status:** ❌ MISSING!

### 3. **logo** - URL Logo Toko
- **Type:** String?
- **Required:** NO
- **Should be in:** Branding & Tampilan (section baru)
- **Status:** ❌ MISSING!

### 4. **banner** - URL Banner Toko
- **Type:** String?
- **Required:** NO
- **Should be in:** Branding & Tampilan (section baru)
- **Status:** ❌ MISSING!

### 5. **theme.primaryColor** - Warna Tema
- **Type:** Json (hex color)
- **Required:** NO
- **Should be in:** Branding & Tampilan (section baru)
- **Status:** ❌ MISSING!

### 6. **metaTitle** - SEO Title
- **Type:** String? (max 60 chars)
- **Required:** NO
- **Should be in:** SEO & Meta (section baru atau tab terpisah)
- **Status:** ❌ MISSING!

### 7. **metaDescription** - SEO Description
- **Type:** String? (max 160 chars)
- **Required:** NO
- **Should be in:** SEO & Meta (section baru atau tab terpisah)
- **Status:** ❌ MISSING!

### 8. **socialLinks** - Social Media Links
- **Type:** Json (instagram, facebook, tiktok, youtube, twitter)
- **Required:** NO
- **Should be in:** SEO & Meta atau Informasi Dasar
- **Status:** ❌ MISSING!

---

## 🧐 ANALISIS DUPLIKASI

### ❓ Apakah ada duplikasi antara "Informasi Dasar" dan "Hero"?

**TIDAK ADA DUPLIKASI!** Berikut penjelasannya:

| Purpose | Fields | Use Case |
|---------|--------|----------|
| **Informasi Dasar** | name, description, phone, address, email | Data resmi/official toko untuk internal & admin |
| **Hero Section** | heroTitle, heroSubtitle, heroCtaText, heroCtaLink | Marketing copy untuk landing page (public-facing) |

**Contoh Real:**
```
Informasi Dasar:
- name: "Burger China"
- description: "Restoran burger dengan konsep Asia fusion"
- phone: "+6281234567890"

Hero Section:
- heroTitle: "Burger Premium dengan Cita Rasa Asia Fusion 🔥"
- heroSubtitle: "Rasakan sensasi burger berkualitas dengan bumbu rahasia khas Asia"
- heroCtaText: "Pesan Sekarang"
```

**Kesimpulan:** Tidak duplikasi, tapi berbeda konteks (internal vs marketing).

---

## 🎯 REKOMENDASI STRUKTUR BARU

### Option 1: Semua di Tab "Informasi Toko" (dengan section tambahan)

```
Tab: Informasi Toko
├─ Accordion 1: Informasi Dasar
│  ├─ name, email (readonly), slug (readonly), category ⭐NEW
│  ├─ whatsapp ⭐NEW, phone
│  └─ address, description
│
├─ Accordion 2: Branding & Tampilan ⭐NEW SECTION
│  ├─ logo ⭐NEW
│  ├─ banner ⭐NEW
│  └─ primaryColor ⭐NEW (theme)
│
├─ Accordion 3: SEO & Social Media ⭐NEW SECTION
│  ├─ metaTitle ⭐NEW
│  ├─ metaDescription ⭐NEW
│  └─ socialLinks ⭐NEW (instagram, facebook, tiktok, youtube, twitter)
│
├─ Accordion 4: Hero Section ✅
├─ Accordion 5: About ✅
├─ Accordion 6: Testimonials ✅
├─ Accordion 7: Contact ✅
└─ Accordion 8: CTA ✅
```

### Option 2: Pisahkan ke Tab Berbeda (lebih terorganisir)

```
Tab 1: Pengaturan Umum
├─ Informasi Dasar (name, category, whatsapp, phone, email, address, description)
├─ Branding (logo, banner, primaryColor)
└─ SEO & Social Media (metaTitle, metaDescription, socialLinks)

Tab 2: Konten Landing Page (yang sekarang)
├─ Hero Section ✅
├─ About ✅
├─ Testimonials ✅
├─ Contact ✅
└─ CTA ✅

Tab 3: Pengaturan Toko (yang sudah ada)
Tab 4: Pengguna (yang sudah ada)
```

---

## 💡 MANA YANG LEBIH BAIK?

### Untuk Tab "Informasi Toko" (Store Information):
**Pilih Option 1** - Semua di satu tab dengan accordion tambahan.

**Alasan:**
1. User mental model: "Informasi Toko" = semua tentang toko
2. Tidak perlu pindah-pindah tab untuk edit store info
3. Accordion membuat navigasi tetap mudah
4. Branding & SEO adalah bagian dari "Store Information"

---

## ✅ ACTION ITEMS

1. **Tambah ke "Informasi Dasar" accordion:**
   - [ ] category (Select/Dropdown)
   - [ ] whatsapp (Input dengan format validation)

2. **Buat "Branding & Tampilan" accordion baru:**
   - [ ] logo (URL input atau upload)
   - [ ] banner (URL input atau upload)
   - [ ] primaryColor (Color picker)

3. **Buat "SEO & Social Media" accordion baru:**
   - [ ] metaTitle (Input max 60 chars)
   - [ ] metaDescription (Textarea max 160 chars)
   - [ ] socialLinks (Multiple inputs: instagram, facebook, tiktok, youtube, twitter)

4. **Update storeTabData state** untuk include semua field di atas

5. **Update handleSaveStoreTab** untuk save semua field baru

6. **Update test-api.sh** untuk test field-field baru

---

## 🔄 URUTAN ACCORDION YANG MASUK AKAL

```
1. Informasi Dasar          (core business info)
2. Branding & Tampilan      (visual identity)
3. SEO & Social Media       (discoverability)
4. Hero Section             (landing page sections start)
5. About
6. Testimonials
7. Contact
8. CTA                      (landing page sections end)
```

**Reasoning:** Basic info → Branding → SEO → Landing page content (dari atas ke bawah)

---

**Dibuat:** 2026-01-19
**Status:** Audit Complete - Waiting for implementation decision

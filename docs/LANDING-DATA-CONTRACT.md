# 📋 Landing Page Data Contract

**Version:** 2.1
**Last Updated:** January 2026
**Purpose:** Single source of truth for landing page data structure between Settings Form, Backend API, and Landing Builder

---

## 🎯 Overview

This document defines the complete data contract for the landing page builder system. All tenant-editable landing page content is managed through a **unified state structure** that eliminates race conditions and ensures data consistency.

### System Architecture

```
Settings Form (Client) ←→ Unified State ←→ Backend API ←→ Database (Prisma)
                                ↓
                         Landing Builder
```

---

## 🗂️ Complete Data Structure

### TypeScript Interface

```typescript
interface TenantLandingData {
  // ============================================
  // BUSINESS IDENTITY & BRANDING
  // ============================================
  category: string;              // CATERING, WARUNG_KELONTONG, etc. (READONLY after registration)
  name: string;                  // Store name
  description: string;           // Short tagline (1 sentence)
  logo?: string;                 // Cloudinary URL
  banner?: string;               // Cloudinary URL
  theme: {
    primaryColor: string;        // Hex color code (e.g., "#0ea5e9")
  };

  // ============================================
  // HERO SECTION - Banner Utama
  // ============================================
  heroTitle: string;             // Marketing headline
  heroSubtitle: string;          // Value proposition
  heroCtaText: string;           // CTA button text (e.g., "Pesan Sekarang")
  heroCtaLink: string;           // CTA button link (e.g., "/products")
  heroBackgroundImage: string;   // Cloudinary URL (1920x800px, uploaded via settings)

  // ============================================
  // ABOUT SECTION - Tentang Toko
  // ============================================
  aboutTitle: string;            // Section title (e.g., "Tentang Kami")
  aboutSubtitle: string;         // Section subtitle
  aboutContent: string;          // Long-form description (paragraphs)
  aboutImage: string;            // Cloudinary URL (800x533px or 1200x800px)
  aboutFeatures: FeatureItem[];  // Array of features/highlights

  // ============================================
  // TESTIMONIALS SECTION - Testimoni Pelanggan
  // ============================================
  testimonialsTitle: string;     // Section title (e.g., "Kata Mereka")
  testimonialsSubtitle: string;  // Section subtitle
  testimonials: Testimonial[];   // Array of customer testimonials

  // ============================================
  // CONTACT SECTION - Informasi Kontak
  // ============================================
  contactTitle: string;          // Section title (e.g., "Hubungi Kami")
  contactSubtitle: string;       // Section subtitle
  phone: string;                 // Phone number (display format: +62 812-3456-7890)
  whatsapp: string;              // WhatsApp number (format: 6281234567890, no +)
  email: string;                 // Email (READONLY, from auth)
  address: string;               // Full address
  slug: string;                  // URL slug (READONLY, format: slug.fibidy.com)
  contactMapUrl: string;         // Google Maps embed URL
  contactShowMap: boolean;       // Toggle map visibility
  contactShowForm: boolean;      // Toggle contact form visibility

  // ============================================
  // CTA SECTION - Call to Action
  // ============================================
  ctaTitle: string;              // CTA title (e.g., "Siap Memulai?")
  ctaSubtitle: string;           // CTA subtitle
  ctaButtonText: string;         // Button text (e.g., "Mulai Sekarang")
  ctaButtonLink: string;         // Button link (e.g., "/products")
  ctaButtonStyle: 'primary' | 'secondary' | 'outline';
}
```

### Sub-Types

```typescript
interface FeatureItem {
  icon: string;        // Cloudinary image URL (200x200px square icon)
  title: string;       // Feature title
  description: string; // Feature description
}

interface Testimonial {
  name: string;        // Customer name
  role: string;        // Customer role/occupation
  content: string;     // Testimonial text
  avatar?: string;     // Cloudinary URL (200x200px square, optional)
}
```

---

## 🔌 API Contract

### Endpoint: Get Current Tenant

```http
GET /api/tenants/me
```

**Headers:**
```
Cookie: tenant_auth=<session_token>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "slug": "burger-china",
  "email": "owner@example.com",
  "category": "CATERING",
  "name": "Burger China",
  "description": "Burger premium dengan cita rasa Asia fusion",
  "logo": "https://res.cloudinary.com/fibidy/image/upload/v1234567890/fibidy/logos/xxx.jpg",
  "banner": "https://res.cloudinary.com/fibidy/image/upload/v1234567890/fibidy/banners/xxx.jpg",
  "theme": {
    "primaryColor": "#0ea5e9"
  },
  "phone": "+62 812-3456-7890",
  "whatsapp": "6281234567890",
  "address": "Jl. Contoh No. 123, Jakarta",
  "heroTitle": "Burger Premium dengan Cita Rasa Asia Fusion",
  "heroSubtitle": "Rasakan sensasi burger berkualitas dengan bumbu rahasia khas Asia",
  "heroCtaText": "Pesan Sekarang",
  "heroCtaLink": "/products",
  "heroBackgroundImage": "https://res.cloudinary.com/fibidy/image/upload/v1234567890/fibidy/hero-backgrounds/xxx.jpg",
  "aboutTitle": "Tentang Kami",
  "aboutSubtitle": "Cerita di balik toko kami",
  "aboutContent": "Lorem ipsum dolor sit amet...",
  "aboutImage": "https://res.cloudinary.com/fibidy/image/upload/v1234567890/fibidy/about-images/xxx.jpg",
  "aboutFeatures": [
    {
      "icon": "https://res.cloudinary.com/fibidy/image/upload/v1234567890/fibidy/feature-icons/xxx.png",
      "title": "Kualitas Terjamin",
      "description": "Bahan-bahan pilihan berkualitas tinggi"
    }
  ],
  "testimonialsTitle": "Kata Mereka",
  "testimonialsSubtitle": "Apa kata pelanggan tentang kami",
  "testimonials": [
    {
      "name": "John Doe",
      "role": "Food Blogger",
      "content": "Burger terbaik yang pernah saya coba!",
      "avatar": "https://res.cloudinary.com/fibidy/image/upload/v1234567890/fibidy/testimonial-avatars/xxx.jpg"
    }
  ],
  "contactTitle": "Hubungi Kami",
  "contactSubtitle": "Kami siap membantu Anda",
  "contactMapUrl": "https://www.google.com/maps/embed?pb=...",
  "contactShowMap": true,
  "contactShowForm": true,
  "ctaTitle": "Siap Memulai?",
  "ctaSubtitle": "Bergabunglah dengan kami hari ini",
  "ctaButtonText": "Mulai Sekarang",
  "ctaButtonLink": "/products",
  "ctaButtonStyle": "primary",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-19T00:00:00.000Z"
}
```

### Endpoint: Update Tenant

```http
PATCH /api/tenants/me
```

**Headers:**
```
Content-Type: application/json
Cookie: tenant_auth=<session_token>
```

**Request Body (Partial Update):**
```json
{
  "name": "Burger China UPDATED",
  "description": "New tagline",
  "heroTitle": "New Hero Title",
  "aboutFeatures": [
    {
      "icon": "⭐",
      "title": "New Feature",
      "description": "Feature description"
    }
  ]
}
```

**Response (200 OK):**
Returns updated tenant object (same format as GET)

---

## 🎨 Category Options

15 valid categories (defined in `/client/src/config/categories.ts`):

| Value | Label (Indonesian) |
|-------|-------------------|
| `WARUNG_KELONTONG` | Warung Kelontong |
| `TOKO_BANGUNAN` | Toko Bangunan |
| `BENGKEL_MOTOR` | Bengkel Motor |
| `LAUNDRY` | Laundry |
| `SERVICE_AC` | Service AC |
| `SALON_BARBERSHOP` | Salon & Barbershop |
| `APOTEK` | Apotek |
| `CATERING` | Katering |
| `KEDAI_KOPI` | Kedai Kopi |
| `TOKO_KUE` | Toko Kue |
| `FOTOGRAFI` | Fotografi |
| `PETSHOP` | Pet Shop |
| `GYM_FITNESS` | Gym & Fitness |
| `KOST_KONTRAKAN` | Kost & Kontrakan |
| `PERCETAKAN` | Percetakan |

**Important:** Category can ONLY be selected during registration and is READ-ONLY afterwards.

---

## 🎨 Theme Colors

6 predefined theme colors:

| Name | Hex Value | Tailwind Class |
|------|-----------|----------------|
| Sky | `#0ea5e9` | `bg-sky-500` |
| Emerald | `#10b981` | `bg-emerald-500` |
| Rose | `#f43f5e` | `bg-rose-500` |
| Amber | `#f59e0b` | `bg-amber-500` |
| Violet | `#8b5cf6` | `bg-violet-500` |
| Orange | `#f97316` | `bg-orange-500` |

---

## 📐 Image Specifications

All images are uploaded via Cloudinary through the Settings page.

### Logo
- **Recommended Size:** 200x200px
- **Aspect Ratio:** 1:1 (square)
- **Format:** PNG or JPG
- **Cloudinary Folder:** `fibidy/logos`

### Banner
- **Recommended Size:** 1200x400px
- **Aspect Ratio:** 3:1 (wide)
- **Format:** PNG or JPG
- **Cloudinary Folder:** `fibidy/banners`

### Hero Background
- **Recommended Size:** 1920x800px
- **Aspect Ratio:** ~2.4:1 (wide)
- **Format:** JPG or PNG
- **Cloudinary Folder:** `fibidy/hero-backgrounds`

### About Image
- **Recommended Size:** 800x533px or 1200x800px
- **Aspect Ratio:** 1.5:1 (horizontal)
- **Format:** JPG or PNG
- **Cloudinary Folder:** `fibidy/about-images`

### Feature Icons
- **Recommended Size:** 200x200px
- **Aspect Ratio:** 1:1 (square)
- **Format:** PNG (with transparency recommended)
- **Cloudinary Folder:** `fibidy/feature-icons`

### Testimonial Avatars
- **Recommended Size:** 200x200px
- **Aspect Ratio:** 1:1 (square)
- **Format:** JPG or PNG
- **Cloudinary Folder:** `fibidy/testimonial-avatars`

---

## 🔄 Data Flow

### 1. Settings Form → Backend
```typescript
// User edits form in /dashboard/settings (Informasi Toko tab)
// All fields stored in unified state: storeTabData

// On save:
await tenantsApi.update({
  name: storeTabData.name,
  heroTitle: storeTabData.heroTitle,
  aboutFeatures: storeTabData.aboutFeatures,
  // ... all 30+ fields
});

// Backend validates and saves to database
```

### 2. Backend → Landing Builder
```typescript
// Landing builder fetches data:
const response = await fetch('/api/tenants/me');
const tenantData = await response.json();

// Render sections using tenant data:
<HeroSection
  title={tenantData.heroTitle}
  subtitle={tenantData.heroSubtitle}
  ctaText={tenantData.heroCtaText}
  ctaLink={tenantData.heroCtaLink}
  backgroundImage={tenantData.heroBackgroundImage}
  logo={tenantData.logo}
  primaryColor={tenantData.theme.primaryColor}
/>

<AboutSection
  title={tenantData.aboutTitle}
  subtitle={tenantData.aboutSubtitle}
  content={tenantData.aboutContent}
  image={tenantData.aboutImage}
  features={tenantData.aboutFeatures}
/>

// ... and so on for all sections
```

### 3. Unified State (Settings Form)
```typescript
// Single state object prevents race conditions
const [storeTabData, setStoreTabData] = useState<{
  // Business Identity
  category: string;
  name: string;
  description: string;
  logo: string | undefined;
  banner: string | undefined;
  primaryColor: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroBackgroundImage: string;

  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  aboutContent: string;
  aboutImage: string;
  aboutFeatures: FeatureItem[];

  // Testimonials Section
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonials: Testimonial[];

  // Contact Section
  contactTitle: string;
  contactSubtitle: string;
  phone: string;
  whatsapp: string;
  address: string;
  contactMapUrl: string;
  contactShowMap: boolean;
  contactShowForm: boolean;

  // CTA Section
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  ctaButtonStyle: 'primary' | 'secondary' | 'outline';
} | null>(null);
```

---

## 📝 Settings Form Structure

### Tab: Informasi Toko (Store Information)

**Accordion Layout:**

1. **Hero Section - Banner Utama**
   - Nama Toko, Deskripsi Singkat
   - Hero Title, Hero Subtitle
   - CTA Text, CTA Link
   - **Hero Background Image Upload** (Cloudinary)
   - **Kategori & Branding:**
     - Kategori Toko (readonly)
     - Logo Upload (Cloudinary)
     - Banner Upload (Cloudinary)
     - Warna Tema (color picker)

2. **About - Tentang Toko**
   - Judul, Subtitle
   - Deskripsi Lengkap (textarea)
   - **About Image Upload** (Cloudinary)
   - **Fitur-Fitur Unggulan (array editor):**
     - Add/Delete features
     - Each: Icon Upload (Cloudinary), Title, Description

3. **Testimonials - Testimoni Pelanggan**
   - Judul, Subtitle
   - **Daftar Testimonial (array editor):**
     - Add/Delete testimonials
     - Each: Name, Role, Content, Avatar Upload (Cloudinary)

4. **Contact - Informasi Kontak**
   - Judul, Subtitle
   - **Informasi Kontak:**
     - Nomor Telepon, WhatsApp
     - Email (readonly), Domain (readonly)
     - Alamat Lengkap
   - **Google Maps:**
     - URL Embed
     - Toggle: Tampilkan Peta
     - Toggle: Tampilkan Form

5. **CTA - Call to Action**
   - Judul CTA, Subtitle CTA
   - Teks Tombol, Link Tombol
   - Gaya Tombol (primary/secondary/outline)

---

## 🚀 Testing Script

Test all fields using:
```bash
cd /home/user/APP-UMKM/server
./test-api.sh
```

This script tests:
1. Login with cookies
2. Get current tenant data
3. PATCH update all 30+ fields
4. Verify all fields were updated correctly

---

## ⚠️ Important Rules

### Read-Only Fields
- **category:** Set during registration, cannot be changed
- **email:** From authentication, cannot be changed
- **slug:** Generated from store name during registration, cannot be changed

### Required Fields
- **whatsapp:** Required for order notifications
- **name:** Required for store identity
- **category:** Required (set during registration)

### Domain Format
- **Production URL:** `{slug}.fibidy.com` (subdomain)
- **NOT:** `fibidy.com/store/{slug}` ❌

### Array Fields
- **aboutFeatures:** Can be empty array `[]`
- **testimonials:** Can be empty array `[]`
- Use array editor UI for add/delete operations

### State Management
- **Single unified state** in settings form prevents race conditions
- All fields save together via single API call
- Backend validates and persists to Prisma database

---

## 🔗 File References

### Client (Frontend)
- **Settings Page:** `/client/src/app/(dashboard)/dashboard/settings/page.tsx`
- **Type Definitions:** `/client/src/types/tenant.ts`
- **Category Config:** `/client/src/config/categories.ts`
- **API Client:** `/client/src/lib/api/tenants.ts`

### Server (Backend)
- **Prisma Schema:** `/server/prisma/schema.prisma`
- **API Routes:** `/server/src/routes/tenants.ts`
- **Tenant Controller:** `/server/src/controllers/tenants.controller.ts`
- **Test Script:** `/server/test-api.sh`

### Documentation
- **Unified State Docs:** `/UNIFIED-STATE-STRUCTURE.md`
- **Data Contract:** `/LANDING-DATA-CONTRACT.md` (this file)

---

## 📤 Cloudinary Upload Pattern

All image uploads in the Settings page use the unified `ImageUpload` component with Cloudinary:

```tsx
<ImageUpload
  value={imageUrl}
  onChange={(url) => updateField(url)}
  onRemove={handleRemove}  // Optional
  disabled={isRemoving}     // Optional
  folder="fibidy/folder-name"
  aspectRatio={1.5}         // Aspect ratio for cropping
  placeholder="Upload image"
/>
```

### Upload Flow:
1. **User clicks upload** → Cloudinary widget opens
2. **User selects image** → Auto-cropped to aspect ratio
3. **Upload completes** → Cloudinary URL returned
4. **URL saved to state** → Visible in form immediately
5. **User clicks "Save"** → All changes persisted to database

### Important Notes:
- All images are uploaded to Cloudinary before saving to database
- Images are cropped automatically using widget settings
- No URL input fields - only Cloudinary uploads
- Max file size: 5MB per image
- Allowed formats: PNG, JPG, JPEG, WebP, GIF

---

## 📅 Version History

### v2.1 (January 2026)
- ✅ **All images now use Cloudinary uploads** (no more URL inputs)
- ✅ Hero Background Image → Cloudinary upload
- ✅ About Image → Cloudinary upload
- ✅ Feature Icons → Cloudinary upload (replaced emoji input)
- ✅ Testimonial Avatars → Cloudinary upload
- ✅ Added 4 new Cloudinary folders for organized storage
- ✅ Consistent upload experience across all image fields

### v2.0 (January 2026)
- ✅ Unified state structure implementation
- ✅ Moved branding (logo, banner, color) into Hero Section
- ✅ Category made read-only in settings
- ✅ Fixed domain format to `slug.fibidy.com`
- ✅ Synchronized 15 category options across all forms
- ✅ Removed separate Appearance tab (4 tabs total)
- ✅ Complete accordion UI for all 30+ fields

### v1.0 (Initial)
- Initial structure with separate state for each section
- Race condition issues with multiple state updates

---

## 🎯 Next Steps: Landing Builder Integration

When building `/landing-builder` or public landing pages:

1. **Fetch tenant data:**
   ```typescript
   const tenant = await fetch('/api/tenants/me').then(r => r.json());
   ```

2. **Render sections dynamically:**
   - Use tenant data to populate all sections
   - Apply theme color from `tenant.theme.primaryColor`
   - Handle optional fields (empty arrays, undefined images)

3. **Respect display toggles:**
   - `contactShowMap`: Show/hide Google Maps embed
   - `contactShowForm`: Show/hide contact form

4. **Use correct URLs:**
   - Store domain: `${tenant.slug}.fibidy.com`
   - Links: Relative paths (e.g., `/products`) or absolute URLs

---

**End of Document**

For questions or updates, refer to:
- Technical Lead: Unified State Architecture
- Documentation: `/UNIFIED-STATE-STRUCTURE.md`
- API Testing: `/server/test-api.sh`

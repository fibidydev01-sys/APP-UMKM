# 🎯 BLUEPRINT: Refactor Landing System - Separation of Data & Style

> **Tanggal**: 2026-01-19
> **Status**: Planning Phase
> **Tujuan**: Memisahkan **Data Permanent** (Informasi Toko) dari **Block Selection** (Landing Builder)

---

## 📋 EXECUTIVE SUMMARY

### Masalah Saat Ini
- Landing Builder menyimpan **DATA + BLOCK SELECTION** sekaligus di `landingConfig` (JSON)
- Data seperti title, subtitle, content tersimpan di `landingConfig` (tidak permanent)
- User harus input data berulang di Landing Builder
- Tidak ada single source of truth untuk store information

### Solusi
- **Informasi Toko** = Permanent Data Storage (Tenant model fields)
- **Landing Builder** = Block Selection + Meta Styling ONLY
- Data bersifat **permanent** di tenant, landing hanya **dinamis selection**

### Benefit
✅ Single source of truth untuk store data
✅ Data permanent, tidak hilang saat ganti template
✅ Landing Builder lebih fokus ke block selection
✅ Better UX - input data sekali di "Informasi Toko"
✅ Reusable data across multiple sections

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    INFORMASI TOKO (NEW)                      │
│          Permanent Storage - Tenant Model Fields             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📦 Hero Data          📦 About Data                          │
│  📦 Testimonials Data  📦 Contact Data                        │
│  📦 CTA Data           📦 Products Data (existing)            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌──────────────┐
                    │   TENANT DB  │
                    └──────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  LANDING BUILDER (REFACTORED)                │
│            Block Selection + Meta Styling ONLY               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🎨 Hero Block (hero1-200)        - SELECT BLOCK VARIANT     │
│  🎨 About Block (about1-200)      - SELECT BLOCK VARIANT     │
│  🎨 Products Block (products1-200) - SELECT BLOCK VARIANT    │
│  🎨 Testimonials Block (testi1-200) - SELECT BLOCK VARIANT   │
│  🎨 Contact Block (contact1-200)  - SELECT BLOCK VARIANT     │
│  🎨 CTA Block (cta1-200)          - SELECT BLOCK VARIANT     │
│                                                               │
│  + Enable/Disable toggles                                    │
│  + Section order (optional)                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                ┌──────────────────────┐
                │  landingConfig (JSON) │
                └──────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE RENDER                       │
│                 Data from Tenant + Block from Config         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 DATA MIGRATION MAPPING

### SEBELUM (Current State)
```typescript
// Tenant Model
{
  name: "Toko ABC",
  description: "Deskripsi toko",
  logo: "/logo.png",
  banner: "/banner.jpg",
  whatsapp: "08123456789",
  email: "toko@abc.com",
  phone: "021-1234567",
  address: "Jl. Contoh No. 123",
  socialLinks: { instagram: "...", facebook: "..." },

  // Everything stored in landingConfig JSON
  landingConfig: {
    hero: {
      enabled: true,
      title: "Welcome to Our Store",      // ❌ Redundant
      subtitle: "Best products",           // ❌ Redundant
      block: "hero1",
      config: {
        ctaText: "Shop Now",
        ctaLink: "/products",
        showCta: true,
        backgroundImage: "/hero-bg.jpg"
      }
    },
    about: {
      enabled: true,
      title: "About Us",                   // ❌ Redundant
      subtitle: "Our Story",               // ❌ Redundant
      block: "about1",
      config: {
        content: "Long description...",    // ❌ Should be permanent
        image: "/about.jpg",               // ❌ Should be permanent
        features: [...]                    // ❌ Should be permanent
      }
    },
    testimonials: {
      enabled: true,
      title: "Testimonials",
      subtitle: "What they say",
      block: "testimonials1",
      config: {
        items: [...]                       // ❌ Should be permanent
      }
    },
    // ... dst
  }
}
```

### SESUDAH (Target State)
```typescript
// Tenant Model - WITH NEW PERMANENT FIELDS
{
  // ==========================================
  // EXISTING FIELDS (Keep as-is)
  // ==========================================
  name: "Toko ABC",
  description: "Deskripsi toko",
  logo: "/logo.png",
  banner: "/banner.jpg",
  whatsapp: "08123456789",
  email: "toko@abc.com",
  phone: "021-1234567",
  address: "Jl. Contoh No. 123",
  socialLinks: { instagram: "...", facebook: "..." },

  // ==========================================
  // NEW PERMANENT STORE INFO FIELDS
  // ==========================================

  // 📦 HERO DATA (NEW)
  heroTitle?: string,              // "Welcome to Our Store"
  heroSubtitle?: string,           // "Best products for you"
  heroCtaText?: string,            // "Shop Now"
  heroCtaLink?: string,            // "/products"
  heroBackgroundImage?: string,    // "/hero-bg.jpg"

  // 📦 ABOUT DATA (NEW)
  aboutTitle?: string,             // "About Us"
  aboutSubtitle?: string,          // "Our Story"
  aboutContent?: string,           // Long description
  aboutImage?: string,             // "/about.jpg"
  aboutFeatures?: Json,            // [{ title, description, icon }]

  // 📦 TESTIMONIALS DATA (NEW)
  testimonialsTitle?: string,      // "What Our Customers Say"
  testimonialsSubtitle?: string,   // "Real reviews from real people"
  testimonials?: Json,             // [{ name, role, content, rating, avatar }]

  // 📦 CONTACT DATA (NEW)
  contactTitle?: string,           // "Get In Touch"
  contactSubtitle?: string,        // "We'd love to hear from you"
  contactMapUrl?: string,          // Google Maps embed URL
  contactShowMap?: boolean,        // true/false
  contactShowForm?: boolean,       // true/false

  // 📦 CTA DATA (NEW)
  ctaTitle?: string,               // "Ready to Start?"
  ctaSubtitle?: string,            // "Join us today"
  ctaButtonText?: string,          // "Get Started"
  ctaButtonLink?: string,          // "/products"
  ctaButtonStyle?: string,         // "primary" | "secondary" | "outline"

  // ==========================================
  // LANDING CONFIG (Simplified - Block Selection Only)
  // ==========================================
  landingConfig: {
    template: "modern-starter",
    hero: {
      enabled: true,
      block: "hero1",               // ✅ ONLY BLOCK SELECTION
    },
    about: {
      enabled: true,
      block: "about2",              // ✅ ONLY BLOCK SELECTION
    },
    products: {
      enabled: true,
      block: "products1",           // ✅ ONLY BLOCK SELECTION
      config: {
        displayMode: "featured",    // ✅ Meta config (not data)
        limit: 8,                   // ✅ Meta config (not data)
        showViewAll: true           // ✅ Meta config (not data)
      }
    },
    testimonials: {
      enabled: true,
      block: "testimonials1",       // ✅ ONLY BLOCK SELECTION
    },
    contact: {
      enabled: true,
      block: "contact1",            // ✅ ONLY BLOCK SELECTION
    },
    cta: {
      enabled: true,
      block: "cta1",                // ✅ ONLY BLOCK SELECTION
    }
  }
}
```

---

## 🗄️ DATABASE SCHEMA CHANGES

### File: `server/prisma/schema.prisma`

#### BEFORE
```prisma
model Tenant {
  id            String       @id @default(cuid())
  slug          String       @unique
  name          String
  category      String
  description   String?
  whatsapp      String
  email         String       @unique
  phone         String?
  address       String?
  logo          String?
  banner        String?
  theme         Json?
  landingConfig Json?       // ⚠️ Menyimpan semua data + block

  // SEO, Payment, Shipping fields...
}
```

#### AFTER (Add New Fields)
```prisma
model Tenant {
  id            String       @id @default(cuid())
  slug          String       @unique
  name          String
  category      String
  description   String?
  whatsapp      String
  email         String       @unique
  phone         String?
  address       String?
  logo          String?
  banner        String?
  theme         Json?
  landingConfig Json?       // ✅ Simplified - block selection only

  // ==========================================
  // STORE INFORMATION - HERO SECTION
  // ==========================================
  heroTitle         String?   @db.VarChar(200)
  heroSubtitle      String?   @db.VarChar(300)
  heroCtaText       String?   @db.VarChar(50)
  heroCtaLink       String?   @db.VarChar(500)
  heroBackgroundImage String?

  // ==========================================
  // STORE INFORMATION - ABOUT SECTION
  // ==========================================
  aboutTitle        String?   @db.VarChar(200)
  aboutSubtitle     String?   @db.VarChar(300)
  aboutContent      String?   @db.Text
  aboutImage        String?
  aboutFeatures     Json?     // [{ icon, title, description }]

  // ==========================================
  // STORE INFORMATION - TESTIMONIALS SECTION
  // ==========================================
  testimonialsTitle    String?   @db.VarChar(200)
  testimonialsSubtitle String?   @db.VarChar(300)
  testimonials         Json?     // [{ id, name, role, content, rating, avatar }]

  // ==========================================
  // STORE INFORMATION - CONTACT SECTION
  // ==========================================
  contactTitle      String?   @db.VarChar(200)
  contactSubtitle   String?   @db.VarChar(300)
  contactMapUrl     String?
  contactShowMap    Boolean   @default(false)
  contactShowForm   Boolean   @default(true)

  // ==========================================
  // STORE INFORMATION - CTA SECTION
  // ==========================================
  ctaTitle          String?   @db.VarChar(200)
  ctaSubtitle       String?   @db.VarChar(300)
  ctaButtonText     String?   @db.VarChar(50)
  ctaButtonLink     String?   @db.VarChar(500)
  ctaButtonStyle    String?   @db.VarChar(20) @default("primary")

  // SEO, Payment, Shipping fields...
  // ... (existing fields remain)

  // Relations
  products      Product[]
  customers     Customer[]
  orders        Order[]

  @@index([slug])
  @@index([category])
  @@index([status])
}
```

### Migration Steps
```bash
# 1. Create migration
npx prisma migrate dev --name add_store_information_fields

# 2. Generate Prisma Client
npx prisma generate
```

---

## 🎨 UI/UX CHANGES

### 1. **Informasi Toko Page** (NEW/ENHANCED)

**Route**: `/dashboard/settings` atau `/dashboard/store-info`

**Layout**: Accordion-based sections

```tsx
<Accordion type="multiple">
  {/* HERO SECTION */}
  <AccordionItem value="hero">
    <AccordionTrigger>
      <Target className="h-5 w-5" />
      Hero - Banner Utama
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-4">
        <Input label="Judul Hero" name="heroTitle" />
        <Input label="Subtitle Hero" name="heroSubtitle" />
        <Input label="Teks Tombol CTA" name="heroCtaText" />
        <Input label="Link Tombol CTA" name="heroCtaLink" />
        <ImageUpload label="Background Image" name="heroBackgroundImage" />
      </div>
    </AccordionContent>
  </AccordionItem>

  {/* ABOUT SECTION */}
  <AccordionItem value="about">
    <AccordionTrigger>
      <BookOpen className="h-5 w-5" />
      About - Tentang Toko
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-4">
        <Input label="Judul" name="aboutTitle" />
        <Input label="Subtitle" name="aboutSubtitle" />
        <Textarea label="Deskripsi Lengkap" name="aboutContent" rows={6} />
        <ImageUpload label="Gambar About" name="aboutImage" />
        <FeaturesEditor
          label="Fitur/Keunggulan"
          items={aboutFeatures}
          onChange={...}
        />
      </div>
    </AccordionContent>
  </AccordionItem>

  {/* PRODUCTS SECTION */}
  <AccordionItem value="products">
    <AccordionTrigger>
      <ShoppingBag className="h-5 w-5" />
      Products - Katalog Produk
    </AccordionTrigger>
    <AccordionContent>
      <p className="text-sm text-muted-foreground">
        Produk dikelola di menu <Link href="/dashboard/products">Manajemen Produk</Link>.
        Data produk otomatis ditampilkan di Landing Page.
      </p>
    </AccordionContent>
  </AccordionItem>

  {/* TESTIMONIALS SECTION */}
  <AccordionItem value="testimonials">
    <AccordionTrigger>
      <Star className="h-5 w-5" />
      Testimonials - Testimoni Pelanggan
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-4">
        <Input label="Judul" name="testimonialsTitle" />
        <Input label="Subtitle" name="testimonialsSubtitle" />
        <TestimonialEditor
          items={testimonials}
          onChange={...}
        />
      </div>
    </AccordionContent>
  </AccordionItem>

  {/* CONTACT SECTION */}
  <AccordionItem value="contact">
    <AccordionTrigger>
      <Phone className="h-5 w-5" />
      Contact - Informasi Kontak
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-4">
        <Input label="Judul" name="contactTitle" />
        <Input label="Subtitle" name="contactSubtitle" />
        <Input label="Google Maps URL" name="contactMapUrl" />
        <Switch label="Tampilkan Map" name="contactShowMap" />
        <Switch label="Tampilkan Form Kontak" name="contactShowForm" />
        <p className="text-sm text-muted-foreground">
          Info kontak (WhatsApp, Email, Phone, Address) diambil dari
          <strong> Informasi Dasar Toko</strong> di atas.
        </p>
      </div>
    </AccordionContent>
  </AccordionItem>

  {/* CTA SECTION */}
  <AccordionItem value="cta">
    <AccordionTrigger>
      <Rocket className="h-5 w-5" />
      CTA - Call to Action
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-4">
        <Input label="Judul CTA" name="ctaTitle" />
        <Input label="Subtitle CTA" name="ctaSubtitle" />
        <Input label="Teks Tombol" name="ctaButtonText" />
        <Input label="Link Tombol" name="ctaButtonLink" />
        <Select label="Style Tombol" name="ctaButtonStyle">
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </Select>
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>

<Button type="submit" className="mt-6">
  Simpan Informasi Toko
</Button>
```

### 2. **Landing Builder** (REFACTORED)

**Route**: `/dashboard/landing-builder/customize`

**Focus**: Block selection + Enable/Disable ONLY

```tsx
{/* HERO SECTION */}
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <h3>Hero Section</h3>
        <p className="text-sm text-muted-foreground">
          Pilih style tampilan hero
        </p>
      </div>
      <Switch
        checked={config.hero.enabled}
        onCheckedChange={...}
      />
    </div>
  </CardHeader>

  <CardContent>
    {/* Block Selection */}
    <BlockSelector
      section="hero"
      selected={config.hero.block}
      options={AVAILABLE_BLOCKS.hero} // hero1-hero200
      onSelect={...}
    />

    {/* Preview with PERMANENT data from Tenant */}
    <div className="mt-4 p-4 bg-muted rounded-lg">
      <p className="text-sm font-medium mb-2">Preview Data:</p>
      <div className="text-xs space-y-1">
        <p><strong>Title:</strong> {tenant.heroTitle || tenant.name}</p>
        <p><strong>Subtitle:</strong> {tenant.heroSubtitle || tenant.description}</p>
        <p><strong>CTA:</strong> {tenant.heroCtaText || "Lihat Produk"}</p>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        ✏️ Edit data di <Link href="/dashboard/settings">Informasi Toko</Link>
      </p>
    </div>
  </CardContent>
</Card>

{/* Similar for About, Products, Testimonials, Contact, CTA */}
```

---

## 🔧 IMPLEMENTATION PHASES

### **Phase 1: Database & Backend** ⚙️

#### 1.1 Update Prisma Schema
- [ ] Add new fields to `Tenant` model
- [ ] Create migration
- [ ] Run migration on database
- [ ] Generate Prisma Client

#### 1.2 Update Backend DTOs & Validators
- [ ] `server/src/dto/tenant.dto.ts` - Add store info fields
- [ ] `server/src/validators/tenant.validator.ts` - Validate new fields
- [ ] Update `landingConfig` validator to accept simplified structure

#### 1.3 Update Tenant API Endpoints
- [ ] `PUT /api/tenants/:id` - Accept new store info fields
- [ ] `GET /api/tenants/:slug` - Return new store info fields
- [ ] Add endpoint `PUT /api/tenants/:id/store-info` (optional dedicated endpoint)

**Files to Modify:**
```
server/prisma/schema.prisma
server/src/dto/tenant.dto.ts
server/src/validators/tenant.validator.ts
server/src/validators/landing-config.validator.ts
server/src/modules/tenants/tenants.controller.ts
server/src/modules/tenants/tenants.service.ts
```

---

### **Phase 2: Frontend Types & Utils** 📦

#### 2.1 Update TypeScript Types
- [ ] `client/src/types/tenant.ts` - Add store info fields to `Tenant` type
- [ ] `client/src/types/landing.ts` - Simplify `LandingConfig` types

#### 2.2 Update Landing Helper Functions
- [ ] `client/src/lib/landing/extract-helpers.ts` - Change data source from config to tenant
- [ ] Update fallback logic to use tenant fields as primary source

**Files to Modify:**
```
client/src/types/tenant.ts
client/src/types/landing.ts
client/src/lib/landing/extract-helpers.ts
```

---

### **Phase 3: Informasi Toko UI** 🎨

#### 3.1 Create/Update Store Info Form
- [ ] Create `client/src/app/(dashboard)/dashboard/settings/store-info/page.tsx`
- [ ] Create `client/src/components/store-info/store-info-form.tsx`
- [ ] Create accordion sections for each block type
- [ ] Add form validation
- [ ] Connect to API endpoint

#### 3.2 Create Reusable Form Components
- [ ] `<FeaturesEditor />` - For about features
- [ ] `<TestimonialEditor />` - For testimonials (reuse from landing-builder)
- [ ] `<ImageUpload />` - For image uploads

**New Files:**
```
client/src/app/(dashboard)/dashboard/settings/store-info/page.tsx
client/src/components/store-info/store-info-form.tsx
client/src/components/store-info/hero-section.tsx
client/src/components/store-info/about-section.tsx
client/src/components/store-info/testimonials-section.tsx
client/src/components/store-info/contact-section.tsx
client/src/components/store-info/cta-section.tsx
```

---

### **Phase 4: Refactor Landing Builder** 🛠️

#### 4.1 Simplify Landing Builder Component
- [ ] Remove data input fields from `landing-builder.tsx`
- [ ] Keep only: Enable/Disable toggle + Block Selection
- [ ] Show preview of data from tenant (read-only)
- [ ] Add link to "Edit in Informasi Toko"

#### 4.2 Update Block Selector
- [ ] `client/src/components/landing-builder/block-selector.tsx`
- [ ] Show visual preview of each block variant
- [ ] Support hero1-hero200, about1-about200, etc.

**Files to Modify:**
```
client/src/components/landing-builder/landing-builder.tsx
client/src/components/landing-builder/block-selector.tsx
client/src/app/(dashboard)/dashboard/landing-builder/customize/page.tsx
```

---

### **Phase 5: Update Landing Components** 🚀

#### 5.1 Update Tenant Wrapper Components
- [ ] `tenant-hero.tsx` - Get data from tenant props (not config)
- [ ] `tenant-about.tsx` - Get data from tenant props (not config)
- [ ] `tenant-testimonials.tsx` - Get data from tenant props (not config)
- [ ] `tenant-contact.tsx` - Get data from tenant props (not config)
- [ ] `tenant-cta.tsx` - Get data from tenant props (not config)

#### 5.2 Update Landing Preview
- [ ] `live-preview.tsx` - Pass tenant data to components
- [ ] Update props to include tenant store info fields

**Files to Modify:**
```
client/src/components/landing/tenant-hero.tsx
client/src/components/landing/tenant-about.tsx
client/src/components/landing/tenant-testimonials.tsx
client/src/components/landing/tenant-contact.tsx
client/src/components/landing/tenant-cta.tsx
client/src/components/landing-builder/live-preview.tsx
```

---

### **Phase 6: Data Migration Script** 🔄

#### 6.1 Create Migration Script
- [ ] Script to migrate existing `landingConfig` data to new tenant fields
- [ ] Run for all existing tenants
- [ ] Backup before migration

**Script Location:**
```
server/scripts/migrate-landing-to-store-info.ts
```

**Script Logic:**
```typescript
// For each tenant:
// 1. Read landingConfig.hero.title → tenant.heroTitle
// 2. Read landingConfig.hero.subtitle → tenant.heroSubtitle
// 3. Read landingConfig.about.config.content → tenant.aboutContent
// ... etc for all sections
// 4. Simplify landingConfig to only keep block selection
// 5. Save tenant
```

---

### **Phase 7: Testing & Documentation** ✅

#### 7.1 Testing
- [ ] Test store info form (create, update)
- [ ] Test landing builder with new data source
- [ ] Test landing page rendering with tenant data
- [ ] Test fallbacks when fields are empty
- [ ] Test migration script on sample data

#### 7.2 Documentation
- [ ] Update README with new architecture
- [ ] Document new API endpoints
- [ ] Document data migration process
- [ ] Create user guide for "Informasi Toko"

---

## 📝 DETAILED FIELD MAPPING

### HERO SECTION

| Current Location | New Location | Type | Description |
|-----------------|--------------|------|-------------|
| `landingConfig.hero.title` | `tenant.heroTitle` | `String?` | Judul hero |
| `landingConfig.hero.subtitle` | `tenant.heroSubtitle` | `String?` | Subtitle hero |
| `landingConfig.hero.config.ctaText` | `tenant.heroCtaText` | `String?` | Teks tombol CTA |
| `landingConfig.hero.config.ctaLink` | `tenant.heroCtaLink` | `String?` | Link tombol CTA |
| `landingConfig.hero.config.backgroundImage` | `tenant.heroBackgroundImage` | `String?` | Background image URL |
| `landingConfig.hero.config.showCta` | *(Remove)* | - | Always show if ctaText exists |
| `landingConfig.hero.config.overlayOpacity` | *(Remove)* | - | Use block default |
| `landingConfig.hero.block` | `landingConfig.hero.block` | `String` | ✅ Stay in landingConfig |
| `landingConfig.hero.enabled` | `landingConfig.hero.enabled` | `Boolean` | ✅ Stay in landingConfig |

**Fallback Logic:**
```typescript
// In tenant-hero.tsx
const title = tenant.heroTitle || tenant.name;
const subtitle = tenant.heroSubtitle || tenant.description;
const ctaText = tenant.heroCtaText || "Lihat Produk";
const ctaLink = tenant.heroCtaLink || "/products";
const backgroundImage = tenant.heroBackgroundImage || tenant.banner;
```

---

### ABOUT SECTION

| Current Location | New Location | Type | Description |
|-----------------|--------------|------|-------------|
| `landingConfig.about.title` | `tenant.aboutTitle` | `String?` | Judul section |
| `landingConfig.about.subtitle` | `tenant.aboutSubtitle` | `String?` | Subtitle section |
| `landingConfig.about.config.content` | `tenant.aboutContent` | `Text?` | Deskripsi lengkap |
| `landingConfig.about.config.image` | `tenant.aboutImage` | `String?` | Image URL |
| `landingConfig.about.config.features` | `tenant.aboutFeatures` | `Json?` | Array of features |
| `landingConfig.about.config.showImage` | *(Remove)* | - | Always show if image exists |
| `landingConfig.about.block` | `landingConfig.about.block` | `String` | ✅ Stay in landingConfig |
| `landingConfig.about.enabled` | `landingConfig.about.enabled` | `Boolean` | ✅ Stay in landingConfig |

**Fallback Logic:**
```typescript
const title = tenant.aboutTitle || "Tentang Kami";
const subtitle = tenant.aboutSubtitle || "";
const content = tenant.aboutContent || tenant.description;
const image = tenant.aboutImage || tenant.logo;
const features = tenant.aboutFeatures || [];
```

---

### PRODUCTS SECTION

| Current Location | New Location | Type | Description |
|-----------------|--------------|------|-------------|
| `landingConfig.products.title` | *(Hardcoded)* | - | "Produk Kami" |
| `landingConfig.products.subtitle` | *(Hardcoded)* | - | "Katalog produk terbaik" |
| `landingConfig.products.config.displayMode` | `landingConfig.products.config.displayMode` | `String` | ✅ Stay (meta config) |
| `landingConfig.products.config.limit` | `landingConfig.products.config.limit` | `Number` | ✅ Stay (meta config) |
| `landingConfig.products.config.showViewAll` | `landingConfig.products.config.showViewAll` | `Boolean` | ✅ Stay (meta config) |
| `landingConfig.products.block` | `landingConfig.products.block` | `String` | ✅ Stay in landingConfig |
| `landingConfig.products.enabled` | `landingConfig.products.enabled` | `Boolean` | ✅ Stay in landingConfig |

**Note**: Products data already comes from `Product` model via API, no need to duplicate in tenant.

---

### TESTIMONIALS SECTION

| Current Location | New Location | Type | Description |
|-----------------|--------------|------|-------------|
| `landingConfig.testimonials.title` | `tenant.testimonialsTitle` | `String?` | Judul section |
| `landingConfig.testimonials.subtitle` | `tenant.testimonialsSubtitle` | `String?` | Subtitle section |
| `landingConfig.testimonials.config.items` | `tenant.testimonials` | `Json?` | Array of testimonials |
| `landingConfig.testimonials.block` | `landingConfig.testimonials.block` | `String` | ✅ Stay in landingConfig |
| `landingConfig.testimonials.enabled` | `landingConfig.testimonials.enabled` | `Boolean` | ✅ Stay in landingConfig |

**Testimonials JSON Structure:**
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "role": "Customer",
    "content": "Great service!",
    "rating": 5,
    "avatar": "/avatars/john.jpg"
  }
]
```

**Fallback Logic:**
```typescript
const title = tenant.testimonialsTitle || "Testimoni";
const subtitle = tenant.testimonialsSubtitle || "Apa kata pelanggan kami";
const items = tenant.testimonials || [];
```

---

### CONTACT SECTION

| Current Location | New Location | Type | Description |
|-----------------|--------------|------|-------------|
| `landingConfig.contact.title` | `tenant.contactTitle` | `String?` | Judul section |
| `landingConfig.contact.subtitle` | `tenant.contactSubtitle` | `String?` | Subtitle section |
| `tenant.whatsapp` | `tenant.whatsapp` | `String` | ✅ Already exists |
| `tenant.email` | `tenant.email` | `String` | ✅ Already exists |
| `tenant.phone` | `tenant.phone` | `String?` | ✅ Already exists |
| `tenant.address` | `tenant.address` | `String?` | ✅ Already exists |
| `tenant.socialLinks` | `tenant.socialLinks` | `Json?` | ✅ Already exists |
| *(New)* | `tenant.contactMapUrl` | `String?` | Google Maps embed URL |
| `landingConfig.contact.config.showMap` | `tenant.contactShowMap` | `Boolean` | Show map toggle |
| `landingConfig.contact.config.showForm` | `tenant.contactShowForm` | `Boolean` | Show form toggle |
| `landingConfig.contact.block` | `landingConfig.contact.block` | `String` | ✅ Stay in landingConfig |
| `landingConfig.contact.enabled` | `landingConfig.contact.enabled` | `Boolean` | ✅ Stay in landingConfig |

**Fallback Logic:**
```typescript
const title = tenant.contactTitle || "Hubungi Kami";
const subtitle = tenant.contactSubtitle || "Kami siap membantu Anda";
const whatsapp = tenant.whatsapp;
const email = tenant.email;
const phone = tenant.phone;
const address = tenant.address;
const socialLinks = tenant.socialLinks || {};
const showMap = tenant.contactShowMap || false;
const showForm = tenant.contactShowForm ?? true;
```

---

### CTA SECTION

| Current Location | New Location | Type | Description |
|-----------------|--------------|------|-------------|
| `landingConfig.cta.title` | `tenant.ctaTitle` | `String?` | Judul CTA |
| `landingConfig.cta.subtitle` | `tenant.ctaSubtitle` | `String?` | Subtitle CTA |
| `landingConfig.cta.config.buttonText` | `tenant.ctaButtonText` | `String?` | Teks tombol |
| `landingConfig.cta.config.buttonLink` | `tenant.ctaButtonLink` | `String?` | Link tombol |
| `landingConfig.cta.config.style` | `tenant.ctaButtonStyle` | `String?` | Button style |
| `landingConfig.cta.block` | `landingConfig.cta.block` | `String` | ✅ Stay in landingConfig |
| `landingConfig.cta.enabled` | `landingConfig.cta.enabled` | `Boolean` | ✅ Stay in landingConfig |

**Fallback Logic:**
```typescript
const title = tenant.ctaTitle || "Siap Memulai?";
const subtitle = tenant.ctaSubtitle || "Bergabunglah dengan kami hari ini";
const buttonText = tenant.ctaButtonText || "Mulai Sekarang";
const buttonLink = tenant.ctaButtonLink || "/products";
const buttonStyle = tenant.ctaButtonStyle || "primary";
```

---

## 🎯 SUCCESS CRITERIA

### Before
❌ User harus input data hero di Landing Builder
❌ Data hilang saat ganti template
❌ Tidak ada single source of truth
❌ Landing Builder campur aduk (data + style)

### After
✅ User input data sekali di "Informasi Toko"
✅ Data permanent, tidak hilang ganti template
✅ Single source of truth (Tenant model)
✅ Landing Builder fokus ke block selection
✅ Data reusable across sections
✅ Better separation of concerns

---

## 🚨 RISK & MITIGATION

### Risk 1: Breaking Changes for Existing Users
**Mitigation:**
- Create data migration script
- Run migration before deploying
- Keep backward compatibility for 1 version
- Add fallback logic to read from both old and new location

### Risk 2: Complex Migration
**Mitigation:**
- Test migration on staging first
- Create rollback script
- Backup database before migration

### Risk 3: UI/UX Confusion
**Mitigation:**
- Clear messaging: "Edit data in Store Info"
- Add tooltips and help text
- Create user guide/tutorial

---

## 📚 REFERENCE FILES

### Key Files to Review
```
// Backend
server/prisma/schema.prisma
server/src/validators/landing-config.validator.ts
server/src/modules/tenants/tenants.service.ts

// Frontend Types
client/src/types/tenant.ts
client/src/types/landing.ts

// Landing Components
client/src/components/landing/tenant-hero.tsx
client/src/components/landing/tenant-about.tsx
client/src/components/landing/tenant-testimonials.tsx
client/src/components/landing/tenant-contact.tsx
client/src/components/landing/tenant-cta.tsx

// Landing Builder
client/src/components/landing-builder/landing-builder.tsx
client/src/app/(dashboard)/dashboard/landing-builder/customize/page.tsx

// Helper Functions
client/src/lib/landing/extract-helpers.ts
```

---

## ✅ NEXT STEPS

1. **Review Blueprint** - Pastikan semua requirements tercakup
2. **Confirm Approach** - Diskusi dengan team
3. **Create Tickets** - Break down ke task-task kecil
4. **Start Phase 1** - Database & Backend implementation
5. **Iterative Development** - Implement per phase
6. **Testing** - Test setiap phase sebelum lanjut
7. **Migration** - Run data migration script
8. **Deploy** - Deploy ke production

---

## 📞 QUESTIONS FOR CLARIFICATION

1. **Default Values**: Apakah perlu default values untuk fields baru?
2. **Validation**: Apakah ada field yang required? Max length?
3. **Image Upload**: Apakah perlu upload image langsung atau URL input saja?
4. **Migration**: Apakah semua existing tenant perlu di-migrate atau optional?
5. **Backward Compatibility**: Berapa lama kita maintain backward compatibility?

---

**Status**: ✅ Blueprint Complete - Ready for Review & Implementation
**Last Updated**: 2026-01-19
**Next Action**: Review & Get Approval


# Rekomendasi Reorganize Folder Components

## Current vs Recommended

| Current       | Recommended          | Alasan                                                                                |
| ------------- | -------------------- | ------------------------------------------------------------------------------------- |
| `store/`      | `storefront/`        | "store" ambigu (bisa settings/management). `storefront` jelas = public-facing catalog |
| `landing/`    | `tenant-landing/`    | Jelaskan bahwa ini landing page **untuk tenant**, bukan platform landing              |
| `cloudinary/` | _merge ke `upload/`_ | Hanya 1 file, terkait image handling                                                  |
| `ui/`         | `ui-extensions/`     | Lebih jelas bahwa ini **extends** shared UI                                           |

---

## Detail Perubahan

### 1. `store/` → `storefront/`

**Masalah:** "store" bisa berarti:

- Zustand store (state management)
- Store settings (pengaturan toko)
- Storefront (tampilan publik toko)

**Solusi:** Rename ke `storefront/` - jelas ini adalah **public-facing**
components untuk tampilan toko tenant.

```
# Before
components/store/product-card.tsx
components/store/cart-sheet.tsx

# After
components/storefront/product-card.tsx
components/storefront/cart-sheet.tsx
```

**Files to move:**

```
store/                      → storefront/
├── add-to-cart-button.tsx
├── cart-badge.tsx
├── cart-sheet.tsx
├── category-list.tsx
├── featured-products.tsx
├── index.ts
├── product-actions.tsx
├── product-card.tsx
├── product-filters.tsx
├── product-gallery.tsx
├── product-grid.tsx
├── product-info.tsx
├── product-pagination.tsx
├── product-share.tsx
├── related-products.tsx
├── shipping-info.tsx
├── store-breadcrumb.tsx    → storefront-breadcrumb.tsx
├── store-footer.tsx        → storefront-footer.tsx
├── store-header.tsx        → storefront-header.tsx
├── store-nav.tsx           → storefront-nav.tsx
├── store-not-found.tsx     → storefront-not-found.tsx
├── store-skeleton.tsx      → storefront-skeleton.tsx
├── whatsapp-checkout-dialog.tsx
└── whatsapp-order-button.tsx
```

---

### 2. `landing/` → `tenant-landing/`

**Masalah:** "landing" ambigu:

- Platform landing page (fibidy.com)
- Tenant landing page (tenant's custom landing)

**Solusi:** Rename ke `tenant-landing/` - jelas ini untuk **tenant's landing
page**.

```
# Before
components/landing/tenant-hero.tsx

# After
components/tenant-landing/hero.tsx  # bisa drop "tenant-" prefix di filename
```

**Files to move:**

```
landing/                    → tenant-landing/
├── blocks/                 → blocks/
│   ├── hero/
│   ├── about/
│   ├── products/
│   ├── testimonials/
│   ├── contact/
│   └── cta/
├── index.ts
├── tenant-hero.tsx         → hero-section.tsx
├── tenant-about.tsx        → about-section.tsx
├── tenant-products.tsx     → products-section.tsx
├── tenant-testimonials.tsx → testimonials-section.tsx
├── tenant-contact.tsx      → contact-section.tsx
└── tenant-cta.tsx          → cta-section.tsx
```

---

### 3. `cloudinary/` → merge ke `upload/`

**Masalah:**

- Hanya 1 file (`cld-image-wrapper.tsx`)
- Terkait image handling, sama seperti `upload/`

**Solusi:** Merge ke `upload/` folder.

```
# Before
components/cloudinary/cld-image-wrapper.tsx
components/upload/image-upload.tsx

# After
components/upload/cld-image-wrapper.tsx
components/upload/image-upload.tsx
```

**Alternative:** Bisa juga merge ke `ui-extensions/` karena ini wrapper
component.

---

### 4. `ui/` → `ui-extensions/` (Optional)

**Masalah:** `ui/` bisa confusing dengan `@umkm/shared/ui`

**Solusi:** Rename ke `ui-extensions/` untuk jelaskan bahwa ini **extends**
shared UI.

```
# Before
components/ui/optimized-image.tsx

# After
components/ui-extensions/optimized-image.tsx
```

---

## Final Structure

```
components/
├── auth/                    # Authentication (login, register, etc)
├── customers/               # Dashboard - Customer management
├── dashboard/               # Dashboard - Layout & navigation
├── discover/                # Public - Discover/marketplace page
├── landing-builder/         # Dashboard - Landing page builder
├── onboarding/              # Dashboard - Onboarding wizard
├── orders/                  # Dashboard - Order management
├── products/                # Dashboard - Product management
├── pwa/                     # PWA components
├── seo/                     # SEO JSON-LD schemas
├── settings/                # Dashboard - Settings forms
├── storefront/              # Public - Tenant's storefront (renamed from store/)
├── tenant-landing/          # Public - Tenant's landing page (renamed from landing/)
├── ui-extensions/           # Local UI extensions (renamed from ui/)
└── upload/                  # Image upload (merged cloudinary/)
```

---

## Grouping by Context

### Public-Facing (Visitor sees)

- `discover/` - Platform marketplace
- `storefront/` - Tenant's product catalog & cart
- `tenant-landing/` - Tenant's custom landing page

### Dashboard (Tenant owner sees)

- `dashboard/` - Layout & navigation
- `products/` - Product CRUD
- `orders/` - Order management
- `customers/` - Customer management
- `settings/` - Store settings
- `landing-builder/` - Landing page editor
- `onboarding/` - Setup wizard

### Shared/Utility

- `auth/` - Authentication flows
- `seo/` - SEO schemas
- `pwa/` - PWA features
- `upload/` - Image upload
- `ui-extensions/` - Custom UI components

---

## Import Path Changes

After reorganization, update imports:

```typescript
// Before
import { ProductCard } from '@/components/store/product-card';
import { TenantHero } from '@/components/landing/tenant-hero';

// After
import { ProductCard } from '@/components/storefront/product-card';
import { HeroSection } from '@/components/tenant-landing/hero-section';
```

---

## Migration Steps

1. **Create new folders** with new names
2. **Move files** to new locations
3. **Update imports** across all files
4. **Update index.ts** exports
5. **Delete old empty folders**
6. **Update README.md**

---

## Risk Assessment

| Change                         | Risk                 | Mitigation                                  |
| ------------------------------ | -------------------- | ------------------------------------------- |
| `store/` → `storefront/`       | HIGH - banyak import | Search & replace semua `@/components/store` |
| `landing/` → `tenant-landing/` | MEDIUM               | Search & replace                            |
| `cloudinary/` merge            | LOW - 1 file         | Simple move                                 |
| `ui/` → `ui-extensions/`       | LOW - 1 file         | Simple move                                 |

---

## Decision

- [ ] Approve `store/` → `storefront/`
- [ ] Approve `landing/` → `tenant-landing/`
- [ ] Approve `cloudinary/` → merge to `upload/`
- [ ] Approve `ui/` → `ui-extensions/`

**Ketik "EXECUTE" untuk mulai reorganize!**

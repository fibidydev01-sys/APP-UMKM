# Client Components

Dokumentasi struktur folder `components/` untuk `@umkm/client`.

## Struktur Folder

```
components/
├── auth/                    # Authentication components
├── cloudinary/              # Cloudinary image wrapper
├── customers/               # Customer management (dashboard)
├── dashboard/               # Dashboard layout & navigation
├── discover/                # Marketplace/discover page
├── landing/                 # Landing page sections & blocks
├── landing-builder/         # Landing page builder (dashboard)
├── onboarding/              # Onboarding wizard
├── orders/                  # Order management (dashboard)
├── products/                # Product management (dashboard)
├── pwa/                     # PWA install prompt
├── seo/                     # SEO JSON-LD schemas
├── settings/                # Settings forms (dashboard)
├── store/                   # Storefront components
├── ui/                      # Local UI extensions
└── upload/                  # Image upload components
```

---

## Detail per Folder

### `auth/` - Authentication

| File                       | Deskripsi                      |
| -------------------------- | ------------------------------ |
| `auth-guard.tsx`           | Protected route wrapper        |
| `auth-layout.tsx`          | Auth pages layout              |
| `auth-logo.tsx`            | Logo untuk auth pages          |
| `category-card.tsx`        | Category selection card        |
| `forgot-password-form.tsx` | Form forgot password           |
| `login-form.tsx`           | Form login                     |
| `register-form.tsx`        | Multi-step register form       |
| `register-steps/`          | Step components untuk register |

### `cloudinary/` - Image Wrapper

| File                    | Deskripsi                          |
| ----------------------- | ---------------------------------- |
| `cld-image-wrapper.tsx` | Cloudinary image component wrapper |

### `customers/` - Customer Management

| File                          | Deskripsi                 |
| ----------------------------- | ------------------------- |
| `customer-delete-dialog.tsx`  | Dialog konfirmasi hapus   |
| `customer-detail.tsx`         | Detail customer view      |
| `customer-form.tsx`           | Form create/edit customer |
| `customer-preview-drawer.tsx` | Quick preview drawer      |
| `customers-table.tsx`         | Data table customers      |
| `customers-table-columns.tsx` | Column definitions        |

### `dashboard/` - Dashboard Layout

| File                          | Deskripsi                |
| ----------------------------- | ------------------------ |
| `dashboard-layout.tsx`        | Main layout wrapper      |
| `dashboard-sidebar.tsx`       | Sidebar navigation       |
| `dashboard-header.tsx`        | Top header               |
| `dashboard-nav.tsx`           | Navigation items         |
| `dashboard-breadcrumb.tsx`    | Breadcrumb navigation    |
| `dashboard-quick-actions.tsx` | Quick action buttons     |
| `dashboard-shell.tsx`         | Content shell            |
| `mobile-navbar.tsx`           | Mobile bottom navigation |

### `discover/` - Marketplace

| File                        | Deskripsi             |
| --------------------------- | --------------------- |
| `discover-hero.tsx`         | Hero section          |
| `discover-header.tsx`       | Page header           |
| `discover-footer.tsx`       | Page footer           |
| `discover-search.tsx`       | Search component      |
| `category-filter-bar.tsx`   | Category filter       |
| `tenant-card.tsx`           | UMKM card             |
| `tenant-preview-drawer.tsx` | UMKM preview          |
| `umkm-showcase-section.tsx` | Featured UMKM section |
| `umkm-discover-section.tsx` | Discover grid section |
| `search-results-header.tsx` | Search results info   |
| `no-results.tsx`            | Empty state           |

### `landing/` - Landing Page Sections

| File                      | Deskripsi                                |
| ------------------------- | ---------------------------------------- |
| `tenant-hero.tsx`         | Hero section renderer                    |
| `tenant-about.tsx`        | About section renderer                   |
| `tenant-products.tsx`     | Products section renderer                |
| `tenant-testimonials.tsx` | Testimonials section renderer            |
| `tenant-contact.tsx`      | Contact section renderer                 |
| `tenant-cta.tsx`          | CTA section renderer                     |
| `blocks/`                 | Block variants (hero1-11, about1-5, dll) |

### `landing-builder/` - Landing Page Builder

| File                             | Deskripsi              |
| -------------------------------- | ---------------------- |
| `landing-builder.tsx`            | Main builder component |
| `landing-builder-simplified.tsx` | Simplified version     |
| `builder-sidebar.tsx`            | Settings sidebar       |
| `live-preview.tsx`               | Live preview panel     |
| `block-drawer.tsx`               | Block selection drawer |
| `section-sheet.tsx`              | Section editor sheet   |
| `template-selector.tsx`          | Template picker        |
| `testimonial-editor.tsx`         | Testimonial CRUD       |
| `device-frame.tsx`               | Device preview frame   |
| `preview-mode-toggle.tsx`        | Desktop/mobile toggle  |

### `onboarding/` - Onboarding Wizard

| File                      | Deskripsi             |
| ------------------------- | --------------------- |
| `onboarding-wizard.tsx`   | Main wizard component |
| `onboarding-step.tsx`     | Step item component   |
| `onboarding-dropdown.tsx` | Dropdown trigger      |
| `circular-progress.tsx`   | Progress indicator    |

### `orders/` - Order Management

| File                       | Deskripsi             |
| -------------------------- | --------------------- |
| `order-form.tsx`           | Form create order     |
| `order-detail.tsx`         | Order detail view     |
| `orders-table.tsx`         | Data table orders     |
| `orders-table-columns.tsx` | Column definitions    |
| `orders-table-toolbar.tsx` | Table toolbar         |
| `order-preview-drawer.tsx` | Quick preview         |
| `order-status-badge.tsx`   | Status badge          |
| `order-status-select.tsx`  | Status selector       |
| `order-cancel-dialog.tsx`  | Cancel confirmation   |
| `order-items-table.tsx`    | Order items list      |
| `invoice-template.tsx`     | Invoice template      |
| `invoice-modal.tsx`        | Invoice preview modal |

### `products/` - Product Management

| File                         | Deskripsi           |
| ---------------------------- | ------------------- |
| `product-form.tsx`           | Form create/edit    |
| `products-table.tsx`         | Data table products |
| `products-table-columns.tsx` | Column definitions  |
| `products-table-toolbar.tsx` | Table toolbar       |
| `product-preview-drawer.tsx` | Quick preview       |
| `product-delete-dialog.tsx`  | Delete confirmation |

### `pwa/` - Progressive Web App

| File                 | Deskripsi            |
| -------------------- | -------------------- |
| `install-prompt.tsx` | PWA install banner   |
| `pwa-provider.tsx`   | PWA context provider |

### `seo/` - SEO Schemas

| File                        | Deskripsi            |
| --------------------------- | -------------------- |
| `json-ld.tsx`               | JSON-LD renderer     |
| `product-schema.tsx`        | Product schema       |
| `product-list-schema.tsx`   | Product list schema  |
| `local-business-schema.tsx` | LocalBusiness schema |
| `organization-schema.tsx`   | Organization schema  |
| `breadcrumb-schema.tsx`     | Breadcrumb schema    |
| `faq-schema.tsx`            | FAQ schema           |
| `social-share.tsx`          | Social share buttons |

### `settings/` - Settings Forms

| File                           | Deskripsi           |
| ------------------------------ | ------------------- |
| `store-info-form.tsx`          | Basic store info    |
| `seo-settings.tsx`             | SEO settings        |
| `payment-settings.tsx`         | Payment methods     |
| `shipping-settings.tsx`        | Shipping settings   |
| `landing-content-settings.tsx` | Landing content     |
| `settings-nav.tsx`             | Settings navigation |
| `bank-account-dialog.tsx`      | Bank account form   |
| `ewallet-dialog.tsx`           | E-wallet form       |

### `store/` - Storefront

| File                           | Deskripsi           |
| ------------------------------ | ------------------- |
| `store-header.tsx`             | Store header        |
| `store-footer.tsx`             | Store footer        |
| `store-nav.tsx`                | Store navigation    |
| `store-breadcrumb.tsx`         | Breadcrumb          |
| `product-card.tsx`             | Product card        |
| `product-grid.tsx`             | Product grid        |
| `product-gallery.tsx`          | Image gallery       |
| `product-info.tsx`             | Product details     |
| `product-actions.tsx`          | Add to cart actions |
| `product-filters.tsx`          | Filter sidebar      |
| `product-pagination.tsx`       | Pagination          |
| `product-share.tsx`            | Share buttons       |
| `featured-products.tsx`        | Featured section    |
| `related-products.tsx`         | Related products    |
| `category-list.tsx`            | Category list       |
| `cart-sheet.tsx`               | Cart sidebar        |
| `cart-badge.tsx`               | Cart icon badge     |
| `add-to-cart-button.tsx`       | Add to cart button  |
| `shipping-info.tsx`            | Shipping info       |
| `whatsapp-order-button.tsx`    | WhatsApp order      |
| `whatsapp-checkout-dialog.tsx` | WhatsApp checkout   |
| `store-skeleton.tsx`           | Loading skeleton    |
| `store-not-found.tsx`          | 404 page            |

### `ui/` - Local UI Extensions

| File                  | Deskripsi             |
| --------------------- | --------------------- |
| `optimized-image.tsx` | Smart image component |

### `upload/` - Image Upload

| File                     | Deskripsi             |
| ------------------------ | --------------------- |
| `image-upload.tsx`       | Single image upload   |
| `multi-image-upload.tsx` | Multiple image upload |

---

## Shared vs Local

### Menggunakan dari `@umkm/shared/ui`:

- Button, Input, Dialog, Card, Table, Form, dll
- Semua UI primitives

### Local di `client/src/components/`:

- Business-specific components
- Domain logic (orders, products, customers)
- Layout components (dashboard, store)

---

## Candidates untuk Migrasi ke Shared

| Component                       | Priority | Notes                          |
| ------------------------------- | -------- | ------------------------------ |
| `upload/image-upload.tsx`       | HIGH     | Generic, types sudah di shared |
| `upload/multi-image-upload.tsx` | HIGH     | Generic, fix hardcoded folder  |
| `seo/json-ld.tsx`               | HIGH     | Zero dependencies              |
| `ui/optimized-image.tsx`        | HIGH     | Smart image routing            |

---

## Konvensi

1. **Naming**: `kebab-case` untuk file, `PascalCase` untuk component
2. **Index**: Setiap folder punya `index.ts` untuk re-export
3. **Types**: Import dari `@umkm/shared/types`
4. **UI**: Import dari `@umkm/shared/ui`
5. **Utils**: Import `cn` dari `@umkm/shared/utils`

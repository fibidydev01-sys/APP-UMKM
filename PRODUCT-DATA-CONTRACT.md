# 📦 Product & Checkout Data Contract

**Version:** 1.0
**Last Updated:** January 2026
**Purpose:** Single source of truth for product, cart, and checkout data structure between Dashboard, Public Store, and WhatsApp Checkout

---

## 🎯 Overview

This document defines the complete data contract for the product management and checkout system. All product-editable content flows through **unified state structures** ensuring data consistency across:

### System Architecture

```
Product Form ←→ Product API ←→ Database (Prisma)
      ↓                ↓               ↓
Public Store    Cart Store (Zustand)   ↓
      ↓                ↓               ↓
Product Page → Cart Sheet → WhatsApp Checkout
                                      ↓
                              Tenant Settings
                        (Payment, Shipping, SEO)
```

---

## 🗂️ Complete Data Structure

### 1. Product Entity (Core)

```typescript
interface Product {
  // Identity
  id: string;                    // UUID
  tenantId: string;              // Owner tenant ID
  slug: string | null;           // URL-friendly slug (auto-generated from name)

  // Basic Info
  name: string;                  // Product name (REQUIRED)
  description: string | null;    // Long-form description (paragraphs)
  category: string | null;       // Product category (from tenant's product categories)

  // Pricing
  price: number;                 // Selling price (REQUIRED, must be > 0)
  comparePrice: number | null;   // Original price for discount display
  costPrice: number | null;      // Cost price for profit calculation (private)

  // Inventory
  sku: string | null;            // Stock Keeping Unit (unique identifier)
  stock: number | null;          // Available stock quantity
  minStock: number | null;       // Minimum stock threshold for alerts (default: 5)
  trackStock: boolean;           // Toggle stock tracking (default: true)
  unit: string | null;           // Unit of measurement (default: "pcs")

  // Media
  images: string[];              // Array of Cloudinary URLs (max 5 images)

  // Status
  isActive: boolean;             // Visibility toggle (default: true)
  isFeatured: boolean;           // Featured/highlight toggle (default: false)

  // Metadata
  metadata: Record<string, unknown> | null; // Custom fields (JSON)
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

### 2. Cart Item Structure

```typescript
interface CartItem {
  // Product Info (cached from Product)
  id: string;                    // Product ID
  name: string;                  // Product name
  price: number;                 // Product price (at time of add)
  image: string | null;          // Primary image (first in images array)
  unit: string | null;           // Unit of measurement

  // Cart-specific
  qty: number;                   // Quantity in cart (default: 1)
  maxStock: number | undefined;  // Max available stock (if trackStock enabled)
}
```

### 3. Product Form Data

```typescript
interface ProductFormData {
  name: string;                  // REQUIRED
  description: string;           // Optional
  category: string;              // Optional
  sku: string;                   // Optional
  price: number;                 // REQUIRED, min: 0
  comparePrice: number | undefined; // Optional, must be >= price
  costPrice: number | undefined;    // Optional
  stock: number | undefined;        // Optional
  minStock: number;              // Default: 5
  trackStock: boolean;           // Default: true
  unit: string;                  // Default: 'pcs'
  images: string[];              // Default: []
  isActive: boolean;             // Default: true
  isFeatured: boolean;           // Default: false
}
```

### 4. Checkout Data Flow

```typescript
interface CheckoutData {
  // Customer Info (from form)
  name: string;                  // Customer name
  address: string;               // Shipping address
  notes: string;                 // Order notes (optional)

  // Cart Items
  items: CartItem[];             // Products in cart
  subtotal: number;              // Sum of (item.price * item.qty)

  // From Tenant Settings
  taxRate: number;               // Percentage (e.g., 11 for 11%)
  tax: number;                   // Calculated: subtotal * (taxRate / 100)

  // Shipping (from Tenant Settings)
  selectedCourier: string;       // Courier ID
  freeShippingThreshold: number | null; // Min. purchase for free shipping
  defaultShippingCost: number;   // Flat shipping cost
  shipping: number;              // Calculated: 0 if above threshold, else default

  // Payment (from Tenant Settings)
  selectedPayment: string;       // Payment option ID
  paymentMethods: PaymentMethods; // Available payment methods

  // Total
  total: number;                 // subtotal + tax + shipping
}
```

---

## 🔌 API Contract

### Endpoint: Get All Products (Dashboard)

```http
GET /api/products
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
```typescript
{
  search?: string;         // Search by name/description
  category?: string;       // Filter by category
  isActive?: boolean;      // Filter by status
  isFeatured?: boolean;    // Filter featured only
  lowStock?: boolean;      // Filter low stock items
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;           // Pagination page (default: 1)
  limit?: number;          // Items per page (default: 10)
}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "slug": "nasi-goreng-spesial",
      "name": "Nasi Goreng Spesial",
      "description": "Nasi goreng dengan bumbu rahasia...",
      "category": "Makanan Utama",
      "price": 25000,
      "comparePrice": 30000,
      "costPrice": 15000,
      "sku": "NGS-001",
      "stock": 50,
      "minStock": 5,
      "trackStock": true,
      "unit": "porsi",
      "images": [
        "https://res.cloudinary.com/fibidy/image/upload/v1234567890/products/nasi-goreng-1.jpg"
      ],
      "isActive": true,
      "isFeatured": true,
      "metadata": null,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-19T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### Endpoint: Get Product by ID (Dashboard)

```http
GET /api/products/:id
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
Returns single Product object (same structure as above)

### Endpoint: Get Product by Store & ID (Public)

```http
GET /api/products/store/:slug/:id
```

**Headers:** None (public endpoint)

**Response (200 OK):**
Returns single Product object (excludes `costPrice` for public)

### Endpoint: Create Product

```http
POST /api/products
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Nasi Goreng Spesial",
  "description": "Nasi goreng dengan bumbu rahasia...",
  "category": "Makanan Utama",
  "price": 25000,
  "comparePrice": 30000,
  "costPrice": 15000,
  "sku": "NGS-001",
  "stock": 50,
  "minStock": 5,
  "trackStock": true,
  "unit": "porsi",
  "images": [
    "https://res.cloudinary.com/fibidy/image/upload/v1234567890/products/nasi-goreng-1.jpg"
  ],
  "isActive": true,
  "isFeatured": true
}
```

**Response (201 Created):**
Returns created Product object

### Endpoint: Update Product

```http
PATCH /api/products/:id
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** Partial Product object (same as Create)

**Response (200 OK):**
Returns updated Product object

### Endpoint: Delete Product

```http
DELETE /api/products/:id
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## 🛒 Cart & Checkout Flow

### 1. Add to Cart

**Client (Zustand Store):**
```typescript
// Add product to cart
useCartStore.getState().addItem({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.images[0] || null,
  unit: product.unit,
  qty: 1,
  maxStock: product.trackStock ? product.stock : undefined,
});
```

### 2. Cart Sheet Display

**Component:** `CartSheet`
**Data Source:** Zustand cart store

**Displays:**
- Cart items with thumbnails
- Quantity controls (+ / -)
- Remove item button
- Subtotal calculation
- "Checkout" button → Opens WhatsApp Checkout Dialog

### 3. WhatsApp Checkout Dialog

**Component:** `WhatsAppCheckoutDialog`
**Data Source:**
- Cart items from Zustand
- Tenant settings from `PublicTenant`

**User Inputs:**
1. Name (text input)
2. Address (textarea)
3. Courier Selection (radio group) → from `tenant.shippingMethods.couriers`
4. Payment Method (radio group) → from `tenant.paymentMethods`
5. Notes (textarea, optional)

**Calculations:**
```typescript
const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
const tax = tenant.taxRate > 0 ? subtotal * (tenant.taxRate / 100) : 0;
const shipping = (tenant.freeShippingThreshold && subtotal >= tenant.freeShippingThreshold)
  ? 0
  : tenant.defaultShippingCost;
const total = subtotal + tax + shipping;
```

**WhatsApp Message Format:**
```
Halo {StoreName},

Saya ingin memesan:

• {Product 1} x{qty} = Rp {price}
• {Product 2} x{qty} = Rp {price}

---
Subtotal: Rp {subtotal}
Pajak ({taxRate}%): Rp {tax}
Ongkir: {shipping === 0 ? 'GRATIS 🎉' : 'Rp {shipping}'}
*Total: Rp {total}*
---

Nama: {customerName}
Alamat: {customerAddress}
Kurir: {selectedCourier}
Pembayaran: {selectedPayment}
Catatan: {notes}

Mohon konfirmasi ketersediaan.
Terima kasih! 🙏
```

**WhatsApp Link:**
```typescript
const link = `https://wa.me/${tenant.whatsapp}?text=${encodeURIComponent(message)}`;
window.open(link, '_blank');
```

---

## ⚙️ Settings Integration

### Payment Settings (`/dashboard/settings` → Payment Tab)

**Data Structure:**
```typescript
interface PaymentMethods {
  bankAccounts: BankAccount[];  // Transfer rekening
  eWallets: EWallet[];          // E-Wallet (GoPay, OVO, DANA, etc.)
  cod: CodSettings;             // Cash on Delivery
}

interface BankAccount {
  id: string;
  bank: BankName;               // 'BCA' | 'Mandiri' | 'BNI' | etc.
  accountNumber: string;
  accountName: string;
  enabled: boolean;
}

interface EWallet {
  id: string;
  provider: EWalletProvider;    // 'GoPay' | 'OVO' | 'DANA' | etc.
  number: string;
  name?: string;
  enabled: boolean;
}

interface CodSettings {
  enabled: boolean;
  note?: string;                // Optional note (e.g., "Min. order Rp 100.000")
}
```

**Used In:**
- WhatsApp Checkout Dialog → Payment method selection

### Shipping Settings (`/dashboard/settings` → Shipping Tab)

**Data Structure:**
```typescript
interface ShippingMethods {
  couriers: Courier[];
}

interface Courier {
  id: string;
  name: CourierName;            // 'JNE' | 'J&T Express' | 'SiCepat' | etc.
  enabled: boolean;
  note?: string;                // Optional note (e.g., "Same day delivery")
}

// Tenant fields
interface Tenant {
  freeShippingThreshold: number | null; // Min. purchase for free shipping (e.g., 100000)
  defaultShippingCost: number;          // Flat shipping cost (e.g., 10000)
}
```

**Used In:**
- WhatsApp Checkout Dialog → Courier selection & shipping calculation

### SEO Settings (`/dashboard/settings` → SEO Tab)

**Data Structure:**
```typescript
interface SeoSettings {
  metaTitle: string;            // Store meta title (for homepage)
  metaDescription: string;      // Store meta description
  socialLinks: SocialLinks;     // Social media links
}

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
}
```

**Used In:**
- Product Page → Social share buttons (share product to social media)
- Store Homepage → SEO meta tags

### Product Page SEO

**Component:** Product Detail Page (`/store/:slug/products/:id`)

**SEO Features:**
1. **Structured Data (JSON-LD):**
   - `ProductSchema` → Google Product Rich Results
   - `BreadcrumbSchema` → Breadcrumb navigation

2. **Meta Tags:**
   ```typescript
   createProductMetadata({
     product: {
       id, name, slug, description, price, images, category
     },
     tenant: {
       name, slug
     }
   })
   ```

3. **Social Share Buttons:**
   ```typescript
   <SocialShare
     url={productUrl}
     title={`${product.name} - ${tenant.name}`}
     description={product.description}
     variant="buttons"
   />
   ```

   **Platforms:**
   - WhatsApp
   - Facebook
   - Twitter
   - Copy Link

---

## 📐 Image Specifications

### Product Images
- **Max Images:** 5 per product
- **Recommended Size:** 1200x1200px
- **Aspect Ratio:** 1:1 (square) for consistency
- **Format:** JPG, PNG, or WebP
- **Cloudinary Folder:** `fibidy/products`
- **Upload:** Via `MultiImageUpload` component (Dashboard Product Form)
- **Display:**
  - Product Page: Image gallery with zoom
  - Cart: Thumbnail (optimized via `getThumbnailUrl()`)
  - Checkout: No images (WhatsApp text only)

---

## 🔄 Data Flow Diagrams

### 1. Product Creation Flow

```
Dashboard Product Form
       ↓
Form Validation (Zod)
       ↓
POST /api/products
       ↓
Prisma Database
       ↓
Refresh Product List
```

### 2. Product Purchase Flow

```
Public Store → Product Page
       ↓
Add to Cart (Zustand)
       ↓
Cart Sheet (view cart)
       ↓
Checkout Button
       ↓
WhatsApp Checkout Dialog
  ├─ Fetch tenant settings (payment, shipping)
  ├─ Calculate totals (subtotal + tax + shipping)
  └─ User fills form (name, address, courier, payment)
       ↓
Build WhatsApp message
       ↓
Open WhatsApp with pre-filled message
       ↓
Clear cart (after send)
```

### 3. Settings → Checkout Integration

```
Dashboard Settings → Payment Tab
       ↓
Save paymentMethods to Tenant
       ↓
GET /api/tenants/by-slug/:slug (Public)
       ↓
PublicTenant.paymentMethods
       ↓
WhatsApp Checkout Dialog → Payment options
```

---

## 📝 Validation Rules

### Product Form Validation

```typescript
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  description: z.string().optional(),
  category: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  comparePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  minStock: z.number().int().min(0).default(5),
  trackStock: z.boolean().default(true),
  unit: z.string().default('pcs'),
  images: z.array(z.string().url()).max(5, 'Maksimal 5 gambar'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
}).refine(
  (data) => !data.comparePrice || data.comparePrice >= data.price,
  {
    message: 'Harga coret harus lebih besar atau sama dengan harga jual',
    path: ['comparePrice'],
  }
);
```

### Cart Validation

```typescript
// Stock validation on add to cart
if (product.trackStock && product.stock !== null) {
  const currentQtyInCart = cartItems.find(item => item.id === product.id)?.qty || 0;
  if (currentQtyInCart >= product.stock) {
    toast.error('Stok tidak mencukupi');
    return;
  }
}
```

---

## ⚠️ Important Rules

### Read-Only Fields
- **id:** Auto-generated UUID by database
- **tenantId:** Set automatically from authenticated user
- **slug:** Auto-generated from product name on create
- **createdAt:** Auto-generated timestamp
- **updatedAt:** Auto-updated on PATCH

### Required Fields
- **name:** Must be non-empty string
- **price:** Must be > 0
- **trackStock:** Default true (always included)

### Optional vs Nullable
- **Optional (?)**: Field may not be in request
- **Null**: Field is in request but value is null
- Example: `comparePrice?: number | null` means field is optional AND can be null

### Stock Tracking
- When `trackStock = true`:
  - `stock` must be a number
  - Cart enforces stock limit
  - Low stock alerts shown when `stock <= minStock`
- When `trackStock = false`:
  - `stock` can be null
  - Unlimited quantity in cart
  - No stock alerts

### Image Management
- Images stored in Cloudinary
- Always use `MultiImageUpload` component for uploads
- Max 5 images per product (enforced by UI and validation)
- First image used as primary/thumbnail

---

## 🔗 File References

### Client (Frontend)
- **Product Page:** `/client/src/app/store/[slug]/products/[id]/page.tsx`
- **Product Form:** `/client/src/components/products/product-form.tsx`
- **Cart Sheet:** `/client/src/components/store/cart-sheet.tsx`
- **Checkout Dialog:** `/client/src/components/store/whatsapp-checkout-dialog.tsx`
- **Settings Page:** `/client/src/app/(dashboard)/dashboard/settings/page.tsx`
- **Type Definitions:** `/client/src/types/product.ts`, `/client/src/types/tenant.ts`
- **Cart Store:** `/client/src/stores/cart.ts`
- **Validation:** `/client/src/lib/validations/product.ts`

### Server (Backend)
- **Prisma Schema:** `/server/prisma/schema.prisma`
- **API Routes:** `/server/src/products/products.controller.ts`
- **Product Service:** `/server/src/products/products.service.ts`

### Documentation
- **Landing Contract:** `/LANDING-DATA-CONTRACT.md`
- **Product Contract:** `/PRODUCT-DATA-CONTRACT.md` (this file)

---

## 🎯 Integration Checklist

When working with products, ensure:

- [ ] Product form uses `productSchema` validation
- [ ] Images uploaded via `MultiImageUpload` component
- [ ] Cart store updates correctly on add/remove
- [ ] WhatsApp checkout fetches tenant settings
- [ ] Payment methods configured in Settings → Payment tab
- [ ] Shipping methods configured in Settings → Shipping tab
- [ ] SEO settings configured in Settings → SEO tab
- [ ] Social share buttons use correct product URL
- [ ] Stock tracking respects `trackStock` flag
- [ ] Price calculations include tax and shipping
- [ ] Free shipping threshold respected

---

## 🚀 Testing Scenarios

### Product Management
1. Create product with all fields
2. Create product with minimal fields (name + price only)
3. Upload multiple images (test max 5 limit)
4. Update product (partial update)
5. Delete product
6. Filter products by category, status, featured
7. Search products by name

### Cart & Checkout
1. Add product to cart (with stock tracking)
2. Add product to cart (without stock tracking)
3. Increase quantity (test stock limit)
4. Decrease quantity (test min 1)
5. Remove product from cart
6. Clear entire cart
7. Checkout with payment method (bank transfer)
8. Checkout with payment method (e-wallet)
9. Checkout with COD
10. Checkout with free shipping (above threshold)
11. Checkout with paid shipping (below threshold)

### Settings Integration
1. Add bank account → appears in checkout
2. Disable bank account → hidden in checkout
3. Add e-wallet → appears in checkout
4. Enable COD → appears in checkout
5. Add courier → appears in checkout
6. Set free shipping threshold → test calculation
7. Set tax rate → test calculation
8. Set social links → test share buttons

---

## 📅 Version History

### v1.0 (January 2026)
- ✅ Initial product data contract
- ✅ Cart & checkout flow documented
- ✅ Settings integration (Payment, Shipping, SEO)
- ✅ Social share integration
- ✅ WhatsApp checkout message format
- ✅ Image specifications
- ✅ Validation rules
- ✅ API endpoints documented

---

**End of Document**

For questions or updates, refer to:
- Technical Lead: Product & Checkout Flow
- Related Documentation: `/LANDING-DATA-CONTRACT.md`
- API Testing: Postman collection or manual tests

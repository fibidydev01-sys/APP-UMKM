# 🔀 PEMISAHAN REPO - REVISI AKURAT (NO AUTH IN WEB)

## 🎯 PRINSIP SEDERHANA

```
WEB.FIBIDY.COM (Pure Marketing)
├─ ❌ NO authentication
├─ ❌ NO database
├─ ❌ NO API calls
└─ ✅ 100% static content yang bisa di-cache selamanya

APP.FIBIDY.COM (Full Application)
├─ ✅ Authentication & authorization
├─ ✅ Database operations
├─ ✅ API endpoints
└─ ✅ Dynamic user data
```

---

## 🌐 WEB.FIBIDY.COM - PURE STATIC MARKETING

### ✅ **PAGES** (4 pages only - NO AUTH!)

```typescript
app/
├─ page.tsx                     // ✅ Homepage (NO API)
├─ about/page.tsx               // ✅ About page (NO API)
├─ cara-kerja/page.tsx          // ✅ How it works (NO API)
├─ fitur/page.tsx               // ✅ Features (NO API)
└─ harga/page.tsx               // ✅ Pricing (NO API)
```

**TOTAL: 5 halaman (termasuk homepage)**

### ✅ **COMPONENTS** - Pure Presentational

#### 1️⃣ **PLATFORM-LANDING** (17 components - NO API)

```typescript
components/platform-landing/
├─ landing-header.tsx           // ✅ Nav with links to app
├─ landing-footer.tsx           // ✅ Footer links
├─ hero-section.tsx             // ✅ Hero banner
├─ logos-section.tsx            // ✅ Partner logos (hardcoded)
├─ target-user-section.tsx      // ✅ Target audience
├─ problem-section.tsx          // ✅ Pain points
├─ solution-section.tsx         // ✅ Solutions
├─ fibidy-ai-section.tsx        // ✅ AI features showcase
├─ categories-section.tsx       // ✅ HARDCODED categories (no DB)
├─ honest-section.tsx           // ✅ Transparency section
├─ features-section.tsx         // ✅ Feature cards (hardcoded)
├─ how-it-works-section.tsx     // ✅ Steps explanation (hardcoded)
├─ testimonials-section.tsx     // ✅ HARDCODED testimonials (no DB)
├─ testimonial-highlight-section.tsx  // ✅ Highlighted testimonial
├─ lazy-testimonials.tsx        // ✅ Lazy loaded (still hardcoded)
├─ pricing-section.tsx          // ✅ Pricing cards (hardcoded)
├─ faq-section.tsx              // ✅ FAQ accordion (hardcoded)
└─ cta-section.tsx              // ✅ Call to action
```

**KEY POINT:** 
- Categories di web = **HARDCODED** (tidak dynamic dari DB)
- Testimonials di web = **HARDCODED** (tidak dari DB)
- Pricing = **HARDCODED** (tidak dari DB)

#### 2️⃣ **UI COMPONENTS** (60+ components - NO API)

```typescript
components/ui/
├─ All shadcn/ui components     // ✅ Pure UI
├─ button.tsx
├─ card.tsx
├─ dialog.tsx
├─ ... (60+ components)
└─ All animation components     // ✅ Aurora, ColorBlends, etc.
```

### ✅ **NAVIGATION STRATEGY**

```typescript
// components/platform-landing/landing-header.tsx
export function LandingHeader() {
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/cara-kerja">How It Works</Link>
        <Link href="/fitur">Features</Link>
        <Link href="/harga">Pricing</Link>
        
        {/* ⚠️ REDIRECT TO APP */}
        <Link href="https://app.fibidy.com/login">Login</Link>
        <Link href="https://app.fibidy.com/register">Sign Up</Link>
        <Link href="https://app.fibidy.com/discover">Explore Stores</Link>
      </nav>
    </header>
  );
}
```

### ✅ **CTA BUTTONS STRATEGY**

```typescript
// components/platform-landing/cta-section.tsx
export function CTASection() {
  return (
    <section>
      <h2>Siap Mulai Jualan Online?</h2>
      
      {/* ⚠️ REDIRECT TO APP */}
      <a href="https://app.fibidy.com/register">
        <Button size="lg">Daftar Gratis Sekarang</Button>
      </a>
      
      <a href="https://app.fibidy.com/discover">
        <Button variant="outline">Lihat Contoh Toko</Button>
      </a>
    </section>
  );
}
```

---

## 🚀 APP.FIBIDY.COM - FULL APPLICATION

### ⚠️ **AUTH PAGES** (MUST BE IN APP!)

```typescript
app/(auth)/
├─ login/page.tsx               // ⚠️ Needs API for authentication
├─ register/page.tsx            // ⚠️ Needs API to create account
└─ forgot-password/page.tsx     // ⚠️ Needs API to send email
```

**WHY IN APP:**
```typescript
// app/(auth)/login/page.tsx
export default function LoginPage() {
  return <LoginForm />;
  // ↓
  // LoginForm calls → /api/auth/login
  // API validates → database
  // Sets session → cookies
  // Redirects → /dashboard
}
```

### ⚠️ **DISCOVER PAGES** (WITH API)

```typescript
app/discover/
├─ page.tsx                     // ⚠️ Fetch real tenants from DB
└─ [category]/page.tsx          // ⚠️ Fetch tenants by category
```

**WHY IN APP:**
```typescript
// app/discover/page.tsx
export default async function DiscoverPage() {
  // ⚠️ Fetch from database
  const tenants = await prisma.tenant.findMany({
    where: { isActive: true },
    take: 50,
  });
  
  return <DiscoverGrid tenants={tenants} />;
}
```

### ⚠️ **DASHBOARD** (WITH API)

```typescript
app/(dashboard)/dashboard/
├─ page.tsx                     // ⚠️ Stats from DB
├─ customers/                   // ⚠️ CRUD operations
├─ orders/                      // ⚠️ CRUD operations
├─ products/                    // ⚠️ CRUD operations
└─ settings/                    // ⚠️ Update tenant info
```

### ⚠️ **STORE/TENANT SITES** (WITH API)

```typescript
app/store/[slug]/
├─ page.tsx                     // ⚠️ Fetch tenant by slug
├─ about/page.tsx               // ⚠️ Tenant about from DB
├─ products/page.tsx            // ⚠️ Products from DB
├─ products/[id]/page.tsx       // ⚠️ Product detail from DB
├─ testimonials/page.tsx        // ⚠️ Testimonials from DB
└─ contact/page.tsx             // ⚠️ Contact info from DB
```

### ⚠️ **LANDING BUILDER** (WITH API)

```typescript
app/landing-builder/
└─ page.tsx                     // ⚠️ Save/load config from DB
```

---

## 📊 UPDATED SUMMARY

### 🌐 **WEB.FIBIDY.COM**

| Type | Count | Description |
|------|-------|-------------|
| **Pages** | 5 | Home, About, Cara Kerja, Fitur, Harga |
| **Components** | 80+ | platform-landing (17) + ui (60+) |
| **API Calls** | 0 | Zero! Nada! Kosong! |
| **Database** | ❌ | No database needed |
| **Auth** | ❌ | No authentication |
| **Build Output** | Static HTML | Can be hosted on CDN |
| **Size** | ~5-10 MB | Super lightweight |
| **Deploy** | Vercel Free | Or any static host |

### 🚀 **APP.FIBIDY.COM**

| Type | Count | Description |
|------|-------|-------------|
| **Pages** | 45+ | Auth, Dashboard, Discover, Store, Builder |
| **Components** | 150+ | All dynamic components |
| **API Routes** | 30+ | Auth, CRUD, File upload, etc |
| **Database** | ✅ | PostgreSQL + Prisma |
| **Auth** | ✅ | Clerk / NextAuth |
| **Build Output** | Mixed | Static + Dynamic |
| **Size** | ~80-100 MB | Full-featured |
| **Deploy** | Vercel Pro | + Railway/Supabase |

---

## 🔗 LINKING STRATEGY

### From Marketing to App

```typescript
// web.fibidy.com

// Header
<Link href="https://app.fibidy.com/login">Login</Link>
<Link href="https://app.fibidy.com/register">Sign Up</Link>

// Hero CTA
<Button href="https://app.fibidy.com/register">
  Mulai Gratis
</Button>

// Explore Stores
<Button href="https://app.fibidy.com/discover">
  Lihat Contoh Toko
</Button>

// Footer
<Link href="https://app.fibidy.com/dashboard">Dashboard</Link>
```

### From App to Marketing

```typescript
// app.fibidy.com

// Public pages link back
<Link href="https://web.fibidy.com/about">About</Link>
<Link href="https://web.fibidy.com/fitur">Features</Link>
<Link href="https://web.fibidy.com/harga">Pricing</Link>

// Or use same domain with proxy
<Link href="/about">About</Link> // → Proxied to web.fibidy.com
```

---

## 📦 FINAL FILE STRUCTURE

### 🌐 **fibidy-web/** (Marketing Site)

```
fibidy-web/
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── page.tsx                    // ✅ Homepage
│   │   ├── about/page.tsx              // ✅ About
│   │   ├── cara-kerja/page.tsx         // ✅ How it works
│   │   ├── fitur/page.tsx              // ✅ Features
│   │   ├── harga/page.tsx              // ✅ Pricing
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── platform-landing/           // ✅ 17 marketing components
│   │   └── ui/                         // ✅ 60+ UI components
│   ├── lib/
│   │   ├── utils.ts
│   │   └── constants.ts
│   └── config/
│       └── site.ts                     // Site metadata
├── next.config.js
│   # output: 'export'
│   # No API, no auth, no database
├── package.json
└── README.md
```

**next.config.js:**
```javascript
module.exports = {
  output: 'export',              // ✅ Static export
  images: {
    unoptimized: true,           // ✅ No image optimization
  },
  trailingSlash: true,           // ✅ Better for static hosting
};
```

### 🚀 **fibidy-app/** (Full Application)

```
fibidy-app/
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/                     // ⚠️ Auth pages
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (dashboard)/                // ⚠️ Dashboard
│   │   ├── discover/                   // ⚠️ Discover
│   │   ├── store/[slug]/               // ⚠️ Tenant stores
│   │   ├── landing-builder/            // ⚠️ Builder
│   │   ├── api/                        // ⚠️ All API routes
│   │   └── layout.tsx
│   ├── components/
│   │   ├── auth/                       // Auth components
│   │   ├── dashboard/                  // Dashboard components
│   │   ├── discover/                   // Discover components
│   │   ├── customers/                  // Customer components
│   │   ├── orders/                     // Order components
│   │   ├── products/                   // Product components
│   │   ├── store/                      // Store components
│   │   ├── landing-builder/            // Builder components
│   │   └── ui/                         // UI components (duplicate)
│   ├── lib/
│   │   ├── api/
│   │   ├── prisma.ts
│   │   └── ...
│   └── types/
├── .env.local
│   # DATABASE_URL
│   # CLERK_SECRET_KEY
│   # UPLOADTHING_SECRET
├── next.config.js
└── package.json
```

---

## 🎯 KESIMPULAN REVISI

### ✅ **WEB.FIBIDY.COM** (Marketing Only)

```
PAGES:
✅ / (Homepage)
✅ /about
✅ /cara-kerja
✅ /fitur
✅ /harga

COMPONENTS:
✅ platform-landing/* (17 components)
✅ ui/* (60+ components)

REDIRECTS TO APP:
→ Login
→ Register
→ Discover
→ Dashboard
```

### ✅ **APP.FIBIDY.COM** (Full Application)

```
EVERYTHING ELSE:
⚠️ /login
⚠️ /register
⚠️ /forgot-password
⚠️ /discover
⚠️ /discover/[category]
⚠️ /dashboard/*
⚠️ /store/[slug]/*
⚠️ /landing-builder
⚠️ All API routes
⚠️ All database operations
```

---

## 💡 ALTERNATIVE: SINGLE DOMAIN WITH PROXY

Kalau mau tetap **satu domain** tapi **dua deployment**:

```nginx
# Cloudflare / Vercel Edge Config

# Marketing pages → web.fibidy.com deployment
fibidy.com/              → web-deployment
fibidy.com/about         → web-deployment
fibidy.com/cara-kerja    → web-deployment
fibidy.com/fitur         → web-deployment
fibidy.com/harga         → web-deployment

# App pages → app.fibidy.com deployment
fibidy.com/login         → app-deployment
fibidy.com/register      → app-deployment
fibidy.com/discover      → app-deployment
fibidy.com/dashboard     → app-deployment
fibidy.com/store/*       → app-deployment
fibidy.com/api/*         → app-deployment
```

**Benefit:** User tetap di `fibidy.com`, tapi backend split!

---

Sekarang **AKURAT** kan? 😎

Mau saya buatkan **migration script** untuk copy files yang bener? 🚀
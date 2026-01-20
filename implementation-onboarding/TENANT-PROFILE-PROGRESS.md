# Tenant Profile Progress Tracker

> **Inspirasi**: Lemon Squeezy onboarding setup progress
>
> Track kemajuan tenant dalam melengkapi profil bisnis mereka dari 0-100%
>
> **Data Source**: Aligned with `/LANDING-DATA-CONTRACT.md` (Unified State v2.1)

---

## 🎯 Konsep

Setiap tenant yang baru daftar akan punya **Profile Completion Progress** yang menunjukkan seberapa lengkap mereka setup toko online mereka.

- **0%** = Baru daftar, belum isi apa-apa
- **100%** = Profil lengkap sempurna, siap jualan!

Progress ini akan:
1. ✅ Ditampilkan di Dashboard tenant
2. ✅ Ada checklist item yang bisa di-cek satu-satu
3. ✅ Ada action button untuk setiap item ("Isi Sekarang")
4. ✅ Visual progress bar yang menarik
5. ✅ Badge/reward kalau udah 100%

---

## 🚨 Critical Requirements for Go Live

**Untuk tenant bisa "publish" dan mulai jualan, 2 item ini WAJIB:**

| Item | Field | Why Critical? |
|------|-------|---------------|
| 🎨 **Logo Toko** | `tenant.logo` | Brand identity utama, tampil di header dan semua halaman |
| 🖼️ **Hero Background Image** | `tenant.heroBackgroundImage` | First impression di landing page, membuat toko terlihat profesional |

**Onboarding Flow:**
- Wizard akan guide tenant untuk upload **Logo** dan **Hero Background** di step pertama
- Tanpa kedua item ini, tenant **tidak bisa publish** toko mereka
- Setelah critical items complete, tenant bisa mulai jualan (items lain optional tapi recommended)

---

## 📊 Progress Categories & Scoring

### **Total Score: 100 Points**

#### 1. **Business Identity** (15 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| Nama Toko | 0 | `tenant.name` | ✅ Auto (required) |
| 🚨 **Logo Toko** | 4 | `tenant.logo` | ✅ **CRITICAL** for go live |
| Banner Toko | 3 | `tenant.banner` | ❌ |
| Kategori Bisnis | 0 | `tenant.category` | ✅ Auto (required) |
| Deskripsi Singkat | 4 | `tenant.description` | ❌ |
| Warna Tema | 4 | `tenant.theme.primaryColor` | ❌ |

**Total: 15 points**
**Note:** Name & category auto-completed during registration (0 points)
**Critical:** Logo is REQUIRED before tenant can publish their store

---

#### 2. **Hero Section** (18 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| Hero Title | 4 | `tenant.heroTitle` | ❌ |
| Hero Subtitle | 3 | `tenant.heroSubtitle` | ❌ |
| Hero CTA Text | 2 | `tenant.heroCtaText` | ❌ |
| Hero CTA Link | 2 | `tenant.heroCtaLink` | ❌ |
| 🚨 **Hero Background Image** | 7 | `tenant.heroBackgroundImage` | ✅ **CRITICAL** for go live |

**Total: 18 points**
**Critical:** Hero Background Image is REQUIRED for professional first impression

---

#### 3. **About Section** (15 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| About Title | 2 | `tenant.aboutTitle` | ❌ |
| About Subtitle | 2 | `tenant.aboutSubtitle` | ❌ |
| About Content | 5 | `tenant.aboutContent` (min 50 chars) | ❌ |
| About Image | 4 | `tenant.aboutImage` | ❌ |
| About Features | 2 | `tenant.aboutFeatures` (min 1) | ❌ |

**Total: 15 points**

---

#### 4. **Testimonials Section** (12 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| Testimonials Title | 2 | `tenant.testimonialsTitle` | ❌ |
| Testimonials Subtitle | 2 | `tenant.testimonialsSubtitle` | ❌ |
| Minimal 1 Testimoni | 4 | `tenant.testimonials` (length >= 1) | ❌ |
| Minimal 3 Testimoni | 4 | `tenant.testimonials` (length >= 3) | ❌ |

**Total: 12 points**

---

#### 5. **Contact Section** (15 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| Contact Title | 1 | `tenant.contactTitle` | ❌ |
| Contact Subtitle | 1 | `tenant.contactSubtitle` | ❌ |
| WhatsApp | 5 | `tenant.whatsapp` | ✅ Highly recommended |
| Nomor Telepon | 2 | `tenant.phone` | ❌ |
| Email | 0 | `tenant.email` | ✅ Auto (from auth) |
| Alamat Lengkap | 4 | `tenant.address` (min 10 chars) | ❌ |
| Google Maps URL | 2 | `tenant.contactMapUrl` | ❌ |

**Total: 15 points**

---

#### 6. **CTA Section** (8 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| CTA Title | 2 | `tenant.ctaTitle` | ❌ |
| CTA Subtitle | 2 | `tenant.ctaSubtitle` | ❌ |
| CTA Button Text | 2 | `tenant.ctaButtonText` | ❌ |
| CTA Button Link | 2 | `tenant.ctaButtonLink` | ❌ |

**Total: 8 points**
**Note:** `ctaButtonStyle` tidak di-score (defaultable)

---

#### 7. **Products** (17 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| Minimal 1 Produk | 10 | `products.length >= 1` | ❌ |
| Minimal 5 Produk | 7 | `products.length >= 5` | ❌ |

**Total: 17 points**

---

## 🎨 UI/UX Design

### **Dashboard Widget**

```
┌─────────────────────────────────────────────────┐
│  🎯 Setup Profil Toko Anda                       │
├─────────────────────────────────────────────────┤
│                                                  │
│  [████████████░░░░░░░░] 75%                     │
│                                                  │
│  Selesaikan setup untuk meningkatkan visibilitas│
│  toko Anda dan menarik lebih banyak pelanggan!  │
│                                                  │
│  ✅ Business Identity (15/15)                   │
│  ⚠️  Hero Section (11/18)                       │
│      └─ Tambah Hero Background → [Isi Sekarang]│
│  ✅ About Section (15/15)                       │
│  ❌ Testimonials (0/12)                         │
│      └─ Tambah testimoni pertama                │
│  ⚠️  Contact Section (8/15)                     │
│      └─ Tambah WhatsApp (5 pts)                 │
│  ❌ CTA Section (0/8)                           │
│  ✅ Products (17/17)                            │
│                                                  │
│  [Lihat Detail Setup] [Dismiss]                 │
└─────────────────────────────────────────────────┘
```

### **Milestone Badges**

- 🥉 **Bronze** (25%) - "Getting Started"
- 🥈 **Silver** (50%) - "Half Way There"
- 🥇 **Gold** (75%) - "Almost Perfect"
- 💎 **Diamond** (100%) - "Profile Complete!"

---

### **Wizard Onboarding (Enterprise SaaS Style)**

**Inspirasi:** Claude, Documenso, enterprise SaaS onboarding

```tsx
┌─────────────────────────────────────────────────┐
│  Get started with Fibidy                        │
│  ○━━━━━━━━━━━━━━━━━━━━━━ 2 out of 6 steps left │
│                                  [•••] [Dismiss]│
├─────────────────────────────────────────────────┤
│                                                  │
│  ✅ 1. Upload your logo                         │
│      Your brand identity is set up!             │
│                                                  │
│  ✅ 2. Add hero background image                │
│      Your landing page looks professional       │
│                                                  │
│  ▼  3. Add your first product                   │
│      Upload products to start selling online.   │
│      You'll see how easy it is to manage your   │
│      catalog.                                   │
│      [Add Product →]                            │
│                                                  │
│  ○  4. Add customer testimonials                │
│      Build trust with social proof              │
│                                                  │
│  ○  5. Connect WhatsApp                         │
│      Enable direct customer communication       │
│                                                  │
│  ○  6. Customize your branding                  │
│      Add colors and banner for unique look      │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Key Features:**
- ✅ Expandable/collapsible steps (one open at a time)
- ✅ Circular progress indicator (steps remaining)
- ✅ Action buttons per step
- ✅ Dismissable (with option to restore)
- ✅ Step status: completed (✅), in-progress (▼), pending (○)
- ✅ Critical steps highlighted at top
- ✅ Dropdown menu: Dismiss, Give Feedback

**Implementation Reference:**
- Component pattern similar to Documenso onboarding
- Uses shadcn/ui components (Button, DropdownMenu)
- Tabler icons for status indicators
- Smooth animations for expand/collapse

---

## 💾 Data Structure

### **Backend: New Fields**

```prisma
model Tenant {
  // ... existing fields from LANDING-DATA-CONTRACT.md

  // Profile Progress (auto-calculated)
  profileProgress     Int       @default(0)  // 0-100
  profileCompletedAt  DateTime? // When reached 100%

  // Setup tracking
  setupDismissed      Boolean   @default(false)
  setupLastViewedAt   DateTime?
}
```

### **Helper Function**

```typescript
// lib/profile-progress.ts

export interface ProfileProgressItem {
  category: string;
  label: string;
  points: number;
  completed: boolean;
  field: string;
  action?: string; // URL to complete this item
}

export interface ProfileProgress {
  totalScore: number;        // 0-100
  totalPoints: number;       // Current points
  maxPoints: number;         // Always 100
  categories: {
    name: string;
    score: number;
    maxScore: number;
    items: ProfileProgressItem[];
  }[];
  milestone: 'bronze' | 'silver' | 'gold' | 'diamond' | null;
  isComplete: boolean;
  canPublish: boolean;       // true if critical requirements met (logo + hero background)
  criticalItems: {
    logo: boolean;
    heroBackground: boolean;
  };
}

export function calculateProfileProgress(
  tenant: Tenant,
  productsCount: number
): ProfileProgress {
  // Implementation here
}
```

---

## 🔄 Implementation Plan

### **Phase 1: Backend** ✅
- [ ] Add `profileProgress` field to Tenant model
- [ ] Create `calculateProfileProgress()` helper
- [ ] Create API endpoint `/api/tenants/me/progress`
- [ ] Auto-calculate progress on tenant update

### **Phase 2: Wizard Onboarding UI** 🧙‍♂️
- [ ] Create `OnboardingWizard` component (enterprise SaaS style)
- [ ] Implement expandable/collapsible steps
- [ ] Circular progress indicator (remaining steps)
- [ ] Critical steps (Logo + Hero Background) at top
- [ ] Action buttons per step with routing
- [ ] Dismiss/restore functionality
- [ ] Step status indicators (completed, in-progress, pending)
- [ ] Dropdown menu (Dismiss, Give Feedback)
- [ ] Smooth expand/collapse animations

### **Phase 3: Notifications** 🔔
- [ ] Toast when progress increases
- [ ] Celebration animation at 100%
- [ ] Email reminder if < 50% after 7 days

### **Phase 4: Gamification** 🎮
- [ ] Milestone badges
- [ ] Share achievement to social media
- [ ] Leaderboard (optional)

---

## 📐 Calculation Logic

### **Pseudocode (Aligned with LANDING-DATA-CONTRACT.md)**

```typescript
function calculateProfileProgress(tenant: Tenant, productsCount: number): ProfileProgress {
  let score = 0;

  // 🚨 CRITICAL REQUIREMENTS CHECK
  const hasLogo = !!tenant.logo;
  const hasHeroBackground = !!tenant.heroBackgroundImage;
  const canPublish = hasLogo && hasHeroBackground;

  // 1. Business Identity (15 pts)
  // name & category = auto (0 pts)
  if (hasLogo) score += 4; // CRITICAL
  if (tenant.banner) score += 3;
  if (tenant.description && tenant.description.length > 20) score += 4;
  if (tenant.theme?.primaryColor) score += 4;

  // 2. Hero Section (18 pts)
  if (tenant.heroTitle) score += 4;
  if (tenant.heroSubtitle) score += 3;
  if (tenant.heroCtaText) score += 2;
  if (tenant.heroCtaLink) score += 2;
  if (hasHeroBackground) score += 7; // CRITICAL

  // 3. About Section (15 pts)
  if (tenant.aboutTitle) score += 2;
  if (tenant.aboutSubtitle) score += 2;
  if (tenant.aboutContent && tenant.aboutContent.length > 50) score += 5;
  if (tenant.aboutImage) score += 4;
  if (tenant.aboutFeatures && tenant.aboutFeatures.length > 0) score += 2;

  // 4. Testimonials Section (12 pts)
  if (tenant.testimonialsTitle) score += 2;
  if (tenant.testimonialsSubtitle) score += 2;
  const testimonialsCount = tenant.testimonials?.length || 0;
  if (testimonialsCount >= 1) score += 4;
  if (testimonialsCount >= 3) score += 4;

  // 5. Contact Section (15 pts)
  if (tenant.contactTitle) score += 1;
  if (tenant.contactSubtitle) score += 1;
  if (tenant.whatsapp) score += 5;
  if (tenant.phone) score += 2;
  // email = auto (0 pts)
  if (tenant.address && tenant.address.length > 10) score += 4;
  if (tenant.contactMapUrl) score += 2;

  // 6. CTA Section (8 pts)
  if (tenant.ctaTitle) score += 2;
  if (tenant.ctaSubtitle) score += 2;
  if (tenant.ctaButtonText) score += 2;
  if (tenant.ctaButtonLink) score += 2;

  // 7. Products (17 pts)
  if (productsCount >= 1) score += 10;
  if (productsCount >= 5) score += 7;

  return {
    totalScore: score,
    maxPoints: 100,
    percentage: score,
    milestone: getMilestone(score),
    isComplete: score === 100,
    canPublish, // Can tenant publish their store?
    criticalItems: {
      logo: hasLogo,
      heroBackground: hasHeroBackground,
    },
  };
}

function getMilestone(score: number) {
  if (score >= 100) return 'diamond';
  if (score >= 75) return 'gold';
  if (score >= 50) return 'silver';
  if (score >= 25) return 'bronze';
  return null;
}
```

---

## 🎯 Success Metrics

**Goals:**
- 80% of new tenants reach 50% progress within 7 days
- 60% of tenants complete 100% within 30 days
- Reduce "empty store" abandonment by 40%

**Track:**
- Average completion time
- Most skipped items
- Drop-off points
- Conversion rate (registration → complete profile)

---

## 🚀 Future Enhancements

1. **Smart Suggestions**
   - AI-generated descriptions
   - Auto-suggest products based on category
   - Template testimonials

2. **Guided Tour**
   - Step-by-step onboarding wizard
   - Video tutorials per item
   - Live chat support

3. **Social Proof**
   - "X tenants completed setup today!"
   - Show success stories
   - Comparison with similar stores

4. **Rewards**
   - Discount on subscription for 100% completion
   - Featured store listing
   - Premium templates unlock

---

## 📝 Notes

- Progress auto-updates on every tenant data change
- Dismissing setup widget doesn't stop tracking
- Can re-show widget via settings
- Progress visible to tenant only (not public)
- Consider adding "Setup Later" skip option
- **Aligned with LANDING-DATA-CONTRACT.md v2.1 (Unified State)**

---

## 🔗 References

- **Data Contract**: `/LANDING-DATA-CONTRACT.md`
- **Unified State**: `/UNIFIED-STATE-STRUCTURE.md`
- **Type Definitions**: `/client/src/types/tenant.ts`
- **API Client**: `/client/src/lib/api/tenants.ts`

---

**Created:** 2026-01-20
**Last Updated:** 2026-01-20
**Version:** 2.0 (Aligned with Data Contract v2.1)
**Status:** 📋 Specification Phase

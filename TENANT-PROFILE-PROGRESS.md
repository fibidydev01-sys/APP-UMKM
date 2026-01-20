# Tenant Profile Progress Tracker

> **Inspirasi**: Lemon Squeezy onboarding setup progress
>
> Track kemajuan tenant dalam melengkapi profil bisnis mereka dari 0-100%

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

## 📊 Progress Categories & Scoring

### **Total Score: 100 Points**

#### 1. **Informasi Dasar** (25 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| Nama Toko | 5 | `tenant.name` | ✅ Auto (required) |
| Logo Toko | 5 | `tenant.logo` | ❌ |
| Deskripsi Singkat | 5 | `tenant.description` | ❌ |
| Kategori Bisnis | 3 | `tenant.category` | ✅ Auto (required) |
| Tagline | 2 | `tenant.tagline` | ❌ |
| Hero Background | 5 | `tenant.heroBackgroundImage` | ❌ |

**Total: 25 points**

---

#### 2. **Kontak & Lokasi** (20 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| WhatsApp | 7 | `tenant.whatsapp` | ❌ (highly recommended) |
| Nomor Telepon | 3 | `tenant.phone` | ❌ |
| Email | 3 | `tenant.email` | ❌ |
| Alamat Lengkap | 7 | `tenant.address` | ❌ |

**Total: 20 points**

---

#### 3. **Halaman About** (15 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| About Title | 3 | `tenant.aboutTitle` | ❌ |
| About Subtitle | 2 | `tenant.aboutSubtitle` | ❌ |
| About Content | 5 | `tenant.aboutContent` | ❌ |
| About Image | 3 | `tenant.aboutImage` | ❌ |
| About Features | 2 | `tenant.aboutFeatures` (min 1) | ❌ |

**Total: 15 points**

---

#### 4. **Testimoni** (10 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| Minimal 1 Testimoni | 5 | `tenant.testimonials` (length >= 1) | ❌ |
| Minimal 3 Testimoni | 5 | `tenant.testimonials` (length >= 3) | ❌ |

**Total: 10 points**

---

#### 5. **Produk** (20 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| Minimal 1 Produk | 10 | `products.length >= 1` | ❌ |
| Minimal 5 Produk | 10 | `products.length >= 5` | ❌ |

**Total: 20 points**

---

#### 6. **Landing Page Config** (10 points)
| Item | Points | Field | Required |
|------|--------|-------|----------|
| Hero Section Aktif | 2 | `landingConfig.hero.enabled` | ❌ |
| About Section Aktif | 2 | `landingConfig.about.enabled` | ❌ |
| Products Section Aktif | 2 | `landingConfig.products.enabled` | ❌ |
| Testimonials Section Aktif | 2 | `landingConfig.testimonials.enabled` | ❌ |
| Contact Section Aktif | 2 | `landingConfig.contact.enabled` | ❌ |

**Total: 10 points**

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
│  ✅ Informasi Dasar (25/25)                     │
│  ✅ Kontak & Lokasi (20/20)                     │
│  ⚠️  Halaman About (10/15)                      │
│      └─ Tambah About Image → [Isi Sekarang]    │
│  ❌ Testimoni (0/10)                            │
│      └─ Tambah minimal 1 testimoni              │
│  ✅ Produk (20/20)                              │
│  ✅ Landing Page Config (10/10)                 │
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

## 💾 Data Structure

### **Backend: New Table/Field**

```prisma
model Tenant {
  // ... existing fields

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
  milestone: 'bronze' | 'silver' | 'gold' | 'diamond';
  isComplete: boolean;
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

### **Phase 2: Dashboard Widget** 📊
- [ ] Create `ProfileProgressWidget` component
- [ ] Show in dashboard sidebar or top
- [ ] Progress bar with percentage
- [ ] Collapsible checklist
- [ ] Action buttons per item
- [ ] Dismiss functionality

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

### **Pseudocode**

```typescript
function calculateProfileProgress(tenant, productsCount) {
  let score = 0;

  // 1. Basic Info (25 pts)
  if (tenant.name) score += 5; // auto
  if (tenant.logo) score += 5;
  if (tenant.description && tenant.description.length > 20) score += 5;
  if (tenant.category) score += 3; // auto
  if (tenant.tagline) score += 2;
  if (tenant.heroBackgroundImage) score += 5;

  // 2. Contact (20 pts)
  if (tenant.whatsapp) score += 7;
  if (tenant.phone) score += 3;
  if (tenant.email) score += 3;
  if (tenant.address && tenant.address.length > 10) score += 7;

  // 3. About Page (15 pts)
  if (tenant.aboutTitle) score += 3;
  if (tenant.aboutSubtitle) score += 2;
  if (tenant.aboutContent && tenant.aboutContent.length > 50) score += 5;
  if (tenant.aboutImage) score += 3;
  if (tenant.aboutFeatures && tenant.aboutFeatures.length > 0) score += 2;

  // 4. Testimonials (10 pts)
  const testimonialsCount = tenant.testimonials?.length || 0;
  if (testimonialsCount >= 1) score += 5;
  if (testimonialsCount >= 3) score += 5;

  // 5. Products (20 pts)
  if (productsCount >= 1) score += 10;
  if (productsCount >= 5) score += 10;

  // 6. Landing Config (10 pts)
  const config = tenant.landingConfig;
  if (config?.hero?.enabled) score += 2;
  if (config?.about?.enabled) score += 2;
  if (config?.products?.enabled) score += 2;
  if (config?.testimonials?.enabled) score += 2;
  if (config?.contact?.enabled) score += 2;

  return {
    totalScore: score,
    maxPoints: 100,
    percentage: score,
    milestone: getMilestone(score),
    isComplete: score === 100
  };
}

function getMilestone(score) {
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

---

**Created:** 2026-01-20
**Last Updated:** 2026-01-20
**Status:** 📋 Specification Phase

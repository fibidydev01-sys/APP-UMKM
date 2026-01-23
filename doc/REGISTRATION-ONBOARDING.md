# 🎨 REGISTRATION ONBOARDING - UX FRIENDLY APPROACH

> **Status**: 📋 Blueprint Ready
>
> **Version**: 1.0
>
> **Date**: 2026-01-21
>
> **Based on**: Current RegisterForm, Category Config, User Inspiration Images

---

## 📋 Executive Summary

Refactor flow registrasi dari **kaku dropdown-based** menjadi **visual carousel/wizard** yang lebih UX friendly dengan:

1. ✅ Multi-step carousel approach (seperti gambar inspirasi)
2. ✅ Visual category cards dengan icon dan color
3. ✅ Clickable category selection (tidak perlu dropdown)
4. ✅ "Lainnya" option di paling bawah
5. ✅ Progress indicator yang jelas
6. ✅ Mobile-first responsive design

---

## 🎯 Problem Statement

### Current Flow (❌ Kaku):

```
Step 1: Informasi Toko
├── Nama Toko (input)
├── Slug (input)
├── Kategori (dropdown select) ⚠️ KAKU!
└── Deskripsi (textarea)

Step 2: Informasi Akun
├── Email (input)
├── Password (input)
└── WhatsApp (input)
```

**Masalah:**
- ❌ Dropdown kategori terlalu formal dan kaku
- ❌ User harus klik dropdown → scroll → cari → klik
- ❌ Tidak visual (no icon, no color preview)
- ❌ Tidak mobile-friendly untuk 15 kategori
- ❌ Flow terasa seperti form boring, bukan onboarding experience

---

## 💡 Solution: Visual Carousel Onboarding

### New Flow (✅ UX Friendly):

```
🎪 CAROUSEL APPROACH (Swipeable on mobile, Next/Prev on desktop)

Screen 1: Welcome
└── Hero image + tagline + "Mulai" button

Screen 2: Pilih Kategori Usaha ⭐ MAIN CHANGE
├── Visual grid of category cards (icon + label)
├── Each card is clickable (hover effect, selected state)
├── "Lainnya" card at bottom
└── "Lanjut" button (enabled when category selected)

Screen 3: Info Toko
├── Nama Toko (input)
├── Slug (auto-generated, editable)
└── Deskripsi (optional, textarea)

Screen 4: Kontak & Akun
├── Email (input)
├── Password (input)
└── WhatsApp (input)

Screen 5: Review & Submit
├── Preview semua info
├── Edit buttons per section
└── "Buat Toko Sekarang" button
```

---

## 🏗️ Architecture Design

### Folder Structure

```
client/src/
├── components/
│   └── auth/
│       ├── register-form.tsx           # REFACTOR: Main registration wizard
│       ├── register-steps/             # NEW FOLDER
│       │   ├── index.ts                # Barrel export
│       │   ├── step-welcome.tsx        # Screen 1: Welcome
│       │   ├── step-category.tsx       # Screen 2: Category selection ⭐
│       │   ├── step-store-info.tsx     # Screen 3: Store info
│       │   ├── step-account.tsx        # Screen 4: Account info
│       │   └── step-review.tsx         # Screen 5: Review
│       ├── category-card.tsx           # NEW: Reusable category card
│       └── progress-dots.tsx           # NEW: Carousel dots indicator
├── hooks/
│   └── use-register-wizard.ts          # NEW: Wizard state management
└── config/
    └── categories.ts                   # EXISTING (no changes)
```

---

## 🎨 UI/UX Design Specifications

### Screen 2: Category Selection (FOCUS)

```tsx
┌─────────────────────────────────────────────┐
│                                             │
│  ← [Progress: 2/5]                          │
│                                             │
│  🎯 Pilih Kategori Usaha                    │
│  Pilih yang paling sesuai dengan bisnis Anda│
│                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ 🛒      │ │ 🔧      │ │ ✂️      │       │
│  │ Warung  │ │ Bengkel │ │ Salon   │       │
│  │Kelontong│ │ Motor   │ │         │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ 👕      │ │ 🍽️      │ │ 📦      │       │
│  │ Laundry │ │ Catering│ │ Toko    │       │
│  │         │ │         │ │ Bangunan│       │
│  └─────────┘ └─────────┘ └─────────┘       │
│                                             │
│  ... (more categories)                      │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ 📋 Lainnya                            │  │
│  │ Jenis usaha tidak ada di daftar       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Lanjut →]                                 │
│                                             │
└─────────────────────────────────────────────┘

MOBILE: 2 columns grid
TABLET: 3 columns grid
DESKTOP: 4 columns grid
```

### Category Card Design

```tsx
// Card States
┌──────────────┐
│ [Icon]       │  Default: border-border, bg-card
│              │  Hover: border-primary, scale-105
│ Label        │  Selected: border-primary, bg-primary/10, checkmark
│              │
└──────────────┘

// Selected State
┌──────────────┐
│ [Icon] ✓     │
│              │  border-2 border-primary
│ Label        │  bg-primary/10
│              │  shadow-lg
└──────────────┘
```

### "Lainnya" Card Design

```tsx
┌─────────────────────────────────────┐
│ 📋  Lainnya                          │
│                                     │
│ Jenis usaha tidak ada di daftar     │
└─────────────────────────────────────┘

// Full-width card
// Different style (subtle, outline)
// Always at bottom
```

---

## 🔧 Component Implementation Plan

### 1. Category Card Component

**File: `client/src/components/auth/category-card.tsx`**

```typescript
"use client";

import { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryCard({
  icon: Icon,
  label,
  color,
  isSelected,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-200',
        'hover:scale-105 hover:shadow-md',
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg'
          : 'border-border bg-card hover:border-primary/50'
      )}
    >
      {/* Selected Checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      )}

      {/* Icon */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <Icon className="w-6 h-6" />
      </div>

      {/* Label */}
      <span className="text-sm font-medium text-center">
        {label}
      </span>
    </button>
  );
}
```

---

### 2. Step Category Component

**File: `client/src/components/auth/register-steps/step-category.tsx`**

```typescript
"use client";

import { CategoryCard } from '../category-card';
import { Button } from '@/components/ui/button';
import { getCategoryList } from '@/config/categories';
import { Package } from 'lucide-react';

interface StepCategoryProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCategory({
  selectedCategory,
  onSelectCategory,
  onNext,
  onBack,
}: StepCategoryProps) {
  const categories = getCategoryList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Pilih Kategori Usaha</h2>
        <p className="text-muted-foreground">
          Pilih yang paling sesuai dengan bisnis Anda
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.key}
            icon={cat.icon}
            label={cat.label}
            color={cat.color}
            isSelected={selectedCategory === cat.key}
            onClick={() => onSelectCategory(cat.key)}
          />
        ))}
      </div>

      {/* "Lainnya" Card - Full Width */}
      <button
        type="button"
        onClick={() => onSelectCategory('OTHER')}
        className={cn(
          'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all',
          selectedCategory === 'OTHER'
            ? 'border-primary bg-primary/10'
            : 'border-dashed border-muted-foreground/30 hover:border-primary/50'
        )}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
          <Package className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="text-left flex-1">
          <p className="font-medium">Lainnya</p>
          <p className="text-sm text-muted-foreground">
            Jenis usaha tidak ada di daftar
          </p>
        </div>
        {selectedCategory === 'OTHER' && (
          <Check className="w-5 h-5 text-primary" />
        )}
      </button>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Kembali
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedCategory}
          className="flex-1"
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}
```

---

### 3. Wizard State Management Hook

**File: `client/src/hooks/use-register-wizard.ts`**

```typescript
"use client";

import { useState } from 'react';
import { RegisterFormData } from '@/lib/validations';

interface WizardState extends Partial<RegisterFormData> {
  currentStep: number;
}

const TOTAL_STEPS = 5;

export function useRegisterWizard() {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    category: '',
    name: '',
    slug: '',
    description: '',
    email: '',
    password: '',
    whatsapp: '',
  });

  const updateState = (data: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (state.currentStep < TOTAL_STEPS) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  };

  const reset = () => {
    setState({
      currentStep: 1,
      category: '',
      name: '',
      slug: '',
      description: '',
      email: '',
      password: '',
      whatsapp: '',
    });
  };

  return {
    state,
    updateState,
    nextStep,
    prevStep,
    goToStep,
    reset,
    progress: (state.currentStep / TOTAL_STEPS) * 100,
    isFirstStep: state.currentStep === 1,
    isLastStep: state.currentStep === TOTAL_STEPS,
  };
}
```

---

### 4. Main Register Form Refactor

**File: `client/src/components/auth/register-form.tsx`** (REFACTOR)

```typescript
"use client";

import { useRegisterWizard } from '@/hooks/use-register-wizard';
import { useRegister } from '@/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StepWelcome } from './register-steps/step-welcome';
import { StepCategory } from './register-steps/step-category';
import { StepStoreInfo } from './register-steps/step-store-info';
import { StepAccount } from './register-steps/step-account';
import { StepReview } from './register-steps/step-review';

export function RegisterForm() {
  const wizard = useRegisterWizard();
  const { register, isLoading, error } = useRegister();

  const handleSubmit = async () => {
    try {
      await register({
        name: wizard.state.name!,
        slug: wizard.state.slug!,
        category: wizard.state.category!,
        description: wizard.state.description || '',
        email: wizard.state.email!,
        password: wizard.state.password!,
        whatsapp: wizard.state.whatsapp!,
      });
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Langkah {wizard.state.currentStep} dari 5</span>
          <span>{Math.round(wizard.progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${wizard.progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="min-h-[500px]">
        {wizard.state.currentStep === 1 && (
          <StepWelcome onNext={wizard.nextStep} />
        )}

        {wizard.state.currentStep === 2 && (
          <StepCategory
            selectedCategory={wizard.state.category || ''}
            onSelectCategory={(category) =>
              wizard.updateState({ category })
            }
            onNext={wizard.nextStep}
            onBack={wizard.prevStep}
          />
        )}

        {wizard.state.currentStep === 3 && (
          <StepStoreInfo
            name={wizard.state.name || ''}
            slug={wizard.state.slug || ''}
            description={wizard.state.description || ''}
            onUpdate={wizard.updateState}
            onNext={wizard.nextStep}
            onBack={wizard.prevStep}
          />
        )}

        {wizard.state.currentStep === 4 && (
          <StepAccount
            email={wizard.state.email || ''}
            password={wizard.state.password || ''}
            whatsapp={wizard.state.whatsapp || ''}
            onUpdate={wizard.updateState}
            onNext={wizard.nextStep}
            onBack={wizard.prevStep}
          />
        )}

        {wizard.state.currentStep === 5 && (
          <StepReview
            data={wizard.state}
            onBack={wizard.prevStep}
            onEdit={wizard.goToStep}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Step Dots Indicator (optional) */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {[1, 2, 3, 4, 5].map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => wizard.goToStep(step)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              wizard.state.currentStep === step
                ? 'bg-primary w-6'
                : 'bg-muted hover:bg-muted-foreground/30'
            )}
            aria-label={`Go to step ${step}`}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 📊 Data Flow

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  User Interaction Flow                                     │
│                                                            │
│  Screen 1 (Welcome)                                        │
│    └── Click "Mulai" → Go to Screen 2                     │
│                                                            │
│  Screen 2 (Category) ⭐                                     │
│    ├── Click category card → Save to wizard state         │
│    ├── Visual feedback (selected state)                   │
│    └── Click "Lanjut" → Go to Screen 3                    │
│                                                            │
│  Screen 3 (Store Info)                                     │
│    ├── Input: name, slug, description                     │
│    ├── Auto-generate slug from name                       │
│    ├── Check slug availability (debounced)                │
│    └── Click "Lanjut" → Go to Screen 4                    │
│                                                            │
│  Screen 4 (Account)                                        │
│    ├── Input: email, password, whatsapp                   │
│    ├── Validation on change                               │
│    └── Click "Lanjut" → Go to Screen 5                    │
│                                                            │
│  Screen 5 (Review)                                         │
│    ├── Show all collected data                            │
│    ├── Edit buttons → Jump to specific step               │
│    └── Click "Buat Toko" → Submit registration            │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                                                            │
│  State Management (useRegisterWizard)                      │
│                                                            │
│  {                                                         │
│    currentStep: 1-5,                                       │
│    category: string,        // from Screen 2              │
│    name: string,            // from Screen 3              │
│    slug: string,            // from Screen 3              │
│    description: string,     // from Screen 3              │
│    email: string,           // from Screen 4              │
│    password: string,        // from Screen 4              │
│    whatsapp: string,        // from Screen 4              │
│  }                                                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Checklist

### Phase 1: Setup (Day 1)
- [ ] Create `register-steps/` folder
- [ ] Create `use-register-wizard.ts` hook
- [ ] Create `category-card.tsx` component
- [ ] Test wizard state management

### Phase 2: Category Selection (Day 1-2) ⭐ PRIORITY
- [ ] Implement `step-category.tsx`
- [ ] Category cards grid (responsive)
- [ ] "Lainnya" card (full-width)
- [ ] Selected state handling
- [ ] Hover effects and animations

### Phase 3: Other Steps (Day 2-3)
- [ ] Implement `step-welcome.tsx`
- [ ] Implement `step-store-info.tsx` (refactor from current)
- [ ] Implement `step-account.tsx` (refactor from current)
- [ ] Implement `step-review.tsx` (new)

### Phase 4: Integration (Day 3)
- [ ] Refactor main `register-form.tsx`
- [ ] Add progress bar
- [ ] Add step dots indicator
- [ ] Connect wizard to existing `useRegister` hook
- [ ] Test full flow

### Phase 5: UX Enhancements (Day 4)
- [ ] Add animations (framer-motion or CSS)
- [ ] Swipe gestures on mobile (optional)
- [ ] Keyboard navigation (arrow keys)
- [ ] Loading states
- [ ] Error handling per step

### Phase 6: Testing (Day 4-5)
- [ ] Test all screen transitions
- [ ] Test category selection
- [ ] Test validation per step
- [ ] Test mobile responsiveness
- [ ] Test accessibility (keyboard, screen reader)

---

## 🎨 Design Tokens

### Colors (from categories.ts)
```typescript
const categoryColors = {
  WARUNG_KELONTONG: '#10b981',
  TOKO_BANGUNAN: '#f59e0b',
  BENGKEL_MOTOR: '#f97316',
  LAUNDRY: '#3b82f6',
  SERVICE_AC: '#06b6d4',
  SALON_BARBERSHOP: '#ec4899',
  APOTEK: '#ef4444',
  CATERING: '#f59e0b',
  KEDAI_KOPI: '#78350f',
  TOKO_KUE: '#db2777',
  FOTOGRAFI: '#8b5cf6',
  PETSHOP: '#f97316',
  GYM_FITNESS: '#059669',
  KOST_KONTRAKAN: '#0891b2',
  PERCETAKAN: '#4f46e5',
};
```

### Spacing
```css
/* Category Card */
.category-card {
  padding: 1.5rem;    /* p-6 */
  gap: 0.75rem;       /* gap-3 */
  border-radius: 0.75rem;  /* rounded-xl */
}

/* Grid */
.category-grid {
  gap: 1rem;          /* gap-4 */
}
```

### Animations
```css
/* Hover Scale */
.category-card:hover {
  transform: scale(1.05);
  transition: all 200ms;
}

/* Progress Bar */
.progress-bar {
  transition: width 300ms ease-in-out;
}
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- 2 columns grid for categories
- Full-width "Lainnya" card
- Swipe gestures between steps (optional)
- Touch-friendly card size (min 120px height)

### Tablet (768px - 1024px)
- 3 columns grid for categories
- Larger card size
- Next/Prev buttons

### Desktop (> 1024px)
- 4 columns grid for categories
- Max-width container (2xl = 672px)
- Hover states more prominent
- Keyboard navigation

---

## 🔐 Validation Rules

### Step 2 (Category):
- Required: Must select a category
- No other validation needed

### Step 3 (Store Info):
- `name`: Required, min 3 chars, max 50 chars
- `slug`: Required, min 3 chars, max 30 chars, alphanumeric + hyphens, must be available
- `description`: Optional, max 500 chars

### Step 4 (Account):
- `email`: Required, valid email format
- `password`: Required, min 6 chars
- `whatsapp`: Required, valid phone number (starts with 62)

### Step 5 (Review):
- All previous steps must be valid
- Show validation errors if any

---

## 🚀 Migration Strategy

### Option A: Big Bang (Recommended for MVP)
1. Create all new components in parallel
2. Test in development
3. Deploy all at once
4. Monitor user feedback

### Option B: Gradual (More Safe)
1. Deploy behind feature flag
2. A/B test old vs new flow
3. Gradual rollout (10% → 50% → 100%)
4. Monitor conversion rate

**Recommendation**: Option A (Big Bang) karena ini adalah improvement clear yang tidak ada risk regresi signifikan.

---

## 📈 Success Metrics

### UX Metrics
- [ ] Time to complete registration (target: < 2 minutes)
- [ ] Drop-off rate per step (target: < 20% per step)
- [ ] Category selection time (target: < 15 seconds)

### Technical Metrics
- [ ] Form validation errors (target: < 10%)
- [ ] Slug availability check success rate (target: > 95%)
- [ ] Mobile bounce rate (target: < 30%)

### Business Metrics
- [ ] Registration completion rate (target: > 60%)
- [ ] Category distribution (balanced across categories)
- [ ] "Lainnya" selection rate (target: < 10%)

---

## 🎯 Key Differences from Current Flow

| Aspect | Current (Old) | New (Visual) |
|--------|---------------|--------------|
| **Steps** | 2 steps | 5 steps (more granular) |
| **Category Selection** | Dropdown (kaku) | Visual cards (clickable) |
| **Progress** | Step indicator only | Progress bar + dots |
| **Mobile UX** | Form-heavy | Card-based, swipeable |
| **Visual Feedback** | Minimal | Rich (hover, selected states) |
| **"Lainnya" Option** | In dropdown | Prominent card at bottom |
| **Review Step** | None | Full review before submit |
| **Validation** | Per field | Per step |
| **User Experience** | Form filling | Guided wizard |

---

## 🔗 Related Documents

- `/client/src/config/categories.ts` - Category configuration (NO CHANGES)
- `/client/src/components/auth/register-form.tsx` - Current register form (REFACTOR)
- `/client/src/hooks/use-register.ts` - Registration hook (NO CHANGES)
- `/implementation-onboarding/ONBOARDING-TENANT.md` - Dashboard onboarding reference

---

## 💡 Future Enhancements (Post-MVP)

### Phase 2 Features:
1. **Smart Category Suggestions**
   - Based on store name/description
   - ML-powered recommendations

2. **Category Preview**
   - Show sample stores in this category
   - Preview features available for category

3. **Multi-step Validation**
   - Real-time validation as user types
   - Progressive disclosure of errors

4. **Social Proof**
   - "1,234 toko sudah memilih kategori ini"
   - Popular categories badge

5. **Onboarding Tour**
   - First-time user tutorial
   - Interactive tooltips

---

## ✅ Definition of Done

A successful implementation means:

- [x] ✅ Category selection uses visual cards (NOT dropdown)
- [x] ✅ All 15 categories are clickable with icon + color
- [x] ✅ "Lainnya" option is at bottom (full-width card)
- [x] ✅ Mobile responsive (2 cols on mobile, 4 cols on desktop)
- [x] ✅ Smooth animations and transitions
- [x] ✅ Progress bar shows current step
- [x] ✅ Users can navigate back/forward
- [x] ✅ All existing validation rules work
- [x] ✅ Registration API integration unchanged
- [x] ✅ No regression in conversion rate

---

**Created**: 2026-01-21
**Version**: 1.0
**Status**: ✅ Blueprint Ready for Implementation
**Next Steps**: Create components in `register-steps/` folder

# 🎯 ONBOARDING TENANT - IMPLEMENTATION GUIDE

> **Status**: 📋 Ready for Implementation
> 
> **Version**: 1.0
> 
> **Date**: 2026-01-20
> 
> **Based on**: TENANT-PROFILE-PROGRESS.md, LANDING-DATA-CONTRACT.md, Blocks.so Onboarding-01

---

## 📋 Overview

Sistem onboarding wizard untuk membantu tenant baru melengkapi profil toko mereka dengan pengalaman yang clean dan professional (inspirasi: Documenso, Lemon Squeezy).

### Key Features:
- ✅ Progress tracking (0-100%)
- ✅ Critical items enforcement (Logo + Hero Background)
- ✅ Expandable/collapsible steps
- ✅ Dismiss & restore functionality
- ✅ Milestone badges
- ✅ Direct action buttons

---

## 📁 Folder Structure

```
client/src/
├── components/
│   └── onboarding/                    # NEW FOLDER
│       ├── index.ts                   # Barrel export
│       ├── onboarding-wizard.tsx      # Main component
│       ├── onboarding-step.tsx        # Individual step
│       └── circular-progress.tsx      # Progress indicator
├── hooks/
│   └── use-onboarding.ts              # NEW FILE
├── lib/
│   └── onboarding/                    # NEW FOLDER
│       ├── index.ts                   # Barrel export
│       ├── calculate-progress.ts      # Progress calculation
│       ├── steps-config.ts            # Step definitions
│       └── types.ts                   # Types
└── types/
    └── onboarding.ts                  # NEW FILE (optional, can use lib types)
```

---

## 🚀 IMPLEMENTATION

### Step 1: Create Types

**File: `client/src/lib/onboarding/types.ts`**

```typescript
// ============================================
// ONBOARDING TYPES
// ============================================

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  field: string;
  points: number;
  isCritical: boolean;
  actionLabel: string;
  actionHref: string;
  category: 'identity' | 'hero' | 'about' | 'testimonials' | 'contact' | 'cta' | 'products';
  checkType?: 'boolean' | 'string' | 'array_min';
  minCount?: number;
}

export interface OnboardingStepStatus extends OnboardingStep {
  completed: boolean;
}

export interface OnboardingProgress {
  totalScore: number;
  maxScore: number;
  percentage: number;
  completedSteps: number;
  totalSteps: number;
  canPublish: boolean;
  criticalItems: {
    logo: boolean;
    heroBackground: boolean;
  };
  steps: OnboardingStepStatus[];
  milestone: 'bronze' | 'silver' | 'gold' | 'diamond' | null;
}

export interface OnboardingState {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  isDismissed: boolean;
  error: string | null;
}
```

---

### Step 2: Create Steps Configuration

**File: `client/src/lib/onboarding/steps-config.ts`**

```typescript
import { OnboardingStep } from './types';

// ============================================
// ONBOARDING STEPS CONFIGURATION
// Aligned with TENANT-PROFILE-PROGRESS.md
// ============================================

export const ONBOARDING_STEPS: OnboardingStep[] = [
  // ===== CRITICAL ITEMS (Required to publish) =====
  {
    id: 'logo',
    title: 'Upload logo toko',
    description: 'Logo adalah identitas brand utama. Akan tampil di header dan semua halaman toko Anda.',
    field: 'logo',
    points: 4,
    isCritical: true,
    actionLabel: 'Upload Logo',
    actionHref: '/dashboard/settings',
    category: 'identity',
    checkType: 'string',
  },
  {
    id: 'hero-background',
    title: 'Tambah gambar hero background',
    description: 'First impression di landing page. Membuat toko terlihat profesional dan menarik.',
    field: 'heroBackgroundImage',
    points: 7,
    isCritical: true,
    actionLabel: 'Upload Hero Image',
    actionHref: '/dashboard/settings',
    category: 'hero',
    checkType: 'string',
  },

  // ===== HIGH IMPACT (Recommended) =====
  {
    id: 'first-product',
    title: 'Tambah produk pertama',
    description: 'Upload produk untuk mulai berjualan online. Pelanggan bisa langsung melihat katalog Anda.',
    field: 'products',
    points: 10,
    isCritical: false,
    actionLabel: 'Tambah Produk',
    actionHref: '/dashboard/products/new',
    category: 'products',
    checkType: 'array_min',
    minCount: 1,
  },
  {
    id: 'whatsapp',
    title: 'Hubungkan WhatsApp',
    description: 'Aktifkan komunikasi langsung dengan pelanggan untuk orderan dan pertanyaan.',
    field: 'whatsapp',
    points: 5,
    isCritical: false,
    actionLabel: 'Tambah WhatsApp',
    actionHref: '/dashboard/settings',
    category: 'contact',
    checkType: 'string',
  },
  {
    id: 'testimonial',
    title: 'Tambah testimoni pelanggan',
    description: 'Social proof membangun kepercayaan. Tambah minimal 1 testimoni dari pelanggan puas Anda.',
    field: 'testimonials',
    points: 4,
    isCritical: false,
    actionLabel: 'Tambah Testimoni',
    actionHref: '/dashboard/settings',
    category: 'testimonials',
    checkType: 'array_min',
    minCount: 1,
  },
  {
    id: 'branding',
    title: 'Kustomisasi warna tema',
    description: 'Pilih warna tema yang sesuai dengan brand Anda untuk tampilan toko yang unik.',
    field: 'theme.primaryColor',
    points: 4,
    isCritical: false,
    actionLabel: 'Atur Warna',
    actionHref: '/dashboard/settings',
    category: 'identity',
    checkType: 'string',
  },
];

// Get step by ID
export function getStepById(id: string): OnboardingStep | undefined {
  return ONBOARDING_STEPS.find(step => step.id === id);
}

// Get critical steps only
export function getCriticalSteps(): OnboardingStep[] {
  return ONBOARDING_STEPS.filter(step => step.isCritical);
}

// Get non-critical steps
export function getOptionalSteps(): OnboardingStep[] {
  return ONBOARDING_STEPS.filter(step => !step.isCritical);
}
```

---

### Step 3: Create Progress Calculation

**File: `client/src/lib/onboarding/calculate-progress.ts`**

```typescript
import { Tenant } from '@/types/tenant';
import { OnboardingProgress, OnboardingStepStatus } from './types';
import { ONBOARDING_STEPS } from './steps-config';

// ============================================
// PROGRESS CALCULATION
// ============================================

/**
 * Get nested value from object using dot notation
 * e.g., getNestedValue(obj, 'theme.primaryColor')
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/**
 * Check if a step is completed based on tenant data
 */
function isStepCompleted(
  tenant: Tenant,
  field: string,
  checkType: string = 'string',
  minCount: number = 1,
  productsCount: number = 0
): boolean {
  // Special case for products (not in tenant object)
  if (field === 'products') {
    return productsCount >= minCount;
  }

  const value = getNestedValue(tenant as Record<string, any>, field);

  switch (checkType) {
    case 'array_min':
      return Array.isArray(value) && value.length >= minCount;
    case 'boolean':
      return value === true;
    case 'string':
    default:
      return !!value && value !== '' && value !== null && value !== undefined;
  }
}

/**
 * Get milestone based on score
 */
function getMilestone(score: number): 'bronze' | 'silver' | 'gold' | 'diamond' | null {
  if (score >= 100) return 'diamond';
  if (score >= 75) return 'gold';
  if (score >= 50) return 'silver';
  if (score >= 25) return 'bronze';
  return null;
}

/**
 * Calculate full onboarding progress
 */
export function calculateOnboardingProgress(
  tenant: Tenant,
  productsCount: number = 0
): OnboardingProgress {
  let totalScore = 0;
  const maxScore = ONBOARDING_STEPS.reduce((sum, step) => sum + step.points, 0);
  const steps: OnboardingStepStatus[] = [];

  // Calculate each step
  for (const step of ONBOARDING_STEPS) {
    const completed = isStepCompleted(
      tenant,
      step.field,
      step.checkType,
      step.minCount,
      productsCount
    );

    if (completed) {
      totalScore += step.points;
    }

    steps.push({
      ...step,
      completed,
    });
  }

  // Check critical items
  const hasLogo = !!tenant.logo;
  const hasHeroBackground = !!tenant.heroBackgroundImage;
  const canPublish = hasLogo && hasHeroBackground;

  // Calculate percentage
  const percentage = Math.round((totalScore / maxScore) * 100);

  return {
    totalScore,
    maxScore,
    percentage,
    completedSteps: steps.filter(s => s.completed).length,
    totalSteps: steps.length,
    canPublish,
    criticalItems: {
      logo: hasLogo,
      heroBackground: hasHeroBackground,
    },
    steps,
    milestone: getMilestone(percentage),
  };
}

/**
 * Calculate full profile progress (100 points system)
 * Based on TENANT-PROFILE-PROGRESS.md
 */
export function calculateFullProfileProgress(
  tenant: Tenant,
  productsCount: number = 0
): number {
  let score = 0;

  // 1. Business Identity (15 pts)
  if (tenant.logo) score += 4;
  if (tenant.banner) score += 3;
  if (tenant.description && tenant.description.length > 20) score += 4;
  if (tenant.theme?.primaryColor) score += 4;

  // 2. Hero Section (18 pts)
  if (tenant.heroTitle) score += 4;
  if (tenant.heroSubtitle) score += 3;
  if (tenant.heroCtaText) score += 2;
  if (tenant.heroCtaLink) score += 2;
  if (tenant.heroBackgroundImage) score += 7;

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

  return score;
}
```

---

### Step 4: Create Barrel Export for lib/onboarding

**File: `client/src/lib/onboarding/index.ts`**

```typescript
// ============================================
// ONBOARDING LIB EXPORTS
// ============================================

export * from './types';
export * from './steps-config';
export * from './calculate-progress';
```

---

### Step 5: Create useOnboarding Hook

**File: `client/src/hooks/use-onboarding.ts`**

```typescript
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTenant } from './use-tenant';
import { useProducts } from './use-products';
import { 
  calculateOnboardingProgress, 
  OnboardingProgress 
} from '@/lib/onboarding';

// ============================================
// USE ONBOARDING HOOK
// ============================================

const DISMISSED_KEY = 'onboarding_dismissed';
const DISMISSED_AT_KEY = 'onboarding_dismissed_at';

interface UseOnboardingReturn {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  isDismissed: boolean;
  error: string | null;
  dismissOnboarding: () => void;
  restoreOnboarding: () => void;
  refreshProgress: () => void;
}

export function useOnboarding(): UseOnboardingReturn {
  const { tenant, isLoading: tenantLoading } = useTenant();
  const { products, isLoading: productsLoading } = useProducts();
  
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check localStorage for dismissed state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(DISMISSED_KEY);
      setIsDismissed(dismissed === 'true');
    }
  }, []);

  // Calculate progress
  const progress = useMemo(() => {
    if (!tenant) return null;
    
    try {
      const productsCount = products?.length || 0;
      return calculateOnboardingProgress(tenant, productsCount);
    } catch (err) {
      setError('Failed to calculate progress');
      return null;
    }
  }, [tenant, products]);

  // Dismiss onboarding
  const dismissOnboarding = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISSED_KEY, 'true');
      localStorage.setItem(DISMISSED_AT_KEY, new Date().toISOString());
    }
    setIsDismissed(true);
  }, []);

  // Restore onboarding
  const restoreOnboarding = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DISMISSED_KEY);
      localStorage.removeItem(DISMISSED_AT_KEY);
    }
    setIsDismissed(false);
  }, []);

  // Refresh progress (force recalculation)
  const refreshProgress = useCallback(() => {
    // This will trigger recalculation via useMemo when tenant/products change
    // For now, this is a placeholder for potential API refresh
  }, []);

  const isLoading = tenantLoading || productsLoading;

  return {
    progress,
    isLoading,
    isDismissed,
    error,
    dismissOnboarding,
    restoreOnboarding,
    refreshProgress,
  };
}
```

---

### Step 6: Create Circular Progress Component

**File: `client/src/components/onboarding/circular-progress.tsx`**

```typescript
"use client";

// ============================================
// CIRCULAR PROGRESS INDICATOR
// ============================================

interface CircularProgressProps {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  completed,
  total,
  size = 14,
  strokeWidth = 2,
}: CircularProgressProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const strokeDashoffset = 100 - progress;
  const radius = (size - strokeWidth) / 2;

  return (
    <svg
      className="-rotate-90 scale-y-[-1]"
      height={size}
      width={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        className="stroke-muted"
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        strokeWidth={strokeWidth}
        pathLength="100"
      />
      <circle
        className="stroke-primary transition-all duration-300"
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        strokeWidth={strokeWidth}
        pathLength="100"
        strokeDasharray="100"
        strokeLinecap="round"
        style={{ strokeDashoffset }}
      />
    </svg>
  );
}
```

---

### Step 7: Create Onboarding Step Component

**File: `client/src/components/onboarding/onboarding-step.tsx`**

```typescript
"use client";

import Link from 'next/link';
import {
  IconCircleCheckFilled,
  IconCircleDashed,
  IconChevronRight,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OnboardingStepStatus } from '@/lib/onboarding';

// ============================================
// ONBOARDING STEP COMPONENT
// ============================================

interface OnboardingStepProps {
  step: OnboardingStepStatus;
  isOpen: boolean;
  onToggle: () => void;
  isFirst: boolean;
  isPrevOpen: boolean;
}

function StepIndicator({ completed, isCritical }: { completed: boolean; isCritical: boolean }) {
  if (completed) {
    return (
      <IconCircleCheckFilled
        className="mt-0.5 size-5 shrink-0 text-primary"
        aria-hidden="true"
      />
    );
  }
  
  if (isCritical) {
    return (
      <IconAlertTriangle
        className="mt-0.5 size-5 shrink-0 text-amber-500"
        aria-hidden="true"
      />
    );
  }
  
  return (
    <IconCircleDashed
      className="mt-0.5 size-5 shrink-0 stroke-muted-foreground/40"
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}

export function OnboardingStep({
  step,
  isOpen,
  onToggle,
  isFirst,
  isPrevOpen,
}: OnboardingStepProps) {
  const showBorderTop = !isFirst && !isOpen && !isPrevOpen;

  return (
    <div
      className={cn(
        'group',
        isOpen && 'rounded-lg',
        showBorderTop && 'border-t border-border'
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn(
          'block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isOpen && 'rounded-lg'
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-lg transition-colors',
            isOpen && 'border border-border bg-muted/50'
          )}
        >
          <div className="relative flex items-start justify-between gap-3 py-3 pl-4 pr-2">
            <div className="flex w-full gap-3">
              {/* Step Indicator */}
              <div className="shrink-0">
                <StepIndicator completed={step.completed} isCritical={step.isCritical} />
              </div>

              {/* Content */}
              <div className="grow">
                <h4
                  className={cn(
                    'text-sm font-medium',
                    step.completed ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {step.title}
                  {step.isCritical && !step.completed && (
                    <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                      (Wajib)
                    </span>
                  )}
                </h4>

                {/* Expandable Content */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    isOpen ? 'mt-2 h-auto opacity-100' : 'h-0 opacity-0'
                  )}
                >
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  
                  {!step.completed && (
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={(e) => e.stopPropagation()}
                      asChild
                    >
                      <Link href={step.actionHref}>
                        {step.actionLabel}
                      </Link>
                    </Button>
                  )}
                  
                  {step.completed && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                      ✓ Selesai
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Chevron (when closed) */}
            {!isOpen && (
              <IconChevronRight
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### Step 8: Create Main Onboarding Wizard Component

**File: `client/src/components/onboarding/onboarding-wizard.tsx`**

```typescript
"use client";

import { useState, useEffect } from 'react';
import {
  IconArchive,
  IconDots,
  IconMail,
  IconRefresh,
  IconTrophy,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useTenant } from '@/hooks/use-tenant';
import { CircularProgress } from './circular-progress';
import { OnboardingStep } from './onboarding-step';

// ============================================
// ONBOARDING WIZARD COMPONENT
// ============================================

export function OnboardingWizard() {
  const { tenant } = useTenant();
  const {
    progress,
    isLoading,
    isDismissed,
    dismissOnboarding,
    restoreOnboarding,
  } = useOnboarding();

  const [openStepId, setOpenStepId] = useState<string | null>(null);

  // Set initial open step (first incomplete)
  useEffect(() => {
    if (progress && !openStepId) {
      const firstIncomplete = progress.steps.find((s) => !s.completed);
      setOpenStepId(firstIncomplete?.id ?? progress.steps[0]?.id ?? null);
    }
  }, [progress, openStepId]);

  // Show dismissed state
  if (isDismissed) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Setup wizard disembunyikan
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={restoreOnboarding}
            className="text-xs"
          >
            <IconRefresh className="mr-1 size-3" />
            Tampilkan lagi
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !progress) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Hide when 100% complete
  if (progress.percentage >= 100) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <div className="flex items-center gap-3">
          <IconTrophy className="size-8 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              🎉 Selamat! Profil toko lengkap!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Toko Anda sudah siap untuk menerima pelanggan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const remainingSteps = progress.totalSteps - progress.completedSteps;

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-foreground">
              Mulai dengan {tenant?.name || 'Toko Anda'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Lengkapi profil untuk meningkatkan visibilitas toko
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <CircularProgress
                completed={progress.completedSteps}
                total={progress.totalSteps}
                size={16}
              />
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {remainingSteps}
                </span>{' '}
                dari{' '}
                <span className="font-medium text-foreground">
                  {progress.totalSteps}
                </span>{' '}
                langkah tersisa
              </span>
            </div>

            {/* Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <IconDots className="size-4" aria-hidden="true" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={dismissOnboarding}>
                  <IconArchive className="mr-2 size-4" aria-hidden="true" />
                  Sembunyikan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    window.open('mailto:support@fibidy.com?subject=Feedback%20Onboarding')
                  }
                >
                  <IconMail className="mr-2 size-4" aria-hidden="true" />
                  Beri Feedback
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Critical Warning */}
        {!progress.canPublish && (
          <div className="border-b bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ Lengkapi{' '}
              <strong>Logo</strong> dan{' '}
              <strong>Hero Background</strong> untuk dapat publish toko Anda.
            </p>
          </div>
        )}

        {/* Steps */}
        <div className="p-4">
          <div className="space-y-0">
            {progress.steps.map((step, index) => (
              <OnboardingStep
                key={step.id}
                step={step}
                isOpen={openStepId === step.id}
                onToggle={() =>
                  setOpenStepId(openStepId === step.id ? null : step.id)
                }
                isFirst={index === 0}
                isPrevOpen={
                  index > 0 && progress.steps[index - 1]?.id === openStepId
                }
              />
            ))}
          </div>
        </div>

        {/* Footer - Progress Bar */}
        <div className="border-t px-4 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress: {progress.percentage}%</span>
            {progress.milestone && (
              <span className="flex items-center gap-1">
                {progress.milestone === 'bronze' && '🥉 Bronze'}
                {progress.milestone === 'silver' && '🥈 Silver'}
                {progress.milestone === 'gold' && '🥇 Gold'}
                {progress.milestone === 'diamond' && '💎 Diamond'}
              </span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### Step 9: Create Barrel Export for Components

**File: `client/src/components/onboarding/index.ts`**

```typescript
// ============================================
// ONBOARDING COMPONENTS EXPORTS
// ============================================

export { OnboardingWizard } from './onboarding-wizard';
export { OnboardingStep } from './onboarding-step';
export { CircularProgress } from './circular-progress';
```

---

### Step 10: Update Hooks Index (Optional)

**File: `client/src/hooks/index.ts`** (add this line)

```typescript
// ... existing exports
export { useOnboarding } from './use-onboarding';
```

---

### Step 11: Integrate to Dashboard

**File: `client/src/app/(dashboard)/dashboard/page.tsx`**

```typescript
// Add import at the top
import { OnboardingWizard } from '@/components/onboarding';

// Add to the dashboard page component (at the top of the content)
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Onboarding Wizard - Show at top */}
      <OnboardingWizard />

      {/* Rest of your dashboard content */}
      {/* ... */}
    </div>
  );
}
```

---

## ✅ CHECKLIST

### Files to Create:

- [ ] `client/src/lib/onboarding/types.ts`
- [ ] `client/src/lib/onboarding/steps-config.ts`
- [ ] `client/src/lib/onboarding/calculate-progress.ts`
- [ ] `client/src/lib/onboarding/index.ts`
- [ ] `client/src/hooks/use-onboarding.ts`
- [ ] `client/src/components/onboarding/circular-progress.tsx`
- [ ] `client/src/components/onboarding/onboarding-step.tsx`
- [ ] `client/src/components/onboarding/onboarding-wizard.tsx`
- [ ] `client/src/components/onboarding/index.ts`

### Files to Modify:

- [ ] `client/src/hooks/index.ts` - Add export
- [ ] `client/src/app/(dashboard)/dashboard/page.tsx` - Add widget

### Dependencies Check:

- [ ] `@tabler/icons-react` - Should already be installed
- [ ] `@/components/ui/button` - Shadcn button
- [ ] `@/components/ui/dropdown-menu` - Shadcn dropdown

### Move Original File:

```bash
# Move the blocks.so component to reference folder (optional)
mv src/components/onboarding-01.tsx src/components/onboarding/_reference-blocks-onboarding.tsx
```

---

## 🧪 Testing Checklist

### Visual Tests:
- [ ] Widget appears on dashboard
- [ ] Steps expand/collapse correctly
- [ ] Critical warning shows when logo/hero missing
- [ ] Progress bar updates correctly
- [ ] Milestone badges display properly
- [ ] Dismiss/restore works
- [ ] Completed state (100%) shows celebration

### Data Tests:
- [ ] Progress calculates correctly with empty tenant
- [ ] Progress updates when tenant data changes
- [ ] Products count affects progress
- [ ] localStorage persistence works

### Responsive Tests:
- [ ] Mobile view looks good
- [ ] Tablet view looks good
- [ ] Desktop view looks good

---

## 🎨 Customization Options

### Change Step Order:
Edit `ONBOARDING_STEPS` array in `steps-config.ts`

### Add New Steps:
```typescript
{
  id: 'new-step',
  title: 'New Step Title',
  description: 'Description here',
  field: 'fieldName',
  points: 5,
  isCritical: false,
  actionLabel: 'Action',
  actionHref: '/dashboard/settings',
  category: 'identity',
  checkType: 'string',
}
```

### Change Colors:
Modify Tailwind classes in components

### Change Milestones:
Edit `getMilestone()` function in `calculate-progress.ts`

---

## 📝 Notes

1. **localStorage** digunakan untuk dismiss state (simple, no backend needed)
2. **Progress calculation** dilakukan di client-side untuk real-time updates
3. **Critical items** (Logo + Hero) harus lengkap sebelum tenant bisa "publish"
4. **Scoring system** aligned dengan TENANT-PROFILE-PROGRESS.md

---

## 🔗 Related Documents

- `/TENANT-PROFILE-PROGRESS.md` - Full scoring specification
- `/LANDING-DATA-CONTRACT.md` - Data structure reference
- `/UNIFIED-STATE-STRUCTURE.md` - State management reference

---

**Created**: 2026-01-20
**Version**: 1.0
**Status**: ✅ Ready for Implementation
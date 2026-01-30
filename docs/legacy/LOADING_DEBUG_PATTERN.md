# Loading & Debug Pattern

> **Pattern untuk Real-Time Loading Screen dengan Built-in Performance Debugging**

## Overview

Pattern ini menggabungkan loading screen yang **real** (bukan fake timer) dengan kemampuan **debug bottleneck** untuk mengidentifikasi API calls atau data fetching yang lambat.

```
┌─────────────────────────────────────────┐
│      Landing Page Builder               │
│   Mempersiapkan workspace Anda          │
│                                         │
│   ████████████████████████████  100%   │
│                                         │
│   ✓ Data Toko           [234ms] 🟢     │  ← fast
│   ✓ Produk              [1.2s]  🔴     │  ← BOTTLENECK!
│   ✓ Konfigurasi Landing [89ms]  🟢     │  ← fast
│   ✓ Siap!                              │
│                                         │
│   Total: 1.52s                         │
└─────────────────────────────────────────┘
```

---

## Architecture

### 1. Loading States Interface

Setiap page mendefinisikan loading states yang akan di-track:

```typescript
// types/loading.ts
export interface LoadingStates {
  [key: string]: boolean;
}

// Contoh untuk Landing Builder
export interface LandingBuilderLoadingStates {
  tenantLoading: boolean;
  productsLoading: boolean;
  configReady: boolean;  // inverted: true = done
}

// Contoh untuk Dashboard
export interface DashboardLoadingStates {
  userLoading: boolean;
  statsLoading: boolean;
  ordersLoading: boolean;
  productsLoading: boolean;
}

// Contoh untuk Store Page
export interface StoreLoadingStates {
  tenantLoading: boolean;
  productsLoading: boolean;
  categoriesLoading: boolean;
}
```

### 2. Step Configuration

Setiap step memiliki logic untuk menentukan status berdasarkan loading states:

```typescript
interface StepConfig {
  id: string;
  label: string;           // Label saat selesai
  loadingLabel: string;    // Label saat loading
  getStatus: (states: LoadingStates) => 'pending' | 'loading' | 'completed';
}

// Contoh konfigurasi steps
const DASHBOARD_STEPS: StepConfig[] = [
  {
    id: 'user',
    label: 'User Data',
    loadingLabel: 'Memuat data user...',
    getStatus: (s) => s.userLoading ? 'loading' : 'completed',
  },
  {
    id: 'stats',
    label: 'Statistik',
    loadingLabel: 'Mengambil statistik...',
    getStatus: (s) => {
      if (s.userLoading) return 'pending';  // Wait for user first
      return s.statsLoading ? 'loading' : 'completed';
    },
  },
  {
    id: 'orders',
    label: 'Pesanan',
    loadingLabel: 'Memuat pesanan...',
    getStatus: (s) => {
      if (s.userLoading) return 'pending';
      return s.ordersLoading ? 'loading' : 'completed';
    },
  },
  // ... more steps
];
```

### 3. Status Flow

```
pending → loading → completed
   ↓         ↓          ↓
  ○ gray   ⟳ spin    ✓ check
  opacity   active    faded
   30%      100%      70%
```

---

## Implementation Guide

### Step 1: Create Loading Component

```tsx
// components/loading/page-loading-steps.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

interface StepConfig {
  id: string;
  label: string;
  loadingLabel: string;
  getStatus: (states: Record<string, boolean>) => 'pending' | 'loading' | 'completed';
}

interface PageLoadingStepsProps {
  title: string;
  subtitle: string;
  steps: StepConfig[];
  loadingStates: Record<string, boolean>;
  onComplete?: () => void;
  showDebug?: boolean;  // Show timing info
  className?: string;
}

export function PageLoadingSteps({
  title,
  subtitle,
  steps: stepConfigs,
  loadingStates,
  onComplete,
  showDebug = false,
  className,
}: PageLoadingStepsProps) {
  // Track timing for each step (debug mode)
  const [timings, setTimings] = useState<Record<string, number>>({});
  const startTimeRef = useRef<number>(Date.now());
  const stepStartTimesRef = useRef<Record<string, number>>({});

  // Calculate step statuses
  const steps = stepConfigs.map(config => ({
    ...config,
    status: config.getStatus(loadingStates),
  }));

  // Track timing changes
  useEffect(() => {
    if (!showDebug) return;

    steps.forEach(step => {
      // Step started loading
      if (step.status === 'loading' && !stepStartTimesRef.current[step.id]) {
        stepStartTimesRef.current[step.id] = Date.now();
      }
      // Step completed
      if (step.status === 'completed' && stepStartTimesRef.current[step.id] && !timings[step.id]) {
        const duration = Date.now() - stepStartTimesRef.current[step.id];
        setTimings(prev => ({ ...prev, [step.id]: duration }));
      }
    });
  }, [steps, showDebug, timings]);

  // Calculate progress
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progress = (completedCount / steps.length) * 100;

  // Check if all done
  const allComplete = steps.every(s => s.status === 'completed');

  // Calculate total time
  const totalTime = allComplete ? Date.now() - startTimeRef.current : null;

  // Call onComplete when all steps are done
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!allComplete) return;

    const timer = setTimeout(() => {
      onCompleteRef.current?.();
    }, 300);

    return () => clearTimeout(timer);
  }, [allComplete]);

  // Format timing
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Get timing indicator color
  const getTimingColor = (ms: number) => {
    if (ms < 300) return 'text-green-500';      // Fast: < 300ms
    if (ms < 1000) return 'text-yellow-500';    // Medium: 300ms - 1s
    return 'text-red-500';                       // Slow: > 1s
  };

  return (
    <div className={cn(
      'h-screen flex flex-col items-center justify-center bg-background',
      className
    )}>
      <div className="w-full max-w-md px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(progress)}%</span>
            {showDebug && totalTime && (
              <span className={getTimingColor(totalTime)}>
                Total: {formatTime(totalTime)}
              </span>
            )}
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isLoading = step.status === 'loading';
            const isPending = step.status === 'pending';
            const timing = timings[step.id];

            return (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
                  isLoading && 'bg-primary/5 border border-primary/20',
                  isCompleted && 'opacity-70',
                  isPending && 'opacity-30'
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isLoading && 'bg-primary/20',
                  isPending && 'bg-muted'
                )}>
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>

                {/* Label */}
                <span className={cn(
                  'flex-1 text-sm font-medium transition-colors',
                  isLoading && 'text-primary',
                  isCompleted && 'text-muted-foreground',
                  isPending && 'text-muted-foreground/50'
                )}>
                  {isLoading ? step.loadingLabel : step.label}
                </span>

                {/* Debug: Timing */}
                {showDebug && isCompleted && timing && (
                  <span className={cn(
                    'text-xs font-mono',
                    getTimingColor(timing)
                  )}>
                    [{formatTime(timing)}]
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

### Step 2: Use in Page

```tsx
// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageLoadingSteps } from '@/components/loading/page-loading-steps';

// Define steps for this page
const DASHBOARD_STEPS = [
  {
    id: 'user',
    label: 'User Data',
    loadingLabel: 'Memuat data user...',
    getStatus: (s) => s.userLoading ? 'loading' : 'completed',
  },
  {
    id: 'stats',
    label: 'Statistik',
    loadingLabel: 'Mengambil statistik...',
    getStatus: (s) => {
      if (s.userLoading) return 'pending';
      return s.statsLoading ? 'loading' : 'completed';
    },
  },
  {
    id: 'orders',
    label: 'Pesanan Terbaru',
    loadingLabel: 'Memuat pesanan...',
    getStatus: (s) => {
      if (s.userLoading) return 'pending';
      return s.ordersLoading ? 'loading' : 'completed';
    },
  },
  {
    id: 'ready',
    label: 'Siap!',
    loadingLabel: 'Menyiapkan dashboard...',
    getStatus: (s) => {
      if (s.userLoading || s.statsLoading || s.ordersLoading) return 'pending';
      return 'completed';
    },
  },
];

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const showDebug = searchParams.get('debug') === 'true';

  // Loading states
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    fetchUser().finally(() => setUserLoading(false));
  }, []);

  // Fetch stats (after user)
  useEffect(() => {
    if (userLoading) return;
    fetchStats().finally(() => setStatsLoading(false));
  }, [userLoading]);

  // Fetch orders (after user)
  useEffect(() => {
    if (userLoading) return;
    fetchOrders().finally(() => setOrdersLoading(false));
  }, [userLoading]);

  // Check if still loading
  const isStillLoading = userLoading || statsLoading || ordersLoading;

  // Show loading screen
  if (isStillLoading || !loadingComplete) {
    return (
      <PageLoadingSteps
        title="Dashboard"
        subtitle="Mempersiapkan dashboard Anda"
        steps={DASHBOARD_STEPS}
        loadingStates={{
          userLoading,
          statsLoading,
          ordersLoading,
        }}
        onComplete={() => setLoadingComplete(true)}
        showDebug={showDebug}
      />
    );
  }

  // Render dashboard
  return <DashboardContent />;
}
```

---

## Debug Mode Activation

### Option 1: URL Parameter (Recommended for Dev)

```
/dashboard?debug=true
/landing-builder?debug=true
/store/my-store?debug=true
```

### Option 2: localStorage (Persistent)

```javascript
// Enable debug mode
localStorage.setItem('app-debug-loading', 'true');

// Disable debug mode
localStorage.removeItem('app-debug-loading');
```

```tsx
// In component
const showDebug =
  searchParams.get('debug') === 'true' ||
  localStorage.getItem('app-debug-loading') === 'true';
```

### Option 3: Environment Variable (Dev Only)

```tsx
const showDebug = process.env.NODE_ENV === 'development';
```

### Option 4: Feature Flag

```tsx
// Use your feature flag system
const showDebug = useFeatureFlag('debug-loading-times');
```

---

## Performance Thresholds

| Timing | Color | Status | Action |
|--------|-------|--------|--------|
| < 300ms | 🟢 Green | Fast | Good! |
| 300ms - 1s | 🟡 Yellow | Medium | Consider optimizing |
| > 1s | 🔴 Red | Slow | **NEEDS OPTIMIZATION** |

---

## Pages to Implement

### Priority 1 (High Traffic)
- [ ] `/dashboard` - Main dashboard
- [ ] `/landing-builder` - Landing page builder ✅ DONE
- [ ] `/store/[slug]` - Public store page
- [ ] `/products` - Products management

### Priority 2 (Medium Traffic)
- [ ] `/orders` - Orders management
- [ ] `/customers` - Customer list
- [ ] `/settings` - Settings pages
- [ ] `/analytics` - Analytics dashboard

### Priority 3 (Low Traffic)
- [ ] `/auth/login` - Login page
- [ ] `/onboarding` - Onboarding flow
- [ ] `/checkout` - Checkout process

---

## Example Step Configurations

### Dashboard

```typescript
const DASHBOARD_STEPS = [
  { id: 'user', label: 'User', loadingLabel: 'Memuat user...', getStatus: (s) => s.userLoading ? 'loading' : 'completed' },
  { id: 'tenant', label: 'Toko', loadingLabel: 'Memuat data toko...', getStatus: (s) => s.tenantLoading ? 'loading' : 'completed' },
  { id: 'stats', label: 'Statistik', loadingLabel: 'Mengambil statistik...', getStatus: (s) => s.statsLoading ? 'loading' : 'completed' },
  { id: 'orders', label: 'Pesanan', loadingLabel: 'Memuat pesanan...', getStatus: (s) => s.ordersLoading ? 'loading' : 'completed' },
  { id: 'ready', label: 'Siap!', loadingLabel: 'Menyiapkan...', getStatus: (s) => !s.userLoading && !s.tenantLoading && !s.statsLoading && !s.ordersLoading ? 'completed' : 'pending' },
];
```

### Store Page

```typescript
const STORE_STEPS = [
  { id: 'tenant', label: 'Data Toko', loadingLabel: 'Memuat toko...', getStatus: (s) => s.tenantLoading ? 'loading' : 'completed' },
  { id: 'products', label: 'Produk', loadingLabel: 'Memuat produk...', getStatus: (s) => s.productsLoading ? 'loading' : 'completed' },
  { id: 'categories', label: 'Kategori', loadingLabel: 'Memuat kategori...', getStatus: (s) => s.categoriesLoading ? 'loading' : 'completed' },
  { id: 'ready', label: 'Siap!', loadingLabel: 'Menyiapkan...', getStatus: (s) => !s.tenantLoading && !s.productsLoading && !s.categoriesLoading ? 'completed' : 'pending' },
];
```

### Products Page

```typescript
const PRODUCTS_STEPS = [
  { id: 'tenant', label: 'Autentikasi', loadingLabel: 'Memverifikasi...', getStatus: (s) => s.tenantLoading ? 'loading' : 'completed' },
  { id: 'products', label: 'Produk', loadingLabel: 'Memuat daftar produk...', getStatus: (s) => s.productsLoading ? 'loading' : 'completed' },
  { id: 'categories', label: 'Kategori', loadingLabel: 'Memuat kategori...', getStatus: (s) => s.categoriesLoading ? 'loading' : 'completed' },
  { id: 'ready', label: 'Siap!', loadingLabel: 'Menyiapkan...', getStatus: (s) => !s.tenantLoading && !s.productsLoading && !s.categoriesLoading ? 'completed' : 'pending' },
];
```

---

## Console Logging (Optional)

Untuk debugging lebih detail, tambahkan console logging:

```typescript
useEffect(() => {
  if (!showDebug) return;

  // Log to console for detailed analysis
  if (allComplete && totalTime) {
    console.group('📊 Loading Performance Report');
    console.log(`Page: ${title}`);
    console.log(`Total Time: ${formatTime(totalTime)}`);
    console.log('---');
    Object.entries(timings).forEach(([stepId, time]) => {
      const icon = time < 300 ? '🟢' : time < 1000 ? '🟡' : '🔴';
      console.log(`${icon} ${stepId}: ${formatTime(time)}`);
    });
    console.groupEnd();

    // Optional: Send to analytics
    // analytics.track('page_load_performance', { page: title, totalTime, steps: timings });
  }
}, [allComplete, totalTime, timings, showDebug, title]);
```

Output:
```
📊 Loading Performance Report
  Page: Landing Page Builder
  Total Time: 1.52s
  ---
  🟢 tenant: 234ms
  🔴 products: 1.2s    ← BOTTLENECK FOUND!
  🟢 config: 89ms
```

---

## Benefits

1. **Real-time Feedback** - User tahu progress sebenarnya
2. **Debug Bottlenecks** - Langsung tahu mana yang lambat
3. **Performance Monitoring** - Track over time
4. **Better UX** - Loading terasa lebih cepat karena ada progress
5. **Consistent Pattern** - Sama di seluruh aplikasi

---

## Migration Checklist

Untuk setiap page yang akan di-migrate:

- [ ] Identify semua data fetching di page
- [ ] Buat loading states untuk setiap fetch
- [ ] Buat step configuration
- [ ] Implement `PageLoadingSteps` component
- [ ] Test dengan `?debug=true`
- [ ] Identify & fix bottlenecks
- [ ] Remove debug param untuk production

---

## Related Files

- `client/src/components/loading/page-loading-steps.tsx` - Generic loading component
- `client/src/components/landing-builder/builder-loading-steps.tsx` - Landing builder specific
- `client/src/types/loading.ts` - Loading state types

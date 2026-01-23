# 🚨 BLUEPRINT: API Deduplication & Performance Optimization

**Status:** 📋 Draft for Review
**Priority:** 🔴 CRITICAL
**Created:** 2026-01-21
**Target:** Fix redundant API calls causing 30s+ load times

---

## 📊 Executive Summary

### Current Problem
Application is making **redundant API calls** causing severe performance degradation:
- **3x category fetches** per page load (37+ seconds total)
- **2x tenant fetches** per tenant page
- **30-second response times** during concurrent requests
- **67% unnecessary database load**

### Proposed Solution
Implement **React.cache() deduplication** + **Layout-based data fetching** to eliminate redundancy.

### Expected Impact
| Metric | Before | After | Improvement |
|--------|---------|--------|-------------|
| API Calls per Page | 3x categories | 1x categories | **-67%** |
| Worst Case Load Time | 36 seconds | 3 seconds | **-92%** |
| Database Queries | 3x per page | 1x per page | **-67%** |
| Build Time | High (100s calls) | Low (deduplicated) | **-67%** |
| Supabase Read Units | High | Low | **-67% cost** |

---

## 🔍 Problem Analysis

### Evidence from Production Logs

```
GET /api/categories 200 - 3502ms
GET /api/categories 200 - 3017ms
GET /api/categories 200 - 30962ms  ❌ TRIPLE CALL!

GET /api/tenants/by-slug/burgerchina 200 - 2349ms (DB query)
GET /api/tenants/by-slug/burgerchina 200 - 52ms   (Cache hit) ❌ DUPLICATE!
```

### Performance Timeline (Current State)

```
User visits /discover/bengkel-motor
├─ [0-3s]  generateStaticParams()  → fetch categories #1 (3502ms)
├─ [3-6s]  generateMetadata()      → fetch categories #2 (3017ms)
└─ [6-36s] Page Component render   → fetch categories #3 (30962ms) ⚠️ BLOCKED!
Total: 36+ seconds
```

**Why 30 seconds?** Connection pool exhaustion + database latency + request queuing.

### Root Cause Analysis

#### 1️⃣ Triple Fetch in Category Pages ⚠️ CRITICAL
**File:** `client/src/app/discover/[category]/page.tsx`

```typescript
// PROBLEM: fetchAllCategoriesFromDB() called 3 times

export async function generateStaticParams() {
  const allCategories = await fetchAllCategoriesFromDB(); // FETCH #1
  // ... line 35
}

export async function generateMetadata({ params }) {
  const allCategories = await fetchAllCategoriesFromDB(); // FETCH #2
  // ... line 57
}

export default async function CategoryPage({ params }) {
  const allCategories = await fetchAllCategoriesFromDB(); // FETCH #3
  // ... line 103
}
```

**Impact:** Each page = 3 API calls. With 10 category pages = 30 API calls on build!

#### 2️⃣ Duplicate Tenant Fetches ⚠️ MEDIUM
**Hypothesis:** Tenant data fetched in both:
- Server Component (RSC)
- Client Component (useEffect/fetch)

**Evidence:**
- First call: 2349ms (DB query)
- Second call: 52ms (Redis cache hit)

#### 3️⃣ No Request Deduplication
Next.js **does not automatically deduplicate** `fetch()` calls to different endpoints:
- ✅ Same URL + same request = deduplicated
- ❌ Different functions calling same URL = NOT deduplicated

---

## 💡 Proposed Solutions

### Solution 1: React.cache() Wrapper (Immediate Fix)

**Purpose:** Deduplicate fetches within a single request lifecycle.

#### Implementation

```typescript
// client/src/utils/categoryCache.ts (NEW FILE)
import { cache } from 'react';
import { fetchAllCategoriesFromDB } from '@/lib/api';

/**
 * Cached version of fetchAllCategoriesFromDB
 * Deduplicates calls within the same request
 */
export const getCategoriesCached = cache(async () => {
  return await fetchAllCategoriesFromDB();
});
```

#### Changes Required

**File:** `client/src/app/discover/[category]/page.tsx`

```diff
- import { fetchAllCategoriesFromDB } from '@/lib/api';
+ import { getCategoriesCached } from '@/utils/categoryCache';

export async function generateStaticParams() {
-  const allCategories = await fetchAllCategoriesFromDB();
+  const allCategories = await getCategoriesCached();
}

export async function generateMetadata({ params }) {
-  const allCategories = await fetchAllCategoriesFromDB();
+  const allCategories = await getCategoriesCached();
}

export default async function CategoryPage({ params }) {
-  const allCategories = await fetchAllCategoriesFromDB();
+  const allCategories = await getCategoriesCached();
}
```

**Result:** 3 calls → 1 call (first call executes, others reuse cached result)

---

### Solution 2: Layout-Based Data Fetching (Optimal Architecture)

**Purpose:** Fetch categories ONCE at layout level, pass down to children.

#### Architecture Design

```
app/discover/layout.tsx (NEW)
  ├─ Fetch categories once
  ├─ Pass to children via props
  │
  ├─ app/discover/[category]/page.tsx
  │   ├─ Receives categories from parent
  │   ├─ generateStaticParams uses cached version
  │   └─ generateMetadata uses cached version
  │
  └─ app/discover/[category]/CategoryPageClient.tsx
      └─ Receives categories via props
```

#### Implementation Plan

##### Step 1: Create Discover Layout

**File:** `client/src/app/discover/layout.tsx` (NEW)

```typescript
import { getCategoriesCached } from '@/utils/categoryCache';

export default async function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch categories once for entire /discover route
  const categories = await getCategoriesCached();

  return (
    <>
      {/* Pass categories to children via React Context or props */}
      {children}
    </>
  );
}
```

##### Step 2: Create Category Context

**File:** `client/src/contexts/CategoryContext.tsx` (NEW)

```typescript
'use client';

import { createContext, useContext } from 'react';
import type { Category } from '@/types';

const CategoryContext = createContext<Category[] | null>(null);

export function CategoryProvider({
  categories,
  children
}: {
  categories: Category[];
  children: React.ReactNode;
}) {
  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoryProvider');
  }
  return context;
}
```

##### Step 3: Refactor Layout to Use Context

**File:** `client/src/app/discover/layout.tsx`

```typescript
import { getCategoriesCached } from '@/utils/categoryCache';
import { CategoryProvider } from '@/contexts/CategoryContext';

export default async function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategoriesCached();

  return (
    <CategoryProvider categories={categories}>
      {children}
    </CategoryProvider>
  );
}
```

##### Step 4: Update Category Page

**File:** `client/src/app/discover/[category]/page.tsx`

```typescript
import { getCategoriesCached } from '@/utils/categoryCache';

// Keep for static generation (uses cached version)
export async function generateStaticParams() {
  const allCategories = await getCategoriesCached();
  return allCategories.map((category) => ({
    category: category.slug,
  }));
}

// Keep for metadata (uses cached version)
export async function generateMetadata({ params }) {
  const allCategories = await getCategoriesCached();
  const currentCategory = allCategories.find(c => c.slug === params.category);

  return {
    title: currentCategory?.name || 'Category',
    // ...
  };
}

// Component NO LONGER fetches - receives via props
export default async function CategoryPage({ params }) {
  // Categories available via layout context
  // No fetch needed here!

  return <CategoryPageClient categorySlug={params.category} />;
}
```

##### Step 5: Update Client Component

**File:** `client/src/app/discover/[category]/CategoryPageClient.tsx`

```typescript
'use client';

import { useCategories } from '@/contexts/CategoryContext';

export default function CategoryPageClient({
  categorySlug
}: {
  categorySlug: string;
}) {
  const allCategories = useCategories(); // Get from context, no fetch!

  const currentCategory = allCategories.find(c => c.slug === categorySlug);

  // ... rest of component
}
```

---

### Solution 3: Fix Duplicate Tenant Fetches

#### Investigation Needed

1. **Find duplicate calls:**
   ```bash
   grep -r "tenants/by-slug" client/src/
   ```

2. **Likely locations:**
   - Server component: `app/[tenant]/page.tsx`
   - Client component: Some useEffect or client fetch

#### Proposed Fix

**Create tenant cache:**

```typescript
// client/src/utils/tenantCache.ts (NEW)
import { cache } from 'react';

export const getTenantBySlugCached = cache(async (slug: string) => {
  const response = await fetch(`/api/tenants/by-slug/${slug}`);
  return response.json();
});
```

**Use in both server and client:**
- Server: Call `getTenantBySlugCached(slug)` directly
- Client: Convert to prop passing instead of fetching

---

## 📋 Implementation Plan

### Phase 1: Immediate Wins (Day 1) ⚡

#### Task 1.1: Create Cache Utilities
- [ ] Create `client/src/utils/categoryCache.ts`
- [ ] Implement `getCategoriesCached()` with React.cache()
- [ ] Create `client/src/utils/tenantCache.ts`
- [ ] Implement `getTenantBySlugCached()` with React.cache()

#### Task 1.2: Update Category Page
- [ ] Replace `fetchAllCategoriesFromDB()` with `getCategoriesCached()` in:
  - `generateStaticParams()`
  - `generateMetadata()`
  - Page component
- [ ] Test: Verify only 1 API call per page in dev logs

#### Task 1.3: Update Tenant Fetches
- [ ] Find all tenant fetch locations
- [ ] Replace with `getTenantBySlugCached()`
- [ ] Test: Verify only 1 API call per tenant page

**Expected Impact:** 67% reduction in API calls immediately.

---

### Phase 2: Architecture Optimization (Day 2-3) 🏗️

#### Task 2.1: Create Category Context
- [ ] Create `client/src/contexts/CategoryContext.tsx`
- [ ] Implement `CategoryProvider` component
- [ ] Implement `useCategories()` hook
- [ ] Add TypeScript types

#### Task 2.2: Create Discover Layout
- [ ] Create `client/src/app/discover/layout.tsx`
- [ ] Fetch categories once at layout level
- [ ] Wrap children with `CategoryProvider`

#### Task 2.3: Refactor Category Page
- [ ] Remove fetch from page component
- [ ] Keep `generateStaticParams` and `generateMetadata` (uses cache)
- [ ] Update page to rely on context

#### Task 2.4: Update Client Component
- [ ] Update `CategoryPageClient.tsx` to use `useCategories()`
- [ ] Remove any client-side fetching
- [ ] Test: Verify no fetch calls from client

**Expected Impact:** True single fetch per user session.

---

### Phase 3: Testing & Validation (Day 4) ✅

#### Task 3.1: Performance Testing
- [ ] Measure page load time before/after
- [ ] Count API calls in Network tab
- [ ] Test with 3 concurrent page loads
- [ ] Verify no 30-second delays

#### Task 3.2: Build Testing
- [ ] Run `npm run build`
- [ ] Verify static generation works
- [ ] Check build logs for API call count
- [ ] Confirm build time improvement

#### Task 3.3: Functionality Testing
- [ ] Test all category pages render correctly
- [ ] Test tenant pages render correctly
- [ ] Test dynamic categories work
- [ ] Test predefined categories work
- [ ] Test Redis cache integration

---

## 📊 Success Metrics

### Performance Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| API calls per page | 1x (from 3x) | Chrome DevTools Network tab |
| Page load time | < 5s (from 36s) | Lighthouse / Network tab |
| Build time | < 2min (from 5min+) | `npm run build` duration |
| Database queries | 1 per page | API logs |
| 30s delays | 0 occurrences | Production logs |

### Functional Metrics

| Test Case | Expected Result |
|-----------|----------------|
| Visit /discover/bengkel-motor | Loads in < 5s, shows correct data |
| Visit 3 category pages simultaneously | All load in < 10s, no delays |
| Build production app | Completes successfully, generates all pages |
| Category metadata | SEO tags correct, no errors |
| Tenant pages | Load in < 3s, no duplicate fetches |

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// __tests__/utils/categoryCache.test.ts
describe('getCategoriesCached', () => {
  it('should cache results within same request', async () => {
    const call1 = getCategoriesCached();
    const call2 = getCategoriesCached();

    const [result1, result2] = await Promise.all([call1, call2]);

    expect(result1).toBe(result2); // Same reference = cached
    expect(fetchMock).toHaveBeenCalledTimes(1); // Only 1 fetch
  });
});
```

### Integration Tests

```typescript
// __tests__/app/discover/category-page.test.tsx
describe('CategoryPage', () => {
  it('should fetch categories only once', async () => {
    const { generateStaticParams, generateMetadata, default: Page } =
      await import('@/app/discover/[category]/page');

    await generateStaticParams();
    await generateMetadata({ params: { category: 'bengkel' } });
    await Page({ params: { category: 'bengkel' } });

    expect(fetchMock).toHaveBeenCalledTimes(1); // Only 1 fetch total!
  });
});
```

### Manual Testing Checklist

- [ ] Open DevTools Network tab
- [ ] Navigate to `/discover/bengkel-motor`
- [ ] Verify only 1 call to `/api/categories`
- [ ] Check response time < 5s
- [ ] Navigate to `/discover/warung-makan`
- [ ] Verify categories loaded from cache
- [ ] Open 3 category pages in separate tabs simultaneously
- [ ] Verify no 30-second delays
- [ ] Check API logs for duplicate calls

---

## 🔄 Rollback Plan

### If Issues Occur

#### Option 1: Revert Git Commit
```bash
git revert HEAD
git push -u origin claude/fix-redundant-api-calls-JFH6u
```

#### Option 2: Feature Flag (Advanced)
```typescript
// config.ts
export const USE_CACHED_CATEGORIES = process.env.NEXT_PUBLIC_USE_CACHE === 'true';

// page.tsx
const getCategories = USE_CACHED_CATEGORIES
  ? getCategoriesCached
  : fetchAllCategoriesFromDB;
```

#### Option 3: Gradual Rollout
1. Deploy Phase 1 only (React.cache wrapper)
2. Monitor for 24h
3. If stable, deploy Phase 2 (layout refactor)

---

## 🚧 Potential Risks & Mitigations

### Risk 1: Cache Staleness
**Problem:** Categories updated in DB but old data cached
**Mitigation:** React.cache is per-request, not persistent. Each new request gets fresh data.

### Risk 2: Build Failures
**Problem:** Static generation might fail with new architecture
**Mitigation:** Keep `generateStaticParams` using cached fetch, test build locally before deploy.

### Risk 3: TypeScript Errors
**Problem:** Type mismatches between layouts and pages
**Mitigation:** Comprehensive TypeScript types for all new utilities and contexts.

### Risk 4: Breaking Existing Features
**Problem:** Dynamic categories or tenant-specific features break
**Mitigation:** Comprehensive testing of all category and tenant pages before merge.

---

## 📁 Files to Create

```
client/src/
├── utils/
│   ├── categoryCache.ts          (NEW) - React.cache wrapper for categories
│   └── tenantCache.ts            (NEW) - React.cache wrapper for tenants
├── contexts/
│   └── CategoryContext.tsx       (NEW) - Context for category data
└── app/
    └── discover/
        └── layout.tsx            (NEW) - Discover layout with category fetch
```

## 📝 Files to Modify

```
client/src/app/discover/[category]/
├── page.tsx                      (MODIFY) - Use cached fetch, remove redundant calls
└── CategoryPageClient.tsx        (MODIFY) - Use context instead of props
```

---

## 🎯 Definition of Done

### Phase 1 Complete When:
- ✅ `categoryCache.ts` created and tested
- ✅ `tenantCache.ts` created and tested
- ✅ All category pages use cached fetch
- ✅ Network tab shows 1 API call per page (not 3)
- ✅ No TypeScript errors
- ✅ Build succeeds
- ✅ All tests pass

### Phase 2 Complete When:
- ✅ `CategoryContext.tsx` implemented
- ✅ `discover/layout.tsx` created
- ✅ Category pages refactored to use context
- ✅ Client component uses context (no fetch)
- ✅ Network tab shows 1 API call per user session
- ✅ All category pages render correctly
- ✅ Build succeeds with static generation

### Entire Blueprint Complete When:
- ✅ Page load time < 5s (measured)
- ✅ API calls reduced by 67%
- ✅ Build time reduced by 50%+
- ✅ No 30-second delays in production logs
- ✅ All tests passing (unit + integration)
- ✅ PR merged to main branch
- ✅ Deployed to production
- ✅ Monitoring shows improvement

---

## 📚 References

### Next.js Documentation
- [React cache() API](https://react.dev/reference/react/cache)
- [Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns)
- [Layouts and Templates](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)

### Related Code
- `client/src/lib/api.ts` - Current fetch functions
- `client/src/app/discover/[category]/page.tsx` - Category page (triple fetch)
- `server/src/routes/categories.ts` - Category API endpoint

---

## 💬 Questions for Review

1. **Should we implement both Phase 1 and Phase 2, or Phase 1 only?**
   - Phase 1 = Quick win (React.cache)
   - Phase 2 = Optimal architecture (layout + context)

2. **Are there other pages with similar redundancy issues?**
   - Should we audit all `app/` routes?

3. **Should categories be truly static (JSON file) or dynamic (API)?**
   - Static = Faster runtime, stale until redeploy
   - Dynamic = Always fresh, slower runtime

4. **What about tenant data caching strategy?**
   - Should tenants also use layout-based fetching?

---

## ✅ Approval Checklist

Before implementation, confirm:

- [ ] Blueprint reviewed and approved
- [ ] Architecture approach agreed (Phase 1 + 2 or Phase 1 only)
- [ ] Success metrics agreed
- [ ] Testing strategy approved
- [ ] Rollback plan understood
- [ ] Timeline acceptable (4 days estimated)

---

**Next Steps:**
1. Review this blueprint
2. Answer questions above
3. Approve for implementation
4. Execute Phase 1 → Test → Execute Phase 2 → Deploy

**Estimated Total Time:** 4 days (1 day Phase 1 + 2-3 days Phase 2 + 1 day testing)

---

*Blueprint created by Claude Code*
*Session: claude/fix-redundant-api-calls-JFH6u*

# 🎯 Refactoring Targets & Code Cleanup

> **Purpose**: Identify duplicate code, legacy patterns, and dead code for refactoring
>
> **Status**: 📋 Audit Phase
>
> **Last Updated**: 2026-01-20

---

## 🔍 Audit Summary

### Issues Found:
- 🔴 **Critical**: 3 duplications requiring immediate fix
- 🟡 **Warning**: 5 legacy patterns to modernize
- ⚫ **Low Priority**: 2 dead code candidates

---

## 🔴 CRITICAL: Duplicate Code

### 1. **Utils Functions Duplication**

**Issue**: Multiple util files with overlapping functionality

| File | Location | Functions | Status |
|------|----------|-----------|--------|
| `utils.ts` | `/client/src/lib/utils.ts` | `cn()`, general utils | ✅ Keep (primary) |
| `cn.ts` | `/client/src/lib/cn.ts` | `cn()` only | ❌ **DELETE** (duplicate) |

**Action Required**:
```typescript
// ❌ REMOVE: /client/src/lib/cn.ts
// All imports should use /client/src/lib/utils.ts instead

// Find all usages:
grep -r "from '@/lib/cn'" client/src

// Replace with:
import { cn } from '@/lib/utils'
```

**Affected Files**: ~50+ components importing from `@/lib/cn`

---

### 2. **Landing Data Extraction Duplication**

**Issue**: Helper functions extracting tenant data exist in multiple places

| File | Location | Functions | Status |
|------|----------|-----------|--------|
| `helpers.ts` | `/client/src/lib/landing/helpers.ts` | `extractAboutData`, `extractContactData`, etc. | ⚠️ **DEPRECATED** |
| Component Props | Individual components | Direct tenant prop passing | ✅ **CURRENT** (unified state) |

**Problem**:
- `lib/landing/helpers.ts` contains functions like:
  - `extractAboutData()` - line 201: `tenant.aboutTitle`
  - `extractContactData()` - line 264: `tenant.contactTitle`
  - These were causing the undefined errors we just fixed!

**Action Required**:
```typescript
// ❌ OLD PATTERN (helpers.ts):
const aboutData = extractAboutData(tenant, config);

// ✅ NEW PATTERN (direct props):
<TenantAbout tenant={tenant} config={config} />
// Component internally accesses tenant.aboutTitle directly
```

**Decision**:
- **DEPRECATE** `lib/landing/helpers.ts` extraction functions
- **KEEP** `normalizeTestimonials()` (still useful utility)
- **MIGRATE** all components to direct tenant prop access

---

### 3. **API Client Pattern Inconsistency**

**Issue**: Mixed patterns for API calls

| Pattern | Location | Status |
|---------|----------|--------|
| API Client Class | `/client/src/lib/api/*.ts` | ✅ **PREFERRED** |
| Direct fetch | Some components | ⚠️ **LEGACY** |
| Server Actions | New Next.js pattern | 🔄 **FUTURE** |

**Files Using Direct Fetch** (need migration):
```bash
# Find direct fetch calls:
grep -r "fetch('/api" client/src/components
grep -r "fetch('/api" client/src/app
```

**Action Required**:
- Migrate all direct `fetch()` calls to use API client from `@/lib/api`
- Consistent error handling via API client

---

## 🟡 WARNING: Legacy Patterns

### 4. **Landing Config Type Annotations**

**Issue**: Inconsistent type handling for `landingConfig`

**Pattern Found**:
```typescript
// ❌ LEGACY (causes type issues):
const landingConfig = tenant.landingConfig as LandingConfig | null;

// ✅ CURRENT (no annotation):
const landingConfig = tenant.landingConfig; // Let TypeScript infer
```

**Files to Update**:
```
✅ Fixed: client/src/app/store/[slug]/page.tsx (line 59)
✅ Fixed: client/src/app/store/[slug]/about/page.tsx (line 54)
✅ Fixed: client/src/app/store/[slug]/contact/page.tsx (line 54)
✅ Fixed: client/src/app/store/[slug]/testimonials/page.tsx (line 54)
```

**Status**: ✅ Already fixed in recent commits

---

### 5. **Component Prop Patterns**

**Issue**: Inconsistent prop passing to landing components

**OLD Pattern** (causing undefined errors):
```typescript
// ❌ Using fallbacks object
<TenantContact
  config={config}
  fallbacks={{
    whatsapp: tenant.whatsapp,
    phone: tenant.phone,
    // ...
  }}
/>
```

**NEW Pattern** (unified state):
```typescript
// ✅ Direct tenant prop
<TenantContact
  config={config}
  tenant={tenant}
/>
```

**Status**: ✅ Already fixed in:
- `client/src/app/store/[slug]/about/page.tsx`
- `client/src/app/store/[slug]/contact/page.tsx`
- `client/src/app/store/[slug]/testimonials/page.tsx`

---

### 6. **NavigationMenu Usage**

**Issue**: Mixed patterns for navigation links

**OLD Pattern** (deprecated):
```tsx
// ❌ legacyBehavior causes warnings
<Link href={url} legacyBehavior passHref>
  <NavigationMenuLink className={...}>
    Label
  </NavigationMenuLink>
</Link>
```

**NEW Pattern** (correct):
```tsx
// ✅ asChild with className on NavigationMenuLink
<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
  <Link href={url}>Label</Link>
</NavigationMenuLink>
```

**Status**: ✅ Already fixed in `client/src/components/store/store-header.tsx`

---

### 7. **Hero Section Enable Check**

**Issue**: Components checking `landingConfig.hero.enabled` when Hero is always ready

**OLD Pattern**:
```typescript
// ❌ Unnecessary check
if (landingConfig?.hero?.enabled) {
  return <TenantHero ... />
}
```

**NEW Pattern**:
```typescript
// ✅ Hero always enabled (has required data)
return <TenantHero tenant={tenant} config={landingConfig?.hero} />
```

**Files to Check**:
```
- client/src/app/store/[slug]/page.tsx (line 117)
- Any other landing page renderers
```

**Decision**: Hero section is ALWAYS enabled if tenant has logo + heroBackgroundImage (critical requirements)

---

### 8. **Store URL Helper Inconsistency**

**Issue**: Mixed usage of URL construction

**Patterns**:
```typescript
// ✅ PREFERRED: Use helper
const urls = useStoreUrls(tenant.slug);
urls.home // /store/{slug}
urls.products() // /store/{slug}/products
urls.path('/about') // /store/{slug}/about

// ❌ LEGACY: Manual construction
`/store/${slug}/products`
```

**Action Required**: Audit all manual URL constructions and migrate to `useStoreUrls()`

---

## ⚫ LOW PRIORITY: Potential Dead Code

### 9. **Unused Landing Blocks**

**Issue**: 200+ landing block templates, unclear which are actually used

**Location**: `/client/src/components/landing/blocks/*`

**Blocks Count**:
- `about/*.tsx` - 200+ files
- `contact/*.tsx` - 200+ files
- `testimonials/*.tsx` - 200+ files
- `hero/*.tsx` - 200+ files
- `cta/*.tsx` - 200+ files

**Questions**:
1. Are all these blocks actually used in the builder?
2. Which templates are most popular?
3. Can we lazy-load unused blocks?

**Action Required**:
- Audit block usage via template metadata
- Add usage tracking in landing builder
- Consider code-splitting for unused blocks

---

### 10. **Old Test Files**

**Issue**: Potential old test/mock files

**Files to Check**:
```bash
find client/src -name "*.test.ts*"
find client/src -name "*.spec.ts*"
find client/src -name "*.mock.ts*"
```

**Action**: Remove if not part of active test suite

---

## 📋 Refactoring Action Plan

### Phase 1: Critical Duplicates (HIGH PRIORITY) 🔴
**Estimated Time**: 2-4 hours

- [ ] **Task 1.1**: Remove `lib/cn.ts`
  - Find all imports: `grep -r "from '@/lib/cn'" client/src`
  - Replace with: `import { cn } from '@/lib/utils'`
  - Test: Run type-check and build
  - Files affected: ~50 components

- [ ] **Task 1.2**: Deprecate `lib/landing/helpers.ts` extraction functions
  - Mark `extractAboutData`, `extractContactData`, etc. as deprecated
  - Add JSDoc warning comments
  - Keep `normalizeTestimonials()` (still useful)
  - Document migration path in comments

- [ ] **Task 1.3**: Audit direct fetch() calls
  - Find: `grep -r "fetch('/api" client/src`
  - Migrate to API client pattern
  - Consistent error handling

### Phase 2: Legacy Patterns (MEDIUM PRIORITY) 🟡
**Estimated Time**: 4-6 hours

- [ ] **Task 2.1**: Audit Hero enable checks
  - Find: `landingConfig?.hero?.enabled`
  - Remove unnecessary checks (Hero always enabled)

- [ ] **Task 2.2**: Standardize URL construction
  - Find manual URL strings: `grep -r '"/store/"' client/src`
  - Migrate to `useStoreUrls()` helper

- [ ] **Task 2.3**: Component prop pattern audit
  - Ensure all landing components use `tenant` prop
  - No more `fallbacks` object pattern

### Phase 3: Dead Code Cleanup (LOW PRIORITY) ⚫
**Estimated Time**: 2-3 hours

- [ ] **Task 3.1**: Landing blocks usage audit
  - Track which blocks are actually used
  - Consider lazy-loading or tree-shaking

- [ ] **Task 3.2**: Remove old test files
  - Clean up unused test/mock files

---

## 🎯 Success Metrics

**Code Quality**:
- ✅ Zero duplicate utility functions
- ✅ Single source of truth for data extraction
- ✅ Consistent API client usage (100%)
- ✅ Type-safe without manual annotations

**Performance**:
- 📉 Reduce bundle size by removing duplicates
- 📉 Faster build times (less code to compile)
- 📈 Better tree-shaking (standardized imports)

**Developer Experience**:
- 📚 Clear patterns documented
- 🔍 Easy to find the "right way" to do things
- 🚀 New devs onboard faster

---

## 📐 Migration Guides

### Guide 1: Migrating from `lib/cn.ts` to `lib/utils.ts`

**Before**:
```typescript
import { cn } from '@/lib/cn';
```

**After**:
```typescript
import { cn } from '@/lib/utils';
```

**Automated Migration**:
```bash
# Find and replace across entire codebase
find client/src -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i "s|from '@/lib/cn'|from '@/lib/utils'|g" {} +
```

---

### Guide 2: Migrating from Helper Extraction to Direct Props

**Before** (❌ DEPRECATED):
```typescript
import { extractAboutData } from '@/lib/landing/helpers';

const aboutData = extractAboutData(tenant, config);
// aboutData.title, aboutData.subtitle, etc.
```

**After** (✅ CURRENT):
```typescript
<TenantAbout
  tenant={tenant}
  config={config}
/>

// Inside component:
const title = tenant.aboutTitle || config?.title || 'Default';
```

**Why Better**:
- No intermediate data extraction layer
- Direct access to unified state
- Type-safe (TypeScript knows tenant structure)
- Matches LANDING-DATA-CONTRACT.md

---

### Guide 3: Migrating Direct Fetch to API Client

**Before** (❌ LEGACY):
```typescript
const response = await fetch('/api/tenants/me');
const tenant = await response.json();
```

**After** (✅ CURRENT):
```typescript
import { tenantsApi } from '@/lib/api';

const tenant = await tenantsApi.getMe();
// Includes error handling, typing, auth
```

---

## 🔗 Related Documentation

- **Unified State**: `/UNIFIED-STATE-STRUCTURE.md`
- **Data Contract**: `/LANDING-DATA-CONTRACT.md`
- **API Patterns**: `/client/src/lib/api/README.md` (if exists)
- **Component Patterns**: TBD

---

## 📅 Timeline

| Phase | Duration | Priority | Status |
|-------|----------|----------|--------|
| Phase 1: Critical Duplicates | 2-4 hours | 🔴 HIGH | 📋 Planning |
| Phase 2: Legacy Patterns | 4-6 hours | 🟡 MEDIUM | 📋 Planning |
| Phase 3: Dead Code | 2-3 hours | ⚫ LOW | 📋 Planning |

**Total Estimated Time**: 8-13 hours

---

## 📝 Notes

- Run type-check after each migration: `npm run type-check`
- Run build to ensure no breakage: `npm run build`
- Test affected pages manually
- Consider creating a PR per phase (easier review)

---

**Created**: 2026-01-20
**Last Updated**: 2026-01-20
**Status**: 📋 Ready for Review & Approval
**Next Step**: Review with team, get approval, start Phase 1
**Next Step**: Review with team, get approval, start Phase 1

---

## 🔧 Backend/Server Audit

### Audit Summary: ✅ CLEAN

**Status**: Backend is well-maintained with no deadcode detected

**Modules Checked**:
```
✅ auth       → FE API client exists (auth.ts)
✅ customers  → FE API client exists (customers.ts)
✅ orders     → FE API client exists (orders.ts)
✅ products   → FE API client exists (products.ts)
✅ tenants    → FE API client exists (tenants.ts)
✅ common     → Shared utilities (no API endpoint)
✅ database   → Prisma connection (infrastructure)
✅ redis      → Cache layer (infrastructure)
✅ seo        → SEO helpers (infrastructure)
✅ sitemap    → Sitemap generation (background job)
✅ prisma     → Prisma service (infrastructure)
✅ validators → Validation pipes (infrastructure)
```

### API Endpoint Coverage

**All backend API modules have corresponding FE clients:**

| Backend Module | FE API Client | Status |
|----------------|---------------|--------|
| `/auth/*` | `lib/api/auth.ts` | ✅ Active |
| `/customers/*` | `lib/api/customers.ts` | ✅ Active |
| `/orders/*` | `lib/api/orders.ts` | ✅ Active |
| `/products/*` | `lib/api/products.ts` | ✅ Active |
| `/tenants/*` | `lib/api/tenants.ts` | ✅ Active |

**Infrastructure Modules (No API endpoints):**
- `common/` - Shared utilities, decorators, guards
- `database/` - Prisma database configuration
- `redis/` - Redis cache layer
- `seo/` - SEO metadata generation
- `sitemap/` - XML sitemap generation
- `prisma/` - Prisma service wrapper
- `validators/` - DTO validation pipes

### Findings

✅ **No deadcode detected** - All endpoints actively used
✅ **No duplicate APIs** - Each endpoint has single responsibility
✅ **No legacy patterns** - NestJS best practices followed
✅ **Good separation of concerns** - Infrastructure vs API modules

### Recommendations

**Low Priority Optimizations** (not urgent):

1. **API Versioning** (future-proofing)
   - Consider `/api/v1/` prefix for breaking changes
   - Currently: `/tenants/me`
   - Future: `/api/v1/tenants/me`

2. **Rate Limiting** (production readiness)
   - Add rate limiting for public endpoints
   - Protect against abuse

3. **API Documentation** (developer experience)
   - Generate Swagger/OpenAPI docs from NestJS decorators
   - Auto-sync with FE TypeScript types

**Conclusion**: Backend is production-ready and well-structured. **No refactoring needed.**

---

**Backend Audit Completed**: 2026-01-20
**Backend Status**: ✅ CLEAN - No refactoring needed

# Variant → Blocks Migration Audit Report

**Date:** 2026-01-18
**Purpose:** Audit codebase for renaming "variant" terminology to "blocks" (shadcn/blocks style)

---

## Executive Summary

### Database Impact: ✅ **NO SCHEMA CHANGES NEEDED**

The `landingConfig` is stored as **JSONB** in PostgreSQL:
```sql
-- server/prisma/schema.prisma:55
landingConfig Json?
```

This means:
- ✅ **Database schema stays the same** (no ALTER TABLE needed)
- ⚠️ **JSON keys would change** (optional data migration)
- ✅ **No breaking changes** to database structure

### Migration Scope

**Total Files Found:**
- **Server:** 2 files (DTOs and validators)
- **Client:** 169 files (components, types, utilities)

---

## 1. SERVER-SIDE CHANGES

### 1.1 Database Schema (NO CHANGES)

**File:** `server/prisma/schema.prisma`
```prisma
model Tenant {
  landingConfig Json?  // ✅ Stays as-is (JSONB column)
}
```

**Migration:** `server/prisma/migrations/20260106065844_init/migration.sql`
```sql
"landingConfig" JSONB,  -- ✅ No changes needed
```

### 1.2 DTOs (Type Definitions)

**File:** `server/src/tenants/dto/update-tenant.dto.ts`

**Current Structure:**
```typescript
class HeroSectionDto {
  @IsOptional()
  @IsString()
  variant?: string;  // Line 381
  // ...
}

class AboutSectionDto {
  variant?: string;  // Line 404
}

class ProductsSectionDto {
  variant?: string;  // Line 427
}

class TestimonialsSectionDto {
  variant?: string;  // Line 451
}

class ContactSectionDto {
  variant?: string;  // Line 474
}

class CtaSectionDto {
  variant?: string;  // Line 497
}
```

**Proposed Changes:**
```typescript
class HeroSectionDto {
  @IsOptional()
  @IsString()
  block?: string;  // ✅ Renamed from variant
  // ...
}
// ... (repeat for all 6 sections)
```

### 1.3 Validators (JSON Schema)

**File:** `server/src/validators/landing-config.validator.ts`

**Type Definitions (Lines 47-98):**
```typescript
// CURRENT
export type HeroVariant = 'gradient-overlay' | 'centered-minimal' | ...;
export type AboutVariant = 'side-by-side' | 'centered' | ...;
// ... etc

// PROPOSED
export type HeroBlock = 'gradient-overlay' | 'centered-minimal' | ...;
export type AboutBlock = 'side-by-side' | 'centered' | ...;
// ... etc
```

**Interface (Line 150):**
```typescript
// CURRENT
export interface LandingSection<T = Record<string, unknown>, V = string> {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  variant?: V;  // ✅ Rename to: block?: V
  config?: T;
}
```

**JSON Schema (Lines 244-441):**
```typescript
// CURRENT: 6 occurrences
hero: {
  properties: {
    variant: {
      type: 'string',
      enum: ['default', 'gradient-overlay', ...]
    }
  }
}

// PROPOSED
hero: {
  properties: {
    block: {  // ✅ Renamed
      type: 'string',
      enum: ['default', 'gradient-overlay', ...]
    }
  }
}
```

**Helper Functions (Lines 716-728):**
```typescript
// CURRENT
export function isValidHeroVariant(variant: string): variant is HeroVariant {
  const validVariants: HeroVariant[] = [...];
  return validVariants.includes(variant as HeroVariant);
}

// PROPOSED
export function isValidHeroBlock(block: string): block is HeroBlock {
  const validBlocks: HeroBlock[] = [...];
  return validBlocks.includes(block as HeroBlock);
}
```

**Default Config (Lines 742, 754, 764, 775, 784, 795):**
```typescript
// CURRENT
hero: {
  variant: 'default',
  // ...
}

// PROPOSED
hero: {
  block: 'default',
  // ...
}
```

**Exports (Lines 823-877):**
```typescript
// CURRENT
export const AVAILABLE_VARIANTS = {
  hero: [...] as HeroVariant[],
  about: [...] as AboutVariant[],
  // ...
};

// PROPOSED
export const AVAILABLE_BLOCKS = {
  hero: [...] as HeroBlock[],
  about: [...] as AboutBlock[],
  // ...
};
```

---

## 2. CLIENT-SIDE CHANGES

### 2.1 Type Definitions

**File:** `client/src/types/landing.ts`

**Current (Line 71):**
```typescript
export interface LandingSection<T = Record<string, unknown>, V = string> {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  variant?: V;  // ✅ Rename to: block?: V
  config?: T;
}
```

### 2.2 Core Components

**File:** `client/src/components/landing-builder/variant-sidebar.tsx`
- ✅ **Rename file to:** `block-sidebar.tsx`
- ✅ **Rename component:** `VariantSidebar` → `BlockSidebar`
- ✅ **Rename props:** `onVariantSelect` → `onBlockSelect`, `currentVariant` → `currentBlock`
- ✅ **Rename constants:** `HERO_VARIANTS` → `HERO_BLOCKS`, etc.
- ✅ **Update UI labels:** "Choose a variant style" → "Choose a block style"

**File:** `client/src/components/landing-builder/variant-selector.tsx`
- ✅ **NOTE:** This component is already removed from the form (Canva-style flow)
- ⚠️ **Decision needed:** Keep for legacy support or delete?

**File:** `client/src/app/landing-builder/page.tsx`
- Line 48: `const [showVariantSidebar, setShowVariantSidebar] = useState(false);`
  - ✅ Rename to: `showBlockSidebar`, `setShowBlockSidebar`
- Line 131-146: `handleVariantSelect` function
  - ✅ Rename to: `handleBlockSelect`
- Line 149: `handleVariantSidebarClose`
  - ✅ Rename to: `handleBlockSidebarClose`
- Line 275-282: `<VariantSidebar>` component
  - ✅ Replace with: `<BlockSidebar>`

### 2.3 Variant Implementation Files

**Directory:** `client/src/components/landing/variants/`

**Current Structure:**
```
variants/
├── about/
│   ├── about-cards.tsx
│   ├── about-centered.tsx
│   ├── about-magazine.tsx
│   ├── about-side-by-side.tsx
│   ├── about-storytelling.tsx
│   ├── about-timeline.tsx
│   └── index.ts
├── contact/
│   ├── contact-centered.tsx
│   ├── contact-default.tsx
│   ├── contact-map-focus.tsx
│   ├── contact-minimal.tsx
│   ├── contact-social-focused.tsx
│   ├── contact-split-form.tsx
│   └── index.ts
├── cta/
├── hero/
├── products/
├── testimonials/
└── index.ts
```

**Proposed:**
```
blocks/  ✅ Rename from "variants"
├── about/
├── contact/
├── cta/
├── hero/
├── products/
├── testimonials/
└── index.ts
```

**Component Files:**
- ✅ Keep current filenames (already semantic: `about-cards.tsx`, `hero-split.tsx`)
- ✅ Update imports: `from './variants/...'` → `from './blocks/...'`

### 2.4 Landing Section Components

**Files to Update:**
- `client/src/components/landing/tenant-about.tsx`
- `client/src/components/landing/tenant-contact.tsx`
- `client/src/components/landing/tenant-cta.tsx`
- `client/src/components/landing/tenant-hero.tsx`
- `client/src/components/landing/tenant-products.tsx`
- `client/src/components/landing/tenant-testimonials.tsx`

**Current Pattern:**
```typescript
const variant = section?.variant || 'default';

// Import from variants folder
import { AboutCards } from './variants/about';
```

**Proposed:**
```typescript
const block = section?.block || 'default';  // ✅ Renamed

// Import from blocks folder
import { AboutCards } from './blocks/about';  // ✅ Updated path
```

### 2.5 Utility Functions

**File:** `client/src/lib/landing/utils.ts`

**Lines 101, 111, 121, 131, 140, 150:**
```typescript
// CURRENT
hero: {
  variant: tenant.hero?.variant,
  // ...
}

// PROPOSED
hero: {
  block: tenant.hero?.block,  // ✅ Renamed
  // ...
}
```

### 2.6 Template Files

**File:** `client/src/lib/landing/templates/template-types.ts`

**Line 70:**
```typescript
// CURRENT
// Re-export variant types for convenience

// PROPOSED
// Re-export block types for convenience
```

**File:** `client/src/lib/landing/context/template-context.tsx`

**Lines 8, 72:**
```typescript
// CURRENT
// variant getters for each section
// Hooks to get the current variant for each section

// PROPOSED
// block getters for each section
// Hooks to get the current block for each section
```

---

## 3. DATA MIGRATION (OPTIONAL)

### 3.1 Current JSON Structure

```json
{
  "landingConfig": {
    "enabled": true,
    "template": "modern-starter",
    "hero": {
      "enabled": true,
      "title": "Welcome",
      "variant": "gradient-overlay"  ⚠️ Would change to "block"
    },
    "about": {
      "variant": "side-by-side"  ⚠️ Would change to "block"
    }
  }
}
```

### 3.2 Migration Script (IF renaming JSON keys)

**File:** `server/prisma/migrations/rename_variant_to_block.sql` (NEW)

```sql
-- PostgreSQL JSONB key rename
UPDATE "Tenant"
SET "landingConfig" = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            "landingConfig",
            '{hero,block}',
            COALESCE("landingConfig"->'hero'->'variant', 'null'::jsonb)
          ) - 'hero' || jsonb_build_object('hero',
            ("landingConfig"->'hero' - 'variant') || jsonb_build_object('block', "landingConfig"->'hero'->'variant')
          ),
          '{about,block}',
          COALESCE("landingConfig"->'about'->'variant', 'null'::jsonb)
        ) - 'about' || jsonb_build_object('about',
          ("landingConfig"->'about' - 'variant') || jsonb_build_object('block', "landingConfig"->'about'->'variant')
        ),
        -- ... repeat for products, testimonials, contact, cta
      )
    )
  )
)
WHERE "landingConfig" IS NOT NULL;
```

**⚠️ WARNING:** This is complex! Alternative approach:

### 3.3 Application-Level Migration (RECOMMENDED)

Create a migration service that runs on startup:

**File:** `server/src/migrations/variant-to-block.migration.ts` (NEW)

```typescript
import { PrismaClient } from '@prisma/client';

export async function migrateVariantToBlock() {
  const prisma = new PrismaClient();

  const tenants = await prisma.tenant.findMany({
    where: { landingConfig: { not: null } }
  });

  for (const tenant of tenants) {
    const config = tenant.landingConfig as any;

    // Rename variant → block for each section
    const sections = ['hero', 'about', 'products', 'testimonials', 'contact', 'cta'];

    for (const section of sections) {
      if (config[section]?.variant !== undefined) {
        config[section].block = config[section].variant;
        delete config[section].variant;
      }
    }

    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { landingConfig: config }
    });
  }

  console.log(`Migrated ${tenants.length} tenants`);
}
```

---

## 4. IMPLEMENTATION STRATEGY

### Phase 1: Backend (Server)
1. ✅ Update DTOs (`update-tenant.dto.ts`)
2. ✅ Update validators (`landing-config.validator.ts`)
3. ✅ Update type exports
4. ✅ Run tests

### Phase 2: Frontend (Client) - Types
1. ✅ Update `client/src/types/landing.ts`
2. ✅ Update `client/src/lib/landing/utils.ts`
3. ✅ Update template files

### Phase 3: Frontend - Components
1. ✅ Rename `variant-sidebar.tsx` → `block-sidebar.tsx`
2. ✅ Update `page.tsx` (landing-builder)
3. ✅ Rename `variants/` folder → `blocks/`
4. ✅ Update all section components (tenant-hero, tenant-about, etc.)
5. ✅ Update all imports

### Phase 4: Data Migration (OPTIONAL)
1. ⚠️ **Decision:** Rename JSON keys OR keep backward compatibility?
2. If renaming: Run migration script
3. Test with existing data

### Phase 5: Testing
1. ✅ Unit tests
2. ✅ Integration tests
3. ✅ Manual testing with builder UI

---

## 5. BACKWARD COMPATIBILITY OPTIONS

### Option A: Hard Migration (Rename Everything)
- Rename all `variant` → `block` in code AND data
- Requires data migration script
- Clean break, no legacy code
- **Risk:** High (one-time migration)

### Option B: Soft Migration (Dual Support)
- Support both `variant` and `block` in backend
- Frontend uses `block` only
- Data stays as `variant` internally
- **Risk:** Low (no data migration)

**Recommended:** Option B for initial rollout, then Option A later

**Code Example:**
```typescript
// Validator accepts both
export interface LandingSection {
  variant?: string;  // Legacy
  block?: string;    // New
}

// Getter prioritizes new field
function getBlock(section: LandingSection): string {
  return section.block ?? section.variant ?? 'default';
}
```

---

## 6. RISKS & MITIGATION

### Risk 1: Data Loss
- **Mitigation:** Backup database before migration
- **Test:** Run migration on staging first

### Risk 2: Breaking Changes
- **Mitigation:** Use Option B (dual support) initially
- **Test:** Comprehensive test suite

### Risk 3: Missed References
- **Mitigation:** Use TypeScript compiler to catch errors
- **Test:** Global search for "variant" after changes

---

## 7. SUMMARY CHECKLIST

### Server Changes (2 files)
- [ ] `server/src/tenants/dto/update-tenant.dto.ts` (6 occurrences)
- [ ] `server/src/validators/landing-config.validator.ts` (~50 occurrences)

### Client Changes (Core files)
- [ ] `client/src/types/landing.ts` (1 occurrence)
- [ ] `client/src/lib/landing/utils.ts` (6 occurrences)
- [ ] `client/src/lib/landing/templates/template-types.ts` (1 occurrence)
- [ ] `client/src/lib/landing/context/template-context.tsx` (2 occurrences)
- [ ] `client/src/components/landing-builder/variant-sidebar.tsx` (rename + refactor)
- [ ] `client/src/app/landing-builder/page.tsx` (4 occurrences)
- [ ] `client/src/components/landing-builder/variant-selector.tsx` (decide: keep or remove)

### Client Changes (Variants → Blocks)
- [ ] Rename folder: `client/src/components/landing/variants/` → `blocks/`
- [ ] Update 6 section components (tenant-hero, tenant-about, etc.)
- [ ] Update all imports across 169 files

### Data Migration (Optional)
- [ ] Create migration script
- [ ] Test on staging
- [ ] Backup production
- [ ] Execute migration
- [ ] Verify data integrity

---

## 8. RECOMMENDATION

**Phase 1 (Week 1):** Backend + Frontend types only
- Low risk, high impact
- No data migration needed
- Establishes foundation

**Phase 2 (Week 2):** Frontend components
- Update UI labels and component names
- Test builder functionality

**Phase 3 (Week 3+):** Data migration (if desired)
- Optional: Rename JSON keys
- Can be deferred indefinitely

**Total Effort:** ~2-3 weeks for complete migration
**Risk Level:** Low (if using dual support approach)

---

**Report Generated:** 2026-01-18
**Audited By:** Claude Code
**Status:** Ready for review

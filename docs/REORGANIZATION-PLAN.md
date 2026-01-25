# 📋 Reorganization Plan - Naming & Folder Structure

**Status:** 🔍 **Planning Phase** **Date:** January 2026 **Goal:** Eliminate
naming confusion and improve clarity

---

## 🎯 Objectives

1. **Clear separation** between shared utilities and feature-specific code
2. **Eliminate naming confusion** (lib/landing vs features/landing)
3. **Consistent naming conventions** across all folders
4. **No ambiguity** about where code should live
5. **Easy to understand** for new developers

---

## 🔍 Current Issues & Confusion Points

### Issue 1: Landing Folder Confusion ⚠️

**Current State:**

```
lib/landing/              # Shared utilities (templates, context)
features/landing/         # Landing page rendering blocks
features/landing-builder/ # Landing page builder UI
```

**Problem:**

- 3 folders with "landing" in the name
- `lib/landing` contains TemplateProvider that's used by `features/landing`
- Developers confused: "Which landing folder do I use?"
- Not immediately clear what each does

**Confusion Level:** 🔴 **HIGH**

---

### Issue 2: Onboarding Folder Overlap ⚠️

**Current State:**

```
lib/onboarding/           # Shared onboarding utilities
features/onboarding/      # Onboarding UI components
hooks/use-onboarding.ts   # Onboarding hook (shared)
```

**Problem:**

- Overlap between lib and feature
- Hook is in top-level `hooks/` but closely related to onboarding feature
- Not clear if `lib/onboarding` should be moved to `features/onboarding/lib/`

**Confusion Level:** 🟡 **MEDIUM**

---

### Issue 3: Shared vs Feature-Specific Lib ⚠️

**Current State:**

```
lib/                      # Shared utilities
features/*/lib/           # Feature-specific utilities
```

**Problem:**

- Some `lib/*` folders contain code that's ONLY used by one feature
- Example: `lib/landing` is heavily used by `features/landing` and
  `features/landing-builder`
- But is it truly "shared" if only 2 related features use it?

**Confusion Level:** 🟡 **MEDIUM**

---

### Issue 4: Feature Naming Inconsistency ⚠️

**Current State:**

```
features/landing/         # Short name
features/landing-builder/ # Hyphenated name
features/seo/            # Acronym
features/pwa/            # Acronym
```

**Problem:**

- Mix of naming styles (short, hyphenated, acronyms)
- Not immediately clear what some features do from name alone
- `landing` vs `landing-builder` distinction not obvious

**Confusion Level:** 🟢 **LOW**

---

## 💡 Proposed Solutions

### Solution 1: Rename & Reorganize Landing Folders

**Goal:** Make it crystal clear what each folder does

#### Option A: Rename with Clear Prefixes (RECOMMENDED) ✅

```
lib/landing-templates/        # Template system, context, blocks config
features/tenant-landing/      # Tenant landing page rendering (public)
features/landing-builder/     # Landing builder UI (dashboard)
```

**Rationale:**

- `lib/landing-templates/` → Clear it's the template system
- `features/tenant-landing/` → Clear it renders tenant public pages
- `features/landing-builder/` → Clear it's the builder interface
- Zero ambiguity

**Migration Impact:** 🟡 Medium (rename imports)

---

#### Option B: Move Everything to Features (Alternative)

```
features/landing-builder/
├── lib/
│   ├── templates/       # Moved from lib/landing/templates
│   ├── context/         # Moved from lib/landing/context
│   └── ...
├── components/
└── ...

features/tenant-landing/
├── components/          # Landing blocks (hero, about, etc.)
└── ...
```

**Rationale:**

- All landing-related code in features
- Shared via `features/landing-builder/lib/templates`
- `tenant-landing` imports from `landing-builder/lib`

**Migration Impact:** 🔴 High (major restructure)

---

### Solution 2: Reorganize Onboarding

**Goal:** Consolidate onboarding code

#### Option A: Move Lib to Feature (RECOMMENDED) ✅

```
features/onboarding/
├── components/
├── lib/                 # Moved from lib/onboarding/
│   ├── constants.ts
│   ├── types.ts
│   └── index.ts
└── index.ts

hooks/
└── use-onboarding.ts    # Stays (shared across app/dashboard)
```

**Rationale:**

- `lib/onboarding` ONLY used by `features/onboarding`
- Move it into feature module
- Keep `hooks/use-onboarding.ts` shared (used by multiple pages)

**Migration Impact:** 🟢 Low (minimal imports)

---

#### Option B: Keep Current Structure (No Change)

```
lib/onboarding/          # Keep as shared
features/onboarding/     # Keep as is
hooks/use-onboarding.ts  # Keep as shared
```

**Rationale:**

- Already working
- `lib/onboarding` provides shared types/constants
- Low risk, no migration needed

**Migration Impact:** ⚪ None

---

### Solution 3: Establish Clear Naming Rules

**Goal:** Consistent naming conventions

#### Proposed Naming Rules ✅

| Type                   | Pattern              | Example                             |
| ---------------------- | -------------------- | ----------------------------------- |
| **Feature (Domain)**   | Singular noun        | `product`, `order`, `customer`      |
| **Feature (Compound)** | Hyphenated           | `landing-builder`, `tenant-landing` |
| **Feature (Service)**  | Service suffix       | `auth-service`, `payment-service`   |
| **Lib Folder**         | Plural or category   | `templates`, `utilities`, `helpers` |
| **Acronyms**           | Keep as-is if common | `seo`, `pwa`, `api`                 |

**Apply to Current Features:**

| Current           | Proposed         | Reason                        |
| ----------------- | ---------------- | ----------------------------- |
| `landing`         | `tenant-landing` | Clarify it's for tenant pages |
| `landing-builder` | ✅ Keep          | Already clear                 |
| `discover`        | ✅ Keep          | Clear domain                  |
| `seo`             | ✅ Keep          | Common acronym                |
| `pwa`             | ✅ Keep          | Common acronym                |

---

### Solution 4: Document Shared vs Feature-Specific Guidelines

**Goal:** Clear rules on where code belongs

#### Decision Matrix ✅

| If Code Is...                  | Location                                  | Example                        |
| ------------------------------ | ----------------------------------------- | ------------------------------ |
| **Used by 3+ features**        | `lib/`                                    | `format.ts`, `api/client.ts`   |
| **Used by 2 related features** | Shared `lib/` OR primary feature's `lib/` | `lib/landing-templates/`       |
| **Used by 1 feature only**     | `features/{module}/lib/`                  | `features/discover/lib/`       |
| **Hook used by 3+ pages**      | `hooks/`                                  | `use-auth.ts`, `use-tenant.ts` |
| **Hook used by 1 feature**     | `features/{module}/hooks/`                | `use-products.ts`              |

---

## 🗺️ Recommended Reorganization Plan

### Phase 1: Rename Landing Folders (High Priority) 🔴

**Changes:**

```diff
- lib/landing/
+ lib/landing-templates/

- features/landing/
+ features/tenant-landing/

  features/landing-builder/  (no change)
```

**Files to Update:**

- ~30 import statements
- Update all `from '@/lib/landing'` → `'@/lib/landing-templates'`
- Update all `from '@/features/landing'` → `'@/features/tenant-landing'`

**Benefit:**

- ✅ Eliminates "landing" ambiguity
- ✅ Crystal clear what each folder does
- ✅ Easy to explain to new developers

**Risk:** 🟡 Medium (many imports to update)

---

### Phase 2: Move Onboarding Lib (Low Priority) 🟢

**Changes:**

```diff
- lib/onboarding/
+ features/onboarding/lib/
```

**Files to Update:**

- ~5 import statements
- Update `from '@/lib/onboarding'` → `'@/features/onboarding'`

**Benefit:**

- ✅ Consolidates onboarding code
- ✅ Cleaner lib/ folder

**Risk:** 🟢 Low (few imports)

---

### Phase 3: Update Documentation (High Priority) 🔴

**Changes:**

- Update `MODULAR-ARCHITECTURE.md`
- Add clear guidelines on naming conventions
- Add decision matrix for shared vs feature-specific

**Benefit:**

- ✅ Clear reference for all developers
- ✅ Prevents future confusion

**Risk:** ⚪ None

---

## 📊 Impact Analysis

### Before Reorganization

**Confusion Points:** 4 **Ambiguous Folders:** 3 (`landing` related) **Developer
Clarity:** 🟡 Medium

### After Reorganization

**Confusion Points:** 0 **Ambiguous Folders:** 0 **Developer Clarity:** 🟢 High

---

## 🎯 Final Recommendation

### DO (Recommended) ✅

1. **Rename landing folders** (Phase 1)
   - `lib/landing` → `lib/landing-templates`
   - `features/landing` → `features/tenant-landing`

2. **Update documentation** (Phase 3)
   - Add naming conventions
   - Add decision matrix

3. **Test thoroughly**
   - Build must succeed
   - All routes must work
   - No runtime errors

### MAYBE (Optional) 🤔

1. **Move onboarding lib** (Phase 2)
   - Only if we want ultimate consolidation
   - Not urgent, current structure works

### DON'T ❌

1. **Don't do Option B** (move all landing to features)
   - Too disruptive
   - High migration cost
   - Current shared lib pattern works

2. **Don't rename all features**
   - Most names are already clear
   - Risk not worth the benefit

---

## 📋 Migration Checklist (If Approved)

### Phase 1: Landing Folders

- [ ] Create new folders with renamed paths
- [ ] Copy files to new locations
- [ ] Update all imports (~30 files)
- [ ] Update barrel exports (index.ts)
- [ ] Test build
- [ ] Test all landing-related pages
- [ ] Delete old folders
- [ ] Commit & push

### Phase 2: Onboarding (Optional)

- [ ] Move `lib/onboarding/` to `features/onboarding/lib/`
- [ ] Update imports (~5 files)
- [ ] Update barrel exports
- [ ] Test build
- [ ] Commit & push

### Phase 3: Documentation

- [ ] Update `MODULAR-ARCHITECTURE.md`
- [ ] Add naming conventions section
- [ ] Add decision matrix
- [ ] Update folder structure diagrams
- [ ] Commit & push

---

## ⏱️ Estimated Time

| Phase     | Time          | Risk      |
| --------- | ------------- | --------- |
| Phase 1   | 30-45 min     | 🟡 Medium |
| Phase 2   | 15-20 min     | 🟢 Low    |
| Phase 3   | 10-15 min     | 🟢 Low    |
| **Total** | **55-80 min** |           |

---

## 🤔 Decision Required

**Question for Team:**

1. **Approve Phase 1** (rename landing folders)?
   - ✅ YES - Eliminate confusion, clearer structure
   - ❌ NO - Keep current, already working

2. **Approve Phase 2** (move onboarding lib)?
   - ✅ YES - Ultimate consolidation
   - ❌ NO - Not urgent, optional

3. **Approve Phase 3** (update docs)?
   - ✅ YES - Essential for clarity
   - ❌ NO - Current docs sufficient

---

## 📝 Summary

**Current Problem:**

- 3 folders with "landing" → confusing
- `lib/landing` vs `features/landing` → ambiguous
- No clear naming rules → inconsistent

**Proposed Solution:**

- Rename to `lib/landing-templates`, `features/tenant-landing`
- Establish naming conventions
- Update documentation

**Benefits:**

- ✅ Zero ambiguity
- ✅ Crystal clear structure
- ✅ Easy for new developers
- ✅ Better maintainability

**Next Steps:**

1. Review this plan
2. Approve/reject phases
3. Execute if approved
4. Test thoroughly
5. Update docs

---

**Prepared by:** Claude Agent **Date:** January 2026 **Status:** Awaiting
approval

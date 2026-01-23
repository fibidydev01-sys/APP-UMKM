# 🧠 ONBOARDING ARCHITECTURE DECISION

> **Keputusan**: Client-Side Only (No Backend Needed)
> 
> **Date**: 2026-01-20
> 
> **Status**: ✅ Approved

---

## 📋 Executive Summary

Sistem onboarding tenant **TIDAK memerlukan backend tambahan** karena:

1. ✅ Semua data sudah ada di existing API (`/api/tenants/me`)
2. ✅ Progress calculation adalah **derived state** (bukan stored state)
3. ✅ Dismiss state cukup di localStorage (user preference, bukan business data)
4. ✅ Lebih performant (no extra API calls)
5. ✅ Lebih maintainable (single source of truth)

---

## 🎯 Alasan Detail: Kenapa NO BACKEND?

### 1. **Data Sudah Ada - Tidak Perlu Duplikasi**

```
EXISTING DATA FLOW:
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Tenant Data   │ ──► │  /api/tenants/me │ ──► │   Frontend      │
│   (Database)    │     │  (Existing API)  │     │   (Calculate)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘

Semua field yang dibutuhkan untuk calculate progress SUDAH ADA:
- tenant.logo ✅
- tenant.heroBackgroundImage ✅
- tenant.whatsapp ✅
- tenant.testimonials ✅
- tenant.theme.primaryColor ✅
- products (from /api/products) ✅
```

**Kalau pakai backend:**
```
❌ ANTI-PATTERN: Data Duplikasi
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Tenant Data   │ ──► │ Calculate       │ ──► │ Store Progress  │
│   (Database)    │     │ (Backend)       │     │ (Database LAGI) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                                 ❌ REDUNDANT!
                                                 Progress = f(tenant)
                                                 Tidak perlu disimpan
```

---

### 2. **Progress adalah DERIVED STATE**

```typescript
// Progress BUKAN data baru, tapi KALKULASI dari data existing
progress = f(tenant, products)

// Contoh:
const hasLogo = !!tenant.logo;           // Derived dari tenant
const hasHero = !!tenant.heroBackgroundImage;  // Derived dari tenant
const productCount = products.length;     // Derived dari products

// Progress score = pure function, TIDAK perlu disimpan
const score = calculateScore(tenant, products);
```

**Prinsip Software Engineering:**
> "Don't store what you can calculate"
> 
> — Database Normalization Principle

**Kenapa?**
- Menghindari **data inconsistency**
- Menghindari **stale data**
- Mengurangi **storage cost**
- Simplify **data management**

---

### 3. **Dismiss State = User Preference (Bukan Business Data)**

```
DISMISS STATE ANALYSIS:
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  Q: Apakah "onboarding dismissed" adalah business data?        │
│  A: TIDAK. Ini adalah UI preference.                           │
│                                                                │
│  Q: Apa yang terjadi jika user clear browser data?             │
│  A: Onboarding muncul lagi. ACCEPTABLE!                        │
│     (Malah bagus - reminder untuk complete profile)            │
│                                                                │
│  Q: Perlu sync across devices?                                 │
│  A: TIDAK. Onboarding adalah contextual per session/device.    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**localStorage is PERFECT for this use case:**

| Criteria | localStorage | Backend DB |
|----------|--------------|------------|
| Persist across sessions | ✅ Yes | ✅ Yes |
| Persist across devices | ❌ No | ✅ Yes |
| Sync needed? | ❌ No need | Overkill |
| Complexity | Simple | Complex |
| API calls | 0 | +1 per load |
| Latency | Instant | Network dependent |

---

### 4. **Performance: Zero Extra API Calls**

```
WITH BACKEND APPROACH (❌ Bad):
┌──────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Page    │ ──► │ GET /tenants/me  │ ──► │ Render Dashboard │
│  Load    │     └──────────────────┘     └──────────────────┘
│          │     ┌──────────────────┐
│          │ ──► │ GET /products    │ (parallel)
│          │     └──────────────────┘
│          │     ┌──────────────────┐
│          │ ──► │ GET /progress    │ ❌ EXTRA CALL!
│          │     └──────────────────┘
└──────────┘

Total API calls: 3
Extra latency: +100-300ms


CLIENT-SIDE APPROACH (✅ Good):
┌──────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Page    │ ──► │ GET /tenants/me  │ ──► │ Calculate +      │
│  Load    │     └──────────────────┘     │ Render Dashboard │
│          │     ┌──────────────────┐     └──────────────────┘
│          │ ──► │ GET /products    │ (parallel)
│          │     └──────────────────┘
└──────────┘

Total API calls: 2 (same as before onboarding feature)
Extra latency: 0ms (calculation is <1ms)
```

---

### 5. **Real-Time Updates (Instant Feedback)**

```
USER JOURNEY WITH CLIENT-SIDE:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. User upload logo di Settings                                │
│     ↓                                                           │
│  2. tenant.logo updated in state                                │
│     ↓                                                           │
│  3. useOnboarding hook recalculates (useMemo)                   │
│     ↓                                                           │
│  4. Progress bar updates INSTANTLY ✨                           │
│                                                                 │
│  Time: <16ms (single React render cycle)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


USER JOURNEY WITH BACKEND (Hypothetical):
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. User upload logo di Settings                                │
│     ↓                                                           │
│  2. PATCH /tenants/me (save logo)                               │
│     ↓                                                           │
│  3. Backend recalculates progress                               │
│     ↓                                                           │
│  4. Backend saves to DB                                         │
│     ↓                                                           │
│  5. Response returns to frontend                                │
│     ↓                                                           │
│  6. Frontend refetches progress OR receives in response         │
│     ↓                                                           │
│  7. Progress bar updates                                        │
│                                                                 │
│  Time: 200-500ms (network + DB operations)                      │
│  Complexity: Need to update PATCH endpoint logic                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6. **Maintainability: Single Source of Truth**

```
CLIENT-SIDE (✅ Clean Architecture):

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  steps-config.ts ─────► calculateProgress() ─────► UI      │
│        │                                                    │
│        └── Single place to:                                 │
│            • Add new steps                                  │
│            • Change point values                            │
│            • Modify criteria                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘


BACKEND APPROACH (❌ Scattered Logic):

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Frontend steps-config.ts ◄──── Must match ────►  Backend  │
│        │                                          calc.ts  │
│        │                                             │      │
│        └── TWO places to maintain!                   │      │
│            • Change in one? Update the other!        │      │
│            • Risk of mismatch                        │      │
│            • Double the work                         │      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 7. **Kapan PERLU Backend?**

Backend untuk onboarding progress **HANYA diperlukan jika**:

| Scenario | Needed? | Our Case |
|----------|---------|----------|
| Progress perlu sync across devices | ✅ Yes | ❌ Tidak perlu |
| Analytics untuk track completion rate | ✅ Yes | ❌ Bisa pakai event tracking |
| Gamification dengan rewards | ✅ Maybe | ❌ Belum ada |
| Email reminder untuk incomplete | ✅ Yes | ❌ Future feature |
| Admin dashboard untuk monitor | ✅ Yes | ❌ Future feature |

**Untuk MVP/Current scope**: Client-side is sufficient! ✅

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │
│  │   useTenant()   │    │  useProducts()  │    │ localStorage    │     │
│  │   (existing)    │    │   (existing)    │    │ (dismiss state) │     │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘     │
│           │                      │                      │               │
│           └──────────┬───────────┘                      │               │
│                      │                                  │               │
│                      ▼                                  │               │
│           ┌─────────────────────┐                       │               │
│           │  useOnboarding()    │◄──────────────────────┘               │
│           │  - calculateProgress│                                       │
│           │  - dismiss/restore  │                                       │
│           └──────────┬──────────┘                                       │
│                      │                                                  │
│                      ▼                                                  │
│           ┌─────────────────────┐                                       │
│           │  OnboardingWizard   │                                       │
│           │  (UI Component)     │                                       │
│           └─────────────────────┘                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Existing API calls only
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (NestJS)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐                            │
│  │ GET /tenants/me │    │ GET /products   │    NO NEW ENDPOINTS! ✅    │
│  │   (existing)    │    │   (existing)    │                            │
│  └─────────────────┘    └─────────────────┘                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Comparison Table

| Aspect | Client-Side (✅ Chosen) | Backend Approach |
|--------|------------------------|------------------|
| **API Calls** | 0 extra | +1 per page load |
| **Latency** | Instant (<1ms calc) | +100-300ms |
| **Complexity** | Low | High |
| **Maintenance** | 1 place | 2 places |
| **Data Consistency** | Always in sync | Risk of stale |
| **Real-time Updates** | Instant | Requires refetch |
| **Storage Cost** | 0 | +1 field per tenant |
| **Code Changes** | Frontend only | Frontend + Backend |
| **Testing** | Unit test calc function | Integration tests |
| **Deployment** | Frontend only | Full stack deploy |

---

## 🔮 Future Considerations

### Kapan Migrate ke Backend?

**Trigger untuk backend migration:**

1. **Analytics Dashboard**
   - Butuh track completion rate across all tenants
   - Butuh identify drop-off points
   - Solution: Backend calculation + store

2. **Email Campaigns**
   - "Complete your profile" reminder emails
   - Need to know who hasn't completed
   - Solution: Cron job + stored progress

3. **Gamification**
   - Rewards, badges, points system
   - Leaderboard across tenants
   - Solution: Backend tracking

4. **A/B Testing**
   - Test different step orders
   - Track which sequence converts better
   - Solution: Backend experiment system

### Migration Path (When Needed):

```typescript
// Future: Add to Prisma schema
model Tenant {
  // ... existing fields
  
  // Onboarding tracking (add when needed)
  onboardingProgress     Int       @default(0)
  onboardingCompletedAt  DateTime?
  onboardingDismissedAt  DateTime?
}

// Future: Add API endpoint
// GET /api/tenants/me/onboarding
// Returns: { progress, completedAt, dismissedAt }

// Future: Add webhook/cron
// Calculate and store progress on tenant update
```

**But for now: YAGNI (You Ain't Gonna Need It)** ✅

---

## ✅ Decision Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   DECISION: Client-Side Only Implementation                     │
│                                                                 │
│   REASONS:                                                      │
│   1. Data already exists - no duplication needed                │
│   2. Progress is derived state - don't store calculations       │
│   3. Dismiss is user preference - localStorage is perfect       │
│   4. Zero extra API calls - better performance                  │
│   5. Instant updates - better UX                                │
│   6. Single source of truth - easier maintenance                │
│   7. YAGNI - backend features not needed yet                    │
│                                                                 │
│   TRADE-OFFS ACCEPTED:                                          │
│   • No cross-device sync for dismiss state (acceptable)         │
│   • No server-side analytics yet (can add later)                │
│   • Clear browser = onboarding reappears (actually good!)       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 References

- [React Derived State](https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state)
- [YAGNI Principle](https://martinfowler.com/bliki/Yagni.html)
- [Database Normalization](https://en.wikipedia.org/wiki/Database_normalization)
- [localStorage vs Backend](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Author**: Development Team
**Reviewed**: 2026-01-20
**Status**: ✅ Approved for Implementation
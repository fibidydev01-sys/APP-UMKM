# 🏷️ UNIFIED CATEGORY SYSTEM - INFINITE & SEARCHABLE

> **Status**: 📋 Blueprint Ready
>
> **Version**: 1.0
>
> **Date**: 2026-01-21
>
> **Critical Issue**: Category mismatch between frontend (15 fixed) and backend (unlimited String)

---

## 🚨 CURRENT PROBLEM

### The Mismatch:

```
Backend (Prisma Schema):
  category: String           ✅ Accepts ANY value (unlimited!)
  @@index([category])        ✅ Indexed for fast search

Frontend (categories.ts):
  CATEGORY_CONFIG = {        ❌ Only 15 fixed categories
    WARUNG_KELONTONG,
    BENGKEL_MOTOR,
    ... (13 more)
  }

Discover Page (/discover/[category]/page.tsx):
  if (!CATEGORY_CONFIG[key]) {
    notFound();              ❌ Returns 404 for dynamic categories!
  }
```

### The Flow Breaks:

```
1. User registers → "Distro Streetwear" (not in fixed list)
   ✅ Backend saves: category = "Distro Streetwear"

2. User searches → /discover/distro-streetwear
   ❌ Frontend returns 404 (not in CATEGORY_CONFIG)

3. Another user wants to register → "Distro Streetwear"
   ✅ Backend has tenant with this category
   ❌ But discover page shows nothing!
```

---

## 💡 SOLUTION: HYBRID CATEGORY SYSTEM

### Architecture:

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  UNIFIED CATEGORY SYSTEM                                  │
│                                                           │
│  ┌─────────────────────┐  ┌─────────────────────────┐    │
│  │ PREDEFINED (15)     │  │ DYNAMIC (∞)             │    │
│  │                     │  │                         │    │
│  │ - Has icon         │  │ - From DB (real data)   │    │
│  │ - Has color        │  │ - No icon (use default) │    │
│  │ - Has features     │  │ - No color (use gray)   │    │
│  │ - Has labels       │  │ - Basic display         │    │
│  │                     │  │                         │    │
│  │ Examples:           │  │ Examples:               │    │
│  │ - Warung Kelontong │  │ - Distro Streetwear     │    │
│  │ - Bengkel Motor    │  │ - Klinik Hewan          │    │
│  │ - Salon            │  │ - Toko Bunga            │    │
│  │ ... (12 more)      │  │ - Service Komputer      │    │
│  └─────────────────────┘  └─────────────────────────┘    │
│           │                          │                    │
│           └──────────┬───────────────┘                    │
│                      ▼                                    │
│         ┌────────────────────────┐                        │
│         │ UNIFIED DISPLAY        │                        │
│         │ - Search autocomplete  │                        │
│         │ - Discover pages       │                        │
│         │ - Registration form    │                        │
│         └────────────────────────┘                        │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## 🏗️ IMPLEMENTATION PLAN

### Phase 1: Backend API (NEW ENDPOINTS)

#### 1.1. Add Categories Endpoint

**File**: `server/src/categories/categories.controller.ts` (NEW)

```typescript
@Controller('categories')
export class CategoriesController {
  /**
   * Get all unique categories from tenants
   * GET /api/categories
   * Public endpoint
   *
   * Returns: string[] - Array of unique category strings
   * Example: ["WARUNG_KELONTONG", "BENGKEL_MOTOR", "Distro Streetwear", ...]
   */
  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllUniqueCategories();
  }

  /**
   * Get category statistics
   * GET /api/categories/stats
   * Public endpoint
   *
   * Returns: { category: string, count: number }[]
   * Example: [
   *   { category: "WARUNG_KELONTONG", count: 150 },
   *   { category: "Distro Streetwear", count: 5 },
   *   ...
   * ]
   */
  @Get('stats')
  async getCategoryStats() {
    return this.categoriesService.getCategoryStats();
  }

  /**
   * Search categories (autocomplete)
   * GET /api/categories/search?q=distro
   * Public endpoint
   *
   * Returns: string[] - Matching categories
   * Example: ["Distro Streetwear", "Distro Vintage", ...]
   */
  @Get('search')
  async searchCategories(@Query('q') query: string) {
    return this.categoriesService.searchCategories(query);
  }
}
```

#### 1.2. Add Categories Service

**File**: `server/src/categories/categories.service.ts` (NEW)

```typescript
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all unique categories from active tenants
   */
  async getAllUniqueCategories(): Promise<string[]> {
    const result = await this.prisma.tenant.findMany({
      where: { status: 'ACTIVE' },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return result.map((t) => t.category);
  }

  /**
   * Get category stats (count of tenants per category)
   */
  async getCategoryStats(): Promise<{ category: string; count: number }[]> {
    const result = await this.prisma.tenant.groupBy({
      by: ['category'],
      where: { status: 'ACTIVE' },
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
    });

    return result.map((r) => ({
      category: r.category,
      count: r._count.category,
    }));
  }

  /**
   * Search categories by query string
   */
  async searchCategories(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];

    const result = await this.prisma.tenant.findMany({
      where: {
        status: 'ACTIVE',
        category: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: { category: true },
      distinct: ['category'],
      take: 20, // Limit results
    });

    return result.map((t) => t.category);
  }
}
```

---

### Phase 2: Frontend Type System

#### 2.1. Update Category Types

**File**: `client/src/types/category.ts` (NEW)

```typescript
import type { LucideIcon } from 'lucide-react';

// ==========================================
// PREDEFINED CATEGORY (with icon & color)
// ==========================================

export interface PredefinedCategory {
  key: string;
  icon: LucideIcon;
  label: string;
  labelShort: string;
  color: string;
  description: string;
  features: CategoryFeatures;
  labels: CategoryLabels;
  isPredefined: true;
}

// ==========================================
// DYNAMIC CATEGORY (from database)
// ==========================================

export interface DynamicCategory {
  key: string;
  label: string;
  count?: number;          // Number of tenants in this category
  isPredefined: false;
}

// ==========================================
// UNIFIED CATEGORY (either type)
// ==========================================

export type Category = PredefinedCategory | DynamicCategory;

// ==========================================
// CATEGORY FEATURES
// ==========================================

export interface CategoryFeatures {
  stock: boolean;
  debt: boolean;
  booking: boolean;
  tracking: boolean;
  membership: boolean;
  cashier: boolean;
}

export interface CategoryLabels {
  product: string;
  price: string;
  customer: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface CategoryStatsResponse {
  category: string;
  count: number;
}

export interface CategoriesResponse {
  predefined: PredefinedCategory[];
  dynamic: DynamicCategory[];
  all: Category[];
}
```

---

### Phase 3: Frontend Category Service

#### 3.1. Create Unified Category Service

**File**: `client/src/lib/categories/unified-service.ts` (NEW)

```typescript
import { CATEGORY_CONFIG } from '@/config/categories';
import type { Category, PredefinedCategory, DynamicCategory } from '@/types/category';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// ==========================================
// FETCH CATEGORIES FROM API
// ==========================================

/**
 * Fetch all unique categories from backend
 */
export async function fetchAllCategoriesFromDB(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Fetch category stats (with counts)
 */
export async function fetchCategoryStats(): Promise<{ category: string; count: number }[]> {
  try {
    const res = await fetch(`${API_URL}/categories/stats`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Search categories (autocomplete)
 */
export async function searchCategories(query: string): Promise<string[]> {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(`${API_URL}/categories/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ==========================================
// UNIFIED CATEGORY LOGIC
// ==========================================

/**
 * Get predefined categories (15 with icons)
 */
export function getPredefinedCategories(): PredefinedCategory[] {
  return Object.values(CATEGORY_CONFIG).map((cat) => ({
    ...cat,
    isPredefined: true as const,
  }));
}

/**
 * Check if category is predefined
 */
export function isPredefinedCategory(categoryKey: string): boolean {
  return categoryKey in CATEGORY_CONFIG;
}

/**
 * Get category config (predefined or dynamic)
 */
export function getCategoryConfig(
  categoryKey: string,
  dynamicCategories: string[] = []
): Category | null {
  // Check predefined first
  if (isPredefinedCategory(categoryKey)) {
    return {
      ...CATEGORY_CONFIG[categoryKey],
      isPredefined: true as const,
    };
  }

  // Check dynamic categories
  if (dynamicCategories.includes(categoryKey)) {
    return {
      key: categoryKey,
      label: categoryKey,
      isPredefined: false as const,
    };
  }

  return null;
}

/**
 * Get all categories (predefined + dynamic)
 */
export async function getAllCategories(): Promise<Category[]> {
  const predefined = getPredefinedCategories();
  const dbCategories = await fetchAllCategoriesFromDB();

  // Filter out predefined from DB results
  const dynamicKeys = dbCategories.filter((cat) => !isPredefinedCategory(cat));

  const dynamic: DynamicCategory[] = dynamicKeys.map((key) => ({
    key,
    label: key,
    isPredefined: false as const,
  }));

  return [...predefined, ...dynamic];
}

/**
 * Get all categories with stats
 */
export async function getAllCategoriesWithStats(): Promise<Category[]> {
  const predefined = getPredefinedCategories();
  const stats = await fetchCategoryStats();

  // Create map for quick lookup
  const statsMap = new Map(stats.map((s) => [s.category, s.count]));

  // Add counts to predefined
  const predefinedWithCounts = predefined.map((cat) => ({
    ...cat,
    count: statsMap.get(cat.key) || 0,
  }));

  // Get dynamic categories (not in predefined)
  const dynamicStats = stats.filter((s) => !isPredefinedCategory(s.category));
  const dynamic: DynamicCategory[] = dynamicStats.map((s) => ({
    key: s.category,
    label: s.category,
    count: s.count,
    isPredefined: false as const,
  }));

  return [...predefinedWithCounts, ...dynamic];
}
```

---

### Phase 4: Update Registration Flow

#### 4.1. Update Step Category Component

**File**: `client/src/components/auth/register-steps/step-category.tsx` (UPDATE)

```typescript
'use client';

import { useState } from 'react';
import { CategoryCard } from '../category-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCategoryList } from '@/config/categories';
import { Package, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const handleCustomCategorySelect = () => {
    if (customCategory.trim()) {
      onSelectCategory(customCategory.trim());
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Pilih Kategori Usaha</h2>
        <p className="text-muted-foreground">
          Pilih yang paling sesuai dengan bisnis Anda
        </p>
      </div>

      {/* Category Grid - Predefined */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.key}
            icon={cat.icon}
            label={cat.label}
            color={cat.color}
            isSelected={selectedCategory === cat.key}
            onClick={() => {
              onSelectCategory(cat.key);
              setShowCustomInput(false);
              setCustomCategory('');
            }}
          />
        ))}
      </div>

      {/* "Lainnya" Section */}
      {!showCustomInput ? (
        <button
          type="button"
          onClick={() => setShowCustomInput(true)}
          className={cn(
            'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all',
            'border-dashed border-muted-foreground/30 hover:border-primary/50'
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
          <Sparkles className="w-5 h-5 text-muted-foreground" />
        </button>
      ) : (
        <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <p className="font-medium">Kategori Custom</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-category">Nama Kategori</Label>
            <Input
              id="custom-category"
              placeholder="Contoh: Distro Streetwear, Klinik Hewan, dll"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Kategori ini akan tersimpan dan bisa dicari oleh pengguna lain
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCustomInput(false);
                setCustomCategory('');
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCustomCategorySelect}
              disabled={!customCategory.trim()}
              className="flex-1"
            >
              Gunakan Kategori Ini
            </Button>
          </div>
        </div>
      )}

      {/* Selected Custom Category Display */}
      {selectedCategory && !categories.find((c) => c.key === selectedCategory) && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <p className="font-medium">Kategori terpilih: {selectedCategory}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
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

### Phase 5: Update Discover Page

#### 5.1. Make Discover Page Dynamic

**File**: `client/src/app/discover/[category]/page.tsx` (UPDATE)

```typescript
import type { Metadata } from 'next';
import { CategoryPageClient } from './client';
import { getCategoryConfig } from '@/lib/categories/unified-service';
import { fetchAllCategoriesFromDB } from '@/lib/categories/unified-service';

// ══════════════════════════════════════════════════════════════
// DYNAMIC PARAMS (SSG for known categories)
// ══════════════════════════════════════════════════════════════

export async function generateStaticParams() {
  // Generate params for predefined + top dynamic categories
  const allCategories = await fetchAllCategoriesFromDB();

  return allCategories.map((category) => ({
    category: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }));
}

// ══════════════════════════════════════════════════════════════
// METADATA
// ══════════════════════════════════════════════════════════════

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const allCategories = await fetchAllCategoriesFromDB();
  const categoryKey = slugToCategoryKey(categorySlug);
  const category = await getCategoryConfig(categoryKey, allCategories);

  if (!category) {
    return {
      title: 'Kategori Tidak Ditemukan | Fibidy',
    };
  }

  const label = category.isPredefined ? category.label : category.key;
  const description = category.isPredefined
    ? category.description
    : `Temukan UMKM ${label} di Indonesia`;

  return {
    title: `${label} - Discover UMKM | Fibidy`,
    description,
    // ... rest of metadata
  };
}

// ══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ══════════════════════════════════════════════════════════════

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const categoryKey = slugToCategoryKey(categorySlug);
  const allCategories = await fetchAllCategoriesFromDB();
  const category = await getCategoryConfig(categoryKey, allCategories);

  // 404 only if category truly doesn't exist in DB
  if (!category) {
    // Check if any tenants exist with this category
    const hasTenantsWithCategory = allCategories.includes(categoryKey);

    if (!hasTenantsWithCategory) {
      notFound();
    }

    // If tenants exist but no config, create dynamic category
    return (
      <CategoryPageClient
        categoryKey={categoryKey}
        categorySlug={categorySlug}
        isDynamic={true}
      />
    );
  }

  return (
    <CategoryPageClient
      categoryKey={categoryKey}
      categorySlug={categorySlug}
      isDynamic={!category.isPredefined}
    />
  );
}
```

---

### Phase 6: Category Search Engine

#### 6.1. Add Category Autocomplete

**File**: `client/src/components/discover/category-search.tsx` (NEW)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchCategories } from '@/lib/categories/unified-service';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';

export function CategorySearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchCategories(debouncedQuery)
      .then((data) => {
        setResults(data);
        setShowResults(true);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedQuery]);

  const handleSelectCategory = (category: string) => {
    const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    router.push(`/discover/${slug}`);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari kategori usaha... (Distro, Klinik Hewan, dll)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-10 pr-10 h-12 text-lg"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Autocomplete Results */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
          {results.map((category, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectCategory(category)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors',
                index > 0 && 'border-t'
              )}
            >
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left">{category}</span>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showResults && query.length >= 2 && !isLoading && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-lg p-4 z-50">
          <p className="text-sm text-muted-foreground text-center">
            Belum ada UMKM dengan kategori &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 📊 DATA FLOW

```
┌──────────────────────────────────────────────────────────┐
│ 1. USER REGISTRATION                                     │
│                                                          │
│ User selects "Warung Kelontong" (predefined)            │
│   → Saved to DB: category = "WARUNG_KELONTONG"          │
│   → ✅ Has icon, color, features                         │
│                                                          │
│ User clicks "Lainnya" → inputs "Distro Streetwear"      │
│   → Saved to DB: category = "Distro Streetwear"         │
│   → ✅ Valid, will be discoverable                       │
│                                                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 2. CATEGORY DISCOVERY                                    │
│                                                          │
│ Backend endpoint: GET /api/categories                    │
│   → SELECT DISTINCT category FROM tenants                │
│   → Returns: [                                           │
│       "WARUNG_KELONTONG",  // predefined                 │
│       "BENGKEL_MOTOR",     // predefined                 │
│       "Distro Streetwear", // dynamic                    │
│       "Klinik Hewan",      // dynamic                    │
│       ...                                                │
│     ]                                                    │
│                                                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 3. CATEGORY SEARCH                                       │
│                                                          │
│ User types "distro" in search                            │
│   → GET /api/categories/search?q=distro                  │
│   → Returns: [                                           │
│       "Distro Streetwear",                               │
│       "Distro Vintage",                                  │
│       "Distro Original"                                  │
│     ]                                                    │
│   → User clicks → Navigate to /discover/distro-streetwear│
│   → ✅ Page shows all tenants with that category         │
│                                                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 4. CATEGORY DISPLAY                                      │
│                                                          │
│ Predefined Category (e.g., "WARUNG_KELONTONG"):         │
│   → Show with icon (ShoppingCart)                        │
│   → Show with color (#10b981)                            │
│   → Show description from config                         │
│                                                          │
│ Dynamic Category (e.g., "Distro Streetwear"):           │
│   → Show with default icon (Package)                     │
│   → Show with gray color                                 │
│   → Show generic description                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Backend:
- [ ] Create `categories.module.ts`
- [ ] Create `categories.service.ts`
- [ ] Create `categories.controller.ts`
- [ ] Add endpoint: `GET /api/categories`
- [ ] Add endpoint: `GET /api/categories/stats`
- [ ] Add endpoint: `GET /api/categories/search?q=query`
- [ ] Test all endpoints

### Frontend - Core:
- [ ] Create `types/category.ts` (unified types)
- [ ] Create `lib/categories/unified-service.ts`
- [ ] Add `fetchAllCategoriesFromDB()`
- [ ] Add `searchCategories(query)`
- [ ] Add `getAllCategoriesWithStats()`

### Frontend - Registration:
- [ ] Update `step-category.tsx`
- [ ] Add custom category input UI
- [ ] Add validation for custom category
- [ ] Test predefined selection
- [ ] Test custom category input

### Frontend - Discover:
- [ ] Update `app/discover/[category]/page.tsx`
- [ ] Support dynamic categories (no 404)
- [ ] Update `CategoryPageClient` to handle dynamic
- [ ] Create `category-search.tsx` component
- [ ] Add autocomplete functionality
- [ ] Test search with predefined categories
- [ ] Test search with dynamic categories

### Frontend - UI Components:
- [ ] Create default category card (for dynamic)
- [ ] Update CategoryCard to handle both types
- [ ] Add category badge component
- [ ] Add "trending categories" section

---

## 🎯 SUCCESS CRITERIA

1. ✅ User can register with "Distro Streetwear"
2. ✅ `/discover/distro-streetwear` shows tenants (NOT 404)
3. ✅ Search "distro" returns all distro categories
4. ✅ Predefined categories show with icon & color
5. ✅ Dynamic categories show with default styling
6. ✅ Backend API returns real-time category list
7. ✅ No hardcoded category limit
8. ✅ Category autocomplete works
9. ✅ SEO metadata works for dynamic categories
10. ✅ Performance: Categories cached properly

---

## 🚀 DEPLOYMENT STRATEGY

### Phase 1 (Day 1-2): Backend
1. Add backend categories API
2. Test endpoints
3. Deploy backend

### Phase 2 (Day 2-3): Frontend Core
1. Create unified category service
2. Update type system
3. Test API integration

### Phase 3 (Day 3-4): Registration
1. Update registration flow
2. Add custom category input
3. Test full registration with custom category

### Phase 4 (Day 4-5): Discover
1. Update discover page logic
2. Add category search
3. Test full flow

### Phase 5 (Day 5): Testing & Polish
1. E2E testing
2. Performance optimization
3. SEO testing
4. Launch! 🚀

---

## 📈 FUTURE ENHANCEMENTS

### Phase 2 Features:
- **Category Suggestions**: ML-based category recommendations during registration
- **Category Merge**: Admin tool to merge similar categories ("Distro" + "Distro Streetwear")
- **Category Hierarchy**: Parent-child relationships (Fashion > Distro > Streetwear)
- **Category Analytics**: Popular categories, trending categories
- **Category Aliases**: Search "bengkel" → finds "Bengkel Motor"
- **Multi-language**: Category names in English + Bahasa

---

**Created**: 2026-01-21
**Version**: 1.0
**Status**: ✅ Blueprint Ready for Implementation
**Next Steps**: Implement backend categories API

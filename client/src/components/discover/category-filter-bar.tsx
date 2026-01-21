// ══════════════════════════════════════════════════════════════
// CATEGORY FILTER BAR - V10.7 FINAL
// Fixed: Sticky z-index lowered so search dropdown stays on top
// ══════════════════════════════════════════════════════════════

'use client';

import { useRef, useState, useEffect, useCallback, memo } from 'react';
import {
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Check,
  TrendingUp,
  Clock,
  History,
  ArrowDownAZ,
  ArrowUpAZ,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CATEGORY_CONFIG, getCategoryList, type CategoryConfig } from '@/config/categories';

// ══════════════════════════════════════════════════════════════
// Z-INDEX HIERARCHY (FINAL V10.7):
// 
// Search Dropdown:          z-[99999]  ← Highest (from discover-search)
// Drawer overlay:           z-[9999]
// Drawer content:           z-[10000]
// Sort/Filter Popover:      z-[200]
// Header (fixed):           z-50
// Filter Bar (sticky):      z-30       ← LOWERED from z-40
// Hero elements:            z-[10]
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type SortOption = 'popular' | 'newest' | 'oldest' | 'name_asc' | 'name_desc';

interface CategoryFilterBarProps {
  selectedCategory?: string | null;
  onCategorySelect?: (category: string | null) => void;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  isSticky?: boolean;
  selectedColor?: string | null;
  onColorSelect?: (color: string | null) => void;
}

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════

const sortOptions: {
  value: SortOption;
  label: string;
  description: string;
  icon: typeof TrendingUp;
}[] = [
    {
      value: 'popular',
      label: 'Popular',
      description: 'Toko dengan produk terbanyak',
      icon: TrendingUp,
    },
    {
      value: 'newest',
      label: 'Terbaru',
      description: 'Toko yang baru bergabung',
      icon: Clock,
    },
    {
      value: 'oldest',
      label: 'Terlama',
      description: 'Toko yang sudah lama bergabung',
      icon: History,
    },
    {
      value: 'name_asc',
      label: 'Nama A-Z',
      description: 'Urutkan nama dari A ke Z',
      icon: ArrowDownAZ,
    },
    {
      value: 'name_desc',
      label: 'Nama Z-A',
      description: 'Urutkan nama dari Z ke A',
      icon: ArrowUpAZ,
    },
  ];

function getUniqueColors(): { color: string; label: string; categories: string[] }[] {
  const categories = getCategoryList();
  const colorMap = new Map<string, { label: string; categories: string[] }>();

  categories.forEach((cat) => {
    if (!colorMap.has(cat.color)) {
      colorMap.set(cat.color, { label: cat.labelShort, categories: [cat.key] });
    } else {
      colorMap.get(cat.color)!.categories.push(cat.key);
    }
  });

  return Array.from(colorMap.entries()).map(([color, data]) => ({
    color,
    label: data.label,
    categories: data.categories,
  }));
}

// ══════════════════════════════════════════════════════════════
// FILTER PANEL
// ══════════════════════════════════════════════════════════════

interface FilterPanelProps {
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
  onClose: () => void;
}

const FilterPanel = memo(function FilterPanel({
  selectedColor,
  onColorSelect,
  onClose,
}: FilterPanelProps) {
  const uniqueColors = getUniqueColors();

  return (
    <div className="w-[320px] p-0">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Color Filter</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        {/* Color */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-muted-foreground">Color</label>
            {selectedColor && (
              <button onClick={() => onColorSelect(null)} className="text-xs text-primary hover:underline">
                Clear
              </button>
            )}
          </div>

          {selectedColor && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-muted">
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-sm font-mono">{selectedColor}</span>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2">
            {uniqueColors.map(({ color, categories: cats }) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => onColorSelect(isSelected ? null : color)}
                  className={cn(
                    'group relative aspect-square rounded-lg transition-all',
                    'hover:scale-110 hover:shadow-lg',
                    isSelected && 'ring-2 ring-primary ring-offset-2'
                  )}
                  style={{ backgroundColor: color }}
                  title={`${cats.length} kategori`}
                >
                  {isSelected && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Pilih warna untuk filter berdasarkan tema kategori.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-t bg-muted/30">
        <div className="text-sm text-muted-foreground">
          {selectedColor ? (
            <span className="font-medium">1 warna terpilih</span>
          ) : (
            'Tidak ada filter aktif'
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onColorSelect(null)}
            disabled={!selectedColor}
          >
            Reset
          </Button>
          <Button size="sm" onClick={onClose}>
            Terapkan
          </Button>
        </div>
      </div>
    </div>
  );
});

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function CategoryFilterBar({
  selectedCategory = null,
  onCategorySelect,
  sortBy = 'popular',
  onSortChange,
  isSticky = false,
  selectedColor = null,
  onColorSelect,
}: CategoryFilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = getCategoryList();
  const activeFilterCount = selectedColor ? 1 : 0;

  // Scroll arrows
  const checkScrollArrows = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    checkScrollArrows();
    container.addEventListener('scroll', checkScrollArrows, { passive: true });
    window.addEventListener('resize', checkScrollArrows);
    return () => {
      container.removeEventListener('scroll', checkScrollArrows);
      window.removeEventListener('resize', checkScrollArrows);
    };
  }, [checkScrollArrows]);

  const scrollLeft = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  }, []);

  // Handlers
  const handleCategoryClick = useCallback((categoryKey: string | null) => {
    onCategorySelect?.(categoryKey);
  }, [onCategorySelect]);

  const handleSortChange = useCallback((sort: SortOption) => {
    onSortChange?.(sort);
  }, [onSortChange]);

  const handleColorSelect = useCallback((color: string | null) => {
    onColorSelect?.(color);
  }, [onColorSelect]);

  return (
    <div
      className={cn(
        'bg-background border-b transition-all duration-300',
        // ══════════════════════════════════════════════════════
        // z-30: LOWERED from z-40
        // This ensures search dropdown (z-99999) stays on top
        // ══════════════════════════════════════════════════════
        isSticky && 'sticky top-16 z-30 shadow-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 h-14">

          {/* Category Pills */}
          <div className="relative flex-1 flex items-center min-w-0">
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 z-10 h-8 w-8 flex items-center justify-center bg-gradient-to-r from-background via-background to-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex items-center gap-1 overflow-x-auto scrollbar-hide scroll-smooth px-1"
            >
              <button
                onClick={() => handleCategoryClick(null)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200',
                  !selectedCategory
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                Discover
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200',
                    selectedCategory === cat.key
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  {cat.labelShort}
                </button>
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-0 z-10 h-8 w-8 flex items-center justify-center bg-gradient-to-l from-background via-background to-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Popover - z-[200] */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn('gap-2 shrink-0', activeFilterCount > 0 && 'border-primary')}
              >
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    {activeFilterCount}
                  </span>
                )}
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="bottom"
              className="p-0 w-auto z-[200]"
              sideOffset={8}
            >
              <FilterPanel
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
                onClose={() => setFilterOpen(false)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════
// CATEGORY FILTER BAR - V11.0 (Simplified)
// Removed: Sort dropdown and Filter popover
// Shows only: Category navigation tabs
// ══════════════════════════════════════════════════════════════

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategoryList } from '@/config/categories';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface CategoryFilterBarProps {
  selectedCategory?: string | null;
  onCategorySelect?: (category: string | null) => void;
  isSticky?: boolean;
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function CategoryFilterBar({
  selectedCategory = null,
  onCategorySelect,
  isSticky = false,
}: CategoryFilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const categories = getCategoryList();

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
        </div>
      </div>
    </div>
  );
}
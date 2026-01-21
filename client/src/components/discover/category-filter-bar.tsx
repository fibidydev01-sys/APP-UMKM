// ══════════════════════════════════════════════════════════════
// CATEGORY FILTER BAR - V12.0 (NavigationMenu Style, No Icons)
// Changed: Using NavigationMenu-style components
// Changed: Removed all colored dots/icons
// Changed: Highest z-index (z-[99999])
// ══════════════════════════════════════════════════════════════

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategoryList } from '@/config/categories';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

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

  // Find current category label
  const currentCategory = selectedCategory
    ? categories.find(c => c.key === selectedCategory)
    : null;

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
        // z-[99999]: HIGHEST z-index for dropdown
        // ══════════════════════════════════════════════════════
        isSticky && 'sticky top-16 z-[99999] shadow-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 h-14">

          {/* Category Pills with NavigationMenu Dropdown */}
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
              {/* Discover Button */}
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

              {/* Category Items - No Icons */}
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200',
                    selectedCategory === cat.key
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
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

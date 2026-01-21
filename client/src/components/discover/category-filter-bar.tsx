// ══════════════════════════════════════════════════════════════
// CATEGORY FILTER BAR - V13.0 (NavigationMenu Groups + Hover)
// Each group (Kuliner, Rumah & Taman, etc.) shows sub-categories on hover
// No icons/emojis, highest z-index
// ══════════════════════════════════════════════════════════════

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_GROUPS, getCategoriesByGroup } from '@/config/categories';
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

// Get all groups
const groups = Object.values(CATEGORY_GROUPS);

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

          {/* Navigation Menu with Groups */}
          <div className="relative flex-1 flex items-center min-w-0">
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 z-20 h-8 w-8 flex items-center justify-center bg-gradient-to-r from-background via-background to-transparent"
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
                  'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200 shrink-0',
                  !selectedCategory
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                Discover
              </button>

              {/* NavigationMenu for Groups */}
              <NavigationMenu className="max-w-none">
                <NavigationMenuList className="gap-1">
                  {groups.map((group) => {
                    const subCategories = getCategoriesByGroup(group.key);
                    const isGroupActive = subCategories.some(cat => cat.key === selectedCategory);

                    return (
                      <NavigationMenuItem key={group.key}>
                        <NavigationMenuTrigger
                          className={cn(
                            'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200 h-auto bg-transparent',
                            isGroupActive
                              ? 'bg-foreground text-background'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted data-[state=open]:bg-muted'
                          )}
                        >
                          {group.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="z-[99999]">
                          <ul className="grid w-[220px] gap-1 p-2 max-h-[400px] overflow-y-auto">
                            {subCategories.map((cat) => (
                              <li key={cat.key}>
                                <NavigationMenuLink asChild>
                                  <button
                                    onClick={() => handleCategoryClick(cat.key)}
                                    className={cn(
                                      'block w-full select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors text-left',
                                      'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                      selectedCategory === cat.key && 'bg-accent text-accent-foreground font-medium'
                                    )}
                                  >
                                    {cat.labelShort}
                                  </button>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-0 z-20 h-8 w-8 flex items-center justify-center bg-gradient-to-l from-background via-background to-transparent"
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

'use client';

import { useSyncExternalStore, useCallback } from 'react';

// ==========================================
// MEDIA QUERY HOOKS - Single Source of Truth
// Uses useSyncExternalStore for proper SSR/hydration handling
// ==========================================

/**
 * Generic media query hook using useSyncExternalStore
 * This is the React 18+ recommended way to handle media queries
 * - No hydration mismatch errors
 * - Proper SSR support (returns false on server)
 * - Efficient event listener management
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => {
    // Return false on server (no window) - desktop-first approach
    return false;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ==========================================
// BREAKPOINT HOOKS
// Tailwind-aligned breakpoints
// ==========================================

/** Mobile: < 640px (Tailwind sm breakpoint) */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

/** Tablet: 640px - 1023px */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

/** Desktop: >= 1024px (Tailwind lg breakpoint) */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/** Large Desktop: >= 1280px (Tailwind xl breakpoint) */
export function useIsLargeDesktop(): boolean {
  return useMediaQuery('(min-width: 1280px)');
}

/** Medium screens and up: >= 768px (Tailwind md breakpoint) */
export function useIsMediumUp(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

// ==========================================
// BREAKPOINT CONSTANTS
// ==========================================

export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;

// ==========================================
// UTILITY HOOKS
// ==========================================

/**
 * Limits array to specified count on mobile devices
 * Useful for reducing render load on mobile
 */
export function useMobileProductLimit<T>(products: T[], limit: number = 12): T[] {
  const isMobile = useIsMobile();

  if (!isMobile) return products;
  if (products.length <= limit) return products;

  return products.slice(0, limit);
}

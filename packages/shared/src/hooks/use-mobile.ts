'use client';

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport is mobile.
 * Returns `undefined` during SSR/initial hydration, then the actual value.
 * This prevents hydration mismatch errors.
 */
export function useIsMobile(): boolean {
  // Initialize with undefined to prevent hydration mismatch
  // The first render on client will match server (both treat as desktop)
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Use matchMedia for better performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = () => {
      setIsMobile(mql.matches);
    };

    // Set initial value
    setIsMobile(mql.matches);

    // Listen for changes
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Return false when undefined (SSR/initial) to match desktop-first rendering
  return isMobile ?? false;
}

export function useMobileProductLimit(products: unknown[], limit: number = 12): unknown[] {
  const isMobile = useIsMobile();

  if (!isMobile) return products;
  if (products.length <= limit) return products;

  return products.slice(0, limit);
}

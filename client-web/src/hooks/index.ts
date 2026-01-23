// ==========================================
// HOOKS INDEX - Export all custom hooks
// Client-web only needs utility hooks
// ==========================================

// Utility Hooks
export { useDebounce, useDebouncedCallback } from './use-debounce';
export { useMounted, useIsClient } from './use-mounted';

// Media Query Hooks - Re-export from shared (Single Source of Truth)
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  useIsMediumUp,
  useMobileProductLimit,
  breakpoints,
} from '@umkm/shared/hooks';

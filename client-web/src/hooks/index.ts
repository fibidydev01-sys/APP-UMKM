// ==========================================
// HOOKS INDEX - Export all custom hooks
// Client-web only needs utility hooks
// ==========================================

// Utility Hooks
export { useDebounce, useDebouncedCallback } from './use-debounce';
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  breakpoints,
} from './use-media-query';
export { useMounted, useIsClient } from './use-mounted';

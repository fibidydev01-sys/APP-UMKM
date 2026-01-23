/**
 * @deprecated This file is deprecated. Import from @umkm/shared/hooks instead.
 *
 * Example:
 * import { useMediaQuery, useIsMobile } from '@umkm/shared/hooks';
 *
 * Or from the hooks barrel:
 * import { useMediaQuery, useIsMobile } from '@/hooks';
 */

// Re-export from shared for backwards compatibility
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

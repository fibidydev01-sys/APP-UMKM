// ==========================================
// HOOKS INDEX - Export all custom hooks
// ==========================================

// Auth Hooks
export {
  useAuth,
  useLogin,
  useRegister,
  useLogout,
  useCheckSlug,
  useChangePassword,
  useDeleteAccount,
} from './use-auth';

// Tenant Hooks
export {
  useTenant,
  usePublicTenant,
  useUpdateTenant,
  useDashboardStats,
} from './use-tenant';

// Utility Hooks
export { useDebounce, useDebouncedCallback } from './use-debounce';
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsLargeDesktop, breakpoints } from './use-media-query';
export { useMounted, useIsClient } from './use-mounted';

export { useLandingConfig } from './use-landing-config';
export { useRegisterWizard } from './use-register-wizard';


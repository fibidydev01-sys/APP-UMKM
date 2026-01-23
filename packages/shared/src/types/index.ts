// ==========================================
// @umkm/shared TYPES - Single Source of Truth
// End-to-end type safety: server → client → client-web
// ==========================================

// ==========================================
// DATABASE ENUMS
// ==========================================
export * from './enums';

// ==========================================
// API TYPES (Request/Response Contracts)
// ==========================================
export * from './api';

// ==========================================
// AUTH TYPES
// ==========================================
export * from './auth';

// ==========================================
// DOMAIN TYPES
// ==========================================

// Tenant (UMKM) Types
export * from './tenant';

// Product Types
export * from './product';

// Customer Types
export * from './customer';

// Order Types
export * from './order';

// Landing Page Types
export * from './landing';

// Discover/Marketplace Types
export * from './discover';

// Category Types
export * from './category';

// Cloudinary Types
export * from './cloudinary';

// SEO Types
export * from './seo';

// Onboarding Types
export * from './onboarding';

// ==========================================
// UTILITY TYPES
// ==========================================

/**
 * Make all properties optional except specified keys
 */
export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

/**
 * Make specified properties required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper
 */
export type Optional<T> = T | undefined;

/**
 * ID type (CUID string from Prisma)
 */
export type ID = string;

/**
 * ISO Date string
 */
export type ISODateString = string;

/**
 * JSON value type
 */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

/**
 * Extract promise type
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Deep partial type
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

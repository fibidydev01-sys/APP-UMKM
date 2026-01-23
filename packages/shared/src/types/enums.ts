// ==========================================
// DATABASE ENUMS - From Prisma Schema
// Single Source of Truth for Database Enums
// ==========================================

/**
 * Tenant Status
 */
export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

/**
 * Order Status
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Payment Status
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
}

// ==========================================
// TYPE GUARDS
// ==========================================

export function isTenantStatus(value: unknown): value is TenantStatus {
  return Object.values(TenantStatus).includes(value as TenantStatus);
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return Object.values(OrderStatus).includes(value as OrderStatus);
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return Object.values(PaymentStatus).includes(value as PaymentStatus);
}

// ==========================================
// ENUM LABELS (for UI display)
// ==========================================

export const TenantStatusLabels: Record<TenantStatus, string> = {
  [TenantStatus.ACTIVE]: 'Aktif',
  [TenantStatus.INACTIVE]: 'Tidak Aktif',
  [TenantStatus.SUSPENDED]: 'Ditangguhkan',
};

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Menunggu',
  [OrderStatus.PROCESSING]: 'Diproses',
  [OrderStatus.COMPLETED]: 'Selesai',
  [OrderStatus.CANCELLED]: 'Dibatalkan',
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Menunggu Pembayaran',
  [PaymentStatus.PAID]: 'Lunas',
  [PaymentStatus.PARTIAL]: 'Sebagian',
  [PaymentStatus.FAILED]: 'Gagal',
};

import { api } from './client';

// ==========================================
// TYPES
// ==========================================

export interface PlanLimits {
  maxProducts: number;
  maxCustomers: number;
  componentBlockVariants: number;
  advancedOrderTracking: boolean;
  whatsappAutoReply: boolean;
}

export interface SubscriptionInfo {
  subscription: {
    id: string;
    tenantId: string;
    plan: 'STARTER' | 'BUSINESS';
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PAST_DUE';
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    priceAmount: number;
    currency: string;
  };
  limits: PlanLimits;
  usage: {
    products: number;
    customers: number;
  };
  isAtLimit: {
    products: boolean;
    customers: boolean;
  };
}

export interface CreatePaymentResponse {
  token: string;
  redirect_url: string;
  payment_id: string;
  order_id: string;
}

export interface PaymentHistory {
  id: string;
  midtransOrderId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentType: string | null;
  periodStart: string;
  periodEnd: string;
  paidAt: string | null;
  createdAt: string;
}

// ==========================================
// SUBSCRIPTION API SERVICE
// ==========================================

export const subscriptionApi = {
  /**
   * Get plan info + usage
   * GET /api/subscription/me
   */
  getMyPlan: () => api.get<SubscriptionInfo>('/subscription/me'),

  /**
   * Get payment history
   * GET /api/subscription/payments
   */
  getPaymentHistory: () => api.get<PaymentHistory[]>('/subscription/payments'),

  /**
   * Create payment for upgrade (trigger Midtrans Snap)
   * POST /api/payment/subscribe
   */
  createUpgradePayment: () => api.post<CreatePaymentResponse>('/payment/subscribe'),

  /**
   * Get Midtrans client key
   * GET /api/payment/client-key
   */
  getClientKey: () => api.get<{ clientKey: string }>('/payment/client-key'),
};

import {
  Injectable,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PLAN_LIMITS, PlanFeature } from './plan-limits';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get subscription tenant (auto-create Starter kalau belum ada)
   */
  async getSubscription(tenantId: string) {
    let subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
    });

    if (!subscription) {
      subscription = await this.prisma.subscription.create({
        data: {
          tenantId,
          plan: 'STARTER',
          status: 'ACTIVE',
          priceAmount: 0,
        },
      });
    }

    return subscription;
  }

  /**
   * Get plan info + usage counts
   */
  async getPlanInfo(tenantId: string) {
    const subscription = await this.getSubscription(tenantId);
    const limits = PLAN_LIMITS[subscription.plan];

    const [productCount, customerCount] = await Promise.all([
      this.prisma.product.count({ where: { tenantId } }),
      this.prisma.customer.count({ where: { tenantId } }),
    ]);

    return {
      subscription,
      limits,
      usage: {
        products: productCount,
        customers: customerCount,
      },
      isAtLimit: {
        products: productCount >= limits.maxProducts,
        customers: customerCount >= limits.maxCustomers,
      },
    };
  }

  /**
   * Cek apakah tenant boleh pakai fitur tertentu
   */
  async checkFeatureAccess(tenantId: string, feature: PlanFeature): Promise<boolean> {
    const subscription = await this.getSubscription(tenantId);

    if (subscription.plan === 'BUSINESS') {
      if (subscription.status !== 'ACTIVE') return false;
      if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < new Date()) {
        return false;
      }
    }

    return !!PLAN_LIMITS[subscription.plan][feature];
  }

  /**
   * Cek limit produk sebelum create.
   * Throw error kalau sudah mentok.
   */
  async checkProductLimit(tenantId: string) {
    const subscription = await this.getSubscription(tenantId);
    const limit = PLAN_LIMITS[subscription.plan].maxProducts;

    if (limit === Infinity) return;

    const count = await this.prisma.product.count({ where: { tenantId } });

    if (count >= limit) {
      throw new ForbiddenException(
        `Batas ${limit} produk tercapai. Upgrade ke Business untuk produk unlimited.`,
      );
    }
  }

  /**
   * Cek limit customer sebelum create.
   */
  async checkCustomerLimit(tenantId: string) {
    const subscription = await this.getSubscription(tenantId);
    const limit = PLAN_LIMITS[subscription.plan].maxCustomers;

    if (limit === Infinity) return;

    const count = await this.prisma.customer.count({ where: { tenantId } });

    if (count >= limit) {
      throw new ForbiddenException(
        `Batas ${limit} pelanggan tercapai. Upgrade ke Business untuk pelanggan unlimited.`,
      );
    }
  }

  /**
   * Activate Business plan (dipanggil setelah payment success via webhook)
   */
  async activateBusinessPlan(tenantId: string, periodDays: number, price: number) {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + periodDays);

    const subscription = await this.prisma.subscription.upsert({
      where: { tenantId },
      create: {
        tenantId,
        plan: 'BUSINESS',
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        priceAmount: price,
      },
      update: {
        plan: 'BUSINESS',
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        priceAmount: price,
        cancelledAt: null,
        cancelReason: null,
      },
    });

    this.logger.log(
      `Tenant ${tenantId} upgraded to BUSINESS until ${periodEnd.toISOString()}`,
    );

    return subscription;
  }

  /**
   * Get payment history tenant
   */
  async getPaymentHistory(tenantId: string) {
    return this.prisma.subscriptionPayment.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}

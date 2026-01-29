import { Injectable } from '@nestjs/common';
import { AutoReplyRule } from '@prisma/client';

/**
 * Order Status Engine
 * Handles matching logic for ORDER_STATUS and PAYMENT_STATUS triggers
 */
@Injectable()
export class OrderStatusEngine {
  /**
   * Check if rule matches the current status
   */
  matchesStatus(rule: AutoReplyRule, currentStatus: string): boolean {
    if (!rule.statusTrigger) {
      return false;
    }

    return rule.statusTrigger === currentStatus;
  }

  /**
   * Validate status trigger value based on trigger type
   */
  isValidStatusTrigger(triggerType: string, statusTrigger: string): boolean {
    const validOrderStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
    const validPaymentStatuses = ['PAID', 'PARTIAL', 'FAILED'];

    if (triggerType === 'ORDER_STATUS') {
      return validOrderStatuses.includes(statusTrigger);
    }

    if (triggerType === 'PAYMENT_STATUS') {
      return validPaymentStatuses.includes(statusTrigger);
    }

    return false;
  }
}

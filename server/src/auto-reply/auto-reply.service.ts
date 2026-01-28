import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { ConversationsService } from '../conversations/conversations.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { KeywordEngine } from './engines/keyword-engine';
import { TimeBasedEngine } from './engines/time-based-engine';
import { WelcomeEngine } from './engines/welcome-engine';
import {
  AutoReplyRule,
  AutoReplyTriggerType,
  Conversation,
  Contact,
} from '@prisma/client';

@Injectable()
export class AutoReplyService {
  private readonly logger = new Logger(AutoReplyService.name);

  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsAppService,
    private conversationsService: ConversationsService,
    private keywordEngine: KeywordEngine,
    private timeBasedEngine: TimeBasedEngine,
    private welcomeEngine: WelcomeEngine,
  ) {}

  /**
   * Process incoming message and check auto-reply rules
   */
  async processIncomingMessage(
    tenantId: string,
    from: string,
    message: string,
  ): Promise<void> {
    try {
      // Get or create conversation
      const conversation =
        await this.conversationsService.getOrCreateConversation(tenantId, from);

      // Get contact
      const contact = await this.prisma.contact.findUnique({
        where: {
          tenantId_phone: {
            tenantId,
            phone: from,
          },
        },
      });

      if (!contact) {
        this.logger.warn(`Contact not found for phone: ${from}`);
        return;
      }

      // Get active rules (by priority, highest first)
      const rules = await this.prisma.autoReplyRule.findMany({
        where: {
          tenantId,
          isActive: true,
        },
        orderBy: {
          priority: 'desc',
        },
      });

      this.logger.log(
        `Processing ${rules.length} auto-reply rules for tenant: ${tenantId}`,
      );

      // Check each rule
      for (const rule of rules) {
        const matches = await this.evaluateRule(rule, message, conversation);

        if (!matches) continue;

        this.logger.log(`Rule matched: ${rule.name} (${rule.triggerType})`);

        // Generate response with variable replacement
        const response = this.generateResponse(rule, contact);

        // Delay (human-like)
        const delayMs = rule.delaySeconds * 1000;
        await this.sleep(delayMs);

        // Send auto-reply
        const result = await this.whatsappService.sendMessage(
          tenantId,
          from,
          response,
          'text',
        );

        if (result.success) {
          // Log auto-reply
          await this.logAutoReply(rule, conversation, message, response);

          // Update rule stats
          await this.updateRuleStats(rule);

          this.logger.log(`Auto-reply sent for rule: ${rule.name}`);

          // First match wins
          break;
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to process auto-reply: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Evaluate if rule matches
   */
  private async evaluateRule(
    rule: AutoReplyRule,
    message: string,
    conversation: Conversation,
  ): Promise<boolean> {
    switch (rule.triggerType) {
      case AutoReplyTriggerType.WELCOME:
        return this.welcomeEngine.shouldSendWelcome(conversation);

      case AutoReplyTriggerType.KEYWORD:
        return this.keywordEngine.matchKeyword(rule, message);

      case AutoReplyTriggerType.TIME_BASED:
        return this.timeBasedEngine.isOutsideWorkingHours(rule);

      default:
        return false;
    }
  }

  /**
   * Generate response with variable replacement
   */
  private generateResponse(rule: AutoReplyRule, contact: Contact): string {
    let response = rule.responseMessage;

    // Replace variables
    response = response
      .replace(/\{\{name\}\}/g, contact.name || 'Customer')
      .replace(/\{\{phone\}\}/g, contact.phone);

    return response;
  }

  /**
   * Log auto-reply trigger
   */
  private async logAutoReply(
    rule: AutoReplyRule,
    conversation: Conversation,
    triggeredBy: string,
    response: string,
  ): Promise<void> {
    try {
      // Find matched keyword if applicable
      let matchedKeyword: string | null = null;
      if (rule.triggerType === AutoReplyTriggerType.KEYWORD) {
        matchedKeyword = this.keywordEngine.findMatchedKeyword(
          rule,
          triggeredBy,
        );
      }

      await this.prisma.autoReplyLog.create({
        data: {
          ruleId: rule.id,
          conversationId: conversation.id,
          triggeredByMessage: triggeredBy,
          responseSent: response,
          matchedKeyword,
          triggeredAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log auto-reply: ${error.message}`);
    }
  }

  /**
   * Update rule statistics
   */
  private async updateRuleStats(rule: AutoReplyRule): Promise<void> {
    try {
      await this.prisma.autoReplyRule.update({
        where: { id: rule.id },
        data: {
          totalTriggered: {
            increment: 1,
          },
          lastTriggeredAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update rule stats: ${error.message}`);
    }
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============================================
  // CRUD Operations for Rules
  // ============================================

  /**
   * Get all auto-reply rules
   */
  async getRules(tenantId: string) {
    const rules = await this.prisma.autoReplyRule.findMany({
      where: { tenantId },
      orderBy: {
        priority: 'desc',
      },
    });

    return {
      rules: rules.map((rule) => ({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        triggerType: rule.triggerType,
        keywords: rule.keywords,
        matchType: rule.matchType,
        workingHours: rule.workingHours,
        responseMessage: rule.responseMessage,
        priority: rule.priority,
        delaySeconds: rule.delaySeconds,
        isActive: rule.isActive,
        totalTriggered: rule.totalTriggered,
        lastTriggeredAt: rule.lastTriggeredAt?.toISOString(),
        createdAt: rule.createdAt.toISOString(),
      })),
    };
  }

  /**
   * Get single rule
   */
  async getRule(ruleId: string, tenantId: string) {
    const rule = await this.prisma.autoReplyRule.findFirst({
      where: {
        id: ruleId,
        tenantId,
      },
      include: {
        logs: {
          orderBy: {
            triggeredAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!rule) {
      throw new NotFoundException('Auto-reply rule not found');
    }

    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      triggerType: rule.triggerType,
      keywords: rule.keywords,
      matchType: rule.matchType,
      workingHours: rule.workingHours,
      responseMessage: rule.responseMessage,
      priority: rule.priority,
      delaySeconds: rule.delaySeconds,
      isActive: rule.isActive,
      totalTriggered: rule.totalTriggered,
      lastTriggeredAt: rule.lastTriggeredAt?.toISOString(),
      createdAt: rule.createdAt.toISOString(),
      recentLogs: rule.logs.map((log) => ({
        id: log.id,
        triggeredByMessage: log.triggeredByMessage,
        responseSent: log.responseSent,
        matchedKeyword: log.matchedKeyword,
        triggeredAt: log.triggeredAt.toISOString(),
      })),
    };
  }

  /**
   * Create new auto-reply rule
   */
  async createRule(tenantId: string, dto: CreateRuleDto) {
    const rule = await this.prisma.autoReplyRule.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        triggerType: dto.triggerType,
        keywords: dto.keywords || [],
        matchType: dto.matchType,
        caseSensitive: dto.caseSensitive ?? false,
        workingHours: dto.workingHours as any,
        responseMessage: dto.responseMessage,
        priority: dto.priority ?? 50,
        delaySeconds: dto.delaySeconds ?? 2,
        isActive: dto.isActive ?? true,
      },
    });

    this.logger.log(`Auto-reply rule created: ${rule.id}`);

    return {
      success: true,
      rule: {
        id: rule.id,
        name: rule.name,
        triggerType: rule.triggerType,
        isActive: rule.isActive,
        createdAt: rule.createdAt.toISOString(),
      },
    };
  }

  /**
   * Update auto-reply rule
   */
  async updateRule(ruleId: string, tenantId: string, dto: UpdateRuleDto) {
    const rule = await this.prisma.autoReplyRule.findFirst({
      where: {
        id: ruleId,
        tenantId,
      },
    });

    if (!rule) {
      throw new NotFoundException('Auto-reply rule not found');
    }

    const updated = await this.prisma.autoReplyRule.update({
      where: { id: ruleId },
      data: {
        name: dto.name,
        description: dto.description,
        triggerType: dto.triggerType,
        keywords: dto.keywords,
        matchType: dto.matchType,
        caseSensitive: dto.caseSensitive,
        workingHours: dto.workingHours as any,
        responseMessage: dto.responseMessage,
        priority: dto.priority,
        delaySeconds: dto.delaySeconds,
        isActive: dto.isActive,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Auto-reply rule updated: ${ruleId}`);

    return {
      success: true,
      rule: {
        id: updated.id,
        name: updated.name,
        triggerType: updated.triggerType,
        isActive: updated.isActive,
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Delete auto-reply rule
   */
  async deleteRule(ruleId: string, tenantId: string) {
    const rule = await this.prisma.autoReplyRule.findFirst({
      where: {
        id: ruleId,
        tenantId,
      },
    });

    if (!rule) {
      throw new NotFoundException('Auto-reply rule not found');
    }

    await this.prisma.autoReplyRule.delete({
      where: { id: ruleId },
    });

    this.logger.log(`Auto-reply rule deleted: ${ruleId}`);

    return {
      success: true,
      message: 'Auto-reply rule deleted successfully',
    };
  }

  /**
   * Toggle rule active status
   */
  async toggleRule(ruleId: string, tenantId: string) {
    const rule = await this.prisma.autoReplyRule.findFirst({
      where: {
        id: ruleId,
        tenantId,
      },
    });

    if (!rule) {
      throw new NotFoundException('Auto-reply rule not found');
    }

    const updated = await this.prisma.autoReplyRule.update({
      where: { id: ruleId },
      data: {
        isActive: !rule.isActive,
      },
    });

    this.logger.log(
      `Auto-reply rule toggled: ${ruleId} -> ${updated.isActive}`,
    );

    return {
      success: true,
      isActive: updated.isActive,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ==========================================
// CATEGORIES SERVICE
// Returns unique categories from active tenants
// ==========================================

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all unique categories from active tenants
   * Returns array of unique category strings
   */
  async getAllUniqueCategories(): Promise<string[]> {
    const result = await this.prisma.tenant.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    return result.map((t) => t.category);
  }

  /**
   * Get category statistics (count of tenants per category)
   * Returns array of { category, count } objects
   */
  async getCategoryStats(): Promise<{ category: string; count: number }[]> {
    const result = await this.prisma.tenant.groupBy({
      by: ['category'],
      where: {
        status: 'ACTIVE',
      },
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    });

    return result.map((r) => ({
      category: r.category,
      count: r._count.category,
    }));
  }

  /**
   * Search categories by query string (case insensitive)
   * Returns array of matching category strings
   * @param query - Search query (min 2 chars)
   */
  async searchCategories(query: string): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const result = await this.prisma.tenant.findMany({
      where: {
        status: 'ACTIVE',
        category: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      take: 20, // Limit to 20 results for autocomplete
      orderBy: {
        category: 'asc',
      },
    });

    return result.map((t) => t.category);
  }

  /**
   * Check if a category exists (has active tenants)
   * @param category - Category key to check
   */
  async categoryExists(category: string): Promise<boolean> {
    const count = await this.prisma.tenant.count({
      where: {
        status: 'ACTIVE',
        category,
      },
    });

    return count > 0;
  }
}

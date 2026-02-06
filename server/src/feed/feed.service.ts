import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedDto, QueryFeedDto } from './dto';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create feed post - ambil dari product milik tenant
   */
  async create(tenantId: string, dto: CreateFeedDto) {
    // Check: Apakah product milik tenant ini?
    const product = await this.prisma.product.findFirst({
      where: {
        id: dto.productId,
        tenantId,
        isActive: true,
      },
      select: { id: true, name: true },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan atau tidak aktif');
    }

    // Check: Apakah product sudah pernah di-post?
    const existing = await this.prisma.feed.findUnique({
      where: {
        tenantId_productId: {
          tenantId,
          productId: dto.productId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Produk ini sudah di-post ke feed');
    }

    // Create feed
    const feed = await this.prisma.feed.create({
      data: {
        tenantId,
        productId: dto.productId,
        caption: dto.caption,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            comparePrice: true,
            images: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });

    return {
      message: 'Produk berhasil di-post ke feed',
      feed,
    };
  }

  /**
   * Get feed list - chronological (newest first), paginated
   */
  async findAll(query: QueryFeedDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.feed.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // CHRONOLOGICAL - newest first
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              comparePrice: true,
              images: true,
            },
          },
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
        },
      }),
      this.prisma.feed.count(),
    ]);

    const hasMore = skip + data.length < total;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        hasMore, // false = "You're all caught up"
      },
    };
  }

  /**
   * Get single feed detail
   */
  async findOne(feedId: string) {
    const feed = await this.prisma.feed.findUnique({
      where: { id: feedId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            comparePrice: true,
            images: true,
            stock: true,
            trackStock: true,
            unit: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            whatsapp: true,
          },
        },
      },
    });

    if (!feed) {
      throw new NotFoundException('Feed tidak ditemukan');
    }

    return feed;
  }

  /**
   * Delete own feed post - only owner can delete
   */
  async remove(tenantId: string, feedId: string) {
    const feed = await this.prisma.feed.findUnique({
      where: { id: feedId },
      select: { id: true, tenantId: true },
    });

    if (!feed) {
      throw new NotFoundException('Feed tidak ditemukan');
    }

    if (feed.tenantId !== tenantId) {
      throw new ForbiddenException('Kamu tidak bisa menghapus feed orang lain');
    }

    await this.prisma.feed.delete({ where: { id: feedId } });

    return {
      message: 'Feed berhasil dihapus',
    };
  }
}

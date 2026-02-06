import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedDto, QueryFeedDto, CreateCommentDto, QueryCommentDto } from './dto';

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
   * tenantId optional: kalau login, return isLiked per feed
   */
  async findAll(query: QueryFeedDto, currentTenantId?: string) {
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
          // Jika user login, cek apakah sudah like
          ...(currentTenantId
            ? {
                likes: {
                  where: { tenantId: currentTenantId },
                  select: { id: true },
                },
              }
            : {}),
        },
      }),
      this.prisma.feed.count(),
    ]);

    const hasMore = skip + data.length < total;

    // Map data: tambahkan isLiked flag
    const feedsWithLikeStatus = data.map((feed) => {
      const { likes, ...rest } = feed as typeof feed & { likes?: { id: string }[] };
      return {
        ...rest,
        isLiked: likes ? likes.length > 0 : false,
      };
    });

    return {
      data: feedsWithLikeStatus,
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

  // ══════════════════════════════════════════════════════════════
  // INTERACTIONS - Like & Comment
  // ══════════════════════════════════════════════════════════════

  /**
   * Toggle like - like/unlike dalam satu endpoint
   * Atomic: pakai $transaction agar counter selalu sinkron
   */
  async toggleLike(tenantId: string, feedId: string) {
    const feed = await this.prisma.feed.findUnique({
      where: { id: feedId },
      select: { id: true },
    });

    if (!feed) {
      throw new NotFoundException('Feed tidak ditemukan');
    }

    // Cek apakah sudah like
    const existing = await this.prisma.feedLike.findUnique({
      where: {
        feedId_tenantId: { feedId, tenantId },
      },
    });

    if (existing) {
      // Unlike - hapus like + decrement counter (atomic)
      await this.prisma.$transaction([
        this.prisma.feedLike.delete({
          where: { id: existing.id },
        }),
        this.prisma.feed.update({
          where: { id: feedId },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);

      return { liked: false, message: 'Like dihapus' };
    } else {
      // Like - buat like + increment counter (atomic)
      await this.prisma.$transaction([
        this.prisma.feedLike.create({
          data: { feedId, tenantId },
        }),
        this.prisma.feed.update({
          where: { id: feedId },
          data: { likeCount: { increment: 1 } },
        }),
      ]);

      return { liked: true, message: 'Berhasil like' };
    }
  }

  /**
   * Add comment to feed
   * Atomic: create comment + increment counter
   */
  async addComment(tenantId: string, feedId: string, dto: CreateCommentDto) {
    const feed = await this.prisma.feed.findUnique({
      where: { id: feedId },
      select: { id: true },
    });

    if (!feed) {
      throw new NotFoundException('Feed tidak ditemukan');
    }

    // Create comment + increment counter (atomic)
    const [comment] = await this.prisma.$transaction([
      this.prisma.feedComment.create({
        data: {
          feedId,
          tenantId,
          content: dto.content,
        },
        include: {
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
      this.prisma.feed.update({
        where: { id: feedId },
        data: { commentCount: { increment: 1 } },
      }),
    ]);

    return {
      message: 'Komentar berhasil ditambahkan',
      comment,
    };
  }

  /**
   * Get comments for a feed - newest first, paginated
   */
  async getComments(feedId: string, query: QueryCommentDto) {
    const feed = await this.prisma.feed.findUnique({
      where: { id: feedId },
      select: { id: true },
    });

    if (!feed) {
      throw new NotFoundException('Feed tidak ditemukan');
    }

    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.feedComment.findMany({
        where: { feedId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
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
      this.prisma.feedComment.count({ where: { feedId } }),
    ]);

    const hasMore = skip + data.length < total;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        hasMore,
      },
    };
  }
}

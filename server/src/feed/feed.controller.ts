import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto, QueryFeedDto, CreateCommentDto, QueryCommentDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  // ══════════════════════════════════════════════════════════════
  // PUBLIC ENDPOINTS (with optional auth for isLiked)
  // ══════════════════════════════════════════════════════════════

  /**
   * Get feed list (chronological, paginated)
   * GET /api/feed?page=1&limit=20
   * Optional auth: kalau login, return isLiked per feed
   */
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(@Query() query: QueryFeedDto, @Req() req: any) {
    const tenantId = req.user?.id ?? undefined;
    return this.feedService.findAll(query, tenantId);
  }

  /**
   * Get single feed detail
   * GET /api/feed/:id
   */
  @Get(':id')
  async findOne(@Param('id') feedId: string) {
    return this.feedService.findOne(feedId);
  }

  /**
   * Get comments for a feed (public, paginated)
   * GET /api/feed/:id/comments?page=1&limit=20
   */
  @Get(':id/comments')
  async getComments(
    @Param('id') feedId: string,
    @Query() query: QueryCommentDto,
  ) {
    return this.feedService.getComments(feedId, query);
  }

  // ══════════════════════════════════════════════════════════════
  // PROTECTED ENDPOINTS (Auth Required)
  // ══════════════════════════════════════════════════════════════

  /**
   * Create feed post (from own product)
   * POST /api/feed
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentTenant('id') tenantId: string,
    @Body() dto: CreateFeedDto,
  ) {
    return this.feedService.create(tenantId, dto);
  }

  /**
   * Toggle like on a feed
   * POST /api/feed/:id/like
   */
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(
    @CurrentTenant('id') tenantId: string,
    @Param('id') feedId: string,
  ) {
    return this.feedService.toggleLike(tenantId, feedId);
  }

  /**
   * Add comment to a feed
   * POST /api/feed/:id/comments
   */
  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @CurrentTenant('id') tenantId: string,
    @Param('id') feedId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.feedService.addComment(tenantId, feedId, dto);
  }

  /**
   * Delete own feed post
   * DELETE /api/feed/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @CurrentTenant('id') tenantId: string,
    @Param('id') feedId: string,
  ) {
    return this.feedService.remove(tenantId, feedId);
  }
}

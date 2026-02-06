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
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto, QueryFeedDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  // ══════════════════════════════════════════════════════════════
  // PUBLIC ENDPOINTS
  // ══════════════════════════════════════════════════════════════

  /**
   * Get feed list (chronological, paginated)
   * GET /api/feed?page=1&limit=20
   */
  @Get()
  async findAll(@Query() query: QueryFeedDto) {
    return this.feedService.findAll(query);
  }

  /**
   * Get single feed detail
   * GET /api/feed/:id
   */
  @Get(':id')
  async findOne(@Param('id') feedId: string) {
    return this.feedService.findOne(feedId);
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

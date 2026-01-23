import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '@umkm/shared/types';

const COOKIE_NAME = 'fibidy_auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Try cookie first
        (request: Request) => {
          const cookies = request?.cookies as
            | Record<string, string>
            | undefined;
          return cookies?.[COOKIE_NAME] ?? null;
        },
        // 2. Fallback to Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        slug: true,
        name: true,
        status: true,
      },
    });

    if (!tenant) {
      throw new UnauthorizedException('Tenant tidak ditemukan');
    }

    if (tenant.status !== 'ACTIVE') {
      throw new UnauthorizedException('Akun tidak aktif');
    }

    return {
      id: tenant.id,
      email: tenant.email,
      slug: tenant.slug,
      name: tenant.name,
    };
  }
}

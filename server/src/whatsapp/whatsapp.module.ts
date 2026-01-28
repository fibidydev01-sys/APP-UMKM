import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppGateway } from './whatsapp.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [WhatsAppController],
  providers: [WhatsAppService, WhatsAppGateway],
  exports: [WhatsAppService, WhatsAppGateway],
})
export class WhatsAppModule {}

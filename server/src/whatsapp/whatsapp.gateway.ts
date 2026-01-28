import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

@WebSocketGateway({
  namespace: '/whatsapp',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WhatsAppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WhatsAppGateway.name);

  constructor(private readonly whatsappService: WhatsAppService) {}

  handleConnection(client: Socket) {
    this.logger.log(`WhatsApp WebSocket client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`WhatsApp WebSocket client disconnected: ${client.id}`);
  }

  /**
   * Emit QR code to client
   */
  emitQrCode(tenantId: string, qrCode: string, expiresIn: number = 60) {
    this.server.to(tenantId).emit('qr-code', {
      qrCode,
      expiresIn,
    });

    this.logger.log(`QR code emitted to tenant: ${tenantId}`);
  }

  /**
   * Emit connection status change
   */
  emitConnectionStatus(
    tenantId: string,
    status: 'connecting' | 'connected' | 'disconnected',
    phoneNumber?: string,
  ) {
    this.server.to(tenantId).emit('connection-status', {
      status,
      phoneNumber,
    });

    this.logger.log(`Connection status emitted to tenant ${tenantId}: ${status}`);
  }
}

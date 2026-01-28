import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: '/messages',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from cookie or handshake auth
      const token = this.extractTokenFromSocket(client);

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without auth token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Store user info in socket data
      client.data.user = payload;
      const tenantId = payload.sub; // JWT payload uses 'sub' field for tenant ID

      // Join tenant room for broadcast messages
      client.join(tenantId);

      this.logger.log(
        `Messages client ${client.id} authenticated and joined tenant room: ${tenantId}`,
      );
    } catch (error) {
      this.logger.error(
        `Authentication failed for Messages client ${client.id}: ${error.message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const tenantId = client.data.user?.sub;
    this.logger.log(
      `Messages WebSocket client disconnected: ${client.id} (tenant: ${tenantId})`,
    );
  }

  /**
   * Extract JWT token from socket handshake
   */
  private extractTokenFromSocket(client: Socket): string | null {
    // Try to get token from cookie
    const cookies = client.handshake.headers.cookie;
    if (cookies) {
      const cookieMatch = cookies.match(/fibidy_auth=([^;]+)/);
      if (cookieMatch) {
        return cookieMatch[1];
      }
    }

    // Try to get token from auth header
    const authHeader =
      client.handshake.auth?.token || client.handshake.headers.authorization;
    if (authHeader) {
      return authHeader.replace('Bearer ', '');
    }

    return null;
  }

  /**
   * Client joins a conversation room
   */
  @SubscribeMessage('join-conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(data.conversationId);
    this.logger.log(
      `Client ${client.id} joined conversation: ${data.conversationId}`,
    );
  }

  /**
   * Client leaves a conversation room
   */
  @SubscribeMessage('leave-conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(data.conversationId);
    this.logger.log(
      `Client ${client.id} left conversation: ${data.conversationId}`,
    );
  }

  /**
   * Mark messages as read
   */
  @SubscribeMessage('mark-as-read')
  handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    this.logger.log(
      `Client ${client.id} marked conversation ${data.conversationId} as read`,
    );
    // The actual marking is handled by the controller/service
  }

  /**
   * Emit new message to conversation room
   */
  emitNewMessage(conversationId: string, message: any) {
    this.server.to(conversationId).emit('new-message', {
      conversationId,
      message,
    });

    this.logger.log(`New message emitted to conversation: ${conversationId}`);
  }

  /**
   * Emit message status update
   */
  emitMessageStatusUpdated(messageId: string, status: string) {
    this.server.emit('message-status-updated', {
      messageId,
      status,
    });

    this.logger.log(`Message status updated: ${messageId} -> ${status}`);
  }

  /**
   * Emit new conversation created
   */
  emitNewConversation(tenantId: string, conversation: any) {
    this.server.to(tenantId).emit('new-conversation', {
      conversation,
    });

    this.logger.log(`New conversation emitted to tenant: ${tenantId}`);
  }
}

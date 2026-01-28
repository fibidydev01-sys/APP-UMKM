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

  handleConnection(client: Socket) {
    this.logger.log(`Messages WebSocket client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Messages WebSocket client disconnected: ${client.id}`);
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

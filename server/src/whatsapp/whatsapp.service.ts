import {
  Injectable,
  Logger,
  OnModuleDestroy,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  proto,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as QRCode from 'qrcode';
import * as path from 'path';
import * as fs from 'fs';
import { WhatsAppSessionStatus } from '@prisma/client';
import { WhatsAppGateway } from './whatsapp.gateway';

@Injectable()
export class WhatsAppService implements OnModuleDestroy {
  private readonly logger = new Logger(WhatsAppService.name);
  private sockets: Map<string, WASocket> = new Map();
  private qrCodeCallbacks: Map<string, (qr: string) => void> = new Map();
  // Track event listeners for cleanup to prevent memory leaks
  private eventListeners: Map<
    string,
    Array<{ event: string; handler: (...args: any[]) => any }>
  > = new Map();
  // Track pending connections to prevent race conditions
  private pendingConnections: Set<string> = new Set();

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => WhatsAppGateway))
    private readonly gateway: WhatsAppGateway,
  ) {}

  async onModuleDestroy() {
    // Close all connections and clean up listeners
    for (const [tenantId, socket] of this.sockets.entries()) {
      this.logger.log(`Closing WhatsApp connection for tenant: ${tenantId}`);

      // Clean up event listeners
      const listeners = this.eventListeners.get(tenantId);
      if (listeners && listeners.length > 0) {
        listeners.forEach(({ event, handler }) => {
          try {
            socket.ev.off(event, handler);
          } catch (e) {
            // Ignore errors when removing listeners
          }
        });
        this.eventListeners.delete(tenantId);
      }

      socket.end(undefined);
    }
    this.sockets.clear();
    this.eventListeners.clear();
  }

  /**
   * Connect WhatsApp for a tenant
   */
  async connectWhatsApp(
    tenantId: string,
    onQrCode?: (qr: string) => void,
  ): Promise<{
    status: WhatsAppSessionStatus;
    qrCode?: string;
    phoneNumber?: string;
    sessionId: string;
  }> {
    // Prevent race condition - check if connection is already in progress
    if (this.pendingConnections.has(tenantId)) {
      this.logger.warn(
        `Connection already in progress for tenant: ${tenantId}`,
      );
      throw new Error('Connection already in progress. Please wait.');
    }

    try {
      // Mark as pending
      this.pendingConnections.add(tenantId);

      // Check if already connected
      const existingSession = await this.prisma.whatsAppSession.findUnique({
        where: { tenantId },
      });

      if (existingSession?.status === WhatsAppSessionStatus.CONNECTED) {
        return {
          status: WhatsAppSessionStatus.CONNECTED,
          phoneNumber: existingSession.phoneNumber,
          sessionId: existingSession.id,
        };
      }

      // Save QR callback
      if (onQrCode) {
        this.qrCodeCallbacks.set(tenantId, onQrCode);
      }

      // Initialize connection
      await this.initializeConnection(tenantId);

      // Get or create session record
      let session = await this.prisma.whatsAppSession.findUnique({
        where: { tenantId },
      });

      if (!session) {
        session = await this.prisma.whatsAppSession.create({
          data: {
            tenantId,
            phoneNumber: 'pending',
            status: WhatsAppSessionStatus.QR_PENDING,
          },
        });
      }

      return {
        status: session.status,
        qrCode: session.qrCode || undefined,
        phoneNumber:
          session.phoneNumber !== 'pending' ? session.phoneNumber : undefined,
        sessionId: session.id,
      };
    } catch (error) {
      this.logger.error(
        `Failed to connect WhatsApp: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      // Remove from pending connections
      this.pendingConnections.delete(tenantId);
    }
  }

  /**
   * Initialize WhatsApp connection with Baileys
   */
  private async initializeConnection(tenantId: string): Promise<void> {
    // Check if there's already an active socket - close it first to prevent duplicates
    const existingSocket = this.sockets.get(tenantId);
    if (existingSocket) {
      this.logger.log(
        `Closing existing socket for tenant: ${tenantId} before creating new one`,
      );

      // Clean up event listeners to prevent memory leaks
      const listeners = this.eventListeners.get(tenantId);
      if (listeners && listeners.length > 0) {
        this.logger.log(
          `Removing ${listeners.length} event listeners for tenant: ${tenantId}`,
        );
        listeners.forEach(({ event, handler }) => {
          try {
            existingSocket.ev.off(event, handler);
          } catch (e) {
            // Ignore errors when removing listeners
          }
        });
        this.eventListeners.delete(tenantId);
      }

      try {
        existingSocket.end(undefined);
      } catch (e) {
        // Ignore errors when closing
      }
      this.sockets.delete(tenantId);
    }

    const sessionPath = this.getSessionPath(tenantId);

    // Ensure session directory exists
    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true });
    }

    // Load auth state
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    // Create socket
    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: this.createLogger(),
    });

    // Store socket
    this.sockets.set(tenantId, socket);

    // Initialize listener tracking for this tenant
    const listeners: Array<{ event: string; handler: (...args: any[]) => any }> =
      [];

    // Handle QR code
    const connectionUpdateHandler = async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        const qrCode = await QRCode.toDataURL(qr);

        // Update database
        await this.prisma.whatsAppSession.upsert({
          where: { tenantId },
          update: {
            qrCode,
            status: WhatsAppSessionStatus.QR_PENDING,
          },
          create: {
            tenantId,
            phoneNumber: 'pending',
            qrCode,
            status: WhatsAppSessionStatus.QR_PENDING,
          },
        });

        // Emit QR code via WebSocket
        if (this.gateway) {
          this.gateway.emitQrCode(tenantId, qrCode, 60);
        }

        // Call callback (legacy support)
        const callback = this.qrCodeCallbacks.get(tenantId);
        if (callback) {
          callback(qrCode);
        }

        this.logger.log(
          `QR Code generated and emitted for tenant: ${tenantId}`,
        );
      }

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        this.logger.log(
          `Connection closed for tenant: ${tenantId}, reconnecting: ${shouldReconnect}`,
        );

        // Update database
        await this.prisma.whatsAppSession.update({
          where: { tenantId },
          data: {
            status: WhatsAppSessionStatus.DISCONNECTED,
            lastDisconnectedAt: new Date(),
          },
        });

        // Emit disconnected status via WebSocket
        if (this.gateway) {
          this.gateway.emitConnectionStatus(tenantId, 'disconnected');
        }

        // Remove socket
        this.sockets.delete(tenantId);

        // Reconnect if needed
        if (shouldReconnect) {
          setTimeout(() => this.initializeConnection(tenantId), 5000);
        }
      }

      if (connection === 'open') {
        this.logger.log(`WhatsApp connected for tenant: ${tenantId}`);

        // Get phone number
        const phoneNumber = socket.user?.id.split(':')[0] || 'unknown';

        // Update database
        await this.prisma.whatsAppSession.update({
          where: { tenantId },
          data: {
            status: WhatsAppSessionStatus.CONNECTED,
            phoneNumber,
            lastConnectedAt: new Date(),
            qrCode: null,
            authStatePath: sessionPath,
          },
        });

        // Emit connected status via WebSocket
        if (this.gateway) {
          this.gateway.emitConnectionStatus(tenantId, 'connected', phoneNumber);
        }

        // Clean up callback
        this.qrCodeCallbacks.delete(tenantId);
      }
    };
    socket.ev.on('connection.update', connectionUpdateHandler);
    listeners.push({ event: 'connection.update', handler: connectionUpdateHandler });

    // Save credentials on update
    const credsUpdateHandler = saveCreds;
    socket.ev.on('creds.update', credsUpdateHandler);
    listeners.push({ event: 'creds.update', handler: credsUpdateHandler });

    // Handle incoming messages
    const messagesUpsertHandler = async (messageUpdate) => {
      await this.handleIncomingMessages(tenantId, messageUpdate);
    };
    socket.ev.on('messages.upsert', messagesUpsertHandler);
    listeners.push({ event: 'messages.upsert', handler: messagesUpsertHandler });

    // Store all listeners for cleanup
    this.eventListeners.set(tenantId, listeners);
    this.logger.log(
      `Registered ${listeners.length} event listeners for tenant: ${tenantId}`,
    );
  }

  /**
   * Handle incoming messages
   */
  private async handleIncomingMessages(
    tenantId: string,
    messageUpdate: { messages: proto.IWebMessageInfo[]; type: string },
  ): Promise<void> {
    const { messages, type } = messageUpdate;

    if (type !== 'notify') return;

    for (const msg of messages) {
      // Skip if no key
      if (!msg.key) continue;

      // Skip if not from user (check if it's a user JID, not group)
      if (!msg.key.remoteJid || !msg.key.remoteJid.includes('@s.whatsapp.net'))
        continue;

      // Skip if sent by us
      if (msg.key.fromMe) continue;

      const from = msg.key.remoteJid.split('@')[0];
      const messageContent =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        '';

      this.logger.log(`Received message from ${from}: ${messageContent}`);

      // TODO: Process message (will be handled by Messages module)
      // For now, just log it
    }
  }

  /**
   * Send message
   */
  async sendMessage(
    tenantId: string,
    to: string,
    message: string,
    messageType: 'text' | 'image' = 'text',
    mediaUrl?: string,
  ): Promise<{ success: boolean; messageId?: string }> {
    try {
      const socket = this.sockets.get(tenantId);

      if (!socket) {
        throw new Error('WhatsApp not connected');
      }

      // Format phone number (add @s.whatsapp.net)
      const jid = `${to}@s.whatsapp.net`;

      let sentMessage;

      if (messageType === 'text') {
        sentMessage = await socket.sendMessage(jid, { text: message });
      } else if (messageType === 'image' && mediaUrl) {
        sentMessage = await socket.sendMessage(jid, {
          image: { url: mediaUrl },
          caption: message,
        });
      }

      this.logger.log(`Message sent to ${to}`);

      return {
        success: true,
        messageId: sentMessage?.key?.id,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Disconnect WhatsApp
   */
  async disconnectWhatsApp(tenantId: string): Promise<{ success: boolean }> {
    try {
      const socket = this.sockets.get(tenantId);

      if (socket) {
        // Clean up event listeners before disconnect
        const listeners = this.eventListeners.get(tenantId);
        if (listeners && listeners.length > 0) {
          this.logger.log(
            `Cleaning up ${listeners.length} event listeners for tenant: ${tenantId}`,
          );
          listeners.forEach(({ event, handler }) => {
            try {
              socket.ev.off(event, handler);
            } catch (e) {
              // Ignore errors when removing listeners
            }
          });
          this.eventListeners.delete(tenantId);
        }

        socket.logout();
        socket.end(undefined);
        this.sockets.delete(tenantId);
      }

      // Clear session files
      const sessionPath = this.getSessionPath(tenantId);
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
      }

      // Update database
      await this.prisma.whatsAppSession.update({
        where: { tenantId },
        data: {
          status: WhatsAppSessionStatus.DISCONNECTED,
          lastDisconnectedAt: new Date(),
          qrCode: null,
        },
      });

      this.logger.log(`WhatsApp disconnected for tenant: ${tenantId}`);

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to disconnect: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get WhatsApp status
   */
  async getStatus(tenantId: string): Promise<{
    status: WhatsAppSessionStatus;
    phoneNumber?: string;
    lastConnected?: Date;
    isOnline: boolean;
  }> {
    const session = await this.prisma.whatsAppSession.findUnique({
      where: { tenantId },
    });

    if (!session) {
      return {
        status: WhatsAppSessionStatus.DISCONNECTED,
        isOnline: false,
      };
    }

    const isOnline =
      this.sockets.has(tenantId) &&
      session.status === WhatsAppSessionStatus.CONNECTED;

    return {
      status: session.status,
      phoneNumber:
        session.phoneNumber !== 'pending' ? session.phoneNumber : undefined,
      lastConnected: session.lastConnectedAt || undefined,
      isOnline,
    };
  }

  /**
   * Get socket for tenant
   */
  getSocket(tenantId: string): WASocket | undefined {
    return this.sockets.get(tenantId);
  }

  /**
   * Get session path
   */
  private getSessionPath(tenantId: string): string {
    const basePath = process.env.WHATSAPP_SESSION_PATH || './whatsapp-sessions';
    return path.join(basePath, tenantId);
  }

  /**
   * Create Pino logger
   */
  private createLogger() {
    return {
      level: 'silent', // Disable Baileys logging (too verbose)
      child: () => this.createLogger(),
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      fatal: () => {},
    };
  }
}

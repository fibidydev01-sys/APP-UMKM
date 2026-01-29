# 🔄 WhatsApp Session Hybrid Backup Implementation

**Version:** 1.0.0  
**Purpose:** Session persistence across server restarts (Railway/Production)  
**Stack:** Local Disk + Supabase Storage Backup  
**Status:** ⚠️ Implementation Required  
**Last Updated:** January 29, 2026

---

## 📑 Table of Contents

1. [Why Hybrid Approach?](#-why-hybrid-approach)
2. [Architecture Overview](#-architecture-overview)
3. [Database Migration](#-database-migration)
4. [Supabase Storage Setup](#-supabase-storage-setup)
5. [Backend Implementation](#-backend-implementation)
6. [Environment Configuration](#-environment-configuration)
7. [Deployment Guide (Railway)](#-deployment-guide-railway)
8. [Testing & Verification](#-testing--verification)
9. [Troubleshooting](#-troubleshooting)
10. [Migration from Pure Local](#-migration-from-pure-local)

---

## 🤔 Why Hybrid Approach?

### **The Problem with Pure Local Storage**

```bash
# Railway/Vercel/Render menggunakan EPHEMERAL filesystem

[User] → Scan QR → Session saved to /app/whatsapp-sessions ✅
[Server] → Restart/Redeploy → /app/whatsapp-sessions DELETED ❌
[User] → Harus scan QR lagi ❌
[Loop] → Restart → Scan → Restart → Scan... 💀
```

### **Comparison Table**

| Aspect | Pure Local | Pure Database | **Hybrid (Recommended)** |
|--------|-----------|---------------|--------------------------|
| **Read/Write Speed** | ⚡ Very Fast | 🐌 Slower (network) | ⚡ Fast (local primary) |
| **Reliability** | ✅ No network deps | ✅ Persistent | ✅ Best of both |
| **Portability** | ❌ Lost on restart | ✅ Survives restart | ✅ Survives restart |
| **Backup** | ❌ Manual | ✅ Automatic | ✅ Automatic (5 min) |
| **Server Migration** | ❌ Can't migrate | ✅ Easy | ✅ Easy (restore from cloud) |
| **Cost** | 💰 Free (disk) | 💰 DB storage | 💰 Minimal (storage) |
| **Complexity** | 🟢 Simple | 🟡 Medium | 🟡 Medium |

### **Why Hybrid Wins**

```typescript
// ✅ HYBRID APPROACH

1. Primary: Local disk (/app/whatsapp-sessions)
   → Fast read/write for Baileys (no network delay)
   
2. Backup: Supabase Storage (every 5 minutes)
   → Automatic backup to cloud
   → Survives server restarts
   
3. Restore: On startup
   → Check if local session exists
   → If not, restore from Supabase Storage
   → No QR scan needed after restart! 🎉
```

---

## 🏗️ Architecture Overview

### **Flow Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVER STARTUP                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Check local: /app/whatsapp-sessions/tenant-id/        │
│                                                             │
│  2. Does creds.json exist?                                 │
│     ├─ YES → Use local session (fast!) ✅                  │
│     └─ NO  → Download from Supabase Storage ⬇️             │
│                                                             │
│  3. Initialize Baileys with session                        │
│                                                             │
│  4. Start periodic backup (every 5 min) ⏱️                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  DURING OPERATION                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  • Baileys updates session → Save to local disk            │
│                                                             │
│  • Every 5 minutes:                                         │
│    1. Read local session files                             │
│    2. Upload to Supabase Storage                           │
│    3. Update `lastBackupAt` in database                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  ON DISCONNECT                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Force final backup to Supabase Storage                 │
│  2. Delete local session files                             │
│  3. Update database status                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **File Structure**

```
LOCAL DISK (Ephemeral - Resets on restart)
└── /app/whatsapp-sessions/
    └── {tenantId}/
        ├── creds.json              (Auth credentials)
        ├── keys.json               (Encryption keys)
        └── app-state-sync-*.json   (App state)

SUPABASE STORAGE (Persistent - Cloud backup)
└── whatsapp-sessions/
    └── {tenantId}/
        ├── creds.json              (Backup)
        └── keys.json               (Backup)

POSTGRESQL DATABASE (Metadata)
└── whatsapp_sessions
    ├── tenantId
    ├── phoneNumber
    ├── status
    ├── authStatePath              (Local path)
    └── lastBackupAt               (✨ NEW: Timestamp)
```

---

## 🗄️ Database Migration

### **Step 1: Update Prisma Schema**

Add `lastBackupAt` column to `WhatsAppSession` model:

```prisma
// prisma/schema.prisma

model WhatsAppSession {
  id                   String                @id @default(cuid())

  // Foreign Keys
  tenantId             String                @unique
  tenant               Tenant                @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // WhatsApp Connection
  phoneNumber          String                @unique
  qrCode               String?               @db.Text

  // Status
  status               WhatsAppSessionStatus @default(DISCONNECTED)
  connectionState      Json?

  // Session Data
  authStatePath        String?

  // ✨ NEW: Backup tracking
  lastBackupAt         DateTime?

  // Metadata
  lastConnectedAt      DateTime?
  lastDisconnectedAt   DateTime?

  // Timestamps
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @updatedAt

  @@index([status])
  @@index([tenantId])
}
```

### **Step 2: Create Migration**

```bash
# Generate migration file
npx prisma migrate dev --name add_session_backup_tracking

# Expected output:
# ✔ Generated Prisma Client
# ✔ The following migration(s) have been created and applied:
#   migrations/
#     └─ 20260129_add_session_backup_tracking/
#        └─ migration.sql
```

### **Step 3: Verify Migration**

```bash
# Check migration was applied
npx prisma migrate status

# Open Prisma Studio to verify column exists
npx prisma studio
```

### **Migration SQL (Generated)**

```sql
-- AlterTable
ALTER TABLE "WhatsAppSession" ADD COLUMN "lastBackupAt" TIMESTAMP(3);

-- Create index for better query performance (optional)
CREATE INDEX "WhatsAppSession_lastBackupAt_idx" ON "WhatsAppSession"("lastBackupAt");
```

---

## ☁️ Supabase Storage Setup

### **Step 1: Create Storage Bucket**

**Via Supabase Dashboard:**

1. Go to **Storage** in sidebar
2. Click **New bucket**
3. Settings:
   - **Name:** `whatsapp-sessions`
   - **Public:** `false` (IMPORTANT!)
   - **File size limit:** 50 MB
   - **Allowed MIME types:** `application/json`

**Via SQL (Alternative):**

```sql
-- In Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('whatsapp-sessions', 'whatsapp-sessions', false);
```

### **Step 2: Set Storage Policies (RLS)**

```sql
-- Policy 1: Allow service role to manage all files
CREATE POLICY "Service role can manage session files"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'whatsapp-sessions');

-- Policy 2: Allow authenticated users to manage their own sessions
CREATE POLICY "Users can manage their own session files"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'whatsapp-sessions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Select policy (read)
CREATE POLICY "Users can read their session files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'whatsapp-sessions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Insert policy (upload)
CREATE POLICY "Users can upload session files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'whatsapp-sessions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 5: Update policy (overwrite)
CREATE POLICY "Users can update session files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'whatsapp-sessions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 6: Delete policy
CREATE POLICY "Users can delete session files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'whatsapp-sessions'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### **Step 3: Get Supabase Credentials**

```bash
# From Supabase Dashboard → Settings → API

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # anon/public key
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # service_role key (for backend)
```

⚠️ **IMPORTANT:** Use `SUPABASE_SERVICE_KEY` (service_role) in backend for full access!

### **Step 4: Test Upload/Download**

```bash
# Test via curl
curl -X POST 'https://xxxxx.supabase.co/storage/v1/object/whatsapp-sessions/test.json' \
  -H "Authorization: Bearer YOUR_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  --data-binary '{"test": true}'

# Test download
curl 'https://xxxxx.supabase.co/storage/v1/object/whatsapp-sessions/test.json' \
  -H "Authorization: Bearer YOUR_SERVICE_KEY"
```

---

## 💻 Backend Implementation

### **Step 1: Install Supabase Client**

```bash
cd server
pnpm add @supabase/supabase-js
```

### **Step 2: Create HybridAuthStateService**

Create file: `server/src/whatsapp/hybrid-auth-state.service.ts`

```typescript
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { mkdir, writeFile, readFile, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class HybridAuthStateService implements OnModuleDestroy {
  private readonly logger = new Logger(HybridAuthStateService.name);
  private supabase: SupabaseClient | null = null;
  private sessionPath: string;
  private bucket: string;
  private backupInterval = 5 * 60 * 1000; // 5 minutes
  private backupTimers = new Map<string, NodeJS.Timeout>();

  constructor(private prisma: PrismaService) {
    // Get config from env
    this.sessionPath = process.env.WHATSAPP_SESSION_PATH || './whatsapp-sessions';
    this.bucket = process.env.SUPABASE_BUCKET || 'whatsapp-sessions';

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
      this.logger.log('✅ Supabase Storage backup enabled');
    } else {
      this.logger.warn('⚠️ Supabase Storage not configured - sessions will be ephemeral!');
      this.logger.warn('⚠️ Add SUPABASE_URL and SUPABASE_SERVICE_KEY to enable backup');
    }
  }

  /**
   * Get local session path for a tenant
   */
  private getLocalPath(tenantId: string): string {
    return join(this.sessionPath, tenantId);
  }

  /**
   * Get Supabase Storage path for a file
   */
  private getSupabasePath(tenantId: string, file: string): string {
    return `${tenantId}/${file}`;
  }

  /**
   * Initialize session for a tenant
   * - Create local directory
   * - Restore from Supabase if local doesn't exist
   * - Start periodic backup
   */
  async initialize(tenantId: string): Promise<void> {
    const localPath = this.getLocalPath(tenantId);

    // Create local directory
    if (!existsSync(localPath)) {
      await mkdir(localPath, { recursive: true });
      this.logger.log(`📁 Created session directory: ${localPath}`);
    }

    // Update authStatePath in database
    await this.prisma.whatsAppSession.upsert({
      where: { tenantId },
      create: {
        tenantId,
        phoneNumber: '', // Will be updated when connected
        authStatePath: localPath,
      },
      update: {
        authStatePath: localPath,
      },
    });

    // Check if local session exists
    const credsExists = existsSync(join(localPath, 'creds.json'));

    if (!credsExists && this.supabase) {
      // Try restore from Supabase Storage
      this.logger.log(`🔄 Restoring session for tenant ${tenantId} from Supabase...`);
      const restored = await this.restoreFromSupabase(tenantId);

      if (restored) {
        this.logger.log(`✅ Session restored from Supabase Storage`);
      } else {
        this.logger.log(`⚠️ No backup found - will create new session`);
      }
    } else if (credsExists) {
      this.logger.log(`✅ Local session found for tenant ${tenantId}`);
    }

    // Start periodic backup
    if (this.supabase) {
      this.startPeriodicBackup(tenantId);
    }
  }

  /**
   * Backup session files to Supabase Storage
   */
  async backupToSupabase(tenantId: string): Promise<boolean> {
    if (!this.supabase) {
      this.logger.debug('Supabase not configured, skipping backup');
      return false;
    }

    try {
      const localPath = this.getLocalPath(tenantId);
      const credsPath = join(localPath, 'creds.json');
      const keysPath = join(localPath, 'keys.json');

      // Check if session files exist
      if (!existsSync(credsPath)) {
        this.logger.warn(`⚠️ No session to backup for tenant ${tenantId}`);
        return false;
      }

      // Read files
      const credsBuffer = await readFile(credsPath);
      const keysBuffer = existsSync(keysPath) ? await readFile(keysPath) : null;

      // Upload creds.json
      const { error: credsError } = await this.supabase.storage
        .from(this.bucket)
        .upload(this.getSupabasePath(tenantId, 'creds.json'), credsBuffer, {
          upsert: true,
          contentType: 'application/json',
        });

      if (credsError) {
        this.logger.error(`❌ Failed to backup creds: ${credsError.message}`);
        return false;
      }

      // Upload keys.json if exists
      if (keysBuffer) {
        const { error: keysError } = await this.supabase.storage
          .from(this.bucket)
          .upload(this.getSupabasePath(tenantId, 'keys.json'), keysBuffer, {
            upsert: true,
            contentType: 'application/json',
          });

        if (keysError) {
          this.logger.error(`❌ Failed to backup keys: ${keysError.message}`);
        }
      }

      // Update lastBackupAt in database
      await this.prisma.whatsAppSession.update({
        where: { tenantId },
        data: { lastBackupAt: new Date() },
      });

      this.logger.log(`✅ Session backed up for tenant ${tenantId}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Backup error for ${tenantId}:`, error);
      return false;
    }
  }

  /**
   * Restore session files from Supabase Storage
   */
  async restoreFromSupabase(tenantId: string): Promise<boolean> {
    if (!this.supabase) return false;

    try {
      const localPath = this.getLocalPath(tenantId);

      // Download creds.json
      const { data: credsData, error: credsError } = await this.supabase.storage
        .from(this.bucket)
        .download(this.getSupabasePath(tenantId, 'creds.json'));

      if (credsError || !credsData) {
        this.logger.warn(`⚠️ No backup found for tenant ${tenantId}`);
        return false;
      }

      // Download keys.json (optional)
      const { data: keysData } = await this.supabase.storage
        .from(this.bucket)
        .download(this.getSupabasePath(tenantId, 'keys.json'));

      // Save to local disk
      await writeFile(join(localPath, 'creds.json'), await credsData.text());

      if (keysData) {
        await writeFile(join(localPath, 'keys.json'), await keysData.text());
      }

      this.logger.log(`✅ Session restored for tenant ${tenantId}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Restore error for ${tenantId}:`, error);
      return false;
    }
  }

  /**
   * Start periodic backup (every 5 minutes)
   */
  private startPeriodicBackup(tenantId: string): void {
    // Clear existing timer if any
    this.stopPeriodicBackup(tenantId);

    // Start new timer
    const timer = setInterval(async () => {
      await this.backupToSupabase(tenantId);
    }, this.backupInterval);

    this.backupTimers.set(tenantId, timer);
    this.logger.log(`⏱️ Periodic backup started for tenant ${tenantId} (every 5 min)`);
  }

  /**
   * Stop periodic backup
   */
  private stopPeriodicBackup(tenantId: string): void {
    const timer = this.backupTimers.get(tenantId);
    if (timer) {
      clearInterval(timer);
      this.backupTimers.delete(tenantId);
      this.logger.log(`⏹️ Periodic backup stopped for tenant ${tenantId}`);
    }
  }

  /**
   * Delete session (local + Supabase + DB)
   */
  async deleteSession(tenantId: string): Promise<void> {
    // Stop periodic backup
    this.stopPeriodicBackup(tenantId);

    // Delete from Supabase Storage
    if (this.supabase) {
      try {
        await this.supabase.storage.from(this.bucket).remove([
          this.getSupabasePath(tenantId, 'creds.json'),
          this.getSupabasePath(tenantId, 'keys.json'),
        ]);
        this.logger.log(`🗑️ Deleted Supabase backup for tenant ${tenantId}`);
      } catch (error) {
        this.logger.error(`Failed to delete Supabase backup:`, error);
      }
    }

    // Delete local files
    const localPath = this.getLocalPath(tenantId);
    if (existsSync(localPath)) {
      await rm(localPath, { recursive: true, force: true });
      this.logger.log(`🗑️ Deleted local session for tenant ${tenantId}`);
    }

    // Update database
    await this.prisma.whatsAppSession.update({
      where: { tenantId },
      data: {
        status: 'DISCONNECTED',
        authStatePath: null,
        lastBackupAt: null,
        lastDisconnectedAt: new Date(),
      },
    });

    this.logger.log(`✅ Session deleted for tenant ${tenantId}`);
  }

  /**
   * Force immediate backup (called before disconnect)
   */
  async forceBackup(tenantId: string): Promise<void> {
    this.logger.log(`🔄 Force backup for tenant ${tenantId}...`);
    await this.backupToSupabase(tenantId);
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy() {
    this.logger.log('🛑 Stopping all backup timers...');

    // Stop all timers and do final backup
    for (const [tenantId, timer] of this.backupTimers.entries()) {
      clearInterval(timer);
      await this.backupToSupabase(tenantId); // Final backup
      this.logger.log(`✅ Final backup completed for tenant ${tenantId}`);
    }

    this.backupTimers.clear();
  }
}
```

### **Step 3: Register Service in WhatsApp Module**

```typescript
// server/src/whatsapp/whatsapp.module.ts

import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppGateway } from './whatsapp.gateway';
import { HybridAuthStateService } from './hybrid-auth-state.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WhatsAppController],
  providers: [
    WhatsAppService,
    WhatsAppGateway,
    HybridAuthStateService, // ✨ Add this
  ],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
```

### **Step 4: Integrate with WhatsApp Service**

Update `server/src/whatsapp/whatsapp.service.ts`:

```typescript
import { Injectable, Logger } from '@nestjs/common';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { HybridAuthStateService } from './hybrid-auth-state.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private sockets = new Map<string, any>(); // tenantId -> socket

  constructor(
    private hybridAuthState: HybridAuthStateService,
    private prisma: PrismaService,
  ) {}

  /**
   * Connect WhatsApp for a tenant
   */
  async connect(tenantId: string) {
    try {
      // Initialize hybrid auth state (restore from Supabase if needed)
      await this.hybridAuthState.initialize(tenantId);

      // Get local session path
      const sessionPath = `./whatsapp-sessions/${tenantId}`;

      // Use Baileys multi-file auth state
      const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

      // Create WhatsApp socket
      const socket = makeWASocket({
        auth: state,
        printQRInTerminal: false,
      });

      this.sockets.set(tenantId, socket);

      // Event: Credentials update (save & backup)
      socket.ev.on('creds.update', async () => {
        await saveCreds(); // Save to local
        await this.hybridAuthState.backupToSupabase(tenantId); // Backup to cloud
      });

      // Event: Connection update
      socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          // QR code generated
          this.logger.log(`QR code generated for tenant ${tenantId}`);
          // Emit via WebSocket gateway...
        }

        if (connection === 'open') {
          this.logger.log(`✅ WhatsApp connected for tenant ${tenantId}`);
          
          // Update database
          await this.prisma.whatsAppSession.update({
            where: { tenantId },
            data: {
              status: 'CONNECTED',
              lastConnectedAt: new Date(),
            },
          });
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          this.logger.warn(`Connection closed for tenant ${tenantId}. Reconnect: ${shouldReconnect}`);

          if (!shouldReconnect) {
            // Logged out - force backup before cleanup
            await this.hybridAuthState.forceBackup(tenantId);
          }

          // Update database
          await this.prisma.whatsAppSession.update({
            where: { tenantId },
            data: {
              status: 'DISCONNECTED',
              lastDisconnectedAt: new Date(),
            },
          });
        }
      });

      return socket;
    } catch (error) {
      this.logger.error(`Failed to connect WhatsApp for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect WhatsApp for a tenant
   */
  async disconnect(tenantId: string) {
    const socket = this.sockets.get(tenantId);

    if (socket) {
      // Force final backup before disconnect
      await this.hybridAuthState.forceBackup(tenantId);

      // Close socket
      socket.end();
      this.sockets.delete(tenantId);

      // Delete session (local + cloud)
      await this.hybridAuthState.deleteSession(tenantId);

      this.logger.log(`✅ WhatsApp disconnected for tenant ${tenantId}`);
    }
  }

  /**
   * Get socket for a tenant
   */
  getSocket(tenantId: string) {
    return this.sockets.get(tenantId);
  }
}
```

---

## ⚙️ Environment Configuration

### **Development (.env.local)**

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres:password@localhost:5432/fibidy?schema=public
DIRECT_URL=postgresql://postgres:password@localhost:5432/fibidy?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-development
JWT_EXPIRES_IN=7d

# App
NODE_ENV=development
PORT=8000

# CORS
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# WhatsApp
WHATSAPP_SESSION_PATH=./whatsapp-sessions
WHATSAPP_MAX_RETRIES=3

# Auto-Reply
AUTO_REPLY_ENABLED=true
AUTO_REPLY_DEFAULT_DELAY_SECONDS=2

# ✨ Supabase Storage (for session backup)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # anon key
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # service_role key (IMPORTANT!)
SUPABASE_BUCKET=whatsapp-sessions
```

### **Production (Railway Variables)**

Go to Railway → Project → Variables → Add all:

```bash
# Database
DATABASE_URL=postgresql://postgres:xxx@xxx.supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:xxx@xxx.supabase.co:5432/postgres

# JWT
JWT_SECRET=your-super-long-random-production-secret-min-32-chars
JWT_EXPIRES_IN=7d

# App
NODE_ENV=production
PORT=8000

# CORS
FRONTEND_URL=https://your-frontend.vercel.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com

# Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# WhatsApp (IMPORTANT: Use /app for Railway!)
WHATSAPP_SESSION_PATH=/app/whatsapp-sessions
WHATSAPP_MAX_RETRIES=3

# Auto-Reply
AUTO_REPLY_ENABLED=true
AUTO_REPLY_DEFAULT_DELAY_SECONDS=2

# ✨ Supabase Storage (CRITICAL for session backup)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_BUCKET=whatsapp-sessions
```

⚠️ **CRITICAL NOTES:**

1. **Use `SUPABASE_SERVICE_KEY`** (not `SUPABASE_KEY`) in production for full storage access
2. **`WHATSAPP_SESSION_PATH=/app/whatsapp-sessions`** (Railway uses `/app` as working directory)
3. **Keep `JWT_SECRET` secure** and different for dev/prod

---

## 🚀 Deployment Guide (Railway)

### **Pre-Deployment Checklist**

```bash
✅ Database migrated (lastBackupAt column added)
✅ Supabase Storage bucket created
✅ Storage policies configured
✅ HybridAuthStateService implemented
✅ WhatsAppService updated
✅ Environment variables ready
✅ Code pushed to GitHub
```

### **Step 1: Push Code to GitHub**

```bash
# Commit all changes
git add .
git commit -m "feat: implement hybrid session backup"
git push origin main
```

### **Step 2: Configure Railway Variables**

1. Go to **Railway Dashboard**
2. Select your project
3. Click **Variables** tab
4. Add all variables from "Production" section above
5. **Important:** Click **Deploy** to apply changes

### **Step 3: Deploy**

Railway will auto-deploy when you push to GitHub. Or manually:

1. Click **Deployments**
2. Click **Deploy Now**
3. Wait for build to complete

### **Step 4: Verify Deployment**

Check logs for successful initialization:

```bash
# Railway logs should show:
[HybridAuthStateService] ✅ Supabase Storage backup enabled
[WhatsAppService] Initializing WhatsApp service...
[HybridAuthStateService] 📁 Created session directory: /app/whatsapp-sessions/tenant-xxx
[HybridAuthStateService] ⏱️ Periodic backup started for tenant tenant-xxx (every 5 min)
```

### **Step 5: Test Session Backup**

1. **Connect WhatsApp** (scan QR code)
2. **Wait 5 minutes** for first backup
3. **Check logs** for backup confirmation:
   ```
   [HybridAuthStateService] ✅ Session backed up for tenant tenant-xxx
   ```
4. **Verify in Supabase Storage**:
   - Go to Supabase → Storage → whatsapp-sessions
   - Should see folder `tenant-xxx/` with files

### **Step 6: Test Session Restore**

1. **Restart Railway service** (Settings → Restart)
2. **Check logs** for restore:
   ```
   [HybridAuthStateService] 🔄 Restoring session for tenant tenant-xxx from Supabase...
   [HybridAuthStateService] ✅ Session restored from Supabase Storage
   [WhatsAppService] ✅ WhatsApp connected for tenant tenant-xxx
   ```
3. **Verify**: No QR scan needed! ✅

---

## 🧪 Testing & Verification

### **Test 1: Initial Backup Works**

```bash
# Steps:
1. Connect WhatsApp locally
2. Wait 5 minutes
3. Check logs for: "✅ Session backed up"
4. Check Supabase Storage for files

# Expected:
✅ creds.json uploaded
✅ keys.json uploaded
✅ lastBackupAt updated in database
```

### **Test 2: Restore on Server Restart**

```bash
# Steps:
1. Stop server (Ctrl+C or Railway restart)
2. Start server again
3. Check logs

# Expected:
✅ "🔄 Restoring session from Supabase..."
✅ "✅ Session restored"
✅ WhatsApp connects WITHOUT QR scan
```

### **Test 3: Periodic Backup**

```bash
# Steps:
1. Keep server running for 10+ minutes
2. Make a change (send a test message)
3. Check logs every 5 minutes

# Expected:
✅ Backup logs appear every ~5 minutes
✅ lastBackupAt timestamp updates
```

### **Test 4: Force Backup on Disconnect**

```bash
# Steps:
1. Connect WhatsApp
2. Click "Disconnect"
3. Check logs

# Expected:
✅ "🔄 Force backup for tenant..."
✅ "✅ Session backed up"
✅ "🗑️ Session deleted"
```

### **Verification Checklist**

```typescript
// ✅ Verify all these work:

1. [ ] Session files created in /app/whatsapp-sessions/
2. [ ] Session files uploaded to Supabase Storage
3. [ ] lastBackupAt updated in database
4. [ ] Periodic backup runs every 5 minutes
5. [ ] Session restored on server restart
6. [ ] No QR scan needed after restore
7. [ ] Force backup on disconnect
8. [ ] Session deleted from both local & cloud
```

---

## 🐛 Troubleshooting

### **Problem 1: "Supabase Storage not configured"**

```bash
# Error in logs:
⚠️ Supabase Storage not configured - sessions will be ephemeral!
```

**Solution:**
1. Check `.env` has `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
2. Verify values are correct (copy from Supabase dashboard)
3. Restart server

```bash
# Verify env vars loaded
console.log(process.env.SUPABASE_URL); // Should print URL
```

---

### **Problem 2: "Failed to backup creds"**

```bash
# Error:
❌ Failed to backup creds: new row violates row-level security policy
```

**Solution:**
1. Check Supabase Storage policies are correct
2. Make sure using `SUPABASE_SERVICE_KEY` (not anon key)
3. Verify bucket exists and name matches `SUPABASE_BUCKET`

```sql
-- Re-run policy creation (see Supabase Storage Setup)
CREATE POLICY "Service role can manage session files"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'whatsapp-sessions');
```

---

### **Problem 3: "No backup found" on restore**

```bash
# Warning:
⚠️ No backup found for tenant tenant-xxx
```

**Possible Causes:**
1. First time connecting (no backup exists yet)
2. Backup failed previously
3. Wrong bucket name

**Solution:**
1. If first time: Normal, just scan QR
2. Check Supabase Storage manually for files
3. Verify `SUPABASE_BUCKET` matches actual bucket name

---

### **Problem 4: Session still lost after restart**

```bash
# Symptom: QR scan required every restart
```

**Debugging Steps:**

1. **Check if backup ran:**
   ```bash
   # Look for in logs:
   ✅ Session backed up for tenant tenant-xxx
   ```

2. **Check Supabase Storage:**
   - Go to Storage → whatsapp-sessions
   - Verify files exist

3. **Check restore attempt:**
   ```bash
   # Look for in logs:
   🔄 Restoring session for tenant tenant-xxx from Supabase...
   ```

4. **Check database:**
   ```sql
   SELECT tenantId, lastBackupAt, authStatePath 
   FROM "WhatsAppSession";
   ```

5. **Verify environment:**
   ```bash
   # In Railway logs, check:
   SUPABASE_URL=https://... (should be present)
   SUPABASE_SERVICE_KEY=eyJ... (should be present)
   ```

---

### **Problem 5: "Permission denied" on Railway**

```bash
# Error:
EACCES: permission denied, mkdir '/whatsapp-sessions'
```

**Solution:**
Railway uses `/app` as working directory. Update env:

```bash
# Change this:
WHATSAPP_SESSION_PATH=./whatsapp-sessions

# To this:
WHATSAPP_SESSION_PATH=/app/whatsapp-sessions
```

---

### **Problem 6: Backup not running periodically**

```bash
# Symptom: Only one backup, then stops
```

**Debugging:**
1. Check if timer started:
   ```bash
   ⏱️ Periodic backup started for tenant tenant-xxx (every 5 min)
   ```

2. Check if service destroyed early (check logs for crashes)

3. Verify backup function not erroring silently

**Fix:**
Add more logging in `backupToSupabase()`:

```typescript
async backupToSupabase(tenantId: string): Promise<boolean> {
  this.logger.log(`🔄 Starting backup for ${tenantId}...`); // Add this
  
  // ... existing code ...
  
  this.logger.log(`✅ Backup completed for ${tenantId}`); // Add this
  return true;
}
```

---

### **Problem 7: Railway filesystem full**

```bash
# Error:
ENOSPC: no space left on device
```

**Solution:**
Session files are small (~100-300KB each), but if you have many tenants:

1. **Monitor disk usage:**
   ```bash
   du -sh /app/whatsapp-sessions/
   ```

2. **Clean up old sessions:**
   ```typescript
   // Add cleanup for inactive sessions > 30 days
   async cleanupOldSessions() {
     const thirtyDaysAgo = new Date();
     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
     
     const oldSessions = await this.prisma.whatsAppSession.findMany({
       where: {
         status: 'DISCONNECTED',
         lastDisconnectedAt: { lt: thirtyDaysAgo },
       },
     });
     
     for (const session of oldSessions) {
       await this.deleteSession(session.tenantId);
     }
   }
   ```

---

### **Debug Checklist**

When things don't work, check in order:

```typescript
1. [ ] Environment variables set correctly
2. [ ] Supabase bucket exists
3. [ ] Storage policies configured
4. [ ] lastBackupAt column exists in DB
5. [ ] HybridAuthStateService registered in module
6. [ ] Logs show "Supabase Storage backup enabled"
7. [ ] Logs show backup attempts
8. [ ] Files visible in Supabase Storage
9. [ ] Restore attempts on startup
10. [ ] No errors in Railway/server logs
```

---

## 🔄 Migration from Pure Local

If you already have a deployed app using pure local storage:

### **Step 1: Backup Existing Sessions**

```bash
# SSH into Railway (if possible) or use API
# Copy session files somewhere safe
cp -r /app/whatsapp-sessions /tmp/backup
```

### **Step 2: Run Database Migration**

```bash
npx prisma migrate deploy
```

### **Step 3: Manual Upload to Supabase**

For each existing session:

```typescript
// One-time script: upload-existing-sessions.ts

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { join } from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function uploadExistingSessions() {
  const sessions = ['tenant-id-1', 'tenant-id-2']; // Your tenant IDs
  
  for (const tenantId of sessions) {
    const credsPath = join('./whatsapp-sessions', tenantId, 'creds.json');
    const keysPath = join('./whatsapp-sessions', tenantId, 'keys.json');
    
    // Upload creds
    const creds = await readFile(credsPath);
    await supabase.storage
      .from('whatsapp-sessions')
      .upload(`${tenantId}/creds.json`, creds, { upsert: true });
    
    // Upload keys
    const keys = await readFile(keysPath);
    await supabase.storage
      .from('whatsapp-sessions')
      .upload(`${tenantId}/keys.json`, keys, { upsert: true });
    
    console.log(`✅ Uploaded session for ${tenantId}`);
  }
}

uploadExistingSessions();
```

Run:
```bash
npx ts-node scripts/upload-existing-sessions.ts
```

### **Step 4: Deploy New Code**

```bash
git add .
git commit -m "feat: add hybrid session backup"
git push origin main
```

### **Step 5: Verify**

Restart Railway and check logs for:
```
✅ Session restored from Supabase Storage
```

---

## 📊 Monitoring & Maintenance

### **Health Checks**

Add to your monitoring:

```typescript
// health.controller.ts

@Get('health/sessions')
async checkSessionHealth() {
  const sessions = await this.prisma.whatsAppSession.findMany({
    where: { status: 'CONNECTED' },
  });
  
  const health = {
    total: sessions.length,
    backed_up: sessions.filter(s => s.lastBackupAt).length,
    needs_backup: sessions.filter(s => !s.lastBackupAt).length,
    oldest_backup: sessions
      .map(s => s.lastBackupAt)
      .filter(Boolean)
      .sort()[0],
  };
  
  return health;
}
```

### **Backup Status Dashboard**

```sql
-- Query to check backup status
SELECT 
  tenantId,
  status,
  lastBackupAt,
  CASE 
    WHEN lastBackupAt IS NULL THEN 'Never backed up'
    WHEN lastBackupAt < NOW() - INTERVAL '10 minutes' THEN 'Backup overdue'
    ELSE 'OK'
  END as backup_status
FROM "WhatsAppSession"
WHERE status = 'CONNECTED';
```

### **Alerts**

Set up alerts for:
1. ⚠️ Session connected but no backup in 10+ minutes
2. ⚠️ Backup failures (check logs)
3. ⚠️ Restore failures on startup

---

## 🎯 Success Criteria

✅ **You'll know hybrid backup works when:**

1. **First Connection:**
   - Scan QR code
   - See "✅ Session backed up" in logs after 5 minutes
   - Files visible in Supabase Storage

2. **Server Restart:**
   - Restart Railway
   - See "🔄 Restoring session from Supabase..."
   - See "✅ WhatsApp connected" (NO QR scan!)

3. **Periodic Backup:**
   - Backup logs appear every ~5 minutes
   - `lastBackupAt` updates in database

4. **Disconnect:**
   - Click disconnect
   - See "🔄 Force backup..."
   - See "🗑️ Session deleted"
   - Files removed from Supabase Storage

---

## 📚 Additional Resources

- [Baileys Documentation](https://whiskeysockets.github.io/)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Railway Deployment Guide](https://docs.railway.app/)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

## 🤝 Contributing

Found an issue or have improvements? Submit a PR!

---

**END OF HYBRID SESSION BACKUP IMPLEMENTATION GUIDE**

Version: 1.0.0  
Last Updated: January 29, 2026  
Maintainer: Fibidy Development Team  

---

**⚡ Quick Start:**

```bash
# 1. Add column to DB
npx prisma migrate dev --name add_session_backup_tracking

# 2. Create Supabase bucket
# (via dashboard or SQL)

# 3. Add env vars
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_BUCKET=whatsapp-sessions

# 4. Deploy!
git push origin main
```

**🎉 Done! Your sessions are now safe from restarts!**

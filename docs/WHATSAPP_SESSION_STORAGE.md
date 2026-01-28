# WhatsApp Session Storage with Supabase

> **Production-Ready Solution**: Store WhatsApp session files securely in Supabase Storage instead of local filesystem

---

## 📋 Table of Contents

1. [Why Supabase Storage?](#why-supabase-storage)
2. [Architecture Overview](#architecture-overview)
3. [Setup Guide](#setup-guide)
4. [Implementation](#implementation)
5. [Migration from Local](#migration-from-local)
6. [Security Best Practices](#security-best-practices)
7. [Backup & Recovery](#backup--recovery)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Why Supabase Storage?

### ❌ Problems with Local Filesystem

```
server/whatsapp-sessions/
├── tenant-1/creds.json        ❌ Lost on server restart
├── tenant-1/*.json            ❌ Not backed up
├── tenant-2/creds.json        ❌ Cannot scale horizontally
└── ...                        ❌ Security risk if committed to git
```

**Issues**:
- 🔴 Data loss on server redeploy/crash
- 🔴 Cannot scale to multiple servers (stateful)
- 🔴 Manual backup required
- 🔴 Security risk (credentials on filesystem)
- 🔴 830+ files per tenant (memory leak from old code)

---

### ✅ Benefits of Supabase Storage

```
Supabase Storage (S3-Compatible)
├── Encrypted at rest            ✅
├── Automatic backup             ✅
├── CDN + Fast access            ✅
├── Multi-region support         ✅
├── Access control (RLS)         ✅
└── Free tier: 1GB               ✅
```

**Advantages**:
- ✅ **Already using Supabase** (Database + Auth) - No new service
- ✅ **Stateless backend** - Can scale horizontally
- ✅ **Built-in encryption** - AES-256 at rest
- ✅ **API-first** - Simple SDK (like S3)
- ✅ **Cost-effective** - Free 1GB, then $0.021/GB/month
- ✅ **Zero downtime** - Sessions persist across deployments

---

## 🏗️ Architecture Overview

### Current (Local Filesystem)
```
┌─────────────────────────────────┐
│   NestJS Backend (Stateful)     │
│                                 │
│   ├─ WhatsApp Service           │
│   └─ /whatsapp-sessions/        │  ❌ Files stored locally
│       ├─ tenant-1/              │
│       └─ tenant-2/              │
└─────────────────────────────────┘
```

### New (Supabase Storage)
```
┌─────────────────────────────────┐
│   NestJS Backend (Stateless)    │
│                                 │
│   ├─ WhatsApp Service           │
│   └─ Supabase Storage Client    │
└─────────────────────────────────┘
                ↓
┌─────────────────────────────────┐
│      Supabase Storage           │
│   Bucket: whatsapp-sessions     │
│                                 │
│   ├─ tenant-1/                  │
│   │   ├─ creds.json             │
│   │   └─ app-state-*.json       │
│   └─ tenant-2/                  │
│       ├─ creds.json             │
│       └─ app-state-*.json       │
└─────────────────────────────────┘
```

---

## 🚀 Setup Guide

### Step 1: Create Supabase Storage Bucket

Go to your Supabase Dashboard: https://app.supabase.com

1. **Navigate to Storage**
   - Click "Storage" in left sidebar
   - Click "Create a new bucket"

2. **Create Bucket**
   ```
   Bucket name: whatsapp-sessions
   Public bucket: NO (keep private) ❗
   File size limit: 50MB
   Allowed MIME types: application/json
   ```

3. **Set Bucket Policies**
   - Go to "Policies" tab
   - Create policy for authenticated access only

---

### Step 2: Install Supabase Client

```bash
cd server
npm install @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

---

### Step 3: Environment Variables

Add to `.env`:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key  # ⚠️ Use service role (not anon key)

# Session Storage
SESSION_STORAGE_TYPE=supabase  # Options: local, supabase
```

**⚠️ Important**: Use **Service Role Key**, not Anon Key!
- Service Role Key: Bypass RLS, full access
- Find in: Supabase Dashboard → Settings → API → `service_role` key

---

## 💻 Implementation

### Step 4: Create Supabase Storage Service

Create new file: `server/src/common/storage/supabase-storage.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as path from 'path';

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private supabase: SupabaseClient;
  private readonly bucketName = 'whatsapp-sessions';

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be configured');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase Storage initialized');
  }

  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(
    tenantId: string,
    fileName: string,
    fileContent: string | Buffer,
  ): Promise<void> {
    const filePath = `${tenantId}/${fileName}`;

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, fileContent, {
        contentType: 'application/json',
        upsert: true, // Overwrite if exists
      });

    if (error) {
      this.logger.error(`Failed to upload ${filePath}: ${error.message}`);
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    this.logger.log(`Uploaded: ${filePath}`);
  }

  /**
   * Download file from Supabase Storage
   */
  async downloadFile(tenantId: string, fileName: string): Promise<string | null> {
    const filePath = `${tenantId}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .download(filePath);

    if (error) {
      if (error.message.includes('Object not found')) {
        return null; // File doesn't exist (first connection)
      }
      this.logger.error(`Failed to download ${filePath}: ${error.message}`);
      throw new Error(`Storage download failed: ${error.message}`);
    }

    return await data.text();
  }

  /**
   * List all files for a tenant
   */
  async listFiles(tenantId: string): Promise<string[]> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .list(tenantId);

    if (error) {
      this.logger.error(`Failed to list files for ${tenantId}: ${error.message}`);
      return [];
    }

    return data.map((file) => file.name);
  }

  /**
   * Delete all files for a tenant
   */
  async deleteAllFiles(tenantId: string): Promise<void> {
    const files = await this.listFiles(tenantId);

    if (files.length === 0) {
      this.logger.log(`No files to delete for tenant: ${tenantId}`);
      return;
    }

    const filePaths = files.map((file) => `${tenantId}/${file}`);

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove(filePaths);

    if (error) {
      this.logger.error(`Failed to delete files for ${tenantId}: ${error.message}`);
      throw new Error(`Storage deletion failed: ${error.message}`);
    }

    this.logger.log(`Deleted ${files.length} files for tenant: ${tenantId}`);
  }

  /**
   * Check if file exists
   */
  async fileExists(tenantId: string, fileName: string): Promise<boolean> {
    const filePath = `${tenantId}/${fileName}`;

    const { data } = await this.supabase.storage
      .from(this.bucketName)
      .list(tenantId, {
        search: fileName,
      });

    return data && data.length > 0;
  }
}
```

---

### Step 5: Register Service in Module

Update `server/src/common/common.module.ts`:

```typescript
import { Module, Global } from '@nestjs/common';
import { SupabaseStorageService } from './storage/supabase-storage.service';

@Global()
@Module({
  providers: [SupabaseStorageService],
  exports: [SupabaseStorageService],
})
export class CommonModule {}
```

Register in `app.module.ts`:

```typescript
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // ... other imports
    CommonModule,
  ],
})
export class AppModule {}
```

---

### Step 6: Modify WhatsApp Service

Update `server/src/whatsapp/whatsapp.service.ts`:

```typescript
import { SupabaseStorageService } from '../common/storage/supabase-storage.service';

export class WhatsAppService implements OnModuleDestroy {
  constructor(
    private prisma: PrismaService,
    private readonly gateway: WhatsAppGateway,
    private readonly supabaseStorage: SupabaseStorageService, // ADD THIS
  ) {}

  /**
   * Custom auth state handler using Supabase Storage
   */
  private async useSupabaseAuthState(tenantId: string) {
    // Load credentials from Supabase
    const loadCredentials = async () => {
      const credsJson = await this.supabaseStorage.downloadFile(tenantId, 'creds.json');
      return credsJson ? JSON.parse(credsJson) : {};
    };

    // Save credentials to Supabase
    const saveCredentials = async (creds: any) => {
      await this.supabaseStorage.uploadFile(
        tenantId,
        'creds.json',
        JSON.stringify(creds, null, 2),
      );
    };

    // Load state on init
    const state = await loadCredentials();

    return {
      state: {
        creds: state.creds || {},
        keys: state.keys || {},
      },
      saveCreds: async () => {
        const currentState = await loadCredentials();
        await saveCredentials(currentState);
      },
    };
  }

  /**
   * Initialize WhatsApp connection with Supabase storage
   */
  private async initializeConnection(tenantId: string): Promise<void> {
    // ... existing cleanup code ...

    // Use Supabase storage instead of local filesystem
    const { state, saveCreds } = await this.useSupabaseAuthState(tenantId);

    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: this.createLogger(),
    });

    // ... rest of connection logic ...
  }

  /**
   * Disconnect WhatsApp - clear Supabase storage
   */
  async disconnectWhatsApp(tenantId: string): Promise<{ success: boolean }> {
    try {
      // ... existing disconnect logic ...

      // Clear files from Supabase Storage
      await this.supabaseStorage.deleteAllFiles(tenantId);

      this.logger.log(`WhatsApp session cleared from Supabase for tenant: ${tenantId}`);

      return { success: true };
    } catch (error) {
      // ... error handling ...
    }
  }
}
```

---

## 🔄 Migration from Local

### Option 1: Clean Migration (Recommended)

**Disconnect all existing sessions** and let users reconnect:

```bash
# 1. Backup existing sessions (optional)
cp -r server/whatsapp-sessions server/whatsapp-sessions.backup

# 2. Stop server
# (Ctrl+C in terminal)

# 3. Clear local sessions
rm -rf server/whatsapp-sessions/*

# 4. Update .env with Supabase credentials
# SUPABASE_URL=...
# SUPABASE_SERVICE_KEY=...

# 5. Restart server
pnpm dev

# 6. Users reconnect via /dashboard/settings/whatsapp
```

---

### Option 2: Migrate Existing Sessions

Create migration script: `server/scripts/migrate-sessions-to-supabase.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

async function migrate() {
  const sessions = await prisma.whatsAppSession.findMany({
    where: { status: 'CONNECTED' },
  });

  console.log(`Found ${sessions.length} connected sessions to migrate`);

  for (const session of sessions) {
    const localPath = path.join(__dirname, '../whatsapp-sessions', session.tenantId);

    if (!fs.existsSync(localPath)) {
      console.log(`⚠️  No local files for ${session.tenantId}`);
      continue;
    }

    const files = fs.readdirSync(localPath);
    console.log(`📤 Uploading ${files.length} files for ${session.tenantId}...`);

    for (const file of files) {
      const filePath = path.join(localPath, file);
      const content = fs.readFileSync(filePath);

      const { error } = await supabase.storage
        .from('whatsapp-sessions')
        .upload(`${session.tenantId}/${file}`, content, { upsert: true });

      if (error) {
        console.error(`❌ Failed to upload ${file}: ${error.message}`);
      } else {
        console.log(`✅ Uploaded ${file}`);
      }
    }
  }

  console.log('✅ Migration complete!');
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run migration:

```bash
npx ts-node server/scripts/migrate-sessions-to-supabase.ts
```

---

## 🔒 Security Best Practices

### 1. Bucket Policies (RLS)

Set up Row Level Security in Supabase:

```sql
-- Only allow access to own tenant's files
CREATE POLICY "Tenants can only access own files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'whatsapp-sessions'
  AND (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);
```

### 2. Encryption at Rest

✅ **Supabase automatically encrypts** all storage with AES-256

No additional config needed!

### 3. Service Role Key Security

⚠️ **NEVER commit** `SUPABASE_SERVICE_KEY` to git!

```bash
# .env (gitignored)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# .env.example (committed)
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

### 4. File Size Limits

Set bucket limits to prevent abuse:

```typescript
// In bucket settings
{
  "fileSizeLimit": 52428800, // 50MB max per file
  "allowedMimeTypes": ["application/json"]
}
```

---

## 💾 Backup & Recovery

### Automatic Backups

Supabase Storage includes **automatic backups** (depends on plan):
- **Free**: Daily snapshots (7 days retention)
- **Pro**: Hourly snapshots (30 days retention)

### Manual Backup Script

Create `server/scripts/backup-sessions.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

async function backup() {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupDir = path.join(__dirname, `../backups/sessions-${timestamp}`);

  fs.mkdirSync(backupDir, { recursive: true });

  // List all files in bucket
  const { data: folders } = await supabase.storage
    .from('whatsapp-sessions')
    .list();

  for (const folder of folders || []) {
    const tenantId = folder.name;
    const { data: files } = await supabase.storage
      .from('whatsapp-sessions')
      .list(tenantId);

    const tenantDir = path.join(backupDir, tenantId);
    fs.mkdirSync(tenantDir, { recursive: true });

    for (const file of files || []) {
      const { data } = await supabase.storage
        .from('whatsapp-sessions')
        .download(`${tenantId}/${file.name}`);

      if (data) {
        const content = await data.text();
        fs.writeFileSync(path.join(tenantDir, file.name), content);
        console.log(`✅ Backed up ${tenantId}/${file.name}`);
      }
    }
  }

  console.log(`✅ Backup complete: ${backupDir}`);
}

backup().catch(console.error);
```

Run daily via cron:

```bash
# Add to crontab
0 2 * * * cd /path/to/app && npx ts-node server/scripts/backup-sessions.ts
```

---

## 🐛 Troubleshooting

### Issue 1: "Failed to upload: 413 Payload Too Large"

**Cause**: File exceeds bucket size limit (50MB default)

**Fix**: Increase bucket limit in Supabase Dashboard or implement file compression:

```typescript
import * as zlib from 'zlib';

// Compress before upload
const compressed = zlib.gzipSync(Buffer.from(content));
await supabaseStorage.uploadFile(tenantId, fileName, compressed);
```

---

### Issue 2: "Object not found" on first connection

**Cause**: Normal - no session exists yet for new tenant

**Fix**: Already handled in code (returns `null` for missing files)

---

### Issue 3: Rate limiting errors

**Cause**: Too many API calls to Supabase Storage

**Fix**: Implement local cache with Redis:

```typescript
// Cache in Redis (5min TTL)
const cached = await redis.get(`session:${tenantId}:creds`);
if (cached) return JSON.parse(cached);

// If not cached, fetch from Supabase
const data = await supabaseStorage.downloadFile(tenantId, 'creds.json');
await redis.setex(`session:${tenantId}:creds`, 300, data);
```

---

### Issue 4: CORS errors in browser

**Cause**: Not applicable - Supabase Storage accessed from **backend only**

Sessions are **never** downloaded by frontend for security.

---

## 📊 Monitoring

### Check Storage Usage

```typescript
// Get storage usage stats
const { data } = await supabase.rpc('get_storage_size', {
  bucket_name: 'whatsapp-sessions',
});

console.log(`Total size: ${data / 1024 / 1024} MB`);
```

### Log Storage Operations

Already implemented in `SupabaseStorageService` with Winston logger:

```typescript
this.logger.log(`Uploaded: ${filePath}`);
this.logger.error(`Failed to download ${filePath}`);
```

---

## ✅ Migration Checklist

- [ ] Create `whatsapp-sessions` bucket in Supabase
- [ ] Set bucket to **private** (not public)
- [ ] Add `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` to `.env`
- [ ] Install `@supabase/supabase-js` package
- [ ] Create `SupabaseStorageService`
- [ ] Register service in `CommonModule`
- [ ] Update `WhatsAppService` to use Supabase storage
- [ ] Test connection flow (QR code → scan → connect)
- [ ] Verify files are uploaded to Supabase Storage
- [ ] Test disconnect flow (files deleted from Supabase)
- [ ] Update `.gitignore` to exclude `whatsapp-sessions/`
- [ ] Add `whatsapp-sessions/.gitkeep` for folder structure
- [ ] Set up backup script (optional)
- [ ] Configure monitoring/alerts (optional)

---

## 🚀 Next Steps

1. **Development**: Keep using local filesystem for faster iteration
2. **Staging**: Deploy with Supabase Storage to test
3. **Production**: Enable Supabase Storage + automatic backups

---

## 📚 References

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/storage)
- [Baileys Multi-File Auth](https://github.com/WhiskeySockets/Baileys#saving-sending-messages)

---

**Last Updated**: January 2026
**Status**: ✅ Production Ready

# 🔧 Supabase Storage Setup for WhatsApp Session Backup

## 📝 Overview

Hybrid backup system untuk WhatsApp sessions menggunakan:

- **Primary Storage**: Local disk (`/whatsapp-sessions`) → Fast ⚡
- **Backup Storage**: Supabase Storage → Persistent ☁️

Fitur ini **CRITICAL** untuk deployment di platform dengan **ephemeral
filesystem** seperti:

- ✅ Railway
- ✅ Vercel
- ✅ Heroku
- ✅ Google Cloud Run
- ✅ AWS Lambda

---

## 🎯 Mengapa Penting?

### Tanpa Backup:

- ❌ Session hilang setiap kali server restart
- ❌ User harus scan QR code berulang kali
- ❌ Pengalaman user buruk
- ❌ WhatsApp bisa ban akun karena login terlalu sering

### Dengan Hybrid Backup:

- ✅ Session bertahan meski server restart
- ✅ Auto-restore dari Supabase saat startup
- ✅ Backup otomatis setiap 5 menit
- ✅ User scan QR code hanya sekali
- ✅ Production-ready untuk ephemeral platforms

---

## 🚀 Setup Guide

### Step 1: Buat Storage Bucket di Supabase

1. **Login ke Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Pilih project kamu

2. **Create Storage Bucket**
   - Navigate: **Storage** → **Create a new bucket**
   - Bucket name: `whatsapp-sessions`
   - Public bucket: **OFF** (PENTING! Harus private)
   - Click **Create bucket**

3. **Configure Bucket Policies** (OPSIONAL)
   - Bucket sudah aman by default (requires service key)
   - Tidak perlu public access
   - Service role key sudah punya full access

---

### Step 2: Get Supabase Credentials

1. **Get Supabase URL**
   - Dashboard → **Settings** → **API**
   - Copy **Project URL**
   - Example: `https://abcdefgh.supabase.co`

2. **Get Service Role Key** (PENTING!)
   - Dashboard → **Settings** → **API**
   - Copy **service_role** key (BUKAN anon key!)
   - ⚠️ **JANGAN share key ini!** Server-side only!

---

### Step 3: Configure Environment Variables

Tambahkan ke file `.env` di folder `server/`:

```bash
# WhatsApp Session Backup (Supabase Storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYxNjc5MjAwMCwiZXhwIjoxOTMyMzY4MDAwfQ.xxx
SUPABASE_BUCKET=whatsapp-sessions
```

**Ganti dengan credentials kamu!**

---

### Step 4: Apply Database Migration

Migration untuk tambah kolom `lastBackupAt`:

```bash
cd server

# Apply migration
pnpm prisma migrate deploy

# Or if using dev environment
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma migrate dev
```

Migration file sudah dibuat di:

```
server/prisma/migrations/20260129_add_lastBackupAt_to_whatsapp_session/migration.sql
```

---

### Step 5: Test Setup

1. **Start Server**

   ```bash
   cd server
   pnpm start:dev
   ```

2. **Check Logs**
   - Lihat log startup:

   ```
   ✅ Supabase Storage initialized for session backups
   📁 Created sessions directory: /app/whatsapp-sessions
   ```

3. **Connect WhatsApp**
   - Login ke dashboard
   - Go to `/dashboard/settings/whatsapp`
   - Click **Hubungkan WhatsApp**
   - Scan QR code

4. **Verify Backup**
   - Tunggu 5 menit (auto backup)
   - Check Supabase Storage:
     - Dashboard → **Storage** → `whatsapp-sessions`
     - Seharusnya ada folder `<tenantId>/`
     - Isi: `creds.json` + folder `keys/`

5. **Test Restore**
   - Restart server
   - Session seharusnya tetap connected (tidak perlu scan QR lagi!)

---

## 📁 File Structure di Supabase

```
whatsapp-sessions/
├── tenant-id-1/
│   ├── creds.json              # WhatsApp credentials
│   └── keys/
│       ├── app-state-sync-key-xxx.json
│       ├── app-state-sync-version-xxx.json
│       └── sender-key-xxx.json
├── tenant-id-2/
│   ├── creds.json
│   └── keys/
│       └── ...
```

---

## 🔄 Backup Flow

### Auto-Backup (Periodic)

```
Every 5 minutes:
  ↓
Check if session exists
  ↓
Upload creds.json to Supabase
  ↓
Upload all files in keys/ folder
  ↓
Update lastBackupAt timestamp
  ↓
Log: "☁️ Session backed up to Supabase for tenant: xxx"
```

### Manual Backup (Triggered)

```
User scans QR code
  ↓
Credentials saved (creds.update event)
  ↓
Auto-trigger backup to Supabase
  ↓
Start periodic backup (every 5 minutes)
```

### Auto-Restore (On Startup)

```
Server starts
  ↓
WhatsAppService initializes connection
  ↓
HybridAuthStateService.initialize(tenantId)
  ↓
Check local session exists?
  ├─ YES → Use local session
  └─ NO → Download from Supabase
      ↓
      Restore creds.json
      ↓
      Restore keys/ folder
      ↓
      Log: "✅ Session restored from Supabase"
```

---

## 🛠️ Implementation Details

### HybridAuthStateService Features

**1. Initialize**

```typescript
await hybridAuthState.initialize(tenantId);
// - Checks local session
// - Auto-restores from Supabase if not found
// - Starts periodic backup
```

**2. Backup**

```typescript
await hybridAuthState.backupToSupabase(tenantId);
// - Uploads creds.json
// - Uploads all keys
// - Updates lastBackupAt timestamp
```

**3. Restore**

```typescript
await hybridAuthState.restoreFromSupabase(tenantId);
// - Downloads creds.json
// - Downloads all keys
// - Returns true if successful
```

**4. Delete**

```typescript
await hybridAuthState.deleteSession(tenantId);
// - Stops periodic backup
// - Deletes local session
// - Deletes Supabase backup
```

---

## ⚙️ Configuration

### Environment Variables

| Variable               | Description          | Required | Default             |
| ---------------------- | -------------------- | -------- | ------------------- |
| `SUPABASE_URL`         | Supabase project URL | ✅ Yes   | -                   |
| `SUPABASE_SERVICE_KEY` | Service role key     | ✅ Yes   | -                   |
| `SUPABASE_BUCKET`      | Storage bucket name  | ⚪ No    | `whatsapp-sessions` |

### Backup Settings (Code)

Di `hybrid-auth-state.service.ts`:

```typescript
// Backup interval (default: 5 minutes)
private readonly backupIntervalMs = 5 * 60 * 1000;

// Sessions directory
private readonly sessionsDir = path.join(process.cwd(), 'whatsapp-sessions');
```

**Customize:**

- Ubah `backupIntervalMs` untuk interval berbeda
- Ubah `sessionsDir` untuk path berbeda

---

## 🧪 Testing

### Manual Test: Backup

```bash
# 1. Connect WhatsApp via dashboard
# 2. Wait 5 minutes
# 3. Check Supabase Storage:

# Via Dashboard:
Supabase Dashboard → Storage → whatsapp-sessions → <tenantId>

# Via API (optional):
curl https://<project>.supabase.co/storage/v1/object/list/whatsapp-sessions/<tenantId> \
  -H "Authorization: Bearer <service_role_key>"
```

### Manual Test: Restore

```bash
# 1. Delete local session
rm -rf server/whatsapp-sessions/<tenantId>

# 2. Restart server
pnpm start:dev

# 3. Check logs:
# Should see: "🔄 Local session not found, attempting restore from Supabase..."
# Then: "✅ Session restored from Supabase for tenant: xxx"

# 4. Check WhatsApp status
# Should be CONNECTED (no QR scan needed!)
```

### Manual Test: Delete

```bash
# 1. Disconnect WhatsApp via dashboard
# 2. Check logs:
# Should see: "🗑️ Deleted local session for xxx"
# And: "☁️ Deleted Supabase backup for xxx"

# 3. Verify Supabase Storage:
# Folder <tenantId> should be deleted
```

---

## 🚨 Troubleshooting

### Issue: "Supabase credentials not found"

**Cause:** Environment variables tidak diset

**Solution:**

```bash
# Check .env file
cat server/.env | grep SUPABASE

# Should output:
# SUPABASE_URL=https://...
# SUPABASE_SERVICE_KEY=eyJ...
# SUPABASE_BUCKET=whatsapp-sessions
```

---

### Issue: "Failed to upload creds.json: 404 Not Found"

**Cause:** Bucket tidak ada atau nama salah

**Solution:**

1. Check bucket name di Supabase Dashboard
2. Pastikan bucket `whatsapp-sessions` sudah dibuat
3. Pastikan `SUPABASE_BUCKET` di .env match dengan nama bucket

---

### Issue: "Failed to upload: 403 Forbidden"

**Cause:** Service key salah atau tidak punya akses

**Solution:**

1. Pastikan menggunakan **service_role** key (BUKAN anon key!)
2. Copy ulang dari Dashboard → Settings → API
3. Restart server setelah update .env

---

### Issue: Session tidak auto-restore

**Cause:** Backup belum jalan atau file tidak ada

**Debug:**

```bash
# 1. Check logs saat connect WhatsApp
# Seharusnya ada: "☁️ Session backed up to Supabase"

# 2. Check Supabase Storage
# Pastikan ada creds.json dan keys/

# 3. Check database
# Query:
SELECT "tenantId", "lastBackupAt" FROM "WhatsAppSession";
# lastBackupAt should NOT be null
```

---

## 📊 Monitoring

### Database Query: Check Backup Status

```sql
SELECT
  "tenantId",
  "status",
  "phoneNumber",
  "lastConnectedAt",
  "lastBackupAt",
  EXTRACT(EPOCH FROM (NOW() - "lastBackupAt")) / 60 AS "minutes_since_backup"
FROM "WhatsAppSession"
WHERE "status" = 'CONNECTED';
```

### Expected Output:

```
tenantId | status    | phoneNumber  | lastBackupAt        | minutes_since_backup
---------|-----------|--------------|---------------------|---------------------
abc123   | CONNECTED | 628123456789 | 2026-01-29 10:45:00 | 3.5
```

---

## 🎯 Best Practices

### 1. Security

- ✅ JANGAN commit `.env` file
- ✅ JANGAN share `SUPABASE_SERVICE_KEY`
- ✅ Gunakan bucket **PRIVATE** (bukan public)
- ✅ Rotate service key secara berkala (optional)

### 2. Performance

- ✅ Backup interval 5 menit sudah optimal
- ✅ Jangan set terlalu cepat (<1 menit) → waste bandwidth
- ✅ Jangan set terlalu lama (>15 menit) → risk data loss

### 3. Reliability

- ✅ Monitor `lastBackupAt` timestamp
- ✅ Alert jika backup failed
- ✅ Test restore secara berkala
- ✅ Keep local session sebagai primary (faster)

### 4. Cost Optimization

- ✅ Supabase Free Tier: 1 GB storage (enough for ~1000 sessions)
- ✅ Each session: ~50-500 KB
- ✅ Cleanup old/unused sessions
- ✅ Monitor storage usage di Supabase Dashboard

---

## 📚 Related Files

### Backend

```
server/
├── src/whatsapp/
│   ├── hybrid-auth-state.service.ts     # ⭐ Main implementation
│   ├── whatsapp.service.ts              # Uses HybridAuthStateService
│   └── whatsapp.module.ts               # Registers the service
├── prisma/
│   ├── schema.prisma                    # Added lastBackupAt column
│   └── migrations/
│       └── 20260129_add_lastBackupAt... # Migration file
└── .env.example                          # Environment template
```

### Documentation

```
docs/chat/
├── HYBRID-SESSION-BACKUP-IMPLEMENTATION.md  # Full implementation guide
├── SUPABASE_STORAGE_SETUP.md                # This file
├── BACKEND_IMPLEMENTATION.md                # Backend architecture
└── API_REFERENCE.md                         # API endpoints
```

---

## ✅ Checklist

Before deployment:

- [ ] Supabase bucket `whatsapp-sessions` created
- [ ] Environment variables set in `.env`
- [ ] Database migration applied
- [ ] Test backup: Connect WhatsApp → Wait 5 min → Check Supabase
- [ ] Test restore: Delete local → Restart → Should auto-connect
- [ ] Test delete: Disconnect → Check Supabase folder deleted
- [ ] Monitor logs: No errors in backup/restore
- [ ] Set up alerts for backup failures (optional)

---

## 🎉 Success!

Setelah setup selesai, sistem kamu sekarang:

✅ **Production-ready** untuk ephemeral platforms ✅ **Auto-backup** setiap 5
menit ✅ **Auto-restore** saat server restart ✅ **Zero downtime** WhatsApp
sessions ✅ **User-friendly** - scan QR hanya sekali

---

**Need Help?**

- 📖 Read: `HYBRID-SESSION-BACKUP-IMPLEMENTATION.md`
- 🐛 Issues: Check Troubleshooting section above
- 💬 Questions: Contact your dev team

---

**Version:** 1.0.0 **Last Updated:** 2026-01-29 **Status:** ✅ Production Ready

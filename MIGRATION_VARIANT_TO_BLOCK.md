# Migration Guide: Variant → Block

**Date:** 2026-01-18
**Purpose:** Rename all `"variant"` keys to `"block"` in `landingConfig` JSONB data

---

## ⚠️ IMPORTANT - READ BEFORE RUNNING

This migration will **permanently change** your database data:
- All `"variant"` keys → `"block"` keys in `landingConfig` JSONB
- **Automatic backup** created before migration
- **Rollback script** available if needed

---

## 📋 Prerequisites

1. **Stop the application** (recommended)
   ```bash
   # Stop backend server
   cd server
   pm2 stop all  # or however you run your server
   ```

2. **Database access** - Ensure PostgreSQL is running

3. **Backup database** (optional but recommended)
   ```bash
   pg_dump -U postgres -d umkm_db > backup_before_migration.sql
   ```

---

## 🚀 Running the Migration

### Step 1: Navigate to server directory
```bash
cd /home/user/APP-UMKM/server
```

### Step 2: Run migration
```bash
npm run migrate:variant-to-block migrate
```

### Expected Output:
```
🚀 Starting variant → block migration...

📊 Fetching tenants with landing config...
   Found 5 tenants with landing config

💾 Creating backup...
   Backup saved to: /home/user/APP-UMKM/server/backups/variant-to-block-backup-2026-01-18T10-30-00-000Z.json

📋 Migration Summary:
   Tenants to migrate: 5
   Sections to migrate: 18
   Tenants: tenant1, tenant2, tenant3, ...

🔄 Migrating configs...
   ✅ Migrated: tenant1
   ✅ Migrated: tenant2
   ✅ Migrated: tenant3
   ...

✅ Migration complete!
   5 tenants migrated
   18 sections updated

💡 Backup location: /home/user/APP-UMKM/server/backups/variant-to-block-backup-2026-01-18T10-30-00-000Z.json

🎉 Done!
```

---

## 🔄 What Gets Changed?

### Before Migration:
```json
{
  "landingConfig": {
    "enabled": true,
    "hero": {
      "enabled": true,
      "title": "Welcome to My Store",
      "variant": "gradient-overlay",  ⬅️ OLD KEY
      "config": {
        "layout": "centered"
      }
    },
    "about": {
      "enabled": true,
      "title": "About Us",
      "variant": "side-by-side",  ⬅️ OLD KEY
      "config": {}
    }
  }
}
```

### After Migration:
```json
{
  "landingConfig": {
    "enabled": true,
    "hero": {
      "enabled": true,
      "title": "Welcome to My Store",
      "block": "gradient-overlay",  ✅ NEW KEY
      "config": {
        "layout": "centered"
      }
    },
    "about": {
      "enabled": true,
      "title": "About Us",
      "block": "side-by-side",  ✅ NEW KEY
      "config": {}
    }
  }
}
```

---

## 🔙 Rollback (If Needed)

If something goes wrong, you can rollback using the auto-generated backup:

### Step 1: Find your backup file
```bash
ls -lah /home/user/APP-UMKM/server/backups/
```

Look for: `variant-to-block-backup-YYYY-MM-DDTHH-MM-SS-SSSZ.json`

### Step 2: Run rollback
```bash
npm run migrate:variant-to-block rollback /home/user/APP-UMKM/server/backups/variant-to-block-backup-2026-01-18T10-30-00-000Z.json
```

### Expected Output:
```
🔙 Starting rollback...

📂 Reading backup: /home/user/APP-UMKM/server/backups/variant-to-block-backup-2026-01-18T10-30-00-000Z.json
   Found 5 tenants in backup

🔄 Restoring data...
   ✅ Restored: tenant1
   ✅ Restored: tenant2
   ...

✅ Rollback complete! 5 tenants restored.

🎉 Done!
```

---

## ✅ Post-Migration Verification

### 1. Check database
```bash
# Using psql
psql -U postgres -d umkm_db

# Run query
SELECT slug, landingConfig->'hero'->'block' as hero_block
FROM "Tenant"
WHERE landingConfig IS NOT NULL
LIMIT 5;
```

**Expected:** You should see block values, not NULL

### 2. Start application and test
```bash
cd /home/user/APP-UMKM/server
npm run start:dev
```

### 3. Test landing builder
- Go to `/landing-builder`
- Click a section (e.g., Hero)
- Click a block style
- Verify it saves correctly

---

## 🛡️ Safety Features

1. **Auto-backup**: Creates JSON backup before any changes
2. **Idempotent**: Safe to run multiple times (won't break if run twice)
3. **Dry-run summary**: Shows what will be changed before changing it
4. **Rollback ready**: Can restore from backup anytime
5. **No data loss**: Only renames keys, preserves all values

---

## 📊 Migration Impact

| Aspect | Impact |
|--------|--------|
| **Database Schema** | ✅ No changes (JSONB column stays same) |
| **Data Structure** | ⚠️ Keys renamed: `variant` → `block` |
| **Application Code** | ✅ Already updated (previous commit) |
| **API Endpoints** | ✅ Compatible (DTOs updated) |
| **Downtime Required** | ⚠️ Recommended (~5 min for migration) |

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```bash
cd /home/user/APP-UMKM/server
npm install
npx prisma generate
```

### Issue: "ts-node: command not found"
**Solution:**
```bash
npm install -D ts-node typescript
```

### Issue: Migration fails midway
**Solution:**
1. Note the error message
2. Run rollback (see section above)
3. Fix the issue
4. Try migration again

---

## 📝 Notes

- **Timing**: Best run during low-traffic hours
- **Duration**: ~1-5 seconds per 100 records
- **Reversible**: Yes (via rollback)
- **Testing**: Recommended to test on staging first

---

## 🎯 Summary Checklist

- [ ] Read this entire guide
- [ ] Backup database (optional but recommended)
- [ ] Stop application
- [ ] Run migration: `npm run migrate:variant-to-block migrate`
- [ ] Verify backup was created
- [ ] Check migration output (no errors)
- [ ] Verify database changes
- [ ] Start application
- [ ] Test landing builder
- [ ] Monitor for issues
- [ ] Keep backup for 7 days

---

**Questions?** Check the migration script source code:
`/home/user/APP-UMKM/server/src/migrations/variant-to-block.migration.ts`

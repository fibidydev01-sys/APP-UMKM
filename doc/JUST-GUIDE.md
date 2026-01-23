# 🚀 MIGRATION GUIDE - Docker ke Local Development
## UMKM Multi-Tenant Backend - Simplified Edition

---

## 🎯 GOAL

- ❌ **Remove Docker Desktop** → Free 2.4 GB RAM!
- ✅ **Setup Local Development** → Faster, lighter workflow
- 🐳 **Keep Docker option** → For production testing only
- 🧹 **Clean commands** → Only what you actually use

---

## 📋 LANGKAH-LANGKAH

### 1️⃣ BACKUP & SHUTDOWN DOCKER

```powershell
# Stop semua container
docker compose down

# Shutdown WSL2
wsl --shutdown

# Tunggu vmmem hilang dari Task Manager (Details tab)
```

---

### 2️⃣ UNINSTALL DOCKER DESKTOP

**Method 1: Via Settings**
```
Win + I → Apps → Installed Apps → "Docker Desktop" → Uninstall
```

**Method 2: Via Command**
```powershell
# PowerShell as Admin
winget uninstall Docker.DockerDesktop
```

**Setelah uninstall, RESTART komputer!**

---

### 3️⃣ UNINSTALL APLIKASI LAIN (OPSIONAL)

```powershell
# VirtualBox (kalau ada)
winget uninstall Oracle.VirtualBox

# Epic Games Launcher (kalau jarang main game)
winget uninstall EpicGames.EpicGamesLauncher

# Google Play Games (kalau ada)
# Settings → Apps → Google Play Games → Uninstall
```

---

### 4️⃣ INSTALL NODE.JS & PNPM

**Install Node.js:**
```powershell
# Via winget
winget install OpenJS.NodeJS.LTS

# Restart terminal
```

**Install pnpm:**
```powershell
npm install -g pnpm
```

**Verify:**
```powershell
node --version    # Should show: v20.x.x
pnpm --version    # Should show: 8.x.x
```

---

### 5️⃣ SETUP PROJECT

```powershell
# Navigate ke project
cd path\to\your\umkm-project

# Replace Justfile dengan yang baru
# Copy file justfile yang sudah gua bikin!

# Setup .env file
# Isi dengan Supabase credentials
```

---

### 6️⃣ SETUP ENVIRONMENT (.env)

Buat file `.env` di root project:

```env
# ============================================================================
# ENVIRONMENT - LOCAL DEVELOPMENT
# ============================================================================

# Application
NODE_ENV=development
PORT=8000
API_PREFIX=api

# Database (Supabase)
# Get from: https://supabase.com/dashboard → Settings → Database
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

**Cara dapetin Supabase credentials:**
1. Buka https://supabase.com/dashboard
2. Pilih project lu
3. Settings → Database
4. Connection string → URI
5. Copy & paste ke .env
6. Replace `[YOUR-PASSWORD]` dengan password database lu

---

### 7️⃣ RUN QUICKSTART

```powershell
# Quickstart LOCAL (No Docker - Recommended)
just quickstart

# Ini akan:
# ✅ Install dependencies
# ✅ Generate Prisma Client
# ✅ Push schema ke Supabase
# ✅ Seed database
```

---

### 8️⃣ START DEVELOPMENT

```powershell
# Start dev server
just dev

# Server akan jalan di: http://localhost:8000
```

---

## 📚 COMMAND REFERENCE

### 🔥 YANG SERING LU PAKE

```bash
# Development
just dev              # Start local dev server
just start            # Start production build

# Database
just db-studio        # Open database GUI (Prisma Studio)
just db-push          # Push schema changes ke Supabase
just db-seed          # Seed data

# Utilities
just format           # Format code
just lint             # Lint & fix code
just health           # Check API health

# Dependencies
just install          # Install dependencies
just add <package>    # Add package
```

### ☢️ NUCLEAR COMMANDS (PALING PENTING!)

```bash
# Clean node_modules + dist + pnpm-lock.yaml
just nuclear

# Stop Docker + WSL2
just nuclear-docker

# EVERYTHING (Docker + Local)
just nuclear-all
```

### 🐳 DOCKER (Kalau butuh)

```bash
# Quickstart dengan Docker
just quickstart-docker

# Start/Stop Docker
just docker-up
just docker-down      # Otomatis shutdown WSL2!
```

### 🔑 ALIASES (Shortcut)

```bash
just up         →  just dev
just down       →  just docker-down
just studio     →  just db-studio
just nuke       →  just nuclear
just clean      →  just nuclear
just qs         →  just quickstart
just qsd        →  just quickstart-docker
```

---

## 🎯 DAILY WORKFLOW

### Pagi (Start kerja)

```powershell
# 1. Buka project
cd path\to\umkm-project

# 2. Pull changes (kalau pake git)
git pull

# 3. Install dependencies (kalau ada update)
just install

# 4. Start dev
just dev
```

### Sambil coding

```powershell
# Dev server otomatis reload kalau lu save file!
# Tinggal coding aja, gak perlu restart manual

# Kalau mau liat database
just db-studio
```

### Sebelum commit

```powershell
# Format & lint code
just format
just lint

# Commit
git add .
git commit -m "Your message"
git push
```

### Kalau mau test production

```powershell
# Build production
just start

# Atau test pake Docker
just docker-up

# Selesai testing
just docker-down    # Ini otomatis shutdown WSL2!
```

---

## 🆘 TROUBLESHOOTING

### Problem: "pnpm: command not found"

```powershell
npm install -g pnpm
# Restart terminal
```

### Problem: "Can't connect to database"

```powershell
# Check .env file
# Pastikan DATABASE_URL & DIRECT_URL benar

# Test connection
just db-studio
```

### Problem: "Port 8000 already in use"

```powershell
# Find & kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or change port di .env
PORT=8001
```

### Problem: Semuanya error!

```powershell
# NUCLEAR option
just nuclear

# Then reinstall
just install

# Setup database lagi
just db-setup

# Start dev
just dev
```

---

## 📊 EXPECTED RESULTS

### Before (Docker)
```
vmmem:               1.77 GB
crosvm:              637 MB
Docker processes:    ~300 MB
─────────────────────────────
TOTAL:               ~2.7 GB  😱
```

### After (Local)
```
Node.js:             ~300 MB
─────────────────────────────
TOTAL:               ~0.3 GB  🎉

SAVED: 2.4 GB RAM!
```

---

## ✅ CHECKLIST

```
✅ Docker Desktop uninstalled
✅ Node.js & pnpm installed
✅ Justfile replaced
✅ .env configured
✅ Run: just quickstart
✅ Run: just dev
✅ API running on http://localhost:8000
✅ Prisma Studio: just db-studio
```

---

## 🎉 DONE!

### Next Steps

```bash
# 1. Start coding
just dev

# 2. Open database
just db-studio

# 3. Happy coding! 🚀
```

### Kalau ada masalah

```bash
# Nuclear everything & start fresh
just nuclear
just install
just quickstart
just dev
```

---

## 📝 NOTES

- **Development:** Always use `just dev` (local, no Docker)
- **Production testing:** Use `just quickstart-docker` only when needed
- **Database:** Supabase (cloud) - no local database needed
- **Nuclear:** Use `just nuclear` when things get messy

---

**🔥 SEKARANG LU PUNYA 2.4 GB RAM LEBIH BUAT CHROME! 🔥**

**No more Docker eating your RAM! 🚀**

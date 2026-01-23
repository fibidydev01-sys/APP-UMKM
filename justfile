# ============================================================================
# Justfile - UMKM Multi-Tenant Monorepo
# Run: just <command>
# ============================================================================

default:
    @just --list

# ====================
# 🚀 DEVELOPMENT
# ====================

# Start ALL dev servers (client + server)
dev:
    @echo "🚀 Starting all development servers..."
    @echo "📊 API:    http://localhost:8000/api"
    @echo "🖥️  Client: http://localhost:3000"
    @echo ""
    pnpm dev

# Start only server
dev-server:
    @echo "🚀 Starting server..."
    @echo "📊 API: http://localhost:8000/api"
    pnpm dev:server

# Start only client
dev-client:
    @echo "🖥️  Starting client..."
    @echo "🌐 URL: http://localhost:3000"
    pnpm dev:client

# Start client-web (landing builder)
dev-web:
    @echo "🌐 Starting client-web..."
    pnpm dev:client-web

# ====================
# 📦 DEPENDENCIES
# ====================

# Install all dependencies
install:
    @echo "📦 Installing dependencies..."
    pnpm install
    @echo "✅ Done!"

# Clean install (remove node_modules first)
reinstall:
    @echo "🧹 Clean installing..."
    pnpm clean:install
    @echo "✅ Done!"

# ====================
# 🗄️ DATABASE
# ====================

# Generate Prisma Client
db-generate:
    @echo "🔄 Generating Prisma Client..."
    cd server && pnpm exec prisma generate
    @echo "✅ Done!"

# Push schema to database
db-push:
    @echo "🔄 Pushing schema to database..."
    cd server && pnpm exec prisma db push --skip-generate
    @echo "✅ Done!"

# Run migrations
db-migrate:
    @echo "🔄 Running migrations..."
    cd server && pnpm exec prisma migrate deploy
    @echo "✅ Done!"

# Seed database
db-seed:
    @echo "🌱 Seeding database..."
    cd server && pnpm run prisma:seed
    @echo "✅ Done!"

# Open Prisma Studio
db-studio:
    @echo "🎨 Opening Prisma Studio..."
    cd server && pnpm exec prisma studio

# Complete DB setup (generate + push + seed)
db-setup:
    @just db-generate
    @just db-push
    @just db-seed
    @echo "✅ Database ready!"

# ====================
# 🔨 BUILD
# ====================

# Build everything
build:
    @echo "🔨 Building all packages..."
    pnpm build
    @echo "✅ Done!"

# Build server only
build-server:
    @echo "🔨 Building server..."
    pnpm build:server
    @echo "✅ Done!"

# Build client only
build-client:
    @echo "🔨 Building client..."
    pnpm build:client
    @echo "✅ Done!"

# ====================
# 🔧 QUALITY
# ====================

# Lint all packages
lint:
    @echo "🔍 Linting..."
    pnpm lint
    @echo "✅ Done!"

# Lint and fix
lint-fix:
    @echo "🔍 Linting & fixing..."
    pnpm lint:fix
    @echo "✅ Done!"

# Format code
format:
    @echo "✨ Formatting code..."
    pnpm format
    @echo "✅ Done!"

# TypeScript check
typecheck:
    @echo "📝 Type checking..."
    pnpm typecheck
    @echo "✅ Done!"

# Run all checks (format + lint + typecheck)
check:
    @echo "🔍 Running all checks..."
    pnpm check
    @echo "✅ Done!"

# Fix all issues (format + lint:fix)
fix:
    @echo "🔧 Fixing all issues..."
    pnpm check:fix
    @echo "✅ Done!"

# ====================
# 🧪 TESTING
# ====================

# Run all tests
test:
    @echo "🧪 Running tests..."
    pnpm test
    @echo "✅ Done!"

# Run tests with coverage
test-cov:
    @echo "🧪 Running tests with coverage..."
    pnpm test:coverage
    @echo "✅ Done!"

# ====================
# 🏥 HEALTH CHECK
# ====================

# Check API health
health:
    @curl -s http://localhost:8000/api/health | jq '.' 2>/dev/null || curl -s http://localhost:8000/api/health || echo "❌ API not responding"

# ====================
# ☢️ NUCLEAR OPTIONS
# ====================

# Nuclear: Clean EVERYTHING
nuclear:
    @echo "☢️  NUCLEAR: Removing EVERYTHING..."
    @echo "⚠️  This will delete all node_modules, dist, .next, build folders"
    @echo ""
    @echo "Press Ctrl+C in 5 seconds to cancel..."
    @sleep 5
    pnpm clean
    @echo "✅ NUKED! Now run: just install"

# ====================
# 🚀 QUICKSTART
# ====================

# Quickstart - Complete setup from scratch
quickstart:
    @echo "╔════════════════════════════════════════════════════════════╗"
    @echo "║         🚀 UMKM MULTI-TENANT - QUICKSTART                  ║"
    @echo "╚════════════════════════════════════════════════════════════╝"
    @echo ""
    @echo "📋 Setting up environment files..."
    @test -f .env || (test -f .env.example && cp .env.example .env && echo "✅ Created .env")
    @test -f server/.env || (test -f server/.env.example && cp server/.env.example server/.env && echo "✅ Created server/.env")
    @test -f client/.env.local || (echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api\nNEXT_PUBLIC_APP_URL=http://localhost:3000" > client/.env.local && echo "✅ Created client/.env.local")
    @echo ""
    @echo "📦 Installing dependencies..."
    @just install
    @echo ""
    @echo "🗄️  Setting up database..."
    @just db-setup
    @echo ""
    @echo "╔════════════════════════════════════════════════════════════╗"
    @echo "║                    🎉 READY! 🎉                           ║"
    @echo "╚════════════════════════════════════════════════════════════╝"
    @echo ""
    @echo "🚀 Start Development:"
    @echo "   just dev          - Start all servers"
    @echo "   just dev-server   - Server only (port 8000)"
    @echo "   just dev-client   - Client only (port 3000)"
    @echo ""
    @echo "🗄️  Database:"
    @echo "   just db-studio    - Open database GUI"
    @echo ""
    @echo "🔧 Quality:"
    @echo "   just check        - Run all checks"
    @echo "   just fix          - Fix all issues"
    @echo ""
    @echo "📊 URLs:"
    @echo "   API:    http://localhost:8000/api"
    @echo "   Client: http://localhost:3000"
    @echo ""
    @echo "✨ GO! → just dev"

# ====================
# 📚 ALIASES
# ====================

alias up := dev
alias server := dev-server
alias client := dev-client
alias studio := db-studio
alias nuke := nuclear
alias clean := nuclear
alias qs := quickstart

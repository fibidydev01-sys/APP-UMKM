# ============================================================================
# Justfile - UMKM Multi-Tenant Monorepo
# Run: just <command>
# ============================================================================

default:
    @just --list

# ====================
# 🚀 DEVELOPMENT
# ====================

# Start ALL dev servers (client + client-web + catalog + server)
dev:
    @echo "🚀 Starting all development servers..."
    @echo "📊 API:     http://localhost:8000/api"
    @echo "🖥️  Client:  http://localhost:3000"
    @echo "🌐 Web:     http://localhost:3001"
    @echo "📚 Catalog: http://localhost:3002"
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

# Start catalog (public catalog)
dev-catalog:
    @echo "📚 Starting catalog..."
    @echo "🌐 URL: http://localhost:3002"
    pnpm dev:catalog

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

# Build client-web only
build-web:
    @echo "🔨 Building client-web..."
    pnpm build:client-web
    @echo "✅ Done!"

# Build catalog only
build-catalog:
    @echo "🔨 Building catalog..."
    pnpm build:catalog
    @echo "✅ Done!"

# Build shared only
build-shared:
    @echo "🔨 Building shared..."
    cd packages/shared && pnpm build
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

# Nuclear: Clean EVERYTHING and reinstall
nuclear:
    @echo "☢️  NUCLEAR: Removing EVERYTHING..."
    @echo "⚠️  This will delete all node_modules, dist, .next, .turbo, build folders"
    @echo ""
    @echo "Press Ctrl+C in 3 seconds to cancel..."
    @sleep 3
    @echo ""
    @echo "🗑️  Cleaning root..."
    rm -rf node_modules .turbo pnpm-lock.yaml
    @echo "   ✅ Root cleaned"
    @echo ""
    @echo "🗑️  Cleaning client..."
    rm -rf client/node_modules client/.next client/dist client/.turbo
    @echo "   ✅ Client cleaned"
    @echo ""
    @echo "🗑️  Cleaning client-web..."
    rm -rf client-web/node_modules client-web/.next client-web/dist client-web/.turbo
    @echo "   ✅ Client-web cleaned"
    @echo ""
    @echo "🗑️  Cleaning catalog..."
    rm -rf catalog/node_modules catalog/.next catalog/dist catalog/.turbo
    @echo "   ✅ Catalog cleaned"
    @echo ""
    @echo "🗑️  Cleaning server..."
    rm -rf server/node_modules server/dist server/build server/.turbo
    @echo "   ✅ Server cleaned"
    @echo ""
    @echo "🗑️  Cleaning packages/shared..."
    rm -rf packages/shared/node_modules packages/shared/dist packages/shared/.turbo
    @echo "   ✅ Shared cleaned"
    @echo ""
    @echo "✅ NUKED! All 5 workspaces cleaned."
    @echo ""
    @echo "📦 Installing fresh dependencies..."
    pnpm install
    @echo ""
    @echo "✅ REINSTALLED! Ready to go!"

# Clean only (no reinstall)
clean-all:
    @echo "🗑️  Cleaning all workspaces..."
    rm -rf node_modules .turbo pnpm-lock.yaml
    rm -rf client/node_modules client/.next client/dist client/.turbo
    rm -rf client-web/node_modules client-web/.next client-web/dist client-web/.turbo
    rm -rf catalog/node_modules catalog/.next catalog/dist catalog/.turbo
    rm -rf server/node_modules server/dist server/build server/.turbo
    rm -rf packages/shared/node_modules packages/shared/dist packages/shared/.turbo
    @echo "✅ All 5 workspaces cleaned!"

# ====================
# 🚀 QUICKSTART
# ====================

# Quickstart - Complete setup from scratch (ALL APPS READY!)
quickstart:
    @echo "╔════════════════════════════════════════════════════════════╗"
    @echo "║         🚀 UMKM MULTI-TENANT - QUICKSTART                  ║"
    @echo "║         CLIENT + CLIENT-WEB + CATALOG + SERVER             ║"
    @echo "╚════════════════════════════════════════════════════════════╝"
    @echo ""
    @echo "📋 Step 1/5: Setting up environment files..."
    @test -f .env || (test -f .env.example && cp .env.example .env && echo "   ✅ Created .env") || echo "   ⚠️  .env.example not found"
    @test -f server/.env || (test -f server/.env.example && cp server/.env.example server/.env && echo "   ✅ Created server/.env") || echo "   ⚠️  server/.env.example not found"
    @test -f client/.env.local || (echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api\nNEXT_PUBLIC_APP_URL=http://localhost:3000" > client/.env.local && echo "   ✅ Created client/.env.local")
    @test -f client-web/.env.local || (echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api\nNEXT_PUBLIC_APP_URL=http://localhost:3001" > client-web/.env.local && echo "   ✅ Created client-web/.env.local")
    @test -f catalog/.env.local || (echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api\nNEXT_PUBLIC_APP_URL=http://localhost:3002" > catalog/.env.local && echo "   ✅ Created catalog/.env.local")
    @echo ""
    @echo "📦 Step 2/5: Installing all dependencies (client, client-web, catalog, server, shared)..."
    @just install
    @echo ""
    @echo "🔨 Step 3/5: Building shared package..."
    @cd packages/shared && pnpm build
    @echo "   ✅ Shared package built!"
    @echo ""
    @echo "🗄️  Step 4/5: Setting up database (generate + push + seed)..."
    @just db-setup
    @echo ""
    @echo "🎨 Step 5/5: Verifying setup..."
    @echo "   ✅ Client ready at http://localhost:3000"
    @echo "   ✅ Client-Web ready at http://localhost:3001"
    @echo "   ✅ Catalog ready at http://localhost:3002"
    @echo "   ✅ Server ready at http://localhost:8000"
    @echo "   ✅ Database seeded and ready!"
    @echo ""
    @echo "╔════════════════════════════════════════════════════════════╗"
    @echo "║                    🎉 READY TO GO! 🎉                     ║"
    @echo "╚════════════════════════════════════════════════════════════╝"
    @echo ""
    @echo "🚀 Development Commands:"
    @echo "   just dev          - Start ALL servers (client + client-web + catalog + server)"
    @echo "   just dev-client   - Client dashboard only (port 3000)"
    @echo "   just dev-web      - Client-web landing builder only (port 3001)"
    @echo "   just dev-catalog  - Catalog public app only (port 3002)"
    @echo "   just dev-server   - Server API only (port 8000)"
    @echo ""
    @echo "🗄️  Database Commands:"
    @echo "   just db-studio    - Open Prisma Studio GUI"
    @echo "   just db-seed      - Re-seed database"
    @echo ""
    @echo "🔧 Quality Commands:"
    @echo "   just check        - Run all checks (format + lint + typecheck)"
    @echo "   just fix          - Auto-fix all issues"
    @echo "   just test         - Run all tests"
    @echo ""
    @echo "☢️  Nuclear Option:"
    @echo "   just nuclear      - Clean EVERYTHING and reinstall"
    @echo ""
    @echo "📊 Access URLs:"
    @echo "   🖥️  Client Dashboard:  http://localhost:3000"
    @echo "   🌐 Client-Web Builder: http://localhost:3001"
    @echo "   📚 Catalog Public:     http://localhost:3002"
    @echo "   📊 API Server:         http://localhost:8000/api"
    @echo "   🎨 Prisma Studio:      just db-studio"
    @echo ""
    @echo "✨ START NOW → just dev"

# ====================
# 📚 ALIASES
# ====================

alias up := dev
alias server := dev-server
alias client := dev-client
alias catalog := dev-catalog
alias web := dev-web
alias studio := db-studio
alias nuke := nuclear
alias qs := quickstart

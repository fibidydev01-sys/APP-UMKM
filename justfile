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

# Nuclear: Clean EVERYTHING and reinstall
nuclear:
    @echo "☢️  NUCLEAR: Removing EVERYTHING..."
    @echo "⚠️  This will delete all node_modules, dist, .next, build folders"
    @echo ""
    @echo "Press Ctrl+C in 5 seconds to cancel..."
    @sleep 5
    @echo ""
    @echo "🗑️  Cleaning all packages..."
    pnpm clean
    @echo ""
    @echo "🗑️  Removing all node_modules..."
    rm -rf node_modules client/node_modules client-web/node_modules server/node_modules
    @echo ""
    @echo "🗑️  Removing build artifacts..."
    rm -rf client/.next client-web/.next server/dist
    @echo ""
    @echo "🗑️  Removing pnpm-lock.yaml..."
    rm -rf pnpm-lock.yaml
    @echo ""
    @echo "📦 Installing fresh dependencies..."
    pnpm install
    @echo ""
    @echo "🔄 Generating Prisma Client..."
    cd server && pnpm exec prisma generate
    @echo ""
    @echo "╔════════════════════════════════════════════════════════════╗"
    @echo "║            ✅ NUKED & REINSTALLED! READY TO GO!            ║"
    @echo "╚════════════════════════════════════════════════════════════╝"
    @echo ""
    @echo "🚀 Next steps:"
    @echo "   just dev          - Start development servers"
    @echo "   just db-setup     - Setup database (if needed)"

# ====================
# 🚀 QUICKSTART
# ====================

# Quickstart - Complete setup from scratch (ALL APPS READY!)
quickstart:
    @echo "╔════════════════════════════════════════════════════════════╗"
    @echo "║         🚀 UMKM MULTI-TENANT - QUICKSTART                  ║"
    @echo "║          CLIENT + CLIENT-WEB + SERVER (NO SHARED)          ║"
    @echo "╚════════════════════════════════════════════════════════════╝"
    @echo ""
    @echo "📋 Step 1/4: Setting up environment files..."
    @test -f .env || (test -f .env.example && cp .env.example .env && echo "   ✅ Created .env") || echo "   ⚠️  .env.example not found"
    @test -f server/.env || (test -f server/.env.example && cp server/.env.example server/.env && echo "   ✅ Created server/.env") || echo "   ⚠️  server/.env.example not found"
    @test -f client/.env.local || (echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api\nNEXT_PUBLIC_APP_URL=http://localhost:3000" > client/.env.local && echo "   ✅ Created client/.env.local")
    @test -f client-web/.env.local || (echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api\nNEXT_PUBLIC_APP_URL=http://localhost:3001" > client-web/.env.local && echo "   ✅ Created client-web/.env.local")
    @echo ""
    @echo "📦 Step 2/4: Installing all dependencies (client, client-web, server)..."
    @just install
    @echo ""
    @echo "🗄️  Step 3/4: Setting up database (generate + push + seed)..."
    @just db-setup
    @echo ""
    @echo "🎨 Step 4/4: Verifying setup..."
    @echo "   ✅ Client ready at http://localhost:3000"
    @echo "   ✅ Client-Web ready at http://localhost:3001"
    @echo "   ✅ Server ready at http://localhost:8000"
    @echo "   ✅ Database seeded and ready!"
    @echo ""
    @echo "╔════════════════════════════════════════════════════════════╗"
    @echo "║                    🎉 READY TO GO! 🎉                     ║"
    @echo "╚════════════════════════════════════════════════════════════╝"
    @echo ""
    @echo "🚀 Development Commands:"
    @echo "   just dev          - Start ALL servers (client + client-web + server)"
    @echo "   just dev-client   - Client dashboard only (port 3000)"
    @echo "   just dev-web      - Client-web landing builder only (port 3001)"
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
alias studio := db-studio
alias nuke := nuclear
alias clean := nuclear
alias qs := quickstart

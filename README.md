# UMKM Multi-Tenant Platform

> Platform multi-tenant untuk UMKM dengan landing page builder dan dashboard
> management

## 📦 Struktur Monorepo

Proyek ini menggunakan **pnpm workspace** untuk mengelola multiple packages
dalam satu repository:

```
APP-UMKM/
├── client/          # Dashboard Admin Next.js (port 3000)
├── client-web/      # Landing Page Builder Next.js (port 3001)
├── server/          # Backend API NestJS
├── packages/
│   └── shared/      # Shared utilities, components & types ⭐
├── docs/            # Dokumentasi
└── script/          # Utility scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0 (install: `npm install -g pnpm`)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd APP-UMKM

# Install all dependencies
pnpm install

# Setup Prisma (untuk server)
cd server
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma generate
pnpm prisma migrate dev
cd ..
```

## 🛠️ Development Commands

### Jalankan Semua Services

```bash
# Development mode - run all services in parallel
pnpm dev

# Run individual workspace
pnpm dev:client       # Dashboard (http://localhost:3000)
pnpm dev:client-web   # Landing Builder (http://localhost:3001)
pnpm dev:server       # Backend API (http://localhost:3030)
```

### Build Commands

```bash
# Build all workspaces
pnpm build

# Build individual workspace
pnpm build:client
pnpm build:client-web
pnpm build:server
```

### Linting & Testing

```bash
# Lint all workspaces
pnpm lint

# Run tests
pnpm test

# Type checking
pnpm typecheck
```

### Package Management

```bash
# Add dependency to specific workspace
pnpm --filter @umkm/client add <package-name>
pnpm --filter @umkm/client-web add <package-name>
pnpm --filter @umkm/server add <package-name>

# Add dev dependency
pnpm --filter @umkm/client add -D <package-name>

# Add dependency to root (shared tools)
pnpm add -w <package-name>

# Remove dependency
pnpm --filter @umkm/client remove <package-name>

# Update dependencies
pnpm update --recursive
```

### Clean & Reset

```bash
# Clean all build artifacts and node_modules
pnpm clean

# Clean and reinstall everything
pnpm clean:install
```

## 📚 Workspace Packages

### @umkm/shared ⭐ **NEW**

**Single Source of Truth** untuk shared code - UI components, utilities, types &
hooks.

**Contains:**

- 🎨 UI Components (Button, Card, Dialog, dll)
- 🛠️ Utilities (cn, formatPrice, formatDate, dll)
- 📝 TypeScript types & interfaces
- 🎣 Custom React hooks

**Usage:**

```tsx
import { Button, cn, formatPrice } from '@umkm/shared';
```

**Benefits:**

- ✅ No code duplication
- ✅ Single source of truth
- ✅ Consistent UI & logic
- ✅ Smaller bundle sizes

[📖 Full Documentation](packages/shared/README.md)

### @umkm/client

Dashboard admin untuk mengelola tenant, products, dan settings.

**Tech Stack:**

- Next.js 16.1
- React 19.2
- TailwindCSS 4
- Radix UI
- Framer Motion
- Zustand
- **@umkm/shared** ⭐

**Commands:**

```bash
cd client
pnpm dev    # Start dev server (port 3000)
pnpm build  # Build for production
pnpm start  # Run production build
```

### @umkm/client-web

Landing page builder dengan live preview dan customization.

**Tech Stack:**

- Next.js 16.1
- React 19.2
- TailwindCSS 4
- Radix UI
- Drag & Drop Kit
- Three.js
- **@umkm/shared** ⭐

**Commands:**

```bash
cd client-web
pnpm dev    # Start dev server (port 3001)
pnpm build  # Build for production
pnpm start  # Run production build (port 3001)
```

### @umkm/server

Backend API dengan multi-tenancy support.

**Tech Stack:**

- NestJS 11
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Upstash Redis

**Commands:**

```bash
cd server
pnpm start:dev     # Start with watch mode
pnpm start:prod    # Run production build
pnpm prisma:studio # Open Prisma Studio
pnpm prisma:migrate # Run migrations
```

## 🔧 Keunggulan pnpm Workspace

### 1. **Performance Superior**

- ⚡ **3x lebih cepat** dari npm/yarn
- 💾 **Hemat disk space** - dependencies di-share via hard links
- 🚀 **Parallel execution** - install & build multiple workspace sekaligus

### 2. **Dependency Management**

- 🔒 **Strict mode** - mencegah phantom dependencies
- 📦 **Auto deduplication** - dependency yang sama hanya install 1x
- 🎯 **Scoped packages** - `@umkm/*` namespace untuk internal packages

### 3. **Monorepo Native**

- 🏗️ **Workspace filtering** - jalankan command di specific workspace
- 🔄 **Shared dependencies** - typescript, prettier, dll di root
- 📊 **Better visibility** - satu lock file untuk semua workspace

### 4. **Developer Experience**

```bash
# Filter by workspace name
pnpm --filter @umkm/client dev

# Run command in all workspaces
pnpm --recursive build

# Run in parallel with streaming output
pnpm --parallel --stream dev

# Select multiple workspaces
pnpm --filter '@umkm/client*' test
```

## 🔐 Environment Variables

Setiap workspace memiliki `.env` file masing-masing:

```bash
# client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# client-web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# server/.env
DATABASE_URL="postgresql://user:password@localhost:5432/umkm"
JWT_SECRET="your-secret-key"
REDIS_URL="your-upstash-redis-url"
```

## 📝 Best Practices

### Adding New Workspace

1. Create new directory
2. Add `package.json` with `@umkm/*` scope
3. Add to `pnpm-workspace.yaml`
4. Run `pnpm install`

### Sharing Code Between Workspaces

```bash
# Create shared package
mkdir packages/shared
cd packages/shared
pnpm init

# Update pnpm-workspace.yaml
# Add: - 'packages/*'

# Use in other workspace
pnpm --filter @umkm/client add @umkm/shared@workspace:*
```

### Commit Guidelines

```bash
# Format: <type>(<scope>): <message>

git commit -m "feat(client): add product filtering"
git commit -m "fix(server): resolve auth middleware bug"
git commit -m "docs: update README with pnpm commands"
git commit -m "chore: upgrade dependencies"
```

## 🐛 Troubleshooting

### Prisma Download Issue

Jika Prisma gagal download binary:

```bash
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
pnpm --filter @umkm/server prisma generate
```

### Lock File Conflict

```bash
# Regenerate lock file
rm pnpm-lock.yaml
pnpm install
```

### Node Modules Issue

```bash
# Clean and reinstall
pnpm clean:install
```

### TypeScript Errors

```bash
# Check all workspaces
pnpm typecheck

# Check specific workspace
pnpm --filter @umkm/client exec tsc --noEmit
```

## 📖 Documentation

- [Loading & Debug Pattern](docs/loading-debug-pattern.md)
- [NestJS Server Guide](server/README.md)
- [Client Dashboard](client/README.md)
- [Landing Builder](client-web/README.md)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Fibidy**

---

**Built with ❤️ using pnpm workspace**

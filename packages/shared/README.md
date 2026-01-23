# @umkm/shared

> Shared utilities, components, and types for UMKM Multi-Tenant Platform

## 📦 Single Source of Truth

This package contains ALL shared code used across multiple workspaces in the UMKM monorepo. **No duplication, no mismatch** - everything is imported from here.

## 🗂️ Package Structure

```
packages/shared/
├── src/
│   ├── ui/           # Shared UI components (shadcn/ui)
│   ├── utils/        # Utility functions (cn, format, etc.)
│   ├── types/        # TypeScript types & interfaces
│   ├── hooks/        # Custom React hooks
│   ├── config/       # Shared configuration
│   └── index.ts      # Main exports
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Usage

### Install in Workspace

```bash
# Add to client or client-web
pnpm --filter @umkm/client add @umkm/shared@workspace:*
pnpm --filter @umkm/client-web add @umkm/shared@workspace:*
```

### Import Components & Utils

```tsx
// UI Components
import { Button, Card, Badge } from '@umkm/shared/ui';

// Utilities
import { cn, formatPrice, formatDate } from '@umkm/shared/utils';

// All in one
import { Button, cn, formatPrice } from '@umkm/shared';
```

## 📚 Available Exports

### UI Components

All shadcn/ui components are available:

- `Avatar` - User avatar component
- `Badge` - Badge/tag component
- `Button` - Button with variants
- `Card` - Card container
- `Dialog` - Modal dialog
- `DropdownMenu` - Dropdown menu
- `Input` - Text input field
- `Label` - Form label
- `Select` - Select dropdown
- `Textarea` - Multi-line text input

### Utilities

#### `cn(...classes)`
Merge Tailwind classes with clsx

```tsx
cn('px-4 py-2', isActive && 'bg-blue-500', className)
```

#### Price Formatting

```tsx
formatPrice(15000)           // "Rp 15.000"
formatPrice(100, 'USD')      // "$100"
formatPriceShort(1500000)    // "Rp 1.5jt"
```

#### Date Formatting

```tsx
formatDate('2024-01-15')          // "15 Januari 2024"
formatDateShort('2024-01-15')     // "15 Jan 2024"
formatDateTime('2024-01-15T10:30') // "15 Jan 2024, 10:30"
formatRelativeTime(date)          // "5 menit lalu"
```

#### Number Formatting

```tsx
formatNumber(1500000)        // "1.500.000"
formatPercentage(15.5, 1)    // "15.5%"
```

#### Phone Number

```tsx
formatPhone('6281234567890')          // "+62 812-3456-7890"
normalizePhone('081234567890')        // "6281234567890"
```

#### WhatsApp

```tsx
generateWhatsAppLink('081234567890', 'Hello')
// "https://wa.me/6281234567890?text=Hello"
```

#### Text Utilities

```tsx
slugify('Hello World 123')    // "hello-world-123"
getInitials('John Doe')       // "JD"
truncate('Hello World', 8)    // "Hello Wo..."
```

#### Status Colors

```tsx
getOrderStatusColor('PENDING')    // Tailwind classes
getPaymentStatusColor('PAID')     // Tailwind classes
```

## 🔄 Development

### Type Checking

```bash
cd packages/shared
pnpm typecheck
```

### Adding New Components

1. Add component to `src/ui/`
2. Export from `src/ui/index.ts`
3. Update this README

### Adding New Utilities

1. Add utility to `src/utils/`
2. Export from `src/utils/index.ts`
3. Update this README

## ✅ Benefits

- **Single Source of Truth** - No code duplication
- **Type Safety** - Full TypeScript support
- **Consistency** - Same UI & logic everywhere
- **Easy Updates** - Change once, apply everywhere
- **Better DX** - Clean imports, no relative paths
- **Smaller Bundles** - Shared dependencies

## 📝 Guidelines

### DO ✅

- Import from `@umkm/shared` in all workspaces
- Add shared utilities here
- Keep components generic and reusable
- Document new exports in README

### DON'T ❌

- Duplicate utilities in workspace packages
- Add workspace-specific logic here
- Import from individual files (use package exports)
- Mix business logic with UI components

## 🎨 Adding shadcn/ui Components

To add more shadcn/ui components:

```bash
# In client or client-web (to generate)
npx shadcn@latest add <component>

# Copy to shared
cp client/src/components/ui/<component>.tsx packages/shared/src/ui/

# Fix imports (change @/lib/utils to ../utils/cn)
sed -i 's|from "@/lib/utils"|from "../utils/cn"|g' packages/shared/src/ui/<component>.tsx

# Export from shared/src/ui/index.ts
echo "export * from './<component>';" >> packages/shared/src/ui/index.ts

# Remove from client & client-web (they'll import from @umkm/shared)
rm client/src/components/ui/<component>.tsx
rm client-web/src/components/ui/<component>.tsx
```

## 🤝 Contributing

When adding shared code:

1. Verify it's used in 2+ workspaces
2. Make it generic (no hard-coded values)
3. Add TypeScript types
4. Update exports in index files
5. Document in README
6. Test in all consuming workspaces

---

**Maintained by:** Fibidy
**Part of:** UMKM Multi-Tenant Monorepo

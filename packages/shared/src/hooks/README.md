# Shared Hooks

Single source of truth untuk React hooks yang digunakan di seluruh monorepo.

## Media Query Hooks

Semua media query hooks menggunakan `useSyncExternalStore` (React 18+) untuk:

- ✅ Tidak ada hydration mismatch errors
- ✅ Proper SSR support (returns `false` di server)
- ✅ Efficient event listener management

### `useMediaQuery(query: string): boolean`

Generic hook untuk custom media queries.

```tsx
import { useMediaQuery } from '@umkm/shared/hooks';

function Component() {
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)'
  );
}
```

### Breakpoint Hooks

| Hook                  | Breakpoint       | Description           |
| --------------------- | ---------------- | --------------------- |
| `useIsMobile()`       | `< 640px`        | Below Tailwind `sm`   |
| `useIsTablet()`       | `640px - 1023px` | Between `sm` and `lg` |
| `useIsDesktop()`      | `≥ 1024px`       | Tailwind `lg` and up  |
| `useIsLargeDesktop()` | `≥ 1280px`       | Tailwind `xl` and up  |
| `useIsMediumUp()`     | `≥ 768px`        | Tailwind `md` and up  |

```tsx
import { useIsMobile, useIsMediumUp } from '@umkm/shared/hooks';

function ResponsiveComponent() {
  const isMobile = useIsMobile(); // < 640px
  const isTabletUp = useIsMediumUp(); // ≥ 768px

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### `breakpoints` Constants

Pre-defined media query strings matching Tailwind breakpoints:

```tsx
import { breakpoints, useMediaQuery } from '@umkm/shared/hooks';

// breakpoints = {
//   sm: '(min-width: 640px)',
//   md: '(min-width: 768px)',
//   lg: '(min-width: 1024px)',
//   xl: '(min-width: 1280px)',
//   '2xl': '(min-width: 1536px)',
// }

const isSmUp = useMediaQuery(breakpoints.sm);
```

## Utility Hooks

### `useMobileProductLimit<T>(products: T[], limit?: number): T[]`

Limits array length on mobile devices. Useful for reducing render load.

```tsx
import { useMobileProductLimit } from '@umkm/shared/hooks';

function ProductGrid({ products }) {
  // On mobile: max 12 items
  // On desktop: all items
  const visibleProducts = useMobileProductLimit(products, 12);

  return <Grid items={visibleProducts} />;
}
```

## Important Notes

### Sidebar Component

The Sidebar component uses `useIsMediumUp()` to match Tailwind's `md:block`
class:

```tsx
// In packages/shared/src/ui/sidebar.tsx
const isMobile = !useIsMediumUp(); // true when < 768px
```

This ensures:

- `0 - 767px`: Mobile Sheet sidebar
- `768px+`: Desktop sidebar (matches `hidden md:block`)

### SSR Behavior

All hooks return `false` during SSR (desktop-first approach). This means:

- Server renders desktop version
- Mobile devices may see a brief flash before JS hydration
- This is intentional to avoid hydration mismatches

### Migration from Client Hooks

Both `client` and `client-web` packages re-export from shared:

```tsx
// These are equivalent:
import { useIsMobile } from '@umkm/shared/hooks';
import { useIsMobile } from '@/hooks';
```

The local `use-media-query.ts` files are deprecated and only re-export from
shared.

# Client-Page Tabs Pattern

> Pattern untuk membuat halaman dengan multiple tabs/wizard tanpa mengubah URL.
> Digunakan pada `/settings/toko` dan `/settings/channels`.

---

## Overview

Pattern ini memisahkan **server component** (metadata) dan **client component**
(UI interaktif) ke dalam 2 file terpisah, dengan tabs yang dikelola via
`useState` saja - **URL tidak berubah** saat berpindah tab.

```
/settings/toko/
├── page.tsx      # Server component (metadata only)
└── client.tsx    # Client component (tabs + content)
```

---

## Kenapa Pattern Ini Performant?

### 1. Zero Network Request saat Switch Tab

- Tabs hanya mengubah **state lokal** (`useState`)
- Tidak ada `router.push()` atau `useSearchParams()`
- Tidak ada request ke server saat pindah tab
- **Instant switch** - user tidak menunggu

### 2. Single Page Load

- Semua wizard pages di-import sebagai **components**
- Browser load sekali, lalu switch antar komponen
- Tidak ada re-fetch data dari server

### 3. Metadata Tetap Server-Side

- `page.tsx` tetap server component
- SEO metadata di-generate di server
- Best of both worlds: SSR metadata + CSR interactivity

### 4. No URL Pollution

- URL tetap bersih: `/settings/toko`
- Tidak ada query params: `?tab=hero-section`
- Tidak perlu handle browser back/forward untuk tabs
- Simpler mental model untuk user

---

## Struktur File

### `page.tsx` - Server Component (Metadata Only)

```tsx
import type { Metadata } from 'next';
import { TokoClient } from './client';

export const metadata: Metadata = {
  title: 'Informasi Toko',
  description: 'Kelola informasi toko dan konten landing page',
};

export default function TokoPage() {
  return <TokoClient />;
}
```

**Karakteristik:**

- Server component (default di Next.js App Router)
- Hanya export `metadata` dan render client component
- Tidak ada logic, tidak ada state
- File sangat kecil dan simple

### `client.tsx` - Client Component (Tabs + Content)

```tsx
'use client';

import { useState } from 'react';
import { Home, FileText, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import wizard pages as components
import HeroSectionPage from '../hero-section/page';
import AboutPage from '../about/page';
import TestimonialsPage from '../testimonials/page';

type TabType = 'hero-section' | 'about' | 'testimonials';

const TABS = [
  { id: 'hero-section' as const, label: 'Hero Section', icon: Home },
  { id: 'about' as const, label: 'About', icon: FileText },
  { id: 'testimonials' as const, label: 'Testimonials', icon: MessageSquare },
];

export function TokoClient() {
  const [activeTab, setActiveTab] = useState<TabType>('hero-section');

  return (
    <div>
      {/* Sticky Tabs */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 mb-6">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'hero-section' && <HeroSectionPage />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'testimonials' && <TestimonialsPage />}
      </div>
    </div>
  );
}
```

**Karakteristik:**

- Client component (`'use client'`)
- `useState` untuk active tab
- Import pages sebagai components
- Conditional render berdasarkan activeTab
- Sticky tabs dengan horizontal scroll

---

## Sticky Tabs CSS Pattern

```tsx
<div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 mb-6">
  <div className="px-4 md:px-6 lg:px-8">
    <div className="flex overflow-x-auto">{/* tabs */}</div>
  </div>
</div>
```

**Penjelasan:**

- `sticky top-0` - tabs menempel di atas saat scroll
- `z-20` - di atas content, di bawah modal
- `bg-background` - background solid (tidak transparan)
- `-mx-4 md:-mx-6 lg:-mx-8` - full width (cancel parent padding)
- `px-4 md:px-6 lg:px-8` - kembalikan padding untuk content
- `overflow-x-auto` - horizontal scroll untuk mobile

---

## Kapan Pakai Pattern Ini?

### Gunakan pattern ini jika:

- Halaman punya **2+ sub-sections** yang logically grouped
- User sering **switch antar sections**
- Tidak perlu **deep linking** ke specific tab
- Ingin **instant switch** tanpa loading

### Contoh penggunaan:

- Settings pages (Toko, Channels)
- Profile pages (Info, Security, Preferences)
- Product detail (Description, Reviews, Specs)
- Dashboard views (Overview, Analytics, Reports)

### JANGAN gunakan jika:

- Perlu **share link** ke specific tab
- Perlu **browser back/forward** untuk tabs
- Tabs adalah **separate routes** yang independent
- Content sangat besar dan perlu **lazy loading**

---

## Implementasi Baru

Untuk buat halaman baru dengan pattern ini:

### 1. Buat folder dan files

```bash
mkdir -p client/src/app/settings/nama-fitur
touch client/src/app/settings/nama-fitur/page.tsx
touch client/src/app/settings/nama-fitur/client.tsx
```

### 2. Copy template `page.tsx`

```tsx
import type { Metadata } from 'next';
import { NamaFiturClient } from './client';

export const metadata: Metadata = {
  title: 'Nama Fitur',
  description: 'Deskripsi fitur',
};

export default function NamaFiturPage() {
  return <NamaFiturClient />;
}
```

### 3. Copy template `client.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Icon1, Icon2, Icon3 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import sub-pages as components
import Tab1Page from '../tab1/page';
import Tab2Page from '../tab2/page';
import Tab3Page from '../tab3/page';

type TabType = 'tab1' | 'tab2' | 'tab3';

const TABS = [
  { id: 'tab1' as const, label: 'Tab 1', icon: Icon1 },
  { id: 'tab2' as const, label: 'Tab 2', icon: Icon2 },
  { id: 'tab3' as const, label: 'Tab 3', icon: Icon3 },
];

export function NamaFiturClient() {
  const [activeTab, setActiveTab] = useState<TabType>('tab1');

  return (
    <div>
      {/* Sticky Tabs */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 mb-6">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'tab1' && <Tab1Page />}
        {activeTab === 'tab2' && <Tab2Page />}
        {activeTab === 'tab3' && <Tab3Page />}
      </div>
    </div>
  );
}
```

### 4. Update navigation (jika perlu)

Di `settings-sidebar.tsx` dan `settings-mobile-navbar.tsx`, tambahkan item baru:

```tsx
{
  title: 'Nama Fitur',
  href: '/settings/nama-fitur',
  icon: IconName,
}
```

---

## Referensi Implementasi

| Halaman  | Lokasi               | Tabs                                    |
| -------- | -------------------- | --------------------------------------- |
| Toko     | `/settings/toko`     | Hero, About, Testimonials, Contact, CTA |
| Channels | `/settings/channels` | Pencarian, Pembayaran, Pengiriman       |

---

## Summary

```
┌─────────────────────────────────────────────────────────────┐
│  page.tsx (Server)           client.tsx (Client)            │
│  ┌─────────────────┐         ┌─────────────────────────┐   │
│  │ metadata        │         │ 'use client'            │   │
│  │ export default  │────────▶│ useState(activeTab)     │   │
│  │ return <Client/>│         │ TABS[]                  │   │
│  └─────────────────┘         │ import SubPages         │   │
│                              │ conditional render      │   │
│                              └─────────────────────────┘   │
│                                         │                   │
│                                         ▼                   │
│                              ┌─────────────────────────┐   │
│                              │ Tab1Page | Tab2Page     │   │
│                              │ (rendered based on      │   │
│                              │  activeTab state)       │   │
│                              └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

URL: /settings/toko (TIDAK BERUBAH saat switch tab)
```

**Key Points:**

1. `page.tsx` = metadata only (server)
2. `client.tsx` = UI + state (client)
3. `useState` = tab state (no URL)
4. Import pages as components
5. Conditional render = instant switch

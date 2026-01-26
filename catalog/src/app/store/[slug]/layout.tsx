import { tenantsApi } from '@umkm/shared/api';
import { StoreHeader, StoreFooter, StoreNotFound } from '@umkm/shared/features/store';
import { LocalBusinessSchema } from '@umkm/shared/features/seo';
import type { Metadata } from 'next';
import type { PublicTenant } from '@umkm/shared/types';

// ==========================================
// STORE LAYOUT
// Wraps all store pages for a specific tenant
// 🚀 NOW WITH TEMPLATE PROVIDER!
// ==========================================

// ✅ FIX: Force dynamic rendering to prevent stale tenant data cache
export const dynamic = 'force-dynamic';

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// ==========================================
// THEME UTILITIES (Server-safe)
// ==========================================

interface ThemeColor {
  light: string;
  dark: string;
}

const THEME_OKLCH_MAP: Record<string, ThemeColor> = {
  '#0ea5e9': { light: 'oklch(0.685 0.169 237.323)', dark: 'oklch(0.746 0.16 232.661)' },
  '#10b981': { light: 'oklch(0.696 0.17 162.48)', dark: 'oklch(0.765 0.177 163.223)' },
  '#f43f5e': { light: 'oklch(0.645 0.246 16.439)', dark: 'oklch(0.712 0.194 13.428)' },
  '#f59e0b': { light: 'oklch(0.769 0.188 70.08)', dark: 'oklch(0.822 0.165 68.293)' },
  '#8b5cf6': { light: 'oklch(0.606 0.25 292.717)', dark: 'oklch(0.702 0.183 293.541)' },
  '#f97316': { light: 'oklch(0.705 0.213 47.604)', dark: 'oklch(0.762 0.182 50.939)' },
};

const DEFAULT_THEME: ThemeColor = {
  light: 'oklch(0.656 0.241 354.308)',
  dark: 'oklch(0.718 0.202 349.761)',
};

function generateThemeCSS(hexColor?: string): string {
  const normalizedHex = hexColor?.toLowerCase() || '';
  const themeColors = THEME_OKLCH_MAP[normalizedHex] || DEFAULT_THEME;

  return `
    .tenant-theme {
      --primary: ${themeColors.light};
      --ring: ${themeColors.light};
      --sidebar-primary: ${themeColors.light};
      --sidebar-ring: ${themeColors.light};
      --chart-1: ${themeColors.light};
    }
    .dark .tenant-theme,
    .tenant-theme.dark {
      --primary: ${themeColors.dark};
      --ring: ${themeColors.dark};
      --sidebar-primary: ${themeColors.dark};
      --sidebar-ring: ${themeColors.dark};
      --chart-1: ${themeColors.dark};
    }
  `;
}

// Fetch tenant data (server-side)
async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    const tenant = await tenantsApi.getBySlug(slug);
    return tenant;
  } catch {
    return null;
  }
}

// ==========================================
// GENERATE METADATA (Enhanced with SEO)
// ==========================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    return {
      title: 'Toko Tidak Ditemukan',
      description: 'Toko yang Anda cari tidak ditemukan atau sudah tidak aktif.',
      robots: { index: false, follow: false },
    };
  }

  // Inline metadata (avoid client function import in server component)
  const title = tenant.metaTitle || `${tenant.name} | Toko Online`;
  const description =
    tenant.metaDescription ||
    tenant.description ||
    `${tenant.name} - Belanja mudah dan pesan langsung via WhatsApp.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: tenant.heroBackgroundImage
        ? [tenant.heroBackgroundImage]
        : tenant.logo
          ? [tenant.logo]
          : [],
    },
  };
}

// ==========================================
// STORE LAYOUT COMPONENT
// ==========================================

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  // Show not found if tenant doesn't exist or inactive
  if (!tenant || tenant.status !== 'ACTIVE') {
    return <StoreNotFound slug={slug} />;
  }

  // Get theme color from tenant
  const primaryHex = tenant.theme?.primaryColor || '';

  return (
    <>
      {/* ==========================================
          INJECT TENANT THEME CSS VARIABLES
          Override --primary for this store
      ========================================== */}
      <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(primaryHex) }} />

      <div className="tenant-theme flex min-h-screen flex-col">
        {/* ==========================================
            LOCAL BUSINESS SCHEMA (JSON-LD)
            Per-tenant structured data for Google
        ========================================== */}
        <LocalBusinessSchema
          tenant={{
            name: tenant.name,
            slug: tenant.slug,
            description: tenant.description,
            category: tenant.category,
            whatsapp: tenant.whatsapp || '',
            phone: tenant.phone,
            address: tenant.address,
            logo: tenant.logo,
            banner: tenant.heroBackgroundImage,
            socialLinks: tenant.socialLinks,
          }}
        />

        <StoreHeader tenant={tenant} />

        <main className="flex-1">{children}</main>

        <StoreFooter tenant={tenant} />
      </div>
    </>
  );
}

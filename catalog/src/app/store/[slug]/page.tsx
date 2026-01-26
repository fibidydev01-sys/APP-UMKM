import { notFound } from 'next/navigation';
import { tenantsApi } from '@umkm/shared/api';
import { productsApi } from '@umkm/shared/api';
import { BreadcrumbSchema, ProductListSchema } from '@umkm/shared/features/seo';
import type { PublicTenant, Product, Testimonial } from '@umkm/shared/types';
import { StoreLanding } from './components/store-landing';

// ==========================================
// STORE HOMEPAGE - CUSTOM LANDING ONLY
// ==========================================

// Inline normalizeTestimonials (avoid client function import in server component)
function normalizeTestimonials(items: unknown): Testimonial[] {
  if (!items) return [];
  let normalized = items;
  // Handle nested array bug [[item]] -> [item]
  while (Array.isArray(normalized) && normalized.length > 0 && Array.isArray(normalized[0])) {
    normalized = normalized[0];
  }
  return Array.isArray(normalized) ? (normalized as Testimonial[]) : [];
}

// ✅ FIX: Force dynamic rendering to prevent stale landing config cache
export const dynamic = 'force-dynamic';

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    return await tenantsApi.getBySlug(slug);
  } catch {
    return null;
  }
}

async function getProducts(slug: string, limit = 8): Promise<Product[]> {
  try {
    const response = await productsApi.getByStore(slug, {
      isActive: true,
      limit,
    });
    return response.data;
  } catch {
    return [];
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    notFound();
  }

  // ✅ FIX: No type annotation, let TypeScript infer
  const landingConfig = tenant.landingConfig;

  // 🔥 DEBUG: Log what we're reading from database
  console.group(`🏪 [STORE PAGE] ${slug}`);
  console.log('📥 Landing Config from DB (JSON):', JSON.stringify(landingConfig, null, 2));
  console.log('🎯 HERO SECTION:', JSON.stringify(landingConfig?.hero, null, 2));
  console.log('📊 Sections enabled:', {
    hero: landingConfig?.hero?.enabled,
    about: landingConfig?.about?.enabled,
    products: landingConfig?.products?.enabled,
    testimonials: landingConfig?.testimonials?.enabled,
    cta: landingConfig?.cta?.enabled,
    contact: landingConfig?.contact?.enabled,
  });
  console.groupEnd();

  // Inline breadcrumbs (avoid client function import in server component)
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: tenant.name, url: `/store/${tenant.slug}` },
  ];

  // Fetch products
  const productLimit = (landingConfig?.products?.config?.limit as number) || 8;
  const products = await getProducts(slug, productLimit);

  // Check if testimonials has items (for conditional rendering)
  const testimonialItems = normalizeTestimonials(tenant.testimonials as Testimonial[] | undefined);
  const testimonialsEnabled = landingConfig?.testimonials?.enabled === true;
  const hasTestimonials = testimonialsEnabled && testimonialItems.length > 0;

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      {products.length > 0 && (
        <ProductListSchema
          products={products.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            images: p.images,
          }))}
          tenant={{ name: tenant.name, slug: tenant.slug }}
          listName={`Produk ${tenant.name}`}
        />
      )}

      {/* StoreLanding is a client component - hooks work inside */}
      <StoreLanding
        tenant={tenant}
        products={products}
        landingConfig={landingConfig}
        hasTestimonials={hasTestimonials}
      />
    </>
  );
}

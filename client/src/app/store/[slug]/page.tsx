import { notFound } from 'next/navigation';
import { tenantsApi, productsApi } from '@/lib/api';
import {
  normalizeTestimonials,
  extractHeroData,
  extractAboutData,
  extractTestimonialsData,
  extractContactData,
  extractCtaData,
} from '@/lib/landing';
import {
  TenantHero,
  TenantAbout,
  TenantProducts,
  TenantTestimonials,
  TenantContact,
  TenantCta,
} from '@/components/landing';
import {
  BreadcrumbSchema,
  ProductListSchema,
  generateTenantBreadcrumbs,
} from '@/components/seo';
import type { PublicTenant, Product } from '@/types';

// ==========================================
// STORE HOMEPAGE - CUSTOM LANDING ONLY
// ==========================================

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

  const breadcrumbs = generateTenantBreadcrumbs({
    name: tenant.name,
    slug: tenant.slug,
  });

  // Fetch products
  const productLimit = (landingConfig?.products?.config?.limit as number) || 8;
  const products = await getProducts(slug, productLimit);

  // ==========================================
  // EXTRACT DATA FROM TENANT FIELDS (NEW)
  // Priority: tenant fields > landingConfig > defaults
  // ==========================================
  const heroData = extractHeroData(tenant, landingConfig);
  const aboutData = extractAboutData(tenant, landingConfig);
  const testimonialsData = extractTestimonialsData(tenant, landingConfig);
  const contactData = extractContactData(tenant, landingConfig);
  const ctaData = extractCtaData(tenant, landingConfig);

  // Testimonials - use extracted data
  const testimonialItems = normalizeTestimonials(testimonialsData.items);
  const testimonialsEnabled = landingConfig?.testimonials?.enabled === true;
  const hasTestimonials = testimonialsEnabled && testimonialItems.length > 0;

  // Check if any section is enabled
  const hasAnySectionEnabled =
    landingConfig?.hero?.enabled ||
    landingConfig?.about?.enabled ||
    landingConfig?.products?.enabled ||
    hasTestimonials ||
    landingConfig?.cta?.enabled ||
    landingConfig?.contact?.enabled;

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

      {/* TemplateProvider now in layout.tsx - no need to wrap here */}
      <div className="container px-4 py-8 space-y-8">
        {landingConfig?.hero?.enabled && (
          <TenantHero
            config={landingConfig.hero}
            fallbacks={{
              // Use extracted data from tenant fields (priority: tenant > config > default)
              title: heroData.title,
              subtitle: heroData.subtitle,
              backgroundImage: heroData.backgroundImage,
              logo: tenant.logo || undefined,
              storeName: tenant.name,
            }}
          />
        )}

        {landingConfig?.about?.enabled && (
          <TenantAbout
            config={landingConfig.about}
            fallbacks={{
              title: aboutData.title,
              subtitle: aboutData.subtitle,
              content: aboutData.content,
              image: aboutData.image,
            }}
          />
        )}

        {landingConfig?.products?.enabled && products.length > 0 && (
          <TenantProducts
            products={products}
            config={landingConfig.products}
            storeSlug={slug}
          />
        )}

        {hasTestimonials && (
          <TenantTestimonials
            config={{
              ...landingConfig?.testimonials,
              title: testimonialsData.title,
              subtitle: testimonialsData.subtitle,
              config: {
                items: testimonialItems,
              },
            }}
          />
        )}

        {landingConfig?.cta?.enabled && (
          <TenantCta
            config={landingConfig.cta}
            storeSlug={slug}
            fallbacks={{
              title: ctaData.title,
              subtitle: ctaData.subtitle,
              buttonText: ctaData.buttonText,
              buttonLink: ctaData.buttonLink,
            }}
          />
        )}

        {landingConfig?.contact?.enabled && (
          <TenantContact
            config={landingConfig.contact}
            fallbacks={{
              title: contactData.title,
              subtitle: contactData.subtitle,
              whatsapp: contactData.whatsapp || null,
              phone: contactData.phone || null,
              address: contactData.address || null,
              storeName: tenant.name,
            }}
          />
        )}

        {!hasAnySectionEnabled && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground mb-2">
              Landing page belum dikonfigurasi
            </p>
            <p className="text-sm text-muted-foreground">
              Aktifkan section di Dashboard &gt; Settings &gt; Landing
            </p>
          </div>
        )}
      </div>
    </>
  );
}

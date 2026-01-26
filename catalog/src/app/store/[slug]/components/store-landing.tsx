'use client';

import {
  TenantHero,
  TenantAbout,
  TenantProducts,
  TenantTestimonials,
  TenantContact,
  TenantCta,
} from '@umkm/shared/features/landing-blocks';
import { TemplateProvider } from '@umkm/shared';
import type { PublicTenant, Product, SectionKey, TenantLandingConfig } from '@umkm/shared/types';

// ==========================================
// STORE LANDING - CLIENT COMPONENT
// Renders all landing sections with template context
// ==========================================

interface StoreLandingProps {
  tenant: PublicTenant;
  products: Product[];
  landingConfig: TenantLandingConfig | undefined;
  hasTestimonials: boolean;
}

export function StoreLanding({
  tenant,
  products,
  landingConfig,
  hasTestimonials,
}: StoreLandingProps) {
  // 🚀 Section order - use config.sectionOrder or default order
  const defaultOrder: SectionKey[] = [
    'hero',
    'about',
    'products',
    'testimonials',
    'cta',
    'contact',
  ];
  const sectionOrder = landingConfig?.sectionOrder || defaultOrder;

  // Section enabled checks
  const heroEnabled = true; // Hero always enabled (critical: logo + heroBackgroundImage)
  const aboutEnabled = landingConfig?.about?.enabled === true;
  const productsEnabled = landingConfig?.products?.enabled === true && products.length > 0;
  const ctaEnabled = landingConfig?.cta?.enabled === true;
  const contactEnabled = landingConfig?.contact?.enabled === true;

  // Check if any section is enabled
  const hasAnySectionEnabled =
    heroEnabled ||
    aboutEnabled ||
    productsEnabled ||
    hasTestimonials ||
    ctaEnabled ||
    contactEnabled;

  // 🚀 Section rendering map
  const sectionComponents: Record<SectionKey, React.ReactNode> = {
    hero: heroEnabled ? (
      <TenantHero key="hero" config={landingConfig?.hero} tenant={tenant} />
    ) : null,
    about: aboutEnabled ? (
      <TenantAbout key="about" config={landingConfig?.about} tenant={tenant} />
    ) : null,
    products: productsEnabled ? (
      <TenantProducts
        key="products"
        products={products}
        config={landingConfig?.products}
        storeSlug={tenant.slug}
      />
    ) : null,
    testimonials: hasTestimonials ? (
      <TenantTestimonials key="testimonials" config={landingConfig?.testimonials} tenant={tenant} />
    ) : null,
    cta: ctaEnabled ? <TenantCta key="cta" config={landingConfig?.cta} tenant={tenant} /> : null,
    contact: contactEnabled ? (
      <TenantContact key="contact" config={landingConfig?.contact} tenant={tenant} />
    ) : null,
  };

  return (
    <TemplateProvider initialTemplateId={landingConfig?.template}>
      <div className="container px-4 py-8 space-y-8">
        {/* 🚀 Render sections in custom order (from drag & drop) */}
        {sectionOrder.map((sectionKey) => sectionComponents[sectionKey]).filter(Boolean)}

        {/* Empty State */}
        {!hasAnySectionEnabled && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground mb-2">Landing page belum dikonfigurasi</p>
            <p className="text-sm text-muted-foreground">
              Aktifkan section di Dashboard &gt; Settings &gt; Landing
            </p>
          </div>
        )}
      </div>
    </TemplateProvider>
  );
}

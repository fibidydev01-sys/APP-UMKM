'use client';

import { extractHeroData, useHeroBlock } from '@/lib/landing';
import {
  Hero1,
  Hero2,
  Hero3,
  Hero4,
  Hero5,
  Hero6,
  Hero7,
} from './blocks';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@/types';

interface TenantHeroProps {
  config?: TenantLandingConfig['hero'];
  tenant: Tenant | PublicTenant;
}

/**
 * Tenant Hero Component
 *
 * Wrapper that selects and renders the appropriate hero block
 * based on the current template context
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title → tenant.heroTitle (fallback: tenant.name)
 * - subtitle → tenant.heroSubtitle (fallback: tenant.description)
 * - ctaText → tenant.heroCtaText
 * - ctaLink → tenant.heroCtaLink
 * - backgroundImage → tenant.heroBackgroundImage (fallback: tenant.banner)
 * - logo → tenant.logo
 * - storeName → tenant.name
 *
 * 🚀 BLOCK VARIANTS:
 * - hero1 → Centered (default)
 * - hero2 → Split Screen
 * - hero3 → Video Background
 * - hero4 → Parallax
 * - hero5 → Animated Gradient
 * - hero6 → Glass Morphism
 * - hero7 → Bento Grid
 */
export function TenantHero({ config, tenant }: TenantHeroProps) {
  const templateBlock = useHeroBlock();
  const block = config?.block || templateBlock;

  // Extract hero data directly from tenant (Data Contract fields)
  const heroData = extractHeroData(tenant, config ? { hero: config } : undefined);

  const commonProps = {
    title: heroData.title,
    subtitle: heroData.subtitle,
    ctaText: heroData.ctaText,
    ctaLink: heroData.ctaLink,
    showCta: true,
    backgroundImage: heroData.backgroundImage,
    logo: tenant.logo || undefined,
    storeName: tenant.name,
  };

  // Render appropriate block based on template
  switch (block) {
    case 'hero2':
      return <Hero2 {...commonProps} />;

    case 'hero3':
      return <Hero3 {...commonProps} />;

    case 'hero4':
      return <Hero4 {...commonProps} />;

    case 'hero5':
      return <Hero5 {...commonProps} />;

    case 'hero6':
      return <Hero6 {...commonProps} />;

    case 'hero7':
      return <Hero7 {...commonProps} />;

    // Default: hero1 (Centered)
    case 'hero1':
    default:
      return <Hero1 {...commonProps} />;
  }
}

'use client';

import { extractSectionText, getHeroConfig, extractBackgroundImage } from '@/lib/landing';
import { LANDING_CONSTANTS, useHeroBlock } from '@/lib/landing';
import {
  Hero1,
  Hero2,
  Hero3,
  Hero4,
  Hero5,
  Hero6,
  Hero7,
} from './blocks';
import type { TenantLandingConfig } from '@/types';

interface TenantHeroProps {
  config?: TenantLandingConfig['hero'];
  fallbacks?: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    logo?: string;
    storeName?: string;
  };
}

/**
 * Tenant Hero Component
 *
 * Wrapper that selects and renders the appropriate hero block
 * based on the current template context
 *
 * 🚀 v3.0 NUMBERING SYSTEM:
 * - hero1 → Centered (default)
 * - hero2 → Split Screen
 * - hero3 → Video Background
 * - hero4 → Parallax
 * - hero5 → Animated Gradient
 * - hero6 → Glass Morphism
 * - hero7 → Bento Grid
 *
 * 🎯 BLOCK PRIORITY:
 * 1. config.block (user override)
 * 2. template block (from TemplateProvider)
 */
export function TenantHero({ config, fallbacks = {} }: TenantHeroProps) {
  const templateBlock = useHeroBlock();
  const block = config?.block || templateBlock;

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || fallbacks.storeName,
    subtitle: fallbacks.subtitle,
  });

  const heroConfig = getHeroConfig(config);
  const showCta = heroConfig?.showCta ?? true;
  const ctaText = heroConfig?.ctaText || LANDING_CONSTANTS.CTA_TEXT_DEFAULT;
  const ctaLink = heroConfig?.ctaLink || '/products';
  const backgroundImage = extractBackgroundImage(heroConfig, fallbacks.backgroundImage);
  const overlayOpacity = heroConfig?.overlayOpacity ?? LANDING_CONSTANTS.OVERLAY_OPACITY_DEFAULT;

  const commonProps = {
    title,
    subtitle,
    ctaText,
    ctaLink,
    showCta,
    backgroundImage,
    logo: fallbacks.logo,
    storeName: fallbacks.storeName,
  };

  // 🚀 Render appropriate block based on template
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
      return <Hero1 {...commonProps} overlayOpacity={overlayOpacity} />;
  }
}

'use client';

import { extractSectionText, getHeroConfig, extractBackgroundImage } from '@/lib/landing';
import { LANDING_CONSTANTS, useHeroBlock } from '@/lib/landing';
import {
  HeroCentered,
  HeroSplit,
  HeroGlassMorphism,
  HeroVideoBackground,
  HeroAnimatedGradient,
  HeroParallax,
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
 * 🚀 IMPLEMENTED BLOCKS:
 * - default, centered-minimal, gradient-overlay → HeroCentered
 * - split-screen → HeroSplit
 * - glass-morphism → HeroGlassMorphism
 * - video-background → HeroVideoBackground
 * - animated-gradient → HeroAnimatedGradient
 * - parallax → HeroParallax
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
    case 'split-screen':
      return <HeroSplit {...commonProps} />;

    case 'glass-morphism':
      return <HeroGlassMorphism {...commonProps} />;

    case 'video-background':
      return <HeroVideoBackground {...commonProps} />;

    case 'animated-gradient':
      return <HeroAnimatedGradient {...commonProps} />;

    case 'parallax':
      return <HeroParallax {...commonProps} />;

    // Default blocks: default, centered-minimal, gradient-overlay
    default:
      return <HeroCentered {...commonProps} overlayOpacity={overlayOpacity} />;
  }
}

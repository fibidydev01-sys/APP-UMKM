'use client';

import { useStoreUrls } from '@/lib/store-url';
import { extractSectionText, getCtaConfig, extractCtaLink, extractCtaButtonText, useCtaBlock } from '@/lib/landing';
import { LANDING_CONSTANTS } from '@/lib/landing';
import {
  CtaDefault,
  CtaBoldCenter,
  CtaGradientBanner,
  CtaSplitAction,
  CtaFloating,
  CtaMinimalLine,
} from './blocks';
import type { TenantLandingConfig } from '@/types';

interface TenantCtaProps {
  config?: TenantLandingConfig['cta'];
  storeSlug?: string;
  fallbacks?: {
    title?: string;
    subtitle?: string;
    buttonLink?: string;
  };
}

/**
 * Tenant CTA Component
 *
 * Wrapper that selects and renders the appropriate block
 * based on the current template context
 *
 * 🚀 ALL 6 VARIANTS IMPLEMENTED:
 * - default -> CtaDefault
 * - bold-center -> CtaBoldCenter
 * - gradient-banner -> CtaGradientBanner
 * - split-action -> CtaSplitAction
 * - floating -> CtaFloating
 * - minimal-line -> CtaMinimalLine
 *
 * 🎯 BLOCK PRIORITY:
 * 1. config.block (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantCta({ config, storeSlug, fallbacks = {} }: TenantCtaProps) {
  const templateBlock = useCtaBlock();
  const block = config?.block || templateBlock;

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.CTA,
    subtitle: fallbacks.subtitle,
  });

  const ctaConfig = getCtaConfig(config);
  const buttonText = extractCtaButtonText(ctaConfig, LANDING_CONSTANTS.CTA_BUTTON_DEFAULT);
  const style = ctaConfig?.style || 'primary';

  // Smart URL routing
  const urls = storeSlug ? useStoreUrls(storeSlug) : null;
  const defaultLink = urls?.products() || fallbacks.buttonLink || '/products';
  const buttonLink = extractCtaLink(ctaConfig, defaultLink);

  const buttonVariant =
    style === 'outline' ? 'outline' : style === 'secondary' ? 'secondary' : 'default';

  const commonProps = {
    title,
    subtitle,
    buttonText,
    buttonLink,
    buttonVariant,
  };

  // Render appropriate block based on template
  switch (block) {
    case 'bold-center':
      return <CtaBoldCenter {...commonProps} />;

    case 'gradient-banner':
      return <CtaGradientBanner {...commonProps} />;

    case 'split-action':
      return <CtaSplitAction {...commonProps} />;

    case 'floating':
      return <CtaFloating {...commonProps} />;

    case 'minimal-line':
      return <CtaMinimalLine {...commonProps} />;

    // Default variant
    default:
      return <CtaDefault {...commonProps} />;
  }
}
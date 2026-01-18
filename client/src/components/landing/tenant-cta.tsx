'use client';

import { useStoreUrls } from '@/lib/store-url';
import { extractSectionText, getCtaConfig, extractCtaLink, extractCtaButtonText, useCtaVariant } from '@/lib/landing';
import { LANDING_CONSTANTS } from '@/lib/landing';
import {
  CtaDefault,
  CtaBoldCenter,
  CtaGradientBanner,
  CtaSplitAction,
  CtaFloating,
  CtaMinimalLine,
} from './variants';
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
 * Wrapper that selects and renders the appropriate CTA variant
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
 * 🎯 VARIANT PRIORITY:
 * 1. config.variant (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantCta({ config, storeSlug, fallbacks = {} }: TenantCtaProps) {
  const templateVariant = useCtaVariant();
  const variant = config?.variant || templateVariant;

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

  // Render appropriate variant based on template
  switch (variant) {
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
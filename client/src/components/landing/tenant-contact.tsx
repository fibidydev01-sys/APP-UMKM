'use client';

import { extractSectionText, useContactVariant } from '@/lib/landing';
import { LANDING_CONSTANTS } from '@/lib/landing';
import {
  ContactDefault,
  ContactSplitForm,
  ContactCentered,
  ContactMapFocus,
  ContactMinimal,
  ContactSocialFocused,
} from './variants';
import type { TenantLandingConfig } from '@/types';

interface TenantContactProps {
  config?: TenantLandingConfig['contact'];
  fallbacks?: {
    title?: string;
    subtitle?: string;
    whatsapp?: string | null;
    phone?: string | null;
    address?: string | null;
    storeName?: string;
  };
}

/**
 * Tenant Contact Component
 *
 * Wrapper that selects and renders the appropriate contact variant
 * based on the current template context
 *
 * 🚀 ALL 6 VARIANTS IMPLEMENTED:
 * - default -> ContactDefault
 * - split-form -> ContactSplitForm
 * - centered -> ContactCentered
 * - map-focus -> ContactMapFocus
 * - minimal -> ContactMinimal
 * - social-focused -> ContactSocialFocused
 *
 * 🎯 VARIANT PRIORITY:
 * 1. config.variant (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantContact({ config, fallbacks = {} }: TenantContactProps) {
  const templateVariant = useContactVariant();
  const variant = config?.variant || templateVariant;

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.CONTACT,
    subtitle: fallbacks.subtitle,
  });

  const commonProps = {
    title,
    subtitle,
    whatsapp: fallbacks.whatsapp,
    phone: fallbacks.phone,
    address: fallbacks.address,
    storeName: fallbacks.storeName,
  };

  // Render appropriate variant based on template
  switch (variant) {
    case 'split-form':
      return <ContactSplitForm {...commonProps} />;

    case 'centered':
      return <ContactCentered {...commonProps} />;

    case 'map-focus':
      return <ContactMapFocus {...commonProps} />;

    case 'minimal':
      return <ContactMinimal {...commonProps} />;

    case 'social-focused':
      return <ContactSocialFocused {...commonProps} />;

    // Default variant
    default:
      return <ContactDefault {...commonProps} />;
  }
}
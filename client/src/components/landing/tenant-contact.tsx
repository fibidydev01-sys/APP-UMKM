'use client';

import { extractContactData, useContactBlock } from '@/lib/landing';
import {
  Contact1,
  Contact2,
  Contact3,
  Contact4,
  Contact5,
  Contact6,
  Contact7,
} from './blocks';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@/types';

interface TenantContactProps {
  config?: TenantLandingConfig['contact'];
  tenant: Tenant | PublicTenant;
}

/**
 * Tenant Contact Component
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title → tenant.contactTitle
 * - subtitle → tenant.contactSubtitle
 * - whatsapp → tenant.whatsapp
 * - phone → tenant.phone
 * - email → tenant.email
 * - address → tenant.address
 * - storeName → tenant.name
 *
 * 🚀 BLOCK VARIANTS:
 * - contact1 → Default
 * - contact2 → Split Layout
 * - contact3 → Centered
 * - contact4 → Map Focus
 * - contact5 → Minimal
 * - contact6 → Social Focused
 * - contact7 → Card Grid
 */
export function TenantContact({ config, tenant }: TenantContactProps) {
  const templateBlock = useContactBlock();
  const block = config?.block || templateBlock;

  // Extract contact data directly from tenant (Data Contract fields)
  const contactData = extractContactData(tenant, config ? { contact: config } : undefined);

  const commonProps = {
    title: contactData.title,
    subtitle: contactData.subtitle,
    whatsapp: contactData.whatsapp,
    phone: contactData.phone,
    email: contactData.email,
    address: contactData.address,
    storeName: tenant.name,
  };

  // Render appropriate block based on template
  switch (block) {
    case 'contact2':
      return <Contact2 {...commonProps} />;

    case 'contact3':
      return <Contact3 {...commonProps} />;

    case 'contact4':
      return <Contact4 {...commonProps} />;

    case 'contact5':
      return <Contact5 {...commonProps} />;

    case 'contact6':
      return <Contact6 {...commonProps} />;

    case 'contact7':
      return <Contact7 {...commonProps} />;

    // Default: contact1 (Default)
    case 'contact1':
    default:
      return <Contact1 {...commonProps} />;
  }
}

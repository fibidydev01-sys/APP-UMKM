'use client';

import { lazy, Suspense, type ComponentType } from 'react';
import { extractContactData, useContactBlock } from '@/lib/landing-templates';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@umkm/shared/types';

interface TenantContactProps {
  config?: TenantLandingConfig['contact'];
  tenant: Tenant | PublicTenant;
}

interface ContactBlockProps {
  title: string;
  subtitle: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  address?: string;
  storeName: string;
  mapUrl?: string;
  showMap: boolean;
  showForm: boolean;
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
 * - mapUrl → tenant.contactMapUrl
 * - showMap → tenant.contactShowMap
 * - showForm → tenant.contactShowForm
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
    mapUrl: contactData.mapUrl,
    showMap: contactData.showMap,
    showForm: contactData.showForm,
  };

  // 🚀 SMART: Dynamic component loading
  const blockNumber = block.replace('contact', '');
  const ContactComponent = lazy<ComponentType<ContactBlockProps>>(() =>
    import(`./blocks/contact/contact${blockNumber}`)
      .then((mod) => ({
        default: mod[`Contact${blockNumber}`] as ComponentType<ContactBlockProps>,
      }))
      .catch(() =>
        import('./blocks/contact/contact1').then((mod) => ({
          default: mod.Contact1 as ComponentType<ContactBlockProps>,
        }))
      )
  );

  // Render with Suspense for lazy loading
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactComponent {...commonProps} />
    </Suspense>
  );
}

function ContactSkeleton() {
  return (
    <div className="min-h-screen w-full animate-pulse bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

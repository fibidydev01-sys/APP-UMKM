// ══════════════════════════════════════════════════════════════
// TOKO CLIENT - Instant Tabs (Hero Section, About, Testimonials, Contact, CTA)
// Pattern: Same as Dashboard & Auto-Reply (Sticky tabs + State switching)
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { Home, FileText, MessageSquare, MapPin, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Import tab content components (we'll create these next)
import { HeroSectionTab } from './tabs/hero-section-tab';
import { AboutTab } from './tabs/about-tab';
import { TestimonialsTab } from './tabs/testimonials-tab';
import { ContactTab } from './tabs/contact-tab';
import { CtaTab } from './tabs/cta-tab';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type TabType = 'hero-section' | 'about' | 'testimonials' | 'contact' | 'cta';

const TABS = [
  {
    id: 'hero-section' as const,
    label: 'Hero Section',
    icon: Home,
    description: 'Banner utama dan branding toko',
  },
  {
    id: 'about' as const,
    label: 'About',
    icon: FileText,
    description: 'Tentang toko dan fitur unggulan',
  },
  {
    id: 'testimonials' as const,
    label: 'Testimonials',
    icon: MessageSquare,
    description: 'Testimoni pelanggan',
  },
  {
    id: 'contact' as const,
    label: 'Contact',
    icon: MapPin,
    description: 'Informasi kontak dan lokasi',
  },
  {
    id: 'cta' as const,
    label: 'Call to Action',
    icon: Megaphone,
    description: 'Ajakan untuk mengambil tindakan',
  },
];

// ══════════════════════════════════════════════════════════════
// MAIN CLIENT COMPONENT
// ══════════════════════════════════════════════════════════════

export function TokoClient() {
  const [activeTab, setActiveTab] = useState<TabType>('hero-section'); // Default: Hero Section
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div>
      {/* ════════════════════════════════════════════════════════ */}
      {/* STICKY TABS                                             */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 mb-6">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center justify-center gap-2 flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB DESCRIPTION                                          */}
      {/* ════════════════════════════════════════════════════════ */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>{currentTab.label}</strong> - {currentTab.description}
        </AlertDescription>
      </Alert>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB CONTENT - Instant switching (no routing)            */}
      {/* ════════════════════════════════════════════════════════ */}
      <div>
        {activeTab === 'hero-section' && <HeroSectionTab />}
        {activeTab === 'about' && <AboutTab />}
        {activeTab === 'testimonials' && <TestimonialsTab />}
        {activeTab === 'contact' && <ContactTab />}
        {activeTab === 'cta' && <CtaTab />}
      </div>
    </div>
  );
}

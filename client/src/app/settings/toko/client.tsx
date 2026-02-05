// ══════════════════════════════════════════════════════════════
// TOKO CLIENT - Sticky Tabs Wrapper for Wizard Pages
// ══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { Home, FileText, MessageSquare, MapPin, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Import wizard pages as components
import HeroSectionPage from '../hero-section/page';
import AboutPage from '../about/page';
import TestimonialsPage from '../testimonials/page';
import ContactPage from '../contact/page';
import CtaPage from '../cta/page';

// ══════════════════════════════════════════════════════════════
// TYPES & CONSTANTS
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
// MAIN CLIENT COMPONENT - WRAPPER ONLY
// ══════════════════════════════════════════════════════════════

export function TokoClient() {
  const [activeTab, setActiveTab] = useState<TabType>('hero-section');
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div>
      {/* ════════════════════════════════════════════════════════ */}
      {/* PAGE HEADER                                             */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Informasi Toko</h1>
        <p className="text-muted-foreground mt-2">
          Kelola informasi toko dan konten landing page langkah per langkah.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* STICKY TABS                                             */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 mb-6">
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
      {/* TAB CONTENT - Import wizard pages as components         */}
      {/* ════════════════════════════════════════════════════════ */}
      <div>
        {activeTab === 'hero-section' && <HeroSectionPage />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'testimonials' && <TestimonialsPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'cta' && <CtaPage />}
      </div>
    </div>
  );
}

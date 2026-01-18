/**
 * BuilderSidebar Component
 *
 * Fixed sidebar with 6 section buttons (Hero, About, Products, Testimonials, Contact, CTA)
 */

'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Info,
  ShoppingBag,
  MessageSquare,
  Phone,
  Megaphone,
} from 'lucide-react';

export type SectionType = 'hero' | 'about' | 'products' | 'testimonials' | 'contact' | 'cta';

interface Section {
  id: SectionType;
  label: string;
  icon: typeof Sparkles;
  description: string;
}

const sections: Section[] = [
  {
    id: 'hero',
    label: 'Hero',
    icon: Sparkles,
    description: 'Banner utama',
  },
  {
    id: 'about',
    label: 'About',
    icon: Info,
    description: 'Tentang toko',
  },
  {
    id: 'products',
    label: 'Products',
    icon: ShoppingBag,
    description: 'Katalog produk',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: MessageSquare,
    description: 'Testimoni pelanggan',
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: Phone,
    description: 'Informasi kontak',
  },
  {
    id: 'cta',
    label: 'CTA',
    icon: Megaphone,
    description: 'Call to action',
  },
];

interface BuilderSidebarProps {
  activeSection: SectionType | null;
  onSectionClick: (section: SectionType) => void;
  className?: string;
}

export function BuilderSidebar({
  activeSection,
  onSectionClick,
  className,
}: BuilderSidebarProps) {
  return (
    <div className={cn('w-64 border-r bg-muted/30 p-4 space-y-2', className)}>
      <h3 className="font-semibold text-sm text-muted-foreground mb-4 px-2">
        SECTIONS
      </h3>

      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <Button
            key={section.id}
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3 h-auto py-3',
              isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
            )}
            onClick={() => onSectionClick(section.id)}
          >
            <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
            <div className="flex-1 text-left">
              <div className="font-medium">{section.label}</div>
              <div className="text-xs text-muted-foreground">
                {section.description}
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}

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
  collapsed?: boolean;
  className?: string;
}

export function BuilderSidebar({
  activeSection,
  onSectionClick,
  collapsed = false,
  className,
}: BuilderSidebarProps) {
  return (
    <div
      className={cn(
        'border-r bg-muted/30 p-4 space-y-2 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {!collapsed && (
        <h3 className="font-semibold text-sm text-muted-foreground mb-4 px-2">
          SECTIONS
        </h3>
      )}

      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <Button
            key={section.id}
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'w-full h-auto transition-all',
              collapsed
                ? 'justify-center p-3'
                : 'justify-start gap-3 py-3',
              isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
            )}
            onClick={() => onSectionClick(section.id)}
            title={collapsed ? section.label : undefined}
          >
            <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
            {!collapsed && (
              <div className="flex-1 text-left">
                <div className="font-medium">{section.label}</div>
                <div className="text-xs text-muted-foreground">
                  {section.description}
                </div>
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );
}

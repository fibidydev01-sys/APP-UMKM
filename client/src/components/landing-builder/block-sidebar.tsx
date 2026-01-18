/**
 * BlockSidebar Component - Canva-Style
 *
 * Icon toolbar with hover panel overlay
 * Panel floats on top (z-index), doesn't push content
 */

'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Check,
  Layers,
  Minimize2,
  Grid3x3,
  Film,
  Move,
  Sparkles,
  GlassWater,
  LayoutGrid,
  Cloud,
  SplitSquareHorizontal,
  Circle,
  Clock,
  BookOpen,
  ArrowDownUp,
  Quote,
  Hash,
  MapPin,
  Mail,
  Megaphone,
  ThumbsUp,
  Video,
  List,
  Focus,
  Timer,
  Star,
  Users,
  MessageSquare,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { SectionType } from './builder-sidebar';

interface BlockOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

/**
 * v3.0 NUMBERING SYSTEM - 7 blocks each
 */
const HERO_BLOCKS: BlockOption[] = [
  { value: 'hero1', label: 'hero1', icon: Minimize2 },
  { value: 'hero2', label: 'hero2', icon: SplitSquareHorizontal },
  { value: 'hero3', label: 'hero3', icon: Film },
  { value: 'hero4', label: 'hero4', icon: Move },
  { value: 'hero5', label: 'hero5', icon: Sparkles },
  { value: 'hero6', label: 'hero6', icon: GlassWater },
  { value: 'hero7', label: 'hero7', icon: LayoutGrid },
];

const ABOUT_BLOCKS: BlockOption[] = [
  { value: 'about1', label: 'about1', icon: Grid3x3 },
  { value: 'about2', label: 'about2', icon: SplitSquareHorizontal },
  { value: 'about3', label: 'about3', icon: Circle },
  { value: 'about4', label: 'about4', icon: Clock },
  { value: 'about5', label: 'about5', icon: Grid3x3 },
  { value: 'about6', label: 'about6', icon: BookOpen },
  { value: 'about7', label: 'about7', icon: MessageSquare },
];

const PRODUCTS_BLOCKS: BlockOption[] = [
  { value: 'products1', label: 'products1', icon: Grid3x3 },
  { value: 'products2', label: 'products2', icon: Grid3x3 },
  { value: 'products3', label: 'products3', icon: LayoutGrid },
  { value: 'products4', label: 'products4', icon: ArrowDownUp },
  { value: 'products5', label: 'products5', icon: BookOpen },
  { value: 'products6', label: 'products6', icon: List },
  { value: 'products7', label: 'products7', icon: Star },
];

const TESTIMONIALS_BLOCKS: BlockOption[] = [
  { value: 'testimonials1', label: 'testimonials1', icon: Grid3x3 },
  { value: 'testimonials2', label: 'testimonials2', icon: ArrowDownUp },
  { value: 'testimonials3', label: 'testimonials3', icon: Quote },
  { value: 'testimonials4', label: 'testimonials4', icon: Focus },
  { value: 'testimonials5', label: 'testimonials5', icon: Video },
  { value: 'testimonials6', label: 'testimonials6', icon: ThumbsUp },
  { value: 'testimonials7', label: 'testimonials7', icon: Zap },
];

const CONTACT_BLOCKS: BlockOption[] = [
  { value: 'contact1', label: 'contact1', icon: Mail },
  { value: 'contact2', label: 'contact2', icon: SplitSquareHorizontal },
  { value: 'contact3', label: 'contact3', icon: Circle },
  { value: 'contact4', label: 'contact4', icon: MapPin },
  { value: 'contact5', label: 'contact5', icon: Minimize2 },
  { value: 'contact6', label: 'contact6', icon: Hash },
  { value: 'contact7', label: 'contact7', icon: Grid3x3 },
];

const CTA_BLOCKS: BlockOption[] = [
  { value: 'cta1', label: 'cta1', icon: Megaphone },
  { value: 'cta2', label: 'cta2', icon: Megaphone },
  { value: 'cta3', label: 'cta3', icon: Layers },
  { value: 'cta4', label: 'cta4', icon: SplitSquareHorizontal },
  { value: 'cta5', label: 'cta5', icon: Cloud },
  { value: 'cta6', label: 'cta6', icon: Minimize2 },
  { value: 'cta7', label: 'cta7', icon: Timer },
];

const BLOCK_OPTIONS_MAP = {
  hero: HERO_BLOCKS,
  about: ABOUT_BLOCKS,
  products: PRODUCTS_BLOCKS,
  testimonials: TESTIMONIALS_BLOCKS,
  contact: CONTACT_BLOCKS,
  cta: CTA_BLOCKS,
} as const;

const SECTION_ICONS: Record<SectionType, LucideIcon> = {
  hero: Sparkles,
  about: Users,
  products: Grid3x3,
  testimonials: Quote,
  contact: Mail,
  cta: Megaphone,
};

interface BlockSidebarProps {
  section: SectionType | null;
  currentBlock?: string;
  onBlockSelect: (block: string) => void;
  onBack: () => void;
  onSectionHover: (section: SectionType | null) => void;
  className?: string;
}

/**
 * Canva-style sidebar with icon toolbar + hover panel
 */
export function BlockSidebar({
  section,
  currentBlock,
  onBlockSelect,
  onBack,
  onSectionHover,
  className,
}: BlockSidebarProps) {
  const [hoveredSection, setHoveredSection] = useState<SectionType | null>(null);
  const activeSection = hoveredSection || section;
  const blocks = activeSection ? BLOCK_OPTIONS_MAP[activeSection] : null;

  const handleMouseEnter = (sectionType: SectionType) => {
    setHoveredSection(sectionType);
    onSectionHover(sectionType);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
    onSectionHover(null);
  };

  return (
    <div className={cn('relative flex', className)}>
      {/* Icon Toolbar - Always visible */}
      <div className="w-16 bg-background border-r flex flex-col items-center py-2 gap-1">
        {(Object.keys(SECTION_ICONS) as SectionType[]).map((sectionType) => {
          const Icon = SECTION_ICONS[sectionType];
          const isActive = activeSection === sectionType;

          return (
            <button
              key={sectionType}
              onMouseEnter={() => handleMouseEnter(sectionType)}
              className={cn(
                'w-12 h-14 flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium capitalize">{sectionType}</span>
            </button>
          );
        })}
      </div>

      {/* Floating Panel - Shows on hover, z-index overlay */}
      {activeSection && blocks && (
        <div
          className="absolute left-16 top-0 bottom-0 w-56 bg-background border-r shadow-xl z-50"
          onMouseEnter={() => setHoveredSection(activeSection)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Panel Header */}
          <div className="p-3 border-b">
            <h3 className="font-semibold text-sm capitalize">{activeSection}</h3>
            <p className="text-xs text-muted-foreground">Select block</p>
          </div>

          {/* Block Grid */}
          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="p-2 grid grid-cols-2 gap-1.5">
              {blocks.map((block) => {
                const isSelected = currentBlock === block.value;
                const Icon = block.icon;

                return (
                  <button
                    key={block.value}
                    onClick={() => {
                      onBlockSelect(block.value);
                      setHoveredSection(null);
                    }}
                    className={cn(
                      'flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all aspect-square',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-transparent bg-muted/50 hover:border-primary/50 hover:bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium">{block.label}</span>
                    {isSelected && <Check className="h-3 w-3 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

// Export blocks for external use
export { HERO_BLOCKS, ABOUT_BLOCKS, PRODUCTS_BLOCKS, TESTIMONIALS_BLOCKS, CONTACT_BLOCKS, CTA_BLOCKS };

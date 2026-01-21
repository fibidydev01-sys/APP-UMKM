/**
 * BlockDrawer Component - Mobile-First
 *
 * Vaul drawer that slides from bottom
 * Shows block grid for the selected section
 * Better UX: peek support, mobile-friendly, doesn't block view
 */

'use client';

import { Drawer } from 'vaul';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Check,
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
  MessageSquare,
  Zap,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import type { SectionType } from './builder-sidebar';

interface BlockOption {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

/**
 * v3.0 NUMBERING SYSTEM - 7 blocks each
 */
const HERO_BLOCKS: BlockOption[] = [
  { value: 'hero1', label: 'hero1', icon: Minimize2, description: 'Centered' },
  { value: 'hero2', label: 'hero2', icon: SplitSquareHorizontal, description: 'Split Screen' },
  { value: 'hero3', label: 'hero3', icon: Film, description: 'Video Background' },
  { value: 'hero4', label: 'hero4', icon: Move, description: 'Parallax' },
  { value: 'hero5', label: 'hero5', icon: Sparkles, description: 'Animated Gradient' },
  { value: 'hero6', label: 'hero6', icon: GlassWater, description: 'Glass Morphism' },
  { value: 'hero7', label: 'hero7', icon: LayoutGrid, description: 'Bento Grid' },
];

const ABOUT_BLOCKS: BlockOption[] = [
  { value: 'about1', label: 'about1', icon: Grid3x3, description: 'Grid' },
  { value: 'about2', label: 'about2', icon: SplitSquareHorizontal, description: 'Side by Side' },
  { value: 'about3', label: 'about3', icon: Circle, description: 'Centered' },
  { value: 'about4', label: 'about4', icon: Clock, description: 'Timeline' },
  { value: 'about5', label: 'about5', icon: Grid3x3, description: 'Cards' },
  { value: 'about6', label: 'about6', icon: BookOpen, description: 'Magazine' },
  { value: 'about7', label: 'about7', icon: MessageSquare, description: 'Storytelling' },
];

const PRODUCTS_BLOCKS: BlockOption[] = [
  { value: 'products1', label: 'products1', icon: Grid3x3, description: 'Grid' },
  { value: 'products2', label: 'products2', icon: Grid3x3, description: 'Grid Hover' },
  { value: 'products3', label: 'products3', icon: LayoutGrid, description: 'Masonry' },
  { value: 'products4', label: 'products4', icon: ArrowDownUp, description: 'Carousel' },
  { value: 'products5', label: 'products5', icon: BookOpen, description: 'Catalog' },
  { value: 'products6', label: 'products6', icon: List, description: 'Minimal List' },
  { value: 'products7', label: 'products7', icon: Star, description: 'Featured Hero' },
];

const TESTIMONIALS_BLOCKS: BlockOption[] = [
  { value: 'testimonials1', label: 'testimonials1', icon: Grid3x3, description: 'Grid Cards' },
  { value: 'testimonials2', label: 'testimonials2', icon: ArrowDownUp, description: 'Card Slider' },
  { value: 'testimonials3', label: 'testimonials3', icon: Quote, description: 'Quote Highlight' },
  { value: 'testimonials4', label: 'testimonials4', icon: Focus, description: 'Single Focus' },
  { value: 'testimonials5', label: 'testimonials5', icon: Video, description: 'Video' },
  { value: 'testimonials6', label: 'testimonials6', icon: ThumbsUp, description: 'Social Proof' },
  { value: 'testimonials7', label: 'testimonials7', icon: Zap, description: 'Marquee' },
];

const CONTACT_BLOCKS: BlockOption[] = [
  { value: 'contact1', label: 'contact1', icon: Mail, description: 'Default' },
  { value: 'contact2', label: 'contact2', icon: SplitSquareHorizontal, description: 'Split Form' },
  { value: 'contact3', label: 'contact3', icon: Circle, description: 'Centered' },
  { value: 'contact4', label: 'contact4', icon: MapPin, description: 'Map Focus' },
  { value: 'contact5', label: 'contact5', icon: Minimize2, description: 'Minimal' },
  { value: 'contact6', label: 'contact6', icon: Hash, description: 'Social Focused' },
  { value: 'contact7', label: 'contact7', icon: Grid3x3, description: 'Card Grid' },
];

const CTA_BLOCKS: BlockOption[] = [
  { value: 'cta1', label: 'cta1', icon: Megaphone, description: 'Default' },
  { value: 'cta2', label: 'cta2', icon: Megaphone, description: 'Bold Center' },
  { value: 'cta3', label: 'cta3', icon: Layers, description: 'Gradient Banner' },
  { value: 'cta4', label: 'cta4', icon: SplitSquareHorizontal, description: 'Split Action' },
  { value: 'cta5', label: 'cta5', icon: Cloud, description: 'Floating' },
  { value: 'cta6', label: 'cta6', icon: Minimize2, description: 'Minimal Line' },
  { value: 'cta7', label: 'cta7', icon: Timer, description: 'Countdown' },
];

const BLOCK_OPTIONS_MAP = {
  hero: HERO_BLOCKS,
  about: ABOUT_BLOCKS,
  products: PRODUCTS_BLOCKS,
  testimonials: TESTIMONIALS_BLOCKS,
  contact: CONTACT_BLOCKS,
  cta: CTA_BLOCKS,
} as const;

interface BlockDrawerProps {
  expanded: boolean; // 🚀 Collapsed (just header) vs Expanded (full height)
  onToggleExpanded: () => void;
  section: SectionType;
  currentBlock?: string;
  sectionEnabled?: boolean;
  onBlockSelect: (block: string) => void;
  onToggleSection?: (enabled: boolean) => void;
}

/**
 * Vaul drawer for block selection
 * Always visible at bottom with collapsed/expanded states
 * Collapsed: just header visible
 * Expanded: full height with blocks
 */
export function BlockDrawer({
  expanded,
  onToggleExpanded,
  section,
  currentBlock,
  sectionEnabled = true,
  onBlockSelect,
  onToggleSection,
}: BlockDrawerProps) {
  const blocks = BLOCK_OPTIONS_MAP[section];

  return (
    <Drawer.Root
      open={true} // 🚀 Always open (always visible)
      modal={false} // 🚀 Don't block interaction with page
      dismissible={false} // 🚀 Can't be dismissed by dragging down
    >
      <Drawer.Portal>
        {/* No overlay - drawer is not modal */}
        <Drawer.Content
          className={cn(
            'bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg transition-all duration-300',
            expanded ? 'h-[80vh]' : 'h-auto' // 🚀 Dynamic height
          )}
        >
          {/* Drag Handle - Click to expand/collapse */}
          <button
            onClick={onToggleExpanded}
            className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mt-4 cursor-pointer hover:bg-muted-foreground/40 transition-colors"
            aria-label={expanded ? 'Collapse drawer' : 'Expand drawer'}
          />

          {/* Header - Always visible */}
          <div className="p-4 border-b flex-shrink-0 cursor-pointer" onClick={onToggleExpanded}>
            <div className="flex items-center justify-between">
              <div>
                <Drawer.Title className="font-semibold text-lg capitalize">
                  {section} Blocks
                </Drawer.Title>
                {!expanded && (
                  <Drawer.Description className="text-sm text-muted-foreground mt-1">
                    Click to expand
                  </Drawer.Description>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpanded();
                }}
              >
                {expanded ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </div>

          {/* Content - Only show when expanded */}
          {expanded && (
            <>
              {/* Section Toggle */}
              {onToggleSection && (
                <div className="px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="drawer-section-toggle" className="text-sm font-medium">
                        Section Aktif
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sectionEnabled
                          ? 'Section akan ditampilkan di landing page'
                          : 'Section tidak akan ditampilkan'}
                      </p>
                    </div>
                    <Switch
                      id="drawer-section-toggle"
                      checked={sectionEnabled}
                      onCheckedChange={onToggleSection}
                    />
                  </div>
                </div>
              )}

              {/* Block Grid - Scrollable */}
              <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {blocks.map((block) => {
                const isSelected = currentBlock === block.value;
                const Icon = block.icon;

                return (
                  <button
                    key={block.value}
                    onClick={() => onBlockSelect(block.value)}
                    className={cn(
                      'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all aspect-square hover:shadow-md',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary shadow-md'
                        : 'border-transparent bg-muted/50 hover:border-primary/50 hover:bg-muted'
                    )}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-xs font-medium">{block.label}</span>
                    {isSelected && <Check className="h-4 w-4 mt-1 text-primary" />}
                  </button>
                );
              })}
            </div>

            {/* Current Selection Info */}
            {currentBlock && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg max-w-4xl mx-auto">
                <p className="text-sm font-medium">
                  Selected: <span className="text-primary">{currentBlock}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {blocks.find((b) => b.value === currentBlock)?.description}
                </p>
              </div>
            )}
              </div>
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// Export blocks for external use
export { HERO_BLOCKS, ABOUT_BLOCKS, PRODUCTS_BLOCKS, TESTIMONIALS_BLOCKS, CONTACT_BLOCKS, CTA_BLOCKS };

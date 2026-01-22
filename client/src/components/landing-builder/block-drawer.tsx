/**
 * BlockDrawer Component - Mobile-First
 *
 * Vaul drawer that slides from bottom
 * Shows block grid for the selected section
 * Better UX: peek support, mobile-friendly, doesn't block view
 */

'use client';

import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Check,
  X,
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

export type DrawerState = 'closed' | 'minimized' | 'collapsed' | 'expanded';

interface BlockDrawerProps {
  state: DrawerState; // 🚀 4 states: closed, minimized, collapsed, expanded
  onStateChange: (state: DrawerState) => void;
  onClose: () => void; // 🚀 Close button handler
  section: SectionType;
  currentBlock?: string;
  sectionEnabled?: boolean;
  onBlockSelect: (block: string) => void;
  onToggleSection?: (enabled: boolean) => void;
}

/**
 * Vaul drawer for block selection
 * 4 States System:
 * - CLOSED: Completely hidden (Close button only)
 * - MINIMIZED: Ciut - just handle visible (~40px)
 * - COLLAPSED: Peek - header + toggle (~15% viewport)
 * - EXPANDED: Full - all content (~80% viewport)
 */
export function BlockDrawer({
  state,
  onStateChange,
  onClose,
  section,
  currentBlock,
  sectionEnabled = true,
  onBlockSelect,
  onToggleSection,
}: BlockDrawerProps) {
  const blocks = BLOCK_OPTIONS_MAP[section];

  // Map state to snap point fraction
  const getSnapPoint = (drawerState: DrawerState): number => {
    switch (drawerState) {
      case 'minimized': return 0.05; // 5% - ciut (just handle)
      case 'collapsed': return 0.15; // 15% - peek
      case 'expanded': return 0.8; // 80% - full
      default: return 0.15;
    }
  };

  // Map snap point to state
  const getStateFromSnap = (snap: number): DrawerState => {
    if (snap >= 0.7) return 'expanded';
    if (snap >= 0.1) return 'collapsed';
    return 'minimized';
  };

  if (state === 'closed') {
    return null; // Don't render when closed
  }

  return (
    <Drawer.Root
      open={true} // 🚀 Always open (when not closed)
      onOpenChange={() => {}} // Required prop, no-op for now
      noBodyStyles
    >
      <Drawer.Portal>
        {/* Light overlay for visual separation */}
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[9998]" />

        <Drawer.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-[9999] flex h-auto max-h-[80vh] flex-col rounded-t-[20px] bg-background"
          )}
          aria-describedby="block-drawer-description"
        >
          {/* Accessibility - Hidden title/description */}
          <Drawer.Title asChild>
            <VisuallyHidden.Root>
              Select {section} block
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="block-drawer-description">
              Choose a block design for the {section} section
            </VisuallyHidden.Root>
          </Drawer.Description>
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* TEST HEADER - Simple version */}
          <div className="p-6 border-b shrink-0">
            <h2 className="text-xl font-bold">🚀 DRAWER TEST!</h2>
            <p className="text-muted-foreground">Section: {section}</p>
            <p className="text-sm text-green-600 font-mono">If you see this, drawer is WORKING! ✅</p>
          </div>

          {/* TEST CONTENT - Simple version */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-blue-900 dark:text-blue-100">✅ Drawer is rendering!</p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">State: {state}</p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-900 dark:text-green-100">Section: {section}</p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">Current block: {currentBlock || 'none'}</p>
              </div>

              <Button onClick={onClose} className="w-full">
                Close Drawer (Test)
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// Export blocks for external use
export { HERO_BLOCKS, ABOUT_BLOCKS, PRODUCTS_BLOCKS, TESTIMONIALS_BLOCKS, CONTACT_BLOCKS, CTA_BLOCKS };

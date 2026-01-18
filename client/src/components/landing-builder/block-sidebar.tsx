/**
 * BlockSidebar Component
 *
 * Canva-style block selector sidebar
 * Shows block options when a section is selected
 */

'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Check,
  ChevronLeft,
  Layers,
  Minimize2,
  Grid3x3,
  Film,
  Move,
  Sparkles,
  GlassWater,
  LayoutGrid,
  Cloud,
  Focus,
  Waves,
  Zap,
  Brush,
  Type,
  Maximize2,
  SplitSquareHorizontal,
  Circle,
  Clock,
  BookOpen,
  Image as ImageIcon,
  BarChart3,
  Images,
  Tags,
  ChevronDown,
  Users,
  GitCompare,
  ArrowDownUp,
  Filter,
  Tag,
  Table2,
  DollarSign,
  Eye,
  FolderOpen,
  MessageSquare,
  Star,
  UserCircle2,
  Quote,
  TrendingUp,
  Hash,
  MapPin,
  Send,
  Phone as PhoneIcon,
  MessageCircle,
  HelpCircle,
  Building2,
  Mail,
  Megaphone,
  Rocket,
  Timer,
  CreditCard,
  Trophy,
  ThumbsUp,
  Video,
  Smartphone,
  List,
} from 'lucide-react';
import type { SectionType } from './builder-sidebar';

interface BlockOption {
  value: string;
  label: string;
  description: string;
  icon: any;
}

/**
 * v3.0 NUMBERING SYSTEM
 * See MAPPING.md for design name references
 */
const HERO_BLOCKS: BlockOption[] = [
  { value: 'hero1', label: 'hero1', description: 'Centered - Classic centered hero', icon: Minimize2 },
  { value: 'hero2', label: 'hero2', description: 'Split Screen - Content left, image right', icon: SplitSquareHorizontal },
  { value: 'hero3', label: 'hero3', description: 'Video Background - Click to play video', icon: Film },
  { value: 'hero4', label: 'hero4', description: 'Parallax - Scrolling effect', icon: Move },
  { value: 'hero5', label: 'hero5', description: 'Animated Gradient - Light rays effect', icon: Sparkles },
  { value: 'hero6', label: 'hero6', description: 'Glass Morphism - Blur effects', icon: GlassWater },
];

const ABOUT_BLOCKS: BlockOption[] = [
  { value: 'about1', label: 'about1', description: 'Grid - Features showcase', icon: Grid3x3 },
  { value: 'about2', label: 'about2', description: 'Side by Side - Image and content', icon: SplitSquareHorizontal },
  { value: 'about3', label: 'about3', description: 'Centered - Clean typography', icon: Circle },
  { value: 'about4', label: 'about4', description: 'Timeline - Story layout', icon: Clock },
  { value: 'about5', label: 'about5', description: 'Cards - Feature highlights', icon: Grid3x3 },
  { value: 'about6', label: 'about6', description: 'Magazine - Editorial layout', icon: BookOpen },
  { value: 'about7', label: 'about7', description: 'Storytelling - Narrative layout', icon: Type },
];

const PRODUCTS_BLOCKS: BlockOption[] = [
  { value: 'products1', label: 'products1', description: 'Grid - Clean product grid', icon: Grid3x3 },
  { value: 'products2', label: 'products2', description: 'Grid Hover - Interactive effects', icon: Grid3x3 },
  { value: 'products3', label: 'products3', description: 'Masonry - Pinterest-style', icon: LayoutGrid },
  { value: 'products4', label: 'products4', description: 'Carousel - Sliding showcase', icon: ArrowDownUp },
  { value: 'products5', label: 'products5', description: 'Catalog - List view', icon: BookOpen },
  { value: 'products6', label: 'products6', description: 'Minimal List - Minimalist', icon: List },
];

const TESTIMONIALS_BLOCKS: BlockOption[] = [
  { value: 'testimonials1', label: 'testimonials1', description: 'Grid Cards - Card grid', icon: Grid3x3 },
  { value: 'testimonials2', label: 'testimonials2', description: 'Card Slider - Sliding cards', icon: ArrowDownUp },
  { value: 'testimonials3', label: 'testimonials3', description: 'Quote Highlight - Featured quote', icon: Quote },
  { value: 'testimonials4', label: 'testimonials4', description: 'Single Focus - One at a time', icon: Focus },
  { value: 'testimonials5', label: 'testimonials5', description: 'Video - Video testimonials', icon: Video },
  { value: 'testimonials6', label: 'testimonials6', description: 'Social Proof - Social style', icon: ThumbsUp },
];

const CONTACT_BLOCKS: BlockOption[] = [
  { value: 'contact1', label: 'contact1', description: 'Default - Standard layout', icon: Mail },
  { value: 'contact2', label: 'contact2', description: 'Split Form - Form with info', icon: SplitSquareHorizontal },
  { value: 'contact3', label: 'contact3', description: 'Centered - Centered form', icon: Circle },
  { value: 'contact4', label: 'contact4', description: 'Map Focus - Map layout', icon: MapPin },
  { value: 'contact5', label: 'contact5', description: 'Minimal - Minimalist', icon: Minimize2 },
  { value: 'contact6', label: 'contact6', description: 'Social Focused - Social media', icon: Hash },
];

const CTA_BLOCKS: BlockOption[] = [
  { value: 'cta1', label: 'cta1', description: 'Default - Standard CTA', icon: Megaphone },
  { value: 'cta2', label: 'cta2', description: 'Bold Center - Bold centered', icon: Megaphone },
  { value: 'cta3', label: 'cta3', description: 'Gradient Banner - Gradient bg', icon: Layers },
  { value: 'cta4', label: 'cta4', description: 'Split Action - Multiple actions', icon: SplitSquareHorizontal },
  { value: 'cta5', label: 'cta5', description: 'Floating - Floating card', icon: Cloud },
  { value: 'cta6', label: 'cta6', description: 'Minimal Line - Single line', icon: Minimize2 },
];

const BLOCK_OPTIONS_MAP = {
  hero: HERO_BLOCKS,
  about: ABOUT_BLOCKS,
  products: PRODUCTS_BLOCKS,
  testimonials: TESTIMONIALS_BLOCKS,
  contact: CONTACT_BLOCKS,
  cta: CTA_BLOCKS,
} as const;

const SECTION_LABELS = {
  hero: 'Hero',
  about: 'About',
  products: 'Products',
  testimonials: 'Testimonials',
  contact: 'Contact',
  cta: 'CTA',
} as const;

interface BlockSidebarProps {
  section: SectionType;
  currentBlock?: string;
  onBlockSelect: (block: string) => void;
  onBack: () => void;
  className?: string;
}

export function BlockSidebar({
  section,
  currentBlock,
  onBlockSelect,
  onBack,
  className,
}: BlockSidebarProps) {
  const blocks = BLOCK_OPTIONS_MAP[section];
  const sectionLabel = SECTION_LABELS[section];

  return (
    <div
      className={cn(
        'w-80 border-r bg-background flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 mb-3"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <h3 className="font-semibold text-lg">{sectionLabel} Section</h3>
        <p className="text-sm text-muted-foreground">Choose a block style</p>
      </div>

      {/* Variants List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {blocks.map((block) => {
            const isSelected = currentBlock === block.value;
            const Icon = block.icon;

            return (
              <button
                key={block.value}
                onClick={() => onBlockSelect(block.value)}
                className={cn(
                  'w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn(
                    'p-2 rounded-md flex-shrink-0',
                    isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{block.label}</p>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {block.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

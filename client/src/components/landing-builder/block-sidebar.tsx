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
  { value: 'hero1', label: 'Centered', description: 'Classic centered hero with optional background image', icon: Minimize2 },
  { value: 'hero2', label: 'Split Screen', description: 'Split layout with content on left, image on right', icon: SplitSquareHorizontal },
  { value: 'hero3', label: 'Video Background', description: 'Hero with video dialog - click to play video', icon: Film },
  { value: 'hero4', label: 'Parallax', description: 'Parallax scrolling effect with layered content', icon: Move },
  { value: 'hero5', label: 'Animated Gradient', description: 'Dynamic animated gradient with light rays', icon: Sparkles },
  { value: 'hero6', label: 'Glass Morphism', description: 'Modern glass-morphism design with blur effects', icon: GlassWater },
];

const ABOUT_BLOCKS: BlockOption[] = [
  { value: 'about1', label: 'Grid', description: 'Grid layout with features showcase', icon: Grid3x3 },
  { value: 'about2', label: 'Side by Side', description: 'Classic side-by-side layout with image and content', icon: SplitSquareHorizontal },
  { value: 'about3', label: 'Centered', description: 'Centered content with clean typography', icon: Circle },
  { value: 'about4', label: 'Timeline', description: 'Timeline-style story layout', icon: Clock },
  { value: 'about5', label: 'Cards', description: 'Card-based feature highlights', icon: Grid3x3 },
  { value: 'about6', label: 'Magazine', description: 'Magazine-style editorial layout', icon: BookOpen },
  { value: 'about7', label: 'Storytelling', description: 'Story-focused narrative layout', icon: Type },
];

const PRODUCTS_BLOCKS: BlockOption[] = [
  { value: 'products1', label: 'Grid', description: 'Clean product grid layout', icon: Grid3x3 },
  { value: 'products2', label: 'Grid Hover', description: 'Grid with interactive hover effects', icon: Grid3x3 },
  { value: 'products3', label: 'Masonry', description: 'Pinterest-style masonry grid', icon: LayoutGrid },
  { value: 'products4', label: 'Carousel', description: 'Sliding carousel showcase', icon: ArrowDownUp },
  { value: 'products5', label: 'Catalog', description: 'Catalog list view', icon: BookOpen },
  { value: 'products6', label: 'Minimal List', description: 'Minimalist list layout', icon: List },
];

const TESTIMONIALS_BLOCKS: BlockOption[] = [
  { value: 'testimonials1', label: 'Grid Cards', description: 'Grid of testimonial cards', icon: Grid3x3 },
  { value: 'testimonials2', label: 'Card Slider', description: 'Sliding testimonial cards', icon: ArrowDownUp },
  { value: 'testimonials3', label: 'Quote Highlight', description: 'Highlighted quote focus', icon: Quote },
  { value: 'testimonials4', label: 'Single Focus', description: 'One testimonial at a time', icon: Focus },
  { value: 'testimonials5', label: 'Video', description: 'Video-based testimonials', icon: Video },
  { value: 'testimonials6', label: 'Social Proof', description: 'Social proof style layout', icon: ThumbsUp },
];

const CONTACT_BLOCKS: BlockOption[] = [
  { value: 'contact1', label: 'Default', description: 'Standard contact layout', icon: Mail },
  { value: 'contact2', label: 'Split Form', description: 'Form with info split layout', icon: SplitSquareHorizontal },
  { value: 'contact3', label: 'Centered', description: 'Centered contact form', icon: Circle },
  { value: 'contact4', label: 'Map Focus', description: 'Map-focused contact layout', icon: MapPin },
  { value: 'contact5', label: 'Minimal', description: 'Minimalist contact design', icon: Minimize2 },
  { value: 'contact6', label: 'Social Focused', description: 'Social media focused layout', icon: Hash },
];

const CTA_BLOCKS: BlockOption[] = [
  { value: 'cta1', label: 'Default', description: 'Standard call-to-action', icon: Megaphone },
  { value: 'cta2', label: 'Bold Center', description: 'Bold centered CTA', icon: Megaphone },
  { value: 'cta3', label: 'Gradient Banner', description: 'Gradient background banner', icon: Layers },
  { value: 'cta4', label: 'Split Action', description: 'Split with multiple actions', icon: SplitSquareHorizontal },
  { value: 'cta5', label: 'Floating', description: 'Floating CTA card', icon: Cloud },
  { value: 'cta6', label: 'Minimal Line', description: 'Minimal single line CTA', icon: Minimize2 },
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

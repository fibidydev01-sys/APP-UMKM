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

const HERO_BLOCKS: BlockOption[] = [
  { value: 'gradient-overlay', label: 'Gradient Overlay', description: 'Background with gradient overlay', icon: Layers },
  { value: 'centered-minimal', label: 'Centered Minimal', description: 'Minimalist centered design', icon: Minimize2 },
  { value: 'split-screen', label: 'Split Screen', description: 'Content on left, image on right', icon: SplitSquareHorizontal },
  { value: 'video-background', label: 'Video Background', description: 'Video or animated background', icon: Film },
  { value: 'parallax', label: 'Parallax', description: 'Parallax scrolling effect', icon: Move },
  { value: 'animated-gradient', label: 'Animated Gradient', description: 'Animated gradient background', icon: Sparkles },
  { value: 'glass-morphism', label: 'Glass Morphism', description: 'Glassmorphism effect', icon: GlassWater },
  { value: 'bento-grid', label: 'Bento Grid', description: 'Bento grid layout', icon: LayoutGrid },
  { value: 'floating-cards', label: 'Floating Cards', description: 'Floating card elements', icon: Cloud },
  { value: 'spotlight', label: 'Spotlight', description: 'Spotlight effect', icon: Focus },
  { value: 'wave-background', label: 'Wave Background', description: 'Wave SVG background', icon: Waves },
  { value: 'particles', label: 'Particles', description: 'Particle effects', icon: Zap },
  { value: 'gradient-mesh', label: 'Gradient Mesh', description: 'Gradient mesh background', icon: Brush },
  { value: 'text-reveal', label: 'Text Reveal', description: 'Text reveal animation', icon: Type },
  { value: 'immersive-hero', label: 'Immersive Hero', description: 'Full immersive experience', icon: Maximize2 },
];

const ABOUT_BLOCKS: BlockOption[] = [
  { value: 'side-by-side', label: 'Side by Side', description: 'Image alongside content', icon: SplitSquareHorizontal },
  { value: 'centered', label: 'Centered', description: 'Centered content layout', icon: Circle },
  { value: 'timeline', label: 'Timeline', description: 'Timeline-style layout', icon: Clock },
  { value: 'cards', label: 'Cards', description: 'Card-based layout', icon: Grid3x3 },
  { value: 'magazine', label: 'Magazine', description: 'Magazine-style layout', icon: BookOpen },
  { value: 'storytelling', label: 'Storytelling', description: 'Story-focused layout', icon: Type },
  { value: 'feature-grid', label: 'Feature Grid', description: 'Feature grid layout', icon: LayoutGrid },
  { value: 'stats-showcase', label: 'Stats Showcase', description: 'Stats highlight', icon: BarChart3 },
  { value: 'image-gallery', label: 'Image Gallery', description: 'Image gallery layout', icon: Images },
  { value: 'tab-sections', label: 'Tab Sections', description: 'Tabbed sections', icon: Tags },
  { value: 'accordion-list', label: 'Accordion List', description: 'Accordion layout', icon: ChevronDown },
  { value: 'bento-about', label: 'Bento About', description: 'Bento layout', icon: LayoutGrid },
  { value: 'team-showcase', label: 'Team Showcase', description: 'Team grid showcase', icon: Users },
  { value: 'vertical-timeline', label: 'Vertical Timeline', description: 'Vertical timeline', icon: ArrowDownUp },
  { value: 'comparison', label: 'Comparison', description: 'Before/after comparison', icon: GitCompare },
];

const PRODUCTS_BLOCKS: BlockOption[] = [
  { value: 'grid-hover', label: 'Grid Hover', description: 'Grid with hover effects', icon: Grid3x3 },
  { value: 'masonry', label: 'Masonry', description: 'Pinterest-style masonry grid', icon: LayoutGrid },
  { value: 'carousel', label: 'Carousel', description: 'Sliding carousel', icon: ArrowDownUp },
  { value: 'featured-hero', label: 'Featured Hero', description: 'Hero product with grid', icon: Star },
  { value: 'catalog', label: 'Catalog', description: 'Catalog list view', icon: BookOpen },
  { value: 'minimal-list', label: 'Minimal List', description: 'Minimalist list layout', icon: List },
  { value: 'infinite-scroll', label: 'Infinite Scroll', description: 'Infinite scroll grid', icon: ArrowDownUp },
  { value: 'filter-sidebar', label: 'Filter Sidebar', description: 'Filter sidebar layout', icon: Filter },
  { value: 'product-tabs', label: 'Product Tabs', description: 'Product category tabs', icon: Tags },
  { value: 'comparison-table', label: 'Comparison Table', description: 'Product comparison', icon: Table2 },
  { value: 'pricing-cards', label: 'Pricing Cards', description: 'Pricing card layout', icon: DollarSign },
  { value: 'showcase-split', label: 'Showcase Split', description: 'Split showcase layout', icon: SplitSquareHorizontal },
  { value: 'bento-products', label: 'Bento Products', description: 'Bento grid layout', icon: LayoutGrid },
  { value: 'quick-view', label: 'Quick View', description: 'Quick view modal', icon: Eye },
  { value: 'category-grid', label: 'Category Grid', description: 'Category grid layout', icon: FolderOpen },
];

const TESTIMONIALS_BLOCKS: BlockOption[] = [
  { value: 'card-slider', label: 'Card Slider', description: 'Sliding cards', icon: ArrowDownUp },
  { value: 'quote-highlight', label: 'Quote Highlight', description: 'Highlighted quotes', icon: Quote },
  { value: 'grid-cards', label: 'Grid Cards', description: 'Grid of testimonial cards', icon: Grid3x3 },
  { value: 'single-focus', label: 'Single Focus', description: 'One testimonial at a time', icon: Focus },
  { value: 'video-testimonials', label: 'Video Testimonials', description: 'Video-based testimonials', icon: Video },
  { value: 'social-proof', label: 'Social Proof', description: 'Social proof style', icon: ThumbsUp },
  { value: 'marquee', label: 'Marquee', description: 'Marquee scroll effect', icon: ArrowDownUp },
  { value: 'wall-of-love', label: 'Wall of Love', description: 'Wall of love layout', icon: MessageSquare },
  { value: 'rating-stars', label: 'Rating Stars', description: 'Star ratings showcase', icon: Star },
  { value: 'avatar-stack', label: 'Avatar Stack', description: 'Avatar stack layout', icon: UserCircle2 },
  { value: 'quote-carousel', label: 'Quote Carousel', description: 'Quote carousel', icon: Quote },
  { value: 'bento-testimonials', label: 'Bento Testimonials', description: 'Bento layout', icon: LayoutGrid },
  { value: 'timeline-reviews', label: 'Timeline Reviews', description: 'Timeline reviews', icon: Clock },
  { value: 'featured-quote', label: 'Featured Quote', description: 'Featured quote highlight', icon: TrendingUp },
  { value: 'social-media', label: 'Social Media', description: 'Social media feed', icon: Hash },
];

const CONTACT_BLOCKS: BlockOption[] = [
  { value: 'split-form', label: 'Split Form', description: 'Form with info split', icon: SplitSquareHorizontal },
  { value: 'centered', label: 'Centered', description: 'Centered contact form', icon: Circle },
  { value: 'map-focus', label: 'Map Focus', description: 'Map-focused layout', icon: MapPin },
  { value: 'minimal', label: 'Minimal', description: 'Minimalist contact', icon: Minimize2 },
  { value: 'social-focused', label: 'Social Focused', description: 'Social media focused', icon: Hash },
  { value: 'inline-form', label: 'Inline Form', description: 'Inline form layout', icon: Send },
  { value: 'floating-form', label: 'Floating Form', description: 'Floating form card', icon: Cloud },
  { value: 'card-contact', label: 'Card Contact', description: 'Card-based layout', icon: Grid3x3 },
  { value: 'multi-step', label: 'Multi-Step', description: 'Multi-step form', icon: ArrowDownUp },
  { value: 'appointment', label: 'Appointment', description: 'Appointment booking', icon: Clock },
  { value: 'live-chat', label: 'Live Chat', description: 'Live chat widget', icon: MessageCircle },
  { value: 'faq-contact', label: 'FAQ Contact', description: 'FAQ with contact', icon: HelpCircle },
  { value: 'office-locations', label: 'Office Locations', description: 'Office locations map', icon: Building2 },
  { value: 'contact-grid', label: 'Contact Grid', description: 'Contact grid layout', icon: LayoutGrid },
  { value: 'newsletter', label: 'Newsletter', description: 'Newsletter signup', icon: Mail },
];

const CTA_BLOCKS: BlockOption[] = [
  { value: 'bold-center', label: 'Bold Center', description: 'Bold centered CTA', icon: Megaphone },
  { value: 'gradient-banner', label: 'Gradient Banner', description: 'Gradient background banner', icon: Layers },
  { value: 'split-action', label: 'Split Action', description: 'Split with multiple actions', icon: SplitSquareHorizontal },
  { value: 'floating', label: 'Floating', description: 'Floating CTA card', icon: Cloud },
  { value: 'minimal-line', label: 'Minimal Line', description: 'Minimal single line', icon: Minimize2 },
  { value: 'sticky-banner', label: 'Sticky Banner', description: 'Sticky banner CTA', icon: Rocket },
  { value: 'popup-modal', label: 'Popup Modal', description: 'Popup modal CTA', icon: Maximize2 },
  { value: 'countdown', label: 'Countdown', description: 'Countdown timer CTA', icon: Timer },
  { value: 'pricing-cta', label: 'Pricing CTA', description: 'Pricing-focused CTA', icon: CreditCard },
  { value: 'feature-cta', label: 'Feature CTA', description: 'Feature highlight CTA', icon: Trophy },
  { value: 'social-proof-cta', label: 'Social Proof CTA', description: 'Social proof CTA', icon: ThumbsUp },
  { value: 'video-cta', label: 'Video CTA', description: 'Video background CTA', icon: Video },
  { value: 'app-download', label: 'App Download', description: 'App download CTA', icon: Smartphone },
  { value: 'newsletter-cta', label: 'Newsletter CTA', description: 'Newsletter signup CTA', icon: Mail },
  { value: 'waitlist', label: 'Waitlist', description: 'Waitlist signup CTA', icon: List },
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

/**
 * ============================================================================
 * FILE: src/components/landing-builder/block-options.ts
 * PURPOSE: Auto-discovery of block variants from filesystem
 * ============================================================================
 *
 * 🚀 SMART AUTO-DISCOVERY SYSTEM
 *
 * This file automatically scans the filesystem for block components
 * and generates options for the block picker UI.
 *
 * NO MANUAL UPDATES NEEDED!
 * Just add a new file like hero201.tsx and it will auto-appear in the UI!
 *
 * ============================================================================
 */

import {
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

export interface BlockOption {
  value: string; // e.g., 'hero1', 'hero201'
  label: string; // e.g., 'Hero 1', 'Hero 201'
  icon: LucideIcon;
}

// ============================================================================
// ICON POOL FOR ROTATION
// ============================================================================

const ICON_POOL: LucideIcon[] = [
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
];

// ============================================================================
// AUTO-DISCOVERY FUNCTION
// ============================================================================

type SectionType = 'hero' | 'about' | 'products' | 'testimonials' | 'contact' | 'cta';

/**
 * 🚀 MAGIC: Auto-discover blocks from filesystem!
 *
 * Uses Vite's import.meta.glob to scan for block files.
 * Automatically finds hero1.tsx, hero2.tsx, hero201.tsx, etc.
 *
 * @param section - Section name (hero, about, products, etc.)
 * @returns Array of block options sorted numerically
 */
function discoverBlocks(section: SectionType): BlockOption[] {
  // Vite's import.meta.glob scans filesystem at build time
  const blockFiles = import.meta.glob(
    '../landing/blocks/*/*.tsx',
    { eager: true }
  );

  const blockNames: string[] = [];

  // Extract block names from file paths
  Object.keys(blockFiles).forEach((path) => {
    // Path format: "../landing/blocks/hero/hero1.tsx"
    const regex = new RegExp(`/blocks/${section}/${section}(\\d+)\\.tsx$`);
    const match = path.match(regex);

    if (match) {
      const blockNumber = match[1];
      blockNames.push(`${section}${blockNumber}`);
    }
  });

  // Sort numerically (hero1, hero2, ..., hero10, ..., hero201)
  blockNames.sort((a, b) => {
    const numA = parseInt(a.replace(section, ''));
    const numB = parseInt(b.replace(section, ''));
    return numA - numB;
  });

  // Generate options with rotating icons
  return blockNames.map((blockName, index) => {
    const number = blockName.replace(section, '');
    return {
      value: blockName,
      label: `${capitalize(section)} ${number}`,
      icon: ICON_POOL[index % ICON_POOL.length],
    };
  });
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// AUTO-GENERATED BLOCK OPTIONS (NO MANUAL WORK!)
// ============================================================================

export const HERO_BLOCKS = discoverBlocks('hero');
export const ABOUT_BLOCKS = discoverBlocks('about');
export const PRODUCTS_BLOCKS = discoverBlocks('products');
export const TESTIMONIALS_BLOCKS = discoverBlocks('testimonials');
export const CONTACT_BLOCKS = discoverBlocks('contact');
export const CTA_BLOCKS = discoverBlocks('cta');

export const BLOCK_OPTIONS_MAP = {
  hero: HERO_BLOCKS,
  about: ABOUT_BLOCKS,
  products: PRODUCTS_BLOCKS,
  testimonials: TESTIMONIALS_BLOCKS,
  contact: CONTACT_BLOCKS,
  cta: CTA_BLOCKS,
} as const;

// ============================================================================
// DEBUG: Log discovered blocks (remove in production)
// ============================================================================

if (import.meta.env.DEV) {
  console.log('🚀 Auto-discovered blocks:', {
    hero: HERO_BLOCKS.length,
    about: ABOUT_BLOCKS.length,
    products: PRODUCTS_BLOCKS.length,
    testimonials: TESTIMONIALS_BLOCKS.length,
    contact: CONTACT_BLOCKS.length,
    cta: CTA_BLOCKS.length,
    total: HERO_BLOCKS.length + ABOUT_BLOCKS.length + PRODUCTS_BLOCKS.length +
           TESTIMONIALS_BLOCKS.length + CONTACT_BLOCKS.length + CTA_BLOCKS.length,
  });
}

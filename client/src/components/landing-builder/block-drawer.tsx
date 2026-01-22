/**
 * BlockDrawer Component - Mobile-First with Auto-Discovery! 🚀
 *
 * Vaul drawer that slides from bottom
 * Shows ALL block variants with auto-discovery from filesystem
 * NO MANUAL UPDATES NEEDED - just add hero201.tsx and it appears!
 */

'use client';

import { useState, useMemo } from 'react';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, Minimize2, Grid3x3, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { SectionType } from './builder-sidebar';
import { BLOCK_OPTIONS_MAP } from './block-options'; // 🚀 Auto-discovered blocks!

export type DrawerState = 'collapsed' | 'expanded'; // Only 2 states: header-only or full

interface BlockDrawerProps {
  state: DrawerState; // 🚀 2 states: collapsed (header) or expanded (full)
  onStateChange: (state: DrawerState) => void;
  section: SectionType;
  currentBlock?: string;
  onBlockSelect: (block: string) => void;
}

const BLOCKS_PER_PAGE = 20; // Show 20 blocks per page

/**
 * Vaul drawer for block selection with AUTO-DISCOVERY! 🚀
 * 2 States System:
 * - COLLAPSED: Header visible (~15% viewport) - shows section name
 * - EXPANDED: Full blocks visible (~80% viewport) - shows ALL block variants
 *
 * Features:
 * - Auto-discovery from filesystem (no manual updates!)
 * - Search functionality
 * - Pagination for 200+ blocks
 * - ALWAYS VISIBLE - never fully closes
 */
export function BlockDrawer({
  state,
  onStateChange,
  section,
  currentBlock,
  onBlockSelect,
}: BlockDrawerProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Get all blocks for current section (auto-discovered!)
  const allBlocks = BLOCK_OPTIONS_MAP[section] || [];

  // Filter by search
  const filteredBlocks = useMemo(() => {
    if (!search.trim()) return allBlocks;
    const searchLower = search.toLowerCase();
    return allBlocks.filter(
      (block) =>
        block.value.toLowerCase().includes(searchLower) ||
        block.label.toLowerCase().includes(searchLower)
    );
  }, [allBlocks, search]);

  // Pagination
  const totalPages = Math.ceil(filteredBlocks.length / BLOCKS_PER_PAGE);
  const startIdx = (page - 1) * BLOCKS_PER_PAGE;
  const endIdx = startIdx + BLOCKS_PER_PAGE;
  const currentBlocks = filteredBlocks.slice(startIdx, endIdx);

  // Reset page when search changes or section changes
  useMemo(() => {
    setPage(1);
  }, [search, section]);

  return (
    <Drawer.Root
      open={true} // 🚀 ALWAYS OPEN - never closes!
      onOpenChange={() => {}} // Prevent closing
      modal={false} // Non-modal - doesn't block page
      noBodyStyles // 🚀 Important for rendering!
    >
      <Drawer.Portal>
        {/* Visible overlay to confirm drawer is rendering */}
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[9998]" />

        <Drawer.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-[9999] flex flex-col rounded-t-[20px] bg-background border-t shadow-2xl",
            state === 'expanded' ? "h-[80vh]" : "h-auto min-h-[120px]"
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
          {/* Drag Handle - Click to toggle */}
          <div
            className="flex justify-center pt-3 pb-2 shrink-0 cursor-pointer"
            onClick={() => onStateChange(state === 'expanded' ? 'collapsed' : 'expanded')}
          >
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition-colors" />
          </div>

          {/* Header - ALWAYS VISIBLE */}
          <div className="px-4 pt-2 pb-3 border-b shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h3 className="capitalize font-semibold text-foreground">
                  {section} Blocks
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({allBlocks.length} total)
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {state === 'expanded'
                    ? `Showing ${filteredBlocks.length} blocks`
                    : 'Drag up to see all blocks'}
                </p>
              </div>
              {/* Collapse/Expand Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStateChange(state === 'expanded' ? 'collapsed' : 'expanded')}
                className="h-8 w-8"
                title={state === 'expanded' ? 'Collapse' : 'Expand'}
              >
                {state === 'expanded' ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Grid3x3 className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Search Bar - Only show when EXPANDED */}
            {state === 'expanded' && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search blocks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            )}
          </div>

          {/* Block Grid - Only show when EXPANDED */}
          {state === 'expanded' && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-auto p-4">
                {currentBlocks.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
                    {currentBlocks.map((block) => {
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
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No blocks found matching "{search}"</p>
                  </div>
                )}
              </div>

              {/* Pagination - Show if more than one page */}
              {totalPages > 1 && (
                <div className="border-t p-3 shrink-0">
                  <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <div className="text-xs text-muted-foreground">
                      Showing {startIdx + 1}-{Math.min(endIdx, filteredBlocks.length)} of{' '}
                      {filteredBlocks.length}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="h-7 px-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((p) => {
                            // Show: 1, current-1, current, current+1, last
                            return (
                              p === 1 ||
                              p === totalPages ||
                              Math.abs(p - page) <= 1
                            );
                          })
                          .map((p, idx, arr) => (
                            <div key={p} className="flex items-center gap-1">
                              {idx > 0 && arr[idx - 1] !== p - 1 && (
                                <span className="text-xs text-muted-foreground px-1">...</span>
                              )}
                              <Button
                                variant={p === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPage(p)}
                                className="h-7 w-7 p-0"
                              >
                                {p}
                              </Button>
                            </div>
                          ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="h-7 px-2"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

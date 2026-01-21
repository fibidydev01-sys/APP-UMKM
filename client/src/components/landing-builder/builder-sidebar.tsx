/**
 * BuilderSidebar Component
 *
 * Fixed sidebar with 6 section buttons (Hero, About, Products, Testimonials, Contact, CTA)
 * 🚀 NEW: Drag & Drop support untuk reorder sections
 */

'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Info,
  ShoppingBag,
  MessageSquare,
  Phone,
  Megaphone,
  GripVertical,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { SectionKey } from '@/types';

// 🚀 Re-export as SectionType for backward compatibility
export type SectionType = SectionKey;

interface Section {
  id: SectionType;
  label: string;
  icon: typeof Sparkles;
  description: string;
}

const sectionsData: Section[] = [
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
  // 🚀 NEW: Section order state
  sectionOrder: SectionType[];
  onSectionOrderChange: (newOrder: SectionType[]) => void;
  // 🚀 NEW: Section enable/disable state
  getSectionEnabled: (section: SectionType) => boolean;
  onToggleSection: (section: SectionType, enabled: boolean) => void;
}

interface SortableSectionItemProps {
  section: Section;
  isActive: boolean;
  collapsed: boolean;
  enabled: boolean;
  onSectionClick: (section: SectionType) => void;
  onToggleSection: (section: SectionType, enabled: boolean) => void;
}

function SortableSectionItem({
  section,
  isActive,
  collapsed,
  enabled,
  onSectionClick,
  onToggleSection,
}: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  const Icon = section.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group',
        isDragging && 'opacity-50 z-50'
      )}
    >
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full h-auto transition-all flex-col items-center gap-2 py-3 px-2',
          isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
        )}
        onClick={() => onSectionClick(section.id)}
        title={section.label} // Always show tooltip
      >
        {/* Drag Handle - Positioned absolute on hover */}
        {!collapsed && (
          <div
            {...attributes}
            {...listeners}
            className={cn(
              'cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 transition-colors',
              'opacity-0 group-hover:opacity-100 absolute left-1 top-2'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>
        )}

        {/* Icon only */}
        <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />

        {/* Toggle - Below icon */}
        {!collapsed && (
          <Switch
            checked={enabled}
            onCheckedChange={(checked) => onToggleSection(section.id, checked)}
            onClick={(e) => e.stopPropagation()}
            className="scale-75"
          />
        )}
      </Button>
    </div>
  );
}

export function BuilderSidebar({
  activeSection,
  onSectionClick,
  collapsed = false,
  className,
  sectionOrder,
  onSectionOrderChange,
  getSectionEnabled,
  onToggleSection,
}: BuilderSidebarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionType);
      const newIndex = sectionOrder.indexOf(over.id as SectionType);

      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      onSectionOrderChange(newOrder);
    }
  };

  // Map section order to section data
  const orderedSections = sectionOrder.map(
    (id) => sectionsData.find((s) => s.id === id)!
  );

  return (
    <div
      className={cn(
        'border-r bg-muted/30 p-3 space-y-2 transition-all duration-300',
        // 🚀 Icon-only sidebar - wider to fit icon + toggle vertically
        collapsed ? 'w-16' : 'w-20',
        className
      )}
    >
      {/* Removed header - icon-only design */}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          {orderedSections.map((section) => {
            const isActive = activeSection === section.id;
            const enabled = getSectionEnabled(section.id);

            return (
              <SortableSectionItem
                key={section.id}
                section={section}
                isActive={isActive}
                collapsed={collapsed}
                enabled={enabled}
                onSectionClick={onSectionClick}
                onToggleSection={onToggleSection}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}

/**
 * SectionSheet Component
 *
 * Base wrapper for section edit sheets that slide from the right
 */

'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { SectionType } from './builder-sidebar';

interface SectionSheetProps {
  section: SectionType;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionSheet({
  section,
  isOpen,
  onClose,
  title,
  description,
  children,
}: SectionSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[50vw] sm:w-[55vw] lg:w-[50vw] max-w-none overflow-y-auto p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

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
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

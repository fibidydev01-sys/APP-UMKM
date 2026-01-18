'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CtaMinimalLineProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Variant: Minimal Line
 *
 * Ultra-minimal single-line CTA
 */
export function CtaMinimalLine({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: CtaMinimalLineProps) {
  return (
    <section className="py-12 my-8 border-t border-b">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto px-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <Link href={buttonLink}>
          <Button variant={buttonVariant} className="gap-2">
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

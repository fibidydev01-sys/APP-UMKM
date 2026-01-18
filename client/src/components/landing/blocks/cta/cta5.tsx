'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cta5Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta5
 * Design: Floating
 *
 * Floating card with shadow elevation
 */
export function Cta5({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta5Props) {
  return (
    <section className="py-16 my-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-card rounded-2xl shadow-2xl p-8 md:p-12 border">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">{subtitle}</p>
            )}
            <Link href={buttonLink}>
              <Button
                size="lg"
                variant={buttonVariant}
                className="gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {buttonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

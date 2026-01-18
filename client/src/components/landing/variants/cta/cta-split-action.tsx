'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CtaSplitActionProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Variant: Split Action
 *
 * Split layout with multiple action buttons
 */
export function CtaSplitAction({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: CtaSplitActionProps) {
  return (
    <section className="py-16 my-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={buttonLink} className="flex-1">
              <Button size="lg" variant={buttonVariant} className="w-full gap-2">
                {buttonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="flex-1 gap-2">
              <MessageCircle className="h-4 w-4" />
              Hubungi Kami
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

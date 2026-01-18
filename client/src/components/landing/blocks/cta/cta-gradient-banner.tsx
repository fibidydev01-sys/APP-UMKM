'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CtaGradientBannerProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Variant: Gradient Banner
 *
 * Full-width animated gradient banner
 */
export function CtaGradientBanner({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: CtaGradientBannerProps) {
  return (
    <section className="py-16 my-8 rounded-2xl bg-gradient-to-r from-primary via-primary/80 to-primary animate-gradient-x relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="text-center max-w-2xl mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">{title}</h2>
        {subtitle && (
          <p className="text-primary-foreground/90 mb-6 text-lg">{subtitle}</p>
        )}
        <Link href={buttonLink}>
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

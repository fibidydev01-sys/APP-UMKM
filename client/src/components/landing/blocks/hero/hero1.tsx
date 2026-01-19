'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Hero1 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - heroTitle: Marketing headline
 * @prop subtitle - heroSubtitle: Value proposition
 * @prop ctaText - heroCtaText: CTA button text
 * @prop ctaLink - heroCtaLink: CTA button link
 * @prop backgroundImage - heroBackgroundImage: Cloudinary URL (1920x800px)
 * @prop logo - logo: Cloudinary URL (200x200px)
 * @prop storeName - name: Store name
 */
interface Hero1Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  overlayOpacity?: number;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Block: hero1
 * Design: Centered
 * Mobile-first responsive with proper touch targets
 */
export function Hero1({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  overlayOpacity = 0.5,
  logo,
  storeName,
}: Hero1Props) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <>
          <OptimizedImage
            src={backgroundImage}
            alt="Hero Background"
            fill
            priority
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-black transition-opacity"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

      {/* Gradient Background (fallback) */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      )}

      {/* Content Container */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <OptimizedImage
                  src={logo}
                  alt={storeName || 'Logo'}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block mb-4 md:mb-6"
          >
            <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm md:text-base shadow-lg">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {storeName || 'Welcome'}
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8',
              'leading-tight',
              backgroundImage ? 'text-white drop-shadow-lg' : 'text-foreground'
            )}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className={cn(
                'text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10',
                'max-w-2xl mx-auto leading-relaxed px-2',
                backgroundImage ? 'text-white/90 drop-shadow' : 'text-muted-foreground'
              )}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Button */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex justify-center"
            >
              <Link href={ctaLink} className="w-full sm:w-auto">
                <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-5 shadow-xl">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
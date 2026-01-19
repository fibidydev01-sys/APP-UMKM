'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Hero106Props {
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
 * Hero Block: hero106
 * Design: Centered
 * Mobile-first responsive with proper touch targets
 */
export function Hero106({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaLink = '#',
  showCta = true,
  backgroundImage,
  overlayOpacity = 0.5,
  logo,
  storeName,
}: Hero106Props) {
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
          {showCta && (
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

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto"
          >
            {[
              { color: 'bg-green-500', label: '1000+ Customers' },
              { color: 'bg-blue-500', label: 'Fast Shipping' },
              { color: 'bg-purple-500', label: 'Secure Payment' },
            ].map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg backdrop-blur-sm text-xs sm:text-sm',
                  backgroundImage ? 'bg-white/10 text-white' : 'bg-muted text-foreground'
                )}
              >
                <span className={cn('h-2 w-2 rounded-full animate-pulse', item.color)} />
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div
          className={cn(
            'flex flex-col items-center gap-2',
            backgroundImage ? 'text-white/70' : 'text-muted-foreground'
          )}
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ArrowRight className="h-5 w-5 rotate-90" />
        </div>
      </motion.div>
    </section>
  );
}

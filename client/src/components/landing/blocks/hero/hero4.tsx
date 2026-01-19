'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { LightRays } from '@/components/ui/light-rays';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

interface Hero4Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Block: hero4
 * Design: Parallax with Light Rays
 * Heavy effects hidden on mobile for performance
 */
export function Hero4({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero4Props) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <OptimizedImage
            src={backgroundImage}
            alt={storeName || title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-background" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Light Rays - Desktop only */}
      <LightRays
        count={8}
        color="rgba(160, 210, 255, 0.15)"
        blur={40}
        speed={16}
        length="80vh"
        className="hidden md:block"
      />

      {/* Dot Pattern - Hidden on mobile */}
      <DotPattern
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1}
        className="hidden sm:block opacity-20 sm:opacity-30 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
      />

      {/* Content */}
      <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8"
        >
          {/* Logo with floating animation */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-4 sm:mb-6 md:mb-8"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
              >
                <OptimizedImage
                  src={logo}
                  alt={storeName || title}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block"
          >
            <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm md:text-base backdrop-blur-sm">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {storeName || 'Premium Collection'}
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight',
              backgroundImage ? 'text-white drop-shadow-2xl' : 'text-foreground'
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
                'text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed px-2',
                backgroundImage ? 'text-white/90 drop-shadow-lg' : 'text-muted-foreground'
              )}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA */}
          {showCta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-2 sm:pt-4 md:pt-6"
            >
              <Link href={ctaLink} className="w-full sm:w-auto inline-block">
                <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-5 shadow-xl">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}

          {/* Floating Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-6 md:pt-8"
          >
            {['Premium Quality', 'Fast Shipping', 'Secure Payment'].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm',
                  backgroundImage ? 'bg-white/10 text-white' : 'bg-muted text-foreground'
                )}
              >
                <Sparkles className="h-3 w-3" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
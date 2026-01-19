'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Gem } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

interface Hero6Props {
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
 * Hero Block: hero6
 * Design: Glass Morphism
 * Animated blobs hidden on mobile, reduced blur for performance
 */
export function Hero6({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero6Props) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10">
        {backgroundImage ? (
          <>
            <OptimizedImage
              src={backgroundImage}
              alt={storeName || title}
              fill
              priority
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-sm" />
          </>
        ) : (
          <DotPattern className="opacity-20" />
        )}
      </div>

      {/* Animated Blobs - Desktop only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Glass Card */}
      <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative backdrop-blur-md sm:backdrop-blur-xl bg-background/40 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
            {/* Inner decorative blobs - Hidden on mobile */}
            <div className="hidden sm:block absolute -top-10 -right-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl" />
            <div className="hidden sm:block absolute -bottom-10 -left-10 w-28 h-28 md:w-40 md:h-40 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-2xl" />

            {/* Content */}
            <div className="relative z-10 text-center space-y-4 sm:space-y-6 md:space-y-8">
              {/* Logo */}
              {logo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex justify-center mb-4 sm:mb-6 md:mb-8"
                >
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-white/30 shadow-xl backdrop-blur-sm bg-white/10">
                    <OptimizedImage
                      src={logo}
                      alt={storeName || title}
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
                className="inline-block"
              >
                <Badge
                  variant="secondary"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm md:text-base backdrop-blur-sm bg-white/80"
                >
                  <Gem className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  {storeName || 'Premium Glass'}
                </Badge>
              </motion.div>

              {/* Title with Gradient */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-pink-600 leading-tight"
              >
                {title}
              </motion.h1>

              {/* Subtitle */}
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2"
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
                  className="pt-2 sm:pt-4"
                >
                  <Link href={ctaLink} className="w-full sm:w-auto inline-block">
                    <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-xl">
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                </motion.div>
              )}

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-6"
              >
                {['Premium Quality', 'Modern Design', 'Fast & Secure'].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-xs sm:text-sm"
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
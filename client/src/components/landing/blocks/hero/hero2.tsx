'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Hero2Props {
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
 * Hero Block: hero2
 * Design: Split Screen
 *
 * Split layout with content on left, image on right - MOBILE FIRST!
 * Stacks vertically on mobile → Side-by-side on desktop
 * Modern asymmetric design with smooth animations
 */
export function Hero2({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero2Props) {
  return (
    <section className="relative min-h-[600px] lg:min-h-screen overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] lg:min-h-screen py-12 md:py-16 lg:py-20">
          {/* Left: Content - MOBILE OPTIMIZED */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8 order-2 lg:order-1"
          >
            {/* Logo */}
            {logo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center lg:justify-start"
              >
                <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl">
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
              className="flex justify-center lg:justify-start"
            >
              <Badge variant="secondary" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                {storeName || 'Featured'}
              </Badge>
            </motion.div>

            {/* Title - MOBILE OPTIMIZED */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4 text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* CTA - MOBILE FRIENDLY */}
            {showCta && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex justify-center lg:justify-start"
              >
                <Link href={ctaLink} className="w-full sm:w-auto">
                  <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              </motion.div>
            )}

            {/* Trust Indicators - MOBILE STACKED */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>Trusted Brand</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Quality Products</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Image - MOBILE FIRST HEIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2"
          >
            {backgroundImage ? (
              <OptimizedImage
                src={backgroundImage}
                alt={storeName || title}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
                <span className="text-9xl opacity-20">🎨</span>
              </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-6 right-6">
              <Badge className="bg-white/90 text-primary backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-1 fill-current" />
                New
              </Badge>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

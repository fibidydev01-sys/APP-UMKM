'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Play } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import { cn } from '@/lib/utils';

interface Hero3Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
  videoUrl?: string;
}

/**
 * Hero Block: hero3
 * Design: Video Background
 *
 * Hero with video dialog - click to play promotional video - MOBILE FIRST!
 * Great for brands that want to showcase video content
 * Responsive overlay with proper mobile spacing
 */
export function Hero3({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
}: Hero3Props) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background Section */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc={videoUrl}
            thumbnailSrc={backgroundImage}
            thumbnailAlt={storeName || title}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
            <div className="text-center p-8 space-y-4">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Add a video to see video background
              </p>
            </div>
          </div>
        )}
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      {/* Content Overlay - MOBILE FIRST */}
      <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8"
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
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
            className="inline-block mb-4 md:mb-6"
          >
            <Badge variant="secondary" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base backdrop-blur-sm">
              <Play className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              {storeName || 'Watch Our Story'}
            </Badge>
          </motion.div>

          {/* Title - MOBILE OPTIMIZED */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground drop-shadow-lg leading-tight"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-md leading-relaxed px-4"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Buttons - MOBILE STACKED */}
          {showCta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href={ctaLink} className="w-full sm:w-auto">
                <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-xl">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}

          {/* Video Play Hint - Only show if video exists */}
          {backgroundImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground pt-4"
            >
              <Play className="h-4 w-4 animate-pulse" />
              <span>Click the video above to watch</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

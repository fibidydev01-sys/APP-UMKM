'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { LightRays } from '@/components/ui/light-rays';
import { WordRotate } from '@/components/ui/word-rotate';

interface Hero5Props {
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
 * Hero Block: hero5
 * Design: Animated Gradient with Word Rotate
 *
 * Dynamic animated gradient background with light rays - MOBILE FIRST!
 * Modern and eye-catching with rotating words effect
 * Uses WordRotate component for dynamic text
 */
export function Hero5({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  logo,
  storeName,
}: Hero5Props) {
  // Split title for word rotation - use last word or provide alternatives
  const titleWords = title.split(' ');
  const rotatingWords = titleWords.length > 1
    ? [titleWords[titleWords.length - 1], 'Premium', 'Berkualitas', 'Terbaik']
    : ['Premium', 'Berkualitas', 'Terbaik', 'Terpercaya'];
  const staticTitle = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : '';

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6,#d946ef,#ec4899)] bg-[length:200%_100%] animate-[gradient_15s_ease_infinite]" />
        <LightRays
          count={6}
          color="rgba(255, 255, 255, 0.1)"
          blur={50}
          speed={18}
          length="90vh"
          className="hidden md:block"
        />
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
      </div>

      {/* Content - MOBILE FIRST */}
      <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8"
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-4 border-white/80 shadow-2xl bg-white/20 backdrop-blur-sm">
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
            <Badge variant="secondary" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-white/90 backdrop-blur-sm">
              <Star className="h-3 w-3 md:h-4 md:w-4 mr-2 fill-current text-primary" />
              {storeName || 'Premium Store'}
            </Badge>
          </motion.div>

          {/* Title with Word Rotation - MOBILE OPTIMIZED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
              {staticTitle && <span>{staticTitle} </span>}
              <WordRotate
                words={rotatingWords}
                duration={2500}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80"
              />
            </h1>

            {subtitle && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-lg font-medium px-4">
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
              className="pt-4 md:pt-6 flex justify-center"
            >
              <Link href={ctaLink} className="w-full sm:w-auto">
                <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-white text-primary hover:bg-white/90 shadow-2xl">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}

          {/* Stats - MOBILE STACKED */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 md:gap-12 pt-8"
          >
            {[
              { value: '1000+', label: 'Produk' },
              { value: '5000+', label: 'Pelanggan' },
              { value: '4.9⭐', label: 'Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="text-white/90 backdrop-blur-sm bg-white/10 rounded-2xl px-6 py-4 min-w-[100px]"
              >
                <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Star, Package } from 'lucide-react';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Hero7Props {
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
 * Hero Block: hero7
 * Design: Bento Grid
 *
 * Modern bento grid using BentoGrid component - MOBILE FIRST!
 * Responsive: 1 col mobile → 3 cols desktop
 */
export function Hero7({
  title,
  subtitle,
  ctaText = 'Explore Now',
  ctaLink = '#',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero7Props) {
  // Background gradient component
  const GradientBg = ({ className }: { className: string }) => (
    <div className={cn("absolute inset-0 bg-gradient-to-br transition-opacity opacity-60 group-hover:opacity-80", className)} />
  );

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Header - MOBILE OPTIMIZED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-xl">
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
            <Badge variant="secondary" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base shadow-lg">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              {storeName || 'Featured Collection'}
            </Badge>
          </motion.div>

          {/* Title - MOBILE OPTIMIZED */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* BENTO GRID - MOBILE FIRST! */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <BentoGrid className="max-w-7xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[18rem] sm:auto-rows-[20rem] md:auto-rows-[22rem]">
            {/* CARD 1: Featured - LARGE on desktop */}
            <BentoCard
              name="Premium Quality"
              className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2"
              description="Discover our most popular products with exclusive features and premium materials"
              Icon={TrendingUp}
              href={ctaLink}
              cta={ctaText}
              background={
                backgroundImage ? (
                  <div className="absolute inset-0">
                    <OptimizedImage
                      src={backgroundImage}
                      alt="Featured"
                      fill
                      className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <GradientBg className="from-primary/10 to-blue-500/10" />
                )
              }
            />

            {/* CARD 2: Stats */}
            <BentoCard
              name="10K+ Customers"
              className="col-span-1"
              description="Join thousands of happy customers worldwide"
              Icon={Zap}
              href={ctaLink}
              cta="Join Now"
              background={<GradientBg className="from-green-500/10 to-emerald-500/10" />}
            />

            {/* CARD 3: New Arrivals */}
            <BentoCard
              name="New Arrivals"
              className="col-span-1"
              description="Check out our latest products and collections"
              Icon={Sparkles}
              href={ctaLink}
              cta="View All"
              background={<GradientBg className="from-orange-500/10 to-red-500/10" />}
            />

            {/* CARD 4: Special Offers */}
            <BentoCard
              name="Special Offers"
              className="col-span-1"
              description="Exclusive deals and limited time discounts"
              Icon={Star}
              href={ctaLink}
              cta="Shop Now"
              background={<GradientBg className="from-purple-500/10 to-pink-500/10" />}
            />

            {/* CARD 5: Premium Service */}
            <BentoCard
              name="Premium Service"
              className="col-span-1"
              description="Fast shipping and 24/7 customer support"
              Icon={Package}
              href={ctaLink}
              cta="Learn More"
              background={<GradientBg className="from-blue-500/10 to-cyan-500/10" />}
            />
          </BentoGrid>
        </motion.div>

        {/* Bottom Trust Badges - MOBILE STACKED */}
        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-12 md:mt-16"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Join thousands of satisfied customers
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              <Badge variant="outline" className="text-xs md:text-sm">✓ Free Shipping</Badge>
              <Badge variant="outline" className="text-xs md:text-sm">✓ Easy Returns</Badge>
              <Badge variant="outline" className="text-xs md:text-sm">✓ 24/7 Support</Badge>
              <Badge variant="outline" className="text-xs md:text-sm">✓ Secure Payment</Badge>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

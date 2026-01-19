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
 * Responsive: 1 col mobile → 2 col tablet → 3 col desktop
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
    <div
      className={cn(
        'absolute inset-0 bg-gradient-to-br transition-opacity opacity-60 group-hover:opacity-80',
        className
      )}
    />
  );

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24">
      {/* Animated Background Blobs - Desktop only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/4 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-4 sm:mb-6 md:mb-8"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
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
            className="inline-block mb-3 sm:mb-4 md:mb-6"
          >
            <Badge
              variant="secondary"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm md:text-base shadow-lg"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {storeName || 'Featured Collection'}
            </Badge>
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <BentoGrid className="max-w-7xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[14rem] sm:auto-rows-[16rem] md:auto-rows-[18rem] lg:auto-rows-[20rem]">
            {/* Card 1: Featured - Large */}
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

            {/* Card 2: Stats */}
            <BentoCard
              name="10K+ Customers"
              className="col-span-1"
              description="Join thousands of happy customers worldwide"
              Icon={Zap}
              href={ctaLink}
              cta="Join Now"
              background={<GradientBg className="from-green-500/10 to-emerald-500/10" />}
            />

            {/* Card 3: New Arrivals */}
            <BentoCard
              name="New Arrivals"
              className="col-span-1"
              description="Check out our latest products and collections"
              Icon={Sparkles}
              href={ctaLink}
              cta="View All"
              background={<GradientBg className="from-orange-500/10 to-red-500/10" />}
            />

            {/* Card 4: Special Offers */}
            <BentoCard
              name="Special Offers"
              className="col-span-1"
              description="Exclusive deals and limited time discounts"
              Icon={Star}
              href={ctaLink}
              cta="Shop Now"
              background={<GradientBg className="from-purple-500/10 to-pink-500/10" />}
            />

            {/* Card 5: Premium Service */}
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

        {/* Bottom Trust Badges */}
        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-8 sm:mt-10 md:mt-12 lg:mt-16"
          >
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Join thousands of satisfied customers
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3">
              {['✓ Free Shipping', '✓ Easy Returns', '✓ 24/7 Support', '✓ Secure Payment'].map(
                (badge) => (
                  <Badge key={badge} variant="outline" className="text-xs sm:text-sm">
                    {badge}
                  </Badge>
                )
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
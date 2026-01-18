'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/optimized-image';

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
 * Modern bento grid layout with animated cards
 * Features asymmetric grid with visual hierarchy
 * Inspired by Apple and modern design systems
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {logo && (
            <div className="flex justify-center mb-6">
              <OptimizedImage
                src={logo}
                alt={storeName || 'Logo'}
                width={80}
                height={80}
                className="rounded-xl"
              />
            </div>
          )}

          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Featured Collection
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 max-w-7xl mx-auto"
        >
          {/* Large Featured Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-7 md:row-span-2 group"
          >
            <div className="relative h-[400px] md:h-full rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-blue-500/10 border border-border/50 p-8 md:p-12 flex flex-col justify-end">
              {backgroundImage && (
                <OptimizedImage
                  src={backgroundImage}
                  alt="Featured"
                  fill
                  className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="relative z-10">
                <Badge className="mb-4">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Best Seller
                </Badge>
                <h3 className="text-2xl md:text-4xl font-bold mb-2">
                  Premium Quality
                </h3>
                <p className="text-muted-foreground mb-6">
                  Discover our most popular products with exclusive features
                </p>
                {showCta && (
                  <Button size="lg" asChild className="group/btn">
                    <Link href={ctaLink}>
                      {ctaText}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-5 group"
          >
            <div className="h-[200px] md:h-full rounded-3xl overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-border/50 p-6 md:p-8 flex flex-col justify-center">
              <Zap className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-3xl md:text-5xl font-bold mb-2">10K+</h3>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-3 group"
          >
            <div className="h-[200px] rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-border/50 p-6 flex flex-col justify-center items-center text-center hover:scale-105 transition-transform cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-1">New Arrivals</h4>
              <p className="text-sm text-muted-foreground">Check out latest</p>
            </div>
          </motion.div>

          {/* Image Grid Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 group"
          >
            <div className="h-[200px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-border/50 p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎁</span>
                </div>
                <p className="text-sm font-medium">Special Offers</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Join thousands of satisfied customers
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline">Free Shipping</Badge>
              <Badge variant="outline">Easy Returns</Badge>
              <Badge variant="outline">24/7 Support</Badge>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
